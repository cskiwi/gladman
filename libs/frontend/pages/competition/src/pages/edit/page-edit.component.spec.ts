import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { CompetitionInfoComponent } from './components/competition-info/competition-info.component';
import { CompetitionDatesComponent } from './components/competition-dates/competition-dates.component';
import { CompetitionSettingsComponent } from './components/competition-settings/competition-settings.component';
import { PageEditComponent } from './page-edit.component';

describe('Competition editor chrome and actions', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  let harness: RouterTestingHarness;
  let component: PageEditComponent;
  let element: HTMLElement;
  let info: CompetitionInfoComponent;
  let dates: CompetitionDatesComponent;
  let settings: CompetitionSettingsComponent;
  const permissions = { hasAnyPermission: jest.fn(() => true) };
  const mutate = jest.fn(() => {
    throw new Error('Unexpected competition mutation');
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
    permissions.hasAnyPermission.mockReturnValue(true);
    mutate.mockClear();
    await TestBed.configureTestingModule({
      imports: [PageEditComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: 'competition/:competitionId/edit', component: PageEditComponent }]),
        { provide: AuthService, useValue: permissions },
        {
          provide: Apollo,
          useValue: {
            query: () =>
              of({
                data: {
                  competitionEvent: {
                    id: 'safe-competition',
                    name: 'Safe competition',
                    slug: 'safe-competition',
                    season: 2026,
                    official: true,
                  },
                },
              }),
            mutate,
          },
        },
      ],
    }).compileComponents();
    harness = await RouterTestingHarness.create();
    await mount();
  });

  async function mount(): Promise<void> {
    component = await harness.navigateByUrl('/competition/safe-competition/edit', PageEditComponent);
    await settle();
    const root = harness.routeDebugElement;
    if (!root) throw new Error('Editor did not mount');
    element = root.nativeElement;
    info = root.query(By.directive(CompetitionInfoComponent)).componentInstance;
    dates = root.query(By.directive(CompetitionDatesComponent)).componentInstance;
    settings = root.query(By.directive(CompetitionSettingsComponent)).componentInstance;
  }

  async function settle(): Promise<void> {
    harness.detectChanges();
    await harness.fixture.whenStable();
    harness.detectChanges();
  }

  async function selectTab(index: number): Promise<void> {
    element.querySelectorAll<HTMLElement>('[role="tab"]')[index].click();
    await settle();
  }

  it('routes native tab selection to only the selected dirty child without mutations', async () => {
    const saves = [
      jest.spyOn(info, 'saveInfo').mockResolvedValue(),
      jest.spyOn(dates, 'saveDates').mockResolvedValue(),
      jest.spyOn(settings, 'saveSettings').mockResolvedValue(),
    ];
    info.infoForm.markAsDirty();
    dates.datesForm.markAsDirty();
    settings.settingsForm.markAsDirty();
    for (const index of [1, 2, 0]) {
      saves.forEach((save) => save.mockClear());
      await selectTab(index);
      expect(component.activeTabIndex()).toBe(String(index));
      expect(element.querySelectorAll('[role="tab"][aria-selected="true"]')).toHaveLength(1);
      await component.saveCurrentTab();
      expect(saves.map((save) => save.mock.calls.length)).toEqual([0, 1, 2].map((value) => Number(value === index)));
    }
    info.infoForm.markAsPristine();
    saves.forEach((save) => save.mockClear());
    await component.saveCurrentTab();
    expect(saves.every((save) => save.mock.calls.length === 0)).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('preserves unsaved values across tabs and exposes a native warning', async () => {
    expect(element.querySelector<HTMLButtonElement>('header button:last-child')?.disabled).toBe(true);
    info.infoForm.controls['name'].setValue('Safe unsaved name');
    info.infoForm.markAsDirty();
    await selectTab(2);
    await selectTab(0);
    expect(info.infoForm.controls['name'].value).toBe('Safe unsaved name');
    expect(info.infoForm.dirty).toBe(true);
    expect(element.querySelector('p-card p-tabs')).not.toBeNull();
    expect(element.querySelector('p-message[severity="warn"][role="alert"]')?.textContent).toContain('all.competition.edit.messages.unsaved-changes');
    expect(element.querySelector<HTMLButtonElement>('header button:last-child')?.disabled).toBe(false);
    expect([...element.querySelectorAll('p-tab i')].every((icon) => icon.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each([0, 1, 2])('blocks overlapping actions during child %i saving and restores them after failure', async (index) => {
    const saves = [
      jest.spyOn(info, 'saveInfo').mockResolvedValue(),
      jest.spyOn(dates, 'saveDates').mockResolvedValue(),
      jest.spyOn(settings, 'saveSettings').mockResolvedValue(),
    ];
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const saving = [info.savingInfo, dates.savingDates, settings.savingSettings][index];
    const error = [info.error, dates.error, settings.error][index];
    info.infoForm.markAsDirty();
    await selectTab(index);
    saving.set(true);
    await settle();
    expect([...element.querySelectorAll<HTMLButtonElement>('header button')].every((button) => button.disabled)).toBe(true);
    expect(element.querySelector('p-tabs')?.getAttribute('aria-busy')).toBe('true');
    await component.saveCurrentTab();
    await component.saveAll();
    component.cancel();
    expect(saves.every((save) => save.mock.calls.length === 0)).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
    error.set('Safe stored failure');
    saving.set(false);
    await settle();
    expect([...element.querySelectorAll<HTMLButtonElement>('header button')].every((button) => !button.disabled)).toBe(true);
    expect(element.querySelector('p-tabs')?.getAttribute('aria-busy')).toBe('false');
    expect(element.textContent).toContain('Safe stored failure');
    expect(info.infoForm.dirty).toBe(true);
    component.cancel();
    expect(navigate).toHaveBeenCalledWith(['..'], expect.objectContaining({ relativeTo: expect.anything() }));
    expect(mutate).not.toHaveBeenCalled();
  });

  it('names native loading progress and renders stored load errors without custom styling', async () => {
    component.loadingCompetition.set(true);
    await settle();
    const status = element.querySelector('[role="status"]');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.getAttribute('aria-atomic')).toBe('true');
    expect(status?.textContent).toContain('all.competition.edit.messages.loading');
    expect(element.querySelector('[role="progressbar"]')?.getAttribute('aria-labelledby')).toBe('competition-editor-loading-status');
    expect(element.querySelector('[role="progressbar"]')?.hasAttribute('aria-valuenow')).toBe(false);
    component.error.set('Safe stored load error');
    component.loadingCompetition.set(false);
    await settle();
    expect(element.querySelector('[role="status"]')).toBeNull();
    expect(element.querySelector('p-message[severity="error"][role="alert"]')?.textContent).toContain('Safe stored load error');
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('preserves read-only child permissions across native tab changes', async () => {
    permissions.hasAnyPermission.mockReturnValue(false);
    component.loadingCompetition.set(true);
    await settle();
    component.loadingCompetition.set(false);
    await mount();
    for (const index of [1, 2, 0]) await selectTab(index);
    expect([info.infoForm, dates.datesForm, settings.settingsForm].every((form) => form.disabled && form.pristine)).toBe(true);
    expect(element.querySelector<HTMLInputElement>('#name')?.disabled).toBe(true);
    expect(component.hasUnsavedChanges).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });
});
