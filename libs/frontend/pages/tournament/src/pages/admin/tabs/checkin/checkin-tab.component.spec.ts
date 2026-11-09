import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { CheckInStatus } from '@app/models-enum';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { CheckinTabComponent } from './checkin-tab.component';

describe('Check-in summary, filters and table', () => {
  let fixture: ComponentFixture<CheckinTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const stats = { total: 12, checkedIn: 4, pending: 7, noShow: 1, checkInRate: 100 / 3 };
  const response = { data: { tournamentCheckInList: [], checkInStats: stats } };

  beforeEach(async () => {
    query = jest.fn(() => of(response));
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [CheckinTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinTabComponent);
    fixture.componentRef.setInput('tournament', { id: 'safe-tournament' });
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function summary(): HTMLElement {
    return fixture.nativeElement.querySelector('[data-testid="checkin-summary"]');
  }

  function list(): HTMLElement {
    return fixture.nativeElement.querySelector('[data-testid="checkin-list"]');
  }

  function listButton(selector: string): HTMLButtonElement {
    const button = list().querySelector<HTMLButtonElement>(selector);
    if (!button) {
      throw new Error(`Missing check-in button: ${selector}`);
    }
    return button;
  }

  function useRecords(status = CheckInStatus.PENDING) {
    const records = [
      {
        id: 'safe-member',
        status,
        checkedInAt: '2026-11-08T10:30:00Z',
        player: { fullName: 'Safe Member', memberId: 'TEST123' },
        enrollment: { id: 'safe-enrollment', tournamentSubEvent: { name: 'Safe singles' } },
      },
      { id: 'safe-guest', status: CheckInStatus.PENDING, enrollment: { id: 'safe-guest-enrollment', isGuest: true, guestName: 'Example Guest' } },
      { id: 'safe-missing-enrollment', status: CheckInStatus.PENDING },
    ];
    query.mockReturnValue(of({ data: { tournamentCheckInList: records, checkInStats: stats } }));
  }

  it('renders five native definition-list metrics and preserves one-decimal percentage precision', async () => {
    await settle();
    expect(summary().tagName.toLowerCase()).toBe('p-panel');
    expect(summary().querySelectorAll('dt')).toHaveLength(5);
    expect(Array.from(summary().querySelectorAll('dd:nth-of-type(1)'), (node) => node.textContent?.trim())).toEqual(['12', '4', '7', '1', '33.3%']);
    expect(summary().querySelector('p-card')).toBeNull();
    expect(query.mock.lastCall[0].variables.tournamentEventId).toBe('safe-tournament');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('renders genuine zero statistics without hiding meaningful labels', async () => {
    query.mockReturnValue(
      of({ data: { tournamentCheckInList: [], checkInStats: { total: 0, checkedIn: 0, pending: 0, noShow: 0, checkInRate: 0 } } }),
    );
    await settle();
    expect(Array.from(summary().querySelectorAll('dd:nth-of-type(1)'), (node) => node.textContent?.trim())).toEqual(['0', '0', '0', '0', '0%']);
    expect(summary().querySelectorAll('dt')).toHaveLength(5);
    expect(summary().querySelector('p-message')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('renders nonblank mounted summary copy from the actual %s dictionary', async (locale) => {
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale);
    await settle();
    expect(summary().querySelector('.p-panel-title')?.textContent).toContain(dictionary.tournament.admin.checkin.title);
    fixture.componentInstance.summaryItems.forEach((item, index) => {
      const copy = dictionary.tournament.admin.checkin;
      expect(copy[item.label].trim()).not.toBe('');
      expect(copy[item.description].trim()).not.toBe('');
      expect(summary().querySelectorAll('dt')[index].textContent?.trim()).toBe(copy[item.label]);
      expect(summary().querySelectorAll('dd:nth-of-type(2)')[index].textContent?.trim()).toBe(copy[item.description]);
    });
    expect(mutate).not.toHaveBeenCalled();
  });

  it('shows named native loading instead of false zero metrics while the read is pending', async () => {
    const pending = new Subject<typeof response>();
    query.mockReturnValue(pending);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    expect(summary().querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(summary().querySelector('[role="status"]')?.textContent).toContain('all.tournament.edit.messages.loading');
    expect(summary().querySelector('p-skeleton')).not.toBeNull();
    expect(summary().querySelector('dl')).toBeNull();
    pending.next(response);
    pending.complete();
    await settle();
    expect(summary().querySelectorAll('dt')).toHaveLength(5);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('surfaces query errors safely and recovers through the native refresh action without a mutation', async () => {
    query.mockReturnValueOnce(throwError(() => new Error('Safe read failure')));
    await settle();
    expect(summary().querySelector('p-message')?.textContent).toContain('Safe read failure');
    expect(summary().querySelector('dl')).toBeNull();
    expect(fixture.componentInstance.checkIns()).toEqual([]);
    const refresh: HTMLButtonElement | null = summary().querySelector('p-button button');
    expect(refresh?.getAttribute('aria-label')).toBe('all.button.refresh');
    refresh?.focus();
    refresh?.click();
    await settle();
    expect(query).toHaveBeenCalledTimes(2);
    expect(summary().querySelector('p-message')).toBeNull();
    expect(summary().querySelectorAll('dt')).toHaveLength(5);
    expect(document.activeElement).toBe(refresh);
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each([{ data: undefined }, { data: { tournamentCheckInList: [] } }])(
    'rejects an incomplete successful response rather than displaying zeros',
    async (result) => {
      query.mockReturnValue(of(result));
      await settle();
      expect(summary().querySelector('p-message')?.textContent).toContain('missing records or statistics');
      expect(summary().querySelector('dl')).toBeNull();
      expect(mutate).not.toHaveBeenCalled();
    },
  );

  it('sends status enum changes, clears All and preserves filters when the tournament changes', async () => {
    await settle();
    fixture.componentInstance.statusFilter.setValue(CheckInStatus.CHECKED_IN);
    await settle();
    expect(query.mock.lastCall[0].variables.status).toBe(CheckInStatus.CHECKED_IN);
    fixture.componentInstance.searchControl.setValue('safe');
    await settle();
    expect(query).toHaveBeenCalledTimes(2);
    fixture.componentRef.setInput('tournament', { id: 'other-safe-tournament' });
    await settle();
    expect(query.mock.lastCall[0].variables).toEqual({ tournamentEventId: 'other-safe-tournament', status: CheckInStatus.CHECKED_IN });
    expect(fixture.componentInstance.searchControl.value).toBe('safe');
    fixture.componentInstance.statusFilter.setValue(null);
    await settle();
    expect(query.mock.lastCall[0].variables.status).toBeUndefined();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('filters player, guest and member-ID locally and clearing restores records without a query', async () => {
    const records = [
      { id: 'safe-member', status: CheckInStatus.PENDING, player: { fullName: 'Safe Member', memberId: 'TEST123' } },
      { id: 'safe-guest', status: CheckInStatus.PENDING, enrollment: { isGuest: true, guestName: 'Example Guest' } },
    ];
    query.mockReturnValue(of({ data: { tournamentCheckInList: records, checkInStats: stats } }));
    await settle();
    for (const [search, id] of [
      ['  SAFE MEMBER  ', 'safe-member'],
      ['test123', 'safe-member'],
      ['example guest', 'safe-guest'],
    ]) {
      fixture.componentInstance.searchControl.setValue(search);
      await settle();
      expect(fixture.componentInstance.checkIns().map((record) => record.id)).toEqual([id]);
    }
    fixture.componentInstance.searchControl.setValue('not-found');
    await settle();
    expect(fixture.componentInstance.checkIns()).toEqual([]);
    fixture.componentInstance.searchControl.setValue('');
    await settle();
    expect(fixture.componentInstance.checkIns()).toHaveLength(2);
    expect(query).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('uses named native fluid filters and one refresh while loading, with no operational test writes', async () => {
    const pending = new Subject<typeof response>();
    query.mockReturnValue(pending);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    const filters: HTMLElement = fixture.nativeElement.querySelector('[data-testid="checkin-filters"]');
    expect(filters.tagName.toLowerCase()).toBe('p-panel');
    expect(filters.querySelector('#admin-checkin-status')?.getAttribute('aria-labelledby')).toBe('admin-checkin-status-label');
    expect(filters.querySelector('label[for="admin-checkin-search"]')).not.toBeNull();
    expect(filters.querySelector('p-iconfield p-inputicon')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.pi-refresh')).toHaveLength(1);
    expect(filters.querySelector('input')?.disabled).toBe(false);
    pending.next(response);
    pending.complete();
    await settle();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('updates real locale options and filter copy without resetting status/search or refetching', async () => {
    const translate = TestBed.inject(TranslateService);
    await settle();
    fixture.componentInstance.statusFilter.setValue(CheckInStatus.NO_SHOW);
    fixture.componentInstance.searchControl.setValue('safe');
    await settle();
    const queryCount = query.mock.calls.length;
    for (const locale of ['en', 'nl_BE', 'fr_BE']) {
      const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
      translate.setTranslation(locale, { all: dictionary });
      translate.use(locale);
      await settle();
      const copy = dictionary.tournament.admin.checkin;
      expect(fixture.componentInstance.statusOptions().map((option) => option.label)).toEqual([
        copy.allStatuses,
        copy.pending,
        copy.checkedIn,
        copy.noShow,
      ]);
      const filters: HTMLElement = fixture.nativeElement.querySelector('[data-testid="checkin-filters"]');
      expect(filters.querySelector('input')?.placeholder).toBe(copy.searchPlayers);
      expect(copy.initialize.trim()).not.toBe('');
      expect(filters.textContent).toContain(copy.initialize);
      expect(fixture.componentInstance.statusFilter.value).toBe(CheckInStatus.NO_SHOW);
      expect(fixture.componentInstance.searchControl.value).toBe('safe');
    }
    expect(query).toHaveBeenCalledTimes(queryCount);
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('renders complete native table/identity/status/action copy from the actual %s dictionary', async (locale) => {
    useRecords(CheckInStatus.CHECKED_IN);
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale);
    await settle();
    const copy = dictionary.tournament.admin.checkin;
    for (const key of ['players', 'checkedInAt', 'noCheckIns', 'clearSelection', 'selectAll', 'checkIn', 'markNoShow', 'undo']) {
      expect(copy[key].trim()).not.toBe('');
    }
    expect(list().tagName.toLowerCase()).toBe('section');
    expect(list().getAttribute('aria-labelledby')).toBe('admin-checkin-list-title');
    expect(list().querySelector('h2')?.textContent).toContain(copy.players);
    expect(list().querySelectorAll('th[scope="col"]')).toHaveLength(6);
    expect(list().textContent).toContain('Safe Member');
    expect(list().textContent).toContain('TEST123');
    expect(list().textContent).toContain('Safe singles');
    expect(list().textContent).toContain(`Example Guest (${dictionary.tournament.admin.enrollments.guest})`);
    expect(list().textContent).toContain(dictionary.common.unknown);
    expect(list().querySelector('p-tag')?.textContent).toBe(copy.checkedIn);
    expect(list().querySelector('.p-tag-success')).not.toBeNull();
    expect(list().querySelector('button[aria-label="' + copy.undo + ': Safe Member"]')).not.toBeNull();
    expect(list().querySelectorAll('input[type="checkbox"][aria-label]')).toHaveLength(2);
    expect(list().querySelector('.p-datatable-sm')).not.toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('uses one native empty message and one initialization action, including a no-match search', async () => {
    useRecords();
    await settle();
    fixture.componentInstance.searchControl.setValue('not-found');
    await settle();
    expect(list().querySelector('p-message')?.textContent).toContain('all.tournament.admin.checkin.noCheckIns');
    expect(list().querySelector('tbody tr td')?.getAttribute('colspan')).toBe('6');
    expect(list().querySelector('button .pi-play')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('button .pi-play')).toHaveLength(1);
    expect(query).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('shows native named list loading and read errors instead of false empty feedback, then recovers', async () => {
    const pending = new Subject<typeof response>();
    query.mockReturnValueOnce(pending);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    expect(list().querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(list().querySelector('p-progressbar')?.getAttribute('aria-labelledby')).toBe('admin-checkin-list-loading');
    expect(list().querySelector('p-table')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="checkin-filters"] button')?.disabled).toBe(true);
    pending.error(new Error('Safe list read failure'));
    await settle();
    expect(list().querySelector('p-message')?.textContent).toContain('Safe list read failure');
    expect(list().querySelector('p-table')).toBeNull();
    fixture.componentInstance.refetch();
    await settle();
    expect(list().querySelector('p-table')).not.toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('selects only actionable pending records and clears selection without mutations', async () => {
    useRecords(CheckInStatus.CHECKED_IN);
    await settle();
    const select = listButton('button[aria-label^="all.tournament.admin.checkin.selectAll"]');
    select.click();
    await settle();
    expect(fixture.componentInstance.selectedCheckIns().map((record) => record.id)).toEqual(['safe-guest']);
    const clear = listButton('button[aria-label="all.tournament.admin.checkin.clearSelection"]');
    expect(clear.disabled).toBe(false);
    clear.click();
    await settle();
    expect(fixture.componentInstance.selectedCheckIns()).toEqual([]);
    expect(clear.disabled).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each([
    {
      status: CheckInStatus.PENDING,
      action: 'checkIn',
      field: 'checkInPlayer',
      variables: { input: { tournamentEventId: 'safe-tournament', enrollmentId: 'safe-enrollment', notes: undefined } },
    },
    {
      status: CheckInStatus.PENDING,
      action: 'markNoShow',
      field: 'markNoShow',
      variables: { input: { tournamentEventId: 'safe-tournament', enrollmentId: 'safe-enrollment', reason: undefined } },
    },
    { status: CheckInStatus.CHECKED_IN, action: 'undo', field: 'undoCheckIn', variables: { checkInId: 'safe-member' } },
    { status: CheckInStatus.NO_SHOW, action: 'undo', field: 'undoCheckIn', variables: { checkInId: 'safe-member' } },
  ])(
    'wires the native $action row action to the exact mocked contract for $status and blocks concurrent controls',
    async ({ status, action, field, variables }) => {
      useRecords(status);
      const pending = new Subject<{ data: Record<string, { id: string }> }>();
      mutate.mockReturnValue(pending);
      await settle();
      const button = listButton(`button[aria-label="all.tournament.admin.checkin.${action}: Safe Member"]`);
      button.click();
      fixture.detectChanges();
      expect(mutate).toHaveBeenCalledTimes(1);
      expect(mutate.mock.lastCall[0].variables).toEqual(variables);
      expect(Array.from(list().querySelectorAll('button'), (node) => node.disabled)).not.toContain(false);
      expect(Array.from(list().querySelectorAll<HTMLInputElement>('input[type="checkbox"]'), (node) => node.disabled)).not.toContain(false);
      button.click();
      expect(mutate).toHaveBeenCalledTimes(1);
      pending.next({ data: { [field]: { id: 'safe-member' } } });
      pending.complete();
      await Promise.resolve();
      await settle();
      expect(query).toHaveBeenCalledTimes(2);
      expect(list().querySelector<HTMLButtonElement>(`button[aria-label="all.tournament.admin.checkin.${action}: Safe Member"]`)?.disabled).toBe(
        false,
      );
    },
  );

  it('keeps missing-enrollment check-in actions disabled and exposes update errors without hiding the list', async () => {
    useRecords();
    await settle();
    const rows = list().querySelectorAll('tbody tr');
    expect(Array.from(rows[2].querySelectorAll('button'), (node) => node.disabled)).toEqual([true, true]);
    expect(rows[2].querySelector<HTMLInputElement>('input')?.disabled).toBe(true);
    mutate.mockReturnValue(throwError(() => new Error('Safe update failure')));
    listButton('button[aria-label="all.tournament.admin.checkin.checkIn: Safe Member"]').click();
    await settle();
    expect(fixture.nativeElement.textContent).toContain('Safe update failure');
    expect(list().querySelectorAll('tbody tr')).toHaveLength(3);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('sends only actionable selected enrollment IDs to mocked bulk check-in and clears after success', async () => {
    useRecords();
    mutate.mockReturnValue(of({ data: { bulkCheckIn: { successCount: 2, failedCount: 0, failedEnrollmentIds: [] } } }));
    await settle();
    fixture.componentInstance.selectAllPending();
    await settle();
    listButton('button:has(.pi-check)').click();
    await settle();
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.lastCall[0].variables).toEqual({
      input: { tournamentEventId: 'safe-tournament', enrollmentIds: ['safe-enrollment', 'safe-guest-enrollment'] },
    });
    expect(fixture.componentInstance.selectedCheckIns()).toEqual([]);
    expect(query).toHaveBeenCalledTimes(2);
  });

  it('preserves native 10/25/50 paging and all rows', async () => {
    const records = Array.from({ length: 56 }, (_, index) => ({
      id: `safe-row-${index}`,
      status: CheckInStatus.PENDING,
      player: { fullName: `Safe player ${index}` },
      enrollment: { id: `safe-enrollment-${index}` },
    }));
    query.mockReturnValue(of({ data: { tournamentCheckInList: records, checkInStats: stats } }));
    await settle();
    expect(list().querySelectorAll('tbody tr')).toHaveLength(10);
    const next = listButton('.p-paginator-next');
    next.click();
    await settle();
    expect(list().querySelector('tbody')?.textContent).toContain('Safe player 10');
    expect(fixture.componentInstance.checkIns()).toHaveLength(56);
    expect(mutate).not.toHaveBeenCalled();
  });
});
