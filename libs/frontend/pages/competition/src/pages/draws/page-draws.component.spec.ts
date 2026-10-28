import { ChangeDetectorRef, Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SyncButtonComponent } from '@app/frontend-components/sync';
import { AuthService } from '@app/frontend-modules-auth/service';
import { SeoService } from '@app/frontend-modules-seo/service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { ButtonDirective } from 'primeng/button';
import { of } from 'rxjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PageDrawsComponent } from './page-draws.component';
import { EncounterCardComponent } from '@app/frontend-components/games/encounter-card';
import { Card } from 'primeng/card';

const statisticLocales = [
  { locale: 'en', labels: ['Encounters', 'Played', 'Upcoming', 'Teams'] },
  { locale: 'nl_BE', labels: ['Ontmoetingen', 'Gespeeld', 'Komende wedstrijden', 'Teams'] },
  { locale: 'fr_BE', labels: ['Réunions', 'Joue', 'Prochains matches', 'Les équipes'] },
].map((copy) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', copy.locale, 'all.json');
  const asset: { competition: Record<string, unknown> } = JSON.parse(readFileSync(assetPath, 'utf8'));
  return { ...copy, asset };
});

const createData = () => ({
  competitionEvent: {
    id: 'competition',
    name: 'Test competition',
    slug: 'test-competition',
    visualCode: 'competition-code',
  },
  competitionSubEvent: {
    id: 'sub-event',
    name: 'First division',
    maxLevel: 3,
    eventType: 'M',
  },
  competitionDraw: {
    id: 'draw-id-12345',
    name: 'First division - A',
    type: 'POULE',
    size: 9,
    visualCode: 'draw-code',
    competitionEncounters: [],
  },
  entries: [],
});

@Component({ selector: 'app-sync-button', template: '' })
class SyncStubComponent {
  readonly config = input<unknown>();
}

