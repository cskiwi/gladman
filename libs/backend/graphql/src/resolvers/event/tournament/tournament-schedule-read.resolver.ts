import { Court, Game, TournamentEvent, TournamentScheduleSlot } from '@app/models';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TournamentScheduleSlotArgs } from '../../../args';

/** Provides Scheduling reads without activating its dormant operational mutations. */
@Resolver(() => TournamentScheduleSlot)
export class TournamentScheduleReadResolver {
  /** Generic slot list: filter by tournament, court, status or start time and order via `args`. */
  @Query(() => [TournamentScheduleSlot])
  async tournamentScheduleSlots(
    @Args('args', { type: () => TournamentScheduleSlotArgs, nullable: true })
    inputArgs?: InstanceType<typeof TournamentScheduleSlotArgs>,
  ): Promise<TournamentScheduleSlot[]> {
    const args = TournamentScheduleSlotArgs.toFindManyOptions(inputArgs);
    return TournamentScheduleSlot.find(args);
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
