import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { ConfirmationService } from 'primeng/api';
import { print } from 'graphql';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { ScheduleTabComponent } from './schedule-tab.component';
import { localDayRange } from './schedule-result.util';

describe('Scheduling read feedback', () => {
  let fixture: ComponentFixture<ScheduleTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const empty = { data: { slots: [], memberships: [], unscheduledGames: [] } };
  const noCourts = { data: { courts: [] } };

  beforeEach(async () => {
    // The native scrollable table observes its size; jsdom has no ResizeObserver.
    globalThis.ResizeObserver ??= jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    })) as unknown as typeof ResizeObserver;

    // The courts of the tournament venues are a second, dependent read; everything else is one document.
    query = jest.fn((options: { query: Parameters<typeof print>[0] }) =>
      print(options.query).includes('TournamentScheduleCourts') ? of(noCourts) : of(empty),
    );
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [ScheduleTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(ScheduleTabComponent);
    fixture.componentRef.setInput('tournament', { id: 'safe-tournament' });
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  afterEach(() => expect(mutate).not.toHaveBeenCalled());

  it.each(['en', 'nl_BE', 'fr_BE'])('renders a named, semantic, noninteractive zero summary in %s', async (locale) => {
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale);
    await settle();
    const summary: HTMLElement = fixture.nativeElement.querySelector('[data-testid="schedule-summary"]');
    const copy = dictionary.tournament.admin.schedule;
    expect(summary.tagName).toBe('P-PANEL');
    expect(summary.querySelector('.p-panel-title')?.textContent).toBe(copy.title);
    expect(summary.querySelector('[role="region"]')?.getAttribute('aria-labelledby')).toBe(summary.querySelector('.p-panel-title')?.id);
    expect(summary.querySelectorAll('dl > div')).toHaveLength(6);
    fixture.componentInstance.summaryItems.forEach((item, index) => {
      expect(copy[item.key].trim()).not.toBe('');
      expect(copy[item.description].trim()).not.toBe('');
      const row = summary.querySelectorAll('dl > div')[index];
      expect(row.querySelector('dt')?.textContent?.trim()).toBe(copy[item.key]);
      expect(Array.from(row.querySelectorAll('dd'), (dd) => dd.textContent?.trim())).toEqual(['0', copy[item.description]]);
    });
    expect(summary.textContent).not.toContain('all.tournament.');
    expect(summary.querySelector('button, a, input, [tabindex], .rounded-full, .bg-emphasis')).toBeNull();
    expect(summary.querySelector('dl [style]')).toBeNull();
  });

  it('keeps populated slot totals distinct from unscheduled games and updates counts with the date filter', async () => {
    const statuses = ['AVAILABLE', 'AVAILABLE', 'SCHEDULED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETED', 'COMPLETED', 'COMPLETED'];
    query.mockReturnValueOnce(
      of({
        data: {
          slots: statuses.map((status, index) => ({
            id: `safe-slot-${index}`,
            courtId: 'safe-court',
            startTime: '2026-11-09T09:00:00Z',
            endTime: '2026-11-09T09:30:00Z',
            status,
          })),
          memberships: [],
          unscheduledGames: [{ id: 'safe-one' }, { id: 'safe-two' }],
        },
      }),
    );
    await settle();
    const counts = () =>
      Array.from(fixture.nativeElement.querySelectorAll('[data-testid="schedule-summary"] dl > div dd:first-of-type'), (dd: Element) =>
        dd.textContent?.trim(),
      );
    expect(counts()).toEqual(['8', '2', '1', '1', '1', '2']);
    const date = new Date('2026-11-10T00:00:00Z');
    fixture.componentInstance.onDateChange(date);
    await settle();
    expect(query.mock.lastCall?.[0].variables.slots.where[0].startTime).toEqual({ between: localDayRange(date) });
    expect(counts()).toEqual(['0', '0', '0', '0', '0', '0']);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('renders named native controls and a localized panel toggle in %s', async (locale) => {
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale);
    await settle();
    const controls: HTMLElement = fixture.nativeElement.querySelector('[data-testid="schedule-controls"]');
    const copy = dictionary.tournament.admin.schedule;
    expect(controls.tagName).toBe('P-TOOLBAR');
    expect(controls.getAttribute('role')).toBe('toolbar');
    expect(controls.getAttribute('aria-label')).toBe(copy.title);
    const select = controls.querySelector('[role="combobox"]');
    expect(select?.id).toBe('scheduleDateFilter');
    expect(select?.getAttribute('aria-label')).toBe(copy.filterByDate);
    expect(controls.querySelector('label')?.getAttribute('for')).toBe(select?.id);
    expect(controls.querySelector('label')?.textContent?.trim()).toBe(copy.filterByDate);
    const buttons = controls.querySelectorAll<HTMLButtonElement>('button.p-button');
    expect(buttons).toHaveLength(5);
    expect(buttons[0].textContent).toContain(copy.generateSlots);
    expect(buttons[1].textContent).toContain(copy.autoSchedule);
    expect(buttons[2].textContent).toContain(copy.publishSchedule);
    expect(buttons[3].getAttribute('aria-label')).toBe(dictionary.button.refresh);
    const toggle = buttons[4];
    expect(copy.hideUnscheduled.trim()).not.toBe('');
    expect(copy.showUnscheduled.trim()).not.toBe('');
    expect(toggle.getAttribute('aria-label')).toBe(copy.hideUnscheduled);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    await settle();
    expect(toggle.getAttribute('aria-label')).toBe(copy.showUnscheduled);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.componentInstance.showUnscheduledPanel()).toBe(false);
    toggle.click();
    await settle();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.componentInstance.showUnscheduledPanel()).toBe(true);
    expect(controls.textContent).not.toContain('all.tournament.');
    expect(controls.querySelector('[style], .bg-emphasis, .border-surface')).toBeNull();
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('preserves empty/populated/updating action gates and dispatches each handler once', async () => {
    await settle();
    const actions = () =>
      fixture.nativeElement.querySelectorAll(
        '[data-testid="schedule-controls"] button.p-button:not([aria-expanded])',
      ) as NodeListOf<HTMLButtonElement>;
    expect(Array.from(actions(), (button) => button.disabled)).toEqual([false, true, true, false]);
    query.mockReturnValue(
      of({
        data: {
          ...empty.data,
          slots: ['AVAILABLE', 'SCHEDULED'].map((status, index) => ({
            id: `safe-slot-${index}`,
            courtId: 'safe-court',
            startTime: '2026-11-09T09:00:00Z',
            endTime: '2026-11-09T09:30:00Z',
            status,
          })),
          memberships: [],
          unscheduledGames: [{ id: 'safe-game' }],
        },
      }),
    );
    actions()[3].click();
    await settle();
    expect(query).toHaveBeenCalledTimes(2);
    expect(Array.from(actions(), (button) => button.disabled)).toEqual([false, false, false, false]);
    fixture.componentInstance.updating.set(true);
    await settle();
    expect(Array.from(actions(), (button) => button.disabled)).toEqual([true, true, true, false]);
    fixture.componentInstance.updating.set(false);
    await settle();
    const generate = jest.spyOn(fixture.componentInstance, 'openGenerateSlotsDialog').mockImplementation();
    const autoSchedule = jest.spyOn(fixture.componentInstance, 'openAutoScheduleDialog').mockImplementation();
    const publish = jest.spyOn(fixture.componentInstance, 'publishSchedule').mockImplementation();
    actions()[0].click();
    actions()[1].click();
    actions()[2].click();
    expect(generate).toHaveBeenCalledTimes(1);
    expect(autoSchedule).toHaveBeenCalledTimes(1);
    expect(publish).toHaveBeenCalledTimes(1);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])(
    'asks for localized confirmation before publishing or deleting, and localizes game names in %s',
    async (locale) => {
      const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
      const translate = TestBed.inject(TranslateService);
      translate.setTranslation(locale, { all: dictionary });
      translate.use(locale);
      await settle();
      const copy = dictionary.tournament.admin.schedule;
      const confirm = jest.spyOn(fixture.debugElement.injector.get(ConfirmationService), 'confirm');
      const component = fixture.componentInstance;

      component.publishSchedule();
      component.deleteSlot({ id: 'safe-slot' } as never);

      expect(confirm).toHaveBeenCalledTimes(2);
      expect(confirm.mock.calls[0][0]).toMatchObject({
        header: copy.publishConfirm.header,
        message: copy.publishConfirm.message,
        acceptLabel: copy.publishConfirm.accept,
      });
      expect(confirm.mock.calls[1][0]).toMatchObject({
        header: copy.deleteSlotConfirm.header,
        message: copy.deleteSlotConfirm.message,
        acceptLabel: copy.deleteSlotConfirm.accept,
      });
      expect(mutate).not.toHaveBeenCalled();

      const named = (name: string, team: number) => ({ single: team, gamePlayer: { fullName: name } });
      expect(component.getGameDisplayName({ gamePlayerMemberships: [named('Ann', 1), named('Bo', 2)] } as never)).toBe(
        copy.versus.replace('{{home}}', 'Ann').replace('{{away}}', 'Bo'),
      );
      expect(component.getGameDisplayName({} as never)).toBe(copy.versus.replace('{{home}}', copy.tbd).replace('{{away}}', copy.tbd));
    },
  );

  it('applies and clears the native date filter and refreshes the current date without writes', async () => {
    const date = new Date(2026, 10, 9);
    const response = {
      data: {
        ...empty.data,
        slots: [{ id: 'safe-slot', courtId: 'safe-court', startTime: date.toISOString(), endTime: '2026-11-09T00:30:00Z', status: 'AVAILABLE' }],
      },
    };
    query.mockReturnValue(of(response));
    await settle();
    fixture.debugElement.query(By.css('p-select')).triggerEventHandler('ngModelChange', date);
    await settle();
    expect(fixture.componentInstance.selectedDate()).toBe(date);
    expect(query.mock.lastCall?.[0].variables.slots.where[0].startTime).toEqual({ between: localDayRange(date) });
    const controls: HTMLElement = fixture.nativeElement.querySelector('[data-testid="schedule-controls"]');
    expect(controls.querySelector('[role="combobox"]')?.textContent?.trim()).toBe('Mon, Nov 9');
    const refresh = controls.querySelectorAll<HTMLButtonElement>('button.p-button')[3];
    refresh.click();
    await settle();
    expect(query.mock.lastCall?.[0].variables.slots.where[0].startTime).toEqual({ between: localDayRange(date) });
    const refreshedControls: HTMLElement = fixture.nativeElement.querySelector('[data-testid="schedule-controls"]');
    const clear = refreshedControls.querySelector('.p-select-clear-icon');
    expect(clear).not.toBeNull();
    clear?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await settle();
    expect(fixture.componentInstance.selectedDate()).toBeNull();
    expect(query.mock.lastCall?.[0].variables.slots.where[0].startTime).toBeUndefined();
    expect(query).toHaveBeenCalledTimes(4);
  });

  it('keeps genuine empty success distinct from an error and uses the real court contract', async () => {
    await settle();
    expect(fixture.componentInstance.error()).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('all.tournament.admin.schedule.noSlots');
    const request = query.mock.calls[0][0];
    expect(request.variables).toEqual({
      slots: { where: [{ tournamentEventId: { eq: 'safe-tournament' } }], order: { startTime: 'ASC', order: 'ASC' } },
      games: {
        where: [
          {
            linkType: { eq: 'tournament' },
            scheduleSlotId: { isNull: true },
            tournamentDraw: { tournamentSubEvent: { eventId: { eq: 'safe-tournament' } } },
          },
        ],
        order: { round: 'ASC', order: 'ASC' },
      },
      memberships: { where: [{ eventId: { eq: 'safe-tournament' }, isActive: { eq: true } }] },
    });
    expect(request.fetchPolicy).toBe('network-only');
    expect(print(request.query)).toContain('locationEventMemberships(args: $memberships)');
    expect(print(request.query)).toContain('gamePlayer {');
    expect(print(request.query)).not.toContain('player {');
    expect(print(request.query)).not.toContain('location {');
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('shows native busy feedback without empty summaries or operational controls while pending', async () => {
    const pending = new Subject<typeof empty>();
    query.mockReturnValue(pending);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('p-progressbar')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="schedule-summary"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="schedule-controls"]')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.schedule.noSlots');
    expect(fixture.nativeElement.querySelector('p-button')).toBeNull();
    pending.next(empty);
    pending.complete();
    await settle();
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="schedule-summary"]')).not.toBeNull();
  });

  it('retains server diagnostics, hides empty success and retries without a mutation', async () => {
    query.mockReturnValueOnce(throwError(() => new Error('Safe scheduling read failure')));
    await settle();
    expect(fixture.componentInstance.error()).toBe('Safe scheduling read failure');
    expect(fixture.nativeElement.querySelector('p-message')?.textContent).toContain('Safe scheduling read failure');
    expect(fixture.nativeElement.querySelector('[data-testid="schedule-summary"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="schedule-controls"]')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.schedule.noSlots');
    expect(fixture.componentInstance.stats().totalSlots).toBe(0);
    const retry: HTMLButtonElement = fixture.nativeElement.querySelector('button.p-button');
    expect(retry.textContent).toContain('all.button.refresh');
    retry.click();
    await settle();
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.error()).toBeNull();
    expect(fixture.nativeElement.querySelector('p-message')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="schedule-summary"]')).not.toBeNull();
  });

  it.each([
    {},
    { slots: [], memberships: [] },
    { slots: null, memberships: [], unscheduledGames: [] },
    { slots: [], memberships: null, unscheduledGames: [] },
    { slots: [], memberships: [], unscheduledGames: null },
  ])('does not interpret malformed payload %j as empty success', async (data) => {
    query.mockReturnValueOnce(of({ data }));
    await settle();
    expect(fixture.componentInstance.error()).toBe('all.error.genericTitle');
    expect(fixture.nativeElement.querySelector('p-message')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.schedule.noSlots');
  });

  it('preserves populated player identities and replaces the grid with explicit feedback on a failed refresh', async () => {
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { all: { tournament: { admin: { schedule: { tbd: 'TBD', versus: '{{home}} vs {{away}}' } } } } });
    translate.use('en');
    const game = { id: 'safe-game', gamePlayerMemberships: [{ single: 1, gamePlayer: { fullName: 'Safe One' } }] };
    const response = {
      data: {
        slots: [{ id: 'safe-slot', courtId: 'safe-court', startTime: '2026-11-09T09:00:00Z', endTime: '2026-11-09T09:30:00Z', status: 'AVAILABLE' }],
        memberships: [{ locationId: 'safe-location' }],
        unscheduledGames: [game],
      },
    };
    query.mockReturnValueOnce(of(response)).mockReturnValueOnce(of({ data: { courts: [{ id: 'safe-court', name: 'Safe Court' }] } }));
    await settle();
    expect(query.mock.calls[1][0].variables.args).toEqual({ where: [{ locationId: { in: ['safe-location'] } }], order: { name: 'ASC' } });
    expect(fixture.componentInstance.slots()).toHaveLength(1);
    expect(fixture.componentInstance.courts()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Safe One vs TBD');
    query.mockReturnValueOnce(throwError(() => new Error('Safe refresh failure')));
    fixture.componentInstance.refetch();
    await settle();
    expect(fixture.componentInstance.error()).toBe('Safe refresh failure');
    expect(() => fixture.componentInstance.slots()).not.toThrow();
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.schedule.noSlots');
    expect(fixture.nativeElement.querySelector('p-select')).toBeNull();
  });

  it('reacts to tournament and date changes with current request variables', async () => {
    await settle();
    const date = new Date('2026-11-09T00:00:00Z');
    fixture.componentInstance.selectedDate.set(date);
    await settle();
    expect(query.mock.lastCall?.[0].variables.slots.where[0]).toEqual({
      tournamentEventId: { eq: 'safe-tournament' },
      startTime: { between: localDayRange(date) },
    });
    fixture.componentRef.setInput('tournament', { id: 'safe-other' });
    await settle();
    expect(query.mock.lastCall?.[0].variables.slots.where[0]).toEqual({
      tournamentEventId: { eq: 'safe-other' },
      startTime: { between: localDayRange(date) },
    });
  });

  it('ignores a stale response after the tournament changes', async () => {
    const stale = new Subject<{ data: { slots: unknown[]; memberships: unknown[]; unscheduledGames: unknown[] } }>();
    query.mockReturnValueOnce(stale);
    fixture.detectChanges();
    const firstSignal: AbortSignal = query.mock.calls[0][0].context.signal;
    fixture.componentRef.setInput('tournament', { id: 'safe-other' });
    await settle();
    expect(firstSignal.aborted).toBe(true);
    stale.next({
      data: {
        ...empty.data,
        slots: [
          {
            id: 'safe-stale-slot',
            courtId: 'safe-stale-court',
            startTime: '2026-11-09T09:00:00Z',
            endTime: '2026-11-09T09:30:00Z',
            status: 'AVAILABLE',
            court: { id: 'safe-stale-court', name: 'Stale Court' },
          },
        ],
      },
    });
    stale.complete();
    await settle();
    expect(query.mock.lastCall?.[0].variables.slots.where[0].tournamentEventId).toEqual({ eq: 'safe-other' });
    expect(fixture.componentInstance.error()).toBeNull();
    expect(fixture.componentInstance.slots()).toEqual([]);
    expect(fixture.nativeElement.textContent).not.toContain('Stale Court');
  });
});
