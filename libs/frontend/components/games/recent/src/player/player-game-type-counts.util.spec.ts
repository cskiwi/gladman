import { playerGameTypeCountArgs, toPlayerGameTypeCounts } from './player-game-type-counts.util';

describe('player game type counts', () => {
  it('builds native count args for played games of a type', () => {
    expect(playerGameTypeCountArgs('p1', 'MX')).toEqual({
      where: [{ playerId: { eq: 'p1' }, game: { gameType: { eq: 'MX' }, set1Team1: { gt: 0 }, set1Team2: { gt: 0 } } }],
    });
  });

  it('sums singles, doubles and mixed into total', () => {
    expect(toPlayerGameTypeCounts({ singles: 3, doubles: 4, mixed: 2 })).toEqual({ total: 9, singles: 3, doubles: 4, mixed: 2 });
  });

  it('defaults missing values to zero', () => {
    expect(toPlayerGameTypeCounts(null)).toEqual({ total: 0, singles: 0, doubles: 0, mixed: 0 });
  });
});
