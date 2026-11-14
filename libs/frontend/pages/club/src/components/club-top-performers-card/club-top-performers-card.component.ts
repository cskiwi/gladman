import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { lastValueFrom } from 'rxjs';
import { aggregateTopPerformers, ClubTopPerformerGameRow, getSeasonWindow } from './club-top-performers.util';

export interface ClubTopPerformerRow {
  player: {
    id: string;
    slug: string;
    fullName: string;
  };
  wins: number;
  total: number;
  winRate: number;
  singles: { wins: number; total: number };
  doubles: { wins: number; total: number };
  mixed: { wins: number; total: number };
}

@Component({
  selector: 'app-club-top-performers-card',
  standalone: true,
  imports: [RouterLink, CardModule, ProgressBarModule, TagModule, TooltipModule, TranslateModule],
  templateUrl: './club-top-performers-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubTopPerformersCardComponent {
  private readonly apollo = inject(Apollo);

  readonly clubId = input.required<string | null>();
  readonly season = input.required<number | null>();
  readonly take = input<number>(5);
  readonly minGames = input<number>(3);

  private readonly dataResource = resource({
    params: () => ({
      clubId: this.clubId(),
      season: this.season(),
      take: this.take(),
      minGames: this.minGames(),
    }),
    loader: async ({ params, abortSignal }): Promise<ClubTopPerformerRow[]> => {
      if (!params.clubId || params.season == null) return [];
      try {
        const context = { signal: abortSignal };

        // 1. Players that belong to the club's teams in this season.
        const teamsResult = await lastValueFrom(
          this.apollo.query<{
            club: { teams: { teamPlayerMemberships: { playerId: string; player: ClubTopPerformerRow['player'] | null }[] }[] } | null;
          }>({
            query: gql`
              query ClubTopPerformersPlayers($id: ID!, $season: Float!) {
                club(id: $id) {
                  id
                  teams(args: { where: [{ season: { eq: $season } }] }) {
                    id
                    teamPlayerMemberships {
                      id
                      playerId
                      player {
                        id
                        slug
                        fullName
                      }
                    }
                  }
                }
              }
            `,
            variables: { id: params.clubId, season: params.season },
            context,
          }),
        );
        const memberships = (teamsResult.data?.club?.teams ?? []).flatMap((t) => t.teamPlayerMemberships ?? []);
        const playerMap = new Map(memberships.filter((m) => m.player).map((m) => [m.playerId, m.player as ClubTopPerformerRow['player']]));
        // Only players that can be displayed take part, so a missing player never takes a top-N spot
        const playerIds = [...playerMap.keys()];
        if (playerIds.length === 0) return [];

        // 2. Completed games of those players within the season window.
        const window = getSeasonWindow(params.season);
        const gamesResult = await lastValueFrom(
          this.apollo.query<{ gamePlayerMemberships: ClubTopPerformerGameRow[] }>({
            query: gql`
              query ClubTopPerformersGames($playerIds: [String!]!, $start: DateTime!, $end: DateTime!) {
                gamePlayerMemberships(
                  args: {
                    where: [
                      {
                        playerId: { in: $playerIds }
                        game: { winner: { isNull: false }, set1Team1: { gt: 0 }, set1Team2: { gt: 0 }, playedAt: { gte: $start, lt: $end } }
                      }
                    ]
                  }
                ) {
                  id
                  playerId
                  team
                  game {
                    id
                    winner
                    gameType
                    playedAt
                  }
                }
              }
            `,
            variables: { playerIds, start: new Date(window.start).toISOString(), end: new Date(window.end).toISOString() },
            context,
          }),
        );

        const stats = aggregateTopPerformers(gamesResult.data?.gamePlayerMemberships ?? [], {
          take: params.take,
          minGames: params.minGames,
          endExclusive: new Date(window.end).toISOString(),
        });
        if (stats.length === 0) return [];

        return stats
          .map((s) => {
            const player = playerMap.get(s.playerId);
            if (!player) return null;
            return { player, wins: s.wins, total: s.total, winRate: s.winRate, singles: s.singles, doubles: s.doubles, mixed: s.mixed };
          })
          .filter((v): v is ClubTopPerformerRow => v !== null);
      } catch (err) {
        console.warn('Top performers card query failed', err as HttpErrorResponse);
        return [];
      }
    },
  });

  readonly rows = computed(() =>
    (this.dataResource.value() ?? []).map((r) => ({
      id: r.player.id,
      slug: r.player.slug ?? r.player.id,
      fullName: r.player.fullName ?? '',
      wins: r.wins,
      losses: Math.max(0, r.total - r.wins),
      total: r.total,
      winRatePct: Math.round(r.winRate * 100),
      disciplines: [
        { code: 'S', label: 'all.tournament.gameTypes.singles', ...r.singles },
        { code: 'D', label: 'all.tournament.gameTypes.doubles', ...r.doubles },
        { code: 'MX', label: 'all.tournament.gameTypes.mixed', ...r.mixed },
      ],
    })),
  );

  readonly loading = computed(() => this.dataResource.isLoading());
}
