import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollmentStatus } from '@app/models-enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { Player, TournamentEnrollment } from '@app/models';
import { DocumentNode, print } from 'graphql';
import { EnrollmentsTabComponent } from './enrollments-tab.component';

describe('Manual enrollment dialog and creation', () => {
  let fixture: ComponentFixture<EnrollmentsTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const player = { id: 'safe-player', fullName: 'Safe Player', memberId: 'SAFE-1' };
  const partner = { id: 'safe-partner', fullName: 'Safe Partner', memberId: 'SAFE-2' };

  beforeEach(async () => {
    query = jest.fn(({ query }: { query: DocumentNode }) =>
      of({ data: print(query).includes('ManualEnrollmentPlayers') ? { players: [player, partner] } : { tournamentEnrollments: [] } }),
    );
    mutate = jest.fn(() =>
      of({
        data: {
          adminEnrollPlayer: { id: 'safe-enrollment', status: EnrollmentStatus.CONFIRMED },
          enrollGuest: { id: 'safe-enrollment', status: EnrollmentStatus.CONFIRMED },
        },
      }),
    );
    await TestBed.configureTestingModule({
      imports: [EnrollmentsTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(EnrollmentsTabComponent);
    fixture.componentRef.setInput('tournament', {
      id: 'safe-event',
      allowGuestEnrollments: true,
      tournamentSubEvents: [
        { id: 'safe-single', name: 'Safe singles', gameType: 'S' },
        { id: 'safe-double', name: 'Safe doubles', gameType: 'D' },
      ],
    });
    await settle();
    fixture.componentInstance.openManualEnrollmentDialog();
    await settle();
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('mounts a named native form with two visible actions and a disabled submit until a player is selected', () => {
    const form: HTMLFormElement = fixture.nativeElement.querySelector('#manual-enrollment-form');
    expect(form.querySelectorAll('p-button')).toHaveLength(2);
    expect(form.querySelector('p-button:last-child button')?.getAttribute('type')).toBe('submit');
    expect(form.querySelector('p-button:last-child button')?.hasAttribute('disabled')).toBe(true);
    expect(form.querySelector('p-autocomplete input')?.id).toBe('manual-player');
    expect(form.querySelector('p-autocomplete input')?.getAttribute('aria-labelledby')).toBe('manual-player-label');
    expect(form.querySelector('textarea')?.classList.contains('p-textarea')).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('restores focus to the mounted Add action after hiding the dialog', async () => {
    fixture.componentInstance.restoreManualEnrollmentFocus();
    await settle();
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('[data-testid="enrollment-table"] p-button button'));
    expect(mutate).not.toHaveBeenCalled();
  });

  it('submits a selected member identity and refreshes without logging personal form data', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    fixture.componentInstance.manualEnrollmentForm.controls.player.setValue(player);
    fixture.componentInstance.manualEnrollmentForm.controls.notes.setValue(' Safe notes ');
    await settle();
    const form: HTMLFormElement = fixture.nativeElement.querySelector('#manual-enrollment-form');
    (form.querySelector('p-button:last-child button') as HTMLButtonElement).click();
    await settle();
    expect(print(mutate.mock.lastCall[0].mutation)).toContain('adminEnrollPlayer');
    expect(mutate.mock.lastCall[0].variables.input).toEqual({
      playerId: 'safe-player',
      tournamentSubEventId: 'safe-single',
      preferredPartnerId: undefined,
      notes: 'Safe notes',
    });
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.showManualEnrollmentDialog()).toBe(false);
    expect(log).not.toHaveBeenCalled();
    log.mockRestore();
  });

  it('validates guest name and email instead of requiring the hidden player', async () => {
    const controls = fixture.componentInstance.manualEnrollmentForm.controls;
    controls.isGuest.setValue(true);
    await settle();
    expect(controls.player.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('#manual-player')).toBeNull();
    expect(fixture.componentInstance.manualEnrollmentForm.invalid).toBe(true);
    controls.guestName.setValue('   ');
    controls.guestEmail.setValue('invalid');
    await fixture.componentInstance.createManualEnrollment();
    expect(mutate).not.toHaveBeenCalled();
    controls.guestName.setValue(' Safe Guest ');
    controls.guestEmail.setValue('safe@example.invalid');
    await fixture.componentInstance.createManualEnrollment();
    await settle();
    expect(print(mutate.mock.lastCall[0].mutation)).toContain('enrollGuest');
    expect(mutate.mock.lastCall[0].variables.input).toEqual({
      guestName: 'Safe Guest',
      guestEmail: 'safe@example.invalid',
      tournamentSubEventId: 'safe-single',
      notes: undefined,
      preferredPartnerId: undefined,
    });
  });

  it('includes a selected doubles partner but never submits a hidden singles partner', async () => {
    const component = fixture.componentInstance;
    component.subEventControl.setValue(component.subEvents()[1]);
    await settle();
    component.manualEnrollmentForm.controls.player.setValue(player);
    component.manualEnrollmentForm.controls.partner.setValue(partner);
    await component.createManualEnrollment();
    expect(mutate.mock.lastCall[0].variables.input.preferredPartnerId).toBe(partner.id);
    component.openManualEnrollmentDialog();
    component.subEventControl.setValue(component.subEvents()[0]);
    await settle();
    component.manualEnrollmentForm.controls.player.setValue(player);
    component.manualEnrollmentForm.controls.partner.setValue(partner);
    await component.createManualEnrollment();
    expect(mutate.mock.lastCall[0].variables.input.preferredPartnerId).toBeUndefined();
  });

  it('rejects typed player text, typed partner text and self-partnering', async () => {
    const component = fixture.componentInstance;
    component.manualEnrollmentForm.controls.player.setValue('Safe Player');
    await component.createManualEnrollment();
    component.subEventControl.setValue(component.subEvents()[1]);
    await settle();
    component.manualEnrollmentForm.controls.player.setValue(player);
    component.manualEnrollmentForm.controls.partner.setValue('Safe Partner');
    await component.createManualEnrollment();
    component.manualEnrollmentForm.controls.partner.setValue(player);
    await component.createManualEnrollment();
    expect(mutate).not.toHaveBeenCalled();
    expect(component.creationError()).toBeTruthy();
  });

  it('does not submit without a sub-event or when guest enrollment is disallowed', async () => {
    const component = fixture.componentInstance;
    component.manualEnrollmentForm.controls.player.setValue(player);
    component.subEventControl.setValue(null);
    await settle();
    await component.createManualEnrollment();
    fixture.componentRef.setInput('tournament', {
      id: 'safe-event',
      allowGuestEnrollments: false,
      tournamentSubEvents: [{ id: 'safe-single', name: 'Safe singles', gameType: 'S' }],
    });
    await settle();
    component.manualEnrollmentForm.controls.isGuest.setValue(true);
    component.manualEnrollmentForm.controls.guestName.setValue('Safe Guest');
    component.manualEnrollmentForm.controls.guestEmail.setValue('safe@example.invalid');
    await component.createManualEnrollment();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('enforces name/email/notes lengths', async () => {
    const controls = fixture.componentInstance.manualEnrollmentForm.controls;
    controls.player.setValue(player);
    controls.notes.setValue('x'.repeat(1001));
    expect(controls.notes.invalid).toBe(true);
    controls.isGuest.setValue(true);
    await settle();
    controls.guestName.setValue('x'.repeat(256));
    controls.guestEmail.setValue(`${'x'.repeat(250)}@example.invalid`);
    expect(controls.guestName.invalid).toBe(true);
    expect(controls.guestEmail.invalid).toBe(true);
    await fixture.componentInstance.createManualEnrollment();
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each([
    ['network failure', () => throwError(() => new Error('Safe creation failure')), 'Safe creation failure'],
    ['missing response', () => of({ data: {} }), 'all.tournament.admin.enrollments.creationNoData'],
  ])('retains inputs and dialog on %s and allows retry', async (_name, response, error) => {
    mutate.mockImplementationOnce(response);
    fixture.componentInstance.manualEnrollmentForm.controls.player.setValue(player);
    await fixture.componentInstance.createManualEnrollment();
    await settle();
    expect(fixture.componentInstance.showManualEnrollmentDialog()).toBe(true);
    expect(fixture.componentInstance.manualEnrollmentForm.controls.player.value).toEqual(player);
    expect(fixture.componentInstance.creationError()).toBe(error);
    expect(fixture.nativeElement.querySelector('#manual-enrollment-form p-message')?.textContent).toContain(error);
    expect(query).toHaveBeenCalledTimes(1);
    await fixture.componentInstance.createManualEnrollment();
    await settle();
    expect(fixture.componentInstance.showManualEnrollmentDialog()).toBe(false);
  });

  it('locks dismiss and duplicate submission while creation is pending', async () => {
    const pending = new Subject<{ data: { adminEnrollPlayer: { id: string } } }>();
    mutate.mockReturnValueOnce(pending);
    fixture.componentInstance.manualEnrollmentForm.controls.player.setValue(player);
    const first = fixture.componentInstance.createManualEnrollment();
    fixture.componentInstance.closeManualEnrollmentDialog();
    await fixture.componentInstance.createManualEnrollment();
    expect(fixture.componentInstance.creating()).toBe(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.manualEnrollmentForm.disabled).toBe(true);
    expect(fixture.componentInstance.showManualEnrollmentDialog()).toBe(true);
    expect(mutate).toHaveBeenCalledTimes(1);
    pending.next({ data: { adminEnrollPlayer: { id: 'safe-enrollment' } } });
    pending.complete();
    await first;
    await settle();
    expect(fixture.componentInstance.creating()).toBe(false);
    expect(fixture.componentInstance.showManualEnrollmentDialog()).toBe(false);
  });

  it('searches names/member IDs through the actual bounded players query', async () => {
    await fixture.componentInstance.searchManualPlayers('player', 'Safe 100%');
    expect(fixture.componentInstance.suggestions().player).toEqual([player, partner]);
    const { where, order, take } = query.mock.lastCall[0].variables.args;
    expect(where).toHaveLength(9);
    expect(where).toContainEqual({ AND: [{ firstName: { ilike: '%Safe%' } }, { lastName: { ilike: '%100\\%%' } }] });
    expect(order).toEqual({ lastName: 'ASC', firstName: 'ASC' });
    expect(take).toBe(20);
    query.mockClear();
    await fixture.componentInstance.searchManualPlayers('player', 'a');
    expect(query).not.toHaveBeenCalled();
    expect(fixture.componentInstance.suggestions().player).toEqual([]);
  });

  it('ignores older search responses and responses after closing/reopening', async () => {
    const pending = new Subject<{ data: { players: (typeof player)[] } }>();
    query.mockReturnValueOnce(pending);
    const first = fixture.componentInstance.searchManualPlayers('player', 'Old');
    await fixture.componentInstance.searchManualPlayers('player', 'New');
    pending.next({ data: { players: [] } });
    pending.complete();
    await first;
    expect(fixture.componentInstance.suggestions().player).toHaveLength(2);
    const closed = new Subject<{ data: { players: (typeof player)[] } }>();
    query.mockReturnValueOnce(closed);
    const second = fixture.componentInstance.searchManualPlayers('partner', 'Partner');
    fixture.componentInstance.closeManualEnrollmentDialog();
    fixture.componentInstance.openManualEnrollmentDialog();
    closed.next({ data: { players: [partner] } });
    closed.complete();
    await second;
    expect(fixture.componentInstance.suggestions().partner).toEqual([]);
  });

  it('shows search errors explicitly and resets the error for retry', async () => {
    query.mockReturnValueOnce(throwError(() => new Error('Safe search failure')));
    await fixture.componentInstance.searchManualPlayers('player', 'Safe');
    expect(fixture.componentInstance.searchErrors().player).toBe('Safe search failure');
    query.mockReturnValueOnce(of({ data: {} }));
    await fixture.componentInstance.searchManualPlayers('player', 'Safe');
    expect(fixture.componentInstance.searchErrors().player).toBe('all.tournament.admin.enrollments.playerSearchNoData');
    await fixture.componentInstance.searchManualPlayers('player', 'Safe');
    expect(fixture.componentInstance.searchErrors().player).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('renders meaningful %s dialog labels and actions', async (locale) => {
    const asset = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: asset });
    translate.use(locale);
    await settle();
    const labels = asset.tournament.admin.enrollments;
    for (const key of [
      'addEnrollment',
      'addManualEnrollment',
      'enrollAsGuest',
      'guestEmail',
      'guestName',
      'manualEnrollmentDescription',
      'manualInvalid',
      'manualRequired',
      'playerSearch',
      'playerSearchHelp',
      'partnerSearch',
    ]) {
      expect(labels[key]?.trim()).toBeTruthy();
    }
    const dialog: HTMLElement = fixture.nativeElement.querySelector('p-dialog');
    expect(dialog.textContent).toContain(labels.addManualEnrollment);
    expect(dialog.textContent).toContain(labels.addEnrollment);
    expect(dialog.textContent).toContain(labels.playerSearchHelp);
    expect(dialog.textContent).not.toContain('all.');
  });
});

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
    query = jest.fn(({ variables }: { variables: { args: { where: Array<{ status?: { eq: EnrollmentStatus } }> } } }) =>
      of({
        data: {
          tournamentEnrollments: enrollments.filter((entry) => !variables.args.where[0].status || entry.status === variables.args.where[0].status.eq),
        },
      }),
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
    expect(query.mock.calls[0][0].variables).toEqual({
      args: { where: [{ tournamentSubEventId: { eq: 'safe-single' } }], order: { createdAt: 'ASC' } },
    });
    expect(ids()).toEqual(['player', 'guest', 'partner']);
    expect(fixture.nativeElement.querySelector('p-table')).not.toBeNull();
    expect(fixture.componentInstance.isDoublesEvent()).toBe(false);
  });

  it('switches sub-events and the doubles columns without requiring a refresh', async () => {
    fixture.componentInstance.subEventControl.setValue(fixture.componentInstance.subEvents()[1]);
    await settle();
    expect(fixture.componentInstance.selectedSubEvent()?.id).toBe('safe-double');
    expect(query.mock.lastCall[0].variables.args.where[0].tournamentSubEventId).toEqual({ eq: 'safe-double' });
    expect(fixture.componentInstance.isDoublesEvent()).toBe(true);
  });

  it.each([null, ...Object.values(EnrollmentStatus)])('sends the selected status %s without changing its enum value', async (status) => {
    fixture.componentInstance.statusFilter.setValue(status);
    await settle();
    expect(query.mock.lastCall[0].variables.args.where).toEqual([
      { tournamentSubEventId: { eq: 'safe-single' }, ...(status ? { status: { eq: status } } : {}) },
    ]);
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
    expect(query.mock.lastCall[0].variables.args.where).toEqual([
      { tournamentSubEventId: { eq: 'safe-single' }, status: { eq: EnrollmentStatus.CONFIRMED } },
    ]);
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

  it('renders one empty native table with the appropriate singles/doubles column span', async () => {
    fixture.componentInstance.searchControl.setValue('not present');
    await settle();
    let table: HTMLElement = fixture.nativeElement.querySelector('[data-testid="enrollment-table"] table');
    expect(table.querySelector('caption')?.textContent?.trim()).toBe('Safe singles');
    expect(table.querySelectorAll('thead th[scope="col"]')).toHaveLength(5);
    expect(table.querySelector('tbody td')?.getAttribute('colspan')).toBe('5');
    expect(table.querySelectorAll('p-message')).toHaveLength(1);
    fixture.componentInstance.subEventControl.setValue(fixture.componentInstance.subEvents()[1]);
    await settle();
    table = fixture.nativeElement.querySelector('[data-testid="enrollment-table"] table');
    expect(table.querySelectorAll('thead th[scope="col"]')).toHaveLength(6);
    expect(table.querySelector('tbody td')?.getAttribute('colspan')).toBe('6');
  });

  it.each([
    ['network failure', () => throwError(() => new Error('Safe enrollment query failure')), 'Safe enrollment query failure'],
    ['missing response data', () => of({ data: {} }), 'all.tournament.admin.enrollments.queryNoData'],
    ['null list', () => of({ data: { tournamentEnrollments: null } }), 'all.tournament.admin.enrollments.queryNoData'],
  ])('shows explicit %s feedback with safe selectors and recovers using refresh', async (_name, response, message) => {
    query.mockImplementationOnce(response);
    fixture.componentInstance.refetch();
    await settle();
    expect(fixture.componentInstance.error()).toBe(message);
    expect(fixture.componentInstance.enrollments()).toEqual([]);
    expect(fixture.componentInstance.stats().total).toBe(0);
    const panel: HTMLElement = fixture.nativeElement.querySelector('[data-testid="enrollment-table"]');
    expect(panel.querySelector('p-message')?.textContent).toContain(message);
    expect(panel.querySelector('p-table')).toBeNull();
    expect(panel.textContent).not.toContain('all.tournament.admin.enrollments.noEnrollments');
    fixture.nativeElement.querySelector('[data-testid="enrollment-filters"] p-button button').click();
    await settle();
    expect(fixture.componentInstance.error()).toBeNull();
    expect(ids()).toEqual(['player', 'guest', 'partner']);
    expect(panel.querySelector('p-table')).not.toBeNull();
  });

  it('names native loading progress and avoids empty-success feedback while loading', async () => {
    const response = new Subject<{ data: { tournamentEnrollments: TournamentEnrollment[] } }>();
    query.mockReturnValueOnce(response);
    fixture.componentInstance.refetch();
    fixture.detectChanges();
    expect(fixture.componentInstance.loading()).toBe(true);
    expect(fixture.nativeElement.querySelector('p-progressbar')?.getAttribute('aria-label')).toBe('all.loading.players');
    expect(fixture.nativeElement.querySelector('[data-testid="enrollment-table"]')?.getAttribute('aria-busy')).toBe('true');
    expect(fixture.nativeElement.querySelector('[data-testid="enrollment-table"] p-table')).toBeNull();
    response.next({ data: { tournamentEnrollments: [] } });
    response.complete();
    await settle();
    expect(fixture.nativeElement.querySelector('p-progressbar')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="enrollment-table"] p-table p-message')).not.toBeNull();
  });

  it('preserves safe row identity, status, position, visible notes and named gated actions', async () => {
    const rows = [
      {
        id: 'waiting',
        status: EnrollmentStatus.WAITING_LIST,
        waitingListPosition: 2,
        notes: 'Safe multiline\nnotes',
        player: { fullName: 'Safe Player', memberId: 'SAFE-123' },
      },
      {
        id: 'guest',
        status: EnrollmentStatus.PENDING,
        isGuest: true,
        guestName: 'Safe Guest',
        guestEmail: 'guest@example.invalid',
        preferredPartner: { fullName: 'Safe Preferred' },
      },
      { id: 'confirmed', status: EnrollmentStatus.CONFIRMED, confirmedPartner: { fullName: 'Safe Partner' } },
      { id: 'cancelled', status: EnrollmentStatus.CANCELLED },
      { id: 'withdrawn', status: EnrollmentStatus.WITHDRAWN },
    ];
    query.mockReturnValueOnce(of({ data: { tournamentEnrollments: rows } }));
    fixture.componentInstance.subEventControl.setValue(fixture.componentInstance.subEvents()[1]);
    await settle();
    const table: HTMLElement = fixture.nativeElement.querySelector('[data-testid="enrollment-table"] table');
    expect(table.textContent).toContain('SAFE-123');
    expect(table.textContent).toContain('guest@example.invalid');
    expect(table.textContent).toContain('Safe Preferred (all.tournament.admin.enrollments.preferred)');
    expect(table.textContent).toContain('Safe Partner');
    expect(table.querySelector('td.whitespace-pre-wrap')?.textContent).toContain('Safe multiline\nnotes');
    expect(table.querySelectorAll('tbody tr')[0].querySelectorAll('p-tag')[1]?.textContent?.trim()).toBe('2');
    expect(table.querySelectorAll('tbody tr')[0].querySelectorAll('button')).toHaveLength(2);
    expect(table.querySelectorAll('tbody tr')[3].querySelectorAll('button')).toHaveLength(0);
    expect(table.querySelectorAll('tbody tr')[4].querySelectorAll('button')).toHaveLength(0);
    const names = Array.from(table.querySelectorAll('button')).map((button) => button.getAttribute('aria-label'));
    expect(names).toContain('all.tournament.admin.enrollments.promoteFromWaitingList: Safe Player');
    expect(names).toContain('all.tournament.admin.enrollments.cancel: Safe Player');
    fixture.componentInstance.updating.set(true);
    await settle();
    expect(Array.from(table.querySelectorAll('button')).every((button) => button.disabled)).toBe(true);
  });

  it('paginates locally with ten rows and retains the native 10/25/50 options', async () => {
    query.mockReturnValueOnce(
      of({
        data: {
          tournamentEnrollments: Array.from({ length: 26 }, (_, index) => ({
            id: `safe-${index}`,
            status: EnrollmentStatus.CONFIRMED,
            player: { fullName: `Safe Player ${index}` },
          })),
        },
      }),
    );
    fixture.componentInstance.refetch();
    await settle();
    const panel: HTMLElement = fixture.nativeElement.querySelector('[data-testid="enrollment-table"]');
    expect(panel.querySelectorAll('tbody tr')).toHaveLength(10);
    expect(panel.querySelector('tbody')?.textContent).toContain('Safe Player 0');
    (panel.querySelector('.p-paginator-next') as HTMLButtonElement).click();
    await settle();
    expect(panel.querySelector('tbody')?.textContent).toContain('Safe Player 10');
    expect(panel.querySelector('tbody')?.textContent).not.toContain('Safe Player 0');
    expect(panel.querySelector('p-paginator p-select')).not.toBeNull();
    expect(query).toHaveBeenCalledTimes(2);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('associates native controls with meaningful %s labels', async (locale) => {
    const assetPath = join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: {
      common: { search: string };
      button: { refresh: string; add: string };
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
      ...['allStatuses', 'confirmed', 'pending', 'waitingList', 'cancelled', 'withdrawn'].map((key) => asset.tournament.admin.enrollments[key]),
    ]);
    expect(filters.querySelector('[style]:not(.p-panel-content-container)')).toBeNull();
    const panel: HTMLElement = fixture.nativeElement.querySelector('[data-testid="enrollment-table"]');
    expect(panel.querySelector('p-button button')?.textContent?.trim()).toBe(asset.button.add);
    expect(panel.querySelector('thead')?.textContent).not.toContain('all.');
    expect(panel.querySelector('thead th:nth-child(3)')?.textContent?.trim()).not.toBe('');
    expect(panel.querySelector('p-tag')?.textContent?.trim()).toBe(asset.tournament.admin.enrollments.confirmed);
  });
});

describe('Enrollment-management locale completeness', () => {
  let fixture: ComponentFixture<EnrollmentsTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;

  beforeEach(async () => {
    query = jest.fn(() => of({ data: { tournamentEnrollments: [] } }));
    mutate = jest.fn(() => of({ data: { cancelEnrollment: { id: 'safe-entry' }, promoteFromWaitingList: { id: 'safe-entry' } } }));
    await TestBed.configureTestingModule({
      imports: [EnrollmentsTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(EnrollmentsTabComponent);
    fixture.componentRef.setInput('tournament', {
      id: 'safe-event',
      tournamentSubEvents: [{ id: 'safe-double', name: 'Safe doubles', gameType: 'D' }],
    });
    await settle();
  });

  afterEach(() => jest.restoreAllMocks());

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function useLocale(locale: string) {
    const asset: { common: { unknown: string }; tournament: { admin: { enrollments: Record<string, string> } } } = JSON.parse(
      readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'),
    );
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: asset });
    translate.use(locale);
    await settle();
    return asset;
  }

  it.each(['en', 'nl_BE', 'fr_BE'])('covers every mounted enrollment key in %s without blank values', async (locale) => {
    const asset = await useLocale(locale);
    const labels = asset.tournament.admin.enrollments;
    const sourceRoot = join(process.cwd(), 'libs', 'frontend', 'pages', 'tournament', 'src', 'pages', 'admin', 'tabs', 'enrollments');
    const keys = ['component.ts', 'component.html', 'service.ts'].flatMap((suffix) =>
      Array.from(
        readFileSync(join(sourceRoot, `enrollments-tab.${suffix}`), 'utf8').matchAll(/all\.tournament\.admin\.enrollments\.([a-zA-Z]+)/g),
        (match) => match[1],
      ),
    );
    const dynamicKeys = [
      'totalDescription',
      'confirmedDescription',
      'pendingDescription',
      'waitingListDescription',
      'cancelledDescription',
      'playerSearch',
      'partnerSearch',
      'playerSearchPlaceholder',
      'partnerSearchPlaceholder',
    ];
    for (const key of new Set([...keys, ...dynamicKeys])) {
      expect({ key, meaningful: typeof labels[key] === 'string' && labels[key].trim().length > 0 }).toEqual({ key, meaningful: true });
    }
    expect(Array.from(fixture.nativeElement.querySelectorAll('dl dd:last-of-type'), (cell: Element) => cell.textContent?.trim())).toEqual(
      dynamicKeys.slice(0, 5).map((key) => labels[key]),
    );
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('localizes %s statuses, identities and both confirmation decisions without changing payloads', async (locale) => {
    const asset = await useLocale(locale);
    const labels = asset.tournament.admin.enrollments;
    const component = fixture.componentInstance;
    const requestCount = query.mock.calls.length;
    expect(component.statusOptions().map((option) => option.value)).toEqual([
      null,
      EnrollmentStatus.CONFIRMED,
      EnrollmentStatus.PENDING,
      EnrollmentStatus.WAITING_LIST,
      EnrollmentStatus.CANCELLED,
      EnrollmentStatus.WITHDRAWN,
    ]);
    expect(component.getStatusLabel(EnrollmentStatus.WITHDRAWN)).toBe(labels.withdrawn);
    const row = Object.assign(new TournamentEnrollment(), {
      id: 'safe-entry',
      status: EnrollmentStatus.WAITING_LIST,
      isGuest: true,
      guestName: 'Safe Guest',
      preferredPartner: { fullName: 'Safe Preferred' },
    });
    expect(component.getPlayerName(row)).toBe(`Safe Guest (${labels.guest})`);
    expect(component.getPartnerName(row)).toBe(`Safe Preferred (${labels.preferred})`);
    expect(component.getPlayerName(new TournamentEnrollment())).toBe(asset.common.unknown);
    row.confirmedPartner = Object.defineProperty(new Player(), 'fullName', { value: undefined });
    expect(component.getPartnerName(row)).toBe(asset.common.unknown);
    const prompt = jest.spyOn(globalThis, 'confirm').mockReturnValue(false);
    await component.cancelEnrollment(row);
    await component.promoteFromWaitingList(row);
    const playerName = component.getPlayerName(row);
    expect(prompt.mock.calls.map(([message]) => message)).toEqual(
      ['confirmCancelPlayer', 'confirmPromotePlayer'].map((key) => labels[key].replace('{{playerName}}', playerName)),
    );
    expect(mutate).not.toHaveBeenCalled();
    expect(query).toHaveBeenCalledTimes(requestCount);
    prompt.mockReturnValue(true);
    await component.cancelEnrollment(row);
    await component.promoteFromWaitingList(row);
    await settle();
    expect(mutate.mock.calls.map(([options]) => options.variables)).toEqual([{ enrollmentId: row.id }, { enrollmentId: row.id }]);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('shows explicit localized %s local failures and preserves server diagnostics', async (locale) => {
    const labels = (await useLocale(locale)).tournament.admin.enrollments;
    const component = fixture.componentInstance;
    query.mockReturnValueOnce(of({ data: {} }));
    component.refetch();
    await settle();
    expect(component.error()).toBe(labels.queryNoData);
    component.openManualEnrollmentDialog();
    await settle();
    query.mockReturnValueOnce(of({ data: {} }));
    await component.searchManualPlayers('player', 'Safe');
    expect(component.searchErrors().player).toBe(labels.playerSearchNoData);
    component.manualEnrollmentForm.controls.player.setValue({ id: 'safe-player', fullName: 'Safe Player' });
    mutate.mockReturnValueOnce(of({ data: {} }));
    await component.createManualEnrollment();
    expect(component.creationError()).toBe(labels.creationNoData);
    expect(component.showManualEnrollmentDialog()).toBe(true);
    mutate.mockReturnValueOnce(throwError(() => 'safe non-Error failure'));
    await component.createManualEnrollment();
    expect(component.creationError()).toBe(labels.creationFailed);
    mutate.mockReturnValueOnce(throwError(() => new Error('Safe server detail')));
    await component.createManualEnrollment();
    expect(component.creationError()).toBe('Safe server detail');
    const prompt = jest.spyOn(globalThis, 'confirm').mockReturnValue(true);
    const row = Object.assign(new TournamentEnrollment(), { id: 'safe-entry', player: { fullName: 'Safe Player' } });
    mutate.mockReturnValueOnce(throwError(() => 'safe non-Error failure'));
    await component.cancelEnrollment(row);
    expect(component.updateError()).toBe(labels.cancelFailed);
    mutate.mockReturnValueOnce(throwError(() => 'safe non-Error failure'));
    await component.promoteFromWaitingList(row);
    expect(component.updateError()).toBe(labels.promoteFailed);
    expect(prompt).toHaveBeenCalledTimes(2);
  });

  it('reacts to all three locales while retaining a selected Withdrawn filter without refetching', async () => {
    const component = fixture.componentInstance;
    component.statusFilter.setValue(EnrollmentStatus.WITHDRAWN);
    await settle();
    const requestCount = query.mock.calls.length;
    for (const locale of ['en', 'nl_BE', 'fr_BE', 'nl_BE']) {
      const labels = (await useLocale(locale)).tournament.admin.enrollments;
      expect(component.statusFilter.value).toBe(EnrollmentStatus.WITHDRAWN);
      expect(component.getStatusLabel(EnrollmentStatus.WITHDRAWN)).toBe(labels.withdrawn);
      expect(fixture.nativeElement.querySelector('#admin-enrollment-status')?.textContent).toContain(labels.withdrawn);
    }
    expect(query).toHaveBeenCalledTimes(requestCount);
    expect(mutate).not.toHaveBeenCalled();
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
      providers: [{ provide: Apollo, useValue: { query: jest.fn(() => of({ data: { tournamentEnrollments: [] } })), mutate } }],
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
    expect(Array.from(element.querySelectorAll('dl dt, dl dd:last-of-type')).every((cell) => !!cell.textContent?.trim())).toBe(true);
  });
});
