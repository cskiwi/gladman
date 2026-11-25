import { signal } from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, DeferBlockState, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/frontend-modules-auth/service';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';
import { Subject } from 'rxjs';
import { PlayerProfileComponent } from './player-profile.component';

describe(PlayerProfileComponent.name, () => {
  let fixture: ComponentFixture<PlayerProfileComponent>;
  let admin: ReturnType<typeof signal<boolean>>;
  let currentUser: ReturnType<typeof signal<{ id: string } | null>>;
  let response: Subject<unknown>;
  let mutate: jest.Mock;
  const player = {
    id: 'example-player',
    firstName: 'Example',
    lastName: 'Player',
    email: 'player@example.invalid',
    phone: '',
    gender: 'M',
    birthDate: new Date(2000, 0, 1),
    competitionPlayer: true,
    sub: 'example-subject',
    memberId: 'example-member',
  };

  beforeEach(async () => {
    admin = signal(true);
    currentUser = signal<{ id: string } | null>(null);
    response = new Subject();
    mutate = jest.fn(() => response);
    TestBed.configureTestingModule({
      imports: [PlayerProfileComponent, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: { user: currentUser, hasAnyPermission: () => admin() } },
        { provide: Apollo, useValue: { mutate } },
        MessageService,
      ],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    });
    fixture = TestBed.createComponent(PlayerProfileComponent);
    fixture.componentRef.setInput('player', player);
    fixture.detectChanges();
    const blocks = await fixture.getDeferBlocks();
    await blocks[0].render(DeferBlockState.Complete);
    await fixture.whenStable();
  });

  function host(): HTMLElement {
    return fixture.nativeElement;
  }

  function edit(id: string, value: string): HTMLInputElement {
    const input = host().querySelector<HTMLInputElement>(`#${id}`);
    if (!input) throw new Error(`Missing profile field: ${id}`);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    return input;
  }

  it('names the native gender, deferred calendar and checkbox inputs from their visible labels', () => {
    const gender = host().querySelector('[role="combobox"][aria-labelledby="gender-label"]');
    expect(host().querySelector(`#${gender?.getAttribute('aria-labelledby')}`)?.textContent).toBe('all.player.edit.profile.gender');
    expect(host().querySelector('label[for="birthDate"]')?.textContent).toBe('all.player.edit.profile.birthDate');
    expect(host().querySelector('input#birthDate')).not.toBeNull();
    expect(host().querySelector('label[for="competitionPlayer"]')?.textContent).toBe('all.player.edit.profile.competitionPlayer');
    expect(host().querySelector('input#competitionPlayer')?.getAttribute('type')).toBe('checkbox');
    const picker: DatePicker = fixture.debugElement.query(By.directive(DatePicker)).componentInstance;
    expect(picker.maxDate()).toBe(fixture.componentInstance.maxBirthDate);
  });

  it.each([
    ['firstName', '', 'all.player.edit.profile.firstName.required'],
    ['lastName', '', 'all.player.edit.profile.lastName.required'],
    ['email', 'not-an-email', 'all.player.edit.profile.email.invalid'],
  ])('associates %s validation with its native invalid field and removes feedback after correction', (id, value, message) => {
    expect(host().querySelector(`#${id}-error`)).toBeNull();
    const input = edit(id, value);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const error = host().querySelector(`#${input.getAttribute('aria-describedby')}`);
    expect(error?.textContent).toContain(message);
    expect(error?.querySelector('[role="alert"]') ?? error?.matches('[role="alert"]')).toBeTruthy();

    edit(id, id === 'email' ? 'fixed@example.invalid' : 'Corrected');
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    expect(host().querySelector(`#${id}-error`)).toBeNull();
    expect(fixture.componentInstance.isDirty).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each([true, false])('preserves own-contact versus other-player disabling when own profile is %s', async (ownProfile) => {
    admin.set(false);
    currentUser.set({ id: ownProfile ? player.id : 'another-player' });
    fixture.detectChanges();
    await fixture.whenStable();

    for (const id of ['email', 'phone', 'birthDate']) {
      expect(host().querySelector<HTMLInputElement>(`input#${id}`)?.disabled).toBe(!ownProfile);
    }
    for (const id of ['firstName', 'lastName', 'competitionPlayer']) {
      expect(host().querySelector<HTMLInputElement>(`input#${id}`)?.disabled).toBe(true);
    }
    expect(host().querySelector('#gender')?.getAttribute('aria-disabled')).toBe('true');
    expect(host().querySelector('#sub')).toBeNull();
    expect(host().querySelector('#memberId')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('shows named busy feedback during save and an explicit error after failure without clearing dirty fields', async () => {
    edit('phone', '123456');
    const save = fixture.componentInstance.saveProfile();
    fixture.detectChanges();
    expect(host().querySelector('form')?.getAttribute('aria-busy')).toBe('true');
    expect(host().querySelector('[role="progressbar"]')?.getAttribute('aria-label')).toBe('all.player.edit.profile.messages.saving');
    expect(host().querySelector('[role="status"]')?.textContent).toContain('all.player.edit.profile.messages.saving');

    const rejection = expect(save).rejects.toThrow('Example failure');
    response.error(new Error('Example failure'));
    await rejection;
    fixture.detectChanges();
    expect(host().querySelector('[role="progressbar"]')).toBeNull();
    expect(host().querySelector('form')?.getAttribute('aria-busy')).toBe('false');
    expect(host().querySelector('[role="alert"]')?.textContent).toContain('Failed to update player profile');
    expect(fixture.componentInstance.isDirty).toBe(true);
    expect(host().querySelector<HTMLInputElement>('#phone')?.value).toBe('123456');
  });
});
