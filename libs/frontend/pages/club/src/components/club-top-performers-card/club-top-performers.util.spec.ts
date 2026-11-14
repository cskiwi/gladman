import { aggregateTopPerformers, ClubTopPerformerGameRow } from './club-top-performers.util';

function rows(playerId: string, spec: { type: string; won: boolean }[]): ClubTopPerformerGameRow[] {
  return spec.map((s) => ({ playerId, team: 1, game: { winner: s.won ? 1 : 2, gameType: s.type } }));
}

describe('aggregateTopPerformers', () => {
  it('returns wins / played for each discipline rather than wins / losses', () => {
    const data = [
      ...rows('p', [
        ...Array(3).fill({ type: 'S', won: true }),
        ...Array(2).fill({ type: 'S', won: false }),
        ...Array(3).fill({ type: 'D', won: false }),
        { type: 'MX', won: true },
        ...Array(4).fill({ type: 'MX', won: false }),
      ]),
    ];

    const [result] = aggregateTopPerformers(data, { minGames: 2 });

    expect(result).toMatchObject({
      wins: 4,
      total: 13,
      winRate: 4 / 13,
      singles: { wins: 3, total: 5 },
      doubles: { wins: 0, total: 3 },
      mixed: { wins: 1, total: 5 },
    });
  });

  it('returns 0 / 0 for disciplines without completed games', () => {
    const [result] = aggregateTopPerformers(rows('p', [...Array(2).fill({ type: 'D', won: true }), { type: 'D', won: false }]));

    expect(result.singles).toEqual({ wins: 0, total: 0 });
    expect(result.doubles).toEqual({ wins: 2, total: 3 });
    expect(result.mixed).toEqual({ wins: 0, total: 0 });
  });

  it('filters by minGames, sorts by win rate then total and clamps take', () => {
    const data = [
      ...rows('a', Array(4).fill({ type: 'S', won: true })),
      ...rows('b', [...Array(3).fill({ type: 'S', won: true }), { type: 'S', won: false }]),
      ...rows('c', Array(3).fill({ type: 'S', won: true })),
      ...rows('d', Array(2).fill({ type: 'S', won: true })),
    ];

    expect(aggregateTopPerformers(data).map((r) => r.playerId)).toEqual(['a', 'c', 'b']);
    expect(aggregateTopPerformers(data, { take: 0 }).map((r) => r.playerId)).toEqual(['a']);
    expect(aggregateTopPerformers(data, { minGames: 1 }).map((r) => r.playerId)).toEqual(['a', 'c', 'd', 'b']);
  });

  it('ignores games without winner or on/after the exclusive end date', () => {
    const data: ClubTopPerformerGameRow[] = [
      { playerId: 'p', team: 1, game: { winner: null, gameType: 'S' } },
      { playerId: 'p', team: 1, game: { winner: 1, gameType: 'S', playedAt: '2027-09-01T00:00:00.000Z' } },
      { playerId: 'p', team: 1, game: { winner: 1, gameType: 'S', playedAt: '2027-08-31T12:00:00.000Z' } },
    ];

    const [result] = aggregateTopPerformers(data, { minGames: 1, endExclusive: '2027-09-01T00:00:00.000Z' });
    expect(result.total).toBe(1);
  });
});
