import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollmentStatus } from '@app/models-enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of } from 'rxjs';
import { EnrollmentsTabComponent } from './enrollments-tab.component';

describe('Enrollment-management filters', () => {
  let fixture: ComponentFixture<EnrollmentsTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const subEvents = [
    { id: 'safe-single', name: 'Safe singles', gameType: 'S' },
    { id: 'safe-double', name: 'Safe doubles', gameType: 'D' },
  ];
  const enrollments = [
    { id: 'player', status: EnrollmentStatus.CONFIRMED, player: { fullName: 'Safe Player' } },
    { id: 'guest', status: EnrollmentStatus.PENDING, isGuest: true, guestName: 'Safe Guest' },
    { id: 'partner', status: EnrollmentStatus.WAITING_LIST, confirmedPartner: { fullName: 'Safe Partner' } },
  ];

  beforeEach(async () => {
    query = jest.fn(({ variables }: { variables: { subEventId: string; status?: EnrollmentStatus } }) =>
      of({ data: { subEventEnrollments: enrollments.filter((entry) => !variables.status || entry.status === variables.status) } }),
    );
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [EnrollmentsTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(EnrollmentsTabComponent);
    fixture.componentRef.setInput('tournament', { id: 'safe-event', tournamentSubEvents: subEvents });
    await settle();
  });

  afterEach(() => {
    expect(mutate).not.toHaveBeenCalled();
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function ids() {
    return fixture.componentInstance.enrollments().map((entry) => entry.id);
  }

  it('selects the first sub-event and mounts the matching table and query', () => {
    expect(fixture.componentInstance.selectedSubEvent()?.id).toBe('safe-single');
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0].variables).toEqual({ subEventId: 'safe-single', status: undefined });
    expect(ids()).toEqual(['player', 'guest', 'partner']);
    expect(fixture.nativeElement.querySelector('p-table')).not.toBeNull();
    expect(fixture.componentInstance.isDoublesEvent()).toBe(false);
  });

  it('switches sub-events and the doubles columns without requiring a refresh', async () => {
    fixture.componentInstance.subEventControl.setValue(fixture.componentInstance.subEvents()[1]);
    await settle();
    expect(fixture.componentInstance.selectedSubEvent()?.id).toBe('safe-double');
    expect(query.mock.lastCall[0].variables.subEventId).toBe('safe-double');
    expect(fixture.componentInstance.isDoublesEvent()).toBe(true);
  });

  it.each([null, ...Object.values(EnrollmentStatus)])('sends the selected status %s without changing its enum value', async (status) => {
    fixture.componentInstance.statusFilter.setValue(status);
    await settle();
    expect(query.mock.lastCall[0].variables).toEqual({ subEventId: 'safe-single', status: status ?? undefined });
    expect(ids()).toEqual(enrollments.filter((entry) => !status || entry.status === status).map((entry) => entry.id));
  });

  it('filters player, guest and confirmed partner names locally and clears search without queries', async () => {
    for (const [search, expected] of [
      ['PLAYER', ['player']],
      ['guest', ['guest']],
      ['Partner', ['partner']],
      ['not present', []],
      ['', ['player', 'guest', 'partner']],
    ] as const) {
      fixture.componentInstance.searchControl.setValue(search);
      await settle();
      expect(ids()).toEqual(expected);
      expect(fixture.componentInstance.stats().total).toBe(3);
      expect(query).toHaveBeenCalledTimes(1);
    }
  });

  it('preserves filters when the named refresh action reloads the current query', async () => {
    fixture.componentInstance.statusFilter.setValue(EnrollmentStatus.CONFIRMED);
    fixture.componentInstance.searchControl.setValue('PLAYER');
    await settle();
    query.mockClear();
    const refresh: HTMLButtonElement = fixture.nativeElement.querySelector('[data-testid="enrollment-filters"] p-button button');
    refresh.click();
    await settle();
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.lastCall[0].variables).toEqual({ subEventId: 'safe-single', status: EnrollmentStatus.CONFIRMED });
    expect(ids()).toEqual(['player']);
  });

  it('clears selection without reselecting or querying and disables refresh', async () => {
    query.mockClear();
    fixture.componentInstance.subEventControl.setValue(null);
    await settle();
    expect(fixture.componentInstance.selectedSubEvent()).toBeNull();
    expect(ids()).toEqual([]);
    expect(query).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[data-testid="enrollment-filters"] p-button button').disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('p-table')).toBeNull();
  });

  it('reconciles replacement and empty tournament options', async () => {
    fixture.componentRef.setInput('tournament', { id: 'replacement', tournamentSubEvents: [subEvents[1]] });
    await settle();
    expect(fixture.componentInstance.selectedSubEvent()?.id).toBe('safe-double');
    fixture.componentRef.setInput('tournament', { id: 'empty', tournamentSubEvents: [] });
    await settle();
    expect(fixture.componentInstance.selectedSubEvent()).toBeNull();
    expect(ids()).toEqual([]);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('associates native controls with meaningful %s labels', async (locale) => {
    const assetPath = join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: {
      common: { search: string };
      button: { refresh: string };
      tournament: { admin: { enrollments: Record<string, string> } };
    } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: asset });
    translate.use(locale);
    await settle();
    const filters: HTMLElement = fixture.nativeElement.querySelector('[data-testid="enrollment-filters"]');
    expect(filters.tagName).toBe('P-PANEL');
    expect(filters.querySelector('p-iconfield p-inputicon')).not.toBeNull();
    expect(Array.from(filters.querySelectorAll('label')).map((label) => label.textContent?.trim())).toEqual([
      asset.tournament.admin.enrollments.subEvent,
      asset.tournament.admin.enrollments.status,
      asset.common.search,
    ]);
    for (const name of ['sub-event', 'status']) {
      const control = filters.querySelector(`[role="combobox"][aria-labelledby="admin-enrollment-${name}-label"]`);
      expect(control?.id).toBe(`admin-enrollment-${name}`);
    }
    expect(filters.querySelector('p-button button')?.textContent?.trim()).toBe(asset.button.refresh);
    expect(filters.querySelectorAll('p-select')[1]?.textContent).toContain(asset.tournament.admin.enrollments.allStatuses);
    expect(fixture.componentInstance.statusOptions()).toHaveLength(6);
    expect(fixture.componentInstance.statusOptions().map((option) => option.label)).toEqual([
      ...['allStatuses', 'confirmed', 'pending', 'waitingList', 'cancelled'].map((key) => asset.tournament.admin.enrollments[key]),
      'Withdrawn',
    ]);
    expect(filters.querySelector('[style]:not(.p-panel-content-container)')).toBeNull();
  });
});

