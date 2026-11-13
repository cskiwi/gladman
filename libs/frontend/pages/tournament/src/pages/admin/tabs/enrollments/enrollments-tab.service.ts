import { computed, inject, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { Player, TournamentEnrollment } from '@app/models';
import { EnrollmentStatus } from '@app/models-enum';
import { Apollo, gql } from 'apollo-angular';
import { lastValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  MANUAL_PLAYER_SEARCH_LIMIT,
  MANUAL_PLAYER_SEARCH_MAX_LENGTH,
  MANUAL_PLAYER_SEARCH_MIN_LENGTH,
  MANUAL_PLAYER_SEARCH_SERVER_WORDS,
  buildPlayerSearchWhere,
  matchesSearchWords,
  searchWords,
} from './enrollments-tab.util';

export type ManualEnrollmentPlayer = Pick<Player, 'id' | 'fullName' | 'memberId'>;
export type ManualEnrollmentInput = {
  tournamentSubEventId: string;
  preferredPartnerId?: string;
  notes?: string;
} & ({ playerId: string } | { guestName: string; guestEmail: string });

export class EnrollmentsTabService {
  private readonly apollo = inject(Apollo);
  private readonly translate = inject(TranslateService);

  filter = new FormGroup({
    subEventId: new FormControl<string | null>(null),
    status: new FormControl<EnrollmentStatus | null>(null),
    search: new FormControl<string>(''),
  });

  private readonly filterSignal = toSignal(this.filter.valueChanges, { initialValue: this.filter.getRawValue() });
  private readonly queryFilter = computed(() => ({ subEventId: this.filterSignal().subEventId, status: this.filterSignal().status }), {
    equal: (previous, next) => previous.subEventId === next.subEventId && previous.status === next.status,
  });

  readonly updating = signal(false);
  readonly updateError = signal<string | null>(null);
  readonly creating = signal(false);
  readonly creationError = signal<string | null>(null);

  /** Search the mounted application's player API, returning selectable identities. */
  async searchPlayers(search: string): Promise<ManualEnrollmentPlayer[]> {
    const query = search.trim();
    if (query.length > MANUAL_PLAYER_SEARCH_MAX_LENGTH) {
      throw new Error(`Player search must not exceed ${MANUAL_PLAYER_SEARCH_MAX_LENGTH} characters`);
    }
    if (query.length < MANUAL_PLAYER_SEARCH_MIN_LENGTH) return [];
    const words = searchWords(query);
    const needsClientFilter = words.length > MANUAL_PLAYER_SEARCH_SERVER_WORDS;
    const result = await lastValueFrom(
      this.apollo.query<{ players: ManualEnrollmentPlayer[] }>({
        query: gql`
          query ManualEnrollmentPlayers($args: PlayerArgs) {
            players(args: $args) {
              id
              fullName
              firstName
              lastName
              memberId
            }
          }
        `,
        variables: {
          args: {
            where: buildPlayerSearchWhere(words),
            order: { lastName: 'ASC', firstName: 'ASC' },
            take: needsClientFilter ? 200 : MANUAL_PLAYER_SEARCH_LIMIT,
          },
        },
        fetchPolicy: 'network-only',
      }),
    );
    if (!Array.isArray(result.data?.players)) {
      throw new Error(this.translate.instant('all.tournament.admin.enrollments.playerSearchNoData'));
    }
    const players = needsClientFilter ? result.data.players.filter((player) => matchesSearchWords(player, words)) : result.data.players;
    return players.slice(0, MANUAL_PLAYER_SEARCH_LIMIT);
  }

  /** Create an enrollment, reporting failures rather than closing the dialog as success. */
  async createManualEnrollment(input: ManualEnrollmentInput): Promise<boolean> {
    if (this.creating()) return false;
    this.creating.set(true);
    this.creationError.set(null);
    const isMember = 'playerId' in input;
    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ adminEnrollPlayer?: TournamentEnrollment; enrollGuest?: TournamentEnrollment }>({
          mutation: isMember
            ? gql`
                mutation AdminEnrollPlayer($input: AdminEnrollPlayerInput!) {
                  adminEnrollPlayer(input: $input) {
                    id
                    status
                  }
                }
              `
            : gql`
                mutation AdminEnrollGuest($input: EnrollGuestInput!) {
                  enrollGuest(input: $input) {
                    id
                    status
                  }
                }
              `,
          variables: { input },
        }),
      );
      const enrollment = isMember ? result.data?.adminEnrollPlayer : result.data?.enrollGuest;
      if (!enrollment?.id) {
        throw new Error(this.translate.instant('all.tournament.admin.enrollments.creationNoData'));
      }
      this.refetch();
      return true;
    } catch (error) {
      this.creationError.set(error instanceof Error ? error.message : this.translate.instant('all.tournament.admin.enrollments.creationFailed'));
      return false;
    } finally {
      this.creating.set(false);
    }
  }

  private enrollmentsResource = resource({
    params: () => (this.queryFilter().subEventId ? this.queryFilter() : undefined),
    loader: async ({ params, abortSignal }) => {
      if (!params.subEventId) {
        return [];
      }

      const result = await lastValueFrom(
        this.apollo.query<{ tournamentEnrollments: TournamentEnrollment[] }>({
          query: gql`
            query SubEventEnrollments($args: TournamentEnrollmentArgs) {
              tournamentEnrollments(args: $args) {
                id
                status
                waitingListPosition
                notes
                isGuest
                guestName
                guestEmail
                guestPhone
                createdAt
                player {
                  id
                  firstName
                  lastName
                  fullName
                  memberId
                }
                preferredPartner {
                  id
                  firstName
                  lastName
                  fullName
                }
                confirmedPartner {
                  id
                  firstName
                  lastName
                  fullName
                }
              }
            }
          `,
          variables: {
            args: {
              where: [{ tournamentSubEventId: { eq: params.subEventId }, ...(params.status ? { status: { eq: params.status } } : {}) }],
              order: { createdAt: 'ASC' },
            },
          },
          context: { signal: abortSignal },
          fetchPolicy: 'network-only',
        }),
      );

      if (!Array.isArray(result.data?.tournamentEnrollments)) {
        throw new Error(this.translate.instant('all.tournament.admin.enrollments.queryNoData'));
      }
      return result.data.tournamentEnrollments;
    },
  });

  // Public selectors
  private readonly enrollmentData = computed(() => (this.enrollmentsResource.hasValue() ? this.enrollmentsResource.value() : []));

  enrollments = computed(() => {
    const enrollments = this.enrollmentData();
    const search = this.filterSignal().search?.toLowerCase() ?? '';

    if (!search) {
      return enrollments;
    }

    return enrollments.filter((e) => {
      const playerName = e.player?.fullName?.toLowerCase() ?? '';
      const guestName = e.guestName?.toLowerCase() ?? '';
      const partnerName = e.confirmedPartner?.fullName?.toLowerCase() ?? '';
      return playerName.includes(search) || guestName.includes(search) || partnerName.includes(search);
    });
  });

  loading = computed(() => this.enrollmentsResource.isLoading());
  error = computed(() => this.enrollmentsResource.error()?.message || null);

  // Stats
  stats = computed(() => {
    const all = this.enrollmentData();
    return {
      total: all.length,
      confirmed: all.filter((e) => e.status === EnrollmentStatus.CONFIRMED).length,
      pending: all.filter((e) => e.status === EnrollmentStatus.PENDING).length,
      waitingList: all.filter((e) => e.status === EnrollmentStatus.WAITING_LIST).length,
      cancelled: all.filter((e) => e.status === EnrollmentStatus.CANCELLED || e.status === EnrollmentStatus.WITHDRAWN).length,
    };
  });

  refetch() {
    this.enrollmentsResource.reload();
  }

  async cancelEnrollment(enrollmentId: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ cancelEnrollment: TournamentEnrollment }>({
          mutation: gql`
            mutation AdminCancelEnrollment($enrollmentId: ID!) {
              cancelEnrollment(enrollmentId: $enrollmentId) {
                id
                status
              }
            }
          `,
          variables: { enrollmentId },
        }),
      );

      if (result.data?.cancelEnrollment) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : this.translate.instant('all.tournament.admin.enrollments.cancelFailed'));
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async promoteFromWaitingList(enrollmentId: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ promoteFromWaitingList: TournamentEnrollment }>({
          mutation: gql`
            mutation PromoteFromWaitingList($enrollmentId: ID!) {
              promoteFromWaitingList(enrollmentId: $enrollmentId) {
                id
                status
                waitingListPosition
              }
            }
          `,
          variables: { enrollmentId },
        }),
      );

      if (result.data?.promoteFromWaitingList) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : this.translate.instant('all.tournament.admin.enrollments.promoteFailed'));
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async updateEnrollment(enrollmentId: string, data: { preferredPartnerId?: string; notes?: string }): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ updateEnrollment: TournamentEnrollment }>({
          mutation: gql`
            mutation UpdateEnrollment($enrollmentId: ID!, $input: UpdateEnrollmentInput!) {
              updateEnrollment(enrollmentId: $enrollmentId, input: $input) {
                id
                status
                preferredPartner {
                  id
                  fullName
                }
                notes
              }
            }
          `,
          variables: {
            enrollmentId,
            input: data,
          },
        }),
      );

      if (result.data?.updateEnrollment) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : 'Failed to update enrollment');
      return false;
    } finally {
      this.updating.set(false);
    }
  }
}
