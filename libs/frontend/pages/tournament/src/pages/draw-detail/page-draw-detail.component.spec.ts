import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SyncButtonComponent } from '@app/frontend-components/sync';
import { SeoService } from '@app/frontend-modules-seo/service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { PageDrawDetailComponent } from './page-draw-detail.component';

@Component({ selector: 'app-sync-button', template: '' })
class SyncStubComponent {
  readonly config = input<unknown>();
}

describe('Draw detail page', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  let harness: RouterTestingHarness;
  let component: PageDrawDetailComponent;
  let element: HTMLElement;
  let query: jest.Mock;
  let routeNumber: number;
  const createDraw = () => ({
    id: 'draw-12345678',
    name: 'Mixed Doubles',
    type: 'KO',
    size: 16,
    visualCode: 'draw-code',
    entries: [],
    games: [],
  });

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
    routeNumber = 0;
    query = jest.fn();
    await TestBed.configureTestingModule({
      imports: [PageDrawDetailComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: 'tournament/:tournamentId/sub-events/:subEventId/draws/:drawId', component: PageDrawDetailComponent }]),
        { provide: Apollo, useValue: { query } },
        { provide: SeoService, useValue: { update: jest.fn() } },
      ],
    })
      .overrideComponent(PageDrawDetailComponent, {
        remove: { imports: [SyncButtonComponent] },
        add: { imports: [SyncStubComponent] },
      })
      .compileComponents();
    harness = await RouterTestingHarness.create();
    await render(createDraw());
  });

  function resultFor(draw: ReturnType<typeof createDraw>, tournamentCode = 'tournament-code', draws = [draw]) {
    return {
      data: {
        tournamentEvent: { id: 'tournament', slug: 'test-tournament', name: 'Test tournament', visualCode: tournamentCode },
        tournamentSubEvent: { id: 'sub-event', name: 'Mixed', drawTournaments: draws },
        tournamentDraw: draw,
      },
    };
  }

  async function navigate() {
    component = await harness.navigateByUrl(`/tournament/tournament/sub-events/sub-event/draws/case-${++routeNumber}`, PageDrawDetailComponent);
    harness.detectChanges();
    if (!harness.routeNativeElement) throw new Error('Draw route did not mount');
    element = harness.routeNativeElement;
  }

  async function settle() {
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  async function render(draw: ReturnType<typeof createDraw>, tournamentCode = 'tournament-code', draws = [draw]) {
    query.mockReturnValue(of(resultFor(draw, tournamentCode, draws)));
    await navigate();
    await settle();
  }

  it('uses shared identity primitives and native secondary metadata without changing sync configuration', () => {
    expect(element.querySelector('app-hero-title h1')?.textContent).toContain('Mixed Doubles');
    expect(element.querySelector('app-hero-avatar p-avatar')?.textContent).toContain('MD');
    expect(Array.from(element.querySelectorAll('app-hero p-tag')).map((tag) => tag.textContent)).toEqual(['KO', 'Size 16']);
    expect(component.syncConfig()).toEqual({
      level: 'draw',
      drawId: 'draw-12345678',
      eventName: 'Test tournament',
      subEventName: 'Mixed',
      drawName: 'Mixed Doubles',
    });
  });

  it('preserves an accessible isolated external link and tournament breadcrumb', () => {
    const link = element.querySelector<HTMLAnchorElement>('app-hero a');
    expect(link?.href).toBe('https://www.toernooi.nl/tournament/tournament-code/draw/draw-code');
    expect(link?.getAttribute('aria-label')).toBe('Mixed Doubles (toernooi.nl)');
    expect(link?.target).toBe('_blank');
    expect(link?.rel).toBe('noopener noreferrer');
    expect(link?.classList.contains('p-button')).toBe(true);
    expect(link?.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    expect(element.querySelector('app-breadcrumb a[href="/tournament/test-tournament"]')?.textContent).toContain('Test tournament');
  });

  it('retains unnamed draw fallback and omits absent metadata and external action', async () => {
    await render({ ...createDraw(), name: '', type: '', size: 0, visualCode: '' });
    expect(element.querySelector('h1')?.textContent).toContain('Draw draw-123');
    expect(element.querySelector('app-hero-avatar')?.textContent).toContain('DR');
    expect(element.querySelectorAll('app-hero p-tag')).toHaveLength(0);
    expect(element.querySelector('app-hero a')).toBeNull();
    expect(component.syncConfig()?.drawName).toBe('Draw');
  });

  it('requires both external codes and preserves single-word initials', async () => {
    await render({ ...createDraw(), name: 'Singles' }, '');
    expect(element.querySelector('app-hero-avatar')?.textContent).toContain('SIN');
    expect(element.querySelector('app-hero a')).toBeNull();
  });

  it('hides switching for one draw and preserves named, pressed multi-draw destinations', async () => {
    expect(element.querySelector('#draw-switcher-title')).toBeNull();
    const selected = { ...createDraw(), id: 'case-2' };
    const unnamed = { ...createDraw(), id: 'another-12345678', name: '' };
    await render(selected, 'tournament-code', [selected, unnamed]);
    const section = element.querySelector('section[aria-labelledby="draw-switcher-title"]');
    const buttons = section?.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons).toHaveLength(2);
    expect(buttons?.[0].textContent).toContain('Mixed Doubles');
    expect(buttons?.[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons?.[1].textContent).toContain('Draw another-');
    expect(buttons?.[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons?.[1].type).toBe('button');
    buttons?.[1].click();
    await settle();
    expect(TestBed.inject(Router).url).toBe('/tournament/test-tournament/sub-events/sub-event/draws/another-12345678');
    expect(query.mock.calls.at(-1)?.[0].variables).toEqual({
      tournamentId: 'test-tournament',
      subEventId: 'sub-event',
      drawId: 'another-12345678',
    });
  });

  it('announces pending loading with native cards and hidden skeletons, then restores content', async () => {
    const pending = new Subject<ReturnType<typeof resultFor>>();
    query.mockReturnValue(pending);
    await navigate();
    expect(component.loading()).toBe(true);
    expect(element.querySelector('[aria-busy="true"] [role="status"]')?.textContent).toContain('all.tournament.edit.messages.loading');
    expect(element.querySelectorAll('p-card')).toHaveLength(2);
    expect(element.querySelectorAll('.p-skeleton[aria-hidden="true"]')).toHaveLength(28);
    expect(element.querySelector('app-hero')).toBeNull();
    pending.next(resultFor(createDraw()));
    pending.complete();
    await settle();
    expect(element.querySelector('[aria-busy="true"]')).toBeNull();
    expect(element.querySelector('app-hero')).not.toBeNull();
  });

  it('renders a real request failure without throwing from selectors and recovers on navigation', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation();
    try {
      query.mockReturnValue(throwError(() => new Error('Fixture request failure')));
      await navigate();
      await settle();
      expect(element.querySelector('p-message[severity="error"][role="alert"]')?.textContent).toContain('An error occurred');
      expect(component.tournament()).toBeUndefined();
      expect(component.subEvent()).toBeUndefined();
      expect(component.draw()).toBeUndefined();
      expect(component.draws()).toEqual([]);
      expect(component.standings()).toEqual([]);
      expect(component.games()).toEqual([]);
      expect(component.syncConfig()).toBeNull();
      expect(element.querySelector('app-hero')).toBeNull();
      expect(log).toHaveBeenCalled();
      await render(createDraw());
      expect(component.error()).toBeNull();
      expect(element.querySelector('p-message[severity="error"]')).toBeNull();
      expect(element.querySelector('app-hero')).not.toBeNull();
    } finally {
      log.mockRestore();
    }
  });

  it('reports a missing draw response as an explicit error instead of a blank or empty success', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation();
    try {
      query.mockReturnValue(of({ data: { ...resultFor(createDraw()).data, tournamentDraw: null } }));
      await navigate();
      await settle();
      expect(component.error()).toBe('An error occurred');
      expect(element.querySelector('p-message[severity="error"]')).not.toBeNull();
      expect(element.querySelector('app-draw-games')).toBeNull();
    } finally {
      log.mockRestore();
    }
  });

  it.each([
    ['KO', 'No Tournament Tree', "This knockout draw doesn't have any tournament data yet."],
    ['POULE', 'No Standings', "This draw doesn't have any standings data yet."],
  ])('preserves %s empty feedback and the games child', async (type, title, description) => {
    await render({ ...createDraw(), type });
    const message = element.querySelector('p-message[severity="secondary"]');
    expect(message?.querySelector('h2')?.textContent).toBe(title);
    expect(message?.textContent).toContain(description);
    expect(message?.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    expect(element.querySelector('app-draw-games')).not.toBeNull();
    expect(element.querySelector('app-draw-ko-tree')).toBeNull();
    expect(element.querySelector('app-draw-standings-table')).toBeNull();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses existing %s locale assets for switching and loading labels', async (locale) => {
    const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: { tournament: { draws: string; edit: { messages: { loading: string } } } } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: asset });
    translate.use(locale);
    await render(createDraw(), 'tournament-code', [createDraw(), { ...createDraw(), id: 'another' }]);
    expect(element.querySelector('#draw-switcher-title')?.textContent).toContain(asset.tournament.draws);
    const pending = new Subject<ReturnType<typeof resultFor>>();
    query.mockReturnValue(pending);
    await navigate();
    expect(element.querySelector('[role="status"]')?.textContent).toContain(asset.tournament.edit.messages.loading);
    pending.next(resultFor(createDraw()));
    pending.complete();
    await settle();
  });
});
