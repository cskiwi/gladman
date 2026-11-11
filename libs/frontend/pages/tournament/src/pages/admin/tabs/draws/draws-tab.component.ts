import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Entry, TournamentDraw, TournamentEvent, TournamentSubEvent } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs';
import { DrawsTabService, SeedingMethod } from './draws-tab.service';

@Component({
  selector: 'app-draws-tab',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    TableModule,
    TagModule,
    SelectModule,
    InputTextModule,
    MessageModule,
    PanelModule,
    ProgressBarModule,
    DialogModule,
    TooltipModule,
  ],
  templateUrl: './draws-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawsTabComponent {
  tournament = input.required<TournamentEvent>();

  private readonly dataService = new DrawsTabService();
  private readonly translate = inject(TranslateService);
  private creationTrigger: HTMLElement | null = null;
  private seedingTrigger: HTMLElement | null = null;

  // Form controls
  subEventControl = new FormControl<TournamentSubEvent | null>(null);
  readonly selectedSubEvent = toSignal(this.subEventControl.valueChanges, { initialValue: this.subEventControl.value });

  // New draw dialog
  showCreateDrawDialog = signal(false);
  drawForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    type: new FormControl<string>('KO', Validators.required),
    size: new FormControl<number | null>(null),
  });

  // Seeding dialog
  showSeedingDialog = signal(false);
  seedingDrawId = signal<string | null>(null);
  seedingMethod = new FormControl<SeedingMethod>('BY_RANKING');

  // Entry selection
  selectedEntries = signal<Entry[]>([]);
  targetDrawId = signal<string | null>(null);

  // Data
  entries = this.dataService.entries;
  unassignedEntries = this.dataService.unassignedEntries;
  draws = this.dataService.draws;
  loading = this.dataService.loading;
  error = this.dataService.error;
  updating = this.dataService.updating;
  updateError = this.dataService.updateError;
  stats = this.dataService.stats;

  readonly summaryItems = [
    { key: 'total', label: 'totalEntries', description: 'totalEntriesDescription' },
    { key: 'assigned', label: 'assigned', description: 'assignedDescription' },
    { key: 'unassigned', label: 'unassigned', description: 'unassignedDescription' },
    { key: 'draws', label: 'drawCount', description: 'drawCountDescription' },
  ] as const satisfies ReadonlyArray<{ key: keyof ReturnType<DrawsTabService['stats']>; label: string; description: string }>;

  // Sub-events list
  subEvents = computed(() => this.tournament()?.tournamentSubEvents ?? []);

  // Draw type options
  readonly drawTypeLabels: Readonly<Record<string, string>> = {
    KO: 'all.tournament.admin.draws.knockout',
    POULE: 'all.tournament.admin.draws.roundRobin',
    QUALIFICATION: 'all.tournament.admin.draws.qualification',
  };

  readonly drawTypeOptions = toSignal(
    this.translate.stream('all.tournament.admin.draws').pipe(
      map(() => [
        { label: this.translate.instant('all.tournament.admin.draws.knockout'), value: 'KO' },
        { label: this.translate.instant('all.tournament.admin.draws.roundRobin'), value: 'POULE' },
        { label: this.translate.instant('all.tournament.admin.draws.qualification'), value: 'QUALIFICATION' },
      ]),
    ),
    { initialValue: [] },
  );

  // Seeding method options
  readonly seedingMethodOptions = toSignal(
    this.translate.stream('all.tournament.admin.draws').pipe(
      map(
        () =>
          [
            { label: this.translate.instant('all.tournament.admin.draws.seedByRanking'), value: 'BY_RANKING' },
            { label: this.translate.instant('all.tournament.admin.draws.seedRandom'), value: 'RANDOM' },
            { label: this.translate.instant('all.tournament.admin.draws.seedManual'), value: 'MANUAL' },
          ] satisfies Array<{ label: string; value: SeedingMethod }>,
      ),
    ),
    { initialValue: [] },
  );

  // Draw size options for KO
  readonly drawSizeOptions = toSignal(
    this.translate
      .stream('all.tournament.entries')
      .pipe(map(() => [4, 8, 16, 32, 64].map((size) => ({ label: `${size} ${this.translate.instant('all.tournament.entries')}`, value: size })))),
    { initialValue: [] },
  );

  constructor() {
    // Watch sub-event selection
    effect(() => {
      const subEventId = this.selectedSubEvent()?.id ?? null;
      if (this.dataService.filter.controls.subEventId.value === subEventId) return;
      this.dataService.filter.patchValue({ subEventId });
      this.selectedEntries.set([]);
      this.targetDrawId.set(null);
    });

    // Auto-select first sub-event
    effect(() => {
      const subEvents = this.subEvents();
      const current = this.subEventControl.value;
      const selected = subEvents.find((subEvent) => subEvent.id === current?.id) ?? subEvents[0] ?? null;
      if (current !== selected) this.subEventControl.setValue(selected);
    });
  }

  isDoublesEvent(): boolean {
    const subEvent = this.selectedSubEvent();
    return subEvent?.gameType === 'D' || subEvent?.gameType === 'MX';
  }

  getEntryName(entry: Entry): string {
    const player1Name = entry.player1?.fullName ?? this.translate.instant('all.common.unknown');
    if (this.isDoublesEvent() && entry.player2) {
      return `${player1Name} / ${entry.player2.fullName}`;
    }
    return player1Name;
  }

  getDrawTypeSeverity(type?: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (type) {
      case 'KO':
        return 'success';
      case 'POULE':
        return 'info';
      case 'QUALIFICATION':
        return 'warn';
      default:
        return 'secondary';
    }
  }

  // Entry selection handlers
  selectAllUnassigned(): void {
    this.selectedEntries.set([...this.unassignedEntries()]);
  }

  clearSelection(): void {
    this.selectedEntries.set([]);
  }

  // Actions
  async generateEntries(): Promise<void> {
    const subEvent = this.selectedSubEvent();
    if (!subEvent) return;

    const hasEntries = this.entries().length > 0;
    if (hasEntries) {
      if (!confirm(this.translate.instant('all.tournament.admin.draws.confirmRegenerateEntries'))) {
        return;
      }
    }

    await this.dataService.generateEntries(subEvent.id, hasEntries);
  }

  openCreateDrawDialog(event?: Event): void {
    if (this.updating()) return;
    this.creationTrigger = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    this.updateError.set(null);
    this.drawForm.reset({ type: 'KO' });
    this.showCreateDrawDialog.set(true);
  }

  closeCreateDrawDialog(event?: Event): void {
    if (!this.showCreateDrawDialog()) return;
    event?.stopPropagation();
    if (!this.updating()) this.showCreateDrawDialog.set(false);
  }

  restoreCreationFocus(): void {
    this.creationTrigger?.focus();
    this.creationTrigger = null;
  }

  async createDraw(): Promise<void> {
    if (this.updating()) return;
    if (!this.drawForm.valid) {
      this.drawForm.markAllAsTouched();
      return;
    }

    const subEvent = this.selectedSubEvent();
    if (!subEvent) return;

    const { name, type, size } = this.drawForm.value;
    if (!name || !type) return;
    const result = await this.dataService.createDraw(subEvent.id, name, type, size ?? undefined);

    if (result) {
      this.showCreateDrawDialog.set(false);
    }
  }

  async deleteDraw(draw: TournamentDraw): Promise<void> {
    if (!confirm(this.translate.instant('all.tournament.admin.draws.confirmDeleteDraw', { name: draw.name }))) {
      return;
    }
    await this.dataService.deleteDraw(draw.id);
  }

  async assignSelectedToDraw(): Promise<void> {
    const drawId = this.targetDrawId();
    if (!drawId) return;

    const entryIds = this.selectedEntries().map((e) => e.id);
    if (entryIds.length === 0) return;

    const success = await this.dataService.assignEntriesToDraw(entryIds, drawId);
    if (success) {
      this.selectedEntries.set([]);
      this.targetDrawId.set(null);
    }
  }

  async removeFromDraw(entry: Entry): Promise<void> {
    await this.dataService.removeEntryFromDraw(entry.id);
  }

  // Seeding
  openSeedingDialog(draw: TournamentDraw, event?: Event): void {
    this.seedingTrigger = event?.currentTarget instanceof HTMLElement ? event.currentTarget : null;
    this.updateError.set(null);
    this.seedingDrawId.set(draw.id);
    this.seedingMethod.setValue('BY_RANKING');
    this.showSeedingDialog.set(true);
  }

  restoreSeedingFocus(): void {
    this.seedingTrigger?.focus();
    this.seedingTrigger = null;
  }

  closeSeedingDialog(event?: Event): void {
    // PrimeNG binds Escape once on open, without rechecking the pending state.
    if (!this.showSeedingDialog()) return;
    event?.stopPropagation();
    if (!this.updating()) this.showSeedingDialog.set(false);
  }

  async applySeeding(): Promise<void> {
    if (this.updating()) return;

    const drawId = this.seedingDrawId();
    const method = this.seedingMethod.value;
    if (!drawId || !method) return;

    const success = await this.dataService.autoSeedDraw(drawId, method);
    if (success) {
      this.showSeedingDialog.set(false);
    }
  }

  async clearSeeds(draw: TournamentDraw): Promise<void> {
    if (!confirm(this.translate.instant('all.tournament.admin.draws.confirmClearSeeds', { name: draw.name }))) return;
    await this.dataService.clearDrawSeeds(draw.id);
  }

  refetch(): void {
    this.dataService.refetch();
  }
}
