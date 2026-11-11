import { ChangeDetectionStrategy, Component, computed, effect, input, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScheduleStrategy } from '@app/models-enum';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ScheduleResult } from './schedule-tab.service';

export interface AutoScheduleValue {
  strategy: ScheduleStrategy;
  minRestMinutes: number;
}

const MAX_LISTED_CONFLICTS = 5;

/** Presentational dialog collecting auto-schedule settings and showing the last result; the smart tab runs it. */
@Component({
  selector: 'app-schedule-auto-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, ButtonModule, DialogModule, InputNumberModule, MessageModule, SelectModule, TagModule],
  templateUrl: './schedule-auto-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleAutoDialogComponent {
  visible = model(false);
  updating = input(false);
  error = input<string | null>(null);
  result = input<ScheduleResult | null>(null);
  run = output<AutoScheduleValue>();

  readonly strategies = Object.values(ScheduleStrategy);

  readonly form = new FormGroup({
    strategy: new FormControl(ScheduleStrategy.MINIMIZE_WAIT, { nonNullable: true, validators: Validators.required }),
    minRestMinutes: new FormControl<number | null>(15),
  });

  readonly listedConflicts = computed(() => this.result()?.conflicts.slice(0, MAX_LISTED_CONFLICTS) ?? []);
  readonly hiddenConflictCount = computed(() => Math.max((this.result()?.conflicts.length ?? 0) - MAX_LISTED_CONFLICTS, 0));

  constructor() {
    effect(() => {
      if (this.visible()) this.form.reset({ strategy: ScheduleStrategy.MINIMIZE_WAIT, minRestMinutes: 15 });
    });
  }

  close(): void {
    if (!this.updating()) this.visible.set(false);
  }

  submit(): void {
    if (this.updating() || this.form.invalid) return;
    const { strategy, minRestMinutes } = this.form.getRawValue();
    this.run.emit({ strategy, minRestMinutes: minRestMinutes ?? 15 });
  }
}
