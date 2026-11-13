import { recentFormArgs, toRecentForm } from './player-recent-form.util';

describe('toRecentForm', () => {
  it('marks a win when the player team equals the winner', () => {
    expect(
      toRecentForm([
        { team: 1, game: { winner: 1 } },
        { team: 2, game: { winner: 1 } },
        { team: '2', game: { winner: '2' } },
      ]),
    ).toEqual([true, false, true]);
  });

  it('skips memberships without team or winner and keeps order', () => {
    expect(
      toRecentForm([
        { team: null, game: { winner: 1 } },
        { team: 1, game: { winner: null } },
        { team: 1, game: null },
        { team: 1, game: { winner: 2 } },
      ]),
    ).toEqual([false]);
  });

  it('limits to take (max 10)', () => {
    const many = Array.from({ length: 20 }, () => ({ team: 1, game: { winner: 1 } }));
    expect(toRecentForm(many, 5)).toHaveLength(5);
    expect(toRecentForm(many, 50)).toHaveLength(10);
  });

  it('handles empty input', () => {
    expect(toRecentForm(null)).toEqual([]);
    expect(toRecentForm([])).toEqual([]);
  });
});

describe('recentFormArgs', () => {
  it('filters played games with a winner and orders latest first', () => {
    const args = recentFormArgs(5);
    expect(args.take).toBe(5);
    expect(args.where[0].game.winner).toEqual({ isNull: false });
    expect(args.order).toEqual({ game: { playedAt: 'DESC' } });
  });
});
