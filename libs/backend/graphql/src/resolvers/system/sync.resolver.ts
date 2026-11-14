import { PermGuard, User } from '@app/backend-authorization';
import { SyncService } from '@app/backend-sync';
import { Player, TournamentEvent } from '@app/models';
import { ForbiddenException, Logger, UseGuards } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Args, Field, ID, InputType, Int, Mutation, Resolver } from '@nestjs/graphql';

// Input types for team matching
@InputType('UnmatchedTeamInput')
class UnmatchedTeamInput {
  @Field()
  externalCode!: string;

  @Field()
  externalName!: string;

  @Field()
  normalizedName!: string;

  @Field()
  clubName!: string;

  @Field(() => Int, { nullable: true })
  teamNumber?: number;

  @Field({ nullable: true })
  gender?: string;

  @Field(() => Int, { nullable: true })
  strength?: number;
}

@Resolver()
export class SyncResolver {
  private readonly logger = new Logger(SyncResolver.name);

  constructor(private readonly syncService: SyncService) {}

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerDiscoverySync(
    @User() user: Player,
    @Args('refDate', { nullable: true }) refDate?: string,
    @Args('pageSize', { type: () => Int, nullable: true }) pageSize?: number,
    @Args('searchTerm', { nullable: true }) searchTerm?: string,
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger discovery sync');
    }

