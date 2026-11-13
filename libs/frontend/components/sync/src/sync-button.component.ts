import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { lastValueFrom } from 'rxjs';

const TRIGGER_EVENT_SYNC_MUTATION = gql`
  mutation TriggerEventSync($eventId: ID!, $includeSubComponents: Boolean!) {
    triggerEventSync(eventId: $eventId, includeSubComponents: $includeSubComponents)
  }
`;

const TRIGGER_SUB_EVENT_SYNC_MUTATION = gql`
  mutation TriggerSubEventSync($subEventId: ID!, $includeSubComponents: Boolean!) {
    triggerSubEventSync(subEventId: $subEventId, includeSubComponents: $includeSubComponents)
  }
`;

const TRIGGER_DRAW_SYNC_MUTATION = gql`
  mutation TriggerDrawSync($drawId: ID!, $includeSubComponents: Boolean!) {
    triggerDrawSync(drawId: $drawId, includeSubComponents: $includeSubComponents)
  }
`;

const TRIGGER_GAME_SYNC_MUTATION = gql`
  mutation TriggerGameSync($drawId: ID!, $matchCodes: [String!]) {
    triggerGameSync(drawId: $drawId, matchCodes: $matchCodes)
  }
`;

const CLEAR_EVENT_CACHE_MUTATION = gql`
  mutation ClearEventCache($eventId: ID!, $includeChildren: Boolean!) {
    clearTournamentApiCache(eventId: $eventId, includeChildren: $includeChildren)
  }
`;

const CLEAR_SUB_EVENT_CACHE_MUTATION = gql`
  mutation ClearSubEventCache($subEventId: ID!, $includeChildren: Boolean!) {
    clearSubEventApiCache(subEventId: $subEventId, includeChildren: $includeChildren)
  }
`;

const CLEAR_DRAW_CACHE_MUTATION = gql`
  mutation ClearDrawCache($drawId: ID!, $includeChildren: Boolean!) {
    clearDrawApiCache(drawId: $drawId, includeChildren: $includeChildren)
  }
`;

export type SyncLevel = 'event' | 'sub-event' | 'draw' | 'game';

export interface SyncButtonConfig {
  level: SyncLevel;
  // Internal IDs (GUIDs) for sync mutations
  eventId?: string;
  subEventId?: string;
  drawId?: string;
  // Display names for the UI
  eventName?: string;
  subEventName?: string;
  drawName?: string;
}

@Component({
  selector: 'app-sync-button',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    ButtonModule,
    MenuModule,
    SplitButtonModule,
    DialogModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './sync-button.component.html',
})
export class SyncButtonComponent {
  private readonly apollo = inject(Apollo);
  private readonly messageService = inject(MessageService);
  public translate = inject(TranslateService);

  // Inputs
  config = input.required<SyncButtonConfig>();

  // State
  loading = signal(false);
  gameSyncDialogVisible = signal(false);
  matchCodes = '';

  // Helper methods for template
  getSyncIcon(level: SyncLevel): string {
    return level === 'game' ? 'pi pi-download' : 'pi pi-refresh';
  }

  getSyncLabel(level: SyncLevel): string {
    const labels = {
      event: 'all.sync.dashboard.actions.fullSync',
      'sub-event': 'all.sync.dashboard.actions.fullSync',
      draw: 'all.sync.dashboard.actions.fullSync',
      game: 'all.sync.dashboard.actions.fullSync',
    };
    return labels[level];
  }

  getSyncItems(level: SyncLevel): any[] {
    const cacheItems = [
      { separator: true },
      {
        label: this.translate.instant('all.cache.clear'),
        icon: 'pi pi-trash',
        command: () => this.clearCache(false),
      },
      {
        label: this.translate.instant('all.cache.clearWithChildren'),
        icon: 'pi pi-trash',
        command: () => this.clearCache(true),
      },
    ];

    const baseItems = {
      event: [
        {
          label: this.translate.instant('all.sync.dashboard.actions.sync'),
          icon: 'pi pi-refresh',
          command: () => {
            console.log('Full event sync selected');
            this.syncEvent();
          },
        },
        ...cacheItems,
      ],
      'sub-event': [
        {
          label: this.translate.instant('all.sync.dashboard.actions.sync'),
          icon: 'pi pi-refresh',
          command: () => this.syncSubEvent(),
        },
        ...cacheItems,
      ],
      draw: [
        {
          label: this.translate.instant('all.sync.dashboard.actions.sync'),
          icon: 'pi pi-refresh',
          command: () => this.syncDraw(),
        },
        ...cacheItems,
      ],
      game: [
        {
          label: this.translate.instant('all.sync.dashboard.actions.sync'),
          icon: 'pi pi-download',
          command: () => this.syncGames(),
        },
        {
          label: this.translate.instant('all.sync.dashboard.actions.sync'),
          icon: 'pi pi-list',
          command: () => this.openGameSyncDialog(),
        },
      ],
    };

    return baseItems[level] || [];
  }

  handleSyncClick(level: SyncLevel): void {
    switch (level) {
      case 'event':
        this.syncEvent(true);
        break;
      case 'sub-event':
        this.syncSubEvent(true);
        break;
      case 'draw':
        this.syncDraw(true);
        break;
      case 'game':
        this.syncGames();
        break;
    }
  }

