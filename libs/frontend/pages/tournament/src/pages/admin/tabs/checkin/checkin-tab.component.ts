import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TournamentEvent } from '@app/models';
import { CheckInStatus } from '@app/models-enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CheckInStats, CheckInWithDetails, CheckinTabService } from './checkin-tab.service';

@Component({
  selector: 'app-checkin-tab',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    PanelModule,
    SkeletonModule,
    ButtonModule,
    TableModule,
    TagModule,
    SelectModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    MessageModule,
    ProgressBarModule,
    TooltipModule,
    CheckboxModule,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './checkin-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckinTabComponent {
  tournament = input.required<TournamentEvent>();

  private readonly dataService = new CheckinTabService();
  private readonly translate = inject(TranslateService);

  // Form controls
  statusFilter = new FormControl<CheckInStatus | null>(null);
  searchControl = new FormControl<string>('');
  private readonly selectedStatus = toSignal(this.statusFilter.valueChanges, { initialValue: this.statusFilter.value });
  private readonly search = toSignal(this.searchControl.valueChanges, { initialValue: this.searchControl.value });

  // Data
  checkIns = this.dataService.checkIns;
  stats = this.dataService.stats;
  loading = this.dataService.loading;
  error = this.dataService.error;
  updating = this.dataService.updating;
  updateError = this.dataService.updateError;

  // Selection
  selectedCheckIns = signal<CheckInWithDetails[]>([]);
  readonly hasPendingCheckIns = computed(() => this.checkIns().some((record) => record.status === CheckInStatus.PENDING && !!record.enrollment?.id));

  readonly summaryItems = [
    { key: 'total', label: 'totalPlayers', description: 'totalDescription' },
    { key: 'checkedIn', label: 'checkedIn', description: 'checkedInDescription' },
    { key: 'pending', label: 'pending', description: 'pendingDescription' },
    { key: 'noShow', label: 'noShow', description: 'noShowDescription' },
    { key: 'checkInRate', label: 'checkinRate', description: 'rateDescription' },
  ] as const satisfies ReadonlyArray<{ key: keyof CheckInStats; label: string; description: string }>;

  // Status filter options
  private readonly statusOptionDefinitions = [
    { label: 'all.tournament.admin.checkin.allStatuses', value: null },
    { label: 'all.tournament.admin.checkin.pending', value: CheckInStatus.PENDING },
    { label: 'all.tournament.admin.checkin.checkedIn', value: CheckInStatus.CHECKED_IN },
    { label: 'all.tournament.admin.checkin.noShow', value: CheckInStatus.NO_SHOW },
  ];
  readonly statusOptions = toSignal(
    this.translate
      .stream(this.statusOptionDefinitions.map((option) => option.label))
      .pipe(map(() => this.statusOptionDefinitions.map((option) => ({ ...option, label: this.translate.instant(option.label) })))),
    { initialValue: this.statusOptionDefinitions },
  );

  constructor() {
    effect(() => {
      this.dataService.filter.patchValue({
        tournamentEventId: this.tournament().id,
        status: this.selectedStatus(),
        search: this.search() ?? '',
      });
    });
  }

  getStatusSeverity(status: CheckInStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case CheckInStatus.CHECKED_IN:
        return 'success';
      case CheckInStatus.PENDING:
        return 'warn';
      case CheckInStatus.NO_SHOW:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getPlayerName(checkIn: CheckInWithDetails): string {
    if (checkIn.enrollment?.isGuest && checkIn.enrollment.guestName) {
      return `${checkIn.enrollment.guestName} (${this.translate.instant('all.tournament.admin.enrollments.guest')})`;
    }
    return checkIn.player?.fullName ?? this.translate.instant('all.common.unknown');
  }

  getStatusLabel(status: CheckInStatus): string {
    const option = this.statusOptionDefinitions.find((item) => item.value === status);
    return option ? this.translate.instant(option.label) : status;
  }

  // Selection handlers
  isSelected(checkIn: CheckInWithDetails): boolean {
    return this.selectedCheckIns().some((c) => c.id === checkIn.id);
  }

  toggleSelection(checkIn: CheckInWithDetails): void {
    const current = this.selectedCheckIns();
    if (this.isSelected(checkIn)) {
      this.selectedCheckIns.set(current.filter((c) => c.id !== checkIn.id));
    } else {
      this.selectedCheckIns.set([...current, checkIn]);
    }
  }

  selectAllPending(): void {
    const pending = this.checkIns().filter((c) => c.status === CheckInStatus.PENDING && !!c.enrollment?.id);
    this.selectedCheckIns.set(pending);
  }

  clearSelection(): void {
    this.selectedCheckIns.set([]);
  }

  // Actions
  async initializeCheckIns(): Promise<void> {
    const tournament = this.tournament();
    if (!tournament) return;

    await this.dataService.initializeCheckIns(tournament.id);
  }

  async checkIn(checkIn: CheckInWithDetails): Promise<void> {
    const tournament = this.tournament();
    if (!tournament || !checkIn.enrollment?.id) return;

    await this.dataService.checkInPlayer(tournament.id, checkIn.enrollment.id);
  }

  async markNoShow(checkIn: CheckInWithDetails): Promise<void> {
    const tournament = this.tournament();
    if (!tournament || !checkIn.enrollment?.id) return;

    await this.dataService.markNoShow(tournament.id, checkIn.enrollment.id);
  }

  async undoCheckIn(checkIn: CheckInWithDetails): Promise<void> {
    await this.dataService.undoCheckIn(checkIn.id);
  }

  async bulkCheckIn(): Promise<void> {
    const tournament = this.tournament();
    if (!tournament) return;

    const selected = this.selectedCheckIns();
    const enrollmentIds = selected
      .filter((c) => c.enrollment?.id && c.status === CheckInStatus.PENDING)
      .map((c) => c.enrollment?.id)
      .filter((id): id is string => !!id);

    if (enrollmentIds.length === 0) return;

    const result = await this.dataService.bulkCheckIn(tournament.id, enrollmentIds);

    if (result) {
      this.selectedCheckIns.set([]);
    }
  }

  refetch(): void {
    this.dataService.refetch();
  }
}
