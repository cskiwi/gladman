import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from 'primeng/datepicker';
import { RankingBreakdownService } from '../../page-ranking-breakdown.service';
import { PeriodSelectionComponent } from './period-selection.component';

describe(PeriodSelectionComponent.name, () => {
  const dateLabel = 'all.ranking.breakdown.period.choose-end-date';
  const presetsLabel = 'all.ranking.breakdown.period.presets';
  let fixture: ComponentFixture<PeriodSelectionComponent>;
  const filter = new FormGroup({
    start: new FormControl<Dayjs | null>(null),
    end: new FormControl<Dayjs | null>(null),
    game: new FormControl<Dayjs | null>(null),
    next: new FormControl<Dayjs | null>(null),
  });

  beforeEach(() => {
    filter.reset({ start: dayjs('2025-10-12'), end: dayjs('2026-10-12') });
    TestBed.configureTestingModule({
      imports: [PeriodSelectionComponent, TranslateModule.forRoot()],
      providers: [{ provide: RankingBreakdownService, useValue: { filter } }],
    });
    fixture = TestBed.createComponent(PeriodSelectionComponent);
    fixture.componentRef.setInput('system', {
      periodAmount: 1,
      periodUnit: 'year',
      updateIntervalAmount: 1,
      updateIntervalUnit: 'month',
      calculationIntervalAmount: 1,
      calculationIntervalUnit: 'week',
    });
    fixture.detectChanges();
  });

  function trigger(label: string): HTMLButtonElement {
    const host: HTMLElement = fixture.nativeElement;
    return host.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
  }

  it('names the calendar and preset triggers and associates the calendar with its dialog', async () => {
    const calendar = trigger(dateLabel);
    expect(calendar.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger(presetsLabel).getAttribute('aria-haspopup')).toBe('menu');

    calendar.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = document.getElementById(calendar.getAttribute('aria-controls')!);
    expect(calendar.getAttribute('aria-expanded')).toBe('true');
    expect(dialog?.getAttribute('role')).toBe('dialog');
    expect(dialog?.textContent).toContain(dateLabel);
  });

  it('opens on the current end date and closes after applying a new end date', async () => {
    const calendar = trigger(dateLabel);
    calendar.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const picker: DatePicker = fixture.debugElement.query(By.directive(DatePicker)).componentInstance;
    expect(document.querySelector('[role="dialog"] [aria-selected="true"]')?.textContent?.trim()).toMatch(/^12\b/);

    picker.onSelect.emit(new Date(2026, 9, 20));
    fixture.detectChanges();

    expect(filter.value.start?.format('YYYY-MM-DD')).toBe('2025-10-20');
    expect(filter.value.end?.format('YYYY-MM-DD')).toBe('2026-10-20');
    expect(calendar.getAttribute('aria-expanded')).toBe('false');
  });
});
