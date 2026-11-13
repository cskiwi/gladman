import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CompetitionSubEvent, Player, Team } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClubTeamBuilderTabComponent } from './club-team-builder-tab.component';
import { ClubTeamBuilderTabService } from './club-team-builder-tab.service';
import { TEAM_BUILDER_AUTO_SUB_EVENT, TeamBuilderPlayer, TeamBuilderTeam } from './team-builder/types/team-builder.types';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DEFAULT_TEAM_BUILDER_CONFIG } from './team-builder/types/team-builder.types';

describe('ClubTeamBuilderTabComponent pools and controls', () => {
  const prefix = 'all.club.teamBuilder.controls.';
  const player: TeamBuilderPlayer = Object.assign(new Player(), {
    id: 'example-player',
    firstName: 'Example',
    lastName: 'Player',
    lowPerformance: false,
    lowPresence: false,
    performancePercent: 100,
    presencePercent: 100,
    isNewPlayer: false,
    isStopping: false,
    membershipType: 'REGULAR' as const,
  });

  async function render() {
    const service = {
      setClubId: jest.fn(),
      setSeason: jest.fn(),
      currentTeams: signal([]),
      loading: signal(false),
      error: signal<string | null>(null),
      loadedFromDraft: signal(false),
      performanceLoading: signal(false),
      validationSummary: signal({
        valid: 0,
        total: 1,
        invalid: 1,
        warnings: 0,
        errors: [{ key: 'all.club.teamBuilder.validation.maxIndex', params: { index: 79, max: 76 }, teamName: 'Example team' }],
      }),
      teams: signal([]),
      sortedTeams: signal([]),
      unassignedPlayers: signal([player, player]),
      stoppingPlayers: signal([]),
      removedPlayers: signal([player]),
      slotAdjustments: signal(new Map([[player.id, -2]])),
      restorePlayer: jest.fn(),
      movePlayer: jest.fn(),
      removePlayer: jest.fn(),
      systemId: signal('example-system'),
      getClubPlayers: jest.fn().mockReturnValue([]),
      getSubEventOptions: jest.fn().mockReturnValue([]),
      getAllSubEvents: jest.fn().mockReturnValue([]),
      setTeamSubEvent: jest.fn(),
      getSaveSummary: jest.fn().mockReturnValue({ teamsUpdated: 2, teamsCreated: 1, teamsRemoved: 1, totalPlayers: 18 }),
      nextSeason: signal(2027),
      save: jest.fn().mockResolvedValue(true),
      removeTeam: jest.fn(),
      addExternalPlayer: jest.fn().mockResolvedValue(true),
      updatePlayerSurvey: jest.fn(),
      updateConfig: jest.fn(),
      processImportResults: jest.fn().mockResolvedValue(undefined),
      config: signal(DEFAULT_TEAM_BUILDER_CONFIG),
    };
    await TestBed.configureTestingModule({
      imports: [ClubTeamBuilderTabComponent, TranslateModule.forRoot()],
    })
      .overrideComponent(ClubTeamBuilderTabComponent, {
        remove: { providers: [ClubTeamBuilderTabService] },
        add: { providers: [{ provide: ClubTeamBuilderTabService, useValue: service }] },
      })
      .compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      [prefix + 'sortName']: 'Name',
      [prefix + 'sortIndex']: 'Index',
      [prefix + 'restorePlayer']: 'Restore one slot for {{name}}',
      'all.club.teamBuilder.feedback.saveMessage': '{{updated}} updated, {{created}} new, {{players}} players, {{season}}?',
      'all.club.teamBuilder.feedback.saveRemoved': '{{count}} removed',
      'all.club.teamBuilder.feedback.saveWarnings': '{{count}} invalid',
      'all.club.teamBuilder.validation.maxIndex': 'Index {{index}} exceeds {{max}}',
      'all.club.teamBuilder.save': 'Save teams',
      'all.button.save': 'Save',
      'all.button.delete': 'Delete',
      'all.button.cancel': 'Cancel',
      'all.button.close': 'Close notification',
      'all.club.teamBuilder.feedback.savedDetail': 'Saved for {{season}}',
      'all.club.teamBuilder.feedback.playerAddedDetail': '{{name}} added',
      'all.club.teamBuilder.feedback.alreadyPresentDetail': '{{name}} already present',
      'all.club.teamBuilder.feedback.surveyUpdatedFor': 'Updated {{name}}',
      'all.club.teamBuilder.feedback.importCounts': '{{matched}} matched, {{created}} created',
    });
    translate.use('en');
    const fixture = TestBed.createComponent(ClubTeamBuilderTabComponent);
    fixture.componentRef.setInput('clubId', 'example-club');
    fixture.componentRef.setInput('season', 2026);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, service, translate, element: fixture.nativeElement as HTMLElement };
  }

  it('localizes confirmations, preserves their summaries and mutates only after acceptance', async () => {
    const { fixture, service, element } = await render();
    const trigger = element.querySelector<HTMLButtonElement>('button');
    if (!trigger) throw new Error('Missing confirmation trigger');
    trigger.focus();
    const confirm = jest.spyOn(fixture.debugElement.injector.get(ConfirmationService), 'confirm');
    const add = jest.spyOn(fixture.debugElement.injector.get(MessageService), 'add');
    await fixture.componentInstance.save();
    fixture.detectChanges();
    await fixture.whenStable();
    const confirmation = confirm.mock.calls[0][0];
    expect(confirmation).toEqual(
      expect.objectContaining({
        message: '2 updated, 1 new, 18 players, 2027?\n\n1 removed\n\n1 invalid\n• Example team: Index 79 exceeds 76',
        header: 'Save teams',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Save',
        rejectLabel: 'Cancel',
      }),
    );
    expect(service.save).not.toHaveBeenCalled();
    const reject = document.body.querySelector<HTMLButtonElement>('.p-confirmdialog-reject-button');
    expect(reject?.textContent).toContain('Cancel');
    expect(document.body.querySelector('.p-dialog-close-button')?.getAttribute('aria-label')).toBe('Cancel');
    expect(document.body.querySelector('.p-confirmdialog')?.textContent).toContain('Example team: Index 79 exceeds 76');
    reject?.click();
    expect(service.save).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(trigger);
    await confirmation.accept?.();
    expect(service.save).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenLastCalledWith({
      severity: 'success',
      summary: 'all.club.teamBuilder.feedback.saved',
      detail: 'Saved for 2027',
    });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelector('.p-toast-close-button')?.getAttribute('aria-label')).toBe('Close notification');
    service.save.mockResolvedValue(false);
    await confirmation.accept?.();
    expect(add).toHaveBeenLastCalledWith({
      severity: 'error',
      summary: 'all.common.error',
      detail: 'all.club.teamBuilder.feedback.saveFailed',
    });
    fixture.componentInstance.removeTeam('example-team');
    const removal = confirm.mock.calls.at(-1)?.[0];
    expect(removal).toEqual(
      expect.objectContaining({
        header: 'all.club.teamBuilder.feedback.removeTitle',
        message: 'all.club.teamBuilder.feedback.removeMessage',
        acceptLabel: 'Delete',
        rejectLabel: 'Cancel',
      }),
    );
    expect(service.removeTeam).not.toHaveBeenCalled();
    removal?.accept?.();
    expect(service.removeTeam).toHaveBeenCalledWith('example-team');
  });

  it('preserves the valid-save branch and translates newly opened confirmations in the current locale', async () => {
    const { fixture, service, translate } = await render();
    const confirm = jest.spyOn(fixture.debugElement.injector.get(ConfirmationService), 'confirm');
    service.getSaveSummary.mockReturnValue({ teamsUpdated: 2, teamsCreated: 1, teamsRemoved: 0, totalPlayers: 18 });
    service.validationSummary.set({ valid: 1, total: 1, invalid: 0, warnings: 0, errors: [] });
    translate.setTranslation('nl', {
      'all.club.teamBuilder.feedback.saveMessage': '{{updated}} bijgewerkt, {{created}} nieuw, {{players}} spelers, {{season}}?',
      'all.club.teamBuilder.save': 'Ploegen opslaan',
      'all.button.save': 'Opslaan',
      'all.button.cancel': 'Annuleren',
    });
    translate.use('nl');
    await fixture.componentInstance.save();
    expect(confirm).toHaveBeenLastCalledWith(
      expect.objectContaining({
        header: 'Ploegen opslaan',
        acceptLabel: 'Opslaan',
        rejectLabel: 'Annuleren',
        icon: 'pi pi-save',
        message: '2 bijgewerkt, 1 nieuw, 18 spelers, 2027?',
      }),
    );
    expect(service.save).not.toHaveBeenCalled();
  });

  it('keeps notification severities, player identity and survey/settings callbacks', async () => {
    const { fixture, service } = await render();
    const add = jest.spyOn(fixture.debugElement.injector.get(MessageService), 'add');
    await fixture.componentInstance.onPlayerSelected({ value: player });
    expect(add).toHaveBeenLastCalledWith({
      severity: 'success',
      summary: 'all.club.teamBuilder.feedback.playerAdded',
      detail: 'Example Player added',
    });
    service.addExternalPlayer.mockResolvedValue(false);
    await fixture.componentInstance.onPlayerSelected({ value: player });
    expect(add).toHaveBeenLastCalledWith({
      severity: 'info',
      summary: 'all.club.teamBuilder.feedback.alreadyPresent',
      detail: 'Example Player already present',
    });
    const ref = new DynamicDialogRef();
    const open = jest.spyOn(fixture.debugElement.injector.get(DialogService), 'open').mockReturnValue(ref);
    fixture.componentInstance.openSettingsDialog();
    ref.close(DEFAULT_TEAM_BUILDER_CONFIG);
    expect(service.updateConfig).toHaveBeenCalledWith(DEFAULT_TEAM_BUILDER_CONFIG);
    expect(add).toHaveBeenLastCalledWith({
      severity: 'success',
      summary: 'all.club.teamBuilder.feedback.settingsUpdated',
      detail: 'all.club.teamBuilder.feedback.settingsUpdatedDetail',
    });
    const editRef = new DynamicDialogRef();
    open.mockReturnValue(editRef);
    fixture.componentInstance.openEditSurveyDialog(player);
    const survey = { fullName: 'Example Player' };
    editRef.close(survey);
    expect(service.updatePlayerSurvey).toHaveBeenCalledWith(player.id, survey);
    expect(add).toHaveBeenLastCalledWith({
      severity: 'success',
      summary: 'all.club.teamBuilder.feedback.surveyUpdated',
      detail: 'Updated Example Player',
    });
    const importRef = new DynamicDialogRef();
    open.mockReturnValue(importRef);
    fixture.componentInstance.openImportDialog(new MouseEvent('click'));
    const results = [{ player }, { player: null, createNew: true }, { player: null, createNew: false }];
    importRef.close(results);
    await fixture.whenStable();
    expect(service.processImportResults).toHaveBeenCalledWith(results);
    expect(add).toHaveBeenLastCalledWith({
      severity: 'success',
      summary: 'all.club.teamBuilder.feedback.surveyImported',
      detail: '1 matched, 1 created',
    });
  });
  it('associates controls with labels and translates sort button accessible names on locale changes', async () => {
    const { fixture, element, translate } = await render();
    const fields = ['builder-add-player', 'builder-search-players', 'builder-separate-backups'];
    for (const id of fields) {
      const field = element.querySelector<HTMLInputElement>(`#${id}`);
      expect(field?.labels?.length).toBe(1);
      expect(field?.labels?.[0]?.textContent?.trim()).not.toBe('');
    }
    const buttons = () => [...element.querySelectorAll('p-selectbutton [role="button"]')].map((button) => button.getAttribute('aria-label'));
    expect(buttons()).toEqual(['Name', 'Index']);
    translate.setTranslation('nl', { [prefix + 'sortName']: 'Naam', [prefix + 'sortIndex']: 'Index' });
    translate.use('nl');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(buttons()).toEqual(['Naam', 'Index']);
  });

  it('keeps duplicate draggable slots, filters them and names the restore action', async () => {
    const { fixture, service, element } = await render();
    const lists = fixture.debugElement.queryAll(By.directive(CdkDropList));
    expect(lists.map((list) => list.injector.get(CdkDropList).data)).toEqual(['pool', 'stopping', 'remove']);
    const slots = lists[0].queryAll(By.directive(CdkDrag));
    expect(slots.map((slot) => slot.injector.get(CdkDrag).data)).toEqual([
      { playerId: player.id, fromTeamId: null },
      { playerId: player.id, fromTeamId: null },
    ]);
    const drop = { item: { data: { playerId: player.id, fromTeamId: 'example-team' } } };
    lists[0].triggerEventHandler('cdkDropListDropped', drop);
    lists[1].triggerEventHandler('cdkDropListDropped', drop);
    lists[2].triggerEventHandler('cdkDropListDropped', drop);
    expect(service.movePlayer.mock.calls).toEqual([
      [player.id, 'example-team', null],
      [player.id, 'example-team', 'stopping'],
    ]);
    expect(service.removePlayer).toHaveBeenCalledWith(player.id, 'example-team');
    const restore = element.querySelector<HTMLButtonElement>('button[aria-label="Restore one slot for Example Player"]');
    expect(restore).not.toBeNull();
    restore?.click();
    expect(service.restorePlayer).toHaveBeenCalledWith(player.id);

    const search = element.querySelector<HTMLInputElement>('#builder-search-players');
    if (!search) throw new Error('Missing player filter');
    search.value = 'unmatched';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(lists[0].queryAll(By.directive(CdkDrag))).toHaveLength(0);
    expect(element.textContent).toContain(prefix + 'noSearchResults');
  });

  it.each([true, false])('restores the settings trigger only after destruction while connected=%s', async (connected) => {
    const { fixture, service, element } = await render();
    const ref = new DynamicDialogRef();
    jest.spyOn(fixture.debugElement.injector.get(DialogService), 'open').mockReturnValue(ref);
    const trigger = [...element.querySelectorAll('button')].find((button) => button.textContent?.includes('all.club.teamBuilder.settings.title'));
    if (!trigger) throw new Error('Missing settings trigger');
    trigger.focus();
    const focus = jest.spyOn(trigger, 'focus');
    trigger.click();
    ref.close(null);
    expect(service.updateConfig).not.toHaveBeenCalled();
    expect(focus).not.toHaveBeenCalled();
    if (!connected) trigger.remove();
    ref.destroy();
    expect(focus).toHaveBeenCalledTimes(connected ? 1 : 0);
  });

  it('restores focus to the import trigger after the modal is destroyed', async () => {
    const { fixture, element } = await render();
    const ref = new DynamicDialogRef();
    jest.spyOn(fixture.debugElement.injector.get(DialogService), 'open').mockReturnValue(ref);
    const trigger = [...element.querySelectorAll('button')].find((button) => button.textContent?.includes('all.club.teamBuilder.import.title'));
    if (!trigger) throw new Error('Missing import trigger');
    const focus = jest.spyOn(trigger, 'focus');
    trigger.click();
    ref.close(null);
    expect(focus).not.toHaveBeenCalled();
    ref.destroy();
    expect(focus).toHaveBeenCalledTimes(1);
  });

  it('opens a dismissible survey modal and restores the chip trigger only after destruction', async () => {
    const { fixture, element } = await render();
    const ref = new DynamicDialogRef();
    const open = jest.spyOn(fixture.debugElement.injector.get(DialogService), 'open').mockReturnValue(ref);
    const trigger = element.querySelector<HTMLButtonElement>('app-player-chip button');
    if (!trigger) throw new Error('Missing player trigger');
    trigger.focus();
    const focus = jest.spyOn(trigger, 'focus');
    fixture.componentInstance.openEditSurveyDialog(player);
    expect(open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        header: 'all.player.survey.edit',
        breakpoints: { '640px': '95vw' },
        modal: true,
        closeOnEscape: true,
        closable: true,
        closeAriaLabel: 'Cancel',
        data: { player },
      }),
    );
    ref.close(null);
    expect(focus).not.toHaveBeenCalled();
    ref.destroy();
    expect(focus).toHaveBeenCalledTimes(1);
  });

  it('opens a responsive sub-event modal, preserves manual/Auto results and restores focus after destruction', async () => {
    const { fixture, service, element } = await render();
    const ref = new DynamicDialogRef();
    const open = jest.spyOn(fixture.debugElement.injector.get(DialogService), 'open').mockReturnValue(ref);
    const team: TeamBuilderTeam = Object.assign(new Team(), {
      id: 'example-team',
      name: 'Example team',
      type: 'M' as const,
      isNew: false,
      isPromoted: false,
      isDemoted: false,
      isMarkedForRemoval: false,
      standingOutcome: 'UNCHANGED' as const,
      subEventManuallyOverridden: true,
      players: [],
      teamIndex: 40,
      isValid: true,
      validationErrors: [],
      selectedSubEvent: Object.assign(new CompetitionSubEvent(), { id: 'manual-division' }),
    });
    const trigger = element.querySelector<HTMLButtonElement>('button');
    if (!trigger) throw new Error('Missing trigger');
    trigger.focus();
    const focus = jest.spyOn(trigger, 'focus');
    fixture.componentInstance.openSubEventDialog(team);
    expect(open).toHaveBeenLastCalledWith(
      expect.any(Function),
      expect.objectContaining({
        header: 'all.club.teamBuilder.subEvent.title',
        width: '500px',
        breakpoints: { '640px': '95vw' },
        modal: true,
        closeOnEscape: true,
        closable: true,
        closeAriaLabel: 'Cancel',
        data: expect.objectContaining({ selectedValue: 'manual-division' }),
      }),
    );
    ref.close(null);
    expect(service.setTeamSubEvent).not.toHaveBeenCalled();
    expect(focus).not.toHaveBeenCalled();
    ref.close(undefined);
    expect(service.setTeamSubEvent).not.toHaveBeenCalled();
    ref.close('new-division');
    ref.close(TEAM_BUILDER_AUTO_SUB_EVENT);
    expect(service.setTeamSubEvent.mock.calls).toEqual([
      [team.id, 'new-division'],
      [team.id, TEAM_BUILDER_AUTO_SUB_EVENT],
    ]);
    ref.destroy();
    expect(focus).toHaveBeenCalledTimes(1);
    fixture.componentInstance.openSubEventDialog({ ...team, subEventManuallyOverridden: false });
    expect(open).toHaveBeenLastCalledWith(
      expect.any(Function),
      expect.objectContaining({
        data: expect.objectContaining({ selectedValue: TEAM_BUILDER_AUTO_SUB_EVENT }),
      }),
    );
  });
});
