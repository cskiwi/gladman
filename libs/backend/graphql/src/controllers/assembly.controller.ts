import { Player } from '@app/models';
import { sortPlayers } from '@app/utils/sorts';
import { Body, Controller, Post } from '@nestjs/common';
import { In } from 'typeorm';
import { AssemblyInput } from '../inputs/assembly.input';
import { AssemblyOutput, PlayerRankingType } from '../services/assembly/assembly-output';
import { AssemblyValidationService } from '../services/assembly/assembly-validation.service';

export type AssemblyValidationResponse = Omit<AssemblyOutput, 'basePlayersData' | 'titularsPlayerData' | 'systemId'>;

/**
 * Assembly rule validation is not database data, so it is served over REST instead of GraphQL.
 * Same (open) access as the former `validateAssembly` query.
 */
@Controller('assembly')
export class AssemblyController {
  constructor(private readonly assemblyValidationService: AssemblyValidationService) {}

  @Post('validate')
  async validate(@Body() assembly: AssemblyInput): Promise<AssemblyValidationResponse> {
    const result = await this.assemblyValidationService.validate(assembly);

    return {
      errors: result.errors,
      warnings: result.warnings,
      valid: result.valid,
      baseTeamIndex: result.baseTeamIndex,
      titularsIndex: result.titularsIndex,
      baseTeamPlayers: await this.resolveBaseTeamPlayers(result.basePlayersData, result.systemId),
      titularsPlayers: result.titularsPlayers,
    };
  }

  private async resolveBaseTeamPlayers(basePlayersData?: { id: string }[], systemId?: string): Promise<PlayerRankingType[]> {
    if (!basePlayersData?.length) return [];

    const players = await Player.find({
      where: {
        id: In(basePlayersData.map((p) => p.id)),
      },
      relations: ['rankingLastPlaces'],
    });

    const results = players.map((player) => {
      const ranking = player.rankingLastPlaces?.find((r) => r.systemId === systemId);

      return {
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        single: ranking?.single,
        double: ranking?.double,
        mix: ranking?.mix,
      } as PlayerRankingType;
    });

    return results.sort(sortPlayers);
  }
}
