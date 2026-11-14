export interface RecentFormMembership {
  team?: number | string | null;
  game?: { winner?: number | string | null } | null;
}

/**
 * Derives the W/L booleans (most recent first) from a player's recent game memberships.
 * A membership is a win when the player's team equals the game's winner.
 * Memberships without a numeric team or winner are skipped (same as the previous server-side form).
 */
export function toRecentForm(memberships: readonly RecentFormMembership[] | null | undefined, take = 5): boolean[] {
  const limit = Math.max(1, Math.min(take, 10));
  const form: boolean[] = [];
  for (const membership of memberships ?? []) {
    if (membership?.team == null || membership.game?.winner == null) {
      continue;
    }
    const team = Number(membership.team);
    const winner = Number(membership.game.winner);
    if (!Number.isFinite(team) || !Number.isFinite(winner)) {
      continue;
    }
    form.push(team === winner);
    if (form.length >= limit) {
      break;
    }
  }
  return form;
}

/** Native `GamePlayerMembershipArgs` for the played games with a winner, latest first. */
export function recentFormArgs(take = 5) {
  return {
    take: Math.max(1, Math.min(take, 10)),
    where: [
      {
        game: {
          winner: { isNull: false },
          set1Team1: { gt: 0 },
          set1Team2: { gt: 0 },
        },
      },
    ],
    order: { game: { playedAt: 'DESC' } },
  };
}
