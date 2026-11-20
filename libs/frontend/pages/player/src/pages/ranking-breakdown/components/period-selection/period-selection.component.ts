import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import dayjs, { Dayjs } from 'dayjs';
import { startWith } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { RankingBreakdownService } from '../../page-ranking-breakdown.service';
import { RankingSystem } from '@app/models';
import { DayjsFormatPipe } from '@app/frontend-utils/dayjs/fmt';

@Component({
  selector: 'app-period-selection',
  templateUrl: './period-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  imports: [FormsModule, TranslateModule, ButtonModule, DatePickerModule, DialogModule, MenuModule, DayjsFormatPipe],
})
export class PeriodSelectionComponent {
  private readonly breakdownService = inject(RankingBreakdownService);

  system = input.required<RankingSystem>();
  filter = this.breakdownService.filter;
  private filterSignal = toSignal(this.filter.valueChanges.pipe(startWith(this.filter.value)));

  start = computed(() => this.filterSignal()?.start as Dayjs | null);
  end = computed(() => this.filterSignal()?.end as Dayjs | null);

  selectedDate = computed(() => this.end()?.toDate() ?? null);
  calendarVisible = signal(false);

  lastPointUpdate() {
    this.customPeriod(dayjs(this.system().calculationLastUpdate));
  }

  lastRankingUpdate() {
    this.customPeriod(dayjs(this.system().updateLastUpdate));
  }

  nextPointUpdate() {
    const sys = this.system();
    this.customPeriod(dayjs(sys.calculationLastUpdate).add(sys.calculationIntervalAmount ?? 1, sys.calculationIntervalUnit as dayjs.ManipulateType));
  }

  nextRankingUpdate() {
    const sys = this.system();
    this.customPeriod(dayjs(sys.updateLastUpdate).add(sys.updateIntervalAmount ?? 1, sys.updateIntervalUnit as dayjs.ManipulateType));
  }

  onDateSelect(date: Date) {
    this.customPeriod(dayjs(date));
    this.calendarVisible.set(false);
  }

  customPeriod(targetDate: Dayjs | null) {
    if (!targetDate) {
      return;
    }

    const sys = this.system();
    const endPeriod = targetDate;
    const startPeriod = endPeriod.subtract(sys.periodAmount ?? 1, sys.periodUnit as dayjs.ManipulateType);
    const gamePeriod = startPeriod.subtract(sys.updateIntervalAmount ?? 1, sys.updateIntervalUnit as dayjs.ManipulateType);
    const nextPeriod = startPeriod.add(sys.calculationIntervalAmount ?? 1, sys.calculationIntervalUnit as dayjs.ManipulateType);

    this.filter.patchValue({
      start: startPeriod,
      end: endPeriod,
      game: gamePeriod,
      next: nextPeriod,
    });
  }
}
