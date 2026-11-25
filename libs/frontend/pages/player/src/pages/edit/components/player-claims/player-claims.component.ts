import { Component, computed, inject, signal, effect, input } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';

import { lastValueFrom } from 'rxjs';

import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';

import { Claim, Player } from '@app/models';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@app/frontend-modules-auth/service';

const GET_GLOBAL_CLAIMS = gql`
  query GetGlobalClaims {
    claims(args: { where: { type: { eq: "global" } } }) {
      id
      name
      description
      type
      category
    }
  }
`;

const UPDATE_PLAYER_CLAIMS = gql`
  mutation UpdatePlayerClaims($playerId: ID!, $claimIds: [ID!]!) {
    updatePlayerClaims(playerId: $playerId, claimIds: $claimIds) {
      id
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
  selector: 'app-player-claims',
  standalone: true,
  imports: [ReactiveFormsModule, PanelModule, ButtonModule, CheckboxModule, MessageModule, ProgressBarModule, TranslateModule],
  templateUrl: './player-claims.component.html',
})
export class PlayerClaimsComponent {
  private readonly apollo = inject(Apollo);
  private readonly messageService = inject(MessageService);
  private readonly authService = inject(AuthService);

  // Inputs
  readonly player = input<Player | null>(null);

  // Loading and error states
  readonly loadingClaims = signal(false);
  readonly savingClaims = signal(false);
  readonly error = signal<string | null>(null);

  // Global claims data
  readonly globalClaims = signal<Claim[]>([]);

  readonly claimsByCategory = computed(() => {
    const claims = this.globalClaims();
    const grouped = new Map<string, Claim[]>();

    claims.forEach((claim) => {
      const category = claim.category || 'Other';
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(claim);
    });

    // Convert to array and sort categories
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, claims]) => ({
        category,
        claims: claims.sort((a, b) => (a.name || '').localeCompare(b.name || '')),
      }));
  });

  readonly loading = computed(() => this.loadingClaims());
  readonly saving = computed(() => this.savingClaims());

  readonly claimsForm = new FormRecord<FormControl<boolean>>({});

  constructor() {
    // Load claims on component init
    this.loadGlobalClaims();

    // Set up form controls when claims are loaded
    effect(() => {
      const claims = this.globalClaims();
      this.setupFormControls(claims);
      if (this.canEditClaims() && !this.saving() && !this.loading()) {
        this.claimsForm.enable({ emitEvent: false });
      } else {
        this.claimsForm.disable({ emitEvent: false });
      }
    });

    // Update form values when player data or global claims change
    effect(() => {
      const player = this.player();
      const claims = this.globalClaims();
      if (player && claims.length > 0) {
        this.updateFormValues(player.claims ?? []);
      }
    });
  }

  private async loadGlobalClaims(): Promise<void> {
    this.loadingClaims.set(true);
    this.error.set(null);

    try {
      const result = await lastValueFrom(
        this.apollo.query<{ claims: Claim[] }>({
          query: GET_GLOBAL_CLAIMS,
        }),
      );

      if (!result.data?.claims) throw new Error('Missing claims data');
      this.globalClaims.set(result.data.claims);
    } catch (err) {
      this.error.set('Failed to load claims data');
      this.globalClaims.set([]);
    } finally {
      this.loadingClaims.set(false);
    }
  }

  private setupFormControls(claims: Claim[]): void {
    claims.forEach((claim) => {
      if (claim.id && !this.claimsForm.controls[claim.id]) {
        this.claimsForm.addControl(claim.id, new FormControl(false, { nonNullable: true }));
      }
    });
  }

  private updateFormValues(playerClaims: Claim[]): void {
    // Reset all controls to false first
    Object.keys(this.claimsForm.controls).forEach((claimId) => {
      this.claimsForm.get(claimId)?.setValue(false);
    });

    // Set true for claims the player has
    playerClaims.forEach((claim) => {
      if (claim.id && this.claimsForm.get(claim.id)) {
        this.claimsForm.get(claim.id)?.setValue(true);
      }
    });
  }

  selectAll(): void {
    this.setSelection(Object.keys(this.claimsForm.controls), true);
  }

  selectNone(): void {
    this.setSelection(Object.keys(this.claimsForm.controls), false);
  }

  selectAllInCategory(categoryName: string): void {
    const categoryGroup = this.claimsByCategory().find((group) => group.category === categoryName);
    if (categoryGroup) {
      this.setSelection(
        categoryGroup.claims.map((claim) => claim.id),
        true,
      );
    }
  }

  selectNoneInCategory(categoryName: string): void {
    const categoryGroup = this.claimsByCategory().find((group) => group.category === categoryName);
    if (categoryGroup) {
      this.setSelection(
        categoryGroup.claims.map((claim) => claim.id),
        false,
      );
    }
  }

  private setSelection(claimIds: string[], selected: boolean): void {
    if (!this.canEditClaims() || this.loading() || this.saving()) return;
    claimIds.forEach((claimId) => {
      const control = this.claimsForm.controls[claimId];
      if (control && control.value !== selected) {
        control.setValue(selected);
        control.markAsDirty();
      }
    });
  }

  async saveClaims(): Promise<void> {
    if (this.saving()) throw new Error('Claims save already in progress');
    const player = this.player();
    if (!player?.id) {
      this.error.set('No player selected');
      throw new Error('No player selected');
    }
    const unavailable = !this.canEditClaims()
      ? 'all.player.edit.claims.messages.no-permission'
      : this.loading() || this.globalClaims().length === 0
        ? 'Claims data is unavailable'
        : null;
    if (unavailable) {
      this.error.set(unavailable);
      throw new Error(unavailable);
    }

    this.savingClaims.set(true);
    this.error.set(null);

    try {
      // Get selected claim IDs
      const selectedClaimIds = Object.entries(this.claimsForm.getRawValue())
        .filter(([_, selected]) => selected)
        .map(([claimId]) => claimId);

      const result = await lastValueFrom(
        this.apollo.mutate<{ updatePlayerClaims: { id: string } }>({
          mutation: UPDATE_PLAYER_CLAIMS,
          variables: {
            playerId: player.id,
            claimIds: selectedClaimIds,
          },
          refetchQueries: [
            {
              query: gql`
                query GetPlayerWithClaims($id: ID!) {
                  player(id: $id) {
                    id
                    fullName
                    claims {
                      id
                      name
                      description
                      type
                    }
                  }
                }
              `,
              variables: { id: player.id },
            },
          ],
        }),
      );

      if (result.error) throw result.error;
      if (!result.data?.updatePlayerClaims) throw new Error('Player claims update was not confirmed');
      this.claimsForm.markAsPristine();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Player claims updated successfully',
      });

      return Promise.resolve();
    } catch (err) {
      this.error.set('Failed to update player claims');
      return Promise.reject(err);
    } finally {
      this.savingClaims.set(false);
    }
  }

  get isDirty(): boolean {
    return this.claimsForm.dirty;
  }

  get isValid(): boolean {
    return this.claimsForm.valid;
  }

  canEditClaims(): boolean {
    const player = this.player();
    // Use AuthService for permission check
    return this.authService.hasAnyPermission(['edit-any:player', `${player?.id}_edit:player`]);
  }
}
