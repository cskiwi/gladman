import { TournamentEvent } from '@app/models';
import { Job, Queue } from 'bullmq';
import { And, In, LessThan, MoreThanOrEqual, Not } from 'typeorm';
import { JOB_TYPES, TournamentScrapeEventJobData, TournamentScrapeYearCleanupJobData, TournamentScrapeYearJobData } from '../../queues/sync.queue';
import { SyncService } from '../../services/sync.service';
import { TournamentScrapeService } from './tournament-scrape.service';

jest.mock('@app/models', () => ({ TournamentEvent: { findOne: jest.fn(), find: jest.fn() } }), { virtual: true });
jest.mock('../../services/sync.service', () => ({ SyncService: class {} }));
jest.mock('../../queues/sync.queue', () => ({
  TOURNAMENT_DISCOVERY_QUEUE: 'tournament-discovery',
  JOB_TYPES: { TOURNAMENT_SCRAPE_EVENT: 'tournament-scrape-event', TOURNAMENT_SCRAPE_YEAR_CLEANUP: 'tournament-scrape-year-cleanup' },
}));

const FIRST_CODE = '02DAFCDA-D862-49E3-ABA1-6459C0DB49CB';
const SECOND_CODE = '93DF96FD-5C27-44AA-AB95-D6B875606EB4';
const THIRD_CODE = '388E2991-D735-4A68-8CA5-19D13E62F4FD';
const ARCHIVE_URL = 'https://web.archive.org/web/20260511081137/https://www.badmintonvlaanderen.be';

function createArchivedRow(link: string, category = '1 - 12'): string {
  return `<tr><td>3 jan</td><td>${link}</td><td></td><td>${category}</td><td>Sports hall</td></tr>`;
}

function createArchivedCalendar(year: number, rows = createArchivedRow('<a href="../../calendarevent/123/Legacy">Legacy &amp; Club</a>')): string {
  const header = '<tr><th>Periode</th><th>Naam</th><th>Groep</th><th>Categorie</th><th>Plaats</th></tr>';
  return `<select id="ddlYear"><option value="2026">2026</option><option selected="selected" value="${year}">${year}</option></select><table id="tblEvents">${header}${rows}</table>`;
}

function createArchivedEvent(visualCode: string = FIRST_CODE): string {
  return `<table><tr><td><strong>Categorie:</strong></td><td>1 - 12</td></tr><tr><td>Toernooi link:</td><td><a href="https://badvla.tournamentsoftware.com/sport/tournament?id=${visualCode}">Tournament</a></td></tr></table>`;
}

function createRow(year: number, visualCode: string | null, category: string, name = 'Tournament &amp; Club'): string {
  const link: string = visualCode ? `data-href="https://badvla.tournamentsoftware.com/tournament/${visualCode}"` : '';
  return `<div class="row tornooi-card" ${link} data-year="${year}">
    <div class="col"><span class="label mobile">Datum:</span>3 jan</div>
    <div class="col"><a><span class="title"><span class="label mobile">Naam:</span>${name}</span></a></div>
    <div class="col"><span class="label mobile">Categorie:</span>${category}</div>
    <div class="col"><span class="label mobile">Plaats:</span>Sports hall</div>
  </div><script>document.querySelectorAll('.tornooi-card');</script>`;
}

function createCalendar(rows: string): string {
  return `<select class="tornooi-year"><option value="2026">2026</option><option value="2027">2027</option></select>${rows}`;
}

