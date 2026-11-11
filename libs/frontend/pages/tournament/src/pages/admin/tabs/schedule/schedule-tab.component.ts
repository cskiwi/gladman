import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Court, Game, TournamentEvent, TournamentScheduleSlot } from '@app/models';
import { ScheduleSlotStatus } from '@app/models-enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ToolbarModule } from 'primeng/toolbar';
import { ScheduleAutoDialogComponent, AutoScheduleValue } from './schedule-auto-dialog.component';
import { ScheduleGameCardComponent } from './schedule-game-card.component';
import { GenerateSlotsValue, ScheduleGenerateDialogComponent } from './schedule-generate-dialog.component';
import { ScheduleSlotComponent } from './schedule-slot.component';
import { ScheduleResult, ScheduleTabService } from './schedule-tab.service';

@Component({
  selector: 'app-schedule-tab',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    ButtonModule,
    TableModule,
    ScheduleSlotComponent,
    ScheduleGameCardComponent,
    ScheduleGenerateDialogComponent,
    ScheduleAutoDialogComponent,
    SelectModule,
    MessageModule,
    ProgressBarModule,
    TooltipModule,
    ToolbarModule,
    PanelModule,
    ConfirmDialogModule,
    DatePipe,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  providers: [ConfirmationService],
  templateUrl: './schedule-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleTabComponent {
  tournament = input.required<TournamentEvent>();

  private readonly dataService = new ScheduleTabService();
  private readonly translate = inject(TranslateService);
  private readonly confirmation = inject(ConfirmationService);

  // Date filter
  selectedDate = signal<Date | null>(null);

  // Generate slots dialog
  showGenerateSlotsDialog = signal(false);

  // Auto-schedule dialog
  showAutoScheduleDialog = signal(false);
  lastScheduleResult = signal<ScheduleResult | null>(null);

  // Data
  slots = this.dataService.slots;
  courts = this.dataService.courts;
  unscheduledGames = this.dataService.unscheduledGames;
  slotsGroupedByTime = this.dataService.slotsGroupedByTime;
  availableDates = this.dataService.availableDates;
  loading = this.dataService.loading;
  error = this.dataService.error;
  updating = this.dataService.updating;
  updateError = this.dataService.updateError;
  stats = this.dataService.stats;

  readonly summaryItems = [
    { key: 'totalSlots', description: 'totalSlotsDescription' },
    { key: 'available', description: 'availableDescription' },
    { key: 'scheduled', description: 'scheduledDescription' },
    { key: 'inProgress', description: 'inProgressDescription' },
    { key: 'blocked', description: 'blockedDescription' },
    { key: 'unscheduledGames', description: 'unscheduledGamesDescription' },
  ] as const satisfies ReadonlyArray<{ key: keyof ReturnType<ScheduleTabService['stats']>; description: string }>;

  // Computed courts for grid header
  gridCourts = computed(() => {
    const allCourts = this.courts();
    const slotsData = this.slots();

    // Get unique court IDs from slots
    const courtIds = new Set(slotsData.map((s) => s.courtId));

    return allCourts.filter((c) => courtIds.has(c.id)).sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '', undefined, { numeric: true }));
  });

  // Time column plus a readable minimum per court keeps 6 to 48+ courts scrollable instead of squeezed
  gridMinWidth = computed(() => `${6 + this.gridCourts().length * 10}rem`);

  // Unscheduled panel visibility
  showUnscheduledPanel = signal(true);

  // Selected game for assignment
  selectedGame = signal<Game | null>(null);

  constructor() {
    // Initialize filter with tournament ID
    effect(() => {
      const tournament = this.tournament();
      if (tournament) {
        this.dataService.filter.patchValue({
          tournamentEventId: tournament.id,
        });
      }
    });

    // Update filter when date changes
    effect(() => {
      const date = this.selectedDate();
      this.dataService.filter.patchValue({
        date,
      });
    });
  }

  getSlotStatusSeverity(status: ScheduleSlotStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (status) {
      case ScheduleSlotStatus.AVAILABLE:
        return 'secondary';
      case ScheduleSlotStatus.SCHEDULED:
        return 'info';
      case ScheduleSlotStatus.IN_PROGRESS:
        return 'warn';
      case ScheduleSlotStatus.COMPLETED:
        return 'success';
      case ScheduleSlotStatus.BLOCKED:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getGameDisplayName(game: Game): string {
    const memberships = game.gamePlayerMemberships ?? [];
    const team1 = memberships.filter((m) => m.single === 1 || m.double === 1);
    const team2 = memberships.filter((m) => m.single === 2 || m.double === 2);

    const tbd = this.translate.instant('all.tournament.admin.schedule.tbd');
    const team1Names = team1.map((m) => m.gamePlayer?.fullName ?? tbd).join(' / ');
    const team2Names = team2.map((m) => m.gamePlayer?.fullName ?? tbd).join(' / ');

    return this.translate.instant('all.tournament.admin.schedule.versus', { home: team1Names || tbd, away: team2Names || tbd });
  }

  getSlotForCourt(slots: TournamentScheduleSlot[], courtId: string): TournamentScheduleSlot | undefined {
    return slots.find((s) => s.courtId === courtId);
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Actions
  venues = this.dataService.venues;
  venuesLoading = this.dataService.venuesLoading;
  venuesError = this.dataService.venuesError;

  openGenerateSlotsDialog(): void {
    void this.dataService.loadVenues();
    this.dataService.clearUpdateError();
    this.showGenerateSlotsDialog.set(true);
  }

  async generateSlots(value: GenerateSlotsValue): Promise<void> {
    const tournament = this.tournament();
    if (!tournament) return;

    const { courtIds, dates, startTime, endTime, slotDurationMinutes, breakMinutes } = value;
    await this.dataService.generateTimeSlots(tournament.id, courtIds, dates, startTime, endTime, slotDurationMinutes, breakMinutes);

    if (!this.updateError()) this.showGenerateSlotsDialog.set(false);
  }

  openAutoScheduleDialog(): void {
    this.lastScheduleResult.set(null);
    this.dataService.clearUpdateError();
    this.showAutoScheduleDialog.set(true);
  }

  async autoSchedule(value: AutoScheduleValue): Promise<void> {
    const tournament = this.tournament();
    if (!tournament) return;

    const result = await this.dataService.scheduleGames(tournament.id, value.strategy, value.minRestMinutes);

    this.lastScheduleResult.set(result);
  }

  publishSchedule(): void {
    const tournament = this.tournament();
    if (!tournament) return;

    this.confirm('publishConfirm', 'pi pi-send', async () => {
      const success = await this.dataService.publishSchedule(tournament.id);
      if (success) {
        // Reload tournament data to update phase
        window.location.reload();
      }
    });
  }

  private confirm(key: 'publishConfirm' | 'deleteSlotConfirm', icon: string, accept: () => unknown): void {
    const prefix = `all.tournament.admin.schedule.${key}`;
    this.confirmation.confirm({
      header: this.translate.instant(`${prefix}.header`),
      message: this.translate.instant(`${prefix}.message`),
      acceptLabel: this.translate.instant(`${prefix}.accept`),
      rejectLabel: this.translate.instant('all.button.cancel'),
      icon,
      acceptButtonProps: { severity: key === 'deleteSlotConfirm' ? 'danger' : 'primary' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept,
    });
  }

  // Drag and drop handlers
  onGameDragStart(game: Game): void {
    this.selectedGame.set(game);
  }

  onGameDragEnd(): void {
    this.selectedGame.set(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async onDropOnSlot(event: CdkDragDrop<any>, slot: TournamentScheduleSlot): Promise<void> {
    const game = event.item.data as Game;

    if (!game || !slot) return;

    // Check if slot is available
    if (slot.status !== ScheduleSlotStatus.AVAILABLE) {
      return;
    }

    await this.dataService.assignGameToSlot(game.id, slot.id);
    this.selectedGame.set(null);
  }

  async removeFromSlot(slot: TournamentScheduleSlot): Promise<void> {
    if (!slot.gameId) return;
    await this.dataService.removeGameFromSlot(slot.id);
  }

  async toggleBlockSlot(slot: TournamentScheduleSlot): Promise<void> {
    if (slot.status === ScheduleSlotStatus.BLOCKED) {
      await this.dataService.unblockSlot(slot.id);
    } else if (slot.status === ScheduleSlotStatus.AVAILABLE) {
      await this.dataService.blockSlot(slot.id);
    }
  }

  deleteSlot(slot: TournamentScheduleSlot): void {
    this.confirm('deleteSlotConfirm', 'pi pi-trash', () => this.dataService.deleteSlot(slot.id));
  }

  refetch(): void {
    this.dataService.refetch();
  }

  onDateChange(date: Date | null): void {
    this.selectedDate.set(date);
  }

  // Track functions for ngFor
  trackByTime(index: number, item: { time: Date }): string {
    return item.time.toISOString();
  }

  trackByCourt(index: number, item: Court): string {
    return item.id;
  }

  trackByGame(index: number, item: Game): string {
    return item.id;
  }
}
