import { Court, Game, TournamentEvent, TournamentScheduleSlot } from '@app/models';
import { TournamentScheduleReadResolver } from './tournament-schedule-read.resolver';

jest.mock('../../../args', () => ({ TournamentScheduleSlotArgs: { toFindManyOptions: (args: unknown) => ({ args }) } }));

describe('Scheduling read prerequisite', () => {
  const resolver = new TournamentScheduleReadResolver();

  afterEach(() => jest.restoreAllMocks());

  it('reads slots through the generic args with the supplied where/order', async () => {
    const find = jest.spyOn(TournamentScheduleSlot, 'find').mockResolvedValue([]);
    const inputArgs = {
      where: [{ tournamentEventId: { eq: 'safe-tournament' } }],
      order: { startTime: 'ASC' },
    } as unknown as Parameters<TournamentScheduleReadResolver['tournamentScheduleSlots']>[0];

    expect(await resolver.tournamentScheduleSlots(inputArgs)).toEqual([]);
    expect(find).toHaveBeenCalledTimes(1);
    expect(find).toHaveBeenCalledWith({ args: inputArgs });
  });

  it('resolves related court/game/tournament and keeps unassigned relations nullable', async () => {
    const slot = Object.assign(new TournamentScheduleSlot(), { courtId: 'safe-court', gameId: 'safe-game', tournamentEventId: 'safe-tournament' });
    const court = jest.spyOn(Court, 'findOne').mockResolvedValue(null);
    const game = jest.spyOn(Game, 'findOne').mockResolvedValue(null);
    const event = jest.spyOn(TournamentEvent, 'findOne').mockResolvedValue(null);
    await resolver.court(slot);
    await resolver.game(slot);
    await resolver.tournamentEvent(slot);
    expect(court).toHaveBeenCalledWith({ where: { id: 'safe-court' } });
    expect(game).toHaveBeenCalledWith({ where: { id: 'safe-game' } });
    expect(event).toHaveBeenCalledWith({ where: { id: 'safe-tournament' } });
    expect(await resolver.game(new TournamentScheduleSlot())).toBeNull();
    expect(game).toHaveBeenCalledTimes(1);
  });

  it('propagates database failures for slot reads', async () => {
    jest.spyOn(TournamentScheduleSlot, 'find').mockRejectedValue(new Error('Safe slot failure'));
    await expect(resolver.tournamentScheduleSlots(undefined)).rejects.toThrow('Safe slot failure');
  });
});
