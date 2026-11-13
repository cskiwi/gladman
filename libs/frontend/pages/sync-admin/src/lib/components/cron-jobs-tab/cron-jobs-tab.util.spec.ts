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
