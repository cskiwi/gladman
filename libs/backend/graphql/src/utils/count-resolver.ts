import { AllowAnonymous, PermGuard } from '@app/backend-authorization';
import { Type, UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { BaseEntity, FindOptionsWhere } from 'typeorm';

interface CountableArgs {
  getQuery(where?: unknown): FindOptionsWhere<unknown>[];
}

interface CountableEntity {
  count(options?: { where?: FindOptionsWhere<unknown>[] }): Promise<number>;
}

export interface CountResolverOptions {
  /** The TypeORM entity to count */
  entity: typeof BaseEntity;
  /** The generated `<Entity>Args` input class (only `where` is used) */
  args: Type & CountableArgs;
  /** Root query name, e.g. `gamesCount` */
  name: string;
  /** When true the query requires an authenticated user (PermGuard without AllowAnonymous) */
  authenticated?: boolean;
}

/**
 * Creates a generic root `<name>(args): Int` query that counts rows of a native entity
 * using the same `where` input as the entity's list query. Keeps the graph limited to
 * native types while avoiding full list fetches when only a count is needed.
 */
export function createCountResolver({ entity, args: ArgsType, name, authenticated }: CountResolverOptions): Type {
  @Resolver()
  class CountResolver {
    @Query(() => Int, { name, description: `Count of ${entity.name} rows matching the given where filter` })
    @UseGuards(PermGuard)
    async count(
      @Args('args', { type: () => ArgsType, nullable: true })
      inputArgs?: {
        where?: unknown;
      },
    ): Promise<number> {
      const where = ArgsType.getQuery(inputArgs?.where);
      return (entity as unknown as CountableEntity).count(where.length > 0 ? { where } : undefined);
    }
  }

  if (!authenticated) {
    AllowAnonymous()(CountResolver.prototype, 'count', Object.getOwnPropertyDescriptor(CountResolver.prototype, 'count') as PropertyDescriptor);
  }

  Object.defineProperty(CountResolver, 'name', { value: `${entity.name}CountResolver` });
  return CountResolver;
}
