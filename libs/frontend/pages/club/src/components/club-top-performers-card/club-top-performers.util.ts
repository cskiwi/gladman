export interface ClubDisciplineRecord {
  wins: number;
  total: number;
}

export interface ClubTopPerformerStats {
  playerId: string;
  wins: number;
  total: number;
  winRate: number;
  singles: ClubDisciplineRecord;
  doubles: ClubDisciplineRecord;
  mixed: ClubDisciplineRecord;
}

/** A game-player membership with the (already filtered) game it belongs to. */
export interface ClubTopPerformerGameRow {
  playerId: string;
  team?: number | null;
  game?: {
    winner?: number | null;
    gameType?: string | null;
    playedAt?: string | Date | null;
  } | null;
}

export const TOP_PERFORMERS_MAX_TAKE = 20;

export function clampTopPerformersTake(take: number | null | undefined): number {
  return Math.max(1, Math.min(take ?? 5, TOP_PERFORMERS_MAX_TAKE));
}

/** Season window: September 1st of `season` (inclusive) to September 1st of the next year (exclusive). */
export function getSeasonWindow(season: number): { start: string; end: string } {
  return { start: `${season}-09-01`, end: `${season + 1}-09-01` };
}

/**
 * Aggregates per-player win/loss records out of raw game-player memberships.
 * A game only counts when it has a winner, both set-1 scores were filtered server side, and
 * (optionally) `playedAt` lies before `endExclusive`.
 * Sorted by win rate desc, tie-break by total games desc, limited to `take` players with at least `minGames` games.
 */
export function aggregateTopPerformers(
  rows: ClubTopPerformerGameRow[],
  options: { take?: number | null; minGames?: number | null; endExclusive?: string | Date | null } = {},
): ClubTopPerformerStats[] {
  const limit = clampTopPerformersTake(options.take);
  const minGames = Math.max(1, options.minGames ?? 3);
  const endMs = options.endExclusive ? new Date(options.endExclusive).getTime() : null;

  const byPlayer = new Map<string, ClubTopPerformerStats>();

  for (const row of rows) {
    const game = row.game;
    if (!row.playerId || !game || game.winner == null) continue;
    if (endMs != null && game.playedAt != null && new Date(game.playedAt).getTime() >= endMs) continue;

    let stats = byPlayer.get(row.playerId);
    if (!stats) {
      stats = {
        playerId: row.playerId,
        wins: 0,
        total: 0,
        winRate: 0,
        singles: { wins: 0, total: 0 },
        doubles: { wins: 0, total: 0 },
        mixed: { wins: 0, total: 0 },
      };
      byPlayer.set(row.playerId, stats);
    }

    const won = row.team === game.winner;
    stats.total++;
    if (won) stats.wins++;

    const discipline = game.gameType === 'S' ? stats.singles : game.gameType === 'D' ? stats.doubles : game.gameType === 'MX' ? stats.mixed : null;
    if (discipline) {
      discipline.total++;
      if (won) discipline.wins++;
    }
  }

  return [...byPlayer.values()]
    .filter((s) => s.total >= minGames)
    .map((s) => ({ ...s, winRate: s.total > 0 ? s.wins / s.total : 0 }))
    .sort((a, b) => (b.winRate !== a.winRate ? b.winRate - a.winRate : b.total - a.total))
    .slice(0, limit);
}
