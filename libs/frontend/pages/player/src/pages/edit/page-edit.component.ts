import { Component, computed, inject, signal, resource, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

import { lastValueFrom } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { TabsModule } from 'primeng/tabs';

import { PageHeaderComponent } from '@app/frontend-components/page-header';
import { BreadcrumbComponent } from '@app/frontend-components/breadcrumb';
import { Player } from '@app/models';
import { MessageService } from 'primeng/api';
import { injectParams } from 'ngxtension/inject-params';
import { TranslateModule } from '@ngx-translate/core';

import { PlayerProfileComponent } from './components/player-profile/player-profile.component';
import { PlayerClaimsComponent } from './components/player-claims/player-claims.component';
import { PlayerRankingComponent } from './components/player-ranking/player-ranking.component';

const GET_PLAYER_WITH_DETAILS = gql`
  query GetPlayerWithDetails($id: ID!) {
    player(id: $id) {
      id
      fullName
      firstName
      lastName
      email
      phone
      gender
      birthDate
      competitionPlayer
      sub
      memberId
      claims {
        id
        name
        description
        type
      }
    }
  }
`;

@Component({
  selector: 'app-page-edit',
  standalone: true,
  imports: [
    ButtonModule,
    MessageModule,
    ProgressBarModule,
    ToastModule,
    TabsModule,
    PageHeaderComponent,
    BreadcrumbComponent,
    TranslateModule,
    PlayerProfileComponent,
    PlayerClaimsComponent,
    PlayerRankingComponent,
  ],
  providers: [MessageService],
  templateUrl: './page-edit.component.html',
  host: { class: 'block' },
})
export class PageEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly apollo = inject(Apollo);
  private readonly messageService = inject(MessageService);

  // Get player ID from route
  private readonly playerId = injectParams('playerId');

  // View children
  private readonly profileComponent = viewChild(PlayerProfileComponent);
  private readonly claimsComponent = viewChild(PlayerClaimsComponent);

  // Loading and error states
  readonly loadingPlayer = signal(false);
  readonly error = signal<string | null>(null);
  readonly saving = signal(false);

  // Current tab index
  readonly activeTabIndex = signal('0');

  // Player data resource
  private readonly playerResource = resource({
    params: () => ({ playerId: this.playerId() }),
    loader: async ({ params }) => {
      if (!params.playerId) return null;

      this.loadingPlayer.set(true);
      this.error.set(null);

      try {
        const result = await lastValueFrom(
          this.apollo.query<{ player: Player }>({
            query: GET_PLAYER_WITH_DETAILS,
            variables: { id: params.playerId },
          }),
        );

        if (!result.data?.player) throw new Error('Player not found');
        return result.data.player;
      } catch {
        this.error.set('Failed to load player data');
        return null;
      } finally {
        this.loadingPlayer.set(false);
      }
    },
  });

  // Public computed properties
  readonly player = computed(() => this.playerResource.value());
  readonly loading = computed(() => this.loadingPlayer());

  // Removed: currentUser and userPermissions, now handled by child components via AuthService

  async saveCurrentTab(): Promise<void> {
    if (this.saving() || !this.hasCurrentTabChanges) return;
    const activeTab = this.activeTabIndex();
    this.saving.set(true);

    try {
      switch (activeTab) {
        case '0': {
          // Profile tab
          const profileComponent = this.profileComponent();
          if (profileComponent?.isDirty) {
            await profileComponent.saveProfile();
          }
          break;
        }

        case '1': {
          // Claims tab
          const claimsComponent = this.claimsComponent();
          if (claimsComponent?.isDirty) {
            await claimsComponent.saveClaims();
          }
          break;
        }
      }
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Some changes could not be saved',
      });
    } finally {
      this.saving.set(false);
    }
  }

  async saveAll(): Promise<void> {
    if (this.saving()) return;
    const profileComponent = this.profileComponent();
    const claimsComponent = this.claimsComponent();

    if (!this.hasUnsavedChanges) {
      this.messageService.add({
        severity: 'info',
        summary: 'No Changes',
        detail: 'No changes to save',
      });
      return;
    }

    this.saving.set(true);
    try {
      // The profile reports validation locally without rejecting its save promise.
      if (profileComponent?.isDirty && !profileComponent.isValid) {
        await profileComponent.saveProfile();
        return;
      }

      const promises: Promise<void>[] = [];
      if (profileComponent?.isDirty) {
        promises.push(profileComponent.saveProfile());
      }
      if (claimsComponent?.isDirty) {
        promises.push(claimsComponent.saveClaims());
      }
      const results = await Promise.allSettled(promises);
      const failure = results.find((result) => result.status === 'rejected');
      if (failure) throw failure.reason;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'All changes saved successfully',
      });

      // Navigate back to player detail page
      this.router.navigate(['..'], { relativeTo: this.route });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Some changes could not be saved',
      });
    } finally {
      this.saving.set(false);
    }
  }

  cancel(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  get hasUnsavedChanges(): boolean {
    const profileComponent = this.profileComponent();
    const claimsComponent = this.claimsComponent();

    return (profileComponent?.isDirty ?? false) || (claimsComponent?.isDirty ?? false);
  }

  get hasCurrentTabChanges(): boolean {
    if (this.activeTabIndex() === '0') return this.profileComponent()?.isDirty ?? false;
    if (this.activeTabIndex() === '1') return this.claimsComponent()?.isDirty ?? false;
    return false;
  }
}