describe('Enrollment-management summary presentation', () => {
  let fixture: ComponentFixture<EnrollmentsTabComponent>;
  let element: HTMLElement;
  let mutate: jest.Mock;
  const counts = signal({ total: 0, confirmed: 0, pending: 0, waitingList: 0, cancelled: 0 });

  beforeEach(async () => {
    counts.set({ total: 0, confirmed: 0, pending: 0, waitingList: 0, cancelled: 0 });
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [EnrollmentsTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query: jest.fn(() => of({ data: { subEventEnrollments: [] } })), mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(EnrollmentsTabComponent);
    fixture.componentRef.setInput('tournament', { id: 'safe-event', tournamentSubEvents: [] });
    fixture.componentInstance.stats = counts;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    expect(mutate).not.toHaveBeenCalled();
  });

  function values() {
    return Array.from(element.querySelectorAll('dl dd:first-of-type')).map((cell) => cell.textContent?.trim());
  }

  it('groups five named counts in one named native Panel and a non-interactive definition list', () => {
    const summary = element.querySelector('p-panel');
    expect(element.querySelector('p-card')).toBeNull();
    expect(summary?.querySelector('[role="region"]')?.getAttribute('aria-labelledby')).toBe(summary?.querySelector('.p-panel-title')?.id);
    expect(summary?.classList.contains('border-surface')).toBe(false);
    expect(summary?.querySelectorAll('dl')).toHaveLength(1);
    expect(summary?.querySelectorAll('dt')).toHaveLength(5);
    expect(summary?.querySelectorAll('dd')).toHaveLength(10);
    expect(summary?.querySelector('button, a, input, [tabindex], i')).toBeNull();
    expect(summary?.querySelector('[style]:not(.p-panel-content-container)')).toBeNull();
    expect(summary?.innerHTML).not.toMatch(/(?:green|blue|orange|red|primary|surface)-\d|dark:|uppercase|hover:/);
    expect(values()).toEqual(['0', '0', '0', '0', '0']);
  });

  it('preserves exact input values, ordering and reactive replacement without deriving new totals', () => {
    counts.set({ total: 90000, confirmed: 12, pending: 3, waitingList: 4, cancelled: 5 });
    fixture.detectChanges();
    expect(values()).toEqual(['90000', '12', '3', '4', '5']);
    counts.set({ total: 1, confirmed: 0, pending: 1, waitingList: 0, cancelled: 0 });
    fixture.detectChanges();
    expect(values()).toEqual(['1', '0', '1', '0', '0']);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses existing %s labels and preserves descriptions without blank total labels', (locale) => {
    const assetPath = join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: { tournament: { admin: { enrollments: Record<string, string> } } } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const labels = asset.tournament.admin.enrollments;
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: asset });
    translate.use(locale);
    fixture.detectChanges();
    expect(Array.from(element.querySelectorAll('dl dt')).map((cell) => cell.textContent?.trim())).toEqual(
      ['totalEntries', 'confirmed', 'pending', 'waitingList', 'cancelled'].map((key) => labels[key]),
    );
    expect(Array.from(element.querySelectorAll('dl dd:last-of-type')).map((cell) => cell.textContent?.trim())).toEqual(
      ['totalDescription', 'confirmedDescription', 'pendingDescription', 'waitingListDescription', 'cancelledDescription'].map((key) => labels[key]),
    );
    expect(element.querySelector('dt')?.textContent?.trim()).not.toBe('');
  });
});
