import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { Club, CompetitionEncounter, Game, Team } from '@app/models';
import { Apollo, gql } from 'apollo-angular';
import { lastValueFrom } from 'rxjs';
import { getSeason } from '@app/utils/comp';
import { sortTeams } from '@app/utils/sorts';
import { ClubSeasonRecord, computeSeasonRecord, getMembershipReferenceDate } from './club-stats.util';

export type { ClubSeasonRecord };

export interface ClubNextHomeMatch {
  id: string;
  date: string | null;
  homeTeam: { id: string; name: string | null } | null;
  awayTeam: { id: string; name: string | null } | null;
}

export interface ClubStatsPayload {
  id: string;
  memberCount: number;
  seasonRecord: ClubSeasonRecord;
  nextHomeMatch: ClubNextHomeMatch | null;
}

export class DetailService {
  private readonly apollo = inject(Apollo);

  filter = new FormGroup({
    clubId: new FormControl<string | null>(null),
    season: new FormControl<number>(getSeason()),
  });

  // Convert form to signal for resource
  private filterSignal = toSignal(this.filter.valueChanges, {
    initialValue: {
      clubId: null,
      season: getSeason(),
    },
  });

  private clubResource = resource({
    params: this.filterSignal,
    loader: async ({ params, abortSignal }) => {
      if (!params.clubId) {
        return null;
      }

      try {
        const result = await lastValueFrom(
          this.apollo.query<{ club: Club }>({
            query: gql`
              query Club($id: ID!) {
                club(id: $id) {
                  id
                  fullName
                  name
                  slug
                  clubId
                  state
                  country
                }
              }
            `,
            variables: {
              id: params.clubId,
            },
            context: { signal: abortSignal },
          }),
        );

        if (!result?.data?.club) {
          throw new Error('No club found');
        }
        return result.data.club;
      } catch (err) {
        throw new Error(this.handleError(err as HttpErrorResponse));
      }
    },
  });

