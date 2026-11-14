import { AllowAnonymous } from '@app/backend-authorization';
import { ClubPlayerMembership, Club, Team, Player, TournamentEvent } from '@app/models';
import { IsUUID } from '@app/utils';
import { NotFoundException } from '@nestjs/common';
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ClubArgs, ClubPlayerMembershipArgs, TeamArgs, TournamentEventArgs } from '../args';

@Resolver(() => Club)
export class ClubResolver {
  @Query(() => Club)
  @AllowAnonymous()
  async club(@Args('id', { type: () => ID }) id: string): Promise<Club> {
    const club = IsUUID(id)
      ? await Club.findOne({
          where: {
            id,
          },
        })
      : await Club.findOne({
          where: {
            slug: id,
          },
        });

    if (club) {
      return club;
    }

    throw new NotFoundException(id);
  }

  @Query(() => [Club])
  @AllowAnonymous()
  async clubs(
    @Args('args', { type: () => ClubArgs, nullable: true })
    inputArgs?: InstanceType<typeof ClubArgs>,
  ): Promise<Club[]> {
    const args = ClubArgs.toFindManyOptions(inputArgs);
    return Club.find(args);
  }

  @ResolveField(() => [ClubPlayerMembership])
  async clubPlayerMemberships(
    @Parent() { id }: Club,
    @Args('args', {
      type: () => ClubPlayerMembershipArgs,
      nullable: true,
    })
    inputArgs?: InstanceType<typeof ClubPlayerMembershipArgs>,
  ) {
    const args = ClubPlayerMembershipArgs.toFindManyOptions(inputArgs);

    if (args.where?.length > 0) {
      args.where = args.where.map((where) => ({
        ...where,
        clubId: id,
      }));
    } else {
      args.where = [
        {
          clubId: id,
        },
      ];
    }

    return ClubPlayerMembership.find(args);
  }

  @ResolveField(() => [Team], { nullable: true })
  async teams(
    @Parent() { id }: Player,
    @Args('args', { type: () => TeamArgs, nullable: true })
    inputArgs?: InstanceType<typeof TeamArgs>,
  ) {
    const args = TeamArgs.toFindManyOptions(inputArgs);

    if (args.where?.length > 0) {
      args.where = args.where.map((where) => ({
        ...where,
        clubId: id,
      }));
    } else {
      args.where = [
        {
          clubId: id,
        },
      ];
    }

    return Team.find(args);
  }

  @ResolveField(() => [TournamentEvent], { nullable: true })
  async tournamentEvents(
    @Parent() { id }: Club,
    @Args('args', { type: () => TournamentEventArgs, nullable: true })
    inputArgs?: InstanceType<typeof TournamentEventArgs>,
  ): Promise<TournamentEvent[]> {
    const args = TournamentEventArgs.toFindManyOptions(inputArgs);

    if (args.where?.length > 0) {
      args.where = args.where.map((where) => ({
        ...where,
        clubId: id,
      }));
    } else {
      args.where = [{ clubId: id }];
    }

    return TournamentEvent.find(args);
  }
}
