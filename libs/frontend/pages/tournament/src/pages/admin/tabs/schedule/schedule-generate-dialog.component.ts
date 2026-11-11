import { ChangeDetectionStrategy, Component, computed, effect, input, model, output, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Court } from '@app/models';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ScheduleVenue } from './schedule-tab.service';

export interface GenerateSlotsValue {
  courtIds: string[];
  dates: Date[];
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  breakMinutes: number;
}

/** Presentational dialog collecting time-slot generation settings; the smart tab runs the mutation. */
@Component({
  selector: 'app-schedule-generate-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    DatePickerModule,
    DialogModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    MultiSelectModule,
    SelectModule,
  ],
  templateUrl: './schedule-generate-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleGenerateDialogComponent {
  visible = model(false);
  courts = input<Court[]>([]);
  firstDay = input<Date | string | null | undefined>(null);
  venues = input<ScheduleVenue[]>([]);
  venuesLoading = input(false);
  venuesError = input<string | null>(null);
  updating = input(false);
  error = input<string | null>(null);
  generate = output<GenerateSlotsValue>();

  readonly slotDurationOptions = [20, 30, 45, 60].map((value) => ({ label: `${value} min`, value }));

  readonly venueControl = new FormControl<string | null>(null);
  private readonly venueId = toSignal(this.venueControl.valueChanges, { initialValue: null as string | null });

  /** Courts of the chosen venue; without a venue, the courts already linked to the tournament. */
  readonly courtOptions = computed(() => this.venues().find((venue) => venue.id === this.venueId())?.courts ?? this.courts());

  readonly form = new FormGroup({
    courtIds: new FormControl<string[]>([], { nonNullable: true, validators: Validators.required }),
    dates: new FormControl<Date[]>([], { nonNullable: true, validators: Validators.required }),
    startTime: new FormControl('09:00', { nonNullable: true, validators: Validators.required }),
    endTime: new FormControl('18:00', { nonNullable: true, validators: Validators.required }),
    slotDurationMinutes: new FormControl(30, { nonNullable: true, validators: Validators.required }),
    breakMinutes: new FormControl<number | null>(0),
  });

  constructor() {
    // Reset to the defaults whenever the dialog opens: all courts, the first day, 09:00-18:00 in 30 minute slots.
    effect(() => {
      if (!this.visible()) return;
      untracked(() => this.resetToDefaults());
    });
  }

  private resetToDefaults(): void {
    const firstDay = this.firstDay();
    const linkedCourts = this.courts();
    const linkedVenue = this.venues().find((venue) => venue.courts.some((court) => court.id === linkedCourts[0]?.id));
    this.venueControl.setValue(linkedVenue?.id ?? null);
    this.form.reset({
      courtIds: linkedCourts.map((court) => court.id),
      dates: firstDay ? [new Date(firstDay)] : [],
      startTime: '09:00',
      endTime: '18:00',
      slotDurationMinutes: 30,
      breakMinutes: 0,
    });
  }

  /** Choosing another venue replaces the selected courts with all courts of that venue. */
  onVenueChange(): void {
    this.form.controls.courtIds.setValue(this.courtOptions().map((court) => court.id));
  }

  close(): void {
    if (!this.updating()) this.visible.set(false);
  }

  submit(): void {
    if (this.updating() || this.form.invalid) return;
    const { courtIds, dates, startTime, endTime, slotDurationMinutes, breakMinutes } = this.form.getRawValue();
    this.generate.emit({ courtIds, dates, startTime, endTime, slotDurationMinutes, breakMinutes: breakMinutes ?? 0 });
  }
}
