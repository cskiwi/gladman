import { Court, Game, LocationEventMembership, TournamentDraw, TournamentEvent, TournamentScheduleSlot } from '@app/models';
import { DataSource, In, IsNull, SelectQueryBuilder } from 'typeorm';
import { TournamentScheduleReadResolver } from './tournament-schedule-read.resolver';

describe('Scheduling read prerequisite', () => {
  const resolver = new TournamentScheduleReadResolver();

  afterEach(() => jest.restoreAllMocks());

  it('scopes slots by tournament and optional court with existing ordering', async () => {
    const find = jest.spyOn(TournamentScheduleSlot, 'find').mockResolvedValue([]);
    await resolver.tournamentSchedule('safe-tournament', undefined, 'safe-court');
    expect(find).toHaveBeenLastCalledWith({
      where: { tournamentEventId: 'safe-tournament', courtId: 'safe-court' },
      order: { startTime: 'ASC', order: 'ASC' },
    });
    await resolver.tournamentSchedule('safe-other');
    expect(find.mock.lastCall?.[0]?.where).toEqual({ tournamentEventId: 'safe-other' });
  });

  it('preserves local-day filtering including both boundaries', async () => {
    const dates = [new Date(2026, 10, 8, 23, 59, 59, 999), new Date(2026, 10, 9), new Date(2026, 10, 9, 23, 59, 59, 999), new Date(2026, 10, 10)];
    const slots = dates.map((startTime, index) => Object.assign(new TournamentScheduleSlot(), { id: `safe-${index}`, startTime }));
    jest.spyOn(TournamentScheduleSlot, 'find').mockResolvedValue(slots);
    expect(await resolver.tournamentSchedule('safe-tournament', new Date(2026, 10, 9, 12))).toEqual(slots.slice(1, 3));
  });

  it('rejects a missing tournament rather than claiming there are no unscheduled games', async () => {
    jest.spyOn(TournamentEvent, 'findOne').mockResolvedValue(null);
    await expect(resolver.unscheduledGames('safe-missing')).rejects.toThrow('not found');
  });

  it.each([{ drawIds: [] }, { drawIds: ['safe-draw-one', 'safe-draw-two'] }])('scopes unscheduled games to $drawIds', async ({ drawIds }) => {
    jest.spyOn(TournamentEvent, 'findOne').mockResolvedValue(Object.assign(new TournamentEvent(), { id: 'safe-tournament' }));
    const builder = new SelectQueryBuilder<TournamentDraw>(new DataSource({ type: 'postgres' }));
    jest.spyOn(builder, 'innerJoin').mockReturnValue(builder);
    const where = jest.spyOn(builder, 'where').mockReturnValue(builder);
    jest.spyOn(builder, 'getMany').mockResolvedValue(drawIds.map((id) => Object.assign(new TournamentDraw(), { id })));
    jest.spyOn(TournamentDraw, 'createQueryBuilder').mockReturnValue(builder);
    const find = jest.spyOn(Game, 'find').mockResolvedValue([]);
    expect(await resolver.unscheduledGames('safe-tournament')).toEqual([]);
    expect(where).toHaveBeenCalledWith('subEvent.eventId = :eventId', { eventId: 'safe-tournament' });
    if (drawIds.length === 0) {
      expect(find).not.toHaveBeenCalled();
    } else {
      expect(find).toHaveBeenCalledWith({
        where: { linkId: In(drawIds), linkType: 'tournament', scheduleSlotId: IsNull() },
        order: { round: 'ASC', order: 'ASC' },
      });
    }
  });

  it('reads courts from active event memberships across venues without duplicate IDs', async () => {
    const memberships = ['safe-venue-one', 'safe-venue-two', 'safe-venue-one'].map((locationId) =>
      Object.assign(new LocationEventMembership(), { locationId }),
    );
    const membershipFind = jest.spyOn(LocationEventMembership, 'find').mockResolvedValue(memberships);
    const courts = [Object.assign(new Court(), { id: 'safe-court' })];
    const courtFind = jest.spyOn(Court, 'find').mockResolvedValue(courts);
    expect(await resolver.tournamentScheduleCourts('safe-tournament')).toEqual(courts);
    expect(membershipFind).toHaveBeenCalledWith({ where: { eventId: 'safe-tournament', isActive: true } });
    expect(courtFind).toHaveBeenCalledWith({
      where: { locationId: In(['safe-venue-one', 'safe-venue-two']) },
      order: { name: 'ASC', id: 'ASC' },
    });
  });

  it('does not accidentally read all courts when no active venue is assigned', async () => {
    jest.spyOn(LocationEventMembership, 'find').mockResolvedValue([]);
    const find = jest.spyOn(Court, 'find');
    expect(await resolver.tournamentScheduleCourts('safe-tournament')).toEqual([]);
    expect(find).not.toHaveBeenCalled();
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

  it('propagates database failures for slots and venue reads', async () => {
    jest.spyOn(TournamentScheduleSlot, 'find').mockRejectedValue(new Error('Safe slot failure'));
    jest.spyOn(LocationEventMembership, 'find').mockRejectedValue(new Error('Safe venue failure'));
    await expect(resolver.tournamentSchedule('safe-tournament')).rejects.toThrow('Safe slot failure');
    await expect(resolver.tournamentScheduleCourts('safe-tournament')).rejects.toThrow('Safe venue failure');
  });
});
