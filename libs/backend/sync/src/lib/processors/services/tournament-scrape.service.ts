import { TournamentEvent } from '@app/models';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { And, In, LessThan, MoreThanOrEqual, Not } from 'typeorm';
import {
  JOB_TYPES,
  TOURNAMENT_DISCOVERY_QUEUE,
  TournamentScrapeEventJobData,
  TournamentScrapeYearCleanupJobData,
  TournamentScrapeYearJobData,
} from '../../queues/sync.queue';
import { SyncService } from '../../services/sync.service';

const BASE_URL = 'https://badminton.vlaanderen';
const CALENDAR_PATH = '/competitie/tornooien/';
const LEGACY_BASE_URL = 'https://www.badmintonvlaanderen.be';
const LEGACY_CALENDAR_PATH = '/calendar/180/Tornooi-Kalender';
const ARCHIVE_BASE_URL = 'https://web.archive.org/web/20260511081137';
const FIRST_MODERN_CALENDAR_YEAR = 2025;
const MAX_RATE_LIMIT_RETRIES = 2;
const FIRST_RATE_LIMIT_RETRY_DELAY_MS = 10_000;
const SECOND_RATE_LIMIT_RETRY_DELAY_MS = 30_000;

interface CalendarEvent {
  eventUrl: string;
  eventName: string;
  category: string;
}

interface CalendarTournament extends CalendarEvent {
  visualCode: string;
}

interface CalendarRow {
  attributes: string;
  content: string;
}

interface ScrapedEventDetails {
  visualCodes: string[];
  category: string | null;
}

@Injectable()
export class TournamentScrapeService {
  private readonly logger = new Logger(TournamentScrapeService.name);

  constructor(
    @InjectQueue(TOURNAMENT_DISCOVERY_QUEUE)
    private readonly discoveryQueue: Queue,
    private readonly syncService: SyncService,
  ) {}

  async processScrapeYear(job: Job<TournamentScrapeYearJobData>, updateProgress: (progress: number) => Promise<void>): Promise<void> {
    const { year, runAdding = true, runCleanup = true } = job.data;

    await updateProgress(0);
    this.logger.log(`Scraping calendar for year ${year} (runAdding=${runAdding}, runCleanup=${runCleanup})`);

    const events: (CalendarEvent | CalendarTournament)[] = await this.fetchCalendarEvents(year);
    this.logger.log(`Found ${events.length} calendar events for ${year}`);
    const eventsToQueue = events.filter(
      (event: CalendarEvent | CalendarTournament): boolean => 'visualCode' in event || this.parseOfficialCategory(event.category).official,
    );

    await updateProgress(10);

    if (runAdding) {
      for (let i = 0; i < eventsToQueue.length; i++) {
        const event: CalendarEvent | CalendarTournament = eventsToQueue[i];
        await this.discoveryQueue.add(JOB_TYPES.TOURNAMENT_SCRAPE_EVENT, {
          year,
          ...event,
          metadata: { displayName: `Scrape event: ${event.eventName}`, eventName: event.eventName },
        } satisfies TournamentScrapeEventJobData);

        await updateProgress(10 + Math.round(((i + 1) / eventsToQueue.length) * 90));
      }

      this.logger.log(`Queued ${eventsToQueue.length} event scrape jobs for year ${year}`);
    } else {
      this.logger.log(`Skipping event adding for year ${year} (runAdding=false)`);
    }

    if (runCleanup) {
      await this.discoveryQueue.add(JOB_TYPES.TOURNAMENT_SCRAPE_YEAR_CLEANUP, {
        year,
        metadata: { displayName: `Cleanup missing tournaments for ${year}` },
      } satisfies TournamentScrapeYearCleanupJobData);
    } else {
      this.logger.log(`Skipping cleanup for year ${year} (runCleanup=false)`);
    }

    await updateProgress(100);
  }

  async processScrapeEvent(job: Job<TournamentScrapeEventJobData>, updateProgress: (progress: number) => Promise<void>): Promise<void> {
    const { eventUrl, eventName, year } = job.data;

    await updateProgress(0);
    this.logger.log(`Scraping event: ${eventName} (${eventUrl})`);

    const { visualCodes, category } = await this.fetchEventDetails(job.data);
    await updateProgress(50);

    if (visualCodes.length === 0) {
      this.logger.debug(`No tournament IDs found for event: ${eventName}`);
      await updateProgress(100);
      return;
    }

    const { official, levelMin, levelMax } = this.parseOfficialCategory(category);
    const levelDescription: string = official ? ` (levels ${levelMin}-${levelMax})` : '';

    this.logger.log(`Event "${eventName}" (${year}): ${visualCodes.length} tournament(s), official=${official}${levelDescription}`);

    for (const visualCode of visualCodes) {
      await this.updateTournamentOfficialStatus(visualCode, official, eventName);
    }

    await updateProgress(100);
  }

