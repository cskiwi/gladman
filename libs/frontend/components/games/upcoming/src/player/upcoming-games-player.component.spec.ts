import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { IS_MOBILE } from '@app/frontend-utils';
import { CompetitionEncounter } from '@app/models';
import { TranslateModule } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { UpcomingGamesPlayerComponent } from './upcoming-games-player.component';
import { PlayerUpcommingGamesService } from './upcoming-games-player.service';

jest.mock('./upcoming-games-player.service');

describe('UpcomingGamesPlayerComponent cards', () => {
  let fixture: ComponentFixture<UpcomingGamesPlayerComponent>;
  const games = signal<CompetitionEncounter[]>([]);
  const loading = signal(false);
  const teamIds = signal<string[]>([]);
  const encounter = {
    id: 'encounter', date: '2026-10-17T19:00:00',
    homeTeam: { id: 'home', name: 'Home team', club: { id: 'club-home', slug: 'home-club' } },
    awayTeam: { id: 'away', name: 'Away team', club: { id: 'club-away', slug: 'away-club' } },
    drawCompetition: {
      id: 'draw', name: 'Division A',
      competitionSubEvent: {
        id: 'sub', competitionEvent: { id: 'event', season: 2026 },
      },
    },
  } as CompetitionEncounter;

  beforeEach(async () => {
    games.set([]);
    loading.set(false);
    teamIds.set([]);
    (PlayerUpcommingGamesService as jest.Mock).mockImplementation(() => ({
      games, loading, teamIds, filter: { patchValue: jest.fn() },
    }));
    await TestBed.configureTestingModule({
      imports: [UpcomingGamesPlayerComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: IS_MOBILE, useValue: signal(false) }],
    }).compileComponents();
    fixture = TestBed.createComponent(UpcomingGamesPlayerComponent);
    fixture.componentRef.setInput('for', 'player');
  });

  it('renders native cards with dates, teams, draw and all destinations', () => {
    games.set([encounter]);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('.upcoming')).toBeNull();
    expect(fixture.nativeElement.querySelector('[style]')).toBeNull();
    const text = fixture.nativeElement.textContent;
    ['Home team', 'Away team', 'Division A', '17', '19:00'].forEach(value => {
      expect(text).toContain(value);
    });
    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.map(link => link.injector.get(RouterLink).urlTree?.toString())).toEqual([
      '/competition/event/sub-events/sub/draws/draw',
      '/clubs/home-club/teams/home', '/clubs/away-club/teams/away',
      '/competition/assembly?encounter=encounter&season=2026',
    ]);
    expect(fixture.nativeElement.querySelector('.upcoming-games__expand')).toBeNull();
    const button = fixture.debugElement.query(By.directive(Button));
    expect(button.nativeElement.textContent).toContain('all.competition.team-assembly.title');
    expect(button.nativeElement.querySelector('.pi-list')).not.toBeNull();
  });

  it('shows three games initially and reveals all games when requested', () => {
    games.set(Array.from({ length: 5 }, (_, index) => ({
      ...encounter, id: `encounter-${index}`,
    })));
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(3);
    const expandButton = fixture.nativeElement.querySelector(
      '.upcoming-games__expand button',
    ) as HTMLButtonElement;
    expect(expandButton).not.toBeNull();
    expect(expandButton.textContent).toContain('all.common.viewAll');

    expandButton?.click();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(5);
    expect(fixture.nativeElement.querySelector('.upcoming-games__expand')?.textContent)
      .toContain('all.common.viewLess');

    const collapseButton = fixture.nativeElement.querySelector(
      '.upcoming-games__expand button',
    ) as HTMLButtonElement;
    collapseButton?.click();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(3);

    const reexpandButton = fixture.nativeElement.querySelector(
      '.upcoming-games__expand button',
    ) as HTMLButtonElement;
    reexpandButton?.click();
    fixture.detectChanges();

    fixture.componentRef.setInput('for', 'another-player');
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(3);
    expect(fixture.nativeElement.querySelector('.upcoming-games__expand')?.textContent)
      .toContain('all.common.viewAll');
  });

  it.each([
    ['home', 'club-home', 'home'], ['away', 'club-away', 'away'],
  ])('preserves %s assembly parameters and location', (team, club, location) => {
    teamIds.set([team]);
    games.set([encounter]);
    fixture.detectChanges();
    expect(fixture.componentInstance.getAssemblyParams(encounter)).toEqual({
      encounter: 'encounter', team, club, season: '2026',
    });
    expect(fixture.nativeElement.textContent).toContain(`all.game.location.${location}`);
  });

  it('keeps team abbreviations and an unlinked draw when route metadata is absent', () => {
    games.set([{
      id: 'fallback', homeTeam: { abbreviation: 'HOME' },
      awayTeam: { abbreviation: 'AWAY' }, drawCompetition: { name: 'Division' },
    } as CompetitionEncounter]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('HOME');
    expect(fixture.nativeElement.textContent).toContain('AWAY');
    expect(fixture.nativeElement.textContent).toContain('Division');
    expect(fixture.nativeElement.querySelectorAll('a')).toHaveLength(0);
    expect(fixture.componentInstance.getAssemblyParams(games()[0])).toEqual({ encounter: 'fallback' });
    expect(fixture.componentInstance.isHomeGame(games()[0])).toBeNull();
  });

  it('omits home/away labels for an unmatched team', () => {
    teamIds.set(['unrelated']);
    games.set([encounter]);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).not.toContain('all.game.location.');
    expect(fixture.componentInstance.isHomeGame(encounter)).toBeNull();
  });

  it('preserves the three legacy loading placeholders and settled empty message', () => {
    loading.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.upcoming')).toHaveLength(3);
    expect(fixture.nativeElement.querySelectorAll('p-skeleton')).toHaveLength(18);
    expect(fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(0);
    loading.set(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p-skeleton')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('all.game.upcoming.noGamesFound');
  });
});