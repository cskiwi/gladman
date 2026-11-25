import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { of, Subject, throwError } from 'rxjs';
import { PlayerClaimsComponent } from './components/player-claims/player-claims.component';
import { PlayerProfileComponent } from './components/player-profile/player-profile.component';
import { PageEditComponent } from './page-edit.component';

describe('Player editor chrome', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  const player = { id: 'example-player', fullName: 'Example Player', firstName: 'Example', lastName: 'Player', claims: [] };
  let query: jest.Mock;
  let mutate: jest.Mock;
  let permissions: jest.Mock;

  beforeAll(() => {
    globalThis.ResizeObserver = class {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };
  });

  afterAll(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

  beforeEach(async () => {
    query = jest.fn(() => of({ data: { player, claims: [{ id: 'example-claim', name: 'Example permission', category: 'Example' }] } }));
    mutate = jest.fn();
    permissions = jest.fn(() => true);
    await TestBed.configureTestingModule({
      imports: [PageEditComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: 'players/:playerId/edit', component: PageEditComponent }]),
        { provide: Apollo, useValue: { query, mutate } },
        { provide: AuthService, useValue: { user: signal(null), hasAnyPermission: permissions } },
        { provide: RankingSystemService, useValue: { systemId: signal(null), loaded: signal(true) } },
      ],
    }).compileComponents();
  });

  async function mount(settle = true) {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/players/example-player/edit', PageEditComponent);
    if (settle) await harness.fixture.whenStable();
    harness.detectChanges();
    const element = harness.routeNativeElement;
    const route = harness.routeDebugElement;
    if (!element || !route) throw new Error('Player editor did not mount');
    const messages = route.injector.get(MessageService);
    const notify = jest.spyOn(messages, 'add');
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    return { harness, component, element, messages, notify, navigate };
  }

  function children(harness: RouterTestingHarness) {
    const profile: PlayerProfileComponent = harness.fixture.debugElement.query(By.directive(PlayerProfileComponent)).componentInstance;
    const claims: PlayerClaimsComponent = harness.fixture.debugElement.query(By.directive(PlayerClaimsComponent)).componentInstance;
    return { profile, claims };
  }

  function actions(element: HTMLElement): HTMLButtonElement[] {
    return Array.from(element.querySelectorAll<HTMLButtonElement>('app-page-header button'));
  }

  it('names tabs without decorative glyphs and preserves child permission inputs and cancel navigation', async () => {
    permissions.mockReturnValue(false);
    const { harness, element, navigate } = await mount();
    const { profile, claims } = children(harness);
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('h1')?.textContent).toContain(player.fullName);
    expect(element.querySelectorAll('[role="tab"] i[aria-hidden="true"]')).toHaveLength(3);
    expect(profile.profileForm.get('firstName')?.disabled).toBe(true);
    expect(claims.canEditClaims()).toBe(false);
    expect(actions(element).map((button) => button.disabled)).toEqual([true, true, false]);
    actions(element)[2].click();
    expect(navigate).toHaveBeenCalledWith(['..'], expect.objectContaining({ relativeTo: expect.anything() }));
    expect(mutate).not.toHaveBeenCalled();
  });

  it('synchronizes actual tab selection and saves only the current dirty form, retaining inactive edits', async () => {
    const { harness, element, component } = await mount();
    const { profile, claims } = children(harness);
    profile.profileForm.markAsDirty();
    claims.claimsForm.markAsDirty();
    const saveProfile = jest.spyOn(profile, 'saveProfile').mockResolvedValue();
    const saveClaims = jest.spyOn(claims, 'saveClaims').mockResolvedValue();
    const tabs = element.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs[1].click();
    harness.detectChanges();
    expect(component.activeTabIndex()).toBe('1');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(element.querySelector('.p-message-warn')?.textContent).toContain('all.player.edit.messages.unsaved-changes');
    actions(element)[1].click();
    await harness.fixture.whenStable();
    expect(saveClaims).toHaveBeenCalledTimes(1);
    expect(saveProfile).not.toHaveBeenCalled();
    expect(profile.isDirty).toBe(true);

    tabs[2].click();
    harness.detectChanges();
    expect(component.activeTabIndex()).toBe('2');
    expect(actions(element)[1].disabled).toBe(true);
    await component.saveCurrentTab();
    expect(saveClaims).toHaveBeenCalledTimes(1);
    tabs[0].click();
    harness.detectChanges();
    await component.saveCurrentTab();
    expect(saveProfile).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('shows named loading until the player read resolves', async () => {
    const response = new Subject<{ data: { player: typeof player } }>();
    query.mockReturnValue(response);
    const { harness, element } = await mount(false);
    expect(element.querySelector('[role="progressbar"]')?.getAttribute('aria-label')).toBe('all.player.edit.messages.loading');
    expect(element.querySelector('[role="status"]')?.textContent).toContain('all.player.edit.messages.loading');
    expect(element.querySelector('p-tabs')).toBeNull();
    response.next({ data: { player } });
    response.complete();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('[role="progressbar"]')).toBeNull();
    expect(element.querySelector('p-tabs')).not.toBeNull();
  });

  it.each([true, false])('shows an explicit read error without forms when the player is missing=%s', async (missing) => {
    query.mockReturnValue(missing ? of({ data: { player: null } }) : throwError(() => new Error('Safe read failure')));
    const { element } = await mount();
    expect(element.querySelector('.p-message-error[role="alert"]')?.textContent).toContain('Failed to load player data');
    expect(element.querySelector('p-tabs')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('renders local informational and child success notifications in its native Toast outlet', async () => {
    const { component, element, harness, messages, navigate } = await mount();
    await component.saveAll();
    harness.detectChanges();
    expect(element.querySelector('.p-toast-message-info')?.textContent).toContain('No changes to save');
    messages.add({ severity: 'success', summary: 'Success', detail: 'Safe child save fixture' });
    harness.detectChanges();
    expect(element.querySelector('.p-toast-message-success')?.textContent).toContain('Safe child save fixture');
    expect(navigate).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('prevents invalid profile Save all from saving claims, reporting success or navigating', async () => {
    const { component, harness, element, notify, navigate } = await mount();
    const { profile, claims } = children(harness);
    profile.profileForm.get('firstName')?.setValue('');
    profile.profileForm.markAsDirty();
    claims.claimsForm.markAsDirty();
    const saveClaims = jest.spyOn(claims, 'saveClaims').mockResolvedValue();
    await component.saveAll();
    harness.detectChanges();
    expect(profile.profileForm.get('firstName')?.touched).toBe(true);
    expect(element.querySelector('#firstName-error')?.textContent).toContain('all.player.edit.profile.firstName.required');
    expect(profile.isDirty).toBe(true);
    expect(saveClaims).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
    expect(component.saving()).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each([true, false])('blocks duplicate current saves and restores controls after rejection=%s', async (reject) => {
    const { component, harness, element, navigate } = await mount();
    const { claims } = children(harness);
    claims.claimsForm.markAsDirty();
    element.querySelectorAll<HTMLElement>('[role="tab"]')[1].click();
    let finish: () => void = () => {
      throw new Error('Save fixture was not started');
    };
    const saveClaims = jest.spyOn(claims, 'saveClaims').mockImplementation(
      () =>
        new Promise<void>((resolve, fail) => {
          finish = () => (reject ? fail(new Error('Safe failed save')) : resolve());
        }),
    );
    const pending = component.saveCurrentTab();
    harness.detectChanges();
    expect(actions(element).every((button) => button.disabled)).toBe(true);
    expect(element.querySelector('[aria-busy="true"]')).not.toBeNull();
    await component.saveCurrentTab();
    await component.saveAll();
    expect(saveClaims).toHaveBeenCalledTimes(1);
    finish();
    await pending;
    harness.detectChanges();
    expect(component.saving()).toBe(false);
    expect(actions(element)[1].disabled).toBe(false);
    expect(element.querySelector('.p-toast-message-error')?.textContent ?? '').toEqual(
      reject ? expect.stringContaining('Some changes could not be saved') : '',
    );
    expect(navigate).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('waits for all saves after a partial rejection and keeps dirty forms without false success/navigation', async () => {
    const { component, harness, element, notify, navigate } = await mount();
    const { profile, claims } = children(harness);
    profile.profileForm.markAsDirty();
    claims.claimsForm.markAsDirty();
    jest.spyOn(profile, 'saveProfile').mockRejectedValue(new Error('Safe failed profile'));
    let finish: () => void = () => {
      throw new Error('Save fixture was not started');
    };
    const saveClaims = jest.spyOn(claims, 'saveClaims').mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const pending = component.saveAll();
    await Promise.resolve();
    expect(component.saving()).toBe(true);
    await component.saveAll();
    expect(saveClaims).toHaveBeenCalledTimes(1);
    finish();
    await pending;
    harness.detectChanges();
    expect(component.saving()).toBe(false);
    expect(profile.isDirty && claims.isDirty).toBe(true);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(element.querySelector('.p-toast-message-error')?.textContent).toContain('Some changes could not be saved');
    expect(navigate).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('saves dirty forms once and navigates to the player only after all succeed', async () => {
    const { component, harness, notify, navigate } = await mount();
    const { profile, claims } = children(harness);
    profile.profileForm.markAsDirty();
    claims.claimsForm.markAsDirty();
    const saveProfile = jest.spyOn(profile, 'saveProfile').mockResolvedValue();
    const saveClaims = jest.spyOn(claims, 'saveClaims').mockResolvedValue();
    await component.saveAll();
    expect(saveProfile).toHaveBeenCalledTimes(1);
    expect(saveClaims).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success', detail: 'All changes saved successfully' }));
    expect(navigate).toHaveBeenCalledWith(['..'], expect.objectContaining({ relativeTo: expect.anything() }));
    expect(component.saving()).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });
});