  async processScrapeYearCleanup(job: Job<TournamentScrapeYearCleanupJobData>, updateProgress: (progress: number) => Promise<void>): Promise<void> {
    const { year } = job.data;

    await updateProgress(0);
    this.logger.log(`Running cleanup for year ${year}: finding tournaments not on calendar`);

    const calendarVisualCodes: Set<string> = await this.fetchCalendarVisualCodes(year);
    this.logger.log(`Cleanup: calendar references ${calendarVisualCodes.size} unique tournament(s) for ${year}`);
    await updateProgress(90);

    // Find official TournamentEvents in this year whose visualCode is NOT on the calendar
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);
    const dbTournaments = await TournamentEvent.find({
      where: {
        firstDay: And(MoreThanOrEqual(startOfYear), LessThan(startOfNextYear)),
        official: true,
        visualCode: Not(In([...calendarVisualCodes])),
      },
      select: ['id', 'visualCode', 'name', 'official'],
    });

    this.logger.log(`Cleanup: found ${dbTournaments.length} official tournament(s) in DB for ${year} not on calendar`);

    let markedCount = 0;
    for (const tournament of dbTournaments) {
      this.logger.log(`Cleanup: marking "${tournament.name}" (${tournament.visualCode ?? 'no code'}) for removal — not on ${year} calendar`);
      tournament.official = false;
      await tournament.save();
      markedCount++;

      await this.syncService.queueTournamentRankingRecalc({
        tournamentId: tournament.id,
        action: 'remove',
        metadata: {
          displayName: `Ranking point remove for ${tournament.name} (not on ${year} calendar)`,
          eventName: tournament.name,
        },
      });
    }

