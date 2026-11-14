import { PermGuard, User } from '@app/backend-authorization';
import { TournamentCheckIn, TournamentEvent, TournamentEnrollment, Player, TournamentSubEvent } from '@app/models';
import { CheckInStatus, EnrollmentStatus } from '@app/models-enum';
import { BadRequestException, ForbiddenException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver, registerEnumType } from '@nestjs/graphql';
import { TournamentCheckInArgs } from '../../../args';
import { CheckInPlayerInput, MarkNoShowInput, BulkCheckInInput } from '../../../inputs';
import { In } from 'typeorm';

// Register the CheckInStatus enum for GraphQL
registerEnumType(CheckInStatus, {
  name: 'CheckInStatus',
  description: 'Status of a tournament check-in',
});

@Resolver(() => TournamentCheckIn)
export class TournamentCheckInResolver {
  // ============ QUERIES ============

  @Query(() => TournamentCheckIn)
  async tournamentCheckIn(@Args('id', { type: () => ID }) id: string): Promise<TournamentCheckIn> {
    const checkIn = await TournamentCheckIn.findOne({
      where: { id },
    });

    if (!checkIn) {
      throw new NotFoundException(`Check-in with ID ${id} not found`);
    }

    return checkIn;
  }

  @Query(() => [TournamentCheckIn])
  async tournamentCheckIns(
    @Args('args', { type: () => TournamentCheckInArgs, nullable: true })
    inputArgs?: InstanceType<typeof TournamentCheckInArgs>,
  ): Promise<TournamentCheckIn[]> {
    const args = TournamentCheckInArgs.toFindManyOptions(inputArgs);
    return TournamentCheckIn.find(args);
  }

  // ============ MUTATIONS ============

