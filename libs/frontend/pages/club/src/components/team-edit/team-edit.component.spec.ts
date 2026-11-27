import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TeamMembershipType } from '@app/models-enum';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TeamEditComponent } from './team-edit.component';

describe('TeamEditComponent add-member accessibility', () => {
  async function render() {
    const mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [TeamEditComponent, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: Apollo, useValue: { mutate } },
        { provide: AuthService, useValue: { hasAnyPermission: () => false } },
        { provide: DynamicDialogConfig, useValue: { data: {} } },
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
});
