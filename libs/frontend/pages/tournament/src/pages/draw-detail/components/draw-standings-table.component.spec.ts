import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DrawStandingRow, DrawStandingsTableComponent } from './draw-standings-table.component';

describe('Draw standings presentation', () => {
  let fixture: ComponentFixture<DrawStandingsTableComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawStandingsTableComponent, TranslateModule.forRoot()],
    }).compileComponents();
    fixture = TestBed.createComponent(DrawStandingsTableComponent);
    element = fixture.nativeElement;
  });

  function render(standings: DrawStandingRow[]) {
    fixture.componentRef.setInput('standings', standings);
    fixture.detectChanges();
  }

  function cells(row = 0) {
    return Array.from(element.querySelectorAll('tbody tr')[row].querySelectorAll('td')).map((cell) => cell.textContent?.trim());
  }

  it('uses a native table and card with named section, scroll region and scoped headers', () => {
    render([{ id: 'one', position: 1, player1: { fullName: 'One' } }]);
    expect(element.querySelectorAll('p-card')).toHaveLength(1);
    expect(element.querySelectorAll('p-table')).toHaveLength(1);
    expect(element.querySelector('section')?.getAttribute('aria-labelledby')).toBe(element.querySelector('app-section-header')?.id);
    expect(element.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe('all.competition.standings');
    expect(element.querySelector('[role="region"]')?.getAttribute('tabindex')).toBe('0');
    expect(element.querySelectorAll('th[scope="col"]')).toHaveLength(8);
    expect(element.querySelector('p-card')?.classList.contains('border-surface')).toBe(true);
    expect(element.querySelector('p-table')?.classList.contains('tabular-nums')).toBe(true);
    expect(element.querySelector('table')?.classList.contains('p-datatable-scrollable-table')).toBe(true);
    expect(element.querySelectorAll('.text-right')).toHaveLength(0);
    expect(element.querySelector('[style*="--g-win"], [style*="--g-loss"]')).toBeNull();
    expect(element.querySelector('a, button')).toBeNull();
  });

  it('shows zero statistics and complete zero pairs instead of missing-value dashes', () => {
    render([{ position: 0, played: 0, won: 0, lost: 0, gamesWon: 0, gamesLost: 0, setsWon: 0, setsLost: 0, points: 0 }]);
    expect(cells()).toEqual(['0', '-', '0', '0', '0', '0 - 0', '0 - 0', '0']);
  });

  it.each([null, undefined])('renders absent or incomplete %s statistics as a single dash', (missing) => {
    render([
      {
        position: missing,
        played: missing,
        won: missing,
        lost: missing,
        gamesWon: 2,
        gamesLost: missing,
        setsWon: missing,
        setsLost: 3,
        points: missing,
      },
    ]);
    expect(cells()).toEqual(['-', '-', '-', '-', '-', '-', '-', '-']);
  });

  it('preserves incoming order and all eight values without requiring unique IDs', () => {
    render([
      { position: 4, player1: { fullName: 'Fourth' }, played: 3, won: 1, lost: 2, gamesWon: 1, gamesLost: 2, setsWon: 2, setsLost: 5, points: 1 },
      { position: 2, player1: { fullName: 'Second' }, player2: { fullName: 'Partner' } },
    ]);
    expect(cells()).toEqual(['4', 'Fourth', '3', '1', '2', '1 - 2', '2 - 5', '1']);
    expect(cells(1)[0]).toBe('2');
    expect(cells(1)[1]).toContain('Second');
    expect(cells(1)[1]).toContain('Partner');
    render([{ position: 9, player1: { fullName: 'Replacement' } }]);
    expect(element.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(cells()[1]).toBe('Replacement');
  });

  it('preserves team, named players, player-ID and unknown identity precedence', () => {
    render([
      { teamId: 'team-abcdefgh', player1: { fullName: 'Hidden' } },
      { player1: { fullName: 'First' }, player2: { fullName: 'Second' }, player1Id: 'hidden-id' },
      { player2: { fullName: 'Only second' } },
      { player1Id: 'abcdefgh-long', player2Id: 'ijklmnop-long' },
      {},
    ]);
    expect(cells()[1]).toBe('all.competition.team team-abc');
    expect(cells(1)[1]).toContain('First');
    expect(cells(1)[1]).toContain('Second');
    expect(cells(1)[1]).not.toContain('hidden-id');
    expect(cells(2)[1]).toBe('Only second');
    expect(cells(3)[1]).toContain('all.competition.player 1: abcdefgh');
    expect(cells(3)[1]).toContain('all.competition.player 2: ijklmnop');
    expect(cells(4)[1]).toBe('-');
  });

  it('preserves long names as text and renders explicit native empty feedback', () => {
    const name = '<script>not markup</script>' + 'x'.repeat(160);
    render([{ player1: { fullName: name } }]);
    expect(cells()[1]).toBe(name);
    expect(element.querySelector('script')).toBeNull();
    render([]);
    expect(element.querySelector('p-table')).not.toBeNull();
    expect(element.querySelector('tbody td[colspan="8"]')?.textContent?.trim()).toBe('all.competition.no_standings');
    expect(element.querySelector('h2')).not.toBeNull();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('reuses existing %s heading, column, fallback and empty labels', (locale) => {
    const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: { competition: Record<string, string> } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: asset });
    translate.use(locale);
    render([{ teamId: 'team-id' }, { player1Id: 'player-id' }]);
    const keys = ['position', 'player_team', 'played', 'won', 'lost', 'games', 'sets', 'points'];
    expect(element.querySelector('h2')?.textContent?.trim()).toBe(asset.competition['standings']);
    expect(Array.from(element.querySelectorAll('th')).map((header) => header.textContent?.trim())).toEqual(keys.map((key) => asset.competition[key]));
    expect(cells()[1]).toBe(`${asset.competition['team']} team-id`);
    expect(cells(1)[1]).toBe(`${asset.competition['player']} 1: player-i`);
    render([]);
    expect(element.querySelector('tbody td[colspan="8"]')?.textContent?.trim()).toBe(asset.competition['no_standings']);
  });
});
