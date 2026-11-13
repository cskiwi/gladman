export interface PlayerGameTypeCounts {
  total: number;
  singles: number;
  doubles: number;
  mixed: number;
}

/**
 * Builds the `gamePlayerMembershipsCount` args for a player's played games of a game type.
 * A game counts as played when both set1 scores are present.
 */
export function playerGameTypeCountArgs(playerId: string, gameType: 'S' | 'D' | 'MX') {
  return {
    where: [
      {
        playerId: { eq: playerId },
        game: {
          gameType: { eq: gameType },
          set1Team1: { gt: 0 },
          set1Team2: { gt: 0 },
        },
      },
    ],
  };
}

/** Total only covers singles, doubles and mixed games (same as the previous server-side breakdown). */
export function toPlayerGameTypeCounts(
  data: { singles?: number | null; doubles?: number | null; mixed?: number | null } | null | undefined,
): PlayerGameTypeCounts {
  const singles = Number(data?.singles) || 0;
  const doubles = Number(data?.doubles) || 0;
  const mixed = Number(data?.mixed) || 0;
  return { total: singles + doubles + mixed, singles, doubles, mixed };
}
