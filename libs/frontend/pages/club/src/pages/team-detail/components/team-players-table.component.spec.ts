import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TeamPlayersTableComponent } from './team-players-table.component';

describe('team roster localized presentation', () => {
  it('distinguishes ordinary membership, base registration and game-only appearances without changing stats', () => {
    const component = TestBed.runInInjectionContext(() => new TeamPlayersTableComponent());
    jest.spyOn(component, 'players').mockImplementation(
      signal([
        { id: 'regular', membershipType: 'REGULAR', isBase: true, player: { id: 'player' } },
        { id: 'reserve', membershipType: 'BACKUP' },
        { id: 'game', membershipType: 'BACKUP *', isGameOnly: true },
        { id: 'unknown', membershipType: 'OTHER' },
      ]),
    );
    jest
      .spyOn(component, 'playerStats')
      .mockImplementation(signal(new Map([['player', { played: 3, won: 2, lost: 1, encountersPlayed: 1, totalEncounters: 4 }]])));

    const rows = component.playerRows();
    expect(rows.map((row) => row.membershipLabelKey)).toEqual([
      'all.team.detail.roster.member',
      'all.team.membership.BACKUP.label',
      'all.team.detail.roster.gameOnly',
      null,
    ]);
    expect(rows[0].isBase).toBe(true);
    expect(rows[0].stats).toMatchObject({ played: 3, won: 2, lost: 1, encounterPct: 25 });
    expect(rows[0].stats.winPct).toBeCloseTo(200 / 3);
    expect(rows[2].isGameOnly).toBe(true);
    expect(rows[2].stats).toMatchObject({ played: 0, winPct: null, encounterPct: null });
    expect(rows[3].membershipType).toBe('OTHER');
  });
});