describe('Competition draw hero', () => {
  let harness: RouterTestingHarness;
  let component: PageDrawsComponent;
  let element: HTMLElement;
  let data: ReturnType<typeof createData>;

  beforeEach(async () => {
    data = createData();
    await TestBed.configureTestingModule({
      imports: [PageDrawsComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([
          {
            path: 'competition/:competitionId/sub-events/:subEventId/draws/:drawId',
            component: PageDrawsComponent,
          },
        ]),
        { provide: Apollo, useValue: { query: jest.fn(() => of({ data })) } },
        { provide: AuthService, useValue: { hasAnyPermission: () => false } },
        { provide: SeoService, useValue: { update: jest.fn() } },
      ],
    })
      .overrideComponent(PageDrawsComponent, {
        remove: { imports: [SyncButtonComponent] },
        add: { imports: [SyncStubComponent] },
      })
      .compileComponents();
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('en', {
      all: { competition: { draw: 'Draw', size: 'Size', maxLevel: 'Max level' } },
    });
    translations.use('en');
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/competition/test-competition/sub-events/sub-event/draws/draw-id-12345', PageDrawsComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    const routeElement = harness.routeNativeElement;
    if (!routeElement) throw new Error('Competition draw route did not mount');
    element = routeElement;
  });

  function refresh(): void {
    harness.fixture.debugElement.query(By.directive(PageDrawsComponent)).injector.get(ChangeDetectorRef).markForCheck();
    harness.detectChanges();
  }

  function required<T>(value: T | null | undefined): T {
    if (value == null) throw new Error('Expected mounted draw data or element');
    return value;
  }

  it('preserves the title, sub-event, avatar and ordered optional metadata', () => {
    expect(element.querySelector('app-hero-title')?.textContent).toBe('First division - A');
    expect(element.querySelector('[identity] > span')?.textContent).toBe('First division');
    expect(element.querySelector('app-hero-avatar')?.textContent).toBe('P');
    const tags = [...element.querySelectorAll('[identity] p-tag')];
    expect(tags.map((tag) => tag.textContent?.trim())).toEqual(['POULE', 'Size 9', 'Max level 3', 'M']);
    expect(tags.every((tag) => tag.classList.contains('p-tag-secondary'))).toBe(true);
    expect(element.querySelector('[identity] .t-eyebrow')).toBeNull();
  });

  it.each(['type', 'size'] as const)('omits absent draw metadata: %s', (key) => {
    const draw = { ...required(component.draw()), [key]: key === 'size' ? 0 : '' };
    component.draw = signal(draw);
    refresh();
    expect(element.querySelectorAll('[identity] p-tag')).toHaveLength(3);
  });

  it.each(['maxLevel', 'eventType'] as const)('omits absent sub-event metadata: %s', (key) => {
    component.subEvent = signal({ ...required(component.subEvent()), [key]: key === 'maxLevel' ? 0 : '' });
    refresh();
    expect(element.querySelectorAll('[identity] p-tag')).toHaveLength(3);
  });

  it('uses the existing localized size and level labels', () => {
    TestBed.inject(TranslateService).setTranslation('nl_BE', {
      all: { competition: { draw: 'Poule', size: 'Grootte', maxLevel: 'Max niveau' } },
    });
    TestBed.inject(TranslateService).use('nl_BE');
    refresh();
    expect(element.querySelector('[identity]')?.textContent).toContain('Grootte 9');
    expect(element.querySelector('[identity]')?.textContent).toContain('Max niveau 3');
  });

  it('uses a named native secondary text Button with the same safe external destination', () => {
    const link = element.querySelector<HTMLAnchorElement>('[actions] a');
    expect(link?.getAttribute('href')).toBe('https://www.toernooi.nl/sport/league/draw?id=competition-code&draw=draw-code');
    expect(link?.target).toBe('_blank');
    expect(link?.rel).toBe('noopener noreferrer');
    expect(link?.getAttribute('aria-label')).toBe('First division - A (toernooi.nl)');
    expect(link?.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    const button = harness.fixture.debugElement.query(By.css('[actions] a')).injector.get(ButtonDirective);
    expect(button.severity()).toBe('secondary');
    expect(button.variant()).toBe('text');
    expect(button.size()).toBe('small');
    expect(button.dt()).toBeUndefined();
    expect(button.pt()).toBeUndefined();
    expect(link?.classList.contains('no-underline')).toBe(true);
    expect(link?.classList.contains('focus-visible:ring-primary')).toBe(true);
  });

  it.each(['competition', 'draw'] as const)('hides the external link without the %s visual code', (source) => {
    if (source === 'competition') {
      component.competition = signal({ ...required(component.competition()), visualCode: '' });
    } else {
      component.draw = signal({ ...required(component.draw()), visualCode: '' });
    }
    refresh();
    expect(element.querySelector('[actions] a')).toBeNull();
  });

  it('preserves the localized fallback heading and matches the external accessible name', () => {
    component.draw = signal({ ...required(component.draw()), name: '' });
    refresh();
    expect(element.querySelector('app-hero-title')?.textContent).toBe('Draw draw-id-');
    expect(element.querySelector('[actions] a')?.getAttribute('aria-label')).toBe('Draw draw-id- (toernooi.nl)');
  });

  it('preserves action order and sync configuration', () => {
    expect([...required(element.querySelector('[actions]')).children].map((child) => child.tagName)).toEqual(['A', 'APP-SYNC-BUTTON']);
    const sync = harness.fixture.debugElement.query(By.directive(SyncStubComponent)).componentInstance as SyncStubComponent;
    expect(sync.config()).toEqual({
      level: 'draw',
      drawId: 'draw-id-12345',
      eventName: 'Test competition',
      subEventName: 'First division',
      drawName: 'First division - A',
    });
  });

  it('uses restrained div/span statistics without legacy components, lists or interactive controls', () => {
    const stats = required(element.querySelector('[stats]'));
    expect([...stats.children].map((group) => group.tagName)).toEqual(['DIV', 'DIV', 'DIV', 'DIV']);
    expect(stats.querySelectorAll('app-hero-stat-value, .t-eyebrow, dl, dt, dd, ul, ol, button, a')).toHaveLength(0);
    expect(stats.querySelectorAll('.text-2xl.text-color.tabular-nums')).toHaveLength(4);
    expect(stats.classList.contains('grid-cols-2')).toBe(true);
    expect(stats.classList.contains('lg:grid-cols-4')).toBe(true);
  });

  it('preserves total, played, upcoming and team bindings in order', () => {
    const encounter = { id: 'encounter' };
    const entry = { id: 'entry' };
    component.encounters = signal(Array.from({ length: 5 }, () => encounter));
    component.playedEncounters = signal(Array.from({ length: 2 }, () => encounter));
    component.upcomingEncounters = signal(Array.from({ length: 3 }, () => encounter));
    component.standings = signal(Array.from({ length: 4 }, () => entry));
    refresh();
    expect([...element.querySelectorAll('[stats] > div > span:last-child')].map((value) => value.textContent)).toEqual(['5', '2', '3', '4']);
  });

  it('keeps zero encounter counts and the existing absent-team dash fallback', () => {
    expect([...element.querySelectorAll('[stats] > div > span:last-child')].map((value) => value.textContent)).toEqual(['0', '0', '0', '–']);
  });

  it.each(statisticLocales)('renders existing $locale asset labels without changing values', ({ locale, labels, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    refresh();
    expect([...element.querySelectorAll('[stats] > div > span:first-child')].map((label) => label.textContent)).toEqual(labels);
    expect([...element.querySelectorAll('[stats] > div > span:last-child')].map((value) => value.textContent)).toEqual(['0', '0', '0', '–']);
  });

  function setEncounterPartitions(played = [{ id: 'played-1' }, { id: 'played-2' }], upcoming = [{ id: 'upcoming-1' }]): void {
    component.encounters = signal([...played, ...upcoming]);
    component.playedEncounters = signal(played);
    component.upcomingEncounters = signal(upcoming);
    refresh();
  }

  it('uses native Cards with one localized heading and count for each encounter partition', () => {
    TestBed.inject(TranslateService).setTranslation('en', { all: statisticLocales[0].asset });
    setEncounterPartitions();
    const panels = [...element.querySelectorAll('section.grid > p-card')];
    expect(panels).toHaveLength(2);
    expect(panels.map((panel) => panel.querySelector('h2')?.textContent)).toEqual(['Played', 'Upcoming']);
    expect(panels.map((panel) => panel.querySelector('.p-card-title span')?.textContent)).toEqual(['2', '1']);
    expect(panels.every((panel) => panel.querySelectorAll('.t-eyebrow, .encounters-title, h3').length === 0)).toBe(true);
    expect(panels.every((panel) => panel.classList.contains('min-w-0'))).toBe(true);
    const cards = harness.fixture.debugElement.queryAll(By.css('section.grid > p-card'));
    cards.forEach((card) => {
      expect(card.injector.get(Card).pt()).toBeUndefined();
      expect(card.injector.get(Card).dt()).toBeUndefined();
    });
  });

  it('preserves encounter order, input variants and the game-loading callback', () => {
    setEncounterPartitions();
    const cards = harness.fixture.debugElement.queryAll(By.directive(EncounterCardComponent));
    const encounters = cards.map((card) => card.componentInstance as EncounterCardComponent);
    expect(encounters.map((card) => card.encounter().id)).toEqual(['played-1', 'played-2', 'upcoming-1']);
    expect(encounters.map((card) => card.variant())).toEqual(['played', 'played', 'upcoming']);
    expect(encounters.every((card) => card.onLoadGames() === component.onLoadGames)).toBe(true);
  });

  it.each(statisticLocales)('localizes encounter panel headings from the real $locale asset', ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    setEncounterPartitions();
    expect([...element.querySelectorAll('section.grid > p-card h2')].map((heading) => heading.textContent)).toEqual([
      asset.competition['played_encounters'],
      asset.competition['upcoming_encounters'],
    ]);
  });

  it.each(['played', 'upcoming'] as const)('preserves the %s-empty panel, zero count and localized copy', (empty) => {
    TestBed.inject(TranslateService).setTranslation('en', { all: statisticLocales[0].asset });
    setEncounterPartitions(empty === 'played' ? [] : [{ id: 'played' }], empty === 'upcoming' ? [] : [{ id: 'upcoming' }]);
    const panels = [...element.querySelectorAll('section.grid > p-card')];
    const emptyPanel = required(panels[empty === 'played' ? 0 : 1]);
    expect(emptyPanel.querySelector('.p-card-title span')?.textContent).toBe('0');
    expect(emptyPanel.querySelector('app-encounter-card')).toBeNull();
    expect(emptyPanel.querySelector('p')?.textContent).toBe(statisticLocales[0].asset.competition[`no_${empty}_encounters`]);
    expect(element.querySelectorAll('section.grid app-encounter-card')).toHaveLength(1);
  });

  it('keeps encounter panels hidden when the entire draw has no encounters', () => {
    setEncounterPartitions([], []);
    expect(element.querySelector('section.grid')).toBeNull();
    expect(element.textContent).toContain('all.competition.no_encounters');
  });
});
