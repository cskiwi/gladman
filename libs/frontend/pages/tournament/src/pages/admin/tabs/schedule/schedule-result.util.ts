export interface ScheduleConflict {
  gameId: string;
  playerId: string;
  playerName: string;
  conflictingGameIds: string[];
  message: string;
}

export interface ScheduleResult {
  scheduledCount: number;
  skippedCount: number;
  conflicts: ScheduleConflict[];
}

export interface ScheduledGameLike {
  id: string;
  gamePlayerMemberships?: { gamePlayer?: { id: string; fullName?: string | null } | null }[] | null;
}

export const REST_CONFLICT_MESSAGE = 'Player needs more rest time before next available slot';

/**
 * Rebuilds the summary of an auto-schedule run from native data (the removed server-side `ScheduleResult`):
 * the games that were unscheduled before the run, the slots the run assigned a game to and the number of slots still available.
 *
 * A skipped game only reports conflicts while slots remained, and only for players that already play in a game scheduled by this run.
 */
export function deriveScheduleResult(
  unscheduledBefore: ScheduledGameLike[],
  assignedSlots: { gameId?: string | null }[],
  availableSlotsLeft: number,
): ScheduleResult {
  const assignedGameIds = new Set(assignedSlots.map((slot) => slot.gameId).filter((id): id is string => !!id));
  const skipped = unscheduledBefore.filter((game) => !assignedGameIds.has(game.id));
  const playersWithRest = new Set(
    unscheduledBefore
      .filter((game) => assignedGameIds.has(game.id))
      .flatMap((game) => (game.gamePlayerMemberships ?? []).map((membership) => membership.gamePlayer?.id))
      .filter((id): id is string => !!id),
  );

  const conflicts: ScheduleConflict[] = [];
  if (availableSlotsLeft > 0) {
    for (const game of skipped) {
      for (const membership of game.gamePlayerMemberships ?? []) {
        const player = membership.gamePlayer;
        if (!player?.id || !playersWithRest.has(player.id)) continue;
        conflicts.push({
          gameId: game.id,
          playerId: player.id,
          playerName: player.fullName ?? player.id,
          conflictingGameIds: [],
          message: REST_CONFLICT_MESSAGE,
        });
      }
    }
  }

  return { scheduledCount: assignedSlots.length, skippedCount: skipped.length, conflicts };
}

/** Inclusive local-day bounds for a `startTime between` filter. */
export function localDayRange(date: Date): [Date, Date] {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return [start, end];
}
