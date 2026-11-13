import { Club, GamePlayerMembership, Player, Team, TeamPlayerMembership } from '@app/models';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { ClubResolver } from './club.resolver';

describe('Club top performer discipline records', () => {
  const resolver = new ClubResolver();
  const club = Object.assign(new Club(), { id: 'safe-club' });
  let gameQuery: SelectQueryBuilder<GamePlayerMembership>;

  beforeEach(() => {
    const source = new DataSource({ type: 'postgres' });
    const teamQuery = new SelectQueryBuilder<Team>(source);
    jest.spyOn(Team, 'createQueryBuilder').mockReturnValue(teamQuery);
    jest.spyOn(teamQuery, 'getRawMany').mockResolvedValue([{ id: 'safe-team' }]);

    const membershipQuery = new SelectQueryBuilder<TeamPlayerMembership>(source);
    jest.spyOn(TeamPlayerMembership, 'createQueryBuilder').mockReturnValue(membershipQuery);
    jest.spyOn(membershipQuery, 'getRawMany').mockResolvedValue([{ playerId: 'safe-player' }]);

    gameQuery = new SelectQueryBuilder<GamePlayerMembership>(source);
    jest.spyOn(GamePlayerMembership, 'createQueryBuilder').mockReturnValue(gameQuery);
    jest.spyOn(gameQuery, 'innerJoin').mockReturnValue(gameQuery);
    jest.spyOn(Player, 'findByIds').mockResolvedValue([Object.assign(new Player(), { id: 'safe-player' })]);
  });

  afterEach(() => jest.restoreAllMocks());

  it('returns wins / played for each discipline rather than wins / losses', async () => {
    jest.spyOn(gameQuery, 'getRawMany').mockResolvedValue([
      {
        playerId: 'safe-player',
        wins: '4',
        total: '13',
        singlesWins: '3',
        singlesTotal: '5',
        doublesWins: '0',
        doublesTotal: '3',
        mixedWins: '1',
        mixedTotal: '5',
      },
    ]);

    const results = await resolver.topPerformers(club, 2026);

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      wins: 4,
      total: 13,
      winRate: 4 / 13,
      singles: { wins: 3, total: 5 },
      doubles: { wins: 0, total: 3 },
      mixed: { wins: 1, total: 5 },
    });
    expect(gameQuery.getParameters()).toMatchObject({ seasonStart: '2026-09-01', seasonEnd: '2027-09-01' });
    expect(GamePlayerMembership.createQueryBuilder).toHaveBeenCalledTimes(1);
  });

  it('returns 0 / 0 for disciplines without completed games', async () => {
    jest.spyOn(gameQuery, 'getRawMany').mockResolvedValue([
      {
        playerId: 'safe-player',
        wins: '2',
        total: '3',
        singlesWins: '0',
        singlesTotal: '0',
        doublesWins: '2',
        doublesTotal: '3',
        mixedWins: '0',
        mixedTotal: '0',
      },
    ]);

    const [result] = await resolver.topPerformers(club, 2026);

    expect(result.singles).toEqual({ wins: 0, total: 0 });
    expect(result.doubles).toEqual({ wins: 2, total: 3 });
    expect(result.mixed).toEqual({ wins: 0, total: 0 });
  });
});
