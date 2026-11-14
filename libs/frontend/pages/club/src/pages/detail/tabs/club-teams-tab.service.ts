import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, resource, signal } from '@angular/core';
import { Player, Team } from '@app/models';
import { Apollo, gql } from 'apollo-angular';
import { lastValueFrom } from 'rxjs';
import { sortTeams } from '@app/utils/sorts';
import { RecentFormMembership, recentFormArgs, toRecentForm } from './player-recent-form.util';

export type TeamGenderFilter = 'all' | 'M' | 'F' | 'MX';

/** Replaces each player's native recent game memberships by the derived `recentForm` W/L booleans. */
function withRecentForm(team: Team): Team {
  return {
    ...team,
    teamPlayerMemberships: (team.teamPlayerMemberships ?? []).map((membership) => {
      const { recentGames, ...player } = (membership.player ?? {}) as Player & { recentGames?: RecentFormMembership[] };
      return {
        ...membership,
        player: membership.player ? { ...player, recentForm: toRecentForm(recentGames, 5) } : membership.player,
      };
    }),
  } as unknown as Team;
}

export class ClubTeamsTabService {
  private readonly apollo = inject(Apollo);

  private clubId = signal<string | null>(null);
  private season = signal<number | null>(null);

  /** UI filter — gender bucket (maps to Team.type). */
  readonly genderFilter = signal<TeamGenderFilter>('all');

  private teamsResource = resource({
    params: () => ({
      clubId: this.clubId(),
      season: this.season(),
    }),
    loader: async ({ params, abortSignal }) => {
      if (!params.clubId || !params.season) {
        return [];
      }

      try {
        const teamsResult = await lastValueFrom(
          this.apollo.query<{ club: { teams: Team[] } }>({
            query: gql`
              query ClubDetailTeamsTab($clubId: ID!, $season: Float!, $recentFormArgs: GamePlayerMembershipArgs) {
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
                        recentGames: gamePlayerMemberships(args: $recentFormArgs) {
                          id
                          team
                          game {
                            id
                            winner
                          }
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
              recentFormArgs: recentFormArgs(5),
            },
            context: { signal: abortSignal },
          }),
        );

        const teams = (teamsResult.data?.club?.teams || []).map((team) => withRecentForm(team));
        return [...teams].sort(sortTeams);
      } catch (err) {
        console.error(err);
        throw new Error(this.handleError(err as HttpErrorResponse));
      }
    },
  });

  // Public selectors
  teams = computed(() => (this.teamsResource.hasValue() ? this.teamsResource.value() : []));
  loading = computed(() => this.teamsResource.isLoading());
  error = computed(() => this.teamsResource.error()?.message || null);

  /** Teams filtered by the gender toggle. */
  readonly filteredTeams = computed(() => {
    const f = this.genderFilter();
    const all = this.teams();
    if (f === 'all') return all;
    return all.filter((t) => t.type === f);
  });

  /** Counts per bucket for the segmented control labels. */
  readonly bucketCounts = computed(() => {
    const all = this.teams();
    return {
      all: all.length,
      M: all.filter((t) => t.type === 'M').length,
      F: all.filter((t) => t.type === 'F').length,
      MX: all.filter((t) => t.type === 'MX').length,
    };
  });

  setClubId(clubId: string | null) {
    this.clubId.set(clubId);
  }

  setSeason(season: number | null) {
    this.season.set(season);
  }

  private handleError(err: HttpErrorResponse): string {
    if (err.status === 404 && err.url) {
      return 'Failed to load teams';
    }
    return err.statusText || 'An error occurred';
  }
}
