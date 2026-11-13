import { Game, GamePlayerMembership, Player } from '@app/models';
import { AllowAnonymous } from '@app/backend-authorization';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GameArgs, GamePlayerMembershipArgs, PlayerArgs } from '../args';

@Resolver(() => GamePlayerMembership)
export class GamePlayerMembershipResolver {
  @Query(() => [GamePlayerMembership])
  @AllowAnonymous()
  async gamePlayerMemberships(
    @Args('args', { type: () => GamePlayerMembershipArgs, nullable: true })
    inputArgs?: InstanceType<typeof GamePlayerMembershipArgs>,
  ): Promise<GamePlayerMembership[]> {
    return GamePlayerMembership.find(GamePlayerMembershipArgs.toFindManyOptions(inputArgs));
  }

  @ResolveField(() => Game, { nullable: true })
  async game(
    @Parent() { gameId, game }: GamePlayerMembership,
    @Args('args', {
      type: () => GameArgs,
      nullable: true,
    })
    inputArgs?: InstanceType<typeof GameArgs>,
  ) {
    // Reuse the relation when the parent query already joined it (avoids N+1)
    if (game && !inputArgs?.where?.length) {
      return game;
    }

    const args = GameArgs.toFindOneOptions(inputArgs);

    if (args.where?.length > 0) {
      args.where = args.where.map((where) => ({
        ...where,
        id: gameId,
      }));
    } else {
      args.where = [
        {
          id: gameId,
        },
      ];
    }

    return Game.findOne(args);
  }

  @ResolveField(() => Player, { nullable: true })
  async gamePlayer(
    @Parent() { playerId }: GamePlayerMembership,
    @Args('args', {
      type: () => PlayerArgs,
      nullable: true,
    })
    inputArgs?: InstanceType<typeof PlayerArgs>,
  ) {
    const args = PlayerArgs.toFindOneOptions(inputArgs);

    if (args.where?.length > 0) {
      args.where = args.where.map((where) => ({
        ...where,
        id: playerId,
      }));
    } else {
      args.where = [
        {
          id: playerId,
        },
      ];
    }

    return Player.findOne(args);
  }
}
