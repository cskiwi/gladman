import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CompetitionSubEvent, Player, Team } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { TeamBuilderPlayer, TeamBuilderTeam } from '../../pages/detail/tabs/team-builder/types/team-builder.types';
import { BuilderTeamCardComponent } from './builder-team-card.component';
import { PlayerChipComponent } from './player-chip.component';

describe('BuilderTeamCardComponent', () => {
  const prefix = 'all.club.teamBuilder.card.';

  function player(id: string, gender: 'M' | 'F', membershipType: 'REGULAR' | 'BACKUP'): TeamBuilderPlayer {
    return Object.assign(new Player(), {
      id,
      firstName: 'Example',
      lastName: id,
      gender,
      membershipType,
      lowPerformance: false,
      lowPresence: false,
      performancePercent: 100,
      presencePercent: 100,
      isNewPlayer: false,
      isStopping: false,
    });
  }

  async function render(overrides: Partial<TeamBuilderTeam> = {}) {
    await TestBed.configureTestingModule({
      imports: [BuilderTeamCardComponent, TranslateModule.forRoot()],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      [prefix + 'changeSubEvent']: 'Change sub-event for {{name}}: {{subEvent}}',
      [prefix + 'markRemoval']: 'Mark {{name}} for removal',
      [prefix + 'undoRemoval']: 'Undo removal of {{name}}',
      [prefix + 'deleteTeam']: 'Delete {{name}}',
    });
    translate.use('en');
    const team: TeamBuilderTeam = Object.assign(new Team(), {
      id: 'example-team',
      name: 'Example team',
      type: 'M' as const,
      isNew: false,
      isPromoted: false,
      isDemoted: false,
      isMarkedForRemoval: false,
      standingOutcome: 'UNCHANGED' as const,
      subEventManuallyOverridden: false,
      players: [],
      teamIndex: 40,
      isValid: true,
      validationErrors: [],
      selectedSubEvent: Object.assign(new CompetitionSubEvent(), { name: 'Example division', minBaseIndex: 36, maxBaseIndex: 52 }),
      ...overrides,
    });
    const fixture = TestBed.createComponent(BuilderTeamCardComponent);
    fixture.componentRef.setInput('team', team);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, team, translate, element: fixture.nativeElement as HTMLElement };
  }

  it('renders index boundaries and explicit severity messages without requiring a maximum', async () => {
    const { fixture, team, element } = await render();
    expect(element.textContent).toContain(prefix + 'dropPlayers');
    const severities = () => fixture.debugElement.queryAll(By.directive(Message)).map((message) => message.injector.get(Message).severity());
    expect(severities()).toEqual([]);
    expect(element.querySelector('dd')?.textContent).toContain('40');
    for (const [index, expected] of [
      [35, 'danger'],
      [36, 'success'],
      [52, 'success'],
      [53, 'warn'],
    ] as const) {
      fixture.componentRef.setInput('team', { ...team, teamIndex: index });
      fixture.detectChanges();
      expect(element.querySelector('dd')?.textContent).toContain(String(index));
      expect(fixture.debugElement.query(By.directive(Tag)).injector.get(Tag).severity()).toBe(expected);
      expect(severities()).toEqual(expected === 'success' ? [] : [expected === 'danger' ? 'error' : 'warn']);
    }
    fixture.componentRef.setInput('team', {
      ...team,
      teamIndex: 35,
      selectedSubEvent: Object.assign(new CompetitionSubEvent(), { minBaseIndex: 36, maxBaseIndex: null }),
    });
    fixture.detectChanges();
    expect(element.querySelector('p-message')?.textContent).toContain(prefix + 'tooStrong');
    fixture.componentRef.setInput('team', { ...team, selectedSubEvent: undefined });
    fixture.detectChanges();
    expect(element.querySelectorAll('dd')[1]?.textContent).toContain('—');
    expect(element.querySelectorAll('p-message')).toHaveLength(0);
  });

  it('names actions contextually, emits them and replaces the drop zone when removal is pending', async () => {
    const { fixture, team, element } = await render({
      isNew: true,
      isPromoted: true,
      validationErrors: [{ key: 'all.club.teamBuilder.validation.maxIndex', params: { index: 79, max: 76 } }],
    });
    const component = fixture.componentInstance;
    const subEvent = jest.fn();
    const removal = jest.fn();
    const deletion = jest.fn();
    component.subEventClicked.subscribe(subEvent);
    component.markForRemovalClicked.subscribe(removal);
    component.removeTeamClicked.subscribe(deletion);
    const click = (name: string) => {
      const button = element.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`);
      expect(button).not.toBeNull();
      expect(button?.type).toBe('button');
      button?.click();
    };
    click('Change sub-event for Example team: Example division');
    click('Mark Example team for removal');
    click('Delete Example team');
    expect(subEvent).toHaveBeenCalledTimes(1);
    expect(removal).toHaveBeenCalledTimes(1);
    expect(deletion).toHaveBeenCalledTimes(1);
    expect(element.textContent).toContain(prefix + 'promoted');
    expect(element.querySelector('.p-card-footer')?.textContent).toContain('all.club.teamBuilder.validation.maxIndex');
    fixture.componentRef.setInput('team', { ...team, isMarkedForRemoval: true });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(CdkDropList))).toBeNull();
    expect(element.textContent).toContain(prefix + 'removalPending');
    expect(element.textContent).not.toContain('all.club.teamBuilder.validation.maxIndex');
    click('Undo removal of Example team');
    expect(removal).toHaveBeenCalledTimes(2);
  });

  it('updates existing validation text on locale changes without changing the team', async () => {
    const key = 'all.club.teamBuilder.validation.maxIndex';
    const { fixture, team, translate, element } = await render({
      validationErrors: [{ key, params: { index: 79, max: 76 } }],
    });
    translate.setTranslation('en', { [key]: 'Index {{index}} exceeds {{max}}' }, true);
    fixture.detectChanges();
    expect(element.querySelector('.p-card-footer')?.textContent).toContain('Index 79 exceeds 76');
    translate.setTranslation('nl', { [key]: 'Index {{index}} overschrijdt {{max}}' });
    translate.use('nl');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelector('.p-card-footer')?.textContent).toContain('Index 79 overschrijdt 76');
    expect(fixture.componentInstance.team()).toBe(team);
    expect(team.validationErrors).toEqual([{ key, params: { index: 79, max: 76 } }]);
  });

  it('keeps mixed groups, sorting, drag data and player-chip events when groups are consolidated', async () => {
    const players = [player('Z', 'F', 'BACKUP'), player('B', 'M', 'REGULAR'), player('A', 'M', 'REGULAR'), player('C', 'F', 'REGULAR')];
    const { fixture, team } = await render({ type: 'MX', players });
    const dropped = jest.fn();
    const membership = jest.fn();
    const clicked = jest.fn();
    fixture.componentInstance.playerDropped.subscribe(dropped);
    fixture.componentInstance.membershipToggled.subscribe(membership);
    fixture.componentInstance.playerClicked.subscribe(clicked);
    const chips = () => fixture.debugElement.queryAll(By.directive(PlayerChipComponent));
    expect(chips().map((chip) => chip.componentInstance.player().id)).toEqual(['A', 'B', 'C', 'Z']);
    expect(chips().every((chip) => chip.componentInstance.showMixedRanking() && chip.componentInstance.showMembershipToggle())).toBe(true);
    expect(fixture.debugElement.queryAll(By.directive(CdkDrag)).map((drag) => drag.injector.get(CdkDrag).data)).toEqual(
      ['A', 'B', 'C', 'Z'].map((playerId) => ({ playerId, fromTeamId: team.id })),
    );
    const list = fixture.debugElement.query(By.directive(CdkDropList));
    expect(list.injector.get(CdkDropList).data).toBe(team.id);
    const drop = { item: { data: { playerId: 'A', fromTeamId: null } } };
    list.triggerEventHandler('cdkDropListDropped', drop);
    expect(dropped).toHaveBeenCalledWith(drop);
    chips()[0].componentInstance.membershipToggled.emit('BACKUP');
    chips()[0].componentInstance.playerClicked.emit(players[2]);
    expect(membership).toHaveBeenCalledWith({ playerId: 'A', type: 'BACKUP' });
    expect(clicked).toHaveBeenCalledWith(players[2]);
    fixture.componentRef.setInput('separateBackups', false);
    fixture.detectChanges();
    expect(fixture.componentInstance.playerGroups().map((group) => group.key)).toEqual(['regularMales', 'regularFemales']);
    expect(chips()).toHaveLength(4);
    fixture.componentRef.setInput('team', { ...team, type: 'M' });
    fixture.detectChanges();
    expect(chips().map((chip) => chip.componentInstance.player().id)).toEqual(['A', 'B', 'C', 'Z']);
    expect(chips().every((chip) => !chip.componentInstance.showMixedRanking())).toBe(true);
  });
});
