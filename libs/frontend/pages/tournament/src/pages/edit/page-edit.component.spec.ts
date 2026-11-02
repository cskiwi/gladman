import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { of, Subject, throwError } from 'rxjs';
import { PageEditComponent } from './page-edit.component';
import { TournamentInfoComponent } from './components/tournament-info/tournament-info.component';
import { TournamentSettingsComponent } from './components/tournament-settings/tournament-settings.component';

describe('Tournament editing chrome', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  let query: jest.Mock;
  let mutate: jest.Mock;
  let hasAnyPermission: jest.Mock;

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
    query = jest.fn(() => of({ data: { tournamentEvent: { id: 'event', name: 'Safe tournament', official: true } } }));
    mutate = jest.fn();
    hasAnyPermission = jest.fn(() => false);
    await TestBed.configureTestingModule({
      imports: [PageEditComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: 'tournament/:tournamentId/edit', component: PageEditComponent }]),
        { provide: Apollo, useValue: { query, mutate } },
        { provide: AuthService, useValue: { hasAnyPermission } },
      ],
    }).compileComponents();
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('en', {
      all: {
        tournament: {
          edit: {
            title: 'Edit tournament',
            subtitle: 'Update tournament information and settings',
            tabs: { info: 'Information', settings: 'Settings' },
            actions: { cancel: 'Cancel', 'save-current': 'Save current', 'save-all': 'Save all' },
            messages: { 'unsaved-changes': 'Unsaved changes' },
          },
        },
      },
    });
    translations.use('en');
  });

  async function mount(settle = true) {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/tournament/event/edit', PageEditComponent);
    if (settle) await harness.fixture.whenStable();
    harness.detectChanges();
    const element = harness.routeNativeElement;
    if (!element) throw new Error('Editing route did not mount');
    return { harness, component, element };
  }

  function children(harness: RouterTestingHarness) {
    const info = harness.fixture.debugElement.query(By.directive(TournamentInfoComponent)).componentInstance as TournamentInfoComponent;
    const settings = harness.fixture.debugElement.query(By.directive(TournamentSettingsComponent)).componentInstance as TournamentSettingsComponent;
    return { info, settings };
  }

  it('renders localized heading, real context, native Card and unchanged permission-disabled forms', async () => {
    const { harness, element } = await mount();
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('h1')?.textContent).toContain('Edit tournament');
    expect(element.querySelector('header')?.textContent).toContain('Safe tournament');
    expect(element.querySelector('.t-eyebrow')).toBeNull();
    expect(element.querySelector('p-card .p-card-body p-tabs')).not.toBeNull();
    const { info, settings } = children(harness);
    expect(info.infoForm.disabled).toBe(true);
    expect(settings.settingsForm.disabled).toBe(true);
    expect(info.infoForm.getRawValue().name).toBe('Safe tournament');
    expect(settings.settingsForm.getRawValue().official).toBe(true);
    expect(query).toHaveBeenCalledWith(expect.objectContaining({ variables: { id: 'event' }, fetchPolicy: 'network-only' }));
    expect(mutate).not.toHaveBeenCalled();
  });

  it('uses native button labels, preserves cancel and disables Save all when pristine', async () => {
    const { element, component } = await mount();
    const buttons = Array.from(element.querySelectorAll<HTMLButtonElement>('header button[pButton]'));
    expect(buttons.map((button) => button.querySelector('[pButtonLabel]')?.textContent?.trim())).toEqual(['Cancel', 'Save current', 'Save all']);
    expect(buttons.every((button) => button.type === 'button')).toBe(true);
    expect(buttons[2].disabled).toBe(true);
    expect(element.querySelector('p-button')).toBeNull();
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    buttons[0].click();
    expect(navigate).toHaveBeenCalledWith(['..'], expect.objectContaining({ relativeTo: expect.anything() }));
    expect(component.hasUnsavedChanges).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('keeps responsive native loading skeletons until the read resolves', async () => {
    const response = new Subject<{ data: { tournamentEvent: { id: string; name: string } } }>();
    query.mockReturnValue(response);
    const { harness, element } = await mount(false);
    expect(element.querySelectorAll('p-skeleton')).toHaveLength(3);
    expect(element.querySelector('p-card p-skeleton')).not.toBeNull();
    expect(element.querySelector('p-skeleton[width]')).toBeNull();
    expect(element.querySelector('p-tabs')).toBeNull();
    response.next({ data: { tournamentEvent: { id: 'event', name: 'Loaded tournament' } } });
    response.complete();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('p-skeleton')).toBeNull();
    expect(element.querySelector('header')?.textContent).toContain('Loaded tournament');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('uses native read-error feedback without rendering forms or throwing', async () => {
    query.mockReturnValue(throwError(() => new Error('Safe read failure')));
    const { element } = await mount();
    expect(element.querySelector('p-message[role="alert"]')?.textContent).toContain('Failed to load tournament data');
    expect(element.querySelector('.p-message-error')).not.toBeNull();
    expect(element.querySelector('p-tabs')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('uses native unsaved warning and enables Save all when an authorized form is dirty', async () => {
    hasAnyPermission.mockReturnValue(true);
    const { harness, element } = await mount();
    const { info } = children(harness);
    expect(info.infoForm.enabled).toBe(true);
    const name = element.querySelector<HTMLInputElement>('#name');
    if (!name) throw new Error('Tournament name input missing');
    name.value = 'Changed safe tournament';
    name.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('p-message[role="alert"]')?.textContent).toContain('Unsaved changes');
    expect(element.querySelector('.p-message-warn')).not.toBeNull();
    expect(element.querySelector<HTMLButtonElement>('header button:last-child')?.disabled).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('dispatches Save current to the visible Settings tab and back to Information', async () => {
    hasAnyPermission.mockReturnValue(true);
    const { harness, element, component } = await mount();
    const { info, settings } = children(harness);
    info.infoForm.markAsDirty();
    settings.settingsForm.markAsDirty();
    const saveInfo = jest.spyOn(info, 'saveInfo').mockResolvedValue();
    const saveSettings = jest.spyOn(settings, 'saveSettings').mockResolvedValue();
    const tabs = element.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs[1].click();
    harness.detectChanges();
    expect(component.activeTabIndex()).toBe('1');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    element.querySelectorAll<HTMLButtonElement>('header button')[1].click();
    await harness.fixture.whenStable();
    expect(saveSettings).toHaveBeenCalledTimes(1);
    expect(saveInfo).not.toHaveBeenCalled();
    tabs[0].click();
    harness.detectChanges();
    expect(component.activeTabIndex()).toBe('0');
    await component.saveCurrentTab();
    expect(saveInfo).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('does not save a pristine current tab and leaves child-handled rejection on its selected tab', async () => {
    hasAnyPermission.mockReturnValue(true);
    const { harness, component } = await mount();
    const { settings } = children(harness);
    component.activeTabIndex.set('1');
    const save = jest.spyOn(settings, 'saveSettings').mockRejectedValue(new Error('Child owns feedback'));
    await component.saveCurrentTab();
    expect(save).not.toHaveBeenCalled();
    settings.settingsForm.markAsDirty();
    await expect(component.saveCurrentTab()).resolves.toBeUndefined();
    expect(save).toHaveBeenCalledTimes(1);
    expect(component.activeTabIndex()).toBe('1');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('preserves no-change all-save notification without navigation', async () => {
    const { harness, component } = await mount();
    const notify = jest.spyOn(harness.fixture.debugElement.query(By.directive(PageEditComponent)).injector.get(MessageService), 'add');
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await component.saveAll();
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ severity: 'info', detail: 'No changes to save' }));
    expect(navigate).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('awaits both dirty forms before all-save success and relative navigation', async () => {
    hasAnyPermission.mockReturnValue(true);
    const { harness, component } = await mount();
    const { info, settings } = children(harness);
    info.infoForm.markAsDirty();
    settings.settingsForm.markAsDirty();
    let finishInfo: () => void = () => undefined;
    const saveInfo = jest.spyOn(info, 'saveInfo').mockReturnValue(new Promise<void>((resolve) => (finishInfo = resolve)));
    const saveSettings = jest.spyOn(settings, 'saveSettings').mockResolvedValue();
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const pending = component.saveAll();
    expect(saveInfo).toHaveBeenCalledTimes(1);
    expect(saveSettings).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
    finishInfo();
    await pending;
    expect(navigate).toHaveBeenCalledWith(['..'], expect.objectContaining({ relativeTo: expect.anything() }));
    expect(mutate).not.toHaveBeenCalled();
  });

  it('preserves all-save failure notification and does not navigate away', async () => {
    hasAnyPermission.mockReturnValue(true);
    const { harness, component } = await mount();
    const { settings } = children(harness);
    settings.settingsForm.markAsDirty();
    jest.spyOn(settings, 'saveSettings').mockRejectedValue(new Error('Safe fixture failure'));
    const notify = jest.spyOn(harness.fixture.debugElement.query(By.directive(PageEditComponent)).injector.get(MessageService), 'add');
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    await component.saveAll();
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error', detail: 'Some changes could not be saved' }));
    expect(navigate).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  });
});
