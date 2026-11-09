import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { DrawsTabComponent } from './draws-tab.component';

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