    await this.syncService.queueTournamentDiscovery({ refDate, pageSize, searchTerm });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async addTournamentByCode(@User() user: Player, @Args('visualCode', { type: () => String }) visualCode: string): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to add tournament by code');
    }

    await this.syncService.queueTournamentAddByCode({ visualCode });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async addTournamentByCodes(@User() user: Player, @Args('visualCode', { type: () => [String] }) visualCode: string[]): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to add tournament by code');
    }

    for (const code of visualCode) {
      await this.syncService.queueTournamentAddByCode({ visualCode: code });
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerEventsSync(
    @User() user: Player,
    @Args('eventId', { type: () => [ID] }) eventIds: string[],
    @Args('includeSubComponents', { type: () => Boolean, defaultValue: false }) includeSubComponents: boolean,
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger event sync!');
    }

    for (const eventId of eventIds) {
      await this.syncService.queueEventSync(eventId, includeSubComponents);
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerEventSync(
    @User() user: Player,
    @Args('eventId', { type: () => ID }) eventId: string,
    @Args('includeSubComponents', { type: () => Boolean, defaultValue: false }) includeSubComponents: boolean,
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger event sync!');
    }

    await this.syncService.queueEventSync(eventId, includeSubComponents);

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerDrawSync(
    @User() user: Player,
    @Args('drawId', { type: () => ID }) drawId: string,
    @Args('includeSubComponents', { type: () => Boolean, defaultValue: false }) includeSubComponents: boolean,
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger draw sync');
    }

    await this.syncService.queueDrawSync(drawId, includeSubComponents);

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerGameSync(
    @User() user: Player,
    @Args('drawId', { type: () => ID }) drawId: string,
    @Args('matchCodes', { type: () => [String], nullable: true }) matchCodes?: string[],
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger game sync');
    }

    await this.syncService.queueGameSync(drawId, matchCodes);

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerEncounterSync(@User() user: Player, @Args('encounterId', { type: () => ID }) encounterId: string): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger encounter sync');
    }

    await this.syncService.queueEncounterSync(encounterId);

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerSubEventsSync(
    @User() user: Player,
    @Args('subEventIds', { type: () => [ID] }) subEventIds: string[],
    @Args('includeSubComponents', { type: () => Boolean, defaultValue: false }) includeSubComponents: boolean,
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger sub-event sync!');
    }

    for (const subEventId of subEventIds) {
      await this.syncService.queueSubEventSync(subEventId, includeSubComponents);
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerDrawsSync(
    @User() user: Player,
    @Args('drawIds', { type: () => [ID] }) drawIds: string[],
    @Args('includeSubComponents', { type: () => Boolean, defaultValue: false }) includeSubComponents: boolean,
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger draw sync!');
    }

    for (const drawId of drawIds) {
      await this.syncService.queueDrawSync(drawId, includeSubComponents);
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerEncountersSync(@User() user: Player, @Args('encounterIds', { type: () => [ID] }) encounterIds: string[]): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger encounter sync!');
    }

    for (const encounterId of encounterIds) {
      await this.syncService.queueEncounterSync(encounterId);
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerSubEventSync(
    @User() user: Player,
    @Args('subEventId', { type: () => ID }) subEventId: string,
    @Args('includeSubComponents', { type: () => Boolean, defaultValue: false }) includeSubComponents?: boolean,
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger sub-event sync');
    }

    await this.syncService.queueSubEventSync(subEventId, includeSubComponents);

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerTeamMatching(
    @User() user: Player,
    @Args('tournamentCode') tournamentCode: string,
    @Args('eventCode', { nullable: true }) eventCode?: string,
    @Args('unmatchedTeams', { type: () => [UnmatchedTeamInput], nullable: true }) unmatchedTeams?: UnmatchedTeamInput[],
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger team matching');
    }

    await this.syncService.queueTeamMatching({ tournamentCode, eventCode, unmatchedTeams });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerTournamentSync(@User() user: Player): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger tournament structure sync');
    }

    await this.syncService.queueTournamentSync();

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerCompetitionSync(@User() user: Player): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger competition structure sync');
    }

    await this.syncService.queueCompetitionSync();

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerRankingSync(@User() user: Player, @Args('startDate', { nullable: true }) startDate?: string): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger ranking sync');
    }

    await this.syncService.queueRankingSync(startDate ? { startDate } : undefined);

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerRankingCalc(
    @User() user: Player,
    @Args('systemId', { type: () => ID }) systemId: string,
    @Args('startDate', { nullable: true }) startDate?: string,
    @Args('stopDate', { nullable: true }) stopDate?: string,
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger ranking calculation');
    }

    await this.syncService.queueRankingCalc({
      startDate: startDate ? new Date(startDate) : undefined,
      stopDate: stopDate ? new Date(stopDate) : undefined,
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async clearAllJobs(@User() user: Player): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to clear jobs');
    }

    await this.syncService.clearAllJobs();

    return true;
  }

  @Mutation(() => Int)
  @UseGuards(PermGuard)
  async clearCompletedJobs(@User() user: Player): Promise<number> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to clear jobs');
    }

    return this.syncService.clearCompletedJobs();
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerTournamentScrapeYear(
    @User() user: Player,
    @Args('year', { type: () => Int }) year: number,
    @Args('runAdding', { type: () => Boolean, defaultValue: true }) runAdding: boolean,
    @Args('runCleanup', { type: () => Boolean, defaultValue: true }) runCleanup: boolean,
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger tournament scrape');
    }

    await this.syncService.queueTournamentScrapeYear({
      year,
      runAdding,
      runCleanup,
      metadata: { displayName: `Scrape calendar year ${year}` },
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async triggerTournamentScrapeYears(
    @User() user: Player,
    @Args('years', { type: () => [Int] }) years: number[],
    @Args('runAdding', { type: () => Boolean, defaultValue: true }) runAdding: boolean,
    @Args('runCleanup', { type: () => Boolean, defaultValue: true }) runCleanup: boolean,
  ): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger tournament scrape');
    }

    for (const year of years) {
      await this.syncService.queueTournamentScrapeYear({
        year,
        runAdding,
        runCleanup,
        metadata: { displayName: `Scrape calendar year ${year}` },
      });
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(PermGuard)
  async syncTournamentOfficialStatus(@User() user: Player): Promise<boolean> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to sync tournament official status');
    }

    const jsonPath = join(process.cwd(), 'scripts', 'tournament-ids-output.json');
    const raw = readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(raw) as {
      tournaments: { tournamentId: string; official: boolean; eventName: string }[];
    };

    const entries = data.tournaments.filter((t) => t.tournamentId);

    let updated = 0;
    let alreadyCorrect = 0;
    let notFound = 0;
    let recalcQueued = 0;

    for (const entry of entries) {
      const tournament = await TournamentEvent.findOne({
        where: { visualCode: entry.tournamentId },
      });

      if (!tournament) {
        notFound++;
        continue;
      }

      if (tournament.official === entry.official) {
        alreadyCorrect++;
        continue;
      }

      tournament.official = entry.official;
      await tournament.save();
      updated++;

      const action = entry.official ? 'create' : 'remove';
      await this.syncService.queueTournamentRankingRecalc({
        tournamentId: tournament.id,
        action,
        metadata: {
          displayName: `Ranking point ${action} for ${tournament.name}`,
          eventName: tournament.name,
        },
      });
      recalcQueued++;

      this.logger.log(`Updated "${tournament.name}" official=${entry.official}, queued recalc (${action})`);
    }

    this.logger.log(
      `syncTournamentOfficialStatus done — updated: ${updated}, alreadyCorrect: ${alreadyCorrect}, notFound: ${notFound}, recalcQueued: ${recalcQueued}`,
    );

    return true;
  }
}
