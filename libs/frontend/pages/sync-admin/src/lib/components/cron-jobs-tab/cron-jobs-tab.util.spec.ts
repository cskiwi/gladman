import { computeNextRun, isCronJobRunning } from './cron-jobs-tab.util';

describe('cron-jobs-tab.util', () => {
  describe('computeNextRun', () => {
    it('returns the next run after the given date', () => {
      const next = computeNextRun('0 0 * * * *', new Date('2030-01-01T10:30:00.000Z'));
      expect(next).not.toBeNull();
      expect(new Date(next as string).getTime()).toBeGreaterThan(new Date('2030-01-01T10:30:00.000Z').getTime());
    });

    it('returns the next run in the future when no date is given', () => {
      const next = computeNextRun('0 0 * * * *');
      expect(new Date(next as string).getTime()).toBeGreaterThan(Date.now());
    });

    it('interprets the expression in the scheduler timezone (Europe/Brussels), not the browser timezone', () => {
      // 03:00 in Brussels during winter time (UTC+1) is 02:00 UTC
      expect(new Date(computeNextRun('0 3 * * *', new Date('2030-01-15T12:00:00.000Z')) as string).toISOString()).toBe('2030-01-16T02:00:00.000Z');
    });

    it('returns null for an invalid expression', () => {
      expect(computeNextRun('not a cron')).toBeNull();
    });
  });

  describe('isCronJobRunning', () => {
    it('is running only when amount is above zero', () => {
      expect(isCronJobRunning({ amount: 1 })).toBe(true);
      expect(isCronJobRunning({ amount: 0 })).toBe(false);
      expect(isCronJobRunning({ amount: null })).toBe(false);
      expect(isCronJobRunning({})).toBe(false);
    });
  });
});
