import { Team, TeamPlayerMembership, Player } from '@app/models';
import { AllowAnonymous } from '@app/backend-authorization';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { TeamArgs, TeamPlayerMembershipArgs, PlayerArgs } from '../args';

@Resolver(() => TeamPlayerMembership)
export class TeamPlayerMembershipResolver {
  @Query(() => [TeamPlayerMembership])
  @AllowAnonymous()
  async teamPlayerMemberships(
    @Args('args', { type: () => TeamPlayerMembershipArgs, nullable: true })
    inputArgs?: InstanceType<typeof TeamPlayerMembershipArgs>,
  ): Promise<TeamPlayerMembership[]> {
    return TeamPlayerMembership.find(TeamPlayerMembershipArgs.toFindManyOptions(inputArgs));
  }

  @ResolveField(() => Team, { nullable: true })
  async team(
    @Parent() { teamId }: TeamPlayerMembership,
    @Args('args', {
      type: () => TeamArgs,
      nullable: true,
    })
    inputArgs?: InstanceType<typeof TeamArgs>,
  ) {
    const args = TeamArgs.toFindOneOptions(inputArgs);

    if (args.where?.length > 0) {
      args.where = args.where.map((where) => ({
        ...where,
        id: teamId,
      }));
    } else {
      args.where = [
        {
          id: teamId,
        },
      ];
    }

    return Team.findOne(args);
  }

  @ResolveField(() => Player, { nullable: true })
  async player(
    @Parent() { playerId }: TeamPlayerMembership,
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
