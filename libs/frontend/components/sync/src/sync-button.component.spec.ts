import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
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
      providers: [{ provide: Apollo, useValue: { mutate } }],
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
});
