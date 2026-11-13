import { computeSeasonRecord, getMembershipReferenceDate } from './club-stats.util';

describe('club stats util', () => {
  it('counts wins, losses and draws from the side of the club', () => {
    const record = computeSeasonRecord(
      [
        { homeTeamId: 'a', homeScore: 5, awayScore: 3 },
        { homeTeamId: 'x', homeScore: 5, awayScore: 3 },
        { homeTeamId: 'a', homeScore: 4, awayScore: 4 },
        { homeTeamId: 'x', homeScore: 1, awayScore: 7 },
      ],
      ['a', 'b'],
    );

    expect(record).toEqual({ wins: 2, losses: 1, draws: 1, total: 4, winRate: 0.5 });
  });

  it('returns an empty record without encounters', () => {
    expect(computeSeasonRecord([], ['a'])).toEqual({ wins: 0, losses: 0, draws: 0, total: 0, winRate: 0 });
  });

  it('uses September 1st of the season as membership reference date', () => {
    expect(getMembershipReferenceDate(2025)).toBe(new Date('2025-09-01').toISOString());
  });
});
