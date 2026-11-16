import { ComponentFixture, DeferBlockState, TestBed } from '@angular/core/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { CompetitionDatesComponent } from './competition-dates.component';

describe('Competition dates presentation', () => {
  let fixture: ComponentFixture<CompetitionDatesComponent>;
  let component: CompetitionDatesComponent;
  let element: HTMLElement;
  const permissions = { hasAnyPermission: jest.fn(() => true) };
  const mutate = jest.fn(() => {
    throw new Error('Unexpected competition mutation');
  });
  const fields = [
    'openDate',
    'closeDate',
    'changeOpenDate',
    'changeCloseDatePeriod1',
    'changeCloseRequestDatePeriod1',
    'changeCloseDatePeriod2',
    'changeCloseRequestDatePeriod2',
  ];

  beforeEach(async () => {
    permissions.hasAnyPermission.mockReturnValue(true);
    mutate.mockClear();
    await TestBed.configureTestingModule({
      imports: [CompetitionDatesComponent, TranslateModule.forRoot()],
      providers: [{ provide: AuthService, useValue: permissions }, { provide: Apollo, useValue: { mutate } }, MessageService],
    }).compileComponents();
    fixture = TestBed.createComponent(CompetitionDatesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await renderDates();
  });

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function renderDates(): Promise<void> {
    await settle();
    for (const block of await fixture.getDeferBlocks()) {
      await block.render(DeferBlockState.Complete);
    }
    await settle();
  }

  it('labels all native inputs, calendar buttons and registration hints within named sections', () => {
    for (const section of ['registration', 'period1', 'period2']) {
      const titleId = `competition-dates-${section}-title`;
      expect(element.querySelector(`section[aria-labelledby="${titleId}"] h2`)?.id).toBe(titleId);
    }
    for (const field of fields) {
      const input = element.querySelector<HTMLInputElement>(`input#${field}`);
      expect(input?.labels?.[0]?.textContent).toContain(`all.competition.edit.dates.${field}`);
      expect(element.querySelectorAll(`#${field}`)).toHaveLength(1);
      expect(input?.closest('p-datepicker')?.querySelector('button')?.getAttribute('aria-label')).toBe(`all.competition.edit.dates.${field}`);
    }
    for (const [field, hint] of [
      ['openDate', 'open'],
      ['closeDate', 'close'],
    ]) {
      const hintId = `competition-dates-${hint}-hint`;
      expect(element.querySelector(`input#${field}`)?.getAttribute('aria-describedby')).toBe(hintId);
      expect(element.querySelector(`#${hintId}`)?.textContent).toContain(`all.competition.edit.dates.${field}.hint`);
    }
  });

  it('keeps optional date/time values and read-only permissions without mutating', async () => {
    permissions.hasAnyPermission.mockReturnValue(false);
    fixture.destroy();
    fixture = TestBed.createComponent(CompetitionDatesComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    await renderDates();
    const date = new Date(2026, 4, 1, 15, 48);
    component.datesForm.patchValue({ openDate: date });
    await settle();
    expect(element.querySelector<HTMLInputElement>('input#openDate')?.value).toBe('01/05/2026 15:48');
    for (const field of fields) {
      expect(element.querySelector<HTMLInputElement>(`input#${field}`)?.disabled).toBe(true);
    }
    expect(element.querySelector<HTMLInputElement>('input#closeDate')?.value).toBe('');
    expect(component.datesForm.getRawValue().openDate).toEqual(date);
    expect(component.datesForm.pristine).toBe(true);
    expect(component.datesForm.untouched).toBe(true);
    expect(component.datesForm.disabled).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('names saving progress and retains stored errors and form state across transitions', async () => {
    const values = component.datesForm.getRawValue();
    component.error.set('Test stored error');
    component.savingDates.set(true);
    await settle();
    const statusId = 'competition-dates-saving-status';
    const status = element.querySelector(`#${statusId}`);
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.getAttribute('aria-atomic')).toBe('true');
    expect(status?.textContent).toContain('all.competition.edit.dates.messages.saving');
    const bar = element.querySelector('[role="progressbar"]');
    expect(bar?.getAttribute('aria-labelledby')).toBe(statusId);
    expect(bar?.hasAttribute('aria-valuenow')).toBe(false);
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Test stored error');
    component.savingDates.set(false);
    await settle();
    expect(element.querySelector('[role="progressbar"]')).toBeNull();
    expect(element.querySelector(`#${statusId}`)).toBeNull();
    expect(element.querySelector('[role="alert"]')?.textContent).toContain('Test stored error');
    expect(component.datesForm.getRawValue()).toEqual(values);
    expect(component.datesForm.pristine).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });
});
