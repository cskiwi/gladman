import { Player, RankingSystem } from '@app/models';
import { sortPlayers } from '@app/utils/sorts';
import { BadRequestException, Body, Controller, Injectable, PipeTransform, Post } from '@nestjs/common';
import { isArray, isBoolean, isString, isUUID } from 'class-validator';
import { In } from 'typeorm';
import { AssemblyInput } from '../inputs/assembly.input';
import { AssemblyOutput, PlayerRankingType } from '../services/assembly/assembly-output';
import { AssemblyValidationService } from '../services/assembly/assembly-validation.service';

export type AssemblyValidationResponse = Omit<AssemblyOutput, 'basePlayersData' | 'titularsPlayerData' | 'systemId'>;

const DEFAULT_RANKING_LEVEL = 12;
const OPTIONAL_ID_FIELDS = ['encounterId', 'systemId', 'captainId', 'single1', 'single2', 'single3', 'single4'] as const;
const ID_LIST_FIELDS = ['double1', 'double2', 'double3', 'double4', 'subtitudes'] as const;

/**
 * Validates the REST body against the shape the GraphQL `AssemblyInput` used to enforce
 * (UUID ids, id lists, optional description/isComplete), rejecting malformed bodies with HTTP 400.
 */
@Injectable()
export class AssemblyInputValidationPipe implements PipeTransform<unknown, AssemblyInput> {
  transform(value: unknown): AssemblyInput {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('Assembly body must be an object');
    }

    const body = value as Record<string, unknown>;
    const errors: string[] = [];

    if (!isUUID(body['teamId'])) {
      errors.push('teamId must be a UUID');
    }

    for (const field of OPTIONAL_ID_FIELDS) {
      if (body[field] != null && !isUUID(body[field])) {
        errors.push(`${field} must be a UUID`);
      }
    }

    for (const field of ID_LIST_FIELDS) {
      const list = body[field];
      if (list != null && (!isArray(list) || !list.every((id) => id == null || isUUID(id)))) {
        errors.push(`${field} must be a list of UUIDs`);
      }
    }

    if (body['description'] != null && !isString(body['description'])) {
      errors.push('description must be a string');
    }

    if (body['isComplete'] != null && !isBoolean(body['isComplete'])) {
      errors.push('isComplete must be a boolean');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return body as unknown as AssemblyInput;
  }
}

/**
 * Assembly rule validation is not database data, so it is served over REST instead of GraphQL.
 * Same (open) access as the former `validateAssembly` query.
 */
@Controller('assembly')
export class AssemblyController {
  constructor(private readonly assemblyValidationService: AssemblyValidationService) {}

  @Post('validate')
  async validate(@Body(AssemblyInputValidationPipe) assembly: AssemblyInput): Promise<AssemblyValidationResponse> {
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

    const [players, system] = await Promise.all([
      Player.find({
        where: {
          id: In(basePlayersData.map((p) => p.id)),
        },
        relations: ['rankingLastPlaces'],
      }),
      systemId ? RankingSystem.findOne({ where: { id: systemId } }) : Promise.resolve(null),
    ]);

    // Same fallback as AssemblyValidationService for players without a ranking in the system
    const defaultLevel = system?.amountOfLevels ?? DEFAULT_RANKING_LEVEL;

    const results = players.map((player) => {
      const ranking = player.rankingLastPlaces?.find((r) => r.systemId === systemId);

      return {
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        gender: player.gender,
        single: ranking?.single ?? defaultLevel,
        double: ranking?.double ?? defaultLevel,
        mix: ranking?.mix ?? defaultLevel,
      } as PlayerRankingType;
    });

    return results.sort(sortPlayers);
  }
}
