import { Club, ClubPlayerMembership, Player } from '@app/models';
import { AllowAnonymous } from '@app/backend-authorization';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ClubArgs, ClubPlayerMembershipArgs, PlayerArgs } from '../args';

@Resolver(() => ClubPlayerMembership)
export class ClubPlayerMembershipResolver {
  @Query(() => [ClubPlayerMembership])
  @AllowAnonymous()
  async clubPlayerMemberships(
    @Args('args', { type: () => ClubPlayerMembershipArgs, nullable: true })
    inputArgs?: InstanceType<typeof ClubPlayerMembershipArgs>,
  ): Promise<ClubPlayerMembership[]> {
    return ClubPlayerMembership.find(ClubPlayerMembershipArgs.toFindManyOptions(inputArgs));
  }

  @ResolveField(() => Club, { nullable: true })
  async club(
    @Parent() { clubId }: ClubPlayerMembership,
    @Args('args', {
      type: () => ClubArgs,
      nullable: true,
    })
    inputArgs?: InstanceType<typeof ClubArgs>,
  ) {
    const args = ClubArgs.toFindOneOptions(inputArgs);

    if (args.where?.length > 0) {
      args.where = args.where.map((where) => ({
        ...where,
        id: clubId,
      }));
    } else {
      args.where = [
        {
          id: clubId,
        },
      ];
    }

    return Club.findOne(args);
  }

  @ResolveField(() => Player, { nullable: true })
  async player(
    @Parent() { playerId }: ClubPlayerMembership,
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