  private clubStatsResource = resource({
    params: this.filterSignal,
    loader: async ({ params, abortSignal }) => {
      if (!params.clubId || params.season == null) {
        return null;
      }
      try {
        const context = { signal: abortSignal };
        const teamsResult = await lastValueFrom(
          this.apollo.query<{ club: { id: string; teams: { id: string }[] } | null }>({
            query: gql`
              query ClubStatsTeams($id: ID!, $season: Float!) {
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
        const club = teamsResult.data?.club;
        if (!club) return null;
        const teamIds = (club.teams ?? []).map((t) => t.id);
        const ref = getMembershipReferenceDate(params.season);

        const membersPromise = lastValueFrom(
          this.apollo.query<{ clubPlayerMembershipsCount: number }>({
            query: gql`
              query ClubStatsMembers($clubId: String!, $ref: DateTime!) {
                clubPlayerMembershipsCount(
                  args: {
                    where: [
                      { clubId: { eq: $clubId }, start: { lte: $ref }, end: { isNull: true } }
                      { clubId: { eq: $clubId }, start: { lte: $ref }, end: { gt: $ref } }
                    ]
                  }
                )
              }
            `,
            variables: { clubId: club.id, ref },
            context,
          }),
        );

        const encountersPromise =
          teamIds.length === 0
            ? Promise.resolve(null)
            : lastValueFrom(
                this.apollo.query<{
                  played: { homeTeamId: string | null; homeScore: number | null; awayScore: number | null }[];
                  next: ClubNextHomeMatch[];
                }>({
                  query: gql`
                    query ClubStatsEncounters($teamIds: [String!]!, $now: DateTime!) {
                      played: competitionEncounters(
                        args: {
                          where: [
                            { homeTeamId: { in: $teamIds }, homeScore: { isNull: false }, awayScore: { isNull: false } }
                            { awayTeamId: { in: $teamIds }, homeScore: { isNull: false }, awayScore: { isNull: false } }
                          ]
                        }
                      ) {
                        id
                        homeTeamId
                        homeScore
                        awayScore
                      }
                      next: competitionEncounters(
                        args: { where: [{ homeTeamId: { in: $teamIds }, date: { gt: $now } }], order: { date: ASC }, take: 1 }
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
                  variables: { teamIds, now: new Date().toISOString() },
                  context,
                }),
              );

        const [members, encounters] = await Promise.all([membersPromise, encountersPromise]);

        return {
          id: club.id,
          memberCount: members.data?.clubPlayerMembershipsCount ?? 0,
          seasonRecord: computeSeasonRecord(encounters?.data?.played ?? [], teamIds),
          nextHomeMatch: encounters?.data?.next?.[0] ?? null,
        } satisfies ClubStatsPayload;
      } catch (err) {
        // Stats are non-critical — log but don't surface as page error.
        console.warn('Club stats query failed', err);
        return null;
      }
    },
  });

  // Distinct seasons in which the club has teams (newest first), derived from the native `teams` relation.
  private seasonsResource = resource({
    params: this.filterSignal,
    loader: async ({ params, abortSignal }) => {
      if (!params.clubId) {
        return [] as number[];
      }
      try {
        const result = await lastValueFrom(
          this.apollo.query<{ club: { teams: { season: number | null }[] } | null }>({
            query: gql`
              query ClubSeasons($id: ID!) {
                club(id: $id) {
                  id
                  teams(args: { order: { season: DESC } }) {
                    id
                    season
                  }
                }
              }
            `,
            variables: { id: params.clubId },
            context: { signal: abortSignal },
          }),
        );
        const seasons = (result.data?.club?.teams ?? []).map((t) => t.season).filter((v): v is number => v != null);
        return [...new Set(seasons)].sort((x, y) => y - x);
      } catch (err) {
        console.warn('Club seasons query failed', err);
        return [] as number[];
      }
    },
  });

  private teamsResource = resource({
    params: this.filterSignal,
    loader: async ({ params, abortSignal }) => {
      if (!params.clubId || !params.season) {
        return { teams: [], encounters: [] };
      }
      try {
        // First query: get teams for the club
        const teamsResult = await lastValueFrom(
          this.apollo.query<{ club: { teams: Team[] } }>({
            query: gql`
              query ClubDetailTeams($clubId: ID!, $season: Float!) {
                club(id: $clubId) {
                  id
                  teams(args: { where: [{ season: { eq: $season } }], take: 50, order: { name: ASC } }) {
                    id
                    name
                    season
                    type
                    abbreviation
                    email
                    phone
                    teamNumber
                    preferredTime
                    preferredDay
                    captain {
                      id
                      fullName
                    }
                    teamPlayerMemberships {
                      id
                      membershipType
                      playerId
                      player {
                        id
                        slug
                        fullName
                        firstName
                        lastName
                        rankingLastPlaces {
                          id
                          single
                          double
                          mix
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              clubId: params.clubId,
              season: params.season,
            },
            context: { signal: abortSignal },
          }),
        );

        const teams = teamsResult.data?.club?.teams || [];
        const teamIds = teams.map((t) => t.id);

        // If no teams, return early
        if (teamIds.length === 0) {
          return { teams: [], encounters: [] };
        }

        return {
          teams: [...teams].sort(sortTeams),
          encounters: [],
        };
      } catch (err) {
        console.error(err);
        throw new Error(this.handleError(err as HttpErrorResponse));
      }
    },
  });

  // Public selectors
  club = computed(() => (this.clubResource.hasValue() ? this.clubResource.value() : null));
  teams = computed(() => this.teamsResource.value()?.teams || []);
  stats = computed(() => this.clubStatsResource.value());
  teamCount = computed(() => this.teams().length);

  error = computed(() => this.clubResource.error()?.message || null);
  loading = computed(() => this.clubResource.isLoading());
  teamsLoading = computed(() => this.teamsResource.isLoading());
  statsLoading = computed(() => this.teamsResource.isLoading());

  // Season management
  currentSeason = computed(() => this.filterSignal().season || getSeason());
  availableSeasons = computed(() => {
    const dbSeasons = [...(this.seasonsResource.value() || [])];
    const currentSeason = getSeason();

    // If we have seasons from database, use them, otherwise fallback to default range
    if (dbSeasons.length > 0) {
      return [...dbSeasons]
        .sort((a, b) => b - a) // Sort descending (newest first)
        .map((season) => ({ label: `${season}`, value: season }));
    }

    // Fallback to hardcoded range if no seasons in database
    return [
      { label: `${currentSeason - 2}`, value: currentSeason - 2 },
      { label: `${currentSeason - 1}`, value: currentSeason - 1 },
      { label: `${currentSeason}`, value: currentSeason },
      { label: `${currentSeason + 1}`, value: currentSeason + 1 },
    ];
  });

  private handleError(err: HttpErrorResponse): string {
    // Handle specific error cases
    if (err.status === 404 && err.url) {
      return 'Failed to load club';
    }

    // Generic error if no cases match
    return err.statusText || 'An error occurred';
  }
}
