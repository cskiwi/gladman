import { PermGuard, User } from '@app/backend-authorization';
import { SyncService } from '@app/backend-sync';
import { Player } from '@app/models';
import { Controller, ForbiddenException, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';

export interface SyncQueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}

export interface SyncStatusResponse {
  status: string;
  timestamp: string;
  queues: SyncQueueStats;
}

export interface SyncJobResponse {
  id: string;
  name: string;
  data: string;
  progress: number;
  processedOn?: string;
  finishedOn?: string;
  failedReason?: string;
  status: string;
  timestamp?: number;
  parentId?: string;
}

/**
 * Queue state (BullMQ) is not database data, so it is served over REST instead of GraphQL.
 */
@Controller('sync')
@UseGuards(PermGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('status')
  async status(@User() user: Player): Promise<SyncStatusResponse> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to access sync status');
    }

    const queues = await this.syncService.getQueueStats();

    return {
      status: 'running',
      timestamp: new Date().toISOString(),
      queues,
    };
  }

  @Get('jobs')
  async jobs(
    @User() user: Player,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('status') status?: string,
  ): Promise<SyncJobResponse[]> {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to access sync jobs');
    }

    const jobs = await this.syncService.getRecentJobs(limit, status);

    return jobs.map((job: any) => ({
      id: job.id?.toString() || '',
      name: job.name || '',
      data: JSON.stringify(job.data || {}),
      progress: job.progress || 0,
      processedOn: job.processedOn ? new Date(job.processedOn).toISOString() : undefined,
      finishedOn: job.finishedOn ? new Date(job.finishedOn).toISOString() : undefined,
      failedReason: job.failedReason || undefined,
      status: job.status,
      timestamp: job.timestamp || undefined,
      parentId: job.parentId || undefined,
    }));
  }

  @Get('queues')
  async queues(@User() user: Player) {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to access queue statistics');
    }

    return this.syncService.getQueueStatsByName();
  }

  @Get('queues/:name')
  async queue(@User() user: Player, @Param('name') name: string) {
    if (!(await user.hasAnyPermission(['change:job']))) {
      throw new ForbiddenException('Insufficient permissions to access queue statistics');
    }

    const stats = (await this.syncService.getQueueStatsByName()) as Record<string, unknown>;
    return stats?.[name] ?? null;
  }
}
