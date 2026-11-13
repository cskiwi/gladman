import { buildBulkCheckInResult, buildCheckInStats, withCheckInPlayer } from './checkin-tab.service';

describe('check-in client-side derivations', () => {
  it.each([
    [{ total: 0, checkedIn: 0, pending: 0, noShow: 0 }, 0],
    [{ total: 12, checkedIn: 4, pending: 7, noShow: 1 }, 100 / 3],
    [{ total: 4, checkedIn: 4, pending: 0, noShow: 0 }, 100],
  ])('derives the check-in rate from counts and handles a zero denominator (%j)', (counts, rate) => {
    const stats = buildCheckInStats(counts);
    expect(stats).toMatchObject(counts);
    expect(stats.checkInRate).toBeCloseTo(rate, 10);
  });

  it('treats missing counts as zero', () => {
    expect(buildCheckInStats({})).toEqual({ total: 0, checkedIn: 0, pending: 0, noShow: 0, checkInRate: 0 });
  });

  it('derives bulk success and failure from the returned rows', () => {
    expect(buildBulkCheckInResult(['a', 'b', 'c'], [{ enrollmentId: 'a' }, { enrollmentId: 'c' }])).toEqual({
      successCount: 2,
      failedCount: 1,
      failedEnrollmentIds: ['b'],
    });
    expect(buildBulkCheckInResult(['a'], [{ enrollmentId: 'a' }])).toEqual({ successCount: 1, failedCount: 0, failedEnrollmentIds: [] });
    expect(buildBulkCheckInResult(['a'], [])).toEqual({ successCount: 0, failedCount: 1, failedEnrollmentIds: ['a'] });
  });

  it('exposes the enrollment player on the check-in', () => {
    const player = { id: 'safe-player' };
    expect(withCheckInPlayer({ id: 'c', enrollment: { id: 'e', player } } as never).player).toBe(player);
    expect(withCheckInPlayer({ id: 'c' } as never).player).toBeUndefined();
  });
});
