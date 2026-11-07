import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SyncButtonComponent } from '@app/frontend-components/sync';
import { SeoService } from '@app/frontend-modules-seo/service';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { PageDrawDetailComponent } from './page-draw-detail.component';

@Component({ selector: 'app-sync-button', template: '' })
class SyncStubComponent {
  readonly config = input<unknown>();
}

describe('Draw detail identity', () => {
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

  async function render(draw: ReturnType<typeof createDraw>, tournamentCode = 'tournament-code') {
    query.mockReturnValue(
      of({
        data: {
          tournamentEvent: { id: 'tournament', slug: 'test-tournament', name: 'Test tournament', visualCode: tournamentCode },
          tournamentSubEvent: { id: 'sub-event', name: 'Mixed', drawTournaments: [draw] },
          tournamentDraw: draw,
        },
      }),
    );
    component = await harness.navigateByUrl(`/tournament/tournament/sub-events/sub-event/draws/case-${++routeNumber}`, PageDrawDetailComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    if (!harness.routeNativeElement) throw new Error('Draw route did not mount');
    element = harness.routeNativeElement;
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
});