    this.logger.log(`Cleanup: marked ${markedCount} tournament(s) for removal for year ${year}`);
    await updateProgress(100);
  }

  private async fetchEventDetails(data: TournamentScrapeEventJobData): Promise<ScrapedEventDetails> {
    const { eventUrl, eventName, category, visualCode } = data;
    const visualCodes: string[] = visualCode ? [visualCode.toUpperCase()] : this.extractTournamentIds(eventUrl);
    if (category !== undefined) {
      if (visualCodes.length > 0) {
        return { visualCodes, category };
      }
      const details: ScrapedEventDetails = await this.fetchLegacyEventDetails(eventUrl, false);
      return { visualCodes: details.visualCodes, category };
    }
    if (visualCodes.length > 0) {
      throw new Error(`Missing calendar category for tournament: ${eventName}`);
    }
    return this.fetchLegacyEventDetails(eventUrl);
  }

  private async fetchLegacyEventDetails(eventUrl: string, includeCategory = true): Promise<ScrapedEventDetails> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const archivedUrl: string = this.createArchivedEventUrl(eventUrl);
    const html: string | null = await this.fetchPage(archivedUrl);
    if (!html) {
      throw new Error(`Could not fetch archived event page: ${archivedUrl}`);
    }
    const category: string | null = includeCategory ? this.extractFieldValue(html, 'Categorie') : null;
    if (includeCategory && category === null) {
      throw new Error(`Missing category on archived event page: ${archivedUrl}`);
    }
    return {
      visualCodes: this.extractTournamentIds(html),
      category,
    };
  }

  private async updateTournamentOfficialStatus(visualCode: string, official: boolean, eventName: string): Promise<void> {
    const tournament: TournamentEvent | null = await TournamentEvent.findOne({ where: { visualCode } });
    if (!tournament) {
      this.logger.debug(`Tournament not found in DB: ${visualCode} (${eventName})`);
      return;
    }
    if (tournament.official === official) {
      this.logger.debug(`Tournament "${tournament.name}" official status already correct (${official})`);
      return;
    }
    const previousOfficial: boolean = tournament.official;
    tournament.official = official;
    await tournament.save();
    this.logger.log(`Updated "${tournament.name}" official: ${previousOfficial} → ${official}`);
    const action: 'create' | 'remove' = official ? 'create' : 'remove';
    await this.syncService.queueTournamentRankingRecalc({
      tournamentId: tournament.id,
      action,
      metadata: {
        displayName: `Ranking point ${action} for ${tournament.name}`,
        eventName: tournament.name,
      },
    });
  }

  private async fetchPage(url: string): Promise<string | null> {
    try {
      for (let attempt = 0; attempt <= MAX_RATE_LIMIT_RETRIES; attempt++) {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
        });
        if (response.ok) {
          return await response.text();
        }
        if (response.status !== 429 || attempt === MAX_RATE_LIMIT_RETRIES) {
          this.logger.error(`Failed to fetch ${url}: ${response.status}`);
          return null;
        }
        const retryDelayMs: number = this.getRateLimitRetryDelayMs(response.headers.get('Retry-After'), attempt);
        this.logger.warn(`Rate limited fetching ${url}; retrying in ${retryDelayMs}ms`);
        await new Promise<void>((resolve) => setTimeout(resolve, retryDelayMs));
      }
    } catch (error) {
      this.logger.error(`Error fetching ${url}: ${error instanceof Error ? error.message : error}`);
    }
    return null;
  }

  private getRateLimitRetryDelayMs(retryAfter: string | null, retryIndex: number): number {
    if (retryAfter !== null && retryAfter.trim() !== '') {
      const retryAfterSeconds = Number(retryAfter);
      if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0) {
        return retryAfterSeconds * 1000;
      }
      const retryAfterTimestamp: number = Date.parse(retryAfter);
      if (Number.isFinite(retryAfterTimestamp)) {
        return Math.max(0, retryAfterTimestamp - Date.now());
      }
    }
    return retryIndex === 0 ? FIRST_RATE_LIMIT_RETRY_DELAY_MS : SECOND_RATE_LIMIT_RETRY_DELAY_MS;
  }

  private async fetchCalendarEvents(year: number): Promise<(CalendarEvent | CalendarTournament)[]> {
    if (year < FIRST_MODERN_CALENDAR_YEAR) {
      return this.fetchArchivedCalendarEvents(year);
    }
    const html: string | null = await this.fetchPage(`${BASE_URL}${CALENDAR_PATH}`);
    if (!html) {
      throw new Error(`Failed to fetch calendar page for year ${year}`);
    }
    if (year === FIRST_MODERN_CALENDAR_YEAR && !this.hasCalendarYear(html, year)) {
      return this.fetchArchivedCalendarEvents(year);
    }
    return this.extractCalendarTournaments(html, year);
  }

  private async fetchCalendarVisualCodes(year: number): Promise<Set<string>> {
    const events: (CalendarEvent | CalendarTournament)[] = await this.fetchCalendarEvents(year);
    const visualCodes: Set<string> = new Set();
    for (const event of events) {
      if ('visualCode' in event) {
        visualCodes.add(event.visualCode);
        continue;
      }
      if (!this.parseOfficialCategory(event.category).official) {
        continue;
      }
      const details: ScrapedEventDetails = await this.fetchLegacyEventDetails(event.eventUrl, false);
      for (const visualCode of details.visualCodes) {
        visualCodes.add(visualCode);
      }
    }
    if (visualCodes.size === 0) {
      throw new Error(`No tournament visual codes found for year ${year}; refusing cleanup`);
    }
    return visualCodes;
  }

  private async fetchArchivedCalendarEvents(year: number): Promise<CalendarEvent[]> {
    const calendarUrl = `${ARCHIVE_BASE_URL}/${LEGACY_BASE_URL}${LEGACY_CALENDAR_PATH}?year=${year}`;
    this.logger.log(`Using archived calendar for year ${year}: ${calendarUrl}`);
    const html: string | null = await this.fetchPage(calendarUrl);
    if (!html) {
      throw new Error(`Failed to fetch archived calendar for year ${year}`);
    }
    return this.extractArchivedCalendarEvents(html, year);
  }

  private extractArchivedCalendarEvents(html: string, year: number): CalendarEvent[] {
    this.ensureArchivedCalendarYear(html, year);
    const calendarTable: string | undefined = /<table\b[^>]*\bid=["']tblEvents["'][^>]*>([\s\S]*?)<\/table>/i.exec(html)?.[1];
    if (!calendarTable) {
      throw new Error(`Missing event table on archived calendar for year ${year}`);
    }
    const tableRows: string[] = [...calendarTable.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((match: RegExpExecArray): string => match[1]);
    const rowCells: string[][] = tableRows.map((row: string): string[] =>
      [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((match: RegExpExecArray): string => match[1]),
    );
    const categoryHeader: string[] | undefined = rowCells.find((cells: string[]): boolean =>
      cells.some((cell: string): boolean => this.extractCalendarText(cell).replace(/:$/, '').toLowerCase() === 'categorie'),
    );
    const categoryColumnIndex: number =
      categoryHeader?.findIndex((cell: string): boolean => this.extractCalendarText(cell).replace(/:$/, '').toLowerCase() === 'categorie') ?? -1;
    if (categoryColumnIndex < 0) {
      throw new Error(`Missing category column on archived calendar for year ${year}`);
    }
    const eventPattern = /<a\b[^>]*href=["']([^"']*\/calendarevent\/\d+\/[^"']*)["'][^>]*>([\s\S]*?)<\/a>/i;
    const events: Map<string, CalendarEvent> = new Map();
    for (const [index, row] of tableRows.entries()) {
      const match: RegExpExecArray | null = eventPattern.exec(row);
      if (!match) {
        continue;
      }
      const categoryCell: string | undefined = rowCells[index][categoryColumnIndex];
      if (categoryCell === undefined) {
        throw new Error(`Missing event category on archived calendar for year ${year}`);
      }
      const eventUrl: string = this.createArchivedEventUrl(match[1]);
      const eventName: string = this.extractCalendarText(match[2]);
      const category: string = this.extractCalendarText(categoryCell);
      const previousEvent: CalendarEvent | undefined = events.get(eventUrl);
      if (previousEvent && previousEvent.category !== category) {
        throw new Error(`Conflicting categories for archived event ${eventUrl}`);
      }
      events.set(eventUrl, { eventUrl, eventName, category });
    }
    if (events.size === 0) {
      throw new Error(`No events found on archived calendar for year ${year}`);
    }
    return [...events.values()];
  }

  private ensureArchivedCalendarYear(html: string, year: number): void {
    const yearSelector: string | undefined = /<select\b[^>]*\bid=["']ddlYear["'][^>]*>([\s\S]*?)<\/select>/i.exec(html)?.[1];
    const selectedOption: string | undefined = /<option\b([^>]*\bselected\b[^>]*)>/i.exec(yearSelector ?? '')?.[1];
    const selectedYear: string | undefined = /\bvalue=["'](\d{4})["']/i.exec(selectedOption ?? '')?.[1];
    if (selectedYear !== String(year)) {
      throw new Error(`Archived calendar does not show requested year ${year}; refusing to process an incomplete calendar`);
    }
  }

  private createArchivedEventUrl(eventUrl: string): string {
    const eventPath: string | undefined = /\/calendarevent\/\d+\/[^"'?#\s<>]+/i.exec(eventUrl)?.[0];
    if (!eventPath) {
      throw new Error(`Unrecognized calendar event URL: ${eventUrl}`);
    }
    return `${ARCHIVE_BASE_URL}/${LEGACY_BASE_URL}${eventPath}`;
  }

  private extractCalendarTournaments(html: string, year: number): CalendarTournament[] {
    this.ensureCalendarOffersYear(html, year);
    const tournaments: Map<string, CalendarTournament> = new Map();
    for (const row of this.extractCalendarRows(html, year)) {
      const tournament: CalendarTournament | null = this.parseCalendarRow(row, year);
      if (!tournament) {
        continue;
      }
      const previousTournament: CalendarTournament | undefined = tournaments.get(tournament.visualCode);
      if (previousTournament && previousTournament.category !== tournament.category) {
        throw new Error(`Conflicting categories for tournament ${tournament.visualCode}`);
      }
      tournaments.set(tournament.visualCode, tournament);
    }
    if (tournaments.size === 0) {
      throw new Error(`No linked tournaments found for year ${year}`);
    }
    return [...tournaments.values()];
  }

  private ensureCalendarOffersYear(html: string, year: number): void {
    if (!this.hasCalendarYear(html, year)) {
      throw new Error(`Calendar does not offer year ${year}; refusing to process an incomplete calendar`);
    }
  }

  private hasCalendarYear(html: string, year: number): boolean {
    const yearSelector: string | undefined = /<select\b[^>]*class=["'][^"']*\btornooi-year\b[^"']*["'][^>]*>([\s\S]*?)<\/select>/i.exec(html)?.[1];
    const yearOptionPattern = new RegExp(String.raw`<option\b[^>]*value=["']${year}["']`);
    return yearSelector !== undefined && yearOptionPattern.test(yearSelector);
  }

  private extractCalendarRows(html: string, year: number): CalendarRow[] {
    const rowPattern = /<div\b([^>]*class=["'][^"']*\btornooi-card\b[^"']*["'][^>]*)>/gi;
    const yearPattern = new RegExp(String.raw`\bdata-year=["']${year}["']`);
    const rowHeaders: RegExpExecArray[] = [...html.matchAll(rowPattern)];
    const rows: CalendarRow[] = [];
    for (const [index, header] of rowHeaders.entries()) {
      const attributes: string = header[1];
      if (!yearPattern.test(attributes)) {
        continue;
      }
      const contentStart: number = header.index + header[0].length;
      const contentEnd: number | undefined = rowHeaders[index + 1]?.index;
      const content: string = html.slice(contentStart, contentEnd).split(/<script\b/i)[0];
      rows.push({ attributes, content });
    }
    return rows;
  }

  private parseCalendarRow(row: CalendarRow, year: number): CalendarTournament | null {
    const columnPattern = /<div\b[^>]*class=["'][^"']*\bcol\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
    const columns: string[] = [...row.content.matchAll(columnPattern)].map((match: RegExpExecArray): string => match[1]);
    if (columns.length < 4) {
      throw new Error(`Unrecognized tournament row for year ${year}`);
    }
    const eventUrl: string | undefined = /\bdata-href=["']([^"']+)["']/i.exec(row.attributes)?.[1];
    if (!eventUrl || !new URL(eventUrl).hostname.endsWith('.tournamentsoftware.com')) {
      return null;
    }
    const visualCode: string | undefined = this.extractTournamentIds(eventUrl)[0];
    if (!visualCode) {
      throw new Error(`Unrecognized tournament link: ${eventUrl}`);
    }
    const [, nameColumn, categoryColumn] = columns;
    return {
      eventUrl,
      visualCode,
      eventName: this.extractCalendarText(nameColumn),
      category: this.extractCalendarText(categoryColumn),
    };
  }

  private extractCalendarText(html: string): string {
    return html
      .replace(/<span\b[^>]*class=["'][^"']*\blabel\b[^"']*["'][^>]*>[\s\S]*?<\/span>/gi, '')
      .replace(/<[^<>]*>/g, '')
      .replace(/&#(x[\da-f]+|\d+);/gi, (_entity: string, code: string): string =>
        String.fromCodePoint(code.toLowerCase().startsWith('x') ? Number.parseInt(code.slice(1), 16) : Number(code)),
      )
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&apos;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractTournamentIds(html: string): string[] {
    const pattern =
      /(?:sport\/(?:tournament|league)\?id=|(?:tournament|league)\/)([A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12})(?![A-F0-9-])/gi;
    const ids: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(html)) !== null) {
      ids.push(match[1].toUpperCase());
    }

    return [...new Set(ids)];
  }

  private extractFieldValue(html: string, fieldName: string): string | null {
    const pattern = new RegExp(String.raw`<strong>${fieldName}:?[^<]*<\/strong>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>`, 'i');
    const match = pattern.exec(html);
    return match ? this.extractCalendarText(match[1]) : null;
  }

  private parseOfficialCategory(category: string | null): {
    official: boolean;
    levelMin: number | null;
    levelMax: number | null;
  } {
    if (!category) return { official: false, levelMin: null, levelMax: null };

    // Youth (-11, -13) and veteran (+35, +40) categories — not official
    if (/(?:^|\s)[+-]\d/.test(category)) return { official: false, levelMin: null, levelMax: null };

    const levels: number[] = [...category.matchAll(/\d+/g)].map((match: RegExpExecArray): number => Number(match[0]));
    const hasInvalidLevel: boolean = levels.some((level: number): boolean => level < 1 || level > 12);
    if (levels.length === 0 || hasInvalidLevel) return { official: false, levelMin: null, levelMax: null };

    return { official: true, levelMin: Math.min(...levels), levelMax: Math.max(...levels) };
  }
}
