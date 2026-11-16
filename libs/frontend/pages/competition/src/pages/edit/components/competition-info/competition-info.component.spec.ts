import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { CompetitionInfoComponent } from './competition-info.component';

describe('Competition information presentation', () => {
  let fixture: ComponentFixture<CompetitionInfoComponent>;
  let component: CompetitionInfoComponent;
  let element: HTMLElement;
  const permissions = { hasAnyPermission: jest.fn(() => true) };
  const mutate = jest.fn(() => {
    throw new Error('Unexpected competition mutation');
  });

  beforeEach(async () => {
    permissions.hasAnyPermission.mockReturnValue(true);
    mutate.mockClear();
    await TestBed.configureTestingModule({
      imports: [CompetitionInfoComponent, TranslateModule.forRoot()],
      providers: [{ provide: AuthService, useValue: permissions }, { provide: Apollo, useValue: { mutate } }, MessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(CompetitionInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('associates location/contact regions and fields with their visible labels', () => {
    for (const section of ['location', 'contact']) {
      const titleId = `competition-info-${section}-title`;
      expect(element.querySelector(`section[aria-labelledby="${titleId}"] h2`)?.id).toBe(titleId);
    }
    const email = element.querySelector<HTMLInputElement>('#contactEmail');
    expect(email?.labels?.[0]?.textContent).toContain('all.competition.edit.info.contactEmail');
    for (const field of ['country', 'state']) {
      const labelId = `competition-info-${field}-label`;
      expect(element.querySelector(`#${field}`)?.getAttribute('aria-labelledby')).toBe(labelId);
      expect(element.querySelector(`#${labelId}`)?.getAttribute('for')).toBe(field);
    }
  });

  it('describes touched invalid email and removes feedback after correction or optional empty input', async () => {
    const control = component.infoForm.controls['contactEmail'];
    const email = element.querySelector<HTMLInputElement>('#contactEmail');
    if (!email) {
      throw new Error('Missing contact email input');
    }
    control.setValue('invalid-email');
    await settle();
    expect(element.querySelector('#competition-info-contact-email-error')).toBeNull();
    expect(email.getAttribute('aria-invalid')).toBe('false');
    control.markAsTouched();
    await settle();
    const errorId = 'competition-info-contact-email-error';
    expect(email.getAttribute('aria-invalid')).toBe('true');
    expect(email.classList.contains('p-invalid')).toBe(true);
    expect(email.getAttribute('aria-describedby')).toBe(errorId);
    expect(element.querySelector(`#${errorId}`)?.getAttribute('role')).toBe('alert');
    expect(element.querySelector(`#${errorId}`)?.textContent).toContain('all.competition.edit.info.contactEmail.invalid');
    for (const value of ['test@example.invalid', '']) {
      control.setValue(value);
      await settle();
      expect(control.valid).toBe(true);
      expect(email.getAttribute('aria-invalid')).toBe('false');
      expect(email.classList.contains('p-invalid')).toBe(false);
      expect(email.hasAttribute('aria-describedby')).toBe(false);
      expect(element.querySelector(`#${errorId}`)).toBeNull();
    }
    expect(mutate).not.toHaveBeenCalled();
  });

  it('names indeterminate saving feedback and preserves stored errors across its transition', async () => {
    component.error.set('Test stored error');
    component.savingInfo.set(true);
    const form = component.infoForm.getRawValue();
    await settle();
    const statusId = 'competition-info-saving-status';
    const status = element.querySelector(`#${statusId}`);
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.getAttribute('aria-atomic')).toBe('true');
    expect(status?.textContent).toContain('all.competition.edit.info.messages.saving');
    const bar = element.querySelector('[role="progressbar"]');
    expect(bar?.getAttribute('aria-labelledby')).toBe(statusId);
    expect(bar?.hasAttribute('aria-valuenow')).toBe(false);
    expect(element.textContent).toContain('Test stored error');
    component.savingInfo.set(false);
    await settle();
    expect(element.querySelector('[role="progressbar"]')).toBeNull();
    expect(element.querySelector(`#${statusId}`)).toBeNull();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Test stored error');
    expect(component.infoForm.getRawValue()).toEqual(form);
    expect(component.infoForm.pristine).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('keeps the contact field disabled and pristine for read-only permissions', async () => {
    permissions.hasAnyPermission.mockReturnValue(false);
    fixture.destroy();
    fixture = TestBed.createComponent(CompetitionInfoComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
    expect(element.querySelector<HTMLInputElement>('#contactEmail')?.disabled).toBe(true);
    expect(component.infoForm.disabled).toBe(true);
    expect(component.infoForm.pristine).toBe(true);
    expect(element.querySelector('#competition-info-contact-email-error')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });
});
