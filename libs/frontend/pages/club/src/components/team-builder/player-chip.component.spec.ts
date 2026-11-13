import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Player } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Popover } from 'primeng/popover';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { TeamBuilderPlayer } from '../../pages/detail/tabs/team-builder/types/team-builder.types';
import { PlayerChipComponent } from './player-chip.component';

describe('PlayerChipComponent', () => {
  const prefix = 'all.club.teamBuilder.player.';

  async function render(overrides: Partial<TeamBuilderPlayer> = {}) {
    await TestBed.configureTestingModule({
      imports: [PlayerChipComponent, TranslateModule.forRoot()],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'all.common.viewDetails': 'View Details',
      'all.team.membership.BACKUP.assign': 'Make {{name}} a reserve player',
      'all.team.membership.REGULAR.assign': 'Make {{name}} a base player',
      'all.ranking.summaryWithoutMixed': 'Singles {{single}}, doubles {{double}}',
      [prefix + 'lowPerformance']: 'Low performance ({{percent}}% win rate)',
      [prefix + 'lowPresence']: 'Low presence ({{percent}}% attendance)',
      'all.common.firstChoice': 'First choice: {{choice}}',
      'all.common.secondChoice': 'Second choice: {{choice}}',
      'all.team.membership.REGULAR.label': 'Base',
      'all.team.membership.BACKUP.label': 'Reserve',
    });
    translate.use('en');
    const player: TeamBuilderPlayer = Object.assign(new Player(), {
      id: 'example',
      firstName: 'Example',
      lastName: 'Player',
      membershipType: 'REGULAR' as const,
      lowPerformance: false,
      lowPresence: false,
      performancePercent: 100,
      presencePercent: 100,
      isNewPlayer: false,
      isStopping: false,
      ...overrides,
    });
    const fixture = TestBed.createComponent(PlayerChipComponent);
    fixture.componentRef.setInput('player', player);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, player, element: fixture.nativeElement as HTMLElement };
  }

  it('uses named native buttons for details and membership without leaking membership double-clicks to editing', async () => {
    const { fixture, player, element } = await render();
    fixture.componentRef.setInput('showMembershipToggle', true);
    fixture.componentRef.setInput('showMixedRanking', false);
    fixture.detectChanges();
    const popover = fixture.debugElement.query(By.directive(Popover)).injector.get(Popover);
    const show = jest.spyOn(popover, 'show').mockImplementation(() => undefined);
    const membership = jest.fn();
    const edit = jest.fn();
    fixture.componentInstance.membershipToggled.subscribe(membership);
    fixture.componentInstance.playerClicked.subscribe(edit);
    const buttons = element.querySelectorAll('button');
    const membershipTooltip = fixture.debugElement
      .queryAll(By.directive(Tooltip))
      .find((target) => target.nativeElement.tagName === 'P-BUTTON')
      ?.injector.get(Tooltip);
    expect(buttons[0].getAttribute('aria-label')).toBe('View Details: Example Player');
    buttons[0].click();
    expect(show).toHaveBeenCalledTimes(1);
    expect(element.querySelector('span[role="img"]')?.getAttribute('aria-label')).toBe('Singles 12, doubles 12');
    expect(buttons[1].getAttribute('aria-label')).toBe('Base. Make Example Player a reserve player');
    expect(membershipTooltip?.content()).toBe('Base');
    buttons[1].click();
    buttons[1].dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(membership).toHaveBeenLastCalledWith('BACKUP');
    expect(edit).not.toHaveBeenCalled();
    fixture.componentRef.setInput('player', Object.assign(new Player(), player, { membershipType: 'BACKUP' }));
    fixture.detectChanges();
    await fixture.whenStable();
    buttons[1].click();
    expect(membership).toHaveBeenLastCalledWith('REGULAR');
    expect(buttons[1].getAttribute('aria-label')).toBe('Reserve. Make Example Player a base player');
    expect(membershipTooltip?.content()).toBe('Reserve');
    element.firstElementChild?.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    expect(edit).toHaveBeenCalledWith(fixture.componentInstance.player());
  });

  it('shares all warning severities between compact indicators and details and preserves survey values', async () => {
    const { fixture, player, element } = await render({
      isStopping: true,
      isNewPlayer: true,
      lowPresence: true,
      lowPerformance: true,
      performancePercent: 10,
      presencePercent: 20,
      levelWarning: 'Example level warning',
      teamCountWarning: 'Example team warning',
      survey: {
        externalId: 'example',
        createdOn: '',
        createdBy: '',
        fullName: 'Example Player',
        firstName: 'Example',
        lastName: 'Player',
        currentTeams: [],
        desiredTeamCount: 2,
        preferredPlayDay: 'Friday',
        team1Choice1: 'First team',
        team1Choice2: 'Second team',
        team2Choice1: 'Third team',
        team2Choice2: 'Fourth team',
        canMeet75PercentTeam1: ' NON ',
        canMeet75PercentTeam2: 'nee',
        unavailabilityPeriodsTeam1: 'December',
        unavailabilityPeriodsTeam2: 'January',
        comments: 'Example remarks',
        meetingAttendance: '',
        availableDates: [],
        stoppingCompetition: true,
        linkedContactIds: [],
      },
    });
    const tags = () => fixture.debugElement.queryAll(By.directive(Tag)).map((tag) => tag.injector.get(Tag).severity());
    expect(tags()).toEqual(['danger']);
    expect(element.querySelector('p-tag')?.textContent).toContain('7');
    element.querySelector('button')?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const overlay = document.body.querySelector('.p-popover');
    expect(overlay?.textContent).toContain('Low performance (10% win rate)');
    expect(overlay?.textContent).toContain('Low presence (20% attendance)');
    expect(overlay?.textContent).toContain('Example level warning');
    expect(overlay?.textContent).toContain('Example team warning');
    for (const value of ['Friday', 'First team', 'Second team', 'Third team', 'Fourth team', 'December', 'January', 'Example remarks']) {
      expect(overlay?.textContent).toContain(value);
    }
    expect(overlay?.querySelectorAll('p-tag[severity="danger"]')).toHaveLength(2);
    const edit = jest.fn();
    fixture.componentInstance.playerClicked.subscribe(edit);
    overlay?.querySelector('button')?.click();
    expect(edit).toHaveBeenCalledWith(player);
    expect(element.querySelectorAll('p-tag[role="img"]')).toHaveLength(1);
  });

  it('keeps the explicit no-survey state and complete fallback rankings in details', async () => {
    const { fixture, element } = await render();
    element.querySelector('button')?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.body.querySelector('.p-popover')?.textContent).toContain('all.player.survey.empty');
    expect(fixture.componentInstance.ranking()).toEqual({ single: 12, double: 12, mix: 12 });
  });

  it('uses the strongest indicator in the combined badge and omits the badge when no indicators apply', async () => {
    const { fixture, player } = await render({ isNewPlayer: true, levelWarning: 'Example warning' });
    const summary = () => fixture.debugElement.query(By.directive(Tag))?.injector.get(Tag);
    expect(summary()?.severity()).toBe('warn');
    expect(summary()?.value()).toBe('2');
    fixture.componentRef.setInput('player', Object.assign(new Player(), player, { levelWarning: undefined }));
    fixture.detectChanges();
    expect(summary()?.severity()).toBe('info');
    expect(summary()?.value()).toBeUndefined();
    fixture.componentRef.setInput('player', Object.assign(new Player(), player, { levelWarning: undefined, isNewPlayer: false }));
    fixture.detectChanges();
    expect(summary()).toBeUndefined();
  });

  it('pins the existing hover panel for keyboard use without replacing it or moving focus on hover', async () => {
    const { fixture, element } = await render();
    const focusedBefore = document.activeElement;
    element.firstElementChild?.firstElementChild?.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.body.querySelector('.p-popover');
    expect(panel).not.toBeNull();
    expect(document.activeElement).toBe(focusedBefore);
    expect(panel?.getAttribute('aria-modal')).toBe('false');
    expect(panel?.querySelector('button')?.autofocus).toBe(false);
    element.querySelector('button')?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(document.body.querySelector('.p-popover')).toBe(panel);
    expect(panel?.getAttribute('aria-modal')).toBe('true');
    expect(panel?.querySelector('button')?.autofocus).toBe(true);
    expect(document.activeElement).toBe(panel?.querySelector('button'));
  });
});
