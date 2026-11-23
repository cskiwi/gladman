import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { Subject, of, throwError } from 'rxjs';
import { SyncButtonComponent, SyncButtonConfig, SyncLevel } from './sync-button.component';

describe('SyncButtonComponent', () => {
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
    mutate.mockReset();
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

  const mountedCases = [
    {
      level: 'event',
      idKey: 'eventId',
      nameKey: 'eventName',
      syncKey: 'event',
      operation: 'TriggerEventSync',
      cacheOperation: 'ClearEventCache',
      cacheKey: 'clearTournamentApiCache',
    },
    {
      level: 'sub-event',
      idKey: 'subEventId',
      nameKey: 'subEventName',
      syncKey: 'subEvent',
      operation: 'TriggerSubEventSync',
      cacheOperation: 'ClearSubEventCache',
      cacheKey: 'clearSubEventApiCache',
    },
    {
      level: 'draw',
      idKey: 'drawId',
      nameKey: 'drawName',
      syncKey: 'draw',
      operation: 'TriggerDrawSync',
      cacheOperation: 'ClearDrawCache',
      cacheKey: 'clearDrawApiCache',
    },
  ] as const;
  const locales = ['en', 'nl_BE', 'fr_BE'] as const;
  const headings = {
    en: { success: 'Success', error: 'Error', cache: 'Clear API Cache' },
    nl_BE: { success: 'Succes', error: 'Fout', cache: 'API Cache wissen' },
    fr_BE: { success: 'Succès', error: 'Erreur', cache: "Vider le cache de l'API" },
  };
  const failures = {
    en: ['Failed to sync Example', 'Failed to sync sub-event Example', 'Failed to sync draw Example'],
    nl_BE: ['Synchronisatie van Example mislukt', 'Synchronisatie van onderdeel Example mislukt', 'Synchronisatie van reeks Example mislukt'],
    fr_BE: [
      'Échec de la synchronisation de Example',
      'Échec de la synchronisation du sous-événement Example',
      'Échec de la synchronisation du tableau Example',
    ],
  };
  const cacheDetails = {
    en: ['Cleared cached API entries', 'No cache entries found', 'Failed to clear API cache'],
    nl_BE: ['API-cache gewist', 'Geen cache-items gevonden', 'API-cache wissen mislukt'],
    fr_BE: ['Cache API vidé', 'Aucune entrée de cache trouvée', "Échec de la suppression du cache de l'API"],
  };

  function notificationSpy() {
    return jest.spyOn(fixture.debugElement.injector.get(MessageService), 'add');
  }

  function expectUsableMessage(message: { summary?: string; detail?: string }) {
    expect(message.summary).toBeTruthy();
    expect(message.detail).toBeTruthy();
    expect(`${message.summary} ${message.detail}`).not.toMatch(/all\.|undefined|\{\{/);
  }

  describe.each(locales)('%s mounted notifications', (locale) => {
    it.each(mountedCases)('localizes $level queued and rejected sync outcomes', async ({ level, idKey, nameKey, syncKey }) => {
      fixture.componentRef.setInput('config', { level, [idKey]: 'safe-id', [nameKey]: 'Example' });
      translate.use(locale);
      const add = notificationSpy();
      const component = fixture.componentInstance;
      mutate.mockReturnValueOnce(of({ data: {} }));
      component.handleSyncClick(level);
      await fixture.whenStable();
      expect(add).toHaveBeenLastCalledWith({
        severity: 'success',
        summary: headings[locale].success,
        detail: translate.instant(`all.sync.button.${syncKey}SyncQueued`, { id: 'safe-id' }),
      });
      expect(add.mock.calls[0][0].detail).toContain('safe-id');

      mutate.mockReturnValueOnce(throwError(() => new Error('Rejected mock operation')));
      component.handleSyncClick(level);
      await fixture.whenStable();
      expect(add).toHaveBeenLastCalledWith({
        severity: 'error',
        summary: headings[locale].error,
        detail: failures[locale][mountedCases.findIndex((entry) => entry.level === level)],
      });
      expect(add).toHaveBeenCalledTimes(2);
      add.mock.calls.forEach(([message]) => expectUsableMessage(message));
      expect(component.loading()).toBe(false);
    });

    it.each(mountedCases)('keeps distinct $level cache cleared, empty and rejected outcomes', async ({ level, idKey, cacheKey }) => {
      fixture.componentRef.setInput('config', { level, [idKey]: 'safe-id' });
      translate.use(locale);
      const add = notificationSpy();
      mutate.mockReturnValueOnce(of({ data: { [cacheKey]: true } }));
      await fixture.componentInstance.clearCache(false);
      expect(add).toHaveBeenLastCalledWith({ severity: 'success', summary: headings[locale].success, detail: cacheDetails[locale][0] });

      mutate.mockReturnValueOnce(of({ data: { [cacheKey]: false } }));
      await fixture.componentInstance.clearCache(true);
      expect(add).toHaveBeenLastCalledWith({ severity: 'warn', summary: headings[locale].cache, detail: cacheDetails[locale][1] });

      mutate.mockReturnValueOnce(throwError(() => new Error('Rejected mock operation')));
      await fixture.componentInstance.clearCache(false);
      expect(add).toHaveBeenLastCalledWith({ severity: 'error', summary: headings[locale].error, detail: cacheDetails[locale][2] });
      expect(add).toHaveBeenCalledTimes(3);
      add.mock.calls.forEach(([message]) => expectUsableMessage(message));
      expect(fixture.componentInstance.loading()).toBe(false);
    });
  });

  it.each(mountedCases)(
    'preserves $level main/menu payloads and pending disablement through success and failure',
    async ({ level, idKey, operation, cacheOperation, cacheKey }) => {
      const config: SyncButtonConfig = { level, [idKey]: 'safe-id' };
      fixture.componentRef.setInput('config', config);
      const component = fixture.componentInstance;
      const actions = [
        { run: () => component.handleSyncClick(level), operation, variables: { [idKey]: 'safe-id', includeSubComponents: true } },
        { run: () => component.getSyncItems(level)[0].command(), operation, variables: { [idKey]: 'safe-id', includeSubComponents: false } },
        {
          run: () => component.getSyncItems(level)[2].command(),
          operation: cacheOperation,
          variables: { [idKey]: 'safe-id', includeChildren: false },
        },
        {
          run: () => component.getSyncItems(level)[3].command(),
          operation: cacheOperation,
          variables: { [idKey]: 'safe-id', includeChildren: true },
        },
      ];
      for (const [index, action] of actions.entries()) {
        const response = new Subject<{ data: Record<string, boolean> }>();
        mutate.mockReturnValueOnce(response);
        action.run();
        fixture.detectChanges();
        const buttons = Array.from(fixture.nativeElement.querySelectorAll('p-splitbutton button')) as HTMLButtonElement[];
        expect(buttons).toHaveLength(2);
        expect(buttons.every((button) => button.disabled)).toBe(true);
        const request = mutate.mock.calls.at(-1)![0];
        expect(request.variables).toEqual(action.variables);
        expect(request.mutation.definitions[0].name.value).toBe(action.operation);
        if (index % 2) response.error(new Error('Rejected mock operation'));
        else {
          response.next({ data: { [cacheKey]: true } });
          response.complete();
        }
        await fixture.whenStable();
        fixture.detectChanges();
        expect(buttons.every((button) => !button.disabled)).toBe(true);
      }
    },
  );

  it.each(mountedCases)('uses the $level ID when its display name is absent or blank', async ({ level, idKey, nameKey }) => {
    const add = notificationSpy();
    mutate.mockImplementation(() => throwError(() => new Error('Rejected mock operation')));
    for (const name of [undefined, '', '   ']) {
      fixture.componentRef.setInput('config', { level, [idKey]: 'safe-id', [nameKey]: name });
      fixture.componentInstance.handleSyncClick(level);
      await fixture.whenStable();
      const message = add.mock.calls.at(-1)![0];
      expectUsableMessage(message);
      expect(message.detail).toContain('safe-id');
    }
  });
});
