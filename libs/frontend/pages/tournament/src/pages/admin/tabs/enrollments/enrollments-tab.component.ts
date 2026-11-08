import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TournamentEnrollment, TournamentEvent, TournamentSubEvent } from '@app/models';
import { EnrollmentStatus } from '@app/models-enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService } from 'primeng/api';
import { EnrollmentsTabService } from './enrollments-tab.service';

@Component({
  selector: 'app-enrollments-tab',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    PanelModule,
    ButtonModule,
    TableModule,
    TagModule,
    SelectModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    ProgressBarModule,
    DialogModule,
    ConfirmDialogModule,
    TabsModule,
    TooltipModule,
    CheckboxModule,
    TextareaModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './enrollments-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrollmentsTabComponent {
  tournament = input.required<TournamentEvent>();

  private readonly dataService = new EnrollmentsTabService();
  private readonly confirmationService = new ConfirmationService();
  private readonly translate = inject(TranslateService);

  // Form controls
  subEventControl = new FormControl<TournamentSubEvent | null>(null);
  statusFilter = new FormControl<EnrollmentStatus | null>(null);
  searchControl = new FormControl<string>('');

  // Manual enrollment dialog
  showManualEnrollmentDialog = signal(false);
  manualEnrollmentForm = new FormGroup({
    playerSearch: new FormControl<string>('', Validators.required),
    partnerSearch: new FormControl<string>(''),
    isGuest: new FormControl<boolean>(false),
    guestName: new FormControl<string>(''),
    guestEmail: new FormControl<string>(''),
    notes: new FormControl<string>(''),
  });

  // Status options
  private readonly statusOptionDefinitions = [
    { label: 'all.tournament.admin.enrollments.allStatuses', value: null },
    { label: 'all.tournament.admin.enrollments.confirmed', value: EnrollmentStatus.CONFIRMED },
    { label: 'all.tournament.admin.enrollments.pending', value: EnrollmentStatus.PENDING },
    { label: 'all.tournament.admin.enrollments.waitingList', value: EnrollmentStatus.WAITING_LIST },
    { label: 'all.tournament.admin.enrollments.cancelled', value: EnrollmentStatus.CANCELLED },
    { label: 'Withdrawn', value: EnrollmentStatus.WITHDRAWN },
  ];
  readonly statusOptions = toSignal(
    this.translate.stream(this.statusOptionDefinitions.map((option) => option.label)).pipe(
      map(() =>
        this.statusOptionDefinitions.map((option) => ({
          ...option,
          label: this.translate.instant(option.label),
        })),
      ),
    ),
    { initialValue: this.statusOptionDefinitions },
  );

  // Data
  enrollments = this.dataService.enrollments;
  loading = this.dataService.loading;
  error = this.dataService.error;
  updating = this.dataService.updating;
  updateError = this.dataService.updateError;
  stats = this.dataService.stats;

  readonly summaryItems = [
    { key: 'total', label: 'totalEntries', description: 'totalDescription' },
    { key: 'confirmed', label: 'confirmed', description: 'confirmedDescription' },
    { key: 'pending', label: 'pending', description: 'pendingDescription' },
    { key: 'waitingList', label: 'waitingList', description: 'waitingListDescription' },
    { key: 'cancelled', label: 'cancelled', description: 'cancelledDescription' },
  ] as const;

  // Selected sub-event
  readonly selectedSubEvent = toSignal(this.subEventControl.valueChanges, { initialValue: this.subEventControl.value });
  private readonly selectedStatus = toSignal(this.statusFilter.valueChanges, { initialValue: this.statusFilter.value });
  private readonly search = toSignal(this.searchControl.valueChanges, { initialValue: this.searchControl.value });

  // Sub-events list
  subEvents = computed(() => this.tournament()?.tournamentSubEvents ?? []);

  constructor() {
    effect(() => {
      this.dataService.filter.patchValue({
        subEventId: this.selectedSubEvent()?.id ?? null,
        status: this.selectedStatus(),
        search: this.search() ?? '',
      });
    });

    // Reconcile changed tournament options, without undoing an explicit cleared selection.
    effect(() => {
      const subEvents = this.subEvents();
      const selected = this.subEventControl.value;
      const next = subEvents.find((subEvent) => subEvent.id === selected?.id) ?? subEvents[0] ?? null;
      if (selected !== next) {
        this.subEventControl.setValue(next);
      }
    });
  }

  getStatusSeverity(status: EnrollmentStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case EnrollmentStatus.CONFIRMED:
        return 'success';
      case EnrollmentStatus.PENDING:
        return 'info';
      case EnrollmentStatus.WAITING_LIST:
        return 'warn';
      case EnrollmentStatus.CANCELLED:
      case EnrollmentStatus.WITHDRAWN:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getPlayerName(enrollment: TournamentEnrollment): string {
    if (enrollment.isGuest) {
      return `${enrollment.guestName} (Guest)`;
    }
    return enrollment.player?.fullName ?? 'Unknown';
  }

  getPartnerName(enrollment: TournamentEnrollment): string {
    if (enrollment.confirmedPartner) {
      return enrollment.confirmedPartner.fullName ?? 'Unknown';
    }
    if (enrollment.preferredPartner) {
      return `${enrollment.preferredPartner.fullName ?? 'Unknown'} (Preferred)`;
    }
    return '-';
  }

  isDoublesEvent(): boolean {
    const subEvent = this.selectedSubEvent();
    return subEvent?.gameType === 'D' || subEvent?.gameType === 'MX';
  }

  async cancelEnrollment(enrollment: TournamentEnrollment): Promise<void> {
    const playerName = this.getPlayerName(enrollment);
    if (confirm(`Are you sure you want to cancel the enrollment for ${playerName}?`)) {
      await this.dataService.cancelEnrollment(enrollment.id);
    }
  }

  async promoteFromWaitingList(enrollment: TournamentEnrollment): Promise<void> {
    const playerName = this.getPlayerName(enrollment);
    if (confirm(`Are you sure you want to promote ${playerName} from the waiting list?`)) {
      await this.dataService.promoteFromWaitingList(enrollment.id);
    }
  }

  refetch(): void {
    this.dataService.refetch();
  }

  openManualEnrollmentDialog(): void {
    this.manualEnrollmentForm.reset({ isGuest: false });
    this.showManualEnrollmentDialog.set(true);
  }

  async createManualEnrollment(): Promise<void> {
    if (!this.manualEnrollmentForm.valid) return;

    const subEvent = this.selectedSubEvent();
    if (!subEvent) return;

    const formValue = this.manualEnrollmentForm.value;

    // TODO: Implement the actual enrollment creation logic
    // This would call the data service to create a manual enrollment
    // await this.dataService.createManualEnrollment(subEvent.id, {
    //   playerSearch: formValue.playerSearch,
    //   partnerSearch: formValue.partnerSearch,
    //   isGuest: formValue.isGuest,
    //   guestName: formValue.guestName,
    //   guestEmail: formValue.guestEmail,
    //   notes: formValue.notes,
    // });

    console.log('Creating manual enrollment:', formValue);
    this.showManualEnrollmentDialog.set(false);
  }
}
