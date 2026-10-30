import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { CompetitionEncounter, Game } from '@app/models';
import { TranslateModule } from '@ngx-translate/core';
import { Card } from 'primeng/card';
import { EncounterCardComponent } from './encounter-card.component';

describe('EncounterCardComponent presentation', () => {
  let fixture: ComponentFixture<EncounterCardComponent>;
  const encounter = {
    id: 'encounter',
    date: new Date(2026, 10, 7, 19, 30),
    homeTeam: {
      id: 'home', name: 'Home team',
      club: { slug: 'home-club' },
    },
    awayTeam: {
      id: 'away', name: 'Away team',
      club: { slug: 'away-club' },
    },
  } as CompetitionEncounter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncounterCardComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(EncounterCardComponent);
    fixture.componentRef.setInput('encounter', encounter);
    fixture.componentRef.setInput('variant', 'upcoming');
  });

  it('renders a native Card with full date, time and team links', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(1);
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.enc-card')).toBeNull();
    expect(Array.from(element.querySelectorAll('time:first-child span'))
      .map(span => span.textContent?.trim())).toEqual(['Sat', '07', 'Nov']);
    expect(element.querySelector('time')?.getAttribute('aria-label'))
      .toBe('Saturday, November 7, 2026');
    expect(element.textContent).toContain('19:30');
    expect(element.querySelector('time')?.getAttribute('datetime'))
      .toBe('2026-11-07');
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.map(link => link.nativeElement.textContent.trim()))
      .toEqual(['Home team', 'Away team']);
    expect(links.map(link => link.injector.get(RouterLink).urlTree?.toString()))
      .toEqual(['/clubs/home-club/teams/home', '/clubs/away-club/teams/away']);
    expect(element.querySelector('.truncate, [style]')).toBeNull();
    expect(element.querySelector('.p-card-body')?.classList.contains('p-0!'))
      .toBe(true);
  });

  it.each(['home', 'away'])('preserves translated %s context', team => {
    fixture.componentRef.setInput('perspectiveTeamIds', [team]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent)
      .toContain(`all.game.location.${team}`);
  });

  it('does not invent perspective and shows time once without it', () => {
    fixture.componentRef.setInput('perspectiveTeamIds', ['other']);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('all.game.location');
    expect(fixture.nativeElement.textContent.match(/19:30/g)).toHaveLength(1);
  });

  it('retains abbreviation and TBD fallbacks without links', () => {
    fixture.componentRef.setInput('encounter', {
      ...encounter, homeTeam: { abbreviation: 'HOME' }, awayTeam: undefined,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('HOME');
    expect(fixture.nativeElement.textContent).toContain('TBD');
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });

  it('never expands or calls a loader from the upcoming card', () => {
    const loader = jest.fn().mockResolvedValue(undefined);
    fixture.componentRef.setInput('onLoadGames', loader);
    fixture.componentRef.setInput('encounter', { ...encounter, games: [] });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('article').click();
    fixture.detectChanges();
    expect(loader).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[id^="encounter-games-"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('button, [tabindex]')).toBeNull();
  });

  it('renders played scores and a named native expansion button', () => {
    fixture.componentRef.setInput('variant', 'played');
    fixture.componentRef.setInput('encounter', {
      ...encounter, homeScore: 5, awayScore: 3, games: [],
    });
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(1);
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.enc-card, .truncate')).toBeNull();
    expect(element.querySelector('time')?.getAttribute('aria-label'))
      .toBe('Saturday, November 7, 2026');
    expect(element.querySelector('p-tag')).toBeNull();
    expect(Array.from(element.querySelectorAll('.tabular-nums > span'))
      .map(score => score.textContent?.trim())).toEqual(['5', '–', '3']);
    expect(element.querySelectorAll('.tabular-nums > .text-3xl')).toHaveLength(2);
    expect(element.querySelector('.tabular-nums')?.classList.contains('items-center'))
      .toBe(true);
    expect(element.querySelector('.tabular-nums > .text-lg')?.classList.contains('leading-none'))
      .toBe(true);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label'))
      .toBe('all.competition.games: Home team vs Away team');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    const region: HTMLElement = fixture.nativeElement.querySelector('#encounter-games-encounter');
    expect(region.id).toBe(button.getAttribute('aria-controls'));
    expect(region.hidden).toBe(true);
    button.click();
    fixture.detectChanges();
    expect(region.hidden).toBe(false);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(region.textContent).toContain('all.competition.no_games');
    button.click();
    fixture.detectChanges();
    expect(region.hidden).toBe(true);
    expect(region.textContent?.trim()).toBe('');
  });

  it.each([
    ['home', 5, 3, 'win'],
    ['home', 2, 6, 'loss'],
    ['away', 5, 3, 'loss'],
    ['away', 2, 6, 'win'],
    ['home', 4, 4, 'draw'],
  ])('preserves %s perspective for %s-%s', (team, homeScore, awayScore, result) => {
    fixture.componentRef.setInput('variant', 'played');
    fixture.componentRef.setInput('perspectiveTeamIds', [team]);
    fixture.componentRef.setInput('encounter', {
      ...encounter, homeScore, awayScore,
    });
    fixture.detectChanges();
    expect(fixture.componentInstance.result()).toBe(result);
    expect(fixture.nativeElement.textContent)
      .toContain(`all.game.location.${team}`);
    if (result !== 'draw') {
      expect(fixture.nativeElement.querySelector('.sr-only')?.textContent)
        .toContain(`all.competition.${result === 'win' ? 'won' : 'lost'}`);
    }
    const scores: NodeListOf<HTMLElement> = fixture.nativeElement
      .querySelectorAll('.tabular-nums > .text-3xl');
    expect(Array.from(scores).map(score => score.textContent?.trim()))
      .toEqual([homeScore.toString(), awayScore.toString()]);
    expect(Array.from(scores).map(score => score.classList.contains('text-color')))
      .toEqual([homeScore >= awayScore, awayScore >= homeScore]);
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('preserves played fallback scores and team metadata without expansion', () => {
    fixture.componentRef.setInput('variant', 'played');
    fixture.componentRef.setInput('encounter', {
      ...encounter, homeTeam: { abbreviation: 'HOME' }, awayTeam: undefined,
    });
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('HOME');
    expect(element.textContent).toContain('TBD');
    expect(element.textContent).toContain('19:30');
    expect(element.querySelector('a, button, [id^="encounter-games-"]')).toBeNull();
    expect(element.querySelector('p-tag')).toBeNull();
    expect(Array.from(element.querySelectorAll('.tabular-nums > span'))
      .map(score => score.textContent?.trim())).toEqual(['0', '–', '0']);
  });

  it('preserves played team routes without triggering lazy loading', () => {
    const loader = jest.fn().mockResolvedValue(undefined);
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigateByUrl')
      .mockResolvedValue(true);
    fixture.componentRef.setInput('variant', 'played');
    fixture.componentRef.setInput('onLoadGames', loader);
    fixture.detectChanges();
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.map(link => link.injector.get(RouterLink).urlTree?.toString()))
      .toEqual(['/clubs/home-club/teams/home', '/clubs/away-club/teams/away']);
    links[0].triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalled();
    expect(loader).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('button')
      .getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps lazy loading visible and uses supplied games on subsequent expansion', async () => {
    let finishLoading!: () => void;
    const loader = jest.fn(() => new Promise<void>(resolve => {
      finishLoading = resolve;
    }));
    fixture.componentRef.setInput('variant', 'played');
    fixture.componentRef.setInput('onLoadGames', loader);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(loader).toHaveBeenCalledWith('encounter');
    expect(fixture.nativeElement.querySelectorAll('p-skeleton')).toHaveLength(6);
    fixture.componentRef.setInput('encounter', { ...encounter, games: [] });
    finishLoading();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p-skeleton')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('all.competition.no_games');
    button.click();
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('preserves supplied game sorting, player links, and set scores', () => {
    const game = {
      id: 'first', order: 1, gameType: 'S', winner: 1,
      set1Team1: 21, set1Team2: 12, set2Team1: 21, set2Team2: 15,
      gamePlayerMemberships: [{
        id: 'membership', team: 1,
        gamePlayer: { id: 'player', slug: 'player-slug', fullName: 'Player Name' },
      }],
    } as Game;
    const loader = jest.fn();
    fixture.componentRef.setInput('variant', 'played');
    fixture.componentRef.setInput('onLoadGames', loader);
    fixture.componentRef.setInput('encounter', {
      ...encounter, games: [{ ...game, id: 'second', order: 2 }, game],
    });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    const cards: NodeListOf<HTMLElement> = fixture.nativeElement
      .querySelectorAll('#encounter-games-encounter article');
    expect(cards).toHaveLength(2);
    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(3);
    expect(cards[0].textContent).toContain('#1');
    expect(cards[0].querySelector('a')?.getAttribute('href')).toBe('/players/player-slug');
    expect(Array.from(cards[0].querySelectorAll('.grid-cols-2 > span'))
      .map(score => score.textContent?.trim())).toEqual(['21', '12', '21', '15']);
    expect(cards[0].querySelectorAll('.grid-cols-2 > .font-semibold')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('.g-card, .enc-expanded, p-tag')).toBeNull();
    expect(loader).not.toHaveBeenCalled();
  });

  it.each([
    ['S', 4], ['D', 5], ['MX', 6],
  ])('preserves %s player levels and both player groups', (gameType, level) => {
    const game = {
      id: 'game', gameType, winner: 2, order: 1,
      gamePlayerMemberships: [
        {
          id: 'home-player', team: 1, single: 4, double: 5, mix: 6,
          gamePlayer: { id: 'player', slug: 'player-slug', fullName: 'Home Player' },
        },
        {
          id: 'away-player', team: 2,
          gamePlayer: { id: 'opponent', fullName: 'Away Player' },
        },
      ],
    } as Game;
    fixture.componentRef.setInput('variant', 'played');
    fixture.componentRef.setInput('perspectiveTeamIds', ['away']);
    fixture.componentRef.setInput('encounter', { ...encounter, games: [game] });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    const article: HTMLElement = fixture.nativeElement
      .querySelector('#encounter-games-encounter article');
    expect(article.textContent).toContain('Home Player');
    expect(article.textContent).toContain('Away Player');
    expect(article.textContent).toContain('all.competition.won');
    expect(article.querySelectorAll('a')).toHaveLength(1);
    expect(article.querySelectorAll('app-tier-badge')).toHaveLength(1);
    expect(article.querySelector('.text-right.font-semibold')?.textContent)
      .toContain('Away Player');
    expect(fixture.componentInstance.getPlayerLevel(game, 'player')).toBe(level);
  });

  it('omits unplayed sets and preserves a played zero score', () => {
    fixture.componentRef.setInput('variant', 'played');
    fixture.componentRef.setInput('encounter', {
      ...encounter,
      games: [{
        id: 'game', set1Team1: 0, set1Team2: 0,
        set2Team1: 0, set2Team2: 21, set3Team1: null, set3Team2: 0,
      }],
    });
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    const scores: NodeListOf<HTMLElement> = fixture.nativeElement
      .querySelectorAll('#encounter-games-encounter .grid-cols-2 > span');
    expect(Array.from(scores).map(score => score.textContent?.trim()))
      .toEqual(['0', '21']);
    expect(scores[0].classList.contains('font-semibold')).toBe(false);
    expect(scores[1].classList.contains('font-semibold')).toBe(true);
  });
});
