import { Player, TournamentEnrollment, TournamentEvent, TournamentSubEvent } from '@app/models';
import { EnrollmentStatus, GameType, TournamentPhase } from '@app/models-enum';
import { validate } from 'class-validator';
import { AdminEnrollPlayerInput } from '../../../inputs/tournament-enrollment.input';
import { TournamentEnrollmentResolver } from './tournament-enrollment.resolver';

jest.mock('../../../args', () => ({ TournamentEnrollmentArgs: class {} }));

describe('Administrator manual player enrollment', () => {
  const playerId = '11111111-1111-4111-8111-111111111111';
  const subEventId = '22222222-2222-4222-8222-222222222222';
  let resolver: TournamentEnrollmentResolver;
  let actor: Player;
  let player: Player;
  let tournament: TournamentEvent;
  let subEvent: TournamentSubEvent;
  let permission: jest.SpyInstance;
  let save: jest.SpyInstance;
  let input: AdminEnrollPlayerInput;

  beforeEach(() => {
    resolver = new TournamentEnrollmentResolver();
    actor = Object.assign(new Player(), { id: 'actor' });
    player = Object.assign(new Player(), { id: playerId });
    tournament = Object.assign(new TournamentEvent(), { clubId: 'safe-club', phase: TournamentPhase.ENROLLMENT_OPEN });
    subEvent = Object.assign(new TournamentSubEvent(), { id: subEventId, tournamentEvent: tournament, gameType: GameType.S });
    input = Object.assign(new AdminEnrollPlayerInput(), { playerId, tournamentSubEventId: subEventId, notes: 'Safe notes' });
    permission = jest.spyOn(actor, 'hasAnyPermission').mockReturnValue(true);
    jest.spyOn(TournamentSubEvent, 'findOne').mockResolvedValue(subEvent);
    jest.spyOn(Player, 'findOne').mockResolvedValue(player);
    jest.spyOn(TournamentEnrollment, 'findOne').mockResolvedValue(null);
    jest.spyOn(TournamentEnrollment, 'count').mockResolvedValue(0);
    save = jest.spyOn(TournamentEnrollment.prototype, 'save').mockImplementation(async function (this: TournamentEnrollment) {
      return this;
    });
  });

  afterEach(() => jest.restoreAllMocks());

  it('enrolls the selected player, not the actor, using the administration permission set', async () => {
    const result = await resolver.adminEnrollPlayer(actor, input);
    expect(permission).toHaveBeenCalledWith(['edit-any:tournament', 'edit-any:club', 'safe-club_edit:club', 'safe-club_edit:tournament']);
    expect(result.playerId).toBe(playerId);
    expect(result.status).toBe(EnrollmentStatus.CONFIRMED);
    expect(result.notes).toBe('Safe notes');
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('denies unauthorized callers before resolving a player or saving', async () => {
    permission.mockReturnValue(false);
    await expect(resolver.adminEnrollPlayer(actor, input)).rejects.toThrow('permission');
    expect(Player.findOne).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
  });

  it('does not generate scoped permissions for a tournament without a club', async () => {
    tournament.clubId = undefined;
    await resolver.adminEnrollPlayer(actor, input);
    expect(permission).toHaveBeenCalledWith(['edit-any:tournament', 'edit-any:club']);
  });

  it.each(['sub-event', 'tournament', 'player'])('rejects a missing %s before saving', async (missing) => {
    if (missing === 'sub-event') jest.mocked(TournamentSubEvent.findOne).mockResolvedValue(null);
    if (missing === 'tournament') subEvent.tournamentEvent = undefined;
    if (missing === 'player') jest.mocked(Player.findOne).mockResolvedValue(null);
    await expect(resolver.adminEnrollPlayer(actor, input)).rejects.toThrow('not found');
    expect(save).not.toHaveBeenCalled();
  });

  it.each([TournamentPhase.DRAFT, TournamentPhase.ENROLLMENT_CLOSED, TournamentPhase.COMPLETED])('does not bypass phase %s', async (phase) => {
    tournament.phase = phase;
    await expect(resolver.adminEnrollPlayer(actor, input)).rejects.toThrow('not currently open');
    expect(save).not.toHaveBeenCalled();
  });

  it.each(['future', 'past'])('preserves the %s enrollment date guard', async (date) => {
    if (date === 'future') tournament.enrollmentOpenDate = new Date(Date.now() + 86400000);
    else tournament.enrollmentCloseDate = new Date(Date.now() - 86400000);
    await expect(resolver.adminEnrollPlayer(actor, input)).rejects.toThrow(/not started|has closed/);
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects duplicate member enrollments', async () => {
    jest.mocked(TournamentEnrollment.findOne).mockResolvedValue(new TournamentEnrollment());
    await expect(resolver.adminEnrollPlayer(actor, input)).rejects.toThrow('already enrolled');
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects self-partnering against the selected player, not the actor', async () => {
    input.preferredPartnerId = playerId;
    await expect(resolver.adminEnrollPlayer(actor, input)).rejects.toThrow('yourself');
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects an unknown preferred partner', async () => {
    input.preferredPartnerId = '33333333-3333-4333-8333-333333333333';
    jest.mocked(Player.findOne).mockResolvedValueOnce(player).mockResolvedValueOnce(null);
    await expect(resolver.adminEnrollPlayer(actor, input)).rejects.toThrow('Player with ID');
    expect(save).not.toHaveBeenCalled();
  });

  it('preserves full-event rejection and waiting-list placement', async () => {
    subEvent.maxEntries = 1;
    subEvent.waitingListEnabled = false;
    jest.mocked(TournamentEnrollment.count).mockResolvedValue(1);
    await expect(resolver.adminEnrollPlayer(actor, input)).rejects.toThrow('full');
    expect(save).not.toHaveBeenCalled();
    subEvent.waitingListEnabled = true;
    jest
      .mocked(TournamentEnrollment.findOne)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(Object.assign(new TournamentEnrollment(), { waitingListPosition: 3 }));
    const result = await resolver.adminEnrollPlayer(actor, input);
    expect(result.status).toBe(EnrollmentStatus.WAITING_LIST);
    expect(result.waitingListPosition).toBe(4);
  });

  it('retains pending status for unmatched doubles', async () => {
    subEvent.gameType = GameType.D;
    const result = await resolver.adminEnrollPlayer(actor, input);
    expect(result.status).toBe(EnrollmentStatus.PENDING);
  });

  it('validates selected IDs and inherited notes length', async () => {
    expect(await validate(input)).toEqual([]);
    input.playerId = 'not-an-id';
    input.notes = 'x'.repeat(1001);
    expect((await validate(input)).map((error) => error.property)).toEqual(expect.arrayContaining(['playerId', 'notes']));
  });
});
