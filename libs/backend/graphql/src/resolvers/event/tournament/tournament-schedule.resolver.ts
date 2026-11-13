import { PermGuard, User } from '@app/backend-authorization';
import { TournamentScheduleSlot, TournamentEvent, Court, Game, Player, TournamentDraw, GamePlayerMembership } from '@app/models';
import { ScheduleSlotStatus, ScheduleStrategy, TournamentPhase } from '@app/models-enum';
import { BadRequestException, ForbiddenException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver, registerEnumType } from '@nestjs/graphql';
import { TournamentScheduleReadResolver } from './tournament-schedule-read.resolver';
import {
  GenerateTimeSlotsInput,
  ScheduleGamesInput,
  AssignGameToSlotInput,
  UpdateScheduleSlotInput,
  BlockSlotInput,
  CreateScheduleSlotInput,
} from '../../../inputs';
import { In, IsNull } from 'typeorm';

// Register enums
registerEnumType(ScheduleSlotStatus, {
  name: 'ScheduleSlotStatus',
  description: 'Status of a schedule slot',
});

@Resolver(() => TournamentScheduleSlot)
export class TournamentScheduleResolver extends TournamentScheduleReadResolver {
  // ============ QUERIES ============

  @Query(() => TournamentScheduleSlot)
  async tournamentScheduleSlot(@Args('id', { type: () => ID }) id: string): Promise<TournamentScheduleSlot> {
    const slot = await TournamentScheduleSlot.findOne({
      where: { id },
    });

    if (!slot) {
      throw new NotFoundException(`Schedule slot with ID ${id} not found`);
    }

    return slot;
  }

  // ============ MUTATIONS ============

