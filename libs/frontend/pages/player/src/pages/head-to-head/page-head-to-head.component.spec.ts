import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { Subject } from 'rxjs';
import { PageHeadToHeadComponent } from './page-head-to-head.component';

describe(PageHeadToHeadComponent.name, () => {
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  let fixture: ComponentFixture<PageHeadToHeadComponent>;
  let storedDismissal: string | null;
  let response: Subject<{ data: { player: { id: string; fullName: string; gamePlayerMemberships: never[] } } }>;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(() => true),
      }),
    });
  });

  afterAll(() => {
    if (originalMatchMedia) Object.defineProperty(window, 'matchMedia', originalMatchMedia);
    else Reflect.deleteProperty(window, 'matchMedia');
  });

  beforeEach(async () => {
    storedDismissal = localStorage.getItem('partners-explanation-dismissed');
    localStorage.removeItem('partners-explanation-dismissed');
    response = new Subject();
    TestBed.configureTestingModule({
      imports: [PageHeadToHeadComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: AuthService, useValue: {} }, { provide: Apollo, useValue: { query: jest.fn(() => response) } }],
    });
    fixture = TestBed.createComponent(PageHeadToHeadComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    if (storedDismissal === null) localStorage.removeItem('partners-explanation-dismissed');
    else localStorage.setItem('partners-explanation-dismissed', storedDismissal);
  });

  function panelToggle(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('p-panel button');
  }

  it('provides a named native toggle and retains edited filters when collapsed and reopened', async () => {
    const host: HTMLElement = fixture.nativeElement;
    const minimum = host.querySelector<HTMLInputElement>('#min-games-filter')!;
    minimum.value = '5';
    minimum.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const toggle = panelToggle();
    expect(toggle.getAttribute('aria-label')).toBe('all.head-to-head.filters.title');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(toggle.getAttribute('aria-controls')!)).not.toBeNull();

    toggle.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(host.querySelector<HTMLInputElement>('#min-games-filter')?.value).toBe('5');
    expect(fixture.componentInstance.filter.controls.minGames.value).toBe(5);
  });

  it('associates Select names with visible translated field labels in both modes', () => {
    const host: HTMLElement = fixture.nativeElement;
    const expectedLabels = ['view-mode-label', 'head-to-head-club-label', 'link-type-label', 'game-type-label'];
    expect(Array.from(host.querySelectorAll('p-panel p-select [role="combobox"]'), (element) => element.getAttribute('aria-labelledby'))).toEqual(
      expectedLabels,
    );
    expectedLabels.forEach((id) => expect(host.querySelector(`#${id}`)?.textContent).toContain('all.head-to-head.filters.'));

    fixture.componentInstance.filter.controls.viewMode.setValue('opponents');
    fixture.detectChanges();

    expect(host.querySelector('#head-to-head-club-filter')).toBeNull();
    expect(host.querySelector('#head-to-head-filter')?.getAttribute('aria-labelledby')).toBe('head-to-head-label');
    expect(host.querySelector('#opponent-club-filter')?.getAttribute('aria-labelledby')).toBe('opponent-club-label');
    expect(fixture.componentInstance.filter.controls.minGames.value).toBe(0);
  });

  it('names the searchable club input using its existing translated field label', async () => {
    const host: HTMLElement = fixture.nativeElement;
    host.querySelector<HTMLElement>('#head-to-head-club-filter')!.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const search = host.querySelector<HTMLInputElement>('.p-select-filter');
    expect(search?.getAttribute('aria-label')).toBe('all.head-to-head.filters.opponent-club');
    expect(search?.placeholder).toBe('all.head-to-head.filters.opponent-club');
  });

  it('renders the guidance title and content and persists named dismissal across remounts', async () => {
    const host: HTMLElement = fixture.nativeElement;
    const guidance = host.querySelector('p-card[role="region"]')!;
    expect(guidance.querySelector('h2')?.textContent).toContain('all.head-to-head.info.title');
    expect(guidance.querySelectorAll('li')).toHaveLength(4);
    guidance.querySelector<HTMLButtonElement>('button[aria-label="all.button.close"]')!.click();
    fixture.detectChanges();

    expect(host.querySelector('p-card[role="region"]')).toBeNull();
    expect(localStorage.getItem('partners-explanation-dismissed')).toBe('true');
    fixture.destroy();
    fixture = TestBed.createComponent(PageHeadToHeadComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('p-card[role="region"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('p-panel')).not.toBeNull();
  });

  it('shows named loading feedback until a successful query restores the unchanged grid', async () => {
    const host: HTMLElement = fixture.nativeElement;
    fixture.componentInstance.filter.controls.playerId.setValue('test-player');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(host.querySelector('[role="progressbar"]')?.getAttribute('aria-label')).toBe('all.head-to-head.grid.loading');
    expect(host.querySelector('[role="status"]')?.textContent).toContain('all.head-to-head.grid.loading');
    expect(host.querySelector('app-head-to-head-grid')).toBeNull();
    expect(host.querySelector('p-panel')).not.toBeNull();

    response.next({ data: { player: { id: 'test-player', fullName: 'Test Player', gamePlayerMemberships: [] } } });
    response.complete();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.querySelector('[role="progressbar"]')).toBeNull();
    expect(host.querySelector('p-message')).toBeNull();
    expect(host.querySelector('app-head-to-head-grid')).not.toBeNull();
    expect(host.querySelector('h1')?.textContent).toContain('all.head-to-head.title');
  });

  it('renders failures without reading a failed resource value and recovers after a filter change', async () => {
    const host: HTMLElement = fixture.nativeElement;
    fixture.componentInstance.filter.controls.playerId.setValue('test-player');
    fixture.detectChanges();
    await Promise.resolve();
    response.error(new HttpErrorResponse({ status: 503, statusText: 'Test service unavailable' }));
    await fixture.whenStable();
    expect(() => fixture.detectChanges()).not.toThrow();

    expect(host.querySelector('p-message [role="alert"], p-message[role="alert"]')?.textContent).toContain('Test service unavailable');
    expect(host.querySelector('app-head-to-head-grid')).toBeNull();
    expect(host.querySelector('[role="progressbar"]')).toBeNull();
    expect(host.querySelector('p-panel')).not.toBeNull();

    response = new Subject();
    fixture.componentInstance.filter.controls.minGames.setValue(1);
    fixture.detectChanges();
    await Promise.resolve();
    response.next({ data: { player: { id: 'test-player', fullName: 'Test Player', gamePlayerMemberships: [] } } });
    response.complete();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(host.querySelector('p-message')).toBeNull();
    expect(host.querySelector('app-head-to-head-grid')).not.toBeNull();
  });

  it.each([
    { failure: new Error('Safe query failure'), message: 'Safe query failure' },
    { failure: new Error(), message: 'Failed to load player' },
  ])('keeps non-HTTP and empty-message failures visible: $message', async ({ failure, message }) => {
    fixture.componentInstance.filter.controls.playerId.setValue('test-player');
    fixture.detectChanges();
    await Promise.resolve();
    response.error(failure);
    await fixture.whenStable();
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('p-message')?.textContent).toContain(message);
    expect(host.querySelector('app-head-to-head-grid')).toBeNull();
  });
});
