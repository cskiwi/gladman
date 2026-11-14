import { LocationEventMembership } from '@app/models';
import { NotFoundException } from '@nestjs/common';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { LocationEventMembershipArgs } from '../../../args';

@Resolver(() => LocationEventMembership)
export class LocationEventMembershipResolver {
  @Query(() => LocationEventMembership)
  async locationEventMembership(@Args('id', { type: () => ID }) id: string): Promise<LocationEventMembership> {
    const membership = await LocationEventMembership.findOne({
      where: {
        id,
      },
    });

    if (membership) {
      return membership;
    }

    throw new NotFoundException(id);
  }

  @Query(() => [LocationEventMembership])
  async locationEventMemberships(
    @Args('args', { type: () => LocationEventMembershipArgs, nullable: true })
    inputArgs?: InstanceType<typeof LocationEventMembershipArgs>,
  ): Promise<LocationEventMembership[]> {
    const args = LocationEventMembershipArgs.toFindManyOptions(inputArgs);
    return LocationEventMembership.find(args);
  }
}
