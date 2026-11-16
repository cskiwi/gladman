import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { CompetitionSettingsComponent } from './competition-settings.component';

describe('Competition settings presentation', () => {
  let fixture: ComponentFixture<CompetitionSettingsComponent>;
  let component: CompetitionSettingsComponent;
  let element: HTMLElement;
  const permissions = { hasAnyPermission: jest.fn(() => true) };
  const mutate = jest.fn(() => {
    throw new Error('Unexpected competition mutation');
  });
  const fields = ['official', 'teamMatcher', 'usedRankingAmount', 'usedRankingUnit', 'checkEncounterForFilledIn'];

  beforeEach(async () => {
    permissions.hasAnyPermission.mockReturnValue(true);
    mutate.mockClear();
    await TestBed.configureTestingModule({
      imports: [CompetitionSettingsComponent, TranslateModule.forRoot()],
      providers: [{ provide: AuthService, useValue: permissions }, { provide: Apollo, useValue: { mutate } }, MessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(CompetitionSettingsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('names sections, native controls, hints and ranking step buttons', () => {
    for (const section of ['official', 'team-matching', 'ranking', 'validation']) {
      const titleId = `competition-settings-${section}-title`;
      expect(element.querySelector(`section[aria-labelledby="${titleId}"] h2`)?.id).toBe(titleId);
    }
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('all.competition.edit.settings.official');
    for (const field of fields) {
      expect(element.querySelectorAll(`#${field}`)).toHaveLength(1);
      if (field === 'usedRankingUnit') {
        expect(element.querySelector(`#${field}`)?.getAttribute('aria-labelledby')).toBe('competition-settings-ranking-unit-label');
      } else {
        const input = element.querySelector<HTMLInputElement>(`input#${field}`);
        expect(input?.labels?.[0]?.textContent).toContain(`all.competition.edit.settings.${field}`);
        const hintId = input?.getAttribute('aria-describedby');
        expect(hintId).toBeTruthy();
        expect(element.querySelector(`#${hintId}`)?.textContent).toContain(`all.competition.edit.settings.${field}.`);
      }
    }
    const buttons = element.querySelectorAll('p-inputnumber button');
    expect([...buttons].map((button) => button.getAttribute('aria-label'))).toEqual([
      'all.competition.edit.settings.usedRankingAmount +',
      'all.competition.edit.settings.usedRankingAmount -',
    ]);
  });

  it('connects checkbox labels and matcher editing to form state without saving', async () => {
    element.querySelector<HTMLLabelElement>('label[for="official"]')?.click();
    element.querySelector<HTMLLabelElement>('label[for="checkEncounterForFilledIn"]')?.click();
    const matcher = element.querySelector<HTMLInputElement>('input#teamMatcher');
    if (!matcher) throw new Error('Missing team matcher input');
    matcher.value = 'safe-preview';
    matcher.dispatchEvent(new Event('input'));
    matcher.dispatchEvent(new Event('blur'));
    await settle();
    expect(component.settingsForm.getRawValue()).toMatchObject({
      official: true,
      checkEncounterForFilledIn: true,
      teamMatcher: 'safe-preview',
    });
    expect(component.settingsForm.dirty).toBe(true);
    expect(component.settingsForm.get('teamMatcher')?.touched).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('preserves populated and empty values when permission disables controls', async () => {
    permissions.hasAnyPermission.mockReturnValue(false);
    fixture.destroy();
    fixture = TestBed.createComponent(CompetitionSettingsComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.settingsForm.patchValue({
      official: true,
      teamMatcher: '',
      checkEncounterForFilledIn: true,
      usedRankingAmount: 24,
      usedRankingUnit: 'weeks',
    });
    await settle();
    for (const field of fields.filter((field) => field !== 'usedRankingUnit')) {
      expect(element.querySelector<HTMLInputElement>(`input#${field}`)?.disabled).toBe(true);
    }
    expect(element.querySelector('#usedRankingUnit')?.getAttribute('aria-disabled')).toBe('true');
    expect(element.querySelector<HTMLInputElement>('input#official')?.checked).toBe(true);
    expect(element.querySelector<HTMLInputElement>('input#usedRankingAmount')?.value).toBe('24');
    expect(element.querySelector('#usedRankingUnit')?.textContent).toContain('Weeks');
    expect(component.settingsForm.disabled).toBe(true);
    expect(component.settingsForm.pristine).toBe(true);
    expect(component.settingsForm.untouched).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('names saving progress and retains stored errors and form values across transitions', async () => {
    const values = component.settingsForm.getRawValue();
    component.error.set('Test stored error');
    component.savingSettings.set(true);
    await settle();
    const statusId = 'competition-settings-saving-status';
    const status = element.querySelector(`#${statusId}`);
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.getAttribute('aria-atomic')).toBe('true');
    expect(status?.textContent).toContain('all.competition.edit.settings.messages.saving');
    expect(element.querySelector('[role="progressbar"]')?.getAttribute('aria-labelledby')).toBe(statusId);
    expect(element.querySelector('[role="progressbar"]')?.hasAttribute('aria-valuenow')).toBe(false);
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Test stored error');
    component.savingSettings.set(false);
    await settle();
    expect(element.querySelector('[role="progressbar"]')).toBeNull();
    expect(element.querySelector(`#${statusId}`)).toBeNull();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Test stored error');
    expect(component.settingsForm.getRawValue()).toEqual(values);
    expect(component.settingsForm.pristine).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });
});
