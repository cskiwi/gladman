import { computed, inject, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { Court, Game, TournamentScheduleSlot } from '@app/models';
import { ScheduleSlotStatus, ScheduleStrategy } from '@app/models-enum';
import { TranslateService } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { lastValueFrom } from 'rxjs';
import { deriveScheduleResult, localDayRange, ScheduleResult } from './schedule-result.util';

export type { ScheduleConflict, ScheduleResult } from './schedule-result.util';

export interface ScheduleVenue {
  id: string;
  name: string;
  courts: Pick<Court, 'id' | 'name'>[];
}

export class ScheduleTabService {
  private readonly apollo = inject(Apollo);
  private readonly translate = inject(TranslateService);

  filter = new FormGroup({
    tournamentEventId: new FormControl<string | null>(null),
    date: new FormControl<Date | null>(null),
  });

  private filterSignal = toSignal(this.filter.valueChanges, { initialValue: this.filter.getRawValue() });

  // Loading and error states
  readonly updating = signal(false);
  readonly updateError = signal<string | null>(null);

  readonly venues = signal<ScheduleVenue[]>([]);
  readonly venuesLoading = signal(false);
  readonly venuesError = signal<string | null>(null);

  /** Loads every venue with its courts once, so slots can be generated for courts not yet linked to the tournament. */
  async loadVenues(): Promise<void> {
    if (this.venues().length > 0 || this.venuesLoading()) return;
    this.venuesLoading.set(true);
    this.venuesError.set(null);
    try {
      const result = await lastValueFrom(
        this.apollo.query<{ locations: { id: string; name?: string | null; courts?: { id: string; name?: string | null }[] | null }[] }>({
          query: gql`
            query ScheduleVenues {
              locations {
                id
                name
                courts {
                  id
                  name
                }
              }
            }
          `,
        }),
      );
      const venues = (result.data?.locations ?? [])
        .filter((venue) => (venue.courts?.length ?? 0) > 0)
        .map((venue) => ({
          id: venue.id,
          name: venue.name ?? venue.id,
          courts: [...(venue.courts ?? [])].map((court) => ({ id: court.id, name: court.name ?? court.id })).sort(compareCourtNames),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      this.venues.set(venues);
    } catch (err) {
      this.venuesError.set(err instanceof Error ? err.message : 'Failed to load venues');
    } finally {
      this.venuesLoading.set(false);
    }
  }

  clearUpdateError(): void {
    this.updateError.set(null);
  }

  // Schedule data resource
  private scheduleResource = resource({
    params: this.filterSignal,
    loader: async ({ params, abortSignal }) => {
      if (!params.tournamentEventId) {
        return { slots: [], courts: [], unscheduledGames: [] };
      }

      const eventId = params.tournamentEventId;
      const slotWhere: Record<string, unknown> = { tournamentEventId: { eq: eventId } };
      if (params.date) {
        slotWhere['startTime'] = { between: localDayRange(params.date) };
      }

      const result = await lastValueFrom(
        this.apollo.query<{
          slots: TournamentScheduleSlot[];
          unscheduledGames: Game[];
          memberships: { locationId: string }[];
        }>({
          query: gql`
            query TournamentScheduleData($slots: TournamentScheduleSlotArgs, $games: GameArgs, $memberships: LocationEventMembershipArgs) {
              slots: tournamentScheduleSlots(args: $slots) {
                id
                courtId
                startTime
                endTime
                status
                order
                gameId
                court {
                  id
                  name
                }
                game {
                  id
                  round
                  order
                  gamePlayerMemberships {
                    single
                    double
                    gamePlayer {
                      id
                      fullName
                    }
                  }
                  tournamentDraw {
                    id
                    name
                    tournamentSubEvent {
                      id
                      name
                      gameType
                    }
                  }
                }
              }
              unscheduledGames: games(args: $games) {
                id
                round
                order
                gamePlayerMemberships {
                  single
                  double
                  gamePlayer {
                    id
                    fullName
                  }
                }
                tournamentDraw {
                  id
                  name
                  tournamentSubEvent {
                    id
                    name
                    gameType
                  }
                }
              }
              memberships: locationEventMemberships(args: $memberships) {
                id
                locationId
              }
            }
          `,
          variables: {
            slots: { where: [slotWhere], order: { startTime: 'ASC', order: 'ASC' } },
            games: unscheduledGamesArgs(eventId),
            memberships: { where: [{ eventId: { eq: eventId }, isActive: { eq: true } }] },
          },
          context: { signal: abortSignal },
          fetchPolicy: 'network-only',
        }),
      );

      const data = result.data;
      if (!Array.isArray(data?.slots) || !Array.isArray(data?.memberships) || !Array.isArray(data?.unscheduledGames)) {
        throw new Error(this.translate.instant('all.error.genericTitle'));
      }

      // Courts of every active venue assigned to this tournament.
      const locationIds = [...new Set(data.memberships.map((membership) => membership.locationId))];
      const courts = locationIds.length > 0 ? await this.loadCourts(locationIds, abortSignal) : [];
      return {
        slots: data.slots,
        courts,
        unscheduledGames: data.unscheduledGames,
      };
    },
  });

  private async loadCourts(locationIds: string[], abortSignal?: AbortSignal): Promise<Court[]> {
    const result = await lastValueFrom(
      this.apollo.query<{ courts: Court[] }>({
        query: gql`
          query TournamentScheduleCourts($args: CourtArgs) {
            courts(args: $args) {
              id
              name
            }
          }
        `,
        variables: { args: { where: [{ locationId: { in: locationIds } }], order: { name: 'ASC' } } },
        context: { signal: abortSignal },
        fetchPolicy: 'network-only',
      }),
    );
    if (!Array.isArray(result.data?.courts)) {
      throw new Error(this.translate.instant('all.error.genericTitle'));
    }
    return result.data.courts;
  }

  // Public selectors
  slots = computed(() => (this.scheduleResource.hasValue() ? this.scheduleResource.value().slots : []));
  courts = computed(() => (this.scheduleResource.hasValue() ? this.scheduleResource.value().courts : []));
  unscheduledGames = computed(() => (this.scheduleResource.hasValue() ? this.scheduleResource.value().unscheduledGames : []));
  loading = computed(() => this.scheduleResource.isLoading());
  error = computed(() => this.scheduleResource.error()?.message || null);

  // Stats
  stats = computed(() => {
    const allSlots = this.slots();
    const unscheduled = this.unscheduledGames();

    return {
      totalSlots: allSlots.length,
      available: allSlots.filter((s) => s.status === ScheduleSlotStatus.AVAILABLE).length,
      scheduled: allSlots.filter((s) => s.status === ScheduleSlotStatus.SCHEDULED).length,
      inProgress: allSlots.filter((s) => s.status === ScheduleSlotStatus.IN_PROGRESS).length,
      blocked: allSlots.filter((s) => s.status === ScheduleSlotStatus.BLOCKED).length,
      unscheduledGames: unscheduled.length,
    };
  });

  // Group slots by time for grid display
  slotsGroupedByTime = computed(() => {
    const allSlots = this.slots();
    const grouped = new Map<string, TournamentScheduleSlot[]>();

    for (const slot of allSlots) {
      const timeKey = new Date(slot.startTime).toISOString();
      if (!grouped.has(timeKey)) {
        grouped.set(timeKey, []);
      }
      grouped.get(timeKey)?.push(slot);
    }

    // Sort by time
    const sortedEntries = Array.from(grouped.entries()).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());

    return sortedEntries.map(([time, slots]) => ({
      time: new Date(time),
      slots: slots.sort((a, b) => {
        const courtA = a.court?.name ?? '';
        const courtB = b.court?.name ?? '';
        return courtA.localeCompare(courtB);
      }),
    }));
  });

  // Get unique dates from slots for date selector
  availableDates = computed(() => {
    const allSlots = this.slots();
    const dates = new Set<string>();

    for (const slot of allSlots) {
      const date = new Date(slot.startTime);
      date.setHours(0, 0, 0, 0);
      dates.add(date.toISOString());
    }

    return Array.from(dates)
      .sort()
      .map((d) => new Date(d));
  });

  refetch() {
    this.scheduleResource.reload();
  }

  async generateTimeSlots(
    tournamentEventId: string,
    courtIds: string[],
    dates: Date[],
    startTime: string,
    endTime: string,
    slotDurationMinutes: number,
    breakMinutes: number,
  ): Promise<TournamentScheduleSlot[]> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ generateTimeSlots: TournamentScheduleSlot[] }>({
          mutation: gql`
            mutation GenerateTimeSlots($input: GenerateTimeSlotsInput!) {
              generateTimeSlots(input: $input) {
                id
                courtId
                startTime
                endTime
                status
              }
            }
          `,
          variables: {
            input: {
              tournamentEventId,
              courtIds,
              dates,
              startTime,
              endTime,
              slotDurationMinutes,
              breakMinutes,
            },
          },
        }),
      );

      this.refetch();
      return result.data?.generateTimeSlots ?? [];
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : 'Failed to generate time slots');
      return [];
    } finally {
      this.updating.set(false);
    }
  }

  async assignGameToSlot(gameId: string, slotId: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ assignGameToSlot: TournamentScheduleSlot }>({
          mutation: gql`
            mutation AssignGameToSlot($input: AssignGameToSlotInput!) {
              assignGameToSlot(input: $input) {
                id
                status
                gameId
              }
            }
          `,
          variables: {
            input: { gameId, slotId },
          },
        }),
      );

      if (result.data?.assignGameToSlot) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : 'Failed to assign game to slot');
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async removeGameFromSlot(slotId: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ removeGameFromSlot: TournamentScheduleSlot }>({
          mutation: gql`
            mutation RemoveGameFromSlot($slotId: ID!) {
              removeGameFromSlot(slotId: $slotId) {
                id
                status
                gameId
              }
            }
          `,
          variables: { slotId },
        }),
      );

      if (result.data?.removeGameFromSlot) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : 'Failed to remove game from slot');
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async blockSlot(slotId: string, reason?: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ blockScheduleSlot: TournamentScheduleSlot }>({
          mutation: gql`
            mutation BlockScheduleSlot($input: BlockSlotInput!) {
              blockScheduleSlot(input: $input) {
                id
                status
              }
            }
          `,
          variables: {
            input: { slotId, reason },
          },
        }),
      );

      if (result.data?.blockScheduleSlot) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : 'Failed to block slot');
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async unblockSlot(slotId: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ unblockScheduleSlot: TournamentScheduleSlot }>({
          mutation: gql`
            mutation UnblockScheduleSlot($slotId: ID!) {
              unblockScheduleSlot(slotId: $slotId) {
                id
                status
              }
            }
          `,
          variables: { slotId },
        }),
      );

      if (result.data?.unblockScheduleSlot) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : 'Failed to unblock slot');
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async deleteSlot(slotId: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ deleteScheduleSlot: boolean }>({
          mutation: gql`
            mutation DeleteScheduleSlot($slotId: ID!) {
              deleteScheduleSlot(slotId: $slotId)
            }
          `,
          variables: { slotId },
        }),
      );

      if (result.data?.deleteScheduleSlot) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : 'Failed to delete slot');
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async scheduleGames(
    tournamentEventId: string,
    strategy: ScheduleStrategy,
    minRestMinutes?: number,
    drawIds?: string[],
  ): Promise<ScheduleResult | null> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      // Unscheduled games before the run: the run summary is derived from them and the returned slots.
      const before = await lastValueFrom(
        this.apollo.query<{ games: Game[] }>({
          query: UNSCHEDULED_GAMES_QUERY,
          variables: { args: unscheduledGamesArgs(tournamentEventId, drawIds) },
          fetchPolicy: 'network-only',
        }),
      );

      const result = await lastValueFrom(
        this.apollo.mutate<{ scheduleGames: Pick<TournamentScheduleSlot, 'id' | 'gameId'>[] }>({
          mutation: gql`
            mutation ScheduleGames($input: ScheduleGamesInput!) {
              scheduleGames(input: $input) {
                id
                gameId
              }
            }
          `,
          variables: {
            input: {
              tournamentEventId,
              strategy,
              minRestMinutes: minRestMinutes ?? 15,
              drawIds: drawIds ?? undefined,
            },
          },
        }),
      );

      if (!result.data?.scheduleGames) {
        return null;
      }

      // The run succeeded: refresh the grid right away; the summary below is best-effort
      this.refetch();
      return deriveScheduleResult(before.data?.games ?? [], result.data.scheduleGames, await this.countAvailableSlots(tournamentEventId));
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : 'Failed to auto-schedule games');
      return null;
    } finally {
      this.updating.set(false);
    }
  }

  /** Slots still available after a scheduling run; 0 when the count cannot be loaded (summary only). */
  private async countAvailableSlots(tournamentEventId: string): Promise<number> {
    try {
      const left = await lastValueFrom(
        this.apollo.query<{ available: number }>({
          query: gql`
            query ScheduleAvailableSlots($args: TournamentScheduleSlotArgs) {
              available: tournamentScheduleSlotsCount(args: $args)
            }
          `,
          variables: {
            args: { where: [{ tournamentEventId: { eq: tournamentEventId }, status: { eq: ScheduleSlotStatus.AVAILABLE } }] },
          },
          fetchPolicy: 'network-only',
        }),
      );
      return left.data?.available ?? 0;
    } catch {
      return 0;
    }
  }

  async publishSchedule(tournamentEventId: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ publishSchedule: boolean }>({
          mutation: gql`
            mutation PublishSchedule($tournamentEventId: ID!) {
              publishSchedule(tournamentEventId: $tournamentEventId)
            }
          `,
          variables: { tournamentEventId },
        }),
      );

      if (result.data?.publishSchedule) {
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : 'Failed to publish schedule');
      return false;
    } finally {
      this.updating.set(false);
    }
  }
}

function compareCourtNames(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name, undefined, { numeric: true });
}

const UNSCHEDULED_GAMES_QUERY = gql`
  query ScheduleUnscheduledGames($args: GameArgs) {
    games(args: $args) {
      id
      gamePlayerMemberships {
        gamePlayer {
          id
          fullName
        }
      }
    }
  }
`;

/**
 * Tournament games without a schedule slot, in draw order (round, then order).
 * When `drawIds` is given (an auto-schedule run limited to some draws) only those draws are included.
 */
function unscheduledGamesArgs(tournamentEventId: string, drawIds?: string[]) {
  return {
    where: [
      {
        linkType: { eq: 'tournament' },
        scheduleSlotId: { isNull: true },
        tournamentDraw: { tournamentSubEvent: { eventId: { eq: tournamentEventId } } },
        ...(drawIds?.length ? { linkId: { in: drawIds } } : {}),
      },
    ],
    order: { round: 'ASC', order: 'ASC' },
  };
}
