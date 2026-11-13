import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TournamentEnrollment, TournamentEvent, TournamentSubEvent } from '@app/models';
import { EnrollmentStatus } from '@app/models-enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
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
import { EnrollmentsTabService, ManualEnrollmentPlayer } from './enrollments-tab.service';

function isSelectedPlayer(value: ManualEnrollmentPlayer | string | null): value is ManualEnrollmentPlayer {
  return typeof value === 'object' && value !== null && typeof value.id === 'string' && value.id.length > 0;
}

@Component({
  selector: 'app-enrollments-tab',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    PanelModule,
    ButtonModule,
    AutoCompleteModule,
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
  private readonly manualEnrollmentTrigger = viewChild<unknown, ElementRef<HTMLElement>>('manualEnrollmentTrigger', { read: ElementRef });
  readonly creating = this.dataService.creating;
  readonly creationError = this.dataService.creationError;
  readonly manualFields = ['player', 'partner'] as const;
  readonly suggestions = signal<Record<'player' | 'partner', ManualEnrollmentPlayer[]>>({ player: [], partner: [] });
  readonly searchErrors = signal<Record<'player' | 'partner', string | null>>({ player: null, partner: null });
  private readonly searchRequests = { player: 0, partner: 0 };
  manualEnrollmentForm = new FormGroup({
    player: new FormControl<ManualEnrollmentPlayer | string | null>(null, (control) =>
      isSelectedPlayer(control.value) ? null : { selection: true },
    ),
    partner: new FormControl<ManualEnrollmentPlayer | string | null>(null, (control) =>
      control.value === null || isSelectedPlayer(control.value) ? null : { selection: true },
    ),
    isGuest: new FormControl(false, { nonNullable: true }),
    guestName: new FormControl('', {
      nonNullable: true,
      validators: [(control) => (control.value.trim() ? null : { required: true }), Validators.maxLength(255)],
    }),
    guestEmail: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(255)] }),
    notes: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(1000)] }),
  });
  readonly isGuest = toSignal(this.manualEnrollmentForm.controls.isGuest.valueChanges, { initialValue: false });

  // Status options
  private readonly statusOptionDefinitions = [
    { label: 'all.tournament.admin.enrollments.allStatuses', value: null },
    { label: 'all.tournament.admin.enrollments.confirmed', value: EnrollmentStatus.CONFIRMED },
    { label: 'all.tournament.admin.enrollments.pending', value: EnrollmentStatus.PENDING },
    { label: 'all.tournament.admin.enrollments.waitingList', value: EnrollmentStatus.WAITING_LIST },
    { label: 'all.tournament.admin.enrollments.cancelled', value: EnrollmentStatus.CANCELLED },
    { label: 'all.tournament.admin.enrollments.withdrawn', value: EnrollmentStatus.WITHDRAWN },
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
      const guest = this.isGuest() && this.tournament().allowGuestEnrollments;
      const doubles = this.isDoublesEvent();
      const allowed = this.tournament().allowGuestEnrollments;
      if (this.creating()) {
        this.manualEnrollmentForm.disable({ emitEvent: false });
        return;
      }
      if (this.isGuest() && !allowed) {
        this.manualEnrollmentForm.controls.isGuest.setValue(false);
      }
      const controls = this.manualEnrollmentForm.controls;
      controls.isGuest.enable({ emitEvent: false });
      controls.notes.enable({ emitEvent: false });
      for (const [control, enabled] of [
        [controls.player, !guest],
        [controls.guestName, guest],
        [controls.guestEmail, guest],
        [controls.partner, doubles],
      ] as const) {
        if (enabled) control.enable({ emitEvent: false });
        else control.disable({ emitEvent: false });
      }
      if (!doubles) controls.partner.reset(null);
    });

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

  getStatusLabel(status: EnrollmentStatus): string {
    return this.statusOptions().find((option) => option.value === status)?.label ?? status;
  }

  getPlayerName(enrollment: TournamentEnrollment): string {
    if (enrollment.isGuest) {
      return `${enrollment.guestName} (${this.translate.instant('all.tournament.admin.enrollments.guest')})`;
    }
    return enrollment.player?.fullName ?? this.translate.instant('all.common.unknown');
  }

  getPartnerName(enrollment: TournamentEnrollment): string {
    if (enrollment.confirmedPartner) {
      return enrollment.confirmedPartner.fullName ?? this.translate.instant('all.common.unknown');
    }
    if (enrollment.preferredPartner) {
      const name = enrollment.preferredPartner.fullName ?? this.translate.instant('all.common.unknown');
      return `${name} (${this.translate.instant('all.tournament.admin.enrollments.preferred')})`;
    }
    return '-';
  }

  isDoublesEvent(): boolean {
    const subEvent = this.selectedSubEvent();
    return subEvent?.gameType === 'D' || subEvent?.gameType === 'MX';
  }

  async cancelEnrollment(enrollment: TournamentEnrollment): Promise<void> {
    const playerName = this.getPlayerName(enrollment);
    if (confirm(this.translate.instant('all.tournament.admin.enrollments.confirmCancelPlayer', { playerName }))) {
      await this.dataService.cancelEnrollment(enrollment.id);
    }
  }

  async promoteFromWaitingList(enrollment: TournamentEnrollment): Promise<void> {
    const playerName = this.getPlayerName(enrollment);
    if (confirm(this.translate.instant('all.tournament.admin.enrollments.confirmPromotePlayer', { playerName }))) {
      await this.dataService.promoteFromWaitingList(enrollment.id);
    }
  }

  refetch(): void {
    this.dataService.refetch();
  }

  openManualEnrollmentDialog(): void {
    this.manualEnrollmentForm.reset();
    this.dataService.creationError.set(null);
    this.suggestions.set({ player: [], partner: [] });
    this.searchErrors.set({ player: null, partner: null });
    this.showManualEnrollmentDialog.set(true);
  }

  /** Ignore obsolete search responses after typing, closing or reopening the dialog. */
  async searchManualPlayers(field: 'player' | 'partner', search: string): Promise<void> {
    const request = ++this.searchRequests[field];
    this.suggestions.update((value) => ({ ...value, [field]: [] }));
    this.searchErrors.update((value) => ({ ...value, [field]: null }));
    if (search.trim().length < 2) return;
    try {
      const players = await this.dataService.searchPlayers(search);
      if (request !== this.searchRequests[field] || !this.showManualEnrollmentDialog()) return;
      this.suggestions.update((value) => ({ ...value, [field]: players }));
    } catch (error) {
      if (request !== this.searchRequests[field] || !this.showManualEnrollmentDialog()) return;
      this.searchErrors.update((value) => ({
        ...value,
        [field]: error instanceof Error ? error.message : this.translate.instant('all.tournament.admin.enrollments.manualSearchError'),
      }));
    }
  }

  closeManualEnrollmentDialog(): void {
    if (this.creating()) return;
    this.searchRequests.player++;
    this.searchRequests.partner++;
    this.showManualEnrollmentDialog.set(false);
  }

  restoreManualEnrollmentFocus(): void {
    this.closeManualEnrollmentDialog();
    this.manualEnrollmentTrigger()?.nativeElement.focus();
  }

  async createManualEnrollment(): Promise<void> {
    if (this.creating()) return;
    this.manualEnrollmentForm.markAllAsTouched();
    const subEvent = this.selectedSubEvent();
    const value = this.manualEnrollmentForm.getRawValue();
    const partner = this.isDoublesEvent() && isSelectedPlayer(value.partner) ? value.partner : null;
    const identity = value.isGuest
      ? { guestName: value.guestName.trim(), guestEmail: value.guestEmail.trim() }
      : isSelectedPlayer(value.player)
        ? { playerId: value.player.id }
        : null;
    if (
      this.manualEnrollmentForm.invalid ||
      !subEvent ||
      (value.isGuest && !this.tournament().allowGuestEnrollments) ||
      !identity ||
      (isSelectedPlayer(value.player) && !value.isGuest && partner?.id === value.player.id)
    ) {
      this.dataService.creationError.set(this.translate.instant('all.tournament.admin.enrollments.manualInvalid'));
      return;
    }
    const common = { tournamentSubEventId: subEvent.id, preferredPartnerId: partner?.id, notes: value.notes.trim() || undefined };
    if (await this.dataService.createManualEnrollment({ ...common, ...identity })) {
      this.closeManualEnrollmentDialog();
    }
  }
}