  // Sync methods
  async syncEvent(includeSubComponents = false): Promise<void> {
    const cfg = this.config();
    if (!cfg?.eventId) return;

    this.loading.set(true);
    try {
      await lastValueFrom(
        this.apollo.mutate<{ triggerEventSync: boolean }>({
          mutation: TRIGGER_EVENT_SYNC_MUTATION,
          variables: {
            eventId: cfg.eventId,
            includeSubComponents,
          },
        }),
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Event sync queued successfully for ${cfg.eventId}`,
      });
    } catch (e: unknown) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to sync ${cfg.eventName}`,
      });
    } finally {
      this.loading.set(false);
    }
  }

  async syncSubEvent(includeSubComponents = false): Promise<void> {
    const cfg = this.config();
    if (!cfg?.subEventId) return;

    this.loading.set(true);
    try {
      await lastValueFrom(
        this.apollo.mutate<{ triggerSubEventSync: boolean }>({
          mutation: TRIGGER_SUB_EVENT_SYNC_MUTATION,
          variables: {
            subEventId: cfg.subEventId,
            includeSubComponents,
          },
        }),
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Sub-event sync queued successfully for ${cfg.subEventId}`,
      });
    } catch (e: unknown) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to sync sub-event ${cfg.subEventName}`,
      });
    } finally {
      this.loading.set(false);
    }
  }

  async syncDraw(includeSubComponents = false): Promise<void> {
    const cfg = this.config();
    if (!cfg?.drawId) return;

    this.loading.set(true);
    try {
      await lastValueFrom(
        this.apollo.mutate<{ triggerDrawSync: boolean }>({
          mutation: TRIGGER_DRAW_SYNC_MUTATION,
          variables: {
            drawId: cfg.drawId,
            includeSubComponents,
          },
        }),
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Draw sync queued successfully for ${cfg.drawId}`,
      });
    } catch (e: unknown) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to sync draw ${cfg.drawName}`,
      });
    } finally {
      this.loading.set(false);
    }
  }

  async syncGames(): Promise<void> {
    const cfg = this.config();
    if (!cfg?.drawId) return;

    this.loading.set(true);
    try {
      await lastValueFrom(
        this.apollo.mutate<{ triggerGameSync: boolean }>({
          mutation: TRIGGER_GAME_SYNC_MUTATION,
          variables: {
            drawId: cfg.drawId,
            matchCodes: undefined,
          },
        }),
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Game sync queued successfully',
      });
    } catch (e: unknown) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to sync games',
      });
    } finally {
      this.loading.set(false);
    }
  }

  async clearCache(includeChildren: boolean): Promise<void> {
    const cfg = this.config();
    if (!cfg) return;

    let mutation: any;
    let variables: Record<string, unknown>;
    let resultKey: string;

    switch (cfg.level) {
      case 'event':
        if (!cfg.eventId) return;
        mutation = CLEAR_EVENT_CACHE_MUTATION;
        variables = { eventId: cfg.eventId, includeChildren };
        resultKey = 'clearTournamentApiCache';
        break;
      case 'sub-event':
        if (!cfg.subEventId) return;
        mutation = CLEAR_SUB_EVENT_CACHE_MUTATION;
        variables = { subEventId: cfg.subEventId, includeChildren };
        resultKey = 'clearSubEventApiCache';
        break;
      case 'draw':
        if (!cfg.drawId) return;
        mutation = CLEAR_DRAW_CACHE_MUTATION;
        variables = { drawId: cfg.drawId, includeChildren };
        resultKey = 'clearDrawApiCache';
        break;
      default:
        return;
    }

    this.loading.set(true);
    try {
      const result = await lastValueFrom(
        this.apollo.mutate<Record<string, boolean>>({
          mutation,
          variables,
        }),
      );

      if (result.data?.[resultKey]) {
        this.messageService.add({
          severity: 'success',
          summary: 'Cache Cleared',
          detail: 'Cleared cached API entries',
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cache Clear',
          detail: 'No cache entries found',
        });
      }
    } catch (e: unknown) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to clear API cache',
      });
    } finally {
      this.loading.set(false);
    }
  }

  // Dialog methods
  openGameSyncDialog(): void {
    this.matchCodes = '';
    this.gameSyncDialogVisible.set(true);
  }

  closeGameSyncDialog(): void {
    this.gameSyncDialogVisible.set(false);
  }

  async executeGameSync(): Promise<void> {
    const cfg = this.config();
    if (!cfg?.drawId) return;

    this.loading.set(true);
    try {
      const matchCodesArray = this.matchCodes ? this.matchCodes.split(',').map((code) => code.trim()) : undefined;

      await lastValueFrom(
        this.apollo.mutate<{ triggerGameSync: boolean }>({
          mutation: TRIGGER_GAME_SYNC_MUTATION,
          variables: {
            drawId: cfg.drawId,
            matchCodes: matchCodesArray,
          },
        }),
      );

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Game sync queued successfully',
      });

      this.closeGameSyncDialog();
    } catch (e: unknown) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to sync specific games',
      });
    } finally {
      this.loading.set(false);
    }
  }
}
