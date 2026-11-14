export class AssemblyValidationError {
  declare message?: string;
  declare params?: Record<string, unknown>;
}

export class PlayerRankingType {
  declare id: string;
  declare firstName?: string;
  declare lastName?: string;
  declare gender?: 'M' | 'F';
  declare single?: number;
  declare double?: number;
  declare mix?: number;
}

/**
 * Result of validating an assembly. Served over REST (POST /api/v1/assembly/validate),
 * not part of the GraphQL graph.
 */
export class AssemblyOutput {
  declare errors?: AssemblyValidationError[];
  declare warnings?: AssemblyValidationError[];
  declare valid: boolean;
  declare baseTeamIndex?: number;
  declare titularsIndex?: number;
  declare baseTeamPlayers?: PlayerRankingType[];
  declare titularsPlayers?: PlayerRankingType[];

  // Internal fields used to resolve baseTeamPlayers (stripped from the REST response)
  titularsPlayerData?: { id: string }[];
  basePlayersData?: { id: string }[];
  systemId?: string;
}
