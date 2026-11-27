import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { Player, Team, TeamPlayerMembership } from '@app/models';
import { TeamMembershipType } from '@app/models-enum';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { TeamEditComponent } from './team-edit.component';

// UI fixtures do not need the shared models' backend ORM/GraphQL decorators.
jest.mock('@app/models', () => ({
  Player: class {},
  Team: class {},
  TeamPlayerMembership: class {},
}));

describe('TeamEditComponent add-member dialog', () => {
  async function render() {
    const mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [TeamEditComponent, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: Apollo, useValue: { mutate } },
        { provide: AuthService, useValue: { hasAnyPermission: () => false } },
        { provide: DynamicDialogConfig, useValue: { data: { team: Object.assign(new Team(), { id: 'example-team', name: 'Example team' }) } } },
        { provide: DynamicDialogRef, useValue: { close: jest.fn() } },
        { provide: DialogService, useValue: {} },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(TeamEditComponent);
    fixture.componentInstance.showAddMemberDialog();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const dialog = element.querySelector<HTMLElement>('[role="dialog"]');
    if (!dialog) throw new Error('Missing add-member dialog');
    return { fixture, dialog, mutate };
  }

  function footerButton(dialog: HTMLElement, label: string): HTMLButtonElement {
    const button = Array.from(dialog.querySelectorAll<HTMLButtonElement>('.p-dialog-footer button')).find(
      (candidate) => candidate.textContent?.trim() === label,
    );
    if (!button) throw new Error(`Missing native footer button: ${label}`);
    return button;
  }

  it('associates visible field labels and names the native dropdown and close buttons', async () => {
    const { fixture, dialog } = await render();
    const player = dialog.querySelector<HTMLInputElement>('#team-add-member-player');
    expect(player?.labels?.[0]?.textContent?.trim()).toBe('all.team.edit.members.player');
    expect(dialog.querySelector('.p-autocomplete-dropdown')?.getAttribute('aria-label')).toBe('all.team.edit.members.player');
    const membershipType = dialog.querySelector('#team-add-member-type');
    const labelId = membershipType?.getAttribute('aria-labelledby');
    expect(labelId).toBe('team-add-member-type-label');
    expect(dialog.querySelector(`#${labelId}`)?.textContent?.trim()).toBe('all.team.edit.members.type');
    expect(dialog.querySelector('.p-dialog-close-button')?.getAttribute('aria-label')).toBe('all.button.close');
    expect(fixture.componentInstance.selectedMembershipType()).toBe(TeamMembershipType.REGULAR);
  });

  it('closes through the named native button without adding a membership or dirtying the team', async () => {
    const { fixture, dialog, mutate } = await render();
    const close = dialog.querySelector<HTMLButtonElement>('button[aria-label="all.button.close"]');
    if (!close) throw new Error('Missing named close button');
    close.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.showAddPlayerDialog()).toBe(false);
    expect(fixture.componentInstance.selectedPlayerToAdd()).toBeNull();
    expect(fixture.componentInstance.teamForm.pristine).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('renders gated Save and lets footer Cancel discard selection without changing the team', async () => {
    const { fixture, dialog, mutate } = await render();
    const save = footerButton(dialog, 'all.common.save');
    const cancel = footerButton(dialog, 'all.common.cancel');
    expect(save.disabled).toBe(true);
    save.click();
    expect(mutate).not.toHaveBeenCalled();

    fixture.componentInstance.selectedPlayerToAdd.set(Object.assign(new Player(), { id: 'example-player' }));
    fixture.componentInstance.selectedMembershipType.set(TeamMembershipType.BACKUP);
    fixture.detectChanges();
    expect(save.disabled).toBe(false);
    cancel.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.showAddPlayerDialog()).toBe(false);
    expect(fixture.componentInstance.selectedPlayerToAdd()).toBeNull();
    expect(fixture.componentInstance.teamForm.pristine).toBe(true);
    expect(mutate).not.toHaveBeenCalled();

    fixture.componentInstance.showAddMemberDialog();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.selectedMembershipType()).toBe(TeamMembershipType.REGULAR);
    const element: HTMLElement = fixture.nativeElement;
    const reopened = element.querySelector<HTMLElement>('[role="dialog"]');
    if (!reopened) throw new Error('Missing reopened add-member dialog');
    expect(footerButton(reopened, 'all.common.save').disabled).toBe(true);
  });

  it('uses footer Save for the existing immediate membership mutation without saving the outer team', async () => {
    const { fixture, dialog, mutate } = await render();
    const player = Object.assign(new Player(), { id: 'example-player', fullName: 'Example Player' });
    const membership = Object.assign(new TeamPlayerMembership(), {
      id: 'example-membership',
      playerId: player.id,
      membershipType: TeamMembershipType.BACKUP,
      player,
    });
    const result = new Subject<{ data: { addTeamPlayerMembership: TeamPlayerMembership } }>();
    mutate.mockReturnValue(result);
    fixture.componentInstance.selectedPlayerToAdd.set(player);
    fixture.componentInstance.selectedMembershipType.set(TeamMembershipType.BACKUP);
    fixture.detectChanges();
    footerButton(dialog, 'all.common.save').click();
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { teamId: 'example-team', playerId: player.id, membershipType: TeamMembershipType.BACKUP },
      }),
    );
    expect(fixture.componentInstance.showAddPlayerDialog()).toBe(true);
    expect(fixture.componentInstance.teamForm.pristine).toBe(true);

    result.next({ data: { addTeamPlayerMembership: membership } });
    result.complete();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.showAddPlayerDialog()).toBe(false);
    expect(fixture.componentInstance.teamPlayerMemberships()).toEqual([membership]);
    expect(fixture.componentInstance.teamForm.dirty).toBe(true);
    expect(mutate).toHaveBeenCalledTimes(1);
  });
});
