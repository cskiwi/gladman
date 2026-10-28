import { ChangeDetectorRef, Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { SeoService } from '@app/frontend-modules-seo/service';
import { SyncButtonComponent, SyncStatusIndicatorComponent } from '@app/frontend-components/sync';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { ButtonDirective } from 'primeng/button';
import { of } from 'rxjs';
import { PageDetailComponent } from './page-detail.component';

const createCompetition = () => ({
  id: 'competition',
  name: 'Test competition',
  slug: 'test-competition',
  visualCode: 'competition-code',
  official: true,
  season: 2026,
  type: 'PROV',
  state: 'East Flanders',
  country: 'BE',
  openDate: '2026-05-01',
  closeDate: '2026-05-22',
  changeOpenDate: '2026-07-27',
  changeCloseDatePeriod1: '2026-08-25',
  competitionSubEvents: [
    {
      id: 'mixed',
      name: 'Mixed event',
      eventType: 'MX',
      visualCode: 'mixed-code',
      competitionDraws: [{ id: 'draw-mixed', name: 'Mixed draw' }],
    },
    {
      id: 'men',
      name: 'Men event',
      eventType: 'M',
      maxLevel: 4,
      minBaseIndex: 32,
      maxBaseIndex: 48,
      visualCode: 'men-code',
      competitionDraws: [
        {
          id: 'draw-men',
          name: 'Men draw',
          type: 'POULE',
          size: 9,
          visualCode: 'draw-code',
        },
      ],
    },
    {
      id: 'women',
      name: 'Women event',
      eventType: 'F',
      visualCode: 'women-code',
      competitionDraws: [],
    },
  ],
});

@Component({
  selector: 'app-sync-button, app-sync-status-indicator',
  template: '',
})
class SyncStubComponent {
  readonly config = input<unknown>();
}

describe('Competition detail presentation', () => {
  let harness: RouterTestingHarness;
  let component: PageDetailComponent;
  let element: HTMLElement;
  let query: jest.Mock;

  beforeEach(async () => {
    query = jest.fn(() =>
      of({
        data: { competitionEvent: createCompetition() },
      }),
    );
    await TestBed.configureTestingModule({
      imports: [PageDetailComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([
          {
            path: 'competition/:competitionId',
            component: PageDetailComponent,
          },
        ]),
        { provide: Apollo, useValue: { query } },
        { provide: AuthService, useValue: { hasAnyPermission: () => false } },
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
        competition: {
          subEvents: 'Sub-events',
          draws: 'Draws',
          noDrawsYet: 'No draws configured yet',
          maxLevel: 'Max level',
          summary: {
            typeCountOne: 'across {{count}} type',
            typeCountOther: 'across {{count}} types',
            registration: 'Registration',
            teamChanges: 'Team changes',
            opens: 'Opens {{date}}',
            closes: 'Closes {{date}}',
            from: 'From {{date}}',
            periodOneEnds: 'P1 ends {{date}}',
          },
          types: { men: 'Men', women: 'Women', mix: 'Mixed' },
        },
      },
    });
    translations.use('en');
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/competition/test-competition', PageDetailComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    const routeElement = harness.routeNativeElement;
    if (!routeElement) throw new Error('Competition route did not mount');
    element = routeElement;
  });

  it('renders named native buttons in group order with existing targets', () => {
    const buttons = [...element.querySelectorAll('section nav button')];
    expect(buttons.map((button) => button.textContent?.trim())).toEqual(['Men (1)', 'Women (1)', 'Mixed (1)']);
    expect(buttons.map((button) => button.getAttribute('aria-controls'))).toEqual(['group-M', 'group-F', 'group-MX']);
    buttons.forEach((button) => {
      expect(button.getAttribute('type')).toBe('button');
      expect(button.classList.contains('p-button')).toBe(true);
      expect(button.querySelector('.p-button-label')?.classList.contains('text-color')).toBe(true);
      expect(element.querySelector(`[id="${button.getAttribute('aria-controls')}"]`)).not.toBeNull();
    });
  });

  it('uses shared hero components and preserves metadata and totals', () => {
    expect(element.querySelector('app-hero-avatar p-avatar')?.textContent).toBe('TES');
    expect(element.querySelector('app-hero-title h1')?.textContent).toBe('Test competition');
    expect([...element.querySelectorAll('[stats] .tabular-nums')].map((value) => value.textContent?.trim())).toEqual(['3', '2']);
    const identity = element.querySelector('[identity]');
    expect(identity?.textContent).toContain('2026');
    expect(identity?.textContent).toContain('East Flanders');
    expect(identity?.textContent).toContain('BE');
    expect(identity?.querySelector('.p-tag-secondary')?.textContent).toContain('PROV');
    expect(identity?.querySelector('.p-tag-success')?.textContent).toContain('all.competition.official');
    const stats = element.querySelector('[stats]');
    expect(stats?.textContent).toContain('Opens 1 May 2026');
    expect(stats?.textContent).toContain('Closes 22 May 2026');
    expect(stats?.textContent).toContain('From 27 Jul');
    expect(stats?.textContent).toContain('P1 ends 25 Aug');
    expect(element.querySelector('[actions] a')?.getAttribute('href')).toBe('https://www.toernooi.nl/sport/league?id=competition-code');
    expect(element.querySelectorAll('app-sync-button')).toHaveLength(4);
    expect(element.querySelectorAll('app-sync-status-indicator')).toHaveLength(4);
  });

  it('retains the non-official status using a secondary native Tag', async () => {
    query.mockReturnValue(
      of({
        data: { competitionEvent: { ...createCompetition(), official: false } },
      }),
    );
    await harness.navigateByUrl('/competition/non-official-competition');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelectorAll('[identity] .p-tag-secondary')).toHaveLength(2);
    expect(element.querySelector('[identity] .p-tag-success')).toBeNull();
    expect(element.querySelector('[identity]')?.textContent).toContain('all.common.no');
  });

  it('keeps the existing div/span statistic groups without introducing list markup or interactive decoration', () => {
    const stats = element.querySelector('div[stats]');
    expect([...element.querySelectorAll('[stats] > div > span')].map((label) => label.textContent?.trim())).toEqual([
      'Sub-events',
      'Draws',
      'Registration',
      'Team changes',
    ]);
    expect(stats?.querySelectorAll(':scope > div > div')).toHaveLength(4);
    stats?.querySelectorAll(':scope > div').forEach((group) => {
      expect(group.querySelector('span')?.nextElementSibling?.tagName).toBe('DIV');
    });
    expect(stats?.querySelector('a, button, [tabindex], [style]')).toBeNull();
    expect(stats?.querySelector('dl, dt, dd, ul, ol, li')).toBeNull();
    expect(stats?.textContent).toContain('across 3 types');
  });

  it.each([
    { count: 0, expected: ['0 across 0 types', '0'] },
    { count: 1, expected: ['1 across 1 type', '1'] },
    { count: 3, expected: ['3 across 3 types', '2'] },
  ])('preserves totals and type-count copy for $count groups', async ({ count, expected }) => {
    const competition = createCompetition();
    competition.competitionSubEvents = competition.competitionSubEvents.slice(0, count);
    query.mockReturnValue(of({ data: { competitionEvent: competition } }));
    await harness.navigateByUrl('/competition/statistic-totals');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect([...element.querySelectorAll('[stats] > div > div')].slice(0, 2).map((value) => value.textContent?.trim().replace(/\s+/g, ' '))).toEqual(
      expected,
    );
  });

  it.each([
    { openDate: null, closeDate: null, changeOpenDate: null, changeCloseDatePeriod1: null, expected: ['-', '-'] },
    { openDate: undefined, closeDate: undefined, changeOpenDate: undefined, changeCloseDatePeriod1: undefined, expected: ['-', '-'] },
    { openDate: '', closeDate: '', changeOpenDate: '', changeCloseDatePeriod1: '', expected: ['-', '-'] },
    {
      openDate: '2026-05-01',
      closeDate: null,
      changeOpenDate: '2026-07-27',
      changeCloseDatePeriod1: null,
      expected: ['Opens 1 May 2026', 'From 27 Jul'],
    },
    { openDate: null, closeDate: '2026-05-22', changeOpenDate: null, changeCloseDatePeriod1: '2026-08-25', expected: ['Closes 22 May 2026', '-'] },
  ])('preserves partial or absent date-window visibility: $expected', async ({ expected, ...dates }) => {
    query.mockReturnValue(of({ data: { competitionEvent: { ...createCompetition(), ...dates } } }));
    await harness.navigateByUrl('/competition/statistic-dates');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect([...element.querySelectorAll('[stats] > div > div')].slice(2).map((value) => value.textContent?.trim().replace(/\s+/g, ' '))).toEqual(
      expected,
    );
  });

  it('updates all statistic labels and interpolated context when the language changes', () => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('nl_BE', {
      all: {
        competition: {
          subEvents: 'Reeksen',
          draws: 'Reeks',
          summary: {
            typeCountOther: 'over {{count}} types',
            registration: 'Inschrijving',
            teamChanges: 'Ploegwijzigingen',
            opens: 'Opent {{date}}',
            closes: 'Sluit {{date}}',
            from: 'Vanaf {{date}}',
            periodOneEnds: 'P1 eindigt {{date}}',
          },
        },
      },
    });
    translations.use('nl_BE');
    harness.detectChanges();
    expect([...element.querySelectorAll('[stats] > div > span')].map((label) => label.textContent?.trim())).toEqual([
      'Reeksen',
      'Reeks',
      'Inschrijving',
      'Ploegwijzigingen',
    ]);
    expect([...element.querySelectorAll('[stats] > div > div span')].map((value) => value.textContent?.trim())).toEqual([
      '3',
      'over 3 types',
      'Opent 1 May 2026',
      'Sluit 22 May 2026',
      'Vanaf 27 Jul',
      'P1 eindigt 25 Aug',
    ]);
  });

  it('uses a named native hero link Button with the same external destination and safety', () => {
    const link = element.querySelector('[actions] a');
    expect(link?.getAttribute('href')).toBe('https://www.toernooi.nl/sport/league?id=competition-code');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link?.getAttribute('aria-label')).toBe('Test competition (toernooi.nl)');
    expect(link?.querySelector('[pButtonLabel]')?.textContent).toBe('toernooi.nl');
    expect(link?.querySelector('[pButtonIcon]')?.getAttribute('aria-hidden')).toBe('true');
    expect(link?.classList.contains('p-button')).toBe(true);
    expect(link?.classList.contains('p-button-secondary')).toBe(true);
    expect(link?.classList.contains('p-button-text')).toBe(true);
    expect(link?.classList.contains('p-button-sm')).toBe(true);
    expect(link?.classList.contains('p-button-outlined')).toBe(false);
    expect(link?.classList.contains('focus-visible:outline-none!')).toBe(true);
    expect(link?.classList.contains('focus-visible:ring-2!')).toBe(true);
    expect(link?.classList.contains('focus-visible:ring-primary')).toBe(true);
    expect([...element.querySelectorAll('a[href*="toernooi.nl"]')].every((anchor) => anchor.classList.contains('no-underline'))).toBe(true);
    expect(link?.getAttribute('role')).not.toBe('button');
    expect(link?.hasAttribute('title')).toBe(false);
    expect(link?.hasAttribute('style')).toBe(false);
    const directive = harness.routeDebugElement?.query(By.css('[actions] a')).injector.get(ButtonDirective);
    expect(directive?.dt()).toBeUndefined();
    const actions = element.querySelector('[actions]');
    if (!actions) throw new Error('Hero actions did not render');
    expect([...actions.children].map((child) => child.tagName)).toEqual(['A', 'APP-SYNC-STATUS-INDICATOR', 'APP-SYNC-BUTTON']);
  });

  it('preserves the permission-gated edit action before the external link and updates its name', async () => {
    jest.spyOn(TestBed.inject(AuthService), 'hasAnyPermission').mockReturnValue(true);
    query.mockReturnValue(of({ data: { competitionEvent: { ...createCompetition(), name: 'Gewijzigde competitie' } } }));
    await harness.navigateByUrl('/competition/renamed-competition');
    await harness.fixture.whenStable();
    harness.detectChanges();
    const actions = element.querySelector('[actions]');
    expect(actions?.firstElementChild?.tagName).toBe('P-BUTTON');
    const editLink = harness.routeDebugElement?.query(By.css('[actions] p-button')).injector.get(RouterLink);
    expect(editLink?.urlTree?.toString()).toBe('/competition/renamed-competition/edit');
    expect(actions?.querySelector('a')?.getAttribute('aria-label')).toBe('Gewijzigde competitie (toernooi.nl)');
    expect(actions?.querySelectorAll('app-sync-button')).toHaveLength(1);
    expect(actions?.querySelectorAll('app-sync-status-indicator')).toHaveLength(1);
  });

  it.each([null, undefined, ''])('omits the hero external link without visual code (%s)', async (visualCode) => {
    // Missing-code sync status validation is existing behavior outside this presentation slice.
    component.syncStatusConfig = signal(null);
    query.mockReturnValue(of({ data: { competitionEvent: { ...createCompetition(), visualCode } } }));
    await harness.navigateByUrl('/competition/no-visual-code');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('[actions] a')).toBeNull();
    expect(element.querySelector('[actions] app-sync-button')).not.toBeNull();
  });

  it('keeps loading and error presentation native without inline styling', () => {
    component.loading = signal(true);
    component.error = signal('Competition unavailable');
    harness.routeDebugElement?.injector.get(ChangeDetectorRef).markForCheck();
    harness.detectChanges();
    const progress = element.querySelector('p-progressbar');
    expect(progress?.getAttribute('role')).toBe('progressbar');
    expect(progress?.classList.contains('h-1')).toBe(true);
    expect(progress?.hasAttribute('style')).toBe(false);
    const message = element.querySelector('p-message');
    expect(message?.textContent).toContain('Competition unavailable');
    expect(message?.classList.contains('p-message-error')).toBe(true);
    expect(message?.hasAttribute('style')).toBe(false);
    expect(element.querySelector('app-hero')).toBeNull();
  });

  it('scrolls each button to its corresponding group', () => {
    const targets = ['M', 'F', 'MX'];
    const scrolls = targets.map((type) => {
      const target = element.querySelector(`#group-${type}`);
      const scroll = jest.fn();
      Object.defineProperty(target, 'scrollIntoView', { value: scroll });
      return scroll;
    });
    document.body.appendChild(element);
    try {
      const buttons = element.querySelectorAll<HTMLButtonElement>('nav button');
      targets.forEach((_, index) => {
        buttons[index].click();
        expect(scrolls[index]).toHaveBeenCalledWith({
          behavior: 'smooth',
          block: 'start',
        });
      });
    } finally {
      element.remove();
    }
  });

  it('provides translated h2/h3/h4 hierarchy and retains draw destinations', () => {
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('Sub-events & Draws');
    expect([...element.querySelectorAll('h3')].map((h) => h.textContent)).toEqual(['Men', 'Women', 'Mixed']);
    expect([...element.querySelectorAll('h4')].map((h) => h.textContent?.trim())).toEqual(['Men event', 'Women event', 'Mixed event']);
    expect(element.querySelectorAll('section p-card')).toHaveLength(3);
    expect([...element.querySelectorAll('a[href*="/draws/"]')].map((link) => link.getAttribute('href'))).toEqual([
      '/competition/test-competition/sub-events/men/draws/draw-men',
      '/competition/test-competition/sub-events/mixed/draws/draw-mixed',
    ]);
  });

  it('updates shortcut labels when the locale changes', () => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('nl', {
      all: {
        competition: {
          subEvents: 'Reeksen',
          draws: 'Reeks',
          types: {
            men: 'Mannen competitie',
            women: 'Vrouwen competitie',
            mix: 'Gemengde competitie',
          },
        },
      },
    });
    translations.use('nl');
    harness.detectChanges();
    expect(element.querySelector('section nav button')?.textContent?.trim()).toBe('Mannen competitie (1)');
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('Reeksen & Reeks');
  });

  it('uses native link buttons in lists with draw metadata and named external links', () => {
    const lists = element.querySelectorAll('article ul');
    expect(lists).toHaveLength(2);
    const link = lists[0].querySelector('a');
    expect(link?.classList.contains('p-button')).toBe(true);
    expect(link?.classList.contains('p-button-outlined')).toBe(true);
    expect(link?.getAttribute('role')).not.toBe('button');
    expect(link?.querySelector('[pButtonLabel]')?.textContent).toContain('Men draw');
    expect(link?.textContent).toContain('POULE');
    expect(link?.textContent).toContain('S9');
    const external = lists[0].querySelector('a[target="_blank"]');
    expect(external?.getAttribute('href')).toBe('https://www.toernooi.nl/sport/league/draw?id=competition-code&draw=draw-code');
    expect(external?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(external?.getAttribute('aria-label')).toBe('Men draw (toernooi.nl)');
    expect(external?.classList.contains('p-button-text')).toBe(true);
    expect(external?.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    expect(lists[1].querySelectorAll('a')).toHaveLength(1);
    expect(lists[1].textContent).not.toContain('S9');
  });

  it('preserves fallback names and ordering while allowing long names to wrap', async () => {
    const competition = createCompetition();
    const longName = 'A very long draw name '.repeat(8);
    competition.competitionSubEvents[1].competitionDraws = [
      { id: 'long-draw', name: longName },
      { id: '12345678-rest', name: '', visualCode: 'fallback-code' },
    ];
    query.mockReturnValue(of({ data: { competitionEvent: competition } }));
    await harness.navigateByUrl('/competition/long-draw-names');
    await harness.fixture.whenStable();
    harness.detectChanges();
    const links = [...element.querySelectorAll('article ul a[href*="/draws/"]')];
    expect(links.map((link) => link.textContent?.trim())).toEqual(['Draw 12345678', longName.trim(), 'Mixed draw']);
    expect(links[0].getAttribute('href')).toBe('/competition/test-competition/sub-events/men/draws/12345678-rest');
    const name = links[1].querySelector('[pButtonLabel] > span');
    expect(name?.classList.contains('whitespace-normal')).toBe(true);
    expect(name?.classList.contains('break-words')).toBe(true);
    expect(name?.classList.contains('truncate')).toBe(false);
    expect(links[1].closest('p-card')?.classList.contains('min-w-0')).toBe(true);
    expect(element.querySelector('article a[target="_blank"]')?.getAttribute('aria-label')).toBe('Draw 12345678 (toernooi.nl)');
  });

  it('uses the existing translated empty copy in a native secondary Message', () => {
    const card = [...element.querySelectorAll('article')].find((article) => article.querySelector('h4')?.textContent?.includes('Women event'));
    const message = card?.querySelector('p-message');
    expect(card?.querySelector('ul')).toBeNull();
    expect(message?.classList.contains('p-message-secondary')).toBe(true);
    expect(message?.textContent?.trim()).toBe('No draws configured yet');
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('nl', {
      all: { competition: { noDrawsYet: 'Nog geen reeksen' } },
    });
    translations.use('nl');
    harness.detectChanges();
    expect(message?.textContent?.trim()).toBe('Nog geen reeksen');
  });

  it('renders static info metadata Tags in order and updates the translated label', () => {
    const tags = [...element.querySelectorAll('article')][0].querySelectorAll('p-tag');
    const text = () => [...tags].map((tag) => tag.textContent?.trim().replace(/\s+/g, ' '));
    expect(text()).toEqual(['Max level 4', '32 - 48', 'M']);
    tags.forEach((tag) => {
      expect(tag.classList.contains('p-tag-info')).toBe(true);
      expect(tag.hasAttribute('tabindex')).toBe(false);
      expect(tag.hasAttribute('style')).toBe(false);
      expect(tag.querySelector('button, a, [tabindex]')).toBeNull();
    });
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('nl', {
      all: { competition: { maxLevel: 'Max niveau' } },
    });
    translations.use('nl');
    harness.detectChanges();
    expect(text()).toEqual(['Max niveau 4', '32 - 48', 'M']);
  });

  it.each([
    { name: 'lower bound only', maxLevel: 4, minBaseIndex: 32, maxBaseIndex: null, eventType: 'M', expected: ['Max level 4', '32', 'M'] },
    { name: 'upper bound only', maxLevel: null, minBaseIndex: null, maxBaseIndex: 48, eventType: 'F', expected: ['48', 'F'] },
    { name: 'zero lower bound', maxLevel: 0, minBaseIndex: 0, maxBaseIndex: 48, eventType: 'MX', expected: ['48', 'MX'] },
    { name: 'zero upper bound', maxLevel: 4, minBaseIndex: 32, maxBaseIndex: 0, eventType: '', expected: ['Max level 4', '32'] },
    { name: 'all zeros', maxLevel: 0, minBaseIndex: 0, maxBaseIndex: 0, eventType: '', expected: [] },
    { name: 'null metadata', maxLevel: null, minBaseIndex: null, maxBaseIndex: null, eventType: null, expected: [] },
    { name: 'missing metadata', maxLevel: undefined, minBaseIndex: undefined, maxBaseIndex: undefined, eventType: undefined, expected: [] },
  ])('preserves metadata visibility for $name', async ({ maxLevel, minBaseIndex, maxBaseIndex, eventType, expected }) => {
    const competition = createCompetition();
    query.mockReturnValue(
      of({
        data: {
          competitionEvent: {
            ...competition,
            competitionSubEvents: [{ ...competition.competitionSubEvents[1], maxLevel, minBaseIndex, maxBaseIndex, eventType }],
          },
        },
      }),
    );
    await harness.navigateByUrl('/competition/metadata-conditions');
    await harness.fixture.whenStable();
    harness.detectChanges();
    const tags = [...element.querySelectorAll('article p-tag')];
    expect(tags.map((tag) => tag.textContent?.trim().replace(/\s+/g, ' '))).toEqual(expected);
    expect(element.querySelector('article a')?.getAttribute('href')).toBe('/competition/test-competition/sub-events/men/draws/draw-men');
  });

  it('omits the section and shortcuts when there are no groups', async () => {
    query.mockReturnValue(
      of({
        data: {
          competitionEvent: {
            ...createCompetition(),
            competitionSubEvents: [],
          },
        },
      }),
    );
    await harness.navigateByUrl('/competition/empty-competition');
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('section')).toBeNull();
  });
});
