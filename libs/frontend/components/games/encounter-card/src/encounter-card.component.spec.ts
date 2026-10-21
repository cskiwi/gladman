import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { CompetitionEncounter } from '@app/models';
import { TranslateModule } from '@ngx-translate/core';
import { Card } from 'primeng/card';
import { EncounterCardComponent } from './encounter-card.component';

describe('EncounterCardComponent upcoming presentation', () => {
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
    expect(fixture.nativeElement.querySelector('.enc-expanded')).toBeNull();
    expect(fixture.nativeElement.querySelector('button, [tabindex]')).toBeNull();
  });

  it('preserves the played surface, scores and expansion', () => {
    fixture.componentRef.setInput('variant', 'played');
    fixture.componentRef.setInput('encounter', {
      ...encounter, homeScore: 5, awayScore: 3, games: [],
    });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(Card))).toBeNull();
    const row = fixture.nativeElement.querySelector('.enc-card');
    expect(row.textContent).toContain('5');
    expect(row.textContent).toContain('3');
    row.querySelector('.grid').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.enc-expanded')?.textContent)
      .toContain('all.competition.no_games');
    row.querySelector('.grid').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.enc-expanded')).toBeNull();
  });
});
