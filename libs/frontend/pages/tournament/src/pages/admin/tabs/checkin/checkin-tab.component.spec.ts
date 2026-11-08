import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { CheckInStatus } from '@app/models-enum';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { CheckinTabComponent } from './checkin-tab.component';

describe('Check-in summary and filters', () => {
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
});
