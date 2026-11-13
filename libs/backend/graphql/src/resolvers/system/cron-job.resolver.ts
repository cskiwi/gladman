import { PermGuard, User } from '@app/backend-authorization';
import { SyncService } from '@app/backend-sync';
import { CronJob, CronJobUpdateInput, Player } from '@app/models';
import { ForbiddenException, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Field, ID, InputType, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CronJobArgs } from '../../args';

@InputType()
class UpdateCronJobInput {
  @Field({ nullable: true })
  cronTime?: string;

  @Field({ nullable: true })
  active?: boolean;
}

@Resolver(() => CronJob)
export class CronJobResolver {
  constructor(private readonly syncService: SyncService) {}

  @Query(() => CronJob)
  @UseGuards(PermGuard)
  async cronJob(@User() user: Player, @Args('id', { type: () => ID }) id: string): Promise<CronJob> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to access cron jobs');
    }
    const cronJob = await CronJob.findOne({
      where: {
        id,
      },
    });

    if (cronJob) {
      return cronJob;
    }

    throw new NotFoundException(id);
  }

  @Query(() => [CronJob])
  @UseGuards(PermGuard)
  async cronJobs(
    @User() user: Player,
    @Args('args', { type: () => CronJobArgs, nullable: true })
    inputArgs?: InstanceType<typeof CronJobArgs>,
  ): Promise<CronJob[]> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to access cron jobs');
    }
    const args = CronJobArgs.toFindManyOptions(inputArgs);
    return CronJob.find(args);
  }

  @Mutation(() => CronJob)
  @UseGuards(PermGuard)
  async triggerCronJob(
    @User() user: Player,
    @Args('id', { type: () => ID }) id: string,
    @Args('year', { type: () => Int, nullable: true }) year?: number,
  ): Promise<CronJob> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to trigger cron jobs');
    }
    const cronJob = await CronJob.findOne({ where: { id } });
    if (!cronJob) {
      throw new NotFoundException(`Cron job with id ${id} not found`);
    }
    await this.syncService.triggerCronJob(cronJob.name, year);
    return CronJob.findOneOrFail({ where: { id } });
  }

  @Mutation(() => CronJob)
  @UseGuards(PermGuard)
  async updateCronJob(@User() user: Player, @Args('id', { type: () => ID }) id: string, @Args('input') input: UpdateCronJobInput): Promise<CronJob> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to update cron jobs');
    }
    return this.syncService.updateCronJob(id, input);
  }
}
