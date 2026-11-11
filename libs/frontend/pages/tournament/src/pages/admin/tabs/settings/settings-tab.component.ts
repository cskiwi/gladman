import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TournamentEvent } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { PhaseStepperComponent } from './components/phase-stepper/phase-stepper.component';
import { GeneralSettingsComponent } from './components/general-settings/general-settings.component';
import { SubEventsComponent } from './components/sub-events/sub-events.component';
import { SettingsTabService } from './settings-tab.service';

@Component({
  selector: 'app-settings-tab',
  standalone: true,
  imports: [TranslateModule, ConfirmDialogModule, MessageModule, PhaseStepperComponent, GeneralSettingsComponent, SubEventsComponent],
  providers: [ConfirmationService],
  templateUrl: './settings-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsTabComponent {
  tournament = input.required<TournamentEvent>();
  tournamentUpdated = output<void>();

  private readonly dataService = new SettingsTabService();
  private readonly translate = inject(TranslateService);
  private readonly confirmation = inject(ConfirmationService);

  // State
  updating = this.dataService.updating;
  updateError = this.dataService.updateError;

  handleAdvancePhase(): void {
    this.confirm('advancePhaseConfirm', 'pi pi-arrow-right', 'primary', async () => {
      const result = await this.dataService.advancePhase(this.tournament());
      if (result) {
        this.tournamentUpdated.emit();
      }
    });
  }

  handleGoBackPhase(): void {
    this.confirm('goBackPhaseConfirm', 'pi pi-arrow-left', 'primary', async () => {
      const result = await this.dataService.goBackPhase(this.tournament());
      if (result) {
        this.tournamentUpdated.emit();
      }
    });
  }

  async handleSaveSettings(data: {
    name?: string;
    firstDay?: Date;
    closeDate?: Date;
    enrollmentOpenDate?: Date;
    enrollmentCloseDate?: Date;
    official?: boolean;
    allowGuestEnrollments?: boolean;
    schedulePublished?: boolean;
  }): Promise<void> {
    const result = await this.dataService.updateTournament(this.tournament().id, data);
    if (result) {
      this.tournamentUpdated.emit();
    }
  }

  async handleCreateSubEvent(data: {
    eventId: string;
    name: string;
    gameType: string;
    eventType?: string;
    minLevel?: number;
    maxLevel?: number;
    maxEntries?: number;
    waitingListEnabled?: boolean;
  }): Promise<void> {
    const result = await this.dataService.createSubEvent(data);
    if (result) {
      this.tournamentUpdated.emit();
    }
  }

  async handleUpdateSubEvent(payload: {
    subEventId: string;
    data: {
      name?: string;
      eventType?: string;
      maxEntries?: number;
      waitingListEnabled?: boolean;
      minLevel?: number;
      maxLevel?: number;
    };
  }): Promise<void> {
    const result = await this.dataService.updateSubEvent(payload.subEventId, payload.data);
    if (result) {
      this.tournamentUpdated.emit();
    }
  }

  handleDeleteSubEvent(subEventId: string): void {
    this.confirm('deleteSubEventConfirm', 'pi pi-trash', 'danger', async () => {
      const result = await this.dataService.deleteSubEvent(subEventId);
      if (result) {
        this.tournamentUpdated.emit();
      }
    });
  }

  private confirm(
    key: 'advancePhaseConfirm' | 'goBackPhaseConfirm' | 'deleteSubEventConfirm',
    icon: string,
    severity: 'primary' | 'danger',
    accept: () => unknown,
  ): void {
    const prefix = `all.tournament.admin.settings.${key}`;
    this.confirmation.confirm({
      header: this.translate.instant(`${prefix}.header`),
      message: this.translate.instant(`${prefix}.message`),
      acceptLabel: this.translate.instant(`${prefix}.accept`),
      rejectLabel: this.translate.instant('all.button.cancel'),
      icon,
      acceptButtonProps: { severity },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept,
    });
  }
}
