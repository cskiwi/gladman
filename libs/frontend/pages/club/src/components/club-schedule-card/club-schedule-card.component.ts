import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { lastValueFrom } from 'rxjs';
import { resource } from '@angular/core';

export interface ClubUpcomingEncounterRow {
  id: string;
  date: string | null;
  homeTeam: { id: string; name: string | null } | null;
  awayTeam: { id: string; name: string | null } | null;
}

@Component({
  selector: 'app-club-schedule-card',
  standalone: true,
  imports: [DatePipe, CardModule, ProgressBarModule, TranslateModule],
  templateUrl: './club-schedule-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubScheduleCardComponent {
  private readonly apollo = inject(Apollo);

  readonly clubId = input.required<string | null>();
  readonly season = input.required<number | null>();
  readonly take = input<number>(5);

  private readonly dataResource = resource({
    params: () => ({ clubId: this.clubId(), season: this.season(), take: this.take() }),
    loader: async ({ params, abortSignal }) => {
      if (!params.clubId || params.season == null) return [];
      try {
        const context = { signal: abortSignal };
        const teamsResult = await lastValueFrom(
          this.apollo.query<{ club: { teams: { id: string }[] } | null }>({
            query: gql`
              query ClubUpcomingTeams($id: ID!, $season: Float!) {
                club(id: $id) {
                  id
                  teams(args: { where: [{ season: { eq: $season } }] }) {
                    id
                  }
                }
              }
            `,
            variables: { id: params.clubId, season: params.season },
            context,
          }),
        );
        const teamIds = (teamsResult.data?.club?.teams ?? []).map((t) => t.id);
        if (teamIds.length === 0) return [];

        const result = await lastValueFrom(
          this.apollo.query<{ competitionEncounters: ClubUpcomingEncounterRow[] }>({
            query: gql`
              query ClubUpcomingEncounters($teamIds: [String!]!, $now: DateTime!, $take: Int!) {
                competitionEncounters(
                  args: {
                    where: [{ homeTeamId: { in: $teamIds }, date: { gt: $now } }, { awayTeamId: { in: $teamIds }, date: { gt: $now } }]
                    order: { date: ASC }
                    take: $take
                  }
                ) {
                  id
                  date
                  homeTeam {
                    id
                    name
                  }
                  awayTeam {
                    id
                    name
                  }
                }
              }
            `,
            variables: { teamIds, now: new Date().toISOString(), take: Math.max(1, Math.min(params.take ?? 5, 20)) },
            context,
          }),
        );
        return result.data?.competitionEncounters ?? [];
      } catch (err) {
        console.warn('Club schedule card query failed', err as HttpErrorResponse);
        return [];
      }
    },
  });

  readonly items = computed(() => {
    const list = this.dataResource.value() ?? [];
    const now = Date.now();
    return list.filter((e) => !e.date || new Date(e.date).getTime() > now);
  });

  readonly loading = computed(() => this.dataResource.isLoading());
}
