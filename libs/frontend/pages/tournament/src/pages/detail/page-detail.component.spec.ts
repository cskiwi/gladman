import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SyncButtonComponent, SyncStatusIndicatorComponent } from '@app/frontend-components/sync';
import { AuthService } from '@app/frontend-modules-auth/service';
import { SeoService } from '@app/frontend-modules-seo/service';
import { TournamentPhase } from '@app/models-enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode, Kind, SelectionSetNode } from 'graphql';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonDirective } from 'primeng/button';
import { PageDetailComponent } from './page-detail.component';

const createTournament = () => ({
  id: 'tournament',
  slug: 'test-tournament',
  name: 'Test tournament',
  tournamentNumber: 'TEST_2026',
  dates: '2026-04-29, 2026-04-30',
  state: 'East Flanders',
  country: 'BE',
  official: true,
  phase: TournamentPhase.DRAFT,
  openDate: '',
  closeDate: '',
  visualCode: 'external-code',
  tournamentSubEvents: [],
});

@Component({
  selector: 'app-sync-button, app-sync-status-indicator',
  template: '',
})
class SyncStubComponent {
  readonly config = input<unknown>();
}

describe('Tournament detail hero', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  let harness: RouterTestingHarness;
  let element: HTMLElement;
  let query: jest.Mock;
  let loggedIn: ReturnType<typeof signal<boolean>>;
  let hasAnyPermission: jest.Mock;
  let routeNumber: number;

  beforeAll(() => {
    globalThis.ResizeObserver = class {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };
  });

  afterAll(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

  beforeEach(async () => {
    query = jest.fn(() => of({ data: { tournamentEvent: createTournament() } }));
    routeNumber = 0;
    loggedIn = signal(false);
    hasAnyPermission = jest.fn(() => false);
    await TestBed.configureTestingModule({
      imports: [PageDetailComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: 'tournament/:tournamentId', component: PageDetailComponent }]),
        { provide: Apollo, useValue: { query } },
        { provide: AuthService, useValue: { loggedIn, hasAnyPermission } },
        { provide: SeoService, useValue: { update: jest.fn() } },
      ],
    })
      .overrideComponent(PageDetailComponent, {
        remove: { imports: [SyncButtonComponent, SyncStatusIndicatorComponent] },
        add: { imports: [SyncStubComponent] },
      })
      .compileComponents();
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('en', {
      all: {
        tournament: {
          events: 'Tournament Events',
          drawFallbackName: 'Draw {{number}}',
          noDrawsYet: 'No draws configured yet',
          types: { men: 'Men', women: 'Women', mix: 'Mixed', other: 'Other' },
          gameTypes: { singles: 'Singles', doubles: 'Doubles', mixed: 'Mixed', other: 'Other' },
          official: 'Official tournament',
          draws: 'Draws',
          phases: { draft: 'Draft' },
          edit: { messages: { loading: 'Loading tournament data...' } },
          summary: {
            subEvents: 'Sub-events',
            registration: 'Registration',
            opens: 'Opens {{date}}',
            closes: 'Closes {{date}}',
            typeCountOne: 'across {{count}} type',
            typeCountOther: 'across {{count}} types',
            phase: 'Phase',
          },
        },
        common: { no: 'No', unknown: 'Unknown' },
      },
    });
    translations.use('en');
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tournament/tournament', PageDetailComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    if (!harness.routeNativeElement) throw new Error('Tournament route did not mount');
    element = harness.routeNativeElement;
  });

  async function renderTournament(
    tournament: Omit<ReturnType<typeof createTournament>, 'phase' | 'tournamentSubEvents'> & {
      phase?: TournamentPhase;
      tournamentSubEvents: {
        id: string;
        name: string;
        eventType: string;
        gameType: string;
        visualCode?: string;
        drawTournaments: { id: string; name: string; type?: string; size?: number; visualCode?: string }[];
      }[];
    },
  ) {
    query.mockReturnValue(of({ data: { tournamentEvent: tournament } }));
    await harness.navigateByUrl(`/tournament/hero-case-${++routeNumber}`, PageDetailComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  it('requests visualCode at the exact draw path in the executed detail query', () => {
    const document: DocumentNode = query.mock.calls[0][0].query;
    const operation = document.definitions.find((definition) => definition.kind === Kind.OPERATION_DEFINITION);
    let selectionSet: SelectionSetNode | undefined = operation?.selectionSet;
    for (const name of ['tournamentEvent', 'tournamentSubEvents', 'drawTournaments']) {
      const field = selectionSet?.selections.find((selection) => selection.kind === Kind.FIELD && selection.name.value === name);
      selectionSet = field?.kind === Kind.FIELD ? field.selectionSet : undefined;
      expect(selectionSet).toBeDefined();
    }
    expect(selectionSet?.selections.map((selection) => (selection.kind === Kind.FIELD ? selection.name.value : null))).toEqual([
      'id',
      'name',
      'type',
      'size',
      'visualCode',
    ]);
  });

  it('renders existing HTTP error feedback without throwing from the resource value', async () => {
    query.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404, url: '/graphql' })));
    await harness.navigateByUrl('/tournament/missing', PageDetailComponent);
    await harness.fixture.whenStable();
    expect(() => harness.detectChanges()).not.toThrow();
    expect(element.textContent).toContain('Failed to load tournament');
    expect(element.querySelector('app-hero')).toBeNull();
    const message = element.querySelector('p-message');
    expect(message?.classList.contains('p-message-error')).toBe(true);
    expect(message?.getAttribute('role')).toBe('alert');
    expect(message?.getAttribute('aria-live')).toBe('polite');
    expect(message?.querySelector('.pi-exclamation-triangle')).not.toBeNull();
    expect(message?.querySelector('button')).toBeNull();
    expect(element.querySelector('p-progressbar, p-skeleton')).toBeNull();
    expect(element.querySelector('[style*="--g-loss"]')).toBeNull();
  });

  it('shows named indeterminate progress until the request resolves, then restores loaded content', async () => {
    const pending = new Subject<{ data: { tournamentEvent: ReturnType<typeof createTournament> } }>();
    query.mockReturnValue(pending);
    await harness.navigateByUrl('/tournament/pending', PageDetailComponent);
    harness.detectChanges();
    const progress = element.querySelector('p-progressbar');
    expect(progress?.getAttribute('role')).toBe('progressbar');
    expect(progress?.getAttribute('aria-label')).toBe('Loading tournament data...');
    expect(progress?.classList.contains('p-progressbar-indeterminate')).toBe(true);
    expect(progress?.hasAttribute('aria-valuenow')).toBe(false);
    expect(element.querySelector('app-hero, p-message, p-skeleton')).toBeNull();
    pending.next({ data: { tournamentEvent: createTournament() } });
    pending.complete();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('h1')?.textContent).toBe('Test tournament');
    expect(element.querySelector('p-progressbar, p-message')).toBeNull();
  });

  it.each([
    { error: new HttpErrorResponse({ status: 503, statusText: 'Service Unavailable' }), text: 'Service Unavailable' },
    { error: new Error('Unmapped failure'), text: 'An error occurred' },
  ])('preserves mapped error text: $text and recovers on subsequent route loads', async ({ error, text }) => {
    query.mockReturnValue(throwError(() => error));
    await harness.navigateByUrl('/tournament/failed', PageDetailComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('p-message')?.textContent?.trim()).toBe(text);
    expect(element.querySelector('app-hero')).toBeNull();
    const pending = new Subject<{ data: { tournamentEvent: ReturnType<typeof createTournament> } }>();
    query.mockReturnValue(pending);
    await harness.navigateByUrl('/tournament/recovery', PageDetailComponent);
    harness.detectChanges();
    expect(element.querySelector('p-message')).toBeNull();
    expect(element.querySelector('p-progressbar')).not.toBeNull();
    pending.next({ data: { tournamentEvent: createTournament() } });
    pending.complete();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('h1')?.textContent).toBe('Test tournament');
    expect(element.querySelector('p-message, p-progressbar')).toBeNull();
    expect(element.querySelector('section[aria-labelledby="tournament-events-title"]')).toBeNull();
  });

  it('renders a missing tournament result as an explicit error, not a loaded empty page', async () => {
    query.mockReturnValue(of({ data: { tournamentEvent: null } }));
    await harness.navigateByUrl('/tournament/no-result', PageDetailComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('p-message')?.textContent?.trim()).toBe('An error occurred');
    expect(element.querySelector('app-hero, p-progressbar')).toBeNull();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses existing localized progress copy in %s', async (locale) => {
    const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: { tournament: { edit: { messages: { loading: string } } } } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    const pending = new Subject<{ data: { tournamentEvent: ReturnType<typeof createTournament> } }>();
    query.mockReturnValue(pending);
    await harness.navigateByUrl(`/tournament/pending-${locale}`, PageDetailComponent);
    harness.detectChanges();
    expect(element.querySelector('p-progressbar')?.getAttribute('aria-label')).toBe(asset.tournament.edit.messages.loading);
    pending.next({ data: { tournamentEvent: createTournament() } });
    pending.complete();
    await harness.fixture.whenStable();
  });

  it('uses shared native circular avatar and a single wrapping heading', () => {
    expect(element.querySelector('app-hero-avatar .p-avatar-circle')?.textContent).toBe('TT');
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('app-hero-title h1')?.textContent).toBe('Test tournament');
    expect(element.querySelector('.tournament-crest, .tournament-name')).toBeNull();
  });

  it('preserves the number, location and every comma-split date', () => {
    const identity = element.querySelector('[identity]');
    expect(identity?.textContent).toContain('#TEST_2026');
    expect(identity?.textContent).toContain('East Flanders');
    expect(identity?.textContent).toContain('BE');
    expect(identity?.textContent).toContain('29 Apr 2026');
    expect(identity?.textContent).toContain('30 Apr 2026');
    expect(identity?.querySelectorAll('i[aria-hidden="true"]')).toHaveLength(3);
    expect(query.mock.calls[0][0].variables.id).toBe('tournament');
  });

  it('uses a native success Tag with the existing translated official label', () => {
    const tag = element.querySelector('[identity] .p-tag-success');
    expect(tag?.textContent).toContain('Official tournament');
    expect(tag?.querySelector('.pi-shield')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('uses a native secondary Tag with the existing translated no label', async () => {
    await renderTournament({ ...createTournament(), official: false });
    expect([...element.querySelectorAll('[identity] .p-tag-secondary')].map((tag) => tag.textContent?.trim())).toEqual(['#TEST_2026', 'No']);
    expect(element.querySelector('[identity] .p-tag-success')).toBeNull();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('preserves actual official/no copy in %s', async (locale) => {
    const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: { tournament: { official: string }; common: { no: string } } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    await renderTournament(createTournament());
    expect(element.querySelector('[identity] .p-tag-success')?.textContent).toContain(asset.tournament.official);
    await renderTournament({ ...createTournament(), official: false });
    expect(element.querySelector('[identity] p-tag:last-child')?.textContent).toContain(asset.common.no);
  });

  it('omits missing metadata without losing title or status', async () => {
    await renderTournament({ ...createTournament(), tournamentNumber: '', state: '', country: '', dates: '' });
    const identity = element.querySelector('[identity]');
    expect(identity?.textContent).not.toContain('#');
    expect(identity?.querySelector('.pi-map-marker, .pi-calendar')).toBeNull();
    expect(identity?.querySelector('h1')?.textContent).toBe('Test tournament');
    expect(identity?.querySelector('p-tag')?.textContent).toContain('Official tournament');
  });

  it.each([
    { state: 'East Flanders', country: '' },
    { state: '', country: 'BE' },
  ])('renders one-sided location without a separator: $state $country', async (location) => {
    await renderTournament({ ...createTournament(), ...location });
    const text = element.querySelector('[identity] .pi-map-marker')?.parentElement?.textContent;
    expect(text).toContain(location.state || location.country);
    expect(text).not.toContain(',');
  });

  it('preserves anonymous action gates and adjacent summaries without retired enrollment links', () => {
    expect(element.querySelector('app-sync-button, app-sync-status-indicator')).toBeNull();
    expect(hasAnyPermission).not.toHaveBeenCalled();
    expect(element.querySelector('[actions] p-button')).toBeNull();
    expect(element.querySelector('[actions] a')?.getAttribute('href')).toBe('https://www.toernooi.nl/tournament/external-code');
    expect(element.querySelector('[stats]')?.textContent).toContain('Draft');
    expect(element.querySelectorAll('nav[aria-labelledby="tournament-live-title"] a')).toHaveLength(4);
  });

  it('offers only general enrollment to anonymous visitors when enrollment is open', async () => {
    await renderTournament({ ...createTournament(), phase: TournamentPhase.ENROLLMENT_OPEN });
    const targets = harness.routeDebugElement
      ?.queryAll(By.css('[actions] button.p-button'))
      .map((button) => button.injector.get(RouterLink).urlTree?.toString());
    expect(targets).toEqual(['/tournament/tournament/enroll']);
    expect(element.querySelector('[actions] .pi-list')).toBeNull();
  });

  it('preserves permitted admin/enrollment-open and logged-in sync gates', async () => {
    loggedIn.set(true);
    hasAnyPermission.mockReturnValue(true);
    await renderTournament({ ...createTournament(), phase: TournamentPhase.ENROLLMENT_OPEN });
    const targets = harness.routeDebugElement
      ?.queryAll(By.css('[actions] button.p-button'))
      .map((button) => button.injector.get(RouterLink).urlTree?.toString());
    expect(targets).toContain('/tournament/tournament/admin');
    expect(targets).toContain('/tournament/tournament/enroll');
    expect(element.querySelectorAll('app-sync-button')).toHaveLength(1);
    expect(element.querySelectorAll('app-sync-status-indicator')).toHaveLength(1);
  });

  it('uses the competition summary layout and typography, without custom metric/badge styling', () => {
    const stats = element.querySelector('[stats]');
    expect(stats?.className).toBe('grid grid-cols-2 lg:grid-cols-4 gap-5 mt-5 pt-5 border-t border-surface');
    expect([...element.querySelectorAll('[stats] > div > span')].map((label) => label.className)).toEqual(Array(4).fill('text-sm text-muted-color'));
    expect([...element.querySelectorAll('[stats] .tabular-nums')].map((value) => value.className)).toEqual(
      Array(2).fill('text-2xl font-semibold tabular-nums text-color'),
    );
    expect(element.querySelector('[stats] .t-eyebrow, [stats] .t-mono, .tournament-stat-value, [stats] .bg-win-muted')).toBeNull();
    expect([...element.querySelectorAll('[stats] > div > span')].map((label) => label.textContent?.trim())).toEqual([
      'Sub-events',
      'Draws',
      'Registration',
      'Phase',
    ]);
  });

  it('uses four public native outlined links with the original tournament-ID routes and order', async () => {
    const navigation = harness.routeDebugElement?.query(By.css('nav[aria-labelledby="tournament-live-title"]'));
    expect(element.querySelector('section[aria-labelledby="tournament-live-title"] .p-card')).toBeTruthy();
    const links = navigation?.queryAll(By.css('a')) ?? [];
    expect(links).toHaveLength(4);
    expect(links.map((link) => link.injector.get(RouterLink).urlTree?.toString())).toEqual(
      ['courts', 'results', 'upcoming', 'kiosk'].map((path) => `/tournament/tournament/live/${path}`),
    );
    for (const link of links) {
      expect(link.injector.get(ButtonDirective)).toBeTruthy();
      const anchor: HTMLAnchorElement = link.nativeElement;
      expect(anchor.classList.contains('p-button-secondary')).toBe(true);
      expect(anchor.classList.contains('p-button-outlined')).toBe(true);
      expect(anchor.classList.contains('focus-visible:ring-primary')).toBe(true);
      expect(anchor.getAttribute('target')).toBeNull();
      expect(anchor.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    }
    loggedIn.set(true);
    hasAnyPermission.mockReturnValue(true);
    await renderTournament({ ...createTournament(), id: 'another-tournament', phase: TournamentPhase.COMPLETED });
    expect([...element.querySelectorAll('nav[aria-labelledby="tournament-live-title"] a')].map((link) => link.getAttribute('href'))).toEqual(
      ['courts', 'results', 'upcoming', 'kiosk'].map((path) => `/tournament/another-tournament/live/${path}`),
    );
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('preserves actual live-navigation labels/descriptions and heading in %s', async (locale) => {
    const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: { tournament: { live: Record<string, string> } } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    await renderTournament(createTournament());
    const navigation = element.querySelector('nav[aria-labelledby="tournament-live-title"]');
    expect(element.querySelectorAll('#tournament-live-title')).toHaveLength(1);
    expect(element.querySelector('#tournament-live-title')?.textContent?.trim()).toBe(asset.tournament.live['title']);
    const links = [...(navigation?.querySelectorAll('a') ?? [])];
    expect(links).toHaveLength(4);
    for (const [index, path] of ['courts', 'results', 'upcoming', 'kiosk'].entries()) {
      const lines = [...links[index].querySelectorAll('[pButtonLabel] > span')];
      expect(lines.map((line) => line.textContent?.trim())).toEqual([asset.tournament.live[path], asset.tournament.live[`${path}Desc`]]);
      expect(lines.every((line) => line.classList.contains('whitespace-normal'))).toBe(true);
    }
    expect(navigation?.querySelector('[style], .truncate, .g-live-card')).toBeNull();
  });

  it('uses the competition native external button presentation and accessible name', () => {
    const external = harness.routeDebugElement?.query(By.css('[actions] a'));
    expect(external?.injector.get(ButtonDirective)).toBeTruthy();
    const anchor = element.querySelector('[actions] a');
    expect(anchor?.classList.contains('p-button-secondary')).toBe(true);
    expect(anchor?.classList.contains('p-button-text')).toBe(true);
    expect(anchor?.classList.contains('p-button-sm')).toBe(true);
    expect(anchor?.getAttribute('aria-label')).toBe('Test tournament (toernooi.nl)');
    expect(anchor?.getAttribute('target')).toBe('_blank');
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(anchor?.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('omits the events section for zero sub-events', () => {
    expect(element.querySelector('#tournament-events-title')).toBeNull();
    expect(element.querySelector('p-tabs')).toBeNull();
  });

  it('uses competition-aligned native Cards, heading hierarchy, draw links and wrapping metadata for one group', async () => {
    await renderTournament({
      ...createTournament(),
      tournamentSubEvents: [
        {
          id: 'men',
          name: 'Men singles',
          eventType: 'M1',
          gameType: 'S',
          visualCode: 'event-code',
          drawTournaments: [
            { id: 'draw-one', name: 'A very long draw name', type: 'KO', size: 16, visualCode: 'draw-code' },
            { id: 'draw-two', name: '' },
          ],
        },
      ],
    });
    const section = element.querySelector('section[aria-labelledby="tournament-events-title"]');
    expect(section?.querySelector('h2')?.textContent?.trim()).toBe('Tournament Events');
    expect(section?.querySelector('h3')?.textContent?.trim()).toBe('Singles');
    expect(section?.querySelector('h4')?.textContent?.trim()).toBe('Men singles');
    expect(section?.querySelector('.p-card article')).toBeTruthy();
    expect(section?.querySelector('p-tabs')).toBeNull();
    const links = [...(section?.querySelectorAll('li > a:first-child') ?? [])];
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/tournament/test-tournament/sub-events/men/draws/draw-one',
      '/tournament/test-tournament/sub-events/men/draws/draw-two',
    ]);
    expect(links.map((link) => link.querySelector('[pButtonLabel] > span')?.textContent?.trim())).toEqual(['A very long draw name', 'Draw 2']);
    expect(links[0].textContent).toContain('KO');
    expect(links[0].textContent).toContain('S16');
    expect(links[1].querySelector('[pButtonLabel] > span:nth-child(2)')).toBeNull();
    for (const link of links) {
      expect(link.classList.contains('p-button-outlined')).toBe(true);
      expect(link.classList.contains('p-button-secondary')).toBe(true);
      expect(link.querySelector('.whitespace-normal.break-words')).toBeTruthy();
      expect(link.classList.contains('focus-visible:ring-primary')).toBe(true);
    }
    const external = [...(section?.querySelectorAll('a[target="_blank"]') ?? [])];
    expect(external.map((link) => link.getAttribute('href'))).toEqual([
      'https://www.toernooi.nl/sport/event.aspx?id=external-code&event=event-code',
      'https://www.toernooi.nl/tournament/external-code/draw/draw-code',
    ]);
    expect(external.map((link) => link.getAttribute('aria-label'))).toEqual(['Men singles (toernooi.nl)', 'A very long draw name (toernooi.nl)']);
    for (const link of external) {
      expect(link.classList.contains('p-button-text')).toBe(true);
      expect(link.classList.contains('p-button-secondary')).toBe(true);
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    }
    expect(section?.querySelector('.t-eyebrow, .t-mono, .truncate, .g-subevent, .g-draw-row')).toBeNull();
  });

  it('preserves ordered type Tabs, numeric event ordering and singles/doubles/mixed grouping', async () => {
    await renderTournament({
      ...createTournament(),
      tournamentSubEvents: [
        { id: 'other', name: 'Other', eventType: '', gameType: '', drawTournaments: [] },
        { id: 'mix', name: 'Mixed', eventType: 'MX1', gameType: 'MX', drawTournaments: [] },
        { id: 'women', name: 'Women', eventType: 'F1', gameType: 'S', drawTournaments: [] },
        { id: 'men-10', name: 'Men 10', eventType: 'M10', gameType: 'S', drawTournaments: [] },
        { id: 'men-2', name: 'Men 2', eventType: 'M2', gameType: 'S', drawTournaments: [] },
        { id: 'men-double', name: 'Men doubles', eventType: 'M1', gameType: 'D', drawTournaments: [] },
      ],
    });
    const tabs = [...element.querySelectorAll<HTMLElement>('p-tab')];
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['Men', 'Women', 'Mixed', 'Other']);
    expect(element.querySelector('p-tab[aria-selected="true"]')?.textContent?.trim()).toBe('Men');
    const men = element.querySelector('p-tabpanel');
    expect([...(men?.querySelectorAll('h3') ?? [])].map((heading) => heading.textContent?.trim())).toEqual(['Singles', 'Doubles']);
    expect([...(men?.querySelectorAll('h4') ?? [])].map((heading) => heading.textContent?.trim())).toEqual(['Men 2', 'Men 10', 'Men doubles']);
    tabs[1].click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('p-tab[aria-selected="true"]')?.textContent?.trim()).toBe('Women');
  });

  it.each([
    { tournamentCode: 'external-code', drawCode: 'draw-code', visible: true },
    { tournamentCode: '', drawCode: 'draw-code', visible: false },
    { tournamentCode: 'external-code', drawCode: undefined, visible: false },
    { tournamentCode: '', drawCode: undefined, visible: false },
  ])('requires both external codes: tournament=$tournamentCode draw=$drawCode', async ({ tournamentCode, drawCode, visible }) => {
    await renderTournament({
      ...createTournament(),
      visualCode: tournamentCode,
      tournamentSubEvents: [
        {
          id: 'men',
          name: 'Men singles',
          eventType: 'M1',
          gameType: 'S',
          drawTournaments: [{ id: 'draw-one', name: 'First draw', visualCode: drawCode }],
        },
      ],
    });
    const row = element.querySelector('section[aria-labelledby="tournament-events-title"] li');
    expect(row?.querySelector('a')?.getAttribute('href')).toBe('/tournament/test-tournament/sub-events/men/draws/draw-one');
    const external = row?.querySelector('a[target="_blank"]');
    if (!visible) {
      expect(external).toBeNull();
      return;
    }
    expect(external?.getAttribute('href')).toBe('https://www.toernooi.nl/tournament/external-code/draw/draw-code');
    expect(external?.getAttribute('aria-label')).toBe('First draw (toernooi.nl)');
    expect(external?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(external?.classList.contains('p-button-secondary')).toBe(true);
    expect(external?.classList.contains('p-button-text')).toBe(true);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('names the external action for an unnamed draw using actual %s copy', async (locale) => {
    const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: { tournament: { drawFallbackName: string } } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    await renderTournament({
      ...createTournament(),
      tournamentSubEvents: [
        {
          id: 'men',
          name: 'Men singles',
          eventType: 'M1',
          gameType: 'S',
          drawTournaments: [{ id: 'draw-one', name: '', visualCode: 'draw-code' }],
        },
      ],
    });
    const row = element.querySelector('section[aria-labelledby="tournament-events-title"] li');
    const name = asset.tournament.drawFallbackName.replace('{{number}}', '1');
    expect(row?.querySelector('[pButtonLabel] > span')?.textContent?.trim()).toBe(name);
    expect(row?.querySelector('a[target="_blank"]')?.getAttribute('aria-label')).toBe(`${name} (toernooi.nl)`);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses actual tournament fallback/empty copy and native empty Message in %s', async (locale) => {
    const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: { tournament: { drawFallbackName: string; noDrawsYet: string } } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    await renderTournament({
      ...createTournament(),
      tournamentSubEvents: [
        { id: 'empty', name: 'Empty', eventType: 'M1', gameType: 'S', drawTournaments: [] },
        { id: 'fallback', name: 'Fallback', eventType: 'M2', gameType: 'S', drawTournaments: [{ id: 'draw', name: '' }] },
      ],
    });
    const section = element.querySelector('section[aria-labelledby="tournament-events-title"]');
    const message = section?.querySelector('p-message');
    expect(message?.textContent?.trim()).toBe(asset.tournament.noDrawsYet);
    expect(message?.classList.contains('p-message-secondary')).toBe(true);
    expect(message?.getAttribute('role')).toBe('status');
    expect(section?.querySelector('li a')?.textContent?.trim()).toBe(asset.tournament.drawFallbackName.replace('{{number}}', '1'));
    expect(section?.querySelector('a[target="_blank"]')).toBeNull();
  });

  it('preserves authenticated sub-event sync configs without granting admin permission', async () => {
    const tournament = {
      ...createTournament(),
      tournamentSubEvents: [{ id: 'men', name: 'Men singles', eventType: 'M1', gameType: 'S', visualCode: 'event-code', drawTournaments: [] }],
    };
    await renderTournament(tournament);
    expect(element.querySelector('section[aria-labelledby="tournament-events-title"] app-sync-button')).toBeNull();
    loggedIn.set(true);
    await renderTournament(tournament);
    const section = harness.routeDebugElement?.query(By.css('section[aria-labelledby="tournament-events-title"]'));
    const configs = section?.queryAll(By.directive(SyncStubComponent)).map((node) => node.componentInstance.config());
    expect(configs).toEqual([
      { entityType: 'event', entityCode: 'event-code', entityName: 'Men singles', lastSync: null },
      { level: 'sub-event', subEventId: 'men', eventName: 'Test tournament', subEventName: 'Men singles' },
    ]);
    expect(element.querySelector('[actions] .pi-cog')).toBeNull();
  });

  it.each([
    { count: 0, expected: ['0 across 0 types', '0'] },
    { count: 1, expected: ['1 across 1 type', '2'] },
    { count: 3, expected: ['3 across 3 types', '6'] },
  ])('preserves summary totals for $count event types', async ({ count, expected }) => {
    await renderTournament({
      ...createTournament(),
      tournamentSubEvents: ['M', 'F', 'MX'].slice(0, count).map((eventType) => ({
        id: eventType,
        name: eventType,
        eventType,
        gameType: 'S',
        drawTournaments: [
          { id: `${eventType}-1`, name: 'First draw' },
          { id: `${eventType}-2`, name: 'Second draw' },
        ],
      })),
    });
    const values = [...element.querySelectorAll('[stats] > div > div')].slice(0, 2);
    expect(values.map((value) => value.textContent?.trim().replace(/\s+/g, ' '))).toEqual(expected);
  });

  it.each([
    { openDate: '', closeDate: '', expected: ['-'] },
    { openDate: '2026-04-01', closeDate: '', expected: ['Opens 1 Apr 2026'] },
    { openDate: '', closeDate: '2026-04-15', expected: ['Closes 15 Apr 2026'] },
    { openDate: '2026-04-01', closeDate: '2026-04-15', expected: ['Opens 1 Apr 2026', 'Closes 15 Apr 2026'] },
  ])('preserves registration dates: $expected', async ({ openDate, closeDate, expected }) => {
    await renderTournament({ ...createTournament(), openDate, closeDate });
    const lines = element.querySelectorAll('[stats] > div:nth-child(3) > div > span');
    expect([...lines].map((line) => line.textContent?.trim())).toEqual(expected);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('renders real localized summary and every phase in %s', async (locale) => {
    const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: {
      tournament: { draws: string; summary: Record<string, string>; phases: Record<string, string> };
      common: { unknown: string };
    } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    const phases = [
      [TournamentPhase.DRAFT, 'draft'],
      [TournamentPhase.ENROLLMENT_OPEN, 'enrollmentOpen'],
      [TournamentPhase.ENROLLMENT_CLOSED, 'enrollmentClosed'],
      [TournamentPhase.DRAWS_MADE, 'drawsMade'],
      [TournamentPhase.SCHEDULED, 'scheduled'],
      [TournamentPhase.IN_PROGRESS, 'inProgress'],
      [TournamentPhase.COMPLETED, 'completed'],
    ] as const;
    for (const [phase, key] of phases) {
      await renderTournament({ ...createTournament(), phase, openDate: '2026-04-01', closeDate: '2026-04-15' });
      expect(element.querySelector('[stats] > div:last-child > div')?.textContent).toContain(asset.tournament.phases[key]);
    }
    expect([...element.querySelectorAll('[stats] > div:nth-child(3) > div > span')].map((line) => line.textContent?.trim())).toEqual([
      asset.tournament.summary.opens.replace('{{date}}', '1 Apr 2026'),
      asset.tournament.summary.closes.replace('{{date}}', '15 Apr 2026'),
    ]);
    await renderTournament({ ...createTournament(), phase: undefined });
    expect(element.querySelector('[stats] > div:last-child > div')?.textContent).toContain(asset.common.unknown);
    expect([...element.querySelectorAll('[stats] > div > span')].map((label) => label.textContent?.trim())).toEqual([
      asset.tournament.summary.subEvents,
      asset.tournament.draws,
      asset.tournament.summary.registration,
      asset.tournament.summary.phase,
    ]);
    expect(element.querySelector('[stats]')?.textContent).not.toContain('all.');
  });
});
