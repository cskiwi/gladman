import { Court, Game, LocationEventMembership, TournamentDraw, TournamentEvent, TournamentScheduleSlot } from '@app/models';
import { NotFoundException } from '@nestjs/common';
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FindOptionsWhere, In, IsNull } from 'typeorm';

/** Provides Scheduling reads without activating its dormant operational mutations. */
@Resolver(() => TournamentScheduleSlot)
export class TournamentScheduleReadResolver {
  /** Reads slots for one tournament with the existing local-day filter and ordering. */
  @Query(() => [TournamentScheduleSlot])
  async tournamentSchedule(
    @Args('tournamentEventId', { type: () => ID }) tournamentEventId: string,
    @Args('date', { type: () => Date, nullable: true }) date?: Date,
    @Args('courtId', { type: () => ID, nullable: true }) courtId?: string,
  ): Promise<TournamentScheduleSlot[]> {
    const where: FindOptionsWhere<TournamentScheduleSlot> = { tournamentEventId };
    if (courtId) where.courtId = courtId;
    const slots = await TournamentScheduleSlot.find({ where, order: { startTime: 'ASC', order: 'ASC' } });
    if (!date) return slots;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return slots.filter((slot) => slot.startTime >= startOfDay && slot.startTime <= endOfDay);
  }

  /** Reads only unscheduled tournament games belonging to this event's draws. */
  @Query(() => [Game])
  async unscheduledGames(@Args('tournamentEventId', { type: () => ID }) tournamentEventId: string): Promise<Game[]> {
    const tournament = await TournamentEvent.findOne({ where: { id: tournamentEventId } });
    if (!tournament) throw new NotFoundException(`Tournament with ID ${tournamentEventId} not found`);
    const draws = await TournamentDraw.createQueryBuilder('draw')
      .innerJoin('draw.tournamentSubEvent', 'subEvent')
      .where('subEvent.eventId = :eventId', { eventId: tournamentEventId })
      .getMany();
    if (draws.length === 0) return [];
    return Game.find({
      where: { linkId: In(draws.map((draw) => draw.id)), linkType: 'tournament', scheduleSlotId: IsNull() },
      order: { round: 'ASC', order: 'ASC' },
    });
  }

  /** Reads courts across all active venues assigned to this tournament. */
  @Query(() => [Court])
  async tournamentScheduleCourts(@Args('tournamentEventId', { type: () => ID }) tournamentEventId: string): Promise<Court[]> {
    const memberships = await LocationEventMembership.find({ where: { eventId: tournamentEventId, isActive: true } });
    const locationIds = [...new Set(memberships.map((membership) => membership.locationId))];
    if (locationIds.length === 0) return [];
    return Court.find({ where: { locationId: In(locationIds) }, order: { name: 'ASC', id: 'ASC' } });
  }

  /** Resolves the slot's tournament without relying on eager relations. */
  @ResolveField(() => TournamentEvent, { nullable: true })
  async tournamentEvent(@Parent() { tournamentEventId }: TournamentScheduleSlot): Promise<TournamentEvent | null> {
    return tournamentEventId ? TournamentEvent.findOne({ where: { id: tournamentEventId } }) : null;
  }

  /** Resolves the slot's court without relying on eager relations. */
  @ResolveField(() => Court, { nullable: true })
  async court(@Parent() { courtId }: TournamentScheduleSlot): Promise<Court | null> {
    return courtId ? Court.findOne({ where: { id: courtId } }) : null;
  }

  /** Resolves a scheduled game; unassigned slots legitimately have none. */
  @ResolveField(() => Game, { nullable: true })
  async game(@Parent() { gameId }: TournamentScheduleSlot): Promise<Game | null> {
    return gameId ? Game.findOne({ where: { id: gameId } }) : null;
  }
}
