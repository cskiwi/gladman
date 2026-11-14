import { CRON_TIMEZONE } from '@app/utils/comp';
import { CronTime } from 'cron/dist/time';

/** Minimal cron job shape (native CronJob columns) needed to derive the UI-only fields. */
export interface CronJobColumns {
  cronTime: string;
  amount?: number | null;
}

/**
 * Next scheduled run (ISO string) for a cron expression, or null when the expression is invalid.
 * Uses the same `cron` library and timezone as the scheduler that runs the jobs, so the result does
 * not depend on the browser's timezone.
 */
export function computeNextRun(cronTime: string, from?: Date): string | null {
  try {
    const time = new CronTime(cronTime, CRON_TIMEZONE);
    const next = from ? time.getNextDateFrom(from, CRON_TIMEZONE) : time.sendAt();
    return next.toISO();
  } catch {
    return null;
  }
}

/** A cron job is considered running while its `amount` counter is above zero. */
export function isCronJobRunning(job: Pick<CronJobColumns, 'amount'>): boolean {
  return (job.amount ?? 0) > 0;
}
