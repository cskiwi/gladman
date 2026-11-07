import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { Game, GamePlayerMembership, Player } from '@app/models';
import { GameType } from '@app/models-enum';
import { TierBadgeComponent } from '@app/frontend-components/tier-badge';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DrawGamesComponent } from './draw-games.component';

describe('Draw games presentation', () => {
  let fixture: ComponentFixture<DrawGamesComponent>;
  let element: HTMLElement;

  const membership = (team: 1 | 2, id: string, name: string) =>
    Object.assign(new GamePlayerMembership(), {
      id: `membership-${team}-${name}`,
      team,
      single: 2,
      double: 4,
      mix: 6,
      gamePlayer: Object.defineProperty(Object.assign(new Player(), { id }), 'fullName', { value: name }),
    });

  const game = (changes: Partial<Game> = {}) =>
    Object.assign(new Game(), {
      id: 'game-one',
      round: 'Final',
      gameType: GameType.S,
      playedAt: new Date('2023-04-30T11:20:00Z'),
      winner: 1,
      set1Team1: 21,
      set1Team2: 16,
      set2Team1: 21,
      set2Team2: 10,
      gamePlayerMemberships: [membership(1, 'player-one', 'One'), membership(2, 'player-two', 'Two')],
      ...changes,
    });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawGamesComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(DrawGamesComponent);
    element = fixture.nativeElement;
  });

  function render(games: Game[]) {
    fixture.componentRef.setInput('games', games);
    fixture.detectChanges();
  }

  it('renders native grouped results, semantic metadata, date and both player destinations', () => {
    render([game()]);
    expect(element.querySelectorAll('p-card')).toHaveLength(1);
    expect(element.querySelectorAll('table')).toHaveLength(0);
    expect(element.querySelector('article')?.getAttribute('aria-label')).toBe('One vs Two');
    expect(element.querySelector('time')?.getAttribute('datetime')).toContain('2023-04-30');
    expect(element.querySelector('p-tag[severity="success"]')?.textContent).toContain('1');
    expect(element.querySelector('p-tag[severity="success"]')?.querySelector('.pi-trophy')).not.toBeNull();
    expect(element.querySelector('p-tag[severity="secondary"]')?.textContent).toBe('1');
    expect(element.textContent).toContain('Final');
    expect(element.textContent).toContain('S');
    expect(Array.from(element.querySelectorAll('[data-set-score]')).map((cell) => cell.textContent?.trim())).toEqual(['21', '21', '16', '10']);
    expect(element.querySelectorAll('[data-set-score] p-tag[severity="success"]')).toHaveLength(2);
    expect(element.querySelectorAll('[data-score-side][role="group"]')).toHaveLength(2);
    expect(element.querySelectorAll('[data-game-side]')).toHaveLength(2);
    expect(Array.from(element.querySelectorAll('a')).every((link) => link.classList.contains('no-underline'))).toBe(true);
    expect(fixture.debugElement.queryAll(By.directive(RouterLink)).map((link) => link.injector.get(RouterLink).urlTree?.toString())).toEqual([
      '/players/player-one',
      '/players/player-two',
    ]);
  });

  it('preserves three-set wins including a zero losing score and tied-set non-emphasis', () => {
    render([game({ winner: 2, set1Team1: 0, set1Team2: 21, set2Team1: 22, set2Team2: 20, set3Team1: 21, set3Team2: 21 })]);
    expect(Array.from(element.querySelectorAll('[data-set-score]')).map((cell) => cell.textContent?.trim())).toEqual([
      '0',
      '22',
      '21',
      '21',
      '20',
      '21',
    ]);
    expect(Array.from(element.querySelectorAll('[data-set-score] p-tag[severity="success"]')).map((cell) => cell.textContent?.trim())).toEqual([
      '22',
      '21',
    ]);
    expect(element.querySelector('p-tag[severity="success"]')?.textContent).toContain('2');
  });

  it('retains original set numbers and omits zero-zero, missing and incomplete sets', () => {
    render([game({ set1Team1: 0, set1Team2: 0, set3Team1: 21 })]);
    const labels = Array.from(element.querySelectorAll('[data-set-score]')).map((cell) => cell.getAttribute('aria-label'));
    expect(labels).toEqual(['all.game.common.set 2: 21 (all.competition.won)', 'all.game.common.set 2: 10']);
    expect(fixture.componentInstance.getPlayedSets(game({ set1Team1: undefined }))).toEqual([{ number: 2, team1: 21, team2: 10 }]);
  });

  it.each([1, 2] as const)('preserves a bye on missing team %s without a winner badge or score columns', (missing) => {
    render([
      game({
        set1Team1: 0,
        set1Team2: 0,
        set2Team1: 0,
        set2Team2: 0,
        gamePlayerMemberships: [membership(missing === 1 ? 2 : 1, 'remaining', 'Remaining')],
      }),
    ]);
    expect(element.querySelector('p-tag[severity="warn"]')?.textContent).toBe('Bye');
    expect(element.querySelector('p-tag[severity="warn"]')?.classList.contains('w-fit')).toBe(true);
    expect(element.querySelector('p-tag[severity="success"]')).toBeNull();
    expect(element.querySelectorAll('[data-set-score]')).toHaveLength(0);
    expect(element.textContent).toContain('Remaining');
  });

  it('preserves pending no-score games and absent metadata without inventing a bye or result', () => {
    render([
      game({
        playedAt: new Date('2099-01-01'),
        winner: 0,
        round: undefined,
        gameType: undefined,
        set1Team1: undefined,
        set1Team2: undefined,
        set2Team1: undefined,
        set2Team2: undefined,
      }),
    ]);
    expect(element.querySelector('p-tag[severity="warn"]')).toBeNull();
    expect(element.querySelector('p-tag[severity="success"]')).toBeNull();
    expect(element.querySelectorAll('[data-set-score]')).toHaveLength(0);
    expect(element.querySelectorAll('[data-game-side] a')).toHaveLength(2);
    expect(element.querySelectorAll('app-tier-badge')).toHaveLength(0);
  });

  it('preserves an undated match without a date rail or missing results', () => {
    render([game({ playedAt: undefined })]);
    expect(element.querySelector('time')).toBeNull();
    expect(element.querySelectorAll('[data-game-side] a')).toHaveLength(2);
    expect(element.querySelectorAll('[data-set-score]')).toHaveLength(4);
    expect(element.querySelectorAll('[data-set-score][aria-label]')).toHaveLength(4);
  });

  it.each([
    [GameType.S, 2],
    [GameType.D, 4],
    [GameType.MX, 6],
  ] as const)('preserves %s membership order and tier selection', (gameType, level) => {
    render([
      game({
        gameType,
        gamePlayerMemberships: [membership(1, 'first', 'First'), membership(2, 'opponent', 'Opponent'), membership(1, 'second', 'Second')],
      }),
    ]);
    expect(Array.from(element.querySelectorAll('[data-game-side] a')).map((link) => link.textContent?.trim())).toEqual([
      'First',
      'Second',
      'Opponent',
    ]);
    expect(fixture.debugElement.queryAll(By.directive(TierBadgeComponent)).map((badge) => badge.componentInstance.level())).toEqual([
      level,
      level,
      level,
    ]);
  });

  it('preserves unknown unlinked players, game ordering and the explicit empty message', () => {
    render([
      game({ id: 'first-game', round: 'First', gamePlayerMemberships: [membership(1, '', '')] }),
      game({ id: 'second-game', round: 'Second' }),
    ]);
    expect(element.querySelector('article')?.textContent).toContain('Unknown');
    expect(element.querySelector('article')?.querySelector('a')).toBeNull();
    expect(Array.from(element.querySelectorAll('article')).map((article) => article.querySelector('p-tag')?.textContent)).toEqual([
      'First',
      'Second',
    ]);
    render([]);
    expect(element.querySelectorAll('p-card')).toHaveLength(0);
    expect(element.querySelector('p-message')?.textContent).toBe('No games found for this draw');
    expect(element.querySelector('h2')?.id).toBe('draw-games-title');
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('reuses existing %s list, team and set labels', (locale) => {
    const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: { games: { gamesList: string }; competition: { team: string; won: string }; game: { common: { set: string } } } = JSON.parse(
      readFileSync(assetPath, 'utf8'),
    );
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: asset });
    translate.use(locale);
    render([game()]);
    expect(element.querySelector('h2')?.textContent).toBe(asset.games.gamesList);
    expect(element.querySelector('[data-set-score]')?.getAttribute('aria-label')).toBe(`${asset.game.common.set} 1: 21 (${asset.competition.won})`);
    expect(element.querySelector('[data-score-side]')?.getAttribute('aria-label')).toContain(`${asset.competition.team} 1`);
  });
});
