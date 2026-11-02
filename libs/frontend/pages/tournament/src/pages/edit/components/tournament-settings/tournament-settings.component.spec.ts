import { TestBed } from '@angular/core/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { print } from 'graphql';
import { MessageService } from 'primeng/api';
import { of, Subject, throwError } from 'rxjs';
import { TournamentSettingsComponent } from './tournament-settings.component';

describe('Tournament editing settings', () => {
  let mutate: jest.Mock;
  let hasAnyPermission: jest.Mock;
  const fields = ['official', 'allowGuestEnrollments', 'schedulePublished'];
  const labels = ['Official tournament', 'Allow guest enrollments', 'Schedule published'];

  beforeEach(async () => {
    mutate = jest.fn(() => of({ data: { updateTournamentEvent: { id: 'event' } } }));
    hasAnyPermission = jest.fn(() => true);
    await TestBed.configureTestingModule({
      imports: [TournamentSettingsComponent, TranslateModule.forRoot()],
      providers: [MessageService, { provide: Apollo, useValue: { mutate } }, { provide: AuthService, useValue: { hasAnyPermission } }],
    }).compileComponents();
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('en', {
      all: {
        tournament: {
          edit: {
            settings: {
              description: 'Configure tournament settings',
              official: labels[0],
              'official.title': 'Official settings',
              'official.description': 'Affects player rankings',
              enrollment: { title: 'Enrollment settings' },
              allowGuestEnrollments: labels[1],
              'allowGuestEnrollments.description': 'Allow players without a club',
              schedule: { title: 'Schedule settings' },
              schedulePublished: labels[2],
              'schedulePublished.description': 'Show the schedule to players',
              messages: { saving: 'Saving settings' },
            },
          },
        },
      },
    });
    translations.use('en');
  });

  async function mount(tournament = { id: 'event', official: true, allowGuestEnrollments: false, schedulePublished: false }) {
    const fixture = TestBed.createComponent(TournamentSettingsComponent);
    fixture.componentRef.setInput('tournament', tournament);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    return { fixture, component: fixture.componentInstance, element };
  }

  it('uses named semantic sections and translated native checkbox labels', async () => {
    const { element } = await mount();
    expect(Array.from(element.querySelectorAll('h2')).map((heading) => heading.textContent?.trim())).toEqual([
      'Official settings',
      'Enrollment settings',
      'Schedule settings',
    ]);
    expect(element.querySelectorAll('section')).toHaveLength(3);
    element.querySelectorAll('section').forEach((section) => {
      expect(element.querySelector(`#${section.getAttribute('aria-labelledby')}`)?.textContent).toBeTruthy();
    });
    expect(element.querySelectorAll('input[type="checkbox"]')).toHaveLength(3);
    fields.forEach((field, index) => {
      const input = element.querySelector<HTMLInputElement>(`input#${field}`);
      expect(input?.labels?.length).toBe(1);
      expect(input?.labels?.[0].textContent?.trim()).toBe(labels[index]);
    });
    expect(element.querySelectorAll('p-checkbox[id]')).toHaveLength(0);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('preserves permission-disabled values and prevents native label toggles', async () => {
    hasAnyPermission.mockReturnValue(false);
    const { component, element, fixture } = await mount();
    expect(hasAnyPermission).toHaveBeenCalledWith(['edit-any:tournament', 'event_edit:tournament']);
    expect(component.settingsForm.disabled).toBe(true);
    expect(Array.from(element.querySelectorAll('input')).every((input) => input.disabled)).toBe(true);
    element.querySelector<HTMLLabelElement>('label[for="official"]')?.click();
    fixture.detectChanges();
    expect(component.settingsForm.getRawValue()).toEqual({ official: true, allowGuestEnrollments: false, schedulePublished: false });
    expect(component.isDirty).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('updates all binary values through native labels without saving', async () => {
    const { component, element, fixture } = await mount();
    for (const field of fields) {
      const label = element.querySelector<HTMLLabelElement>(`label[for="${field}"]`);
      if (!label) throw new Error(`Missing label for ${field}`);
      label.click();
      await fixture.whenStable();
      fixture.detectChanges();
    }
    expect(component.settingsForm.value).toEqual({ official: false, allowGuestEnrollments: true, schedulePublished: true });
    expect(Array.from(element.querySelectorAll('input')).map((input) => input.checked)).toEqual([false, true, true]);
    expect(component.isDirty).toBe(true);
    expect(component.isValid).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('retains the exact boolean payload, named pending feedback and success contract', async () => {
    const { component, fixture, element } = await mount();
    const data = { official: false, allowGuestEnrollments: true, schedulePublished: true };
    component.settingsForm.patchValue(data);
    component.settingsForm.markAsDirty();
    const response = new Subject<{ data: { updateTournamentEvent: { id: string } } }>();
    mutate.mockReturnValue(response);
    const add = jest.spyOn(TestBed.inject(MessageService), 'add');
    const saving = component.saveSettings();
    fixture.detectChanges();
    expect(component.saving()).toBe(true);
    expect(element.querySelector('form')?.getAttribute('aria-busy')).toBe('true');
    expect(element.querySelector('p-progressbar[role="progressbar"]')?.getAttribute('aria-label')).toBe('Saving settings');
    expect(element.querySelector('p-progressbar[style]')).toBeNull();
    expect(mutate).toHaveBeenCalledWith({ mutation: expect.anything(), variables: { id: 'event', data } });
    expect(print(mutate.mock.calls[0][0].mutation)).toContain('mutation UpdateTournamentEventSettingsPanel');
    response.next({ data: { updateTournamentEvent: { id: 'event' } } });
    response.complete();
    await saving;
    fixture.detectChanges();
    expect(component.isDirty).toBe(false);
    expect(component.error()).toBeNull();
    expect(element.querySelector('form')?.getAttribute('aria-busy')).toBe('false');
    expect(element.querySelector('p-progressbar')).toBeNull();
    expect(add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Tournament settings updated successfully' });
  });

  it('retains dirty booleans on rejection and clears native error after retry', async () => {
    const { component, fixture, element } = await mount();
    const data = { official: false, allowGuestEnrollments: true, schedulePublished: false };
    component.settingsForm.patchValue(data);
    component.settingsForm.markAsDirty();
    const error = new Error('Safe mocked failure');
    mutate.mockReturnValueOnce(throwError(() => error));
    await expect(component.saveSettings()).rejects.toBe(error);
    fixture.detectChanges();
    expect(component.isDirty).toBe(true);
    expect(component.saving()).toBe(false);
    expect(element.querySelector('p-message[role="alert"].p-message-error')?.textContent).toContain(
      'Failed to update tournament settings. Please try again.',
    );
    expect(component.settingsForm.value).toEqual(data);
    await component.saveSettings();
    fixture.detectChanges();
    expect(mutate).toHaveBeenCalledTimes(2);
    expect(mutate.mock.calls[1][0].variables).toEqual({ id: 'event', data });
    expect(component.isDirty).toBe(false);
    expect(element.querySelector('p-message')).toBeNull();
  });

  it('resets booleans and pristine state when the input tournament changes', async () => {
    const { component, fixture, element } = await mount();
    component.settingsForm.markAsDirty();
    fixture.componentRef.setInput('tournament', { id: 'other', official: false, allowGuestEnrollments: true, schedulePublished: true });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.settingsForm.value).toEqual({ official: false, allowGuestEnrollments: true, schedulePublished: true });
    expect(component.isDirty).toBe(false);
    expect(Array.from(element.querySelectorAll('input')).map((input) => input.checked)).toEqual([false, true, true]);
    expect(hasAnyPermission).toHaveBeenCalledWith(['edit-any:tournament', 'other_edit:tournament']);
    expect(mutate).not.toHaveBeenCalled();
  });
});
