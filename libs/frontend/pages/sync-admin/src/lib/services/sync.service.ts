import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Apollo, gql } from 'apollo-angular';
import { CompetitionEvent, TournamentEvent } from '@app/models';
import { RankingSystemSyncInfo, SyncJob, SyncStatus } from '../models/sync.models';

// ===== Queries =====

// Competition event queries at different depths
const GET_COMPETITION_EVENTS_LEVEL_EVENT = gql`
  query CompetitionEventsForSync($args: CompetitionEventArgs) {
    competitionEvents(args: $args) {
      id
      name
      official
      type
      season
      openDate
      closeDate
      lastSync
      visualCode
    }
  }
`;

const GET_COMPETITION_EVENTS_LEVEL_SUBEVENT = gql`
  query CompetitionEventsForSyncSubEvent($args: CompetitionEventArgs) {
    competitionEvents(args: $args) {
      id
      name
      official
      type
      season
      openDate
      closeDate
      lastSync
      visualCode
      competitionSubEvents {
        id
        name
        level
        maxLevel
      }
    }
  }
`;

const GET_COMPETITION_EVENTS_LEVEL_DRAW = gql`
  query CompetitionEventsForSyncDraw($args: CompetitionEventArgs) {
    competitionEvents(args: $args) {
      id
      name
      official
      type
      season
      openDate
      closeDate
      lastSync
      visualCode
      competitionSubEvents {
        id
        name
        level
        maxLevel
        competitionDraws {
          id
          name
          visualCode
        }
      }
    }
  }
`;

const GET_COMPETITION_EVENTS_LEVEL_ENCOUNTER = gql`
  query CompetitionEventsForSyncEncounter($args: CompetitionEventArgs) {
    competitionEvents(args: $args) {
      id
      name
      official
      type
      season
      openDate
      closeDate
      lastSync
      visualCode
      competitionSubEvents {
        id
        name
        level
        maxLevel
        competitionDraws {
          id
          name
          visualCode
          competitionEncounters {
            id
            visualCode
            date
            homeTeam {
              name
            }
            awayTeam {
              name
            }
          }
        }
      }
    }
  }
`;

// Tournament event queries at different depths
const GET_TOURNAMENT_EVENTS_LEVEL_EVENT = gql`
  query TournamentEventsForSync($args: TournamentEventArgs) {
    tournamentEvents(args: $args) {
      id
      name
      official
      firstDay
      openDate
      closeDate
      lastSync
      visualCode
      phase
    }
  }
`;

const GET_TOURNAMENT_EVENTS_LEVEL_SUBEVENT = gql`
  query TournamentEventsForSyncSubEvent($args: TournamentEventArgs) {
    tournamentEvents(args: $args) {
      id
      name
      official
      firstDay
      openDate
      closeDate
      lastSync
      visualCode
      phase
      tournamentSubEvents {
        id
        name
        minLevel
        maxLevel
      }
    }
  }
`;

const GET_TOURNAMENT_EVENTS_LEVEL_DRAW = gql`
  query TournamentEventsForSyncDraw($args: TournamentEventArgs) {
    tournamentEvents(args: $args) {
      id
      name
      official
      firstDay
      openDate
      closeDate
      lastSync
      visualCode
      phase
      tournamentSubEvents {
        id
        name
        minLevel
        maxLevel
        drawTournaments {
          id
          name
          visualCode
        }
      }
    }
  }
`;

// ===== Mutations =====

const TRIGGER_DISCOVERY_SYNC = gql`
  mutation TriggerDiscoverySync {
    triggerDiscoverySync
  }
`;

const TRIGGER_RANKING_SYNC = gql`
  mutation TriggerRankingSync($startDate: String) {
    triggerRankingSync(startDate: $startDate)
  }
`;

const TRIGGER_RANKING_CALC = gql`
  mutation TriggerRankingCalc($systemId: ID!, $startDate: String, $stopDate: String) {
    triggerRankingCalc(systemId: $systemId, startDate: $startDate, stopDate: $stopDate)
  }
`;

const GET_RANKING_SYSTEMS = gql`
  query GetRankingSystemsForSync {
    rankingSystems {
      id
      name
      rankingSystem
      runCurrently
      calculationLastUpdate
      updateLastUpdate
      calculationIntervalAmount
      calculationIntervalUnit
      updateIntervalAmount
      updateIntervalUnit
    }
  }
`;

const CLEAR_ALL_JOBS = gql`
  mutation ClearAllJobs {
    clearAllJobs
  }
`;

const CLEAR_COMPLETED_JOBS = gql`
  mutation ClearCompletedJobs {
    clearCompletedJobs
  }
`;

const TRIGGER_EVENTS_SYNC = gql`
  mutation TriggerEventsSync($eventIds: [ID!]!, $includeSubComponents: Boolean!) {
    triggerEventsSync(eventId: $eventIds, includeSubComponents: $includeSubComponents)
  }
`;

const TRIGGER_SUB_EVENTS_SYNC = gql`
  mutation TriggerSubEventsSync($subEventIds: [ID!]!, $includeSubComponents: Boolean!) {
    triggerSubEventsSync(subEventIds: $subEventIds, includeSubComponents: $includeSubComponents)
  }
`;

const TRIGGER_DRAWS_SYNC = gql`
  mutation TriggerDrawsSync($drawIds: [ID!]!, $includeSubComponents: Boolean!) {
    triggerDrawsSync(drawIds: $drawIds, includeSubComponents: $includeSubComponents)
  }
`;

const TRIGGER_ENCOUNTERS_SYNC = gql`
  mutation TriggerEncountersSync($encounterIds: [ID!]!) {
    triggerEncountersSync(encounterIds: $encounterIds)
  }
`;

