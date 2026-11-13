import { inject, Injectable, signal, computed, effect, untracked } from '@angular/core';
import { AuthService } from '@app/frontend-modules-auth/service';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { computeNextRun, isCronJobRunning } from './cron-jobs-tab.util';

export interface CronJobMetaModel {
  jobName?: string;
  queueName?: string;
  arguments?: Record<string, unknown>;
}

export interface CronJobModel {
  id: string;
  name: string;
  type: 'ranking' | 'sync';
  cronTime: string;
  meta?: CronJobMetaModel;
  lastRun?: string;
  nextRun?: string;
  running: boolean;
  active: boolean;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

/** Native CronJob columns as returned by GraphQL; `nextRun` and `running` are derived client-side. */
type CronJobRow = Omit<CronJobModel, 'nextRun' | 'running'>;

function toCronJobModel(row: CronJobRow): CronJobModel {
  return {
    ...row,
    nextRun: computeNextRun(row.cronTime) ?? undefined,
    running: isCronJobRunning(row),
  };
}

const GET_CRON_JOBS = gql`
  query GetCronJobs {
    cronJobs {
      id
      name
      type
      cronTime
      meta
      lastRun
      active
      amount
      createdAt
      updatedAt
    }
  }
`;

const TRIGGER_CRON_JOB = gql`
  mutation TriggerCronJob($id: ID!, $year: Int) {
    triggerCronJob(id: $id, year: $year) {
      id
      name
      cronTime
      lastRun
      amount
    }
  }
`;

const UPDATE_CRON_JOB = gql`
  mutation UpdateCronJob($id: ID!, $input: UpdateCronJobInput!) {
    updateCronJob(id: $id, input: $input) {
      id
      name
      cronTime
      active
    }
  }
`;

@Injectable()
export class CronJobsTabService {
  private readonly apollo = inject(Apollo);
  private readonly auth = inject(AuthService);

  private _cronJobs = signal<CronJobModel[]>([]);
  private _loading = signal(true);

  cronJobs = computed(() => this._cronJobs());
  loading = computed(() => this._loading());

  constructor() {
    // Wait for the auth token (SSR cookie on the server, Auth0 token in the browser);
    // querying without it yields "Forbidden resource"
    effect(() => {
      if (this.auth.token()) {
        untracked(() => this.loadCronJobs());
      }
    });
  }

  loadCronJobs(): void {
    this._loading.set(true);
    this.apollo
      .query<{ cronJobs: CronJobRow[] }>({
        query: GET_CRON_JOBS,
        fetchPolicy: 'network-only',
      })
      .pipe(map((result) => (result.data?.cronJobs ?? []).map(toCronJobModel)))
      .subscribe({
        next: (jobs) => {
          this._cronJobs.set(jobs);
          this._loading.set(false);
        },
        error: (err) => {
          console.warn('Failed to load cron jobs:', err);
          this._loading.set(false);
        },
      });
  }

  triggerCronJob(id: string, year?: number): Observable<CronJobModel> {
    return this.apollo
      .mutate<{ triggerCronJob: CronJobRow }>({
        mutation: TRIGGER_CRON_JOB,
        variables: { id, year },
      })
      .pipe(map((result) => toCronJobModel(result.data!.triggerCronJob)));
  }

  updateCronJob(id: string, input: { cronTime?: string; active?: boolean }): Observable<CronJobModel> {
    return this.apollo
      .mutate<{ updateCronJob: CronJobRow }>({
        mutation: UPDATE_CRON_JOB,
        variables: { id, input },
      })
      .pipe(map((result) => toCronJobModel(result.data!.updateCronJob)));
  }
}
