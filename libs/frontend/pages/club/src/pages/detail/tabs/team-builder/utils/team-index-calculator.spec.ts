import { CompetitionSubEvent, Player, Team } from '@app/models';
import { DEFAULT_TEAM_BUILDER_CONFIG, TeamBuilderPlayer, TeamBuilderTeam } from '../types/team-builder.types';
import { recalculateTeam, validateTeam } from './team-index-calculator';

describe('Team builder validation messages', () => {
  const prefix = 'all.club.teamBuilder.validation.';

  function player(gender: 'M' | 'F', membershipType: 'REGULAR' | 'BACKUP' = 'REGULAR'): TeamBuilderPlayer {
    return Object.assign(new Player(), {
      firstName: 'Example',
      lastName: gender,
      gender,
      membershipType,
      rankingLastPlaces: [{ single: 4, double: 5, mix: 6 }],
      lowPerformance: false,
      lowPresence: false,
      performancePercent: 100,
      presencePercent: 100,
      isNewPlayer: false,
      isStopping: false,
    });
  }

  function team(overrides: Partial<TeamBuilderTeam> = {}): TeamBuilderTeam {
    return Object.assign(new Team(), {
      type: 'M' as const,
      players: [],
      teamIndex: 0,
      isNew: false,
      isPromoted: false,
      isDemoted: false,
      isMarkedForRemoval: false,
      standingOutcome: 'UNCHANGED' as const,
      subEventManuallyOverridden: false,
      isValid: false,
      validationErrors: [],
      ...overrides,
    });
  }

  it('preserves ordered counts, mixed gender minimums and index bounds as interpolation data', () => {
    const mixed = team({
      type: 'MX',
      players: [player('M'), player('F', 'BACKUP')],
      teamIndex: 0,
      selectedSubEvent: Object.assign(new CompetitionSubEvent(), { minBaseIndex: 1 }),
    });
    expect(validateTeam(mixed)).toEqual([
      { key: prefix + 'minPlayers', params: { min: 6, count: 1 } },
      { key: prefix + 'minMales', params: { min: 3, count: 1 } },
      { key: prefix + 'minFemales', params: { min: 3, count: 0 } },
      { key: prefix + 'minIndex', params: { index: 0, min: 1 } },
    ]);
    mixed.teamIndex = 1;
    expect(validateTeam(mixed).some((error) => error.key === prefix + 'minIndex')).toBe(false);
    mixed.selectedSubEvent = Object.assign(new CompetitionSubEvent(), { maxBaseIndex: 0 });
    expect(validateTeam(mixed).at(-1)).toEqual({ key: prefix + 'maxIndex', params: { index: 1, max: 0 } });
  });

  it('keeps backup exclusions, inclusive boundaries and named level/gender warnings', () => {
    const players = Array.from({ length: 6 }, () => player('M'));
    const valid = team({
      players: [...players, player('F', 'BACKUP'), player('F', 'BACKUP')],
      selectedSubEvent: Object.assign(new CompetitionSubEvent(), { minBaseIndex: 36, maxBaseIndex: 36, maxLevel: 4 }),
    });
    recalculateTeam(valid);
    expect(valid.teamIndex).toBe(36);
    expect(valid.isValid).toBe(true);
    expect(valid.validationErrors).toEqual([]);
    expect(valid.players.every((entry) => !entry.levelWarning)).toBe(true);
    valid.players.push(player('F'));
    valid.selectedSubEvent = Object.assign(new CompetitionSubEvent(), { maxBaseIndex: 35, maxLevel: 5 });
    recalculateTeam(valid);
    expect(valid.validationErrors).toEqual([
      { key: prefix + 'maxPlayers', params: { max: 8, count: 9 } },
      { key: prefix + 'maxIndex', params: { index: 36, max: 35 } },
      { key: prefix + 'femaleInMens', params: { count: 1 } },
      {
        key: prefix + 'playersTooStrong',
        params: {
          count: 7,
          maxLevel: 5,
          names: valid.players
            .filter((p) => p.membershipType === 'REGULAR')
            .map((p) => p.fullName)
            .join(', '),
        },
      },
    ]);
    expect(valid.players[0].levelWarning).toEqual({ key: prefix + 'playerTooStrong', params: { maxLevel: 5 } });
    expect(valid.players[6].levelWarning).toBeUndefined();
    expect(valid.isValid).toBe(false);
    expect(validateTeam(team({ type: 'F', players: [player('M')] }), { ...DEFAULT_TEAM_BUILDER_CONFIG, minPlayersPerTeam: 1 })).toEqual([
      { key: prefix + 'maleInWomens', params: { count: 1 } },
    ]);
  });
});
