import { computed, inject, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { Player, TournamentCheckIn, TournamentEnrollment } from '@app/models';
import { CheckInStatus } from '@app/models-enum';
import { TranslateService } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { lastValueFrom } from 'rxjs';

export interface CheckInStats {
  total: number;
  checkedIn: number;
  pending: number;
  noShow: number;
  checkInRate: number;
}

/** Outcome of a bulk check-in, derived from the requested enrollment ids and the rows the server returned. */
export interface BulkCheckInResult {
  successCount: number;
  failedCount: number;
  failedEnrollmentIds: string[];
}

export interface CheckInWithDetails extends TournamentCheckIn {
  player?: Player;
  enrollment?: TournamentEnrollment;
}

/** Same arithmetic as the removed server-side `checkInStats` query. */
export function buildCheckInStats(counts: {
  total?: number | null;
  checkedIn?: number | null;
  pending?: number | null;
  noShow?: number | null;
}): CheckInStats {
  const total = counts.total ?? 0;
  const checkedIn = counts.checkedIn ?? 0;
  return {
    total,
    checkedIn,
    pending: counts.pending ?? 0,
    noShow: counts.noShow ?? 0,
    checkInRate: total > 0 ? (checkedIn / total) * 100 : 0,
  };
}

/** Success = requested enrollments that came back checked in; everything else counts as failed (previous server semantics). */
export function buildBulkCheckInResult(enrollmentIds: string[], returned: { enrollmentId?: string | null }[]): BulkCheckInResult {
  const succeeded = new Set(returned.map((row) => row.enrollmentId));
  const failedEnrollmentIds = enrollmentIds.filter((id) => !succeeded.has(id));
  return {
    successCount: enrollmentIds.length - failedEnrollmentIds.length,
    failedCount: failedEnrollmentIds.length,
    failedEnrollmentIds,
  };
}

/** The player of a check-in is the player of its enrollment. */
export function withCheckInPlayer(checkIn: CheckInWithDetails): CheckInWithDetails {
  return { ...checkIn, player: checkIn.enrollment?.player } as CheckInWithDetails;
}

export class CheckinTabService {
  private readonly apollo = inject(Apollo);
  private readonly translate = inject(TranslateService);

  filter = new FormGroup({
    tournamentEventId: new FormControl<string | null>(null),
    status: new FormControl<CheckInStatus | null>(null),
    search: new FormControl<string>(''),
  });

  private filterSignal = toSignal(this.filter.valueChanges, { initialValue: this.filter.getRawValue() });
  private readonly queryParams = computed(
    () => ({
      tournamentEventId: this.filterSignal().tournamentEventId,
      status: this.filterSignal().status,
    }),
    { equal: (previous, current) => previous.tournamentEventId === current.tournamentEventId && previous.status === current.status },
  );

  // Loading and error states
  readonly updating = signal(false);
  readonly updateError = signal<string | null>(null);

  // Check-ins resource
  private checkInsResource = resource({
    params: this.queryParams,
    loader: async ({ params, abortSignal }) => {
      if (!params.tournamentEventId) {
        return { checkIns: [], stats: null };
      }

      const eventWhere = { tournamentEventId: { eq: params.tournamentEventId } };
      const countArgs = (status?: CheckInStatus) => ({ where: [status ? { ...eventWhere, status: { eq: status } } : eventWhere] });

      const result = await lastValueFrom(
        this.apollo.query<{
          checkIns: CheckInWithDetails[];
          total: number;
          checkedIn: number;
          pending: number;
          noShow: number;
        }>({
          query: gql`
            query TournamentCheckInData(
              $list: TournamentCheckInArgs
              $total: TournamentCheckInArgs
              $checkedIn: TournamentCheckInArgs
              $pending: TournamentCheckInArgs
              $noShow: TournamentCheckInArgs
            ) {
              checkIns: tournamentCheckIns(args: $list) {
                id
                status
                checkedInAt
                notes
                enrollment {
                  id
                  isGuest
                  guestName
                  guestEmail
                  player {
                    id
                    firstName
                    lastName
                    fullName
                    memberId
                  }
                  tournamentSubEvent {
                    id
                    name
                    gameType
                  }
                }
              }
              total: tournamentCheckInsCount(args: $total)
              checkedIn: tournamentCheckInsCount(args: $checkedIn)
              pending: tournamentCheckInsCount(args: $pending)
              noShow: tournamentCheckInsCount(args: $noShow)
            }
          `,
          variables: {
            list: {
              where: [params.status ? { ...eventWhere, status: { eq: params.status } } : eventWhere],
              order: { createdAt: 'DESC' },
            },
            total: countArgs(),
            checkedIn: countArgs(CheckInStatus.CHECKED_IN),
            pending: countArgs(CheckInStatus.PENDING),
            noShow: countArgs(CheckInStatus.NO_SHOW),
          },
          context: { signal: abortSignal },
          fetchPolicy: 'network-only',
        }),
      );

      if (!result.data?.checkIns || result.data.total == null) {
        throw new Error(this.translate.instant('all.tournament.admin.checkin.queryNoData'));
      }
      return {
        checkIns: result.data.checkIns.map(withCheckInPlayer),
        stats: buildCheckInStats(result.data),
      };
    },
  });

  // Public selectors
  checkIns = computed(() => {
    const allCheckIns = this.checkInsResource.hasValue() ? this.checkInsResource.value().checkIns : [];
    const search = this.filterSignal().search?.trim().toLowerCase() ?? '';

    if (!search) {
      return allCheckIns;
    }

    return allCheckIns.filter((c) => {
      const playerName = c.player?.fullName?.toLowerCase() ?? '';
      const guestName = c.enrollment?.guestName?.toLowerCase() ?? '';
      const memberId = c.player?.memberId?.toLowerCase() ?? '';
      return playerName.includes(search) || guestName.includes(search) || memberId.includes(search);
    });
  });

  stats = computed(() => {
    return (
      (this.checkInsResource.hasValue() ? this.checkInsResource.value().stats : null) ?? {
        total: 0,
        checkedIn: 0,
        pending: 0,
        noShow: 0,
        checkInRate: 0,
      }
    );
  });

  loading = computed(() => this.checkInsResource.isLoading());
  error = computed(() => this.checkInsResource.error()?.message || null);

  refetch() {
    this.checkInsResource.reload();
  }

  async initializeCheckIns(tournamentEventId: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ initializeCheckIns: TournamentCheckIn[] }>({
          mutation: gql`
            mutation InitializeCheckIns($tournamentEventId: ID!) {
              initializeCheckIns(tournamentEventId: $tournamentEventId) {
                id
                status
              }
            }
          `,
          variables: { tournamentEventId },
        }),
      );

      if (result.data?.initializeCheckIns) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : this.translate.instant('all.tournament.admin.checkin.initializeFailed'));
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async checkInPlayer(tournamentEventId: string, enrollmentId: string, notes?: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ checkInPlayer: TournamentCheckIn }>({
          mutation: gql`
            mutation CheckInPlayer($input: CheckInPlayerInput!) {
              checkInPlayer(input: $input) {
                id
                status
                checkedInAt
              }
            }
          `,
          variables: {
            input: { tournamentEventId, enrollmentId, notes },
          },
        }),
      );

      if (result.data?.checkInPlayer) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : this.translate.instant('all.tournament.admin.checkin.checkInFailed'));
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async markNoShow(tournamentEventId: string, enrollmentId: string, reason?: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ markNoShow: TournamentCheckIn }>({
          mutation: gql`
            mutation MarkNoShow($input: MarkNoShowInput!) {
              markNoShow(input: $input) {
                id
                status
              }
            }
          `,
          variables: {
            input: { tournamentEventId, enrollmentId, reason },
          },
        }),
      );

      if (result.data?.markNoShow) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : this.translate.instant('all.tournament.admin.checkin.noShowFailed'));
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async undoCheckIn(checkInId: string): Promise<boolean> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ undoCheckIn: TournamentCheckIn }>({
          mutation: gql`
            mutation UndoCheckIn($checkInId: ID!) {
              undoCheckIn(checkInId: $checkInId) {
                id
                status
              }
            }
          `,
          variables: { checkInId },
        }),
      );

      if (result.data?.undoCheckIn) {
        this.refetch();
        return true;
      }
      return false;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : this.translate.instant('all.tournament.admin.checkin.undoFailed'));
      return false;
    } finally {
      this.updating.set(false);
    }
  }

  async bulkCheckIn(tournamentEventId: string, enrollmentIds: string[]): Promise<BulkCheckInResult | null> {
    this.updating.set(true);
    this.updateError.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.mutate<{ bulkCheckIn: { id: string; enrollmentId: string }[] }>({
          mutation: gql`
            mutation BulkCheckIn($input: BulkCheckInInput!) {
              bulkCheckIn(input: $input) {
                id
                enrollmentId
              }
            }
          `,
          variables: {
            input: { tournamentEventId, enrollmentIds },
          },
        }),
      );

      if (result.data?.bulkCheckIn) {
        this.refetch();
        return buildBulkCheckInResult(enrollmentIds, result.data.bulkCheckIn);
      }
      return null;
    } catch (err) {
      this.updateError.set(err instanceof Error ? err.message : this.translate.instant('all.tournament.admin.checkin.bulkCheckInFailed'));
      return null;
    } finally {
      this.updating.set(false);
    }
  }
}
