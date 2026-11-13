import { ChangeDetectionStrategy, Component, DOCUMENT, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDropList, CdkDrag, CdkDragDrop, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { SubEventTypeEnum } from '@app/models-enum';
import { ClubTeamBuilderTabService } from './club-team-builder-tab.service';
import { ImportSurveyDialogComponent } from '../../../components/team-builder/import-survey-dialog.component';
import { EditSurveyDialogComponent } from '../../../components/team-builder/edit-survey-dialog.component';
import { SubEventDialogComponent } from '../../../components/team-builder/sub-event-dialog.component';
import { SettingsDialogComponent } from '../../../components/team-builder/settings-dialog.component';
import { BuilderTeamCardComponent } from '../../../components/team-builder/builder-team-card.component';
import { PlayerChipComponent } from '../../../components/team-builder/player-chip.component';
import { Player } from '@app/models';
import { MatchResult } from './team-builder/services/player-matcher.service';
import { getPlayerContribution } from './team-builder/utils/team-index-calculator';
import { TEAM_BUILDER_AUTO_SUB_EVENT, TeamBuilderConfig, TeamBuilderPlayer, TeamBuilderTeam } from './team-builder/types/team-builder.types';
import { SurveyResponse } from './team-builder/types/survey-response';

@Component({
  selector: 'app-club-team-builder-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    TranslateModule,
    ButtonModule,
    TagModule,
    IconField,
    InputIcon,
    InputTextModule,
    SelectModule,
    TooltipModule,
    SkeletonModule,
    MessageModule,
    ConfirmDialogModule,
    ToastModule,
    CheckboxModule,
    SelectButtonModule,
    AutoCompleteModule,
    ToolbarModule,
    PanelModule,
    BuilderTeamCardComponent,
    PlayerChipComponent,
  ],
  providers: [ClubTeamBuilderTabService, DialogService, ConfirmationService, MessageService],
  templateUrl: './club-team-builder-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubTeamBuilderTabComponent {
  readonly service = inject(ClubTeamBuilderTabService);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private confirmationTrigger: Element | null = null;

  clubId = input.required<string>();
  season = input.required<number>();

  searchQuery = '';
  sortBy: 'name' | 'index' = 'name';
  separateBackups = true;

  // Add player search
  playerSuggestions = signal<Player[]>([]);
  selectedPlayer: Player | null = null;

  teamTypeOptions = Object.values(SubEventTypeEnum)
    .filter((v) => ['M', 'F', 'MX'].includes(v))
    .map((v) => ({ label: v, value: v }));

  constructor() {
    effect(() => {
      this.service.setClubId(this.clubId());
    });

    effect(() => {
      this.service.setSeason(this.season());
    });

    // Auto-initialize when data loads
    effect(() => {
      const teams = this.service.currentTeams();
      if (teams.length > 0 && !this.service.initialized()) {
        this.service.initializeBuilder();
      }
    });
  }

  get filteredUnassignedPlayers() {
    let players = this.service.unassignedPlayers();

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      players = players.filter((p) => p.fullName.toLowerCase().includes(query));
    }

    // Sort by ranking contribution (single + double; MX players also include mix)
    return [...players].sort((a, b) => {
      const teamType = a.gender === 'M' || a.gender === 'F' ? a.gender : 'MX';
      const contribA = getPlayerContribution(a, teamType as 'M' | 'F' | 'MX');
      const contribB = getPlayerContribution(b, teamType as 'M' | 'F' | 'MX');
      return contribA - contribB;
    });
  }

  openImportDialog(event: MouseEvent) {
    const trigger = event.currentTarget;
    const ref = this.dialogService.open(ImportSurveyDialogComponent, {
      header: this.translate.instant('all.club.teamBuilder.import.title'),
      width: '800px',
      breakpoints: { '960px': '90vw', '640px': '95vw' },
      modal: true,
      closeOnEscape: true,
      closable: true,
      closeAriaLabel: this.translate.instant('all.common.cancel'),
      data: {
        systemId: this.service.systemId(),
        clubPlayers: this.service.getClubPlayers(),
        clubId: this.clubId(),
      },
    });

    ref?.onDestroy.subscribe(() => {
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      }
    });

    ref?.onClose.subscribe(async (results: MatchResult[] | null) => {
      if (results) {
        await this.service.processImportResults(results);
        const matchedCount = results.filter((r) => r.player).length;
        const createdCount = results.filter((r) => !r.player && r.createNew).length;
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('all.club.teamBuilder.feedback.surveyImported'),
          detail: this.translate.instant('all.club.teamBuilder.feedback.importCounts', { matched: matchedCount, created: createdCount }),
        });
      }
    });
  }

  openEditSurveyDialog(player: TeamBuilderPlayer) {
    const trigger = this.document.activeElement;
    const ref = this.dialogService.open(EditSurveyDialogComponent, {
      header: this.translate.instant('all.player.survey.edit'),
      width: '600px',
      breakpoints: { '640px': '95vw' },
      modal: true,
      closeOnEscape: true,
      closable: true,
      closeAriaLabel: this.translate.instant('all.button.cancel'),
      data: { player },
    });

    ref?.onDestroy.subscribe(() => {
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      }
    });

    ref?.onClose.subscribe((updatedSurvey: SurveyResponse | null) => {
      if (updatedSurvey) {
        this.service.updatePlayerSurvey(player.id, updatedSurvey);
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('all.club.teamBuilder.feedback.surveyUpdated'),
          detail: this.translate.instant('all.club.teamBuilder.feedback.surveyUpdatedFor', { name: player.fullName }),
        });
      }
    });
  }

  addTeam(type: 'M' | 'F' | 'MX') {
    this.service.addTeam(type);
  }

  openSettingsDialog() {
    const ref = this.dialogService.open(SettingsDialogComponent, {
      header: this.translate.instant('all.club.teamBuilder.settings.title'),
      width: '500px',
      breakpoints: { '640px': '95vw' },
      data: { config: this.service.config() },
    });

    ref?.onClose.subscribe((config: TeamBuilderConfig | null) => {
      if (config) {
        this.service.updateConfig(config);
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('all.club.teamBuilder.feedback.settingsUpdated'),
          detail: this.translate.instant('all.club.teamBuilder.feedback.settingsUpdatedDetail'),
        });
      }
    });
  }

  onPlayerDroppedOnTeam(event: CdkDragDrop<string>) {
    const data = event.item.data as { playerId: string; fromTeamId: string | null };
    const toTeamId = event.container.data;
    if (data.fromTeamId !== toTeamId) {
      this.service.movePlayer(data.playerId, data.fromTeamId, toTeamId);
    }
  }

  onPlayerDroppedOnPool(event: CdkDragDrop<string>) {
    const data = event.item.data as { playerId: string; fromTeamId: string | null };
    if (data.fromTeamId) {
      this.service.movePlayer(data.playerId, data.fromTeamId, null);
    }
  }

  onPlayerDroppedOnStopping(event: CdkDragDrop<string>) {
    const data = event.item.data as { playerId: string; fromTeamId: string | null };
    if (data.fromTeamId !== 'stopping') {
      this.service.movePlayer(data.playerId, data.fromTeamId, 'stopping');
    }
  }

  onMembershipToggled(teamId: string, event: { playerId: string; type: 'REGULAR' | 'BACKUP' }) {
    this.service.setMembershipType(event.playerId, teamId, event.type);
  }

  onSubEventChanged(teamId: string, selection: string) {
    this.service.setTeamSubEvent(teamId, selection);
  }

  openSubEventDialog(team: TeamBuilderTeam) {
    const trigger = this.document.activeElement;
    const options = this.service.getSubEventOptions(team.type);
    const allSubEvents = this.service.getAllSubEvents(team.type);
    const currentValue = team.subEventManuallyOverridden ? (team.selectedSubEvent?.id ?? TEAM_BUILDER_AUTO_SUB_EVENT) : TEAM_BUILDER_AUTO_SUB_EVENT;

    const ref = this.dialogService.open(SubEventDialogComponent, {
      header: this.translate.instant('all.club.teamBuilder.subEvent.title', { name: team.name }),
      width: '500px',
      breakpoints: { '640px': '95vw' },
      modal: true,
      closeOnEscape: true,
      closable: true,
      closeAriaLabel: this.translate.instant('all.button.cancel'),
      data: {
        currentSubEvent: team.originalSubEvent,
        options,
        allSubEvents,
        selectedValue: currentValue,
      },
    });

    ref?.onDestroy.subscribe(() => {
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      }
    });

    ref?.onClose.subscribe((selection: string | null) => {
      if (selection != null) {
        this.service.setTeamSubEvent(team.id, selection);
      }
    });
  }

  removeTeam(teamId: string) {
    this.confirmationTrigger = this.document.activeElement;
    this.confirmationService.confirm({
      message: this.translate.instant('all.club.teamBuilder.feedback.removeMessage'),
      header: this.translate.instant('all.club.teamBuilder.feedback.removeTitle'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('all.button.delete'),
      rejectLabel: this.translate.instant('all.button.cancel'),
      accept: () => this.service.removeTeam(teamId),
    });
  }

  markTeamForRemoval(teamId: string) {
    this.service.markTeamForRemoval(teamId);
  }

  async save() {
    this.confirmationTrigger = this.document.activeElement;
    const saveSummary = this.service.getSaveSummary();
    const validation = this.service.validationSummary();

    let message = this.translate.instant('all.club.teamBuilder.feedback.saveMessage', {
      updated: saveSummary.teamsUpdated,
      created: saveSummary.teamsCreated,
      players: saveSummary.totalPlayers,
      season: this.service.nextSeason(),
    });

    if (saveSummary.teamsRemoved > 0) {
      message += '\n\n' + this.translate.instant('all.club.teamBuilder.feedback.saveRemoved', { count: saveSummary.teamsRemoved });
    }

    if (validation.invalid > 0) {
      message +=
        '\n\n' +
        this.translate.instant('all.club.teamBuilder.feedback.saveWarnings', { count: validation.invalid }) +
        '\n' +
        validation.errors
          .map((error) => {
            const text = this.translate.instant(error.key, error.params);
            return `• ${error.teamName ? `${error.teamName}: ` : ''}${text}`;
          })
          .join('\n');
    }

    this.confirmationService.confirm({
      message,
      header: this.translate.instant('all.club.teamBuilder.save'),
      icon: validation.invalid > 0 ? 'pi pi-exclamation-triangle' : 'pi pi-save',
      acceptLabel: this.translate.instant('all.button.save'),
      rejectLabel: this.translate.instant('all.button.cancel'),
      accept: () => this.doSave(),
    });
  }

  /** Restores the actual trigger for every native confirmation dismissal path. */
  restoreConfirmationFocus(): void {
    if (this.confirmationTrigger instanceof HTMLElement && this.confirmationTrigger.isConnected) {
      this.confirmationTrigger.focus();
    }
    this.confirmationTrigger = null;
  }

  onPlayerDroppedOnRemove(event: CdkDragDrop<string>) {
    const data = event.item.data as { playerId: string; fromTeamId: string | null };
    this.service.removePlayer(data.playerId, data.fromTeamId);
  }

  restorePlayer(playerId: string) {
    this.service.restorePlayer(playerId);
  }

  async searchPlayerToAdd(event: { query: string }) {
    const results = await this.service.searchPlayers(event.query);
    this.playerSuggestions.set(results);
  }

  async onPlayerSelected(event: { value: Player }) {
    const player = event.value;
    if (!player) return;

    const added = await this.service.addExternalPlayer(player);
    if (added) {
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('all.club.teamBuilder.feedback.playerAdded'),
        detail: this.translate.instant('all.club.teamBuilder.feedback.playerAddedDetail', { name: player.fullName }),
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: this.translate.instant('all.club.teamBuilder.feedback.alreadyPresent'),
        detail: this.translate.instant('all.club.teamBuilder.feedback.alreadyPresentDetail', { name: player.fullName }),
      });
    }
    this.selectedPlayer = null;
  }

  private async doSave() {
    const success = await this.service.save();
    if (success) {
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('all.club.teamBuilder.feedback.saved'),
        detail: this.translate.instant('all.club.teamBuilder.feedback.savedDetail', { season: this.service.nextSeason() }),
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('all.common.error'),
        detail: this.translate.instant('all.club.teamBuilder.feedback.saveFailed'),
      });
    }
  }
}
