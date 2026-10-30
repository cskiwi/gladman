import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Table } from 'primeng/table';
import { PouleDrawComponent } from './poule-draw.component';

const createEntry = (id = 'entry', position = 1) => ({
  id,
  team: { name: 'Test team', club: { slug: 'test-club' } },
  standing: {
    position,
    played: 3,
    won: 2,
    lost: 1,
    gamesWon: 6,
    gamesLost: 2,
    setsWon: 13,
    setsLost: 5,
    points: 4,
    riser: false,
    faller: false,
  },
});

describe('Competition poule standings presentation', () => {
  let fixture: ComponentFixture<PouleDrawComponent>;
  let element: HTMLElement;
  let translations: TranslateService;

  const render = (entries: unknown[]) => {
    fixture.componentRef.setInput('entries', entries);
    fixture.detectChanges();
  };
  const cells = () => [...element.querySelectorAll('tbody tr:first-child td')].map((cell) => cell.textContent?.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PouleDrawComponent, TranslateModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();
    translations = TestBed.inject(TranslateService);
    translations.setTranslation('en', {
      all: {
        competition: {
          standings: 'Standings',
          position: 'Position',
          player_team: 'Team',
          played: 'Played',
          won: 'Won',
          lost: 'Lost',
          games: 'Games',
          sets: 'Sets',
          points: 'Points',
          no_standings: 'No standings',
          no_standings_description: 'Standings will appear here',
          tooltip: { riser: 'Will rise', faller: 'Will fall' },
        },
      },
    });
    translations.use('en');
    fixture = TestBed.createComponent(PouleDrawComponent);
    element = fixture.nativeElement;
    render([createEntry()]);
  });

  it('groups a native table and heading in one Card with a named region', () => {
    expect(element.querySelector('p-card h2')?.textContent).toBe('Standings');
    expect(element.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe('Standings');
    expect(fixture.debugElement.query(By.directive(Table)).injector.get(Table).pt()).toBeUndefined();
    expect([...element.querySelectorAll('thead th')].map((th) => th.textContent?.trim())).toEqual([
      'Position',
      'Team',
      'Played',
      'Won',
      'Lost',
      'Games',
      'Sets',
      'Points',
    ]);
    expect(element.querySelectorAll('thead th[scope="col"]')).toHaveLength(8);
  });

  it('names the scroll region and makes it keyboard reachable without pass-through options', () => {
    const region = element.querySelector('[role="region"]');
    expect(region?.getAttribute('tabindex')).toBe('0');
    expect(region?.getAttribute('role')).toBe('region');
    expect(region?.getAttribute('aria-label')).toBe('Standings');
  });

  it('preserves ordered numeric cells and club destinations', () => {
    render([createEntry('second', 2), createEntry('first', 1)]);
    expect(cells()).toEqual(['2', 'Test team', '3', '2', '1', '6 - 2', '13 - 5', '4']);
    expect([...element.querySelectorAll('tbody tr')].map((row) => row.querySelector('td')?.textContent?.trim())).toEqual(['2', '1']);
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/clubs/test-club');
  });

  it('keeps teams without a club slug as plain text', () => {
    const entry = createEntry();
    render([{ ...entry, team: { name: 'Unlinked team' } }]);
    expect(element.querySelector('a')).toBeNull();
    expect(cells()[1]).toBe('Unlinked team');
  });

  it('keeps the existing zero-value presentation, including the points dash', () => {
    const entry = createEntry();
    render([
      {
        ...entry,
        standing: {
          ...entry.standing,
          played: 0,
          won: 0,
          lost: 0,
          gamesWon: 0,
          gamesLost: 0,
          setsWon: 0,
          setsLost: 0,
          points: 0,
        },
      },
    ]);
    expect(cells()).toEqual(['1', 'Test team', '0', '0', '0', '0 - 0', '0 - 0', '-']);
  });

  it('preserves null-result fallbacks', () => {
    const entry = createEntry();
    render([
      {
        ...entry,
        standing: {
          ...entry.standing,
          played: null,
          won: null,
          lost: null,
          gamesWon: null,
          gamesLost: null,
          setsWon: null,
          setsLost: null,
          points: null,
        },
      },
    ]);
    expect(cells()).toEqual(['1', 'Test team', '0', '0', '0', '-', '-', '-']);
  });

  it('does not invent a team or standing when data is absent', () => {
    render([{ id: 'missing' }]);
    expect(cells()).toEqual(['', '', '0', '0', '0', '-', '-', '-']);
    expect(element.querySelector('a')).toBeNull();
    expect(element.querySelector('p-tag')).toBeNull();
  });

  it.each([
    { riser: true, faller: false, severity: 'success', icon: 'pi-arrow-up', label: 'Will rise' },
    { riser: false, faller: true, severity: 'danger', icon: 'pi-arrow-down', label: 'Will fall' },
    { riser: true, faller: true, severity: 'success', icon: 'pi-arrow-up', label: 'Will rise' },
  ])('uses a named native $severity Tag and direction icon', (status) => {
    const entry = createEntry();
    render([{ ...entry, standing: { ...entry.standing, riser: status.riser, faller: status.faller } }]);
    const tags = element.querySelectorAll('p-tag');
    expect(tags).toHaveLength(1);
    expect(tags[0].getAttribute('role')).toBe('img');
    expect(tags[0].getAttribute('aria-label')).toBe(status.label);
    expect(tags[0].classList.contains(`p-tag-${status.severity}`)).toBe(true);
    expect(tags[0].querySelector(`.${status.icon}`)).not.toBeNull();
    expect(element.querySelectorAll('tbody td')).toHaveLength(8);
  });

  it('renders the existing empty copy in a native secondary Message', () => {
    render([]);
    expect(element.querySelector('p-card h2')?.textContent).toBe('Standings');
    expect(element.querySelector('p-table')).toBeNull();
    const message = element.querySelector('p-message');
    expect(message?.textContent).toContain('No standings');
    expect(message?.textContent).toContain('Standings will appear here');
    expect(message?.querySelectorAll('.flex-col > span')).toHaveLength(2);
    expect(message?.classList.contains('p-message-secondary')).toBe(true);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses actual %s labels for table, status, and empty copy', (locale) => {
    const path = join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: {
      competition: {
        standings: string;
        no_standings: string;
        no_standings_description: string;
        tooltip: { riser: string; faller: string };
      };
    } = JSON.parse(readFileSync(path, 'utf8'));
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    const entry = createEntry();
    render([{ ...entry, standing: { ...entry.standing, riser: true } }]);
    expect(element.querySelector('p-card h2')?.textContent).toBe(asset.competition.standings);
    expect(element.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe(asset.competition.standings);
    expect(element.querySelector('p-tag')?.getAttribute('aria-label')).toBe(asset.competition.tooltip.riser);
    render([{ ...entry, standing: { ...entry.standing, faller: true } }]);
    expect(element.querySelector('p-tag')?.getAttribute('aria-label')).toBe(asset.competition.tooltip.faller);
    render([]);
    expect(element.querySelector('p-card h2')?.textContent).toBe(asset.competition.standings);
    expect(element.querySelector('p-message')?.textContent).toContain(asset.competition.no_standings);
    expect(element.querySelector('p-message')?.textContent).toContain(asset.competition.no_standings_description);
  });
});
