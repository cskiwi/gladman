export interface ClubSeasonRecord {
  wins: number;
  losses: number;
  draws: number;
  total: number;
  winRate: number;
}

export interface ClubScoredEncounter {
  homeTeamId?: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
}

/** Reference date used for membership counts: September 1st of the season, or now without a season. */
export function getMembershipReferenceDate(season?: number | null): string {
  return (season ? new Date(`${season}-09-01`) : new Date()).toISOString();
}

/**
 * Win/loss/draw record of the club's teams. Our side's score is the home score when the
 * home team belongs to the club, otherwise the away score.
 */
export function computeSeasonRecord(encounters: ClubScoredEncounter[], teamIds: Iterable<string>): ClubSeasonRecord {
  const teamSet = new Set(teamIds);
  let wins = 0;
  let losses = 0;
  let draws = 0;

  for (const enc of encounters) {
    const home = enc.homeScore ?? 0;
    const away = enc.awayScore ?? 0;
    const isHome = !!enc.homeTeamId && teamSet.has(enc.homeTeamId);
    const ourScore = isHome ? home : away;
    const theirScore = isHome ? away : home;
    if (ourScore > theirScore) wins++;
    else if (ourScore < theirScore) losses++;
    else draws++;
  }

  const total = wins + losses + draws;
  return { wins, losses, draws, total, winRate: total === 0 ? 0 : wins / total };
}