  @Mutation(() => [TournamentScheduleSlot], { description: 'Generate time slots for scheduling' })
  @UseGuards(PermGuard)
  async generateTimeSlots(@User() user: Player, @Args('input') input: GenerateTimeSlotsInput): Promise<TournamentScheduleSlot[]> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to generate time slots');
    }

    // Validate tournament exists
    const tournament = await TournamentEvent.findOne({
      where: { id: input.tournamentEventId },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${input.tournamentEventId} not found`);
    }

    // Validate courts exist
    for (const courtId of input.courtIds) {
      const court = await Court.findOne({ where: { id: courtId } });
      if (!court) {
        throw new NotFoundException(`Court with ID ${courtId} not found`);
      }
    }

    // Parse time strings
    const [startHour, startMinute] = input.startTime.split(':').map(Number);
    const [endHour, endMinute] = input.endTime.split(':').map(Number);

    const createdSlots: TournamentScheduleSlot[] = [];
    let orderCounter = 0;

    // Generate slots for each date and court
    for (const date of input.dates) {
      for (const courtId of input.courtIds) {
        // Create slots for this day and court
        const currentDate = new Date(date);
        currentDate.setHours(startHour, startMinute, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(endHour, endMinute, 0, 0);

        while (currentDate < endOfDay) {
          const slotEnd = new Date(currentDate.getTime() + input.slotDurationMinutes * 60 * 1000);

          // Don't create slot if it extends past end time
          if (slotEnd > endOfDay) break;

          // Check if slot already exists
          const existingSlot = await TournamentScheduleSlot.findOne({
            where: {
              tournamentEventId: input.tournamentEventId,
              courtId,
              startTime: currentDate,
            },
          });

          if (!existingSlot) {
            const slot = new TournamentScheduleSlot();
            slot.tournamentEventId = input.tournamentEventId;
            slot.courtId = courtId;
            slot.startTime = new Date(currentDate);
            slot.endTime = slotEnd;
            slot.status = ScheduleSlotStatus.AVAILABLE;
            slot.order = orderCounter++;

            await slot.save();
            createdSlots.push(slot);
          }

          // Move to next slot (duration + break)
          currentDate.setTime(currentDate.getTime() + (input.slotDurationMinutes + input.breakMinutes) * 60 * 1000);
        }
      }
    }

    return createdSlots;
  }

  @Mutation(() => TournamentScheduleSlot, { description: 'Create a single schedule slot' })
  @UseGuards(PermGuard)
  async createScheduleSlot(@User() user: Player, @Args('input') input: CreateScheduleSlotInput): Promise<TournamentScheduleSlot> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to create schedule slots');
    }

    // Validate tournament and court exist
    const tournament = await TournamentEvent.findOne({
      where: { id: input.tournamentEventId },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${input.tournamentEventId} not found`);
    }

    const court = await Court.findOne({ where: { id: input.courtId } });
    if (!court) {
      throw new NotFoundException(`Court with ID ${input.courtId} not found`);
    }

    // Get max order for this tournament
    const maxOrderSlot = await TournamentScheduleSlot.findOne({
      where: { tournamentEventId: input.tournamentEventId },
      order: { order: 'DESC' },
    });

    const slot = new TournamentScheduleSlot();
    slot.tournamentEventId = input.tournamentEventId;
    slot.courtId = input.courtId;
    slot.startTime = input.startTime;
    slot.endTime = input.endTime;
    slot.status = ScheduleSlotStatus.AVAILABLE;
    slot.order = (maxOrderSlot?.order ?? 0) + 1;

    await slot.save();

    return slot;
  }

  @Mutation(() => TournamentScheduleSlot, { description: 'Assign a game to a schedule slot' })
  @UseGuards(PermGuard)
  async assignGameToSlot(@User() user: Player, @Args('input') input: AssignGameToSlotInput): Promise<TournamentScheduleSlot> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to assign games to slots');
    }

    const slot = await TournamentScheduleSlot.findOne({
      where: { id: input.slotId },
    });

    if (!slot) {
      throw new NotFoundException(`Schedule slot with ID ${input.slotId} not found`);
    }

    if (slot.status === ScheduleSlotStatus.BLOCKED) {
      throw new BadRequestException('Cannot assign game to a blocked slot');
    }

    if (slot.gameId) {
      throw new BadRequestException('Slot already has a game assigned. Remove it first.');
    }

    const game = await Game.findOne({
      where: { id: input.gameId },
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${input.gameId} not found`);
    }

    // Update slot
    slot.gameId = input.gameId;
    slot.status = ScheduleSlotStatus.SCHEDULED;
    await slot.save();

    // Update game
    game.scheduleSlotId = slot.id;
    game.scheduledTime = slot.startTime;
    game.courtId = slot.courtId;
    await game.save();

    return slot;
  }

  @Mutation(() => TournamentScheduleSlot, { description: 'Remove a game from a schedule slot' })
  @UseGuards(PermGuard)
  async removeGameFromSlot(@User() user: Player, @Args('slotId', { type: () => ID }) slotId: string): Promise<TournamentScheduleSlot> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to remove games from slots');
    }

    const slot = await TournamentScheduleSlot.findOne({
      where: { id: slotId },
    });

    if (!slot) {
      throw new NotFoundException(`Schedule slot with ID ${slotId} not found`);
    }

    if (!slot.gameId) {
      throw new BadRequestException('Slot does not have a game assigned');
    }

    if (slot.status === ScheduleSlotStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot remove game from a slot that is in progress');
    }

    // Update game
    const game = await Game.findOne({ where: { id: slot.gameId } });
    if (game) {
      game.scheduleSlotId = undefined;
      game.scheduledTime = undefined;
      await game.save();
    }

    // Update slot
    slot.gameId = undefined;
    slot.status = ScheduleSlotStatus.AVAILABLE;
    await slot.save();

    return slot;
  }

  @Mutation(() => TournamentScheduleSlot, { description: 'Block a schedule slot' })
  @UseGuards(PermGuard)
  async blockScheduleSlot(@User() user: Player, @Args('input') input: BlockSlotInput): Promise<TournamentScheduleSlot> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to block slots');
    }

    const slot = await TournamentScheduleSlot.findOne({
      where: { id: input.slotId },
    });

    if (!slot) {
      throw new NotFoundException(`Schedule slot with ID ${input.slotId} not found`);
    }

    if (slot.gameId) {
      throw new BadRequestException('Cannot block a slot that has a game assigned');
    }

    slot.status = ScheduleSlotStatus.BLOCKED;
    await slot.save();

    return slot;
  }

  @Mutation(() => TournamentScheduleSlot, { description: 'Unblock a schedule slot' })
  @UseGuards(PermGuard)
  async unblockScheduleSlot(@User() user: Player, @Args('slotId', { type: () => ID }) slotId: string): Promise<TournamentScheduleSlot> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to unblock slots');
    }

    const slot = await TournamentScheduleSlot.findOne({
      where: { id: slotId },
    });

    if (!slot) {
      throw new NotFoundException(`Schedule slot with ID ${slotId} not found`);
    }

    if (slot.status !== ScheduleSlotStatus.BLOCKED) {
      throw new BadRequestException('Slot is not blocked');
    }

    slot.status = ScheduleSlotStatus.AVAILABLE;
    await slot.save();

    return slot;
  }

  @Mutation(() => Boolean, { description: 'Delete a schedule slot' })
  @UseGuards(PermGuard)
  async deleteScheduleSlot(@User() user: Player, @Args('slotId', { type: () => ID }) slotId: string): Promise<boolean> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to delete slots');
    }

    const slot = await TournamentScheduleSlot.findOne({
      where: { id: slotId },
    });

    if (!slot) {
      throw new NotFoundException(`Schedule slot with ID ${slotId} not found`);
    }

    if (slot.gameId) {
      throw new BadRequestException('Cannot delete a slot that has a game assigned');
    }

    await slot.remove();

    return true;
  }

  @Mutation(() => [TournamentScheduleSlot], {
    description: 'Auto-schedule games using specified strategy; returns the slots that received a game, in assignment order',
  })
  @UseGuards(PermGuard)
  async scheduleGames(@User() user: Player, @Args('input') input: ScheduleGamesInput): Promise<TournamentScheduleSlot[]> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to schedule games');
    }

    const tournament = await TournamentEvent.findOne({
      where: { id: input.tournamentEventId },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${input.tournamentEventId} not found`);
    }

    // Get available slots
    const availableSlots = await TournamentScheduleSlot.find({
      where: {
        tournamentEventId: input.tournamentEventId,
        status: ScheduleSlotStatus.AVAILABLE,
      },
      order: { startTime: 'ASC', order: 'ASC' },
    });

    if (availableSlots.length === 0) {
      throw new BadRequestException('No available slots for scheduling');
    }

    // Get games to schedule
    let gamesToSchedule: Game[];

    if (input.drawIds && input.drawIds.length > 0) {
      gamesToSchedule = await Game.find({
        where: {
          linkId: In(input.drawIds),
          linkType: 'tournament',
          scheduleSlotId: IsNull(),
        },
        order: { round: 'ASC', order: 'ASC' },
      });
    } else {
      // Get all draws for this tournament
      const draws = await TournamentDraw.createQueryBuilder('draw')
        .innerJoin('draw.tournamentSubEvent', 'subEvent')
        .where('subEvent.eventId = :eventId', { eventId: input.tournamentEventId })
        .getMany();

      if (draws.length === 0) {
        return [];
      }

      const drawIds = draws.map((d) => d.id);

      gamesToSchedule = await Game.find({
        where: {
          linkId: In(drawIds),
          linkType: 'tournament',
          scheduleSlotId: IsNull(),
        },
        order: { round: 'ASC', order: 'ASC' },
      });
    }

    if (gamesToSchedule.length === 0) {
      return [];
    }

    // Schedule based on strategy
    return this.scheduleWithStrategy(gamesToSchedule, availableSlots, input.strategy, input.minRestMinutes ?? 15);
  }

  @Mutation(() => Boolean, { description: 'Publish the tournament schedule' })
  @UseGuards(PermGuard)
  async publishSchedule(@User() user: Player, @Args('tournamentEventId', { type: () => ID }) tournamentEventId: string): Promise<boolean> {
    // Check permission
    if (!user.hasAnyPermission(['edit-any:tournament'])) {
      throw new ForbiddenException('You do not have permission to publish schedule');
    }

    const tournament = await TournamentEvent.findOne({
      where: { id: tournamentEventId },
    });

    if (!tournament) {
      throw new NotFoundException(`Tournament with ID ${tournamentEventId} not found`);
    }

    tournament.schedulePublished = true;
    tournament.phase = TournamentPhase.SCHEDULED;
    await tournament.save();

    return true;
  }

  // ============ HELPER METHODS ============

  /**
   * Schedule games using the specified strategy
   */
  private async scheduleWithStrategy(
    games: Game[],
    slots: TournamentScheduleSlot[],
    strategy: ScheduleStrategy,
    minRestMinutes: number,
  ): Promise<TournamentScheduleSlot[]> {
    const scheduledSlots: TournamentScheduleSlot[] = [];

    // Track player last game end time
    const playerLastGameEnd = new Map<string, Date>();
    const availableSlots = [...slots];

    // Sort games based on strategy
    let sortedGames: Game[];

    switch (strategy) {
      case ScheduleStrategy.CATEGORY_ORDER:
        // Sort by draw (category), then round, then order
        sortedGames = games.sort((a, b) => {
          if (a.linkId !== b.linkId) return a.linkId.localeCompare(b.linkId);
          if (a.round !== b.round) return (a.round ?? '').localeCompare(b.round ?? '');
          return (a.order ?? 0) - (b.order ?? 0);
        });
        break;

      case ScheduleStrategy.BY_LEVEL:
        // Sort by round (finals first), then category
        sortedGames = games.sort((a, b) => {
          const roundOrder = (r: string | undefined) => {
            if (!r) return 99;
            if (r.includes('Final')) return 1;
            if (r.includes('Semi')) return 2;
            if (r.includes('Quarter')) return 3;
            return 10;
          };
          const aRound = roundOrder(a.round);
          const bRound = roundOrder(b.round);
          if (aRound !== bRound) return aRound - bRound;
          return a.linkId.localeCompare(b.linkId);
        });
        break;

      case ScheduleStrategy.RANDOM:
        // Shuffle randomly
        sortedGames = this.shuffleArray([...games]);
        break;

      case ScheduleStrategy.MINIMIZE_WAIT:
      default:
        // Sort by round, then try to minimize wait times
        sortedGames = games.sort((a, b) => {
          if (a.round !== b.round) return (a.round ?? '').localeCompare(b.round ?? '');
          return (a.order ?? 0) - (b.order ?? 0);
        });
        break;
    }

    // Schedule each game
    for (const game of sortedGames) {
      // Get players in this game
      const memberships = await GamePlayerMembership.find({
        where: { gameId: game.id },
      });

      const playerIds = memberships.map((m) => m.playerId);

      // Find suitable slot (respecting rest time)
      const suitableSlotIndex = availableSlots.findIndex((slot) => {
        // Check if all players have sufficient rest
        for (const playerId of playerIds) {
          const lastEnd = playerLastGameEnd.get(playerId);
          if (lastEnd) {
            const restTime = (slot.startTime.getTime() - lastEnd.getTime()) / 60000;
            if (restTime < minRestMinutes) {
              return false;
            }
          }
        }
        return true;
      });

      if (suitableSlotIndex === -1) {
        // Skipped: the game stays unscheduled and callers derive that from the returned slots.
        continue;
      }

      const slot = availableSlots[suitableSlotIndex];

      // Assign game to slot
      slot.gameId = game.id;
      slot.status = ScheduleSlotStatus.SCHEDULED;
      await slot.save();

      game.scheduleSlotId = slot.id;
      game.scheduledTime = slot.startTime;
      game.courtId = slot.courtId;
      await game.save();

      // Update player last game end time
      for (const playerId of playerIds) {
        playerLastGameEnd.set(playerId, slot.endTime);
      }

      // Remove slot from available list
      availableSlots.splice(suitableSlotIndex, 1);

      scheduledSlots.push(slot);
    }

    return scheduledSlots;
  }

  /**
   * Shuffle array randomly (Fisher-Yates algorithm)
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
