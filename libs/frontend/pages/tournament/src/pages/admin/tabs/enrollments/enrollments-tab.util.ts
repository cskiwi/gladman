/** Longest member search the manual enrollment dialog accepts. */
export const MANUAL_PLAYER_SEARCH_MAX_LENGTH = 100;
/** Shortest member search that is sent to the API. */
export const MANUAL_PLAYER_SEARCH_MIN_LENGTH = 2;
/** Maximum number of suggestions shown. */
export const MANUAL_PLAYER_SEARCH_LIMIT = 20;
/** Page size used to scan candidates when words beyond the server-side limit are matched client-side. */
export const MANUAL_PLAYER_SEARCH_CANDIDATE_PAGE = 200;
/** Words beyond this are matched client-side (each extra word triples the server filter). */
export const MANUAL_PLAYER_SEARCH_SERVER_WORDS = 3;

const SEARCH_FIELDS = ['firstName', 'lastName', 'memberId'] as const;

type SearchField = (typeof SEARCH_FIELDS)[number];
type SearchFieldWhere = Partial<Record<SearchField, { ilike: string }>>;
type SearchWhere = { AND: SearchFieldWhere[] };

export interface SearchablePlayer {
  firstName?: string | null;
  lastName?: string | null;
  memberId?: string | null;
}

/** Split a raw search into words. */
export function searchWords(search: string): string[] {
  const query = search.trim();
  return query ? query.split(/\s+/) : [];
}

/** Escape LIKE wildcards so user input is matched literally. */
export function escapeLikePattern(word: string): string {
  return `%${word.replace(/[%_\\]/g, '\\$&')}%`;
}

/**
 * Build `players(args.where)` entries. Entries are OR-ed by the API, so "every word matches
 * first name, last name or member number" is expressed as the cross product of the field choices per word.
 * Each entry ANDs one condition per word, so two words on the same field (e.g. a double first name) both apply.
 */
export function buildPlayerSearchWhere(words: string[]): SearchWhere[] {
  let combinations: SearchFieldWhere[][] = [[]];
  for (const word of words.slice(0, MANUAL_PLAYER_SEARCH_SERVER_WORDS)) {
    const pattern = escapeLikePattern(word);
    combinations = combinations.flatMap((combination) =>
      SEARCH_FIELDS.map((field) => [...combination, { [field]: { ilike: pattern } } as SearchFieldWhere]),
    );
  }
  return combinations.filter((combination) => combination.length > 0).map((combination) => ({ AND: combination }));
}

/** Remaining words (beyond what the API filtered on) must all be found in a name or member number. */
export function matchesSearchWords(player: SearchablePlayer, words: string[]): boolean {
  return words.every((word) => {
    const needle = word.toLowerCase();
    return SEARCH_FIELDS.some((field) => (player[field] ?? '').toLowerCase().includes(needle));
  });
}