// Query map for competition events by sync level
const COMPETITION_QUERIES = {
  event: GET_COMPETITION_EVENTS_LEVEL_EVENT,
  subEvent: GET_COMPETITION_EVENTS_LEVEL_SUBEVENT,
  draw: GET_COMPETITION_EVENTS_LEVEL_DRAW,
  encounter: GET_COMPETITION_EVENTS_LEVEL_ENCOUNTER,
} as const;

// Query map for tournament events by sync level
const TOURNAMENT_QUERIES = {
  event: GET_TOURNAMENT_EVENTS_LEVEL_EVENT,
  subEvent: GET_TOURNAMENT_EVENTS_LEVEL_SUBEVENT,
  draw: GET_TOURNAMENT_EVENTS_LEVEL_DRAW,
} as const;

@Injectable({
  providedIn: 'root',
})
export class SyncApiService {
  private apollo = inject(Apollo);
  private http = inject(HttpClient);

  getStatus(): Observable<SyncStatus> {
    return this.http.get<SyncStatus>('/api/v1/sync/status').pipe(map((result) => result ?? ({} as SyncStatus)));
  }

  getRecentJobs(limit?: number | null, status?: string): Observable<SyncJob[]> {
    let params = new HttpParams();
    if (limit !== undefined && limit !== null) {
      params = params.set('limit', limit);
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<SyncJob[]>('/api/v1/sync/jobs', { params }).pipe(map((result) => result ?? []));
  }

  getCompetitionEvents(args: Record<string, unknown>, syncLevel: 'event' | 'subEvent' | 'draw' | 'encounter'): Observable<CompetitionEvent[]> {
    return this.apollo
      .query<{ competitionEvents: CompetitionEvent[] }>({
        query: COMPETITION_QUERIES[syncLevel],
        variables: { args },
        fetchPolicy: 'network-only',
      })
      .pipe(map((result) => result.data?.competitionEvents ?? []));
  }

  getTournamentEvents(args: Record<string, unknown>, syncLevel: 'event' | 'subEvent' | 'draw'): Observable<TournamentEvent[]> {
    return this.apollo
      .query<{ tournamentEvents: TournamentEvent[] }>({
        query: TOURNAMENT_QUERIES[syncLevel],
        variables: { args },
        fetchPolicy: 'network-only',
      })
      .pipe(map((result) => result.data?.tournamentEvents ?? []));
  }

  triggerDiscoverySync(): Observable<boolean> {
    return this.apollo
      .mutate<{ triggerDiscoverySync: boolean }>({
        mutation: TRIGGER_DISCOVERY_SYNC,
      })
      .pipe(map((result) => result.data?.triggerDiscoverySync ?? false));
  }

  triggerRankingSync(startDate?: string): Observable<boolean> {
    return this.apollo
      .mutate<{ triggerRankingSync: boolean }>({
        mutation: TRIGGER_RANKING_SYNC,
        variables: { startDate },
      })
      .pipe(map((result) => result.data?.triggerRankingSync ?? false));
  }

  triggerRankingCalc(systemId: string, startDate?: string, stopDate?: string): Observable<boolean> {
    return this.apollo
      .mutate<{ triggerRankingCalc: boolean }>({
        mutation: TRIGGER_RANKING_CALC,
        variables: { systemId, startDate, stopDate },
      })
      .pipe(map((result) => result.data?.triggerRankingCalc ?? false));
  }

  getRankingSystems(): Observable<RankingSystemSyncInfo[]> {
    return this.apollo
      .query<{ rankingSystems: RankingSystemSyncInfo[] }>({
        query: GET_RANKING_SYSTEMS,
        fetchPolicy: 'network-only',
      })
      .pipe(map((result) => result.data?.rankingSystems ?? []));
  }

  clearAllJobs(): Observable<boolean> {
    return this.apollo
      .mutate<{ clearAllJobs: boolean }>({
        mutation: CLEAR_ALL_JOBS,
      })
      .pipe(map((result) => result.data?.clearAllJobs ?? false));
  }

  clearCompletedJobs(): Observable<number> {
    return this.apollo
      .mutate<{ clearCompletedJobs: number }>({
        mutation: CLEAR_COMPLETED_JOBS,
      })
      .pipe(map((result) => result.data?.clearCompletedJobs ?? 0));
  }

  triggerEventsSync(eventIds: string[], includeSubComponents: boolean): Observable<boolean> {
    return this.apollo
      .mutate<{ triggerEventsSync: boolean }>({
        mutation: TRIGGER_EVENTS_SYNC,
        variables: { eventIds, includeSubComponents },
      })
      .pipe(map((result) => result.data?.triggerEventsSync ?? false));
  }

  triggerSubEventsSync(subEventIds: string[], includeSubComponents: boolean): Observable<boolean> {
    return this.apollo
      .mutate<{ triggerSubEventsSync: boolean }>({
        mutation: TRIGGER_SUB_EVENTS_SYNC,
        variables: { subEventIds, includeSubComponents },
      })
      .pipe(map((result) => result.data?.triggerSubEventsSync ?? false));
  }

  triggerDrawsSync(drawIds: string[], includeSubComponents: boolean): Observable<boolean> {
    return this.apollo
      .mutate<{ triggerDrawsSync: boolean }>({
        mutation: TRIGGER_DRAWS_SYNC,
        variables: { drawIds, includeSubComponents },
      })
      .pipe(map((result) => result.data?.triggerDrawsSync ?? false));
  }

  triggerEncountersSync(encounterIds: string[]): Observable<boolean> {
    return this.apollo
      .mutate<{ triggerEncountersSync: boolean }>({
        mutation: TRIGGER_ENCOUNTERS_SYNC,
        variables: { encounterIds },
      })
      .pipe(map((result) => result.data?.triggerEncountersSync ?? false));
  }
}
