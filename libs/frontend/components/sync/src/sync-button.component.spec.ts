import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { providePrimeNG } from 'primeng/config';
import { SyncButtonComponent, SyncLevel } from './sync-button.component';

describe('SyncButtonComponent dropdown naming', () => {
  let fixture: ComponentFixture<SyncButtonComponent>;
  let translate: TranslateService;
  const mutate = jest.fn();
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');

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
    await TestBed.configureTestingModule({
      imports: [SyncButtonComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { mutate } }, providePrimeNG({ overlayAppendTo: 'body' })],
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    for (const locale of ['en', 'nl_BE', 'fr_BE']) {
      const all = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
      translate.setTranslation(locale, { all });
    }
    translate.use('en');
    mutate.mockClear();
    fixture = TestBed.createComponent(SyncButtonComponent);
    fixture.componentRef.setInput('config', {
      level: 'event',
      eventId: 'test-event',
    });
  });

  it.each<SyncLevel>(['event', 'sub-event', 'draw', 'game'])('names the native %s dropdown separately from the unchanged main action', (level) => {
    fixture.componentRef.setInput('config', { level });
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const dropdown = element.querySelector<HTMLButtonElement>('.p-splitbutton-dropdown');
    expect(dropdown?.getAttribute('aria-label')).toBe('More sync actions');
    expect(dropdown?.getAttribute('aria-haspopup')).toBe('true');
    expect(element.querySelector('.p-splitbutton-button')?.getAttribute('aria-label')).toBe('Full Sync');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('updates the native name from the actual locale assets without recreating the control', () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const dropdown = element.querySelector('.p-splitbutton-dropdown');

    translate.use('nl_BE');
    fixture.detectChanges();
    expect(dropdown?.getAttribute('aria-label')).toBe('Meer synchronisatieacties');

    translate.use('fr_BE');
    fixture.detectChanges();
    expect(dropdown?.getAttribute('aria-label')).toBe('Autres actions de synchronisation');

    translate.use('en');
    fixture.detectChanges();
    expect(dropdown?.getAttribute('aria-label')).toBe('More sync actions');
  });

  it('retains the translated name while loading disables and re-enables both native buttons', () => {
    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(element.querySelectorAll<HTMLButtonElement>('p-splitbutton button'));
    expect(buttons).toHaveLength(2);
    expect(buttons.every((button) => button.disabled)).toBe(true);
    expect(buttons[1].getAttribute('aria-label')).toBe('More sync actions');
    buttons[1].click();
    expect(buttons[1].getAttribute('aria-expanded')).toBe('false');
    expect(mutate).not.toHaveBeenCalled();

    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();
    expect(buttons.every((button) => !button.disabled)).toBe(true);
    expect(buttons[1].getAttribute('aria-label')).toBe('More sync actions');
  });

  async function openMenu(): Promise<{
    dropdown: HTMLButtonElement;
    menu: HTMLElement;
  }> {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const dropdown = element.querySelector<HTMLButtonElement>('.p-splitbutton-dropdown')!;
    dropdown.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const overlay = document.getElementById(dropdown.getAttribute('aria-controls')!);
    const menu = overlay!.querySelector<HTMLElement>('[role="menu"]')!;
    menu.focus();
    return { dropdown, menu };
  }

  it('returns Escape focus from the body-appended menu to its own dropdown without executing commands', async () => {
    const { dropdown, menu } = await openMenu();
    expect(fixture.nativeElement.contains(menu)).toBe(false);
    expect(document.activeElement).toBe(menu);

    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dropdown.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(dropdown);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('does not redirect Escape from an unrelated overlay or the main sync button', async () => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const main = element.querySelector<HTMLButtonElement>('.p-splitbutton-button')!;
    const otherMenu = document.createElement('ul');
    otherMenu.setAttribute('role', 'menu');
    otherMenu.tabIndex = -1;
    document.body.append(otherMenu);
    try {
      otherMenu.focus();
      otherMenu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
      expect(document.activeElement).toBe(otherMenu);

      main.focus();
      main.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
      expect(document.activeElement).toBe(main);
      expect(mutate).not.toHaveBeenCalled();
    } finally {
      otherMenu.remove();
    }
  });

  it('does not restore dropdown focus for Tab dismissal or a subsequent outside Escape', async () => {
    const { dropdown, menu } = await openMenu();
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dropdown.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).not.toBe(dropdown);

    const outside = document.createElement('button');
    document.body.append(outside);
    try {
      outside.focus();
      outside.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
      expect(document.activeElement).toBe(outside);
      expect(mutate).not.toHaveBeenCalled();
    } finally {
      outside.remove();
    }
  });
});
