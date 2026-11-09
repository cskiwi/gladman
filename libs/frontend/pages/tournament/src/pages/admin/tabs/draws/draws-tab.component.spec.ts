import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { DrawsTabComponent } from './draws-tab.component';

describe('Draw lists and actions', () => {
  let fixture: ComponentFixture<DrawsTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const entries = [
    { id: 'safe-seeded', seed: 2, player1: { fullName: 'Safe Player One' }, player2: { fullName: 'Safe Partner' } },
    { id: 'safe-unseeded', player1: { fullName: 'Safe Player Two' } },
  ];
  const draws = [
    { id: 'safe-ko', name: 'Safe knockout', type: 'KO', size: 8, entries },
    { id: 'safe-poule', name: 'Safe poule', type: 'POULE', entries: [] },
    { id: 'safe-qualification', name: 'Safe qualification', type: 'QUALIFICATION' },
    { id: 'safe-other', name: 'Safe other', entries: [] },
  ];
  const response = { data: { tournamentSubEvent: { entries, unassignedEntries: [], drawTournaments: draws } } };

  beforeEach(async () => {
    query = jest.fn(() => of(response));
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [DrawsTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(DrawsTabComponent);
    fixture.componentRef.setInput('tournament', {
      id: 'safe-tournament',
      tournamentSubEvents: [{ id: 'safe-singles', name: 'Safe singles', gameType: 'S' }],
    });
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function panels(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[data-testid="draw"]'));
  }

  function actions(index = 0): HTMLButtonElement[] {
    return Array.from(panels()[index].querySelectorAll('p-button button'));
  }

  it('uses named native Panels and a scrolling Table with identity, capacity and original seed order', async () => {
    await settle();
    expect(panels()).toHaveLength(4);
    expect(panels().every((panel) => panel.tagName === 'P-PANEL')).toBe(true);
    const first = panels()[0];
    expect(first.querySelector('.p-panel-title')?.textContent).toBe('Safe knockout');
    expect(first.querySelector('[role="region"]')?.getAttribute('aria-labelledby')).toBe(first.querySelector('.p-panel-title')?.id);
    expect(first.textContent).toContain('2 / 8 all.tournament.entries');
    expect(panels()[1].textContent).toContain('0 / ∞ all.tournament.entries');
    expect(first.querySelector('.p-datatable-table-container')?.getAttribute('style')).toContain('14rem');
    expect(first.querySelector('p-table')?.classList.contains('p-datatable-sm')).toBe(true);
    expect(
      Array.from(first.querySelectorAll('thead th'))
        .slice(0, 2)
        .every((th) => th.classList.contains('whitespace-nowrap')),
    ).toBe(true);
    expect(Array.from(first.querySelectorAll('thead th'), (th) => th.getAttribute('scope'))).toEqual(['col', 'col', 'col']);
    expect(Array.from(first.querySelectorAll('tbody tr td:first-child'), (td) => td.textContent?.trim())).toEqual(['2', '—']);
    expect(first.querySelector('tbody')?.textContent).toContain('Safe Player One');
    expect(first.querySelector('p-card, .rounded-full, .bg-emphasis, .border-surface')).toBeNull();
    expect(panels().map((panel) => panel.querySelector('p-tag')?.textContent?.trim())).toEqual([
      'all.tournament.admin.draws.knockout',
      'all.tournament.admin.draws.roundRobin',
      'all.tournament.admin.draws.qualification',
      'all.common.unknown',
    ]);
    expect(panels().map((panel) => panel.querySelector('p-tag')?.className)).toEqual([
      expect.stringContaining('p-tag-success'),
      expect.stringContaining('p-tag-info'),
      expect.stringContaining('p-tag-warn'),
      expect.stringContaining('p-tag-secondary'),
    ]);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('names every action with its draw or entry context and preserves doubles names', async () => {
    fixture.componentRef.setInput('tournament', {
      id: 'safe-tournament',
      tournamentSubEvents: [{ id: 'safe-doubles', name: 'Safe doubles', gameType: 'D' }],
    });
    await settle();
    expect(actions().map((button) => button.getAttribute('aria-label'))).toEqual([
      'all.tournament.admin.draws.autoSeed: Safe knockout',
      'all.tournament.admin.draws.clearSeeds: Safe knockout',
      'all.tournament.admin.draws.deleteDraw: Safe knockout',
      'all.tournament.admin.draws.removeFromDraw: Safe Player One / Safe Partner',
      'all.tournament.admin.draws.removeFromDraw: Safe Player Two',
    ]);
    expect(panels()[0].querySelector('tbody')?.textContent).toContain('Safe Player One / Safe Partner');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('opens the existing seeding dialog for the correct draw without a mutation', async () => {
    await settle();
    actions()[0].click();
    await settle();
    expect(fixture.componentInstance.seedingDrawId()).toBe('safe-ko');
    expect(fixture.componentInstance.seedingMethod.value).toBe('BY_RANKING');
    expect(fixture.componentInstance.showSeedingDialog()).toBe(true);
    fixture.componentInstance.showSeedingDialog.set(false);
    await settle();
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each([
    { action: 1, data: { clearDrawSeeds: entries }, variables: { drawId: 'safe-ko' } },
    { action: 2, data: { deleteTournamentDraw: true }, variables: { drawId: 'safe-ko' } },
    { action: 3, data: { removeEntryFromDraw: entries[0] }, variables: { input: { entryId: 'safe-seeded' } } },
  ])('preserves action $action payload and refetches only after mock success', async ({ action, data, variables }) => {
    await settle();
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(true);
    mutate.mockReturnValueOnce(of({ data }));
    try {
      actions()[action].click();
      await settle();
      expect(mutate).toHaveBeenCalledTimes(1);
      expect(mutate.mock.calls[0][0].variables).toEqual(variables);
      expect(query).toHaveBeenCalledTimes(2);
      expect(confirm).toHaveBeenCalledTimes(action === 3 ? 0 : 1);
    } finally {
      confirm.mockRestore();
    }
  });

  it('preserves clear/delete cancellation without mutations or extra reads', async () => {
    await settle();
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false);
    try {
      actions()[1].click();
      actions()[2].click();
      await settle();
      expect(confirm).toHaveBeenCalledTimes(2);
      expect(mutate).not.toHaveBeenCalled();
      expect(query).toHaveBeenCalledTimes(1);
    } finally {
      confirm.mockRestore();
    }
  });

  it('disables empty-draw seeding actions while retaining delete and explicit assigned-empty text', async () => {
    await settle();
    expect(actions(1).map((button) => button.disabled)).toEqual([true, true, false]);
    expect(actions(2).map((button) => button.disabled)).toEqual([true, true, false]);
    expect(panels()[1].querySelector('p-table')).toBeNull();
    expect(panels()[1].textContent).toContain('all.tournament.admin.draws.noEntriesAssigned');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('guards draw actions and shows native removal loading during a pending mutation', async () => {
    await settle();
    const pending = new Subject<{ data: { removeEntryFromDraw: (typeof entries)[number] } }>();
    mutate.mockReturnValueOnce(pending);
    actions()[3].click();
    fixture.detectChanges();
    expect(actions().every((button) => button.disabled)).toBe(true);
    expect(actions(1).every((button) => button.disabled)).toBe(true);
    expect(actions()[3].querySelector('[data-pc-section="loadingicon"]')).not.toBeNull();
    pending.next({ data: { removeEntryFromDraw: entries[0] } });
    pending.complete();
    await settle();
    await settle();
    expect(actions().every((button) => !button.disabled)).toBe(true);
    expect(mutate).toHaveBeenCalledTimes(1);
  });

  it('retains the populated list and retry controls after explicit update failure', async () => {
    await settle();
    mutate.mockReturnValueOnce(throwError(() => new Error('Safe removal failure')));
    actions()[3].click();
    await settle();
    expect(fixture.nativeElement.textContent).toContain('Safe removal failure');
    expect(panels()[0].querySelectorAll('tbody tr')).toHaveLength(2);
    expect(actions().every((button) => !button.disabled)).toBe(true);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('renders native no-draw and no-selection feedback without decorative surfaces', async () => {
    query.mockReturnValueOnce(of({ data: { tournamentSubEvent: { entries: [], unassignedEntries: [], drawTournaments: [] } } }));
    await settle();
    const empty: HTMLElement = fixture.nativeElement.querySelector('[data-testid="empty-draw-list"]');
    expect(empty.tagName).toBe('P-PANEL');
    expect(empty.textContent).toContain('all.tournament.admin.draws.noDrawsYet');
    empty.querySelector<HTMLButtonElement>('button')?.click();
    await settle();
    expect(fixture.componentInstance.showCreateDrawDialog()).toBe(true);
    fixture.componentInstance.showCreateDrawDialog.set(false);
    fixture.componentRef.setInput('tournament', { id: 'safe-empty', tournamentSubEvents: [] });
    await settle();
    const noSelection: HTMLElement = fixture.nativeElement.querySelector('[data-testid="draw-no-selection"]');
    expect(noSelection.tagName).toBe('P-MESSAGE');
    expect(noSelection.textContent).toContain('all.tournament.admin.draws.selectSubEventFirst');
    expect(panels()).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('[data-testid="draw-list"]')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('hides the list and false empty feedback while loading or after read failure', async () => {
    const pending = new Subject<typeof response>();
    query.mockReturnValueOnce(pending);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="draw-list"], [data-testid="draw-no-selection"]')).toBeNull();
    pending.error(new Error('Safe draw read failure'));
    await settle();
    expect(fixture.nativeElement.textContent).toContain('Safe draw read failure');
    expect(fixture.nativeElement.querySelector('[data-testid="draw-list"], [data-testid="draw-no-selection"]')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses nonempty actual %s labels and assigned-empty copy', async (locale) => {
    await settle();
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale);
    await settle();
    const copy = dictionary.tournament.admin.draws;
    for (const key of ['autoSeed', 'clearSeeds', 'deleteDraw', 'removeFromDraw', 'noEntriesAssigned', 'seed']) {
      expect(copy[key]).toBeTruthy();
    }
    expect(actions().map((button) => button.getAttribute('aria-label'))).toEqual([
      `${copy.autoSeed}: Safe knockout`,
      `${copy.clearSeeds}: Safe knockout`,
      `${copy.deleteDraw}: Safe knockout`,
      `${copy.removeFromDraw}: Safe Player One`,
      `${copy.removeFromDraw}: Safe Player Two`,
    ]);
    expect(panels()[1].textContent).toContain(copy.noEntriesAssigned);
    expect(panels()[0].querySelector('thead')?.textContent).toContain(copy.seed);
    expect(panels()[0].querySelector('thead')?.textContent).toContain(dictionary.tournament.entries);
    expect(query).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });
});

describe('Unassigned entry selection and assignment', () => {
  const originalMatchMedia = window.matchMedia;
  let fixture: ComponentFixture<DrawsTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const entries = [
    { id: 'safe-entry-one', player1: { id: 'safe-player-one', fullName: 'Safe Player One' }, player2: { fullName: 'Safe Partner' } },
    { id: 'safe-entry-two', player1: { id: 'safe-player-two', fullName: 'Safe Player Two' } },
  ];
  const draw = { id: 'safe-draw', name: 'Safe draw', type: 'KO', entries: [] };
  const response = { data: { tournamentSubEvent: { entries, unassignedEntries: entries, drawTournaments: [draw] } } };

  beforeEach(async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: jest.fn((media: string) => ({
        matches: false,
        media,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    query = jest.fn(() => of(response));
    mutate = jest.fn(() => of({ data: { assignEntriesToDraw: entries } }));
    await TestBed.configureTestingModule({
      imports: [DrawsTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(DrawsTabComponent);
    fixture.componentRef.setInput('tournament', {
      id: 'safe-tournament',
      tournamentSubEvents: [{ id: 'safe-singles', name: 'Safe singles', gameType: 'S' }],
    });
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function panel(): HTMLElement {
    const element = fixture.nativeElement.querySelector('[data-testid="unassigned-entries"]');
    if (!element) throw new Error('Missing unassigned entries Panel');
    return element;
  }

  function actions(): HTMLButtonElement[] {
    return Array.from(panel().querySelectorAll('p-button button'));
  }

  function checkboxes(): HTMLInputElement[] {
    return Array.from(panel().querySelectorAll('tbody input[type="checkbox"]'));
  }

  it('uses native grouped selection with named actions and no decorative surfaces or icons', async () => {
    await settle();
    expect(panel().tagName).toBe('P-PANEL');
    expect(panel().querySelector('p-table')).not.toBeNull();
    expect(panel().querySelector('p-card, .bg-emphasis, .border-surface, .rounded-full')).toBeNull();
    expect(panel().querySelector('.p-panel-title')?.textContent).toContain('(2)');
    const region = panel().querySelector('[role="region"]');
    expect(region?.getAttribute('aria-labelledby')).toBe(panel().querySelector('.p-panel-title')?.id);
    expect(actions().map((button) => button.getAttribute('aria-label'))).toEqual([
      'all.tournament.admin.checkin.selectAll',
      'all.tournament.admin.checkin.clearSelection',
    ]);
    expect(actions().map((button) => button.disabled)).toEqual([false, true]);
    expect(checkboxes().map((checkbox) => checkbox.getAttribute('aria-label'))).toEqual(['Safe Player One', 'Safe Player Two']);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('toggles a checkbox exactly once and supports native row selection without modifier keys', async () => {
    await settle();
    checkboxes()[0].click();
    await settle();
    expect(fixture.componentInstance.selectedEntries().map((entry) => entry.id)).toEqual(['safe-entry-one']);
    expect(checkboxes().map((checkbox) => checkbox.checked)).toEqual([true, false]);
    panel().querySelectorAll<HTMLTableCellElement>('tbody tr td:last-child')[1].click();
    await settle();
    expect(fixture.componentInstance.selectedEntries().map((entry) => entry.id)).toEqual(['safe-entry-one', 'safe-entry-two']);
    checkboxes()[0].click();
    await settle();
    expect(fixture.componentInstance.selectedEntries().map((entry) => entry.id)).toEqual(['safe-entry-two']);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('selects all, clears selection and binds a fluid named target selector to reset state', async () => {
    await settle();
    actions()[0].click();
    await settle();
    expect(fixture.componentInstance.selectedEntries()).toEqual(entries);
    expect(checkboxes().every((checkbox) => checkbox.checked)).toBe(true);
    expect(panel().querySelector('label')?.htmlFor).toBe('assignmentDraw');
    expect(panel().querySelector('[role="combobox"]')?.getAttribute('aria-label')).toBe('all.tournament.admin.draws.selectDraw');
    expect(panel().querySelector('p-select')?.classList.contains('p-select-fluid')).toBe(true);
    expect(actions()[2].disabled).toBe(true);
    expect(actions()[2].textContent).toContain('2');
    fixture.componentInstance.targetDrawId.set(draw.id);
    await settle();
    expect(panel().querySelector('p-select')?.textContent).toContain(draw.name);
    expect(actions()[2].disabled).toBe(false);
    fixture.componentInstance.targetDrawId.set(null);
    await settle();
    expect(panel().querySelector('p-select')?.textContent).not.toContain(draw.name);
    actions()[1].click();
    await settle();
    expect(fixture.componentInstance.selectedEntries()).toEqual([]);
    expect(checkboxes().every((checkbox) => !checkbox.checked)).toBe(true);
    expect(panel().querySelector('p-select')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('supports keyboard row selection and roving focus with native row indices', async () => {
    await settle();
    const rows = panel().querySelectorAll<HTMLTableRowElement>('tbody tr');
    rows[1].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true }));
    await settle();
    expect(fixture.componentInstance.selectedEntries().map((entry) => entry.id)).toEqual(['safe-entry-two']);
    expect(checkboxes().map((checkbox) => checkbox.checked)).toEqual([false, true]);
    expect(rows[1].tabIndex).toBe(0);
    expect(rows[0].tabIndex).toBe(-1);
    rows[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
    await settle();
    expect(fixture.componentInstance.selectedEntries()).toEqual([]);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('synchronizes target selection from the native overlay', async () => {
    await settle();
    actions()[0].click();
    await settle();
    panel().querySelector<HTMLElement>('[role="combobox"]')?.click();
    await settle();
    const option = panel().querySelector<HTMLElement>('[role="option"]');
    expect(option?.textContent).toContain(draw.name);
    option?.click();
    await settle();
    expect(fixture.componentInstance.targetDrawId()).toBe(draw.id);
    expect(actions()[2].disabled).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('preserves both player names for doubles in row text and checkbox names', async () => {
    fixture.componentRef.setInput('tournament', {
      id: 'safe-tournament',
      tournamentSubEvents: [{ id: 'safe-doubles', name: 'Safe doubles', gameType: 'D' }],
    });
    await settle();
    expect(checkboxes()[0].getAttribute('aria-label')).toBe('Safe Player One / Safe Partner');
    expect(panel().querySelector('tbody')?.textContent).toContain('Safe Player One / Safe Partner');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('sends only selected IDs and target, refetches and clears assignment state on success', async () => {
    await settle();
    checkboxes()[1].click();
    fixture.componentInstance.targetDrawId.set(draw.id);
    await settle();
    query.mockReturnValue(of({ data: { tournamentSubEvent: { entries, unassignedEntries: [], drawTournaments: [draw] } } }));
    actions()[2].click();
    await settle();
    await settle();
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.lastCall[0].variables).toEqual({ input: { entryIds: ['safe-entry-two'], drawId: 'safe-draw' } });
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.selectedEntries()).toEqual([]);
    expect(fixture.componentInstance.targetDrawId()).toBeNull();
    expect(panel().textContent).toContain('all.tournament.admin.draws.allEntriesAssigned');
    expect(panel().querySelector('p-select, p-table')).toBeNull();
  });

  it('surfaces assignment failure and preserves selected entries and target for retry', async () => {
    mutate.mockReturnValue(throwError(() => new Error('Safe assignment failure')));
    await settle();
    actions()[0].click();
    fixture.componentInstance.targetDrawId.set(draw.id);
    await settle();
    actions()[2].click();
    await settle();
    expect(fixture.nativeElement.querySelector('p-message')?.textContent).toContain('Safe assignment failure');
    expect(fixture.componentInstance.selectedEntries()).toEqual(entries);
    expect(fixture.componentInstance.targetDrawId()).toBe(draw.id);
    expect(panel().querySelector('p-select')?.textContent).toContain(draw.name);
    expect(actions()[2].disabled).toBe(false);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('disables selection, target and duplicate assignment while an update is pending', async () => {
    const pending = new Subject<{ data: { assignEntriesToDraw: typeof entries } }>();
    mutate.mockReturnValue(pending);
    await settle();
    actions()[0].click();
    fixture.componentInstance.targetDrawId.set(draw.id);
    await settle();
    actions()[2].click();
    fixture.detectChanges();
    expect(actions().every((button) => button.disabled)).toBe(true);
    expect(checkboxes().every((checkbox) => checkbox.disabled)).toBe(true);
    expect(panel().querySelector('[role="combobox"]')?.getAttribute('aria-disabled')).toBe('true');
    panel().querySelector<HTMLTableCellElement>('tbody td:last-child')?.click();
    expect(fixture.componentInstance.selectedEntries()).toEqual(entries);
    pending.next({ data: { assignEntriesToDraw: entries } });
    pending.complete();
    await settle();
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.selectedEntries()).toEqual([]);
  });

  it('does not assign without both a target and selected entries', async () => {
    await settle();
    await fixture.componentInstance.assignSelectedToDraw();
    fixture.componentInstance.targetDrawId.set(draw.id);
    await fixture.componentInstance.assignSelectedToDraw();
    fixture.componentInstance.targetDrawId.set(null);
    actions()[0].click();
    await settle();
    await fixture.componentInstance.assignSelectedToDraw();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('shows the genuine no-entries message and disabled named bulk controls', async () => {
    query.mockReturnValue(of({ data: { tournamentSubEvent: { entries: [], unassignedEntries: [], drawTournaments: [] } } }));
    await settle();
    expect(panel().textContent).toContain('all.tournament.admin.draws.noEntriesYet');
    expect(panel().textContent).not.toContain('all.tournament.admin.draws.allEntriesAssigned');
    expect(actions().every((button) => button.disabled)).toBe(true);
    expect(panel().querySelector('p-table, p-select')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses nonempty actual %s copy and names without additional reads', async (locale) => {
    await settle();
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale);
    await settle();
    const copy = dictionary.tournament.admin;
    expect(copy.checkin.selectAll).toBeTruthy();
    expect(copy.checkin.clearSelection).toBeTruthy();
    expect(dictionary.tournament.entries).toBeTruthy();
    expect(copy.draws.selectDraw).toBeTruthy();
    expect(panel().textContent).toContain(copy.draws.unassignedEntries);
    expect(actions()[0].getAttribute('aria-label')).toBe(copy.checkin.selectAll);
    expect(actions()[1].getAttribute('aria-label')).toBe(copy.checkin.clearSelection);
    expect(panel().querySelector('thead')?.textContent).toContain(dictionary.tournament.entries);
    actions()[0].click();
    await settle();
    expect(panel().querySelector('label')?.textContent).toBe(copy.draws.selectDraw);
    expect(actions()[2].textContent).toContain(copy.draws.assign);
    expect(query).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });
});

describe('Draw selection and read prerequisite', () => {
  let fixture: ComponentFixture<DrawsTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const subEvents = [
    { id: 'safe-singles', name: 'Safe singles' },
    { id: 'safe-doubles', name: 'Safe doubles' },
  ];
  const response = { data: { tournamentSubEvent: { entries: [], unassignedEntries: [], drawTournaments: [] } } };

  beforeEach(async () => {
    query = jest.fn(() => of(response));
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [DrawsTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(DrawsTabComponent);
    fixture.componentRef.setInput('tournament', { id: 'safe-tournament', tournamentSubEvents: subEvents });
  });

  afterEach(() => {
    expect(mutate).not.toHaveBeenCalled();
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function refresh(): HTMLButtonElement {
    const button = fixture.nativeElement.querySelector('button[aria-label="all.button.refresh"]');
    if (!button) throw new Error('Missing draw refresh action');
    return button;
  }

  function summaryValues(): string[] {
    const values: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('[data-testid="draws-summary"] dd.tabular-nums');
    return Array.from(values, (value) => value.textContent?.trim() ?? '');
  }

  function filterActions(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[data-testid="draw-filters"] p-button button'));
  }

  it('uses a native filter Panel and fluid named selector without nested cards or custom surfaces', async () => {
    await settle();
    const filters: HTMLElement = fixture.nativeElement.querySelector('[data-testid="draw-filters"]');
    expect(filters.tagName).toBe('P-PANEL');
    expect(filters.textContent).toContain('all.games.filters');
    expect(filters.querySelector('p-card, .bg-emphasis, .border-surface')).toBeNull();
    expect(filters.querySelector('p-select')?.classList.contains('p-select-fluid')).toBe(true);
    expect(filters.querySelector('label')?.htmlFor).toBe('drawSubEvent');
    expect(filters.querySelector('[role="combobox"]')?.getAttribute('aria-label')).toBe('all.tournament.admin.draws.subEvent');
    expect(filterActions()).toHaveLength(3);
    expect(filterActions().every((button) => !button.disabled)).toBe(true);
  });

  it('preserves generate/create action wiring without performing operational writes', async () => {
    await settle();
    const generate = jest.spyOn(fixture.componentInstance, 'generateEntries').mockResolvedValue();
    const create = jest.spyOn(fixture.componentInstance, 'openCreateDrawDialog');
    filterActions()[0].click();
    expect(generate).toHaveBeenCalledTimes(1);
    filterActions()[1].click();
    await settle();
    expect(create).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.showCreateDrawDialog()).toBe(true);
    fixture.componentInstance.showCreateDrawDialog.set(false);
    await settle();
  });

  it('disables all filter actions without a selected sub-event', async () => {
    fixture.componentRef.setInput('tournament', { id: 'empty', tournamentSubEvents: [] });
    await settle();
    expect(filterActions().every((button) => button.disabled)).toBe(true);
    expect(query).not.toHaveBeenCalled();
  });

  it('guards generate/create during reads while retaining the same enabled refresh button', async () => {
    const pending = new Subject<typeof response>();
    query.mockReturnValue(pending);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    const actions = filterActions();
    expect(actions.map((button) => button.disabled)).toEqual([true, true, false]);
    pending.next(response);
    pending.complete();
    await settle();
    expect(filterActions()).toEqual(actions);
    expect(actions.every((button) => !button.disabled)).toBe(true);
  });

  it('guards generate/create after read failure while retaining refresh recovery', async () => {
    query.mockReturnValueOnce(throwError(() => new Error('Safe filter read failure')));
    await settle();
    expect(filterActions().map((button) => button.disabled)).toEqual([true, true, false]);
    refresh().click();
    await settle();
    expect(filterActions().every((button) => !button.disabled)).toBe(true);
  });

  it('keeps native generate loading feedback and existing create/refresh availability during updates', async () => {
    await settle();
    fixture.componentInstance.updating.set(true);
    await settle();
    expect(filterActions().map((button) => button.disabled)).toEqual([true, false, false]);
    expect(filterActions()[0].querySelector('[data-pc-section="loadingicon"]')).not.toBeNull();
    fixture.componentInstance.updating.set(false);
    await settle();
    expect(filterActions().every((button) => !button.disabled)).toBe(true);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('preserves actual %s filter labels and values without additional locale reads', async (locale) => {
    await settle();
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale);
    await settle();
    const filters: HTMLElement = fixture.nativeElement.querySelector('[data-testid="draw-filters"]');
    expect(filters.textContent).toContain(dictionary.games.filters);
    expect(filters.querySelector('label')?.textContent?.trim()).toBe(dictionary.tournament.admin.draws.subEvent);
    expect(filterActions()[0].textContent?.trim()).toBe(dictionary.tournament.admin.draws.generateEntries);
    expect(filterActions()[1].textContent?.trim()).toBe(dictionary.tournament.admin.draws.createDraw);
    expect(filterActions()[2].getAttribute('aria-label')).toBe(dictionary.button.refresh);
    expect(fixture.componentInstance.selectedSubEvent()?.id).toBe('safe-singles');
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('renders four semantic zero counts without decorative icons or nested cards', async () => {
    await settle();
    const summary: HTMLElement = fixture.nativeElement.querySelector('[data-testid="draws-summary"]');
    expect(summary.tagName).toBe('P-PANEL');
    expect(summary.querySelectorAll('dl dt')).toHaveLength(4);
    expect(summaryValues()).toEqual(['0', '0', '0', '0']);
    expect(summary.querySelector('i, p-card')).toBeNull();
  });

  it('updates nonzero summary counts on selection and refresh without mutations', async () => {
    query.mockReturnValueOnce(
      of({
        data: {
          tournamentSubEvent: {
            entries: [{ id: 'one' }, { id: 'two' }, { id: 'three' }],
            unassignedEntries: [{ id: 'three' }],
            drawTournaments: [{ id: 'safe-draw', name: 'Safe draw', entries: [] }],
          },
        },
      }),
    );
    await settle();
    expect(summaryValues()).toEqual(['3', '2', '1', '1']);
    fixture.componentInstance.subEventControl.setValue(fixture.componentInstance.subEvents()[1]);
    await settle();
    expect(summaryValues()).toEqual(['0', '0', '0', '0']);
    refresh().click();
    await settle();
    expect(summaryValues()).toEqual(['0', '0', '0', '0']);
    expect(query).toHaveBeenCalledTimes(3);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('preserves actual %s summary copy across locale changes without querying again', async (locale) => {
    await settle();
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale);
    await settle();
    const groups: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('[data-testid="draws-summary"] dl > div');
    fixture.componentInstance.summaryItems.forEach((item, index) => {
      expect(groups[index].querySelector('dt')?.textContent?.trim()).toBe(dictionary.tournament.admin.draws[item.label]);
      expect(dictionary.tournament.admin.draws[item.description].trim()).not.toBe('');
      expect(groups[index].querySelectorAll('dd')[1].textContent?.trim()).toBe(dictionary.tournament.admin.draws[item.description]);
    });
    expect(summaryValues()).toEqual(['0', '0', '0', '0']);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('auto-selects the first sub-event and performs its actual read', async () => {
    await settle();
    expect(fixture.componentInstance.selectedSubEvent()?.id).toBe('safe-singles');
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.lastCall[0].variables).toEqual({ subEventId: 'safe-singles' });
    expect(query.mock.lastCall[0].fetchPolicy).toBe('network-only');
    expect(fixture.nativeElement.textContent).toContain('all.tournament.admin.draws.noEntriesYet');
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.draws.selectSubEventFirst');
    expect(fixture.nativeElement.querySelector('label[for="drawSubEvent"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#drawSubEvent')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[role="combobox"]')?.getAttribute('aria-label')).toBe('all.tournament.admin.draws.subEvent');
  });

  it('synchronizes manual selection and clears stale assignment state', async () => {
    query.mockReturnValue(
      of({
        data: { tournamentSubEvent: { entries: [{ id: 'safe-entry' }], unassignedEntries: [{ id: 'safe-entry' }], drawTournaments: [] } },
      }),
    );
    await settle();
    const component = fixture.componentInstance;
    component.selectedEntries.set(component.entries());
    component.targetDrawId.set('old-draw');
    component.subEventControl.setValue(component.subEvents()[1]);
    await settle();
    expect(query.mock.lastCall[0].variables).toEqual({ subEventId: 'safe-doubles' });
    expect(component.selectedSubEvent()?.id).toBe('safe-doubles');
    expect(component.selectedEntries()).toEqual([]);
    expect(component.targetDrawId()).toBeNull();
  });

  it('clears selection without querying a missing ID or restoring old records', async () => {
    await settle();
    fixture.componentInstance.subEventControl.setValue(null);
    await settle();
    expect(query).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.entries()).toEqual([]);
    expect(fixture.nativeElement.textContent).toContain('all.tournament.admin.draws.selectSubEventFirst');
    expect(refresh().disabled).toBe(true);
    expect(summaryValues()).toEqual([]);
  });

  it('reconciles replacement tournament inputs and handles removal of all sub-events', async () => {
    await settle();
    fixture.componentRef.setInput('tournament', { id: 'replacement', tournamentSubEvents: [{ id: 'new-event', name: 'Replacement' }] });
    await settle();
    expect(query.mock.lastCall[0].variables).toEqual({ subEventId: 'new-event' });
    fixture.componentRef.setInput('tournament', { id: 'empty', tournamentSubEvents: [] });
    await settle();
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.selectedSubEvent()).toBeNull();
    expect(fixture.componentInstance.subEventControl.value).toBeNull();
  });

  it('preserves the selected ID on input refresh without issuing a duplicate read', async () => {
    await settle();
    fixture.componentInstance.subEventControl.setValue(fixture.componentInstance.subEvents()[1]);
    await settle();
    fixture.componentRef.setInput('tournament', {
      id: 'safe-tournament',
      tournamentSubEvents: subEvents.map((event) => ({ ...event, name: `${event.name} updated` })),
    });
    await settle();
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.selectedSubEvent()?.name).toBe('Safe doubles updated');
  });

  it('shows native named loading without successful metrics or empty-state messages', async () => {
    const pending = new Subject<typeof response>();
    query.mockReturnValue(pending);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('all.tournament.edit.messages.loading');
    expect(fixture.nativeElement.querySelector('p-progressbar')).not.toBeNull();
    expect(summaryValues()).toEqual([]);
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.draws.totalEntries');
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.draws.noEntriesYet');
    pending.next(response);
    pending.complete();
    await settle();
    expect(fixture.nativeElement.querySelector('p-progressbar')).toBeNull();
    expect(fixture.componentInstance.stats()).toEqual({ total: 0, assigned: 0, unassigned: 0, draws: 0 });
  });

  it('surfaces a read failure, keeps selectors safe and recovers with stable refresh focus', async () => {
    query.mockReturnValueOnce(throwError(() => new Error('Safe draw read failure')));
    await settle();
    expect(fixture.nativeElement.querySelector('p-message')?.textContent).toContain('Safe draw read failure');
    expect(fixture.componentInstance.entries()).toEqual([]);
    expect(fixture.componentInstance.draws()).toEqual([]);
    expect(summaryValues()).toEqual([]);
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.draws.totalEntries');
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.draws.noEntriesYet');
    const button = refresh();
    button.focus();
    button.click();
    await settle();
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.nativeElement.querySelector('p-message')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('all.tournament.admin.draws.noEntriesYet');
    expect(document.activeElement).toBe(button);
  });

  it('keeps refresh enabled and focused throughout an asynchronous retry', async () => {
    await settle();
    const pending = new Subject<typeof response>();
    query.mockReturnValue(pending);
    const button = refresh();
    button.focus();
    button.click();
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    expect(button.disabled).toBe(false);
    expect(document.activeElement).toBe(button);
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).not.toBeNull();
    pending.next(response);
    pending.complete();
    await settle();
    expect(document.activeElement).toBe(button);
  });

  it.each([
    { data: undefined },
    { data: { tournamentSubEvent: null } },
    { data: { tournamentSubEvent: { entries: [] } } },
    { data: { tournamentSubEvent: { entries: [], unassignedEntries: null, drawTournaments: [] } } },
    { data: { tournamentSubEvent: { entries: [], unassignedEntries: [], drawTournaments: null } } },
  ])('rejects an incomplete successful response instead of claiming no entries', async (result) => {
    query.mockReturnValue(of(result));
    await settle();
    expect(fixture.nativeElement.querySelector('p-message')?.textContent).toContain('all.error.genericTitle');
    expect(summaryValues()).toEqual([]);
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.draws.noEntriesYet');
    expect(fixture.componentInstance.stats()).toEqual({ total: 0, assigned: 0, unassigned: 0, draws: 0 });
  });

  it('ignores a late response from the previously selected sub-event', async () => {
    const pending = new Subject<typeof response>();
    query.mockReturnValueOnce(pending).mockReturnValue(
      of({
        data: { tournamentSubEvent: { entries: [{ id: 'latest-entry' }], unassignedEntries: [], drawTournaments: [] } },
      }),
    );
    fixture.detectChanges();
    TestBed.tick();
    fixture.componentInstance.subEventControl.setValue(fixture.componentInstance.subEvents()[1]);
    await settle();
    expect(query.mock.lastCall[0].variables).toEqual({ subEventId: 'safe-doubles' });
    pending.next({ data: { tournamentSubEvent: { entries: [], unassignedEntries: [], drawTournaments: [] } } });
    pending.complete();
    await settle();
    expect(fixture.componentInstance.selectedSubEvent()?.id).toBe('safe-doubles');
    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.componentInstance.error()).toBeNull();
    expect(fixture.componentInstance.entries().map((entry) => entry.id)).toEqual(['latest-entry']);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses actual %s loading/error/refresh wording without additional locale reads', async (locale) => {
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale);
    query.mockReturnValue(of({ data: undefined }));
    await settle();
    expect(fixture.nativeElement.querySelector('p-message')?.textContent?.trim()).toBe(dictionary.error.genericTitle);
    expect(fixture.nativeElement.querySelector(`button[aria-label="${dictionary.button.refresh}"]`)).not.toBeNull();
    expect(dictionary.tournament.edit.messages.loading.trim()).not.toBe('');
    expect(query).toHaveBeenCalledTimes(1);
  });
});
