import {
  And,
  Between,
  Equal,
  FindOperator,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Raw,
} from 'typeorm';

export interface GraphQLWhereInput<T> {
  OR?: GraphQLWhereInput<T>[];
  AND?: GraphQLWhereInput<T>[];
  [field: string]: any;
}

export class GraphQLWhereConverter {
  static convert<T>(where: GraphQLWhereInput<T> | GraphQLWhereInput<T>[]): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
    if (!where) {
      return {} as FindOptionsWhere<T>;
    }

    // Handle array input - convert each item and flatten
    if (Array.isArray(where)) {
      const results = where.map((item) => this.convert<T>(item));
      // If any result is an array, we need to flatten appropriately
      const flattened = results.flatMap((result) => (Array.isArray(result) ? result : [result]));
      return flattened.length === 1 ? flattened[0] : flattened;
    }

    // Handle OR logical operator
    if (where.OR && Array.isArray(where.OR)) {
      const result = where.OR.map((condition) => {
        const converted = this.convert<T>(condition);
        return Array.isArray(converted) ? converted[0] : converted;
      }) as FindOptionsWhere<T>[];
      return result;
    }

    // Handle AND logical operator
    if (where.AND && Array.isArray(where.AND)) {
      const merged: Record<string, any> = {};
      where.AND.forEach((condition) => {
        const result = this.convert<T>(condition);
        const resultObj = Array.isArray(result) ? result[0] : result;
        this.mergeAnd(merged, resultObj as Record<string, any>);
      });
      return merged as FindOptionsWhere<T>;
    }

    // Handle regular field conditions
    const result: Record<string, any> = {};

    Object.entries(where).forEach(([field, value]) => {
      // Skip logical operators
      if (field === 'OR' || field === 'AND') {
        return;
      }

      result[field] = this.convertValue(value);
    });

    return result as FindOptionsWhere<T>;
  }

  /**
   * Merge an AND condition into the accumulated where object. Conditions on the same field are
   * combined with `And(...)` (instead of overwriting), nested relation objects are merged recursively.
   */
  private static mergeAnd(target: Record<string, any>, source: Record<string, any>): void {
    for (const [key, value] of Object.entries(source ?? {})) {
      if (!(key in target)) {
        target[key] = value;
        continue;
      }

      const existing = target[key];
      if (this.isRelationObject(existing) && this.isRelationObject(value)) {
        this.mergeAnd(existing, value);
        continue;
      }

      target[key] = And(this.toOperator(existing), this.toOperator(value));
    }
  }

  private static isRelationObject(value: unknown): value is Record<string, any> {
    return !!value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof FindOperator) && !(value instanceof Date);
  }

  private static toOperator(value: unknown): FindOperator<any> {
    return value instanceof FindOperator ? value : Equal(value);
  }

  private static convertValue(value: any): any {
    // Simple value (string, number, boolean, null)
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      return value;
    }

    // Check if it's an operator object (contains typed operators)
    const keys = Object.keys(value);
    const typedOperators = ['eq', 'ne', 'in', 'nin', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'between', 'isNull', 'raw'];

    if (keys.length === 1 && typedOperators.includes(keys[0])) {
      return this.convertOperator(keys[0], value[keys[0]]);
    }

    // Multiple operators on same field (e.g. { gte: a, lt: b }) are combined with AND
    if (keys.length > 1 && keys.every((key) => typedOperators.includes(key))) {
      const operators = keys.map((key) => {
        const converted = this.convertOperator(key, value[key]);
        return converted instanceof FindOperator ? converted : Equal(converted);
      });
      return And(...operators);
    }

    // Check if nested object contains AND/OR logical operators (relation with complex query)
    // Use convert() to properly handle these logical operators within nested relations
    if (value.AND || value.OR) {
      const converted = this.convert(value);
      return Array.isArray(converted) ? converted[0] : converted;
    }

    // Check if it's a nested object (relation fields)
    // Convert each field recursively
    const converted: Record<string, any> = {};
    Object.entries(value).forEach(([key, val]) => {
      converted[key] = this.convertValue(val);
    });
    return converted;
  }

  private static convertOperator(operator: string, operatorValue: any): any {
    switch (operator) {
      case 'eq':
        return operatorValue;

      case 'ne':
        return Not(operatorValue);

      case 'in':
        return In(operatorValue);

      case 'nin':
        return Not(In(operatorValue));

      case 'gt':
        return MoreThan(operatorValue);

      case 'gte':
        return MoreThanOrEqual(operatorValue);

      case 'lt':
        return LessThan(operatorValue);

      case 'lte':
        return LessThanOrEqual(operatorValue);

      case 'like':
        return Like(operatorValue);

      case 'ilike':
        return ILike(operatorValue);

      case 'between':
        return Between(operatorValue[0], operatorValue[1]);

      case 'isNull':
        return operatorValue ? IsNull() : Not(IsNull());

      case 'raw':
        return Raw(operatorValue);

      default:
        // Unknown operator, return the value as-is
        return operatorValue;
    }
  }
}
