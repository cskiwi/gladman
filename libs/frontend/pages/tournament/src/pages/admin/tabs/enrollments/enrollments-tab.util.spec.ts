import { buildPlayerSearchWhere, escapeLikePattern, matchesSearchWords, searchWords } from './enrollments-tab.util';

describe('Manual enrollment player search helpers', () => {
  it('splits on any whitespace and ignores surrounding space', () => {
    expect(searchWords('  Herssens   Shane ')).toEqual(['Herssens', 'Shane']);
    expect(searchWords('   ')).toEqual([]);
  });

  it('escapes LIKE wildcards', () => {
    expect(escapeLikePattern('a%b_c\\d')).toBe('%a\\%b\\_c\\\\d%');
  });

  it('requires every word on first name, last name or member number in either order', () => {
    const where = buildPlayerSearchWhere(['Latomme', 'Glenn']);
    expect(where).toHaveLength(9);
    expect(where).toContainEqual({ AND: [{ firstName: { ilike: '%Latomme%' } }, { lastName: { ilike: '%Glenn%' } }] });
    expect(where).toContainEqual({ AND: [{ lastName: { ilike: '%Latomme%' } }, { firstName: { ilike: '%Glenn%' } }] });
    expect(where).toContainEqual({ AND: [{ memberId: { ilike: '%Latomme%' } }, { lastName: { ilike: '%Glenn%' } }] });
    expect(buildPlayerSearchWhere(['Latomme'])).toHaveLength(3);
  });

  it('keeps both words when they target the same field', () => {
    const where = buildPlayerSearchWhere(['glenn', 'lat']);
    expect(where).toContainEqual({ AND: [{ firstName: { ilike: '%glenn%' } }, { firstName: { ilike: '%lat%' } }] });
    expect(where.every((entry) => entry.AND.length === 2)).toBe(true);
  });

  it('limits the server-side cross product to three words', () => {
    expect(buildPlayerSearchWhere(['a1', 'b2', 'c3', 'd4', 'e5'])).toHaveLength(27);
  });

  it('matches all words client-side regardless of case or field', () => {
    const player = { firstName: 'Glenn', lastName: 'Latomme', memberId: '50123456' };
    expect(matchesSearchWords(player, ['latomme', 'GLENN', '5012'])).toBe(true);
    expect(matchesSearchWords(player, ['glenn', 'other'])).toBe(false);
  });
});
