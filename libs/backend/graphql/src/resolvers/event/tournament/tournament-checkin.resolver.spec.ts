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

  it('returns only the successfully checked-in rows from a bulk check-in', async () => {
    const existing = Object.assign(new TournamentCheckIn(), { id: 'safe-existing', status: CheckInStatus.CHECKED_IN });
    jest
      .spyOn(TournamentCheckIn, 'findOne')
      .mockResolvedValueOnce(existing)
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error('Safe database failure'));
    jest.spyOn(TournamentCheckIn.prototype, 'save').mockImplementation(async function (this: TournamentCheckIn) {
      return this;
    });
    const result = await resolver.bulkCheckIn(actor, { tournamentEventId: 'safe-tournament', enrollmentIds: ['safe-a', 'safe-b', 'safe-c'] });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(existing);
    expect(result[1]).toMatchObject({ enrollmentId: 'safe-b', status: CheckInStatus.CHECKED_IN, checkedInById: 'safe-actor' });
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
