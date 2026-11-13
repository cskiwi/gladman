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
      validationSummary: signal({ valid: 0, total: 0, invalid: 0, warnings: 0 }),
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
    });
    translate.use('en');
    const fixture = TestBed.createComponent(ClubTeamBuilderTabComponent);
    fixture.componentRef.setInput('clubId', 'example-club');
    fixture.componentRef.setInput('season', 2026);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, service, translate, element: fixture.nativeElement as HTMLElement };
  }

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
        closeAriaLabel: 'all.button.cancel',
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
        closeAriaLabel: 'all.button.cancel',
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
