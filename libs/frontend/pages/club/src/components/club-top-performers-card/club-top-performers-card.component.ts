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
    loader: async ({ params, abortSignal }) => {
      if (!params.clubId || params.season == null) return [];
      try {
        const result = await lastValueFrom(
          this.apollo.query<{ club: { topPerformers: ClubTopPerformerRow[] } | null }>({
            query: gql`
              query ClubTopPerformers($id: ID!, $season: Int!, $take: Int!, $minGames: Int!) {
                club(id: $id) {
                  id
                  topPerformers(season: $season, take: $take, minGames: $minGames) {
                    wins
                    total
                    winRate
                    singles {
                      wins
                      total
                    }
                    doubles {
                      wins
                      total
                    }
                    mixed {
                      wins
                      total
                    }
                    player {
                      id
                      slug
                      fullName
                    }
                  }
                }
              }
            `,
            variables: {
              id: params.clubId,
              season: params.season,
              take: params.take,
              minGames: params.minGames,
            },
            context: { signal: abortSignal },
          }),
        );
        return result.data?.club?.topPerformers ?? [];
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