describe('TournamentScrapeService', () => {
  let service: TournamentScrapeService;
  let mockAdd: jest.Mock;
  let mockRecalc: jest.Mock;
  let mockProgress: jest.Mock;
  let mockFetch: jest.SpiedFunction<typeof fetch>;

  beforeEach(() => {
    mockAdd = jest.fn().mockResolvedValue(undefined);
    mockRecalc = jest.fn().mockResolvedValue(undefined);
    mockProgress = jest.fn().mockResolvedValue(undefined);
    service = new TournamentScrapeService(
      { add: mockAdd } as unknown as Queue,
      { queueTournamentRankingRecalc: mockRecalc } as unknown as SyncService,
    );
    mockFetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(createCalendar(createRow(2026, FIRST_CODE, '7 - 12'))));
    jest.mocked(TournamentEvent.find).mockResolvedValue([]);
    jest.mocked(TournamentEvent.findOne).mockResolvedValue(null);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('queues direct visual codes and categories across all months of only the requested year', async () => {
    const inputHtml: string = createCalendar(
      `<div class="maand-container" data-month="2026-01">${createRow(2026, FIRST_CODE.toLowerCase(), '7 &#8211; 12')}</div>` +
        `<div class="maand-container" data-month="2026-12">${createRow(2026, SECOND_CODE, 'Minibad - Jeugd')}</div>` +
        createRow(2026, FIRST_CODE, '7 &#8211; 12') +
        createRow(2026, null, '1 - 12') +
        createRow(2027, THIRD_CODE, '1 - 12'),
    );
    mockFetch.mockResolvedValue(new Response(inputHtml));
    await service.processScrapeYear({ data: { year: 2026 } } as Job<TournamentScrapeYearJobData>, mockProgress);
    expect(mockFetch).toHaveBeenCalledWith('https://badminton.vlaanderen/competitie/tornooien/', expect.any(Object));
    expect(mockAdd).toHaveBeenCalledTimes(3);
    expect(mockAdd).toHaveBeenNthCalledWith(
      1,
      JOB_TYPES.TOURNAMENT_SCRAPE_EVENT,
      expect.objectContaining({ year: 2026, visualCode: FIRST_CODE, category: '7 \u2013 12', eventName: 'Tournament & Club' }),
    );
    expect(mockAdd).toHaveBeenNthCalledWith(
      2,
      JOB_TYPES.TOURNAMENT_SCRAPE_EVENT,
      expect.objectContaining({ visualCode: SECOND_CODE, category: 'Minibad - Jeugd' }),
    );
    expect(mockAdd).toHaveBeenNthCalledWith(3, JOB_TYPES.TOURNAMENT_SCRAPE_YEAR_CLEANUP, expect.objectContaining({ year: 2026 }));
    expect(mockProgress).toHaveBeenLastCalledWith(100);
  });

  it.each([
    ['adding disabled', false, true, JOB_TYPES.TOURNAMENT_SCRAPE_YEAR_CLEANUP],
    ['cleanup disabled', true, false, JOB_TYPES.TOURNAMENT_SCRAPE_EVENT],
  ])('preserves job switches with %s', async (_label: string, runAdding: boolean, runCleanup: boolean, expectedType: string) => {
    await service.processScrapeYear({ data: { year: 2026, runAdding, runCleanup } } as Job<TournamentScrapeYearJobData>, mockProgress);
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd.mock.calls[0][0]).toBe(expectedType);
  });

  it.each(['tournament', 'league'])('accepts legacy sport/%s direct links', async (kind: string) => {
    mockFetch.mockResolvedValue(
      new Response(
        createCalendar(createRow(2026, FIRST_CODE, '1 - 12').replace(`/tournament/${FIRST_CODE}`, `/sport/${kind}?id=${FIRST_CODE.toLowerCase()}`)),
      ),
    );
    await service.processScrapeYear({ data: { year: 2026, runCleanup: false } } as Job<TournamentScrapeYearJobData>, mockProgress);
    expect(mockAdd).toHaveBeenCalledWith(JOB_TYPES.TOURNAMENT_SCRAPE_EVENT, expect.objectContaining({ visualCode: FIRST_CODE }));
  });

  it('ignores external registration links', async () => {
    const externalRow: string = createRow(2026, SECOND_CODE, 'Recreanten').replace(
      `https://badvla.tournamentsoftware.com/tournament/${SECOND_CODE}`,
      'https://forms.office.com/registration',
    );
    mockFetch.mockResolvedValue(new Response(createCalendar(createRow(2026, FIRST_CODE, '1 - 12') + externalRow)));
    await service.processScrapeYear({ data: { year: 2026, runCleanup: false } } as Job<TournamentScrapeYearJobData>, mockProgress);
    expect(mockAdd).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['unavailable year', '<select class="tornooi-year"><option value="2027">2027</option></select>'],
    ['unrecognized page', '<html>Error</html>'],
    ['no linked tournaments', createCalendar(createRow(2026, null, '1 - 12'))],
    ['conflicting categories', createCalendar(createRow(2026, FIRST_CODE, '1 - 12') + createRow(2026, FIRST_CODE, 'Jeugd'))],
    ['malformed row', createCalendar(`<div class="row tornooi-card" data-year="2026"></div><script></script>`)],
  ])('refuses cleanup with %s before querying the database', async (_label: string, inputHtml: string) => {
    mockFetch.mockResolvedValue(new Response(inputHtml));
    await expect(
      service.processScrapeYearCleanup({ data: { year: 2026 } } as Job<TournamentScrapeYearCleanupJobData>, mockProgress),
    ).rejects.toThrow();
    expect(TournamentEvent.find).not.toHaveBeenCalled();
    expect(mockRecalc).not.toHaveBeenCalled();
  });

  it('refuses cleanup on fetch failure', async () => {
    mockFetch.mockResolvedValue(new Response('', { status: 503 }));
    await expect(service.processScrapeYearCleanup({ data: { year: 2026 } } as Job<TournamentScrapeYearCleanupJobData>, mockProgress)).rejects.toThrow(
      'Failed to fetch',
    );
    expect(TournamentEvent.find).not.toHaveBeenCalled();
  });

  it.each([
    ['1 - 12', false, true, 'create'],
    ['7 \u2013 12', false, true, 'create'],
    ['Minibad - Jeugd', true, false, 'remove'],
    ['-11 -13', true, false, 'remove'],
    ['+35 +40', true, false, 'remove'],
    ['Recreanten', true, false, 'remove'],
  ])(
    'uses calendar category %s without fetching a tournament page',
    async (category: string, previousOfficial: boolean, expectedOfficial: boolean, expectedAction: string) => {
      const mockSave: jest.Mock = jest.fn().mockResolvedValue(undefined);
      const inputTournament: TournamentEvent = {
        id: 'database-id',
        name: 'Tournament',
        official: previousOfficial,
        save: mockSave,
      } as unknown as TournamentEvent;
      jest.mocked(TournamentEvent.findOne).mockResolvedValue(inputTournament);
      await service.processScrapeEvent(
        {
          data: {
            year: 2026,
            eventName: 'Tournament',
            eventUrl: `https://badvla.tournamentsoftware.com/tournament/${FIRST_CODE}`,
            visualCode: FIRST_CODE.toLowerCase(),
            category,
          },
        } as Job<TournamentScrapeEventJobData>,
        mockProgress,
      );
      expect(mockFetch).not.toHaveBeenCalled();
      expect(TournamentEvent.findOne).toHaveBeenCalledWith({ where: { visualCode: FIRST_CODE } });
      expect(inputTournament.official).toBe(expectedOfficial);
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockRecalc).toHaveBeenCalledWith(expect.objectContaining({ tournamentId: 'database-id', action: expectedAction }));
    },
  );

  it('does not recalculate an unchanged official status', async () => {
    const mockSave: jest.Mock = jest.fn();
    jest.mocked(TournamentEvent.findOne).mockResolvedValue({ name: 'Tournament', official: true, save: mockSave } as unknown as TournamentEvent);
    await service.processScrapeEvent(
      {
        data: { year: 2026, eventName: 'Tournament', eventUrl: `https://badvla.tournamentsoftware.com/tournament/${FIRST_CODE}`, category: '1 - 12' },
      } as Job<TournamentScrapeEventJobData>,
      mockProgress,
    );
    expect(mockSave).not.toHaveBeenCalled();
    expect(mockRecalc).not.toHaveBeenCalled();
  });

  it('rejects direct tournament jobs without a calendar category', async () => {
    await expect(
      service.processScrapeEvent(
        {
          data: { year: 2026, eventName: 'Tournament', eventUrl: `https://badvla.tournamentsoftware.com/tournament/${FIRST_CODE}` },
        } as Job<TournamentScrapeEventJobData>,
        mockProgress,
      ),
    ).rejects.toThrow('Missing calendar category');
    expect(TournamentEvent.findOne).not.toHaveBeenCalled();
  });

  it('preserves legacy queued calendar-event jobs', async () => {
    mockFetch.mockResolvedValue(
      new Response(
        `<a href="https://badvla.tournamentsoftware.com/sport/tournament?id=${FIRST_CODE}">Tournament</a><table><tr><td><strong>Categorie:</strong></td><td>1 - 12</td></tr></table>`,
      ),
    );
    await service.processScrapeEvent(
      {
        data: { year: 2026, eventName: 'Legacy', eventUrl: 'https://www.badmintonvlaanderen.be/calendarevent/123/Legacy' },
      } as Job<TournamentScrapeEventJobData>,
      mockProgress,
    );
    expect(mockFetch).toHaveBeenCalledWith(`${ARCHIVE_URL}/calendarevent/123/Legacy`, expect.any(Object));
    expect(TournamentEvent.findOne).toHaveBeenCalledWith({ where: { visualCode: FIRST_CODE } });
  });

  it('uses the archived calendar category without requiring it on the event page', async () => {
    const mockSave: jest.Mock = jest.fn().mockResolvedValue(undefined);
    const inputTournament: TournamentEvent = { id: 'database-id', name: 'Official', official: false, save: mockSave } as unknown as TournamentEvent;
    jest.mocked(TournamentEvent.findOne).mockResolvedValue(inputTournament);
    mockFetch.mockResolvedValue(new Response(`<a href="https://badvla.tournamentsoftware.com/sport/tournament?id=${FIRST_CODE}">Tournament</a>`));
    await service.processScrapeEvent(
      {
        data: {
          year: 2024,
          eventName: 'Official',
          eventUrl: `${ARCHIVE_URL}/calendarevent/123/Official`,
          category: '3 - 12',
        },
      } as Job<TournamentScrapeEventJobData>,
      mockProgress,
    );
    expect(inputTournament.official).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it.each([2023, 2024])('queues archived events for %s without visiting the modern site', async (year: number) => {
    const inputLinks: string =
      createArchivedRow('<a href="../../calendarevent/123/Legacy">Legacy &amp; Club</a>') +
      createArchivedRow('<a href="https://www.badmintonvlaanderen.be/calendarevent/123/Legacy">Duplicate</a>') +
      createArchivedRow('<a href="/web/20260412085326/https://www.badmintonvlaanderen.be/calendarevent/456/Other">Other</a>');
    mockFetch.mockResolvedValue(new Response(createArchivedCalendar(year, inputLinks)));
    await service.processScrapeYear({ data: { year } } as Job<TournamentScrapeYearJobData>, mockProgress);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(`${ARCHIVE_URL}/calendar/180/Tornooi-Kalender?year=${year}`, expect.any(Object));
    expect(mockAdd).toHaveBeenCalledTimes(3);
    expect(mockAdd).toHaveBeenCalledWith(
      JOB_TYPES.TOURNAMENT_SCRAPE_EVENT,
      expect.objectContaining({ year, eventUrl: `${ARCHIVE_URL}/calendarevent/456/Other` }),
    );
    expect(mockAdd).toHaveBeenCalledWith(JOB_TYPES.TOURNAMENT_SCRAPE_YEAR_CLEANUP, expect.objectContaining({ year }));
  });

  it('queues only official categories from the archived calendar', async () => {
    const inputRows: string =
      createArchivedRow('<a href="../../calendarevent/123/Official">Official</a>', '3 - 12') +
      createArchivedRow('<a href="../../calendarevent/456/Youth">Youth</a>', 'Minibad - Jeugd') +
      createArchivedRow('<a href="../../calendarevent/789/Veteran">Veteran</a>', '+35');
    mockFetch.mockResolvedValue(new Response(createArchivedCalendar(2024, inputRows)));
    await service.processScrapeYear({ data: { year: 2024, runCleanup: false } } as Job<TournamentScrapeYearJobData>, mockProgress);
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith(JOB_TYPES.TOURNAMENT_SCRAPE_EVENT, expect.objectContaining({ eventName: 'Official', category: '3 - 12' }));
  });

  it('falls back to the archive for 2025 when the modern calendar no longer lists it', async () => {
    mockFetch.mockResolvedValueOnce(new Response(createCalendar(''))).mockResolvedValueOnce(new Response(createArchivedCalendar(2025)));
    await service.processScrapeYear({ data: { year: 2025 } } as Job<TournamentScrapeYearJobData>, mockProgress);
    expect(mockFetch).toHaveBeenNthCalledWith(2, `${ARCHIVE_URL}/calendar/180/Tornooi-Kalender?year=2025`, expect.any(Object));
    expect(mockAdd).toHaveBeenCalledWith(
      JOB_TYPES.TOURNAMENT_SCRAPE_EVENT,
      expect.objectContaining({ eventUrl: `${ARCHIVE_URL}/calendarevent/123/Legacy` }),
    );
  });

  it('uses the modern calendar for 2025 when it is available', async () => {
    mockFetch.mockResolvedValue(
      new Response(
        createCalendar(createRow(2025, FIRST_CODE, '1 - 12')).replace('<option value="2026">2026</option>', '<option value="2025">2025</option>'),
      ),
    );
    await service.processScrapeYear({ data: { year: 2025 } } as Job<TournamentScrapeYearJobData>, mockProgress);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockAdd).toHaveBeenCalledWith(JOB_TYPES.TOURNAMENT_SCRAPE_EVENT, expect.objectContaining({ visualCode: FIRST_CODE }));
  });

  it.each([
    ['wrong replay year', createArchivedCalendar(2026)],
    ['missing calendar table', '<select id="ddlYear"><option value="2024" selected>2024</option></select>'],
    ['empty calendar', createArchivedCalendar(2024, '')],
  ])('rejects an archived calendar with %s before queueing or querying', async (_label: string, inputHtml: string) => {
    mockFetch.mockImplementation(async (): Promise<Response> => new Response(inputHtml));
    await expect(service.processScrapeYear({ data: { year: 2024 } } as Job<TournamentScrapeYearJobData>, mockProgress)).rejects.toThrow();
    expect(mockAdd).not.toHaveBeenCalled();
    await expect(
      service.processScrapeYearCleanup({ data: { year: 2024 } } as Job<TournamentScrapeYearCleanupJobData>, mockProgress),
    ).rejects.toThrow();
    expect(TournamentEvent.find).not.toHaveBeenCalled();
  });

  it('retries an archived calendar request after a 429 response using Retry-After', async () => {
    jest.useFakeTimers();
    mockFetch
      .mockResolvedValueOnce(new Response('', { status: 429, headers: { 'Retry-After': '1' } }))
      .mockResolvedValueOnce(new Response(createArchivedCalendar(2024)));
    const scrapePromise = service.processScrapeYear({ data: { year: 2024, runCleanup: false } } as Job<TournamentScrapeYearJobData>, mockProgress);
    await jest.advanceTimersByTimeAsync(1000);
    await expect(scrapePromise).resolves.toBeUndefined();
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockAdd).toHaveBeenCalledWith(JOB_TYPES.TOURNAMENT_SCRAPE_EVENT, expect.objectContaining({ eventName: 'Legacy & Club' }));
  });

  it('collects visual codes from every archived event before cleanup', async () => {
    const inputRows =
      createArchivedRow('<a href="../../calendarevent/123/Legacy">Legacy</a>') +
      createArchivedRow('<a href="../../calendarevent/456/Youth">Youth</a>', 'Minibad - Jeugd') +
      createArchivedRow('<a href="../../calendarevent/789/Other">Other</a>');
    mockFetch
      .mockResolvedValueOnce(new Response(createArchivedCalendar(2024, inputRows)))
      .mockResolvedValueOnce(new Response(createArchivedEvent(FIRST_CODE)))
      .mockResolvedValueOnce(new Response(createArchivedEvent(SECOND_CODE)));
    await service.processScrapeYearCleanup({ data: { year: 2024 } } as Job<TournamentScrapeYearCleanupJobData>, mockProgress);
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch).toHaveBeenNthCalledWith(3, `${ARCHIVE_URL}/calendarevent/789/Other`, expect.any(Object));
    expect(TournamentEvent.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ visualCode: Not(In([FIRST_CODE, SECOND_CODE])) }) }),
    );
  });

  it.each([
    ['unavailable event', '', 404],
    ['rate-limited event', '', 429],
    ['missing tournament link', '<html>Archive error</html>', 200],
    ['no visual codes', '<td>no tournament IDs</td>', 200],
  ])('refuses archived cleanup with %s', async (_label: string, html: string, status: number) => {
    mockFetch
      .mockResolvedValueOnce(new Response(createArchivedCalendar(2024)))
      .mockResolvedValue(new Response(html, { status, headers: status === 429 ? { 'Retry-After': '0' } : undefined }));
    await expect(
      service.processScrapeYearCleanup({ data: { year: 2024 } } as Job<TournamentScrapeYearCleanupJobData>, mockProgress),
    ).rejects.toThrow();
    if (status === 429) {
      expect(mockFetch).toHaveBeenCalledTimes(4);
    }
    expect(TournamentEvent.find).not.toHaveBeenCalled();
    expect(mockRecalc).not.toHaveBeenCalled();
  });

  it('accepts an explicitly empty archived category as unofficial', async () => {
    const mockSave: jest.Mock = jest.fn().mockResolvedValue(undefined);
    const inputTournament: TournamentEvent = { id: 'database-id', name: 'Legacy', official: true, save: mockSave } as unknown as TournamentEvent;
    jest.mocked(TournamentEvent.findOne).mockResolvedValue(inputTournament);
    mockFetch.mockResolvedValue(new Response(createArchivedEvent().replace('>1 - 12</td>', '>&nbsp;</td>')));
    await service.processScrapeEvent(
      { data: { year: 2024, eventName: 'Legacy', eventUrl: `${ARCHIVE_URL}/calendarevent/123/Legacy` } } as Job<TournamentScrapeEventJobData>,
      mockProgress,
    );
    expect(inputTournament.official).toBe(false);
    expect(mockRecalc).toHaveBeenCalledWith(expect.objectContaining({ action: 'remove' }));
  });

  it('cleans up using year-scoped visual codes and an exclusive next-year boundary', async () => {
    const mockSave: jest.Mock = jest.fn().mockResolvedValue(undefined);
    const inputTournament: TournamentEvent = {
      id: 'missing-id',
      name: 'Missing',
      visualCode: SECOND_CODE,
      official: true,
      save: mockSave,
    } as unknown as TournamentEvent;
    jest.mocked(TournamentEvent.find).mockResolvedValue([inputTournament]);
    mockFetch.mockResolvedValue(new Response(createCalendar(createRow(2026, FIRST_CODE, '1 - 12') + createRow(2027, THIRD_CODE, '1 - 12'))));
    await service.processScrapeYearCleanup({ data: { year: 2026 } } as Job<TournamentScrapeYearCleanupJobData>, mockProgress);
    const actualWhere = jest.mocked(TournamentEvent.find).mock.calls[0][0]?.where;
    expect(actualWhere).toEqual(
      expect.objectContaining({
        official: true,
        visualCode: Not(In([FIRST_CODE])),
        firstDay: And(MoreThanOrEqual(new Date(2026, 0, 1)), LessThan(new Date(2027, 0, 1))),
      }),
    );
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(inputTournament.official).toBe(false);
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockRecalc).toHaveBeenCalledWith(expect.objectContaining({ tournamentId: 'missing-id', action: 'remove' }));
  });
});
