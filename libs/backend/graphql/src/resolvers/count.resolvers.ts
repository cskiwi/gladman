import {
  Club,
  ClubPlayerMembership,
  CompetitionEncounter,
  CompetitionEvent,
  Entry,
  Game,
  GamePlayerMembership,
  Player,
  Team,
  TeamPlayerMembership,
  TournamentCheckIn,
  TournamentDraw,
  TournamentEnrollment,
  TournamentEvent,
  TournamentScheduleSlot,
  TournamentSubEvent,
} from '@app/models';
import {
  ClubArgs,
  ClubPlayerMembershipArgs,
  CompetitionEncounterArgs,
  CompetitionEventArgs,
  EntryArgs,
  GameArgs,
  GamePlayerMembershipArgs,
  PlayerArgs,
  TeamArgs,
  TeamPlayerMembershipArgs,
  TournamentCheckInArgs,
  TournamentDrawArgs,
  TournamentEnrollmentArgs,
  TournamentEventArgs,
  TournamentScheduleSlotArgs,
  TournamentSubEventArgs,
} from '../args';
import { createCountResolver } from '../utils/count-resolver';

/**
 * Generic `<entity>Count(args)` root queries for public sport data.
 * Only entities whose list data is already publicly readable are registered here.
 */
export const COUNT_RESOLVERS = [
  createCountResolver({ entity: Club, args: ClubArgs, name: 'clubsCount' }),
  createCountResolver({ entity: ClubPlayerMembership, args: ClubPlayerMembershipArgs, name: 'clubPlayerMembershipsCount' }),
  createCountResolver({ entity: CompetitionEncounter, args: CompetitionEncounterArgs, name: 'competitionEncountersCount' }),
  createCountResolver({ entity: CompetitionEvent, args: CompetitionEventArgs, name: 'competitionEventsCount' }),
  createCountResolver({ entity: Entry, args: EntryArgs, name: 'entriesCount' }),
  createCountResolver({ entity: Game, args: GameArgs, name: 'gamesCount' }),
  createCountResolver({ entity: GamePlayerMembership, args: GamePlayerMembershipArgs, name: 'gamePlayerMembershipsCount' }),
  createCountResolver({ entity: Player, args: PlayerArgs, name: 'playersCount' }),
  createCountResolver({ entity: Team, args: TeamArgs, name: 'teamsCount' }),
  createCountResolver({ entity: TeamPlayerMembership, args: TeamPlayerMembershipArgs, name: 'teamPlayerMembershipsCount' }),
  createCountResolver({ entity: TournamentCheckIn, args: TournamentCheckInArgs, name: 'tournamentCheckInsCount' }),
  createCountResolver({ entity: TournamentDraw, args: TournamentDrawArgs, name: 'tournamentDrawsCount' }),
  createCountResolver({ entity: TournamentEnrollment, args: TournamentEnrollmentArgs, name: 'tournamentEnrollmentsCount' }),
  createCountResolver({ entity: TournamentEvent, args: TournamentEventArgs, name: 'tournamentEventsCount' }),
  createCountResolver({ entity: TournamentScheduleSlot, args: TournamentScheduleSlotArgs, name: 'tournamentScheduleSlotsCount' }),
  createCountResolver({ entity: TournamentSubEvent, args: TournamentSubEventArgs, name: 'tournamentSubEventsCount' }),
];
