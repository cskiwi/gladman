import { Player, TournamentCheckIn, TournamentEnrollment, TournamentEvent, TournamentSubEvent } from '@app/models';
import { CheckInStatus, EnrollmentStatus } from '@app/models-enum';
import { TournamentCheckInResolver } from './tournament-checkin.resolver';

jest.mock('../../../args', () => ({ TournamentCheckInArgs: class {} }));

describe('Registered check-in resolver behavior', () => {
  let resolver: TournamentCheckInResolver;
  let actor: Player;

  beforeEach(() => {
    resolver = new TournamentCheckInResolver();
    actor = Object.assign(new Player(), { id: 'safe-actor' });
    jest.spyOn(actor, 'hasAnyPermission').mockReturnValue(true);
  });

  afterEach(() => jest.restoreAllMocks());

  it('reads only the requested tournament and optional status with the existing ordering', async () => {
    const find = jest.spyOn(TournamentCheckIn, 'find').mockResolvedValue([]);
    expect(await resolver.tournamentCheckInList('safe-tournament', CheckInStatus.PENDING)).toEqual([]);
    expect(find).toHaveBeenCalledWith({
      where: { tournamentEventId: 'safe-tournament', status: CheckInStatus.PENDING },
      order: { createdAt: 'DESC' },
    });
    await resolver.tournamentCheckInList('safe-tournament');
    expect(find.mock.lastCall?.[0]?.where).toEqual({ tournamentEventId: 'safe-tournament' });
  });

  it.each([
    [0, 0, 0, 0, 0],
    [12, 4, 7, 1, 100 / 3],
  ])('preserves aggregate counts and handles a zero denominator (%s total)', async (total, checkedIn, pending, noShow, rate) => {
    const count = jest.spyOn(TournamentCheckIn, 'count');
    [total, checkedIn, pending, noShow].forEach((value) => count.mockResolvedValueOnce(value));
    const result = await resolver.checkInStats('safe-tournament');
    expect(result).toMatchObject({ total, checkedIn, pending, noShow });
    expect(result.checkInRate).toBeCloseTo(rate, 10);
    expect(count.mock.calls.map(([options]) => options?.where)).toEqual([
      { tournamentEventId: 'safe-tournament' },
      { tournamentEventId: 'safe-tournament', status: CheckInStatus.CHECKED_IN },
      { tournamentEventId: 'safe-tournament', status: CheckInStatus.PENDING },
      { tournamentEventId: 'safe-tournament', status: CheckInStatus.NO_SHOW },
    ]);
  });

  it('propagates database read failures rather than returning empty success', async () => {
    jest.spyOn(TournamentCheckIn, 'find').mockRejectedValue(new Error('Safe database failure'));
    await expect(resolver.tournamentCheckInList('safe-tournament')).rejects.toThrow('Safe database failure');
  });

  it('returns an array for initialization without duplicate records; all persistence is mocked', async () => {
    jest.spyOn(TournamentEvent, 'findOne').mockResolvedValue(Object.assign(new TournamentEvent(), { id: 'safe-tournament' }));
    jest.spyOn(TournamentSubEvent, 'find').mockResolvedValue([Object.assign(new TournamentSubEvent(), { id: 'safe-sub-event' })]);
    jest
      .spyOn(TournamentEnrollment, 'find')
      .mockResolvedValue([Object.assign(new TournamentEnrollment(), { id: 'safe-enrollment', status: EnrollmentStatus.CONFIRMED })]);
    const find = jest.spyOn(TournamentCheckIn, 'findOne').mockResolvedValue(null);
    const save = jest.spyOn(TournamentCheckIn.prototype, 'save').mockImplementation(async function (this: TournamentCheckIn) {
      return this;
    });
    const result = await resolver.initializeCheckIns(actor, 'safe-tournament');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ tournamentEventId: 'safe-tournament', enrollmentId: 'safe-enrollment', status: CheckInStatus.PENDING });
    find.mockResolvedValue(result[0]);
    expect(await resolver.initializeCheckIns(actor, 'safe-tournament')).toEqual([]);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('preserves every operational permission gate before database access', async () => {
    jest.spyOn(actor, 'hasAnyPermission').mockReturnValue(false);
    const find = jest.spyOn(TournamentCheckIn, 'findOne');
    const tournament = jest.spyOn(TournamentEvent, 'findOne');
    const input = { tournamentEventId: 'safe-tournament', enrollmentId: 'safe-enrollment' };
    await expect(resolver.initializeCheckIns(actor, 'safe-tournament')).rejects.toThrow('permission');
    await expect(resolver.checkInPlayer(actor, input)).rejects.toThrow('permission');
    await expect(resolver.markNoShow(actor, input)).rejects.toThrow('permission');
    await expect(resolver.undoCheckIn(actor, 'safe-checkin')).rejects.toThrow('permission');
    await expect(resolver.bulkCheckIn(actor, { tournamentEventId: input.tournamentEventId, enrollmentIds: [input.enrollmentId] })).rejects.toThrow(
      'permission',
    );
    expect(find).not.toHaveBeenCalled();
    expect(tournament).not.toHaveBeenCalled();
  });
});
