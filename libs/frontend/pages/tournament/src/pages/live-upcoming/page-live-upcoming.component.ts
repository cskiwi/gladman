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
  memberships: { locationId: string }[];
}

interface CourtsQuery {
  courts: { id: string; name?: string }[];
}

const UPCOMING_QUERY = gql`
  query TournamentLiveUpcoming($id: ID!, $memberships: LocationEventMembershipArgs) {
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
    memberships: locationEventMemberships(args: $memberships) {
      id
      locationId
    }
  }
`;

const COURTS_QUERY = gql`
  query TournamentLiveCourts($args: CourtArgs) {
    courts(args: $args) {
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
          variables: { id, memberships: { where: [{ eventId: { eq: id }, isActive: { eq: true } }] } },
          fetchPolicy: 'network-only',
          context: { signal: abortSignal },
        }),
      );
      if (!data) {
        return { games: [] };
      }
      // Courts of every active venue assigned to this tournament.
      const locationIds = [...new Set(data.memberships.map((membership) => membership.locationId))];
      const courts = locationIds.length > 0 ? await this.loadCourts(locationIds, abortSignal) : [];
      return { name: data.tournamentEvent.name, games: this.toUpcomingGames(data, courts) };
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

  private async loadCourts(locationIds: string[], abortSignal: AbortSignal): Promise<CourtsQuery['courts']> {
    const { data } = await lastValueFrom(
      this.apollo.query<CourtsQuery>({
        query: COURTS_QUERY,
        variables: { args: { where: [{ locationId: { in: locationIds } }], order: { name: 'ASC' } } },
        fetchPolicy: 'network-only',
        context: { signal: abortSignal },
      }),
    );
    return data?.courts ?? [];
  }

  /** Unfinished games, soonest first; unscheduled games go last in draw order. */
  private toUpcomingGames(data: UpcomingQuery, courtList: CourtsQuery['courts']): UpcomingGame[] {
    const courts = new Map(courtList.map((court) => [court.id, court.name]));
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
