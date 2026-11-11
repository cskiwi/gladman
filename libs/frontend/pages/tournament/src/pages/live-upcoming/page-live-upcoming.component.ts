import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnDestroy, resource } from '@angular/core';
import { DatePipe } from '@angular/common';
import { injectParams } from 'ngxtension/inject-params';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo, gql } from 'apollo-angular';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { SectionHeaderComponent } from '@app/frontend-components/section-header';
import { TagModule } from 'primeng/tag';
import { lastValueFrom } from 'rxjs';
import { TournamentLiveService } from '../../services';
import { LiveGameCardComponent } from '../../components/live-game-card/live-game-card.component';
import { LiveConnectionState, LiveDisplayHeaderComponent } from '../../components/live-display-header/live-display-header.component';

interface UpcomingGame {
  gameId: string;
  courtName?: string;
  scheduledTime?: string;
  team1: string[];
  team2: string[];
  category?: string;
  round?: string;
}

interface UpcomingResult {
  name?: string;
  games: UpcomingGame[];
}

interface UpcomingQuery {
  tournamentEvent: {
    name?: string;
    tournamentSubEvents?: {
      name?: string;
      drawTournaments?: {
        games?: {
          id: string;
          courtId?: string;
          scheduledTime?: string;
          winner?: number;
          round?: string;
          order?: number;
          gamePlayerMemberships?: { team?: number; player?: number; gamePlayer?: { fullName?: string } }[];
        }[];
      }[];
    }[];
  };
  tournamentScheduleCourts: { id: string; name?: string }[];
}

const UPCOMING_QUERY = gql`
  query TournamentLiveUpcoming($id: ID!) {
    tournamentEvent(id: $id) {
      id
      name
      tournamentSubEvents {
        id
        name
        drawTournaments {
          id
          games {
            id
            courtId
            scheduledTime
            winner
            round
            order
            gamePlayerMemberships {
              id
              team
              player
              gamePlayer {
                id
                fullName
              }
            }
          }
        }
      }
    }
    tournamentScheduleCourts(tournamentEventId: $id) {
      id
      name
    }
  }
`;

@Component({
  selector: 'app-page-live-upcoming',
  standalone: true,
  imports: [
    DatePipe,
    TranslateModule,
    CardModule,
    MessageModule,
    TagModule,
    SectionHeaderComponent,
    LiveDisplayHeaderComponent,
    LiveGameCardComponent,
  ],
  templateUrl: './page-live-upcoming.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLiveUpcomingComponent implements OnDestroy {
  protected readonly liveService = inject(TournamentLiveService);
  private readonly apollo = inject(Apollo);
  protected readonly tournamentId = injectParams('tournamentId');

  private readonly upcomingResource = resource({
    params: () => this.tournamentId(),
    loader: async ({ params: id, abortSignal }): Promise<UpcomingResult> => {
      if (!id) {
        return { games: [] };
      }
      const { data } = await lastValueFrom(
        this.apollo.query<UpcomingQuery>({
          query: UPCOMING_QUERY,
          variables: { id },
          fetchPolicy: 'network-only',
          context: { signal: abortSignal },
        }),
      );
      return data ? { name: data.tournamentEvent.name, games: this.toUpcomingGames(data) } : { games: [] };
    },
  });

  upcomingGames = computed(() => this.upcomingResource.value()?.games ?? []);
  tournamentName = computed(() => this.upcomingResource.value()?.name);
  stats = computed(() => this.liveService.tournamentStats());
  readonly connectionState = computed<LiveConnectionState>(() =>
    this.liveService.isConnected() ? 'connected' : this.liveService.isConnecting() ? 'connecting' : 'offline',
  );

  protected announcementSeverity(type: string): 'error' | 'warn' | 'info' {
    return type === 'urgent' ? 'error' : type === 'warning' ? 'warn' : 'info';
  }

  constructor() {
    effect(() => {
      const id = this.tournamentId();
      if (id) {
        this.liveService.connectToTournament(id);
      }
    });

    // Refetch whenever the schedule changes or a game finishes
    const reload = () => this.upcomingResource.reload();
    const stopSchedule = this.liveService.onScheduleUpdated(reload);
    const stopCompleted = this.liveService.onGameCompleted(reload);
    inject(DestroyRef).onDestroy(() => {
      stopSchedule();
      stopCompleted();
    });
  }

  ngOnDestroy(): void {
    this.liveService.disconnect();
  }

  /** Unfinished games, soonest first; unscheduled games go last in draw order. */
  private toUpcomingGames(data: UpcomingQuery): UpcomingGame[] {
    const courts = new Map(data.tournamentScheduleCourts.map((court) => [court.id, court.name]));
    return (data.tournamentEvent.tournamentSubEvents ?? [])
      .flatMap((subEvent) =>
        (subEvent.drawTournaments ?? []).flatMap((draw) =>
          (draw.games ?? [])
            .filter((game) => !game.winner)
            .map((game) => {
              const team = (nr: number) =>
                (game.gamePlayerMemberships ?? [])
                  .filter((membership) => membership.team === nr)
                  .sort((a, b) => (a.player ?? 0) - (b.player ?? 0))
                  .map((membership) => membership.gamePlayer?.fullName)
                  .filter((name): name is string => !!name);
              return {
                gameId: game.id,
                courtName: game.courtId ? courts.get(game.courtId) : undefined,
                scheduledTime: game.scheduledTime,
                team1: team(1),
                team2: team(2),
                category: subEvent.name,
                round: game.round,
                order: game.order ?? 0,
              };
            }),
        ),
      )
      .sort((a, b) => {
        if (a.scheduledTime && b.scheduledTime) {
          return new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime();
        }
        return a.scheduledTime ? -1 : b.scheduledTime ? 1 : a.order - b.order;
      })
      .map(({ order: _order, ...game }) => game);
  }
}