  @Mutation(() => [TournamentCheckIn], { description: 'Initialize check-in records for a tournament' })
  @UseGuards(PermGuard)
  async initializeCheckIns(
    @User() user: Player,
    @Args('tournamentEventId', { type: () => ID }) tournamentEventId: string,
  ): Promise<TournamentCheckIn[]> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to initialize check-ins');
    }

    // Validate tournament exists
    const tournament = await TournamentEvent.findOne({
      where: { id: tournamentEventId },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${tournamentEventId} not found`);
    }

    // Get all sub-events for this tournament
    const subEvents = await TournamentSubEvent.find({
      where: { eventId: tournamentEventId },
    });

    if (subEvents.length === 0) {
      return [];
    }

    const subEventIds = subEvents.map((se) => se.id);

    // Find all confirmed enrollments
    const enrollments = await TournamentEnrollment.find({
      where: {
        tournamentSubEventId: In(subEventIds),
        status: EnrollmentStatus.CONFIRMED,
      },
    });

    const createdCheckIns: TournamentCheckIn[] = [];

    for (const enrollment of enrollments) {
      // Check if check-in already exists
      const existing = await TournamentCheckIn.findOne({
        where: {
          tournamentEventId,
          enrollmentId: enrollment.id,
        },
      });

      if (!existing) {
        const checkIn = new TournamentCheckIn();
        checkIn.tournamentEventId = tournamentEventId;
        checkIn.enrollmentId = enrollment.id;
        checkIn.status = CheckInStatus.PENDING;

        await checkIn.save();
        createdCheckIns.push(checkIn);
      }
    }

    return createdCheckIns;
  }

  @Mutation(() => TournamentCheckIn, { description: 'Check in a player' })
  @UseGuards(PermGuard)
  async checkInPlayer(@User() user: Player, @Args('input') input: CheckInPlayerInput): Promise<TournamentCheckIn> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to check in players');
    }

    // Find or create check-in record
    let checkIn = await TournamentCheckIn.findOne({
      where: {
        tournamentEventId: input.tournamentEventId,
        enrollmentId: input.enrollmentId,
      },
    });

    if (!checkIn) {
      // Validate enrollment exists and is confirmed
      const enrollment = await TournamentEnrollment.findOne({
        where: { id: input.enrollmentId },
      });

      if (!enrollment) {
        throw new NotFoundException(`Enrollment with ID ${input.enrollmentId} not found`);
      }

      if (enrollment.status !== EnrollmentStatus.CONFIRMED) {
        throw new BadRequestException('Only confirmed enrollments can be checked in');
      }

      checkIn = new TournamentCheckIn();
      checkIn.tournamentEventId = input.tournamentEventId;
      checkIn.enrollmentId = input.enrollmentId;
    }

    if (checkIn.status === CheckInStatus.CHECKED_IN) {
      throw new BadRequestException('Player is already checked in');
    }

    checkIn.status = CheckInStatus.CHECKED_IN;
    checkIn.checkedInAt = new Date();
    checkIn.checkedInById = user.id;
    checkIn.notes = input.notes;

    await checkIn.save();

    return checkIn;
  }

  @Mutation(() => TournamentCheckIn, { description: 'Mark a player as no-show' })
  @UseGuards(PermGuard)
  async markNoShow(@User() user: Player, @Args('input') input: MarkNoShowInput): Promise<TournamentCheckIn> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to mark no-shows');
    }

    // Find or create check-in record
    let checkIn = await TournamentCheckIn.findOne({
      where: {
        tournamentEventId: input.tournamentEventId,
        enrollmentId: input.enrollmentId,
      },
    });

    if (!checkIn) {
      checkIn = new TournamentCheckIn();
      checkIn.tournamentEventId = input.tournamentEventId;
      checkIn.enrollmentId = input.enrollmentId;
    }

    checkIn.status = CheckInStatus.NO_SHOW;
    checkIn.notes = input.reason;
    checkIn.checkedInById = user.id;

    await checkIn.save();

    return checkIn;
  }

  @Mutation(() => TournamentCheckIn, { description: 'Undo a check-in (set back to pending)' })
  @UseGuards(PermGuard)
  async undoCheckIn(@User() user: Player, @Args('checkInId', { type: () => ID }) checkInId: string): Promise<TournamentCheckIn> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to undo check-ins');
    }

    const checkIn = await TournamentCheckIn.findOne({
      where: { id: checkInId },
    });

    if (!checkIn) {
      throw new NotFoundException(`Check-in with ID ${checkInId} not found`);
    }

    checkIn.status = CheckInStatus.PENDING;
    checkIn.checkedInAt = undefined;
    checkIn.checkedInById = undefined;
    checkIn.notes = undefined;

    await checkIn.save();

    return checkIn;
  }

  @Mutation(() => [TournamentCheckIn], { description: 'Check in multiple players at once; returns the check-ins that succeeded' })
  @UseGuards(PermGuard)
  async bulkCheckIn(@User() user: Player, @Args('input') input: BulkCheckInInput): Promise<TournamentCheckIn[]> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to check in players');
    }

    const checkIns: TournamentCheckIn[] = [];

    for (const enrollmentId of input.enrollmentIds) {
      try {
        // Find or create check-in record
        let checkIn = await TournamentCheckIn.findOne({
          where: {
            tournamentEventId: input.tournamentEventId,
            enrollmentId,
          },
        });

        if (!checkIn) {
          checkIn = new TournamentCheckIn();
          checkIn.tournamentEventId = input.tournamentEventId;
          checkIn.enrollmentId = enrollmentId;
        }

        if (checkIn.status !== CheckInStatus.CHECKED_IN) {
          checkIn.status = CheckInStatus.CHECKED_IN;
          checkIn.checkedInAt = new Date();
          checkIn.checkedInById = user.id;

          await checkIn.save();
        }

        checkIns.push(checkIn);
      } catch {
        // Failed enrollments are simply absent from the result; callers compare against the requested ids.
      }
    }

    return checkIns;
  }

  // ============ RESOLVE FIELDS ============

  @ResolveField(() => TournamentEvent, { nullable: true })
  async tournamentEvent(@Parent() { tournamentEventId }: TournamentCheckIn): Promise<TournamentEvent | null> {
    if (!tournamentEventId) return null;
    return TournamentEvent.findOne({ where: { id: tournamentEventId } });
  }

  @ResolveField(() => TournamentEnrollment, { nullable: true })
  async enrollment(@Parent() { enrollmentId }: TournamentCheckIn): Promise<TournamentEnrollment | null> {
    if (!enrollmentId) return null;
    return TournamentEnrollment.findOne({ where: { id: enrollmentId } });
  }

  @ResolveField(() => Player, { nullable: true })
  async checkedInBy(@Parent() { checkedInById }: TournamentCheckIn): Promise<Player | null> {
    if (!checkedInById) return null;
    return Player.findOne({ where: { id: checkedInById } });
  }
}
