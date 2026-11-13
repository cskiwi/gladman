import { And, Equal, ILike, LessThan, MoreThanOrEqual } from 'typeorm';
import { GraphQLWhereConverter } from './queryFixer';

describe('GraphQLWhereConverter', () => {
  it('combines several operators on one field with AND', () => {
    expect(GraphQLWhereConverter.convert({ playedAt: { gte: 1, lt: 5 } })).toEqual({
      playedAt: And(MoreThanOrEqual(1), LessThan(5)),
    });
  });

  it('keeps both conditions when AND entries target the same field', () => {
    expect(GraphQLWhereConverter.convert({ AND: [{ firstName: { ilike: '%glenn%' } }, { firstName: { ilike: '%lat%' } }] })).toEqual({
      firstName: And(ILike('%glenn%'), ILike('%lat%')),
    });
  });

  it('merges AND entries on different fields and nested relations', () => {
    expect(
      GraphQLWhereConverter.convert({
        AND: [
          { firstName: { eq: 'a' }, game: { winner: { eq: 1 } } },
          { lastName: { eq: 'b' }, game: { gameType: { eq: 'S' } } },
        ],
      }),
    ).toEqual({ firstName: 'a', lastName: 'b', game: { winner: 1, gameType: 'S' } });
  });

  it('wraps plain values in Equal when they collide', () => {
    expect(GraphQLWhereConverter.convert({ AND: [{ season: { eq: 2026 } }, { season: { gte: 2020 } }] })).toEqual({
      season: And(Equal(2026), MoreThanOrEqual(2020)),
    });
  });
});
