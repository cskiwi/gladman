import { deriveScheduleResult, localDayRange, REST_CONFLICT_MESSAGE } from './schedule-result.util';

const game = (id: string, ...players: string[]) => ({
  id,
  gamePlayerMemberships: players.map((player) => ({ gamePlayer: { id: player, fullName: `Name ${player}` } })),
});

describe('deriveScheduleResult', () => {
  it('counts scheduled and skipped games', () => {
    const result = deriveScheduleResult([game('g1', 'a'), game('g2', 'b'), game('g3', 'c')], [{ gameId: 'g1' }, { gameId: 'g2' }], 0);
    expect(result).toEqual({ scheduledCount: 2, skippedCount: 1, conflicts: [] });
  });

  it('reports zeros when nothing was unscheduled', () => {
    expect(deriveScheduleResult([], [], 3)).toEqual({ scheduledCount: 0, skippedCount: 0, conflicts: [] });
  });

  it('reports rest conflicts for skipped games with players already scheduled while slots remain', () => {
    const result = deriveScheduleResult([game('g1', 'a', 'b'), game('g2', 'a', 'c')], [{ gameId: 'g1' }], 2);
    expect(result.skippedCount).toBe(1);
    expect(result.conflicts).toEqual([{ gameId: 'g2', playerId: 'a', playerName: 'Name a', conflictingGameIds: [], message: REST_CONFLICT_MESSAGE }]);
  });

  it('does not report conflicts when slots ran out', () => {
    expect(deriveScheduleResult([game('g1', 'a'), game('g2', 'a')], [{ gameId: 'g1' }], 0).conflicts).toEqual([]);
  });

  it('falls back to the player id when the name is missing', () => {
    const unnamed = { id: 'g2', gamePlayerMemberships: [{ gamePlayer: { id: 'a' } }] };
    expect(deriveScheduleResult([game('g1', 'a'), unnamed], [{ gameId: 'g1' }], 1).conflicts[0].playerName).toBe('a');
  });
});

describe('localDayRange', () => {
  it('spans the local day inclusively', () => {
    const [start, end] = localDayRange(new Date(2026, 10, 9, 12, 30));
    expect(start).toEqual(new Date(2026, 10, 9, 0, 0, 0, 0));
    expect(end).toEqual(new Date(2026, 10, 9, 23, 59, 59, 999));
  });
});
