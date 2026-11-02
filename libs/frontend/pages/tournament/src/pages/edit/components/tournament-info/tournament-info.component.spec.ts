import { DeferBlockState, TestBed } from '@angular/core/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { print } from 'graphql';
import { MessageService } from 'primeng/api';
import { of, Subject, throwError } from 'rxjs';
import { TournamentInfoComponent } from './tournament-info.component';

describe('Tournament editing information', () => {
  let mutate: jest.Mock;
  let hasAnyPermission: jest.Mock;
  const dateFields = ['firstDay', 'openDate', 'closeDate', 'enrollmentOpenDate', 'enrollmentCloseDate'];

  beforeEach(async () => {
    mutate = jest.fn(() => of({ data: { updateTournamentEvent: { id: 'event' } } }));
    hasAnyPermission = jest.fn(() => true);
    await TestBed.configureTestingModule({
      imports: [TournamentInfoComponent, TranslateModule.forRoot()],
      providers: [MessageService, { provide: Apollo, useValue: { mutate } }, { provide: AuthService, useValue: { hasAnyPermission } }],
    }).compileComponents();
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('en', {
      all: {
        tournament: {
          edit: {
            info: {
              description: 'Edit tournament information',
              basic: { title: 'Basic information' },
              dates: { title: 'Tournament dates' },
              enrollment: { title: 'Enrollment dates' },
              name: 'Tournament name',
              'name.required': 'Tournament name is required',
              firstDay: 'First day',
              openDate: 'Registration opens',
              closeDate: 'Registration closes',
              enrollmentOpenDate: 'Enrollment opens',
              enrollmentCloseDate: 'Enrollment closes',
              messages: { saving: 'Saving information' },
            },
          },
        },
      },
    });
    translations.use('en');
  });

  async function mount(tournament = { id: 'event', name: 'Safe tournament' }) {
    const fixture = TestBed.createComponent(TournamentInfoComponent);
    fixture.componentRef.setInput('tournament', tournament);
    fixture.detectChanges();
    const blocks = await fixture.getDeferBlocks();
    for (const block of blocks) await block.render(DeferBlockState.Complete);
    await fixture.whenStable();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    return { fixture, component: fixture.componentInstance, element };
  }

  it('uses three named sections and fluid controls with translated native date labels', async () => {
    const { element } = await mount();
    expect(Array.from(element.querySelectorAll('h2')).map((heading) => heading.textContent?.trim())).toEqual([
      'Basic information',
      'Tournament dates',
      'Enrollment dates',
    ]);
    element.querySelectorAll('section').forEach((section) => {
      expect(element.querySelector(`#${section.getAttribute('aria-labelledby')}`)?.textContent).toBeTruthy();
    });
    expect(element.querySelectorAll('input')).toHaveLength(6);
    for (const field of dateFields) {
      const input = element.querySelector<HTMLInputElement>(`input#${field}`);
      expect(input?.labels?.length).toBe(1);
      expect(input?.labels?.[0].textContent?.trim()).toBeTruthy();
      expect(input?.classList.contains('p-datepicker-fluid') || input?.closest('.p-datepicker-fluid')).toBeTruthy();
    }
    expect(element.querySelector('#name')?.classList.contains('p-inputtext-fluid')).toBe(true);
    expect(element.querySelectorAll('p-datepicker[id]')).toHaveLength(0);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('preserves anonymous permission disabling and empty dates without mutation', async () => {
    hasAnyPermission.mockReturnValue(false);
    const { component, element } = await mount();
    expect(hasAnyPermission).toHaveBeenCalledWith(['edit-any:tournament', 'event_edit:tournament']);
    expect(component.infoForm.disabled).toBe(true);
    expect(Array.from(element.querySelectorAll('input')).every((input) => input.disabled)).toBe(true);
    expect(component.isDirty).toBe(false);
    for (const field of dateFields) expect(component.infoForm.get(field)?.value).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('associates touched required-name feedback and clears it after real input', async () => {
    const { component, fixture, element } = await mount();
    const name = element.querySelector<HTMLInputElement>('#name');
    if (!name) throw new Error('Name input missing');
    expect(name.required).toBe(true);
    expect(name.getAttribute('aria-describedby')).toBeNull();
    name.value = '';
    name.dispatchEvent(new Event('input'));
    name.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(name.classList.contains('p-invalid')).toBe(true);
    expect(name.getAttribute('aria-describedby')).toBe('info-name-error');
    expect(element.querySelector('#info-name-error.p-message-error')?.textContent).toContain('Tournament name is required');
    await component.saveInfo();
    expect(element.querySelector('#info-name-error')).not.toBeNull();
    expect(mutate).not.toHaveBeenCalled();
    name.value = 'Corrected name';
    name.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.isDirty).toBe(true);
    expect(component.isValid).toBe(true);
    expect(name.getAttribute('aria-invalid')).toBe('false');
    expect(name.getAttribute('aria-describedby')).toBeNull();
    expect(element.querySelector('#info-name-error')).toBeNull();
  });

  it('retains all six values in the exact save payload and named pending feedback', async () => {
    const { component, fixture, element } = await mount();
    const dates = Object.fromEntries(dateFields.map((field, index) => [field, new Date(2027, 0, index + 1)]));
    component.infoForm.patchValue({ name: 'Updated safe tournament', ...dates });
    component.infoForm.markAsDirty();
    const response = new Subject<{ data: { updateTournamentEvent: { id: string } } }>();
    mutate.mockReturnValue(response);
    const add = jest.spyOn(TestBed.inject(MessageService), 'add');
    const saving = component.saveInfo();
    fixture.detectChanges();
    expect(component.saving()).toBe(true);
    expect(element.querySelector('form')?.getAttribute('aria-busy')).toBe('true');
    expect(element.querySelector('p-progressbar[role="progressbar"]')?.getAttribute('aria-label')).toBe('Saving information');
    expect(element.querySelector('p-progressbar[style]')).toBeNull();
    expect(mutate).toHaveBeenCalledWith({
      mutation: expect.anything(),
      variables: { id: 'event', data: { name: 'Updated safe tournament', ...dates } },
    });
    expect(print(mutate.mock.calls[0][0].mutation)).toContain('mutation UpdateTournamentEventInfo');
    response.next({ data: { updateTournamentEvent: { id: 'event' } } });
    response.complete();
    await saving;
    fixture.detectChanges();
    expect(component.isDirty).toBe(false);
    expect(component.error()).toBeNull();
    expect(element.querySelector('form')?.getAttribute('aria-busy')).toBe('false');
    expect(element.querySelector('p-progressbar')).toBeNull();
    expect(add).toHaveBeenCalledWith({ severity: 'success', summary: 'Success', detail: 'Tournament info updated successfully' });
  });

  it('retains dirty values on rejection and clears native error after successful retry', async () => {
    const { component, fixture, element } = await mount();
    component.infoForm.patchValue({ name: 'Retry tournament' });
    component.infoForm.markAsDirty();
    const error = new Error('Safe mocked failure');
    mutate.mockReturnValueOnce(throwError(() => error));
    await expect(component.saveInfo()).rejects.toBe(error);
    fixture.detectChanges();
    expect(component.isDirty).toBe(true);
    expect(component.saving()).toBe(false);
    expect(element.querySelector('p-message[role="alert"].p-message-error')?.textContent).toContain('Failed to update tournament info');
    expect(component.infoForm.value.name).toBe('Retry tournament');
    await component.saveInfo();
    fixture.detectChanges();
    expect(mutate).toHaveBeenCalledTimes(2);
    expect(component.isDirty).toBe(false);
    expect(component.error()).toBeNull();
    expect(element.querySelector('p-message')).toBeNull();
  });

  it('resets to new tournament input with all dates preserved as Date values', async () => {
    const { component, fixture } = await mount();
    component.infoForm.markAsDirty();
    const dates = Object.fromEntries(dateFields.map((field, index) => [field, new Date(2027, 1, index + 1)]));
    fixture.componentRef.setInput('tournament', { id: 'another-event', name: 'Another tournament', ...dates });
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.infoForm.getRawValue()).toEqual({ name: 'Another tournament', ...dates });
    expect(component.isDirty).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });
});
