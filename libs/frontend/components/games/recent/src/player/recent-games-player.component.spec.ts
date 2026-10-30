import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { IS_MOBILE } from '@app/frontend-utils';
import { Game } from '@app/models';
import { TranslateModule } from '@ngx-translate/core';
import { Card } from 'primeng/card';
import { SelectButton } from 'primeng/selectbutton';
import { Tag } from 'primeng/tag';
import { RecentGamesPlayerComponent } from './recent-games-player.component';
import { PlayerRecentGamesService } from './recent-games-player.service';

jest.mock('./recent-games-player.service');

describe('RecentGamesPlayerComponent indicators', () => {
  let fixture: ComponentFixture<RecentGamesPlayerComponent>;
  const games = signal<Game[]>([]);
  const loading = signal(false);
  const loadingMore = signal(false);
  const hasMore = signal(false);

  beforeEach(async () => {
    games.set([]);
    loading.set(false);
    loadingMore.set(false);
    hasMore.set(false);
    (PlayerRecentGamesService as jest.Mock).mockImplementation(() => ({
      games,
      loading,
      loadingMore,
      hasMore,
      counts: signal({ total: 1, singles: 1, doubles: 0, mixed: 0 }),
      setPageSize: jest.fn(),
      filter: { patchValue: jest.fn() },
    }));

    await TestBed.configureTestingModule({
      imports: [RecentGamesPlayerComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: IS_MOBILE, useValue: signal(true) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentGamesPlayerComponent);
    fixture.componentRef.setInput('for', 'current-player');
  });

  it('renders six native initial placeholders in a named busy section, then removes them', () => {
    loading.set(true);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section[aria-busy="true"]');
    expect(section.getAttribute('aria-labelledby')).toBe(fixture.nativeElement.querySelector('h2').id);
    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(6);
    expect(section.querySelectorAll('p-skeleton[aria-hidden="true"]')).toHaveLength(30);
    expect(section.querySelectorAll('a, button, [tabindex]')).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('.g-card')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('all.game.recent.noGamesFound');

    loading.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-busy]')).toBeNull();
    expect(fixture.nativeElement.querySelector('p-skeleton')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('all.game.recent.noGamesFound');
  });

  it('appends three native placeholders while retaining games and the loading button', () => {
    games.set([{ id: 'single', gameType: 'S' } as Game]);
    loadingMore.set(true);
    hasMore.set(true);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section[aria-busy="true"]');
    expect(section.querySelectorAll('p-card')).toHaveLength(3);
    expect(section.querySelectorAll('p-skeleton[aria-hidden="true"]')).toHaveLength(15);
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('p-button button').disabled).toBe(true);
    expect(fixture.debugElement.query(By.directive(SelectButton))).not.toBeNull();

    loadingMore.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-busy]')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('p-button button').disabled).toBe(false);
  });

  it('uses the same compact card, visible date rail and content grid as upcoming games', () => {
    games.set([{
      id: 'single', gameType: 'S', playedAt: '2026-10-17T19:00:00',
    } as Game]);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('p-card');
    expect(card.classList.contains('border-surface')).toBe(true);
    expect(card.querySelector('.p-card-body').classList.contains('p-0!')).toBe(true);
    expect(card.querySelector('article').classList.contains('sm:grid-cols-[72px_minmax(0,1fr)_auto]')).toBe(true);
    const date = card.querySelector('time');
    expect(date.getAttribute('datetime')).toBe('2026-10-17');
    expect(date.classList.contains('hidden')).toBe(false);
    expect(date.textContent).toContain('Oct');
  });

  it('labels the compact native filter group with the translated section heading', () => {
    games.set([{ id: 'single', gameType: 'S' } as Game]);
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h2');
    const filter = fixture.debugElement.query(By.directive(SelectButton));
    expect(heading.textContent.trim()).toBe('all.game.recent.title');
    expect(filter.nativeElement.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(filter.componentInstance.size()).toBe('small');
    expect(filter.componentInstance.allowEmpty()).toBe(false);
    expect(filter.componentInstance.options().map((option: { label: string }) => option.label)).toEqual([
      'all.game.filter.all · 1', 'all.game.filter.singles · 1',
      'all.game.filter.doubles · 0', 'all.game.filter.mixed · 0',
    ]);
  });

  it.each([1, 2])('pairs mobile player rows with scores for current-player team %s', (team) => {
    const opponent = team === 1 ? 2 : 1;
    games.set([{
      id: 'doubles', gameType: 'D',
      gamePlayerMemberships: [
        { id: 'current', team, gamePlayer: { id: 'current-player', fullName: 'Current player' } },
        { id: 'partner', team, gamePlayer: { id: 'partner', fullName: 'Current partner' } },
        { id: 'opponent', team: opponent, gamePlayer: { id: 'opponent', fullName: 'Opponent player' } },
      ],
      set1Team1: 21, set1Team2: 19,
      set2Team1: 10, set2Team2: 21,
      set3Team1: 22, set3Team2: 20,
    } as Game]);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('article') as HTMLElement;
    const ownPlayers = card.querySelector(`[data-game-side="${team}"]`);
    const otherPlayers = card.querySelector(`[data-game-side="${opponent}"]`);
    const ownScores = card.querySelector(`[data-score-side="${team}"]`);
    const otherScores = card.querySelector(`[data-score-side="${opponent}"]`);
    expect(ownPlayers?.textContent).toContain('Current player');
    expect(ownPlayers?.textContent).toContain('Current partner');
    expect(otherPlayers?.textContent).toContain('Opponent player');
    expect(ownPlayers?.classList.contains('row-start-3')).toBe(true);
    expect(ownScores?.classList.contains('row-start-3')).toBe(true);
    expect(otherPlayers?.classList.contains('row-start-5')).toBe(true);
    expect(otherScores?.classList.contains('row-start-5')).toBe(true);
    expect(Array.from(ownScores?.querySelectorAll('[data-set-score]') ?? [])
      .map(score => score.textContent?.trim())).toEqual(
      team === 1 ? ['21', '10', '22'] : ['19', '21', '20']);
    expect(card.querySelectorAll('[data-game-side]')).toHaveLength(2);
    expect(card.querySelectorAll('[data-set-score]')).toHaveLength(6);
    const versus = card.querySelector('[data-game-side] + span');
    expect(versus?.classList.contains('hidden')).toBe(true);
    expect(versus?.classList.contains('sm:block')).toBe(true);
  });

  it.each(['all', 'S', 'D', 'MX'])('preserves native %s selection and local filtering', async (type) => {
    games.set(['S', 'D', 'MX'].map(gameType => ({ id: gameType, gameType }) as Game));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const index = ['all', 'S', 'D', 'MX'].indexOf(type);
    const buttons = fixture.nativeElement.querySelectorAll('p-selectbutton [role="button"]');
    buttons[index].click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedGameType()).toBe(type);
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(type === 'all' ? 3 : 1);
    expect(buttons[index].getAttribute('aria-pressed')).toBe('true');
    buttons[index].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedGameType()).toBe(type);
  });

  it('retains filters and the empty message when a discipline has no loaded games', () => {
    games.set([{ id: 'single', gameType: 'S' } as Game]);
    fixture.componentInstance.selectGameType('MX');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(SelectButton))).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('article')).toHaveLength(0);
    expect(fixture.nativeElement.textContent).toContain('all.game.recent.noGamesFound');
  });

  it.each([true, false])('keeps the heading but hides filters with loading=%s and no games', (isLoading) => {
    loading.set(isLoading);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2')).not.toBeNull();
    expect(fixture.debugElement.query(By.directive(SelectButton))).toBeNull();
  });

  it('hides filters while previously loaded games are refreshing', () => {
    games.set([{ id: 'single', gameType: 'S' } as Game]);
    loading.set(true);
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.directive(SelectButton))).toBeNull();
  });

  it.each([
    [452, '+452', 'success'],
    [-25, '-25', 'danger'],
  ])('renders %s points as %s with native %s severity',
    (points, label, severity) => {
      games.set([{
        id: 'game', gameType: 'S',
        rankingPoints: [{ playerId: 'current-player', points }],
      } as Game]);
      fixture.detectChanges();

      const tags = fixture.debugElement.queryAll(By.directive(Tag));
      const pointTag = tags.find(tag =>
        tag.componentInstance.value() === label);
      expect(pointTag?.componentInstance.severity()).toBe(severity);
      expect(pointTag?.nativeElement.textContent).toContain(label);
      expect(pointTag?.nativeElement.hasAttribute('tabindex')).toBe(false);
    });

  it('omits zero current-player points regardless of opponent points', () => {
      games.set([{
        id: 'game', gameType: 'S',
        rankingPoints: [
          { playerId: 'opponent', points: 999 },
          { playerId: 'current-player', points: 0 },
        ],
      } as Game]);
      fixture.detectChanges();

      const tags = fixture.debugElement.queryAll(By.directive(Tag));
      expect(tags.map(tag => tag.componentInstance.value())).toEqual(['S']);
  });

  it('omits points when ranking data is missing', () => {
    games.set([{ id: 'game', gameType: 'S' } as Game]);
    fixture.detectChanges();

    const tags = fixture.debugElement.queryAll(By.directive(Tag));
    expect(tags.map(tag => tag.componentInstance.value())).toEqual(['S']);
  });

  it.each([1, 2])('preserves three-set ordering for current-player team %s', (team) => {
    games.set([{
      id: 'game', gameType: 'S',
      gamePlayerMemberships: [{ team, gamePlayer: { id: 'current-player', fullName: 'Current player' } }],
      set1Team1: 21, set1Team2: 19,
      set2Team1: 10, set2Team2: 21,
      set3Team1: 22, set3Team2: 20,
    } as Game]);
    fixture.detectChanges();

    const scores = fixture.debugElement.queryAll(By.css('[data-set-score]'));
    expect(scores.map(score => score.nativeElement.textContent.trim())).toEqual(
      team === 1 ? ['21', '10', '22', '19', '21', '20'] : ['19', '21', '20', '21', '10', '22']);
    const expectedWinners = team === 1 ? [true, false, true, false, true, false] : [false, true, false, true, false, true];
    scores.forEach((score, index) => {
      const tag = score.query(By.directive(Tag));
      expect(tag !== null).toBe(expectedWinners[index]);
      if (tag) {
        expect(tag.componentInstance.severity()).toBe('success');
        expect(tag.componentInstance.icon()).toBeUndefined();
      }
      expect(score.nativeElement.hasAttribute('tabindex')).toBe(false);
    });
  });

  it.each([
    [1, 1], [2, 2], [1, 2], [2, 1], [1, undefined], [undefined, 1],
  ])('omits result icons for team %s and winner %s', (team, winner) => {
    games.set([{
      id: 'game', gameType: 'S', winner,
      gamePlayerMemberships: team ? [{ team, gamePlayer: { id: 'current-player' } }] : [],
    } as Game]);
    fixture.detectChanges();

    const result = fixture.debugElement.query(By.css('article [data-game-result]'));
    expect(result).toBeNull();
    expect(fixture.debugElement.queryAll(By.css('article .pi'))).toHaveLength(0);
    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(1);
    expect(fixture.debugElement.queryAll(By.css('article > div:nth-last-child(2) p-tag'))).toHaveLength(0);
  });

  it.each([
    [{ set1Team1: 21, set1Team2: 0, set2Team1: 0, set2Team2: 0 }, ['21', '0'], ['success']],
    [{ set1Team1: 12, set1Team2: 12 }, ['12', '12'], []],
    [{ set1Team1: 21 }, [], []],
  ])('preserves played zero, tied, and incomplete score behavior: %j', (sets, values, severities) => {
    games.set([{ id: 'game', gameType: 'S', ...sets } as Game]);
    fixture.detectChanges();

    const scores = fixture.debugElement.queryAll(By.css('[data-set-score]'));
    expect(scores.map(score => score.nativeElement.textContent.trim())).toEqual(values);
    const tags = fixture.debugElement.queryAll(By.css('[data-set-score] p-tag'));
    expect(tags.map(tag => tag.componentInstance.severity())).toEqual(severities);
  });
});