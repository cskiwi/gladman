import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { PageHeadToHeadComponent } from './page-head-to-head.component';

describe(PageHeadToHeadComponent.name, () => {
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  let fixture: ComponentFixture<PageHeadToHeadComponent>;

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
    TestBed.configureTestingModule({
      imports: [PageHeadToHeadComponent, TranslateModule.forRoot()],
      providers: [provideRouter([]), { provide: AuthService, useValue: {} }, { provide: Apollo, useValue: { query: jest.fn() } }],
    });
    fixture = TestBed.createComponent(PageHeadToHeadComponent);
    fixture.detectChanges();
    await fixture.whenStable();
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
});
