import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Player } from '@app/models';
import { AuthService } from '@app/frontend-modules-auth/service';
import { ClubPlayersTabService } from './club-players-tab.service';

const PAGE_SIZE = 25;

@Component({
  selector: 'app-club-players-tab',
  standalone: true,
  providers: [ClubPlayersTabService],
  imports: [
    FormsModule,
    RouterModule,
    TranslateModule,
    AvatarModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MessageModule,
    MultiSelectModule,
    SkeletonModule,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './club-players-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubPlayersTabComponent {
  readonly service = inject(ClubPlayersTabService);
  private readonly auth = inject(AuthService);

  clubId = input.required<string>();
  season = input.required<number>();

  readonly pageSize = PAGE_SIZE;
  readonly skeletonRows = [1, 2, 3, 4, 5, 6];

  searchQuery = signal<string>('');
  selectedTeamIds = signal<string[]>([]);

  /** Signed-in player id (null when signed out); highlights the user's own row. */
  readonly ownPlayerId = computed<string | null>(() => this.auth.user()?.id ?? null);

  filteredPlayers = computed(() => {
    const players = this.service.players();
    const selected = this.selectedTeamIds();
    const query = this.searchQuery().toLowerCase().trim();

    return players.filter((player) => {
      const matchesTeam = selected.length === 0 || player.teamPlayerMemberships?.some((m) => selected.includes(m.team?.id ?? ''));
      const matchesSearch = !query || (player.fullName || '').toLowerCase().includes(query);
      return matchesTeam && matchesSearch;
    });
  });

  readonly isFiltered = computed(() => this.filteredPlayers().length !== this.service.players().length);

  readonly countKey = computed(() => `all.club.detail.players.count.${this.service.players().length === 1 ? 'one' : 'other'}`);

  /** First visible row; returns to the first page whenever the filters change the result set. */
  readonly first = linkedSignal({ source: this.filteredPlayers, computation: () => 0 });

  getPlayerInitials(player: Player): string {
    if (!player.firstName && !player.lastName) return '?';
    return `${player.firstName?.charAt(0) ?? ''}${player.lastName?.charAt(0) ?? ''}`.toUpperCase();
  }

  constructor() {
    effect(() => {
      this.service.setClubId(this.clubId());
    });

    effect(() => {
      this.service.setSeason(this.season());
    });
  }
}
