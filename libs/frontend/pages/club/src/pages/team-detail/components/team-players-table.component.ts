import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SortMeta } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { PlayerStats } from '../page-team-detail.service';

export interface TeamRosterMembership {
  id: string;
  membershipType?: string | null;
  isBase?: boolean;
  isGameOnly?: boolean;
  player?: {
    id: string;
    fullName?: string | null;
    lastName?: string | null;
    slug?: string | null;
  } | null;
}

@Component({
  selector: 'app-team-players-table',
  imports: [DecimalPipe, RouterModule, TableModule, TranslateModule, Tag, TooltipModule, ButtonModule, CardModule, MessageModule],
  templateUrl: './team-players-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
})
export class TeamPlayersTableComponent {
  players = input.required<TeamRosterMembership[]>();
  playerStats = input<Map<string, PlayerStats>>(new Map());
  membershipError = input<string | null>(null);
  onAddPlayerToTeam = input<((playerId: string) => Promise<void>) | null>(null);
  onRemovePlayerFromTeam = input<((membershipId: string) => Promise<void>) | null>(null);

  defaultSort: SortMeta[] = [
    { field: 'membershipType', order: -1 },
    { field: 'player.lastName', order: 1 },
  ];

  playerRows = computed(() => {
    const statsMap = this.playerStats();
    return this.players().map((membership) => {
      const stats = statsMap.get(membership.player?.id ?? '') ?? { played: 0, won: 0, lost: 0, encountersPlayed: 0, totalEncounters: 0 };
      const winPct = stats.played > 0 ? (stats.won / stats.played) * 100 : null;
      const encounterPct = stats.totalEncounters > 0 ? (stats.encountersPlayed / stats.totalEncounters) * 100 : null;
      return {
        ...membership,
        isBase: membership.isBase ?? false,
        membershipLabelKey: membership.isGameOnly
          ? 'all.team.detail.roster.gameOnly'
          : membership.membershipType === 'REGULAR'
            ? 'all.team.detail.roster.member'
            : membership.membershipType === 'BACKUP'
              ? 'all.team.membership.BACKUP.label'
              : null,
        stats: { ...stats, winPct, encounterPct },
      };
    });
  });
}
