import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import type { Claim } from '@app/models';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { PlayerClaimsComponent } from './player-claims.component';

describe(PlayerClaimsComponent.name, () => {
  type Claims = Pick<Claim, 'id' | 'name' | 'category' | 'description'>[];
  const claims = [
    { id: 'claim-b', name: 'Beta', category: 'Example', description: 'Beta description' },
    { id: 'claim-a', name: 'Alpha', category: 'Example', description: 'Alpha description' },
    { id: 'claim-c', name: 'Gamma', category: 'Other' },
  ];
  let fixture: ComponentFixture<PlayerClaimsComponent>;
  let permission: ReturnType<typeof signal<boolean>>;
  let query: Subject<{ data: { claims: Claims } }>;
  let response: Subject<unknown>;
  let mutate: jest.Mock;
  let notify: jest.SpyInstance;

  beforeEach(async () => {
    permission = signal(true);
    query = new Subject();
    response = new Subject();
    mutate = jest.fn(() => response);
    await TestBed.configureTestingModule({
      imports: [PlayerClaimsComponent, TranslateModule.forRoot()],
      providers: [
        { provide: Apollo, useValue: { query: () => query, mutate } },
        { provide: AuthService, useValue: { hasAnyPermission: () => permission() } },
        MessageService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PlayerClaimsComponent);
    fixture.componentRef.setInput('player', { id: 'example-player', claims: [claims[0]] });
    notify = jest.spyOn(TestBed.inject(MessageService), 'add');
    fixture.detectChanges();
  });

  function component() {
    return fixture.componentInstance;
  }

  function host(): HTMLElement {
    return fixture.nativeElement;
  }

  async function load(values = claims) {
    query.next({ data: { claims: values } });
    query.complete();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('distinguishes named loading from empty results, then renders sorted named groups and labelled descriptions', async () => {
    expect(host().querySelector('[role="progressbar"]')?.getAttribute('aria-label')).toBe('all.player.edit.messages.loading');
    expect(host().textContent).not.toContain('all.player.edit.claims.messages.no-claims');
    await load();
    expect(host().querySelector('[role="progressbar"]')).toBeNull();
    expect(Array.from(host().querySelectorAll('h2')).map((heading) => heading.textContent)).toEqual(['Example', 'Other']);
    const input = host().querySelector<HTMLInputElement>('#player-claim-claim-a');
    expect(input?.type).toBe('checkbox');
    expect(host().querySelector('label[for="player-claim-claim-a"]')?.textContent).toContain('Alpha description');
    expect(component().claimsForm.getRawValue()).toEqual({ 'claim-b': true, 'claim-a': false, 'claim-c': false });
    expect(component().isDirty).toBe(false);
    expect(host().querySelector('button[aria-label="all.player.edit.claims.actions.select-all: Example"]')).not.toBeNull();
  });

  it('keeps controls added after a denied permission check disabled and prevents bulk selection and saving', async () => {
    permission.set(false);
    fixture.detectChanges();
    await load();
    expect(Object.values(component().claimsForm.controls).every((control) => control.disabled)).toBe(true);
    expect(host().querySelector('input[type="checkbox"]')).toBeNull();
    expect(host().textContent).toContain('all.player.edit.claims.messages.no-permission');
    component().selectAll();
    component().selectNoneInCategory('Example');
    expect(component().claimsForm.getRawValue()['claim-b']).toBe(true);
    expect(component().isDirty).toBe(false);
    await expect(component().saveClaims()).rejects.toThrow('permission');
    expect(mutate).not.toHaveBeenCalled();
    permission.set(true);
    fixture.detectChanges();
    expect(Object.values(component().claimsForm.controls).every((control) => control.enabled)).toBe(true);
  });

  it('marks changed category/global selections dirty, preserves other categories and leaves no-op selections pristine', async () => {
    await load();
    component().selectNoneInCategory('Other');
    expect(component().isDirty).toBe(false);
    host().querySelector<HTMLButtonElement>('button[aria-label="all.player.edit.claims.actions.select-all: Example"]')?.click();
    expect(component().claimsForm.getRawValue()).toEqual({ 'claim-b': true, 'claim-a': true, 'claim-c': false });
    expect(component().isDirty).toBe(true);
    component().selectNoneInCategory('Example');
    expect(component().claimsForm.getRawValue()['claim-a']).toBe(false);
    component().selectAll();
    expect(Object.values(component().claimsForm.getRawValue()).every(Boolean)).toBe(true);
    component().selectNone();
    expect(Object.values(component().claimsForm.getRawValue()).some(Boolean)).toBe(false);
  });

  it('lets a labelled native checkbox update the reactive form and dirty state', async () => {
    await load();
    host().querySelector<HTMLInputElement>('#player-claim-claim-a')?.click();
    fixture.detectChanges();
    expect(component().claimsForm.getRawValue()['claim-a']).toBe(true);
    expect(component().isDirty).toBe(true);
  });

  it('shows empty results without a loading or error message', async () => {
    await load([]);
    expect(host().querySelector('.p-message-info')?.textContent).toContain('all.player.edit.claims.messages.no-claims');
    expect(host().querySelector('[role="progressbar"]')).toBeNull();
    expect(host().querySelector('.p-message-error')).toBeNull();
  });

  it('reports read failures without success-shaped empty feedback or a mutation', async () => {
    query.error(new Error('Safe failed read'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(host().querySelector('.p-message-error[role="alert"]')?.textContent).toContain('Failed to load claims data');
    expect(host().textContent).not.toContain('all.player.edit.claims.messages.no-claims');
    await expect(component().saveClaims()).rejects.toThrow('unavailable');
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['success', 'failure', 'unconfirmed', 'partial'])(
    'freezes pending selections, preserves payload/refetch and recovers after %s',
    async (outcome) => {
      await load();
      component().selectAllInCategory('Example');
      const saving = component().saveClaims();
      const settled = saving.then(
        () => null,
        (error: Error) => error,
      );
      fixture.detectChanges();
      expect(host().querySelector('form')?.getAttribute('aria-busy')).toBe('true');
      expect(host().querySelector('[role="progressbar"]')?.getAttribute('aria-label')).toBe('all.player.edit.claims.messages.saving');
      expect(Array.from(host().querySelectorAll<HTMLButtonElement>('button')).every((button) => button.disabled)).toBe(true);
      expect(Object.values(component().claimsForm.controls).every((control) => control.disabled)).toBe(true);
      component().selectNone();
      await expect(component().saveClaims()).rejects.toThrow('already in progress');
      expect(mutate).toHaveBeenCalledTimes(1);
      expect(mutate.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          variables: { playerId: 'example-player', claimIds: ['claim-b', 'claim-a'] },
          refetchQueries: [expect.objectContaining({ variables: { id: 'example-player' } })],
        }),
      );
      if (outcome === 'failure') {
        response.error(new Error('Safe failed save'));
      } else {
        response.next({
          data: { updatePlayerClaims: outcome === 'success' || outcome === 'partial' ? { id: 'example-player' } : null },
          ...(outcome === 'partial' ? { error: new Error('Safe partial failure') } : {}),
        });
        response.complete();
      }
      const error = await settled;
      fixture.detectChanges();
      expect(error instanceof Error).toBe(outcome !== 'success');
      expect(component().saving()).toBe(false);
      expect(component().isDirty).toBe(outcome !== 'success');
      expect(component().claimsForm.getRawValue()['claim-a']).toBe(true);
      expect(Object.values(component().claimsForm.controls).every((control) => control.enabled)).toBe(true);
      if (outcome === 'success') {
        expect(notify).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
      } else {
        expect(host().querySelector('.p-message-error')?.textContent).toContain('Failed to update player claims');
        expect(notify).not.toHaveBeenCalled();
      }
    },
  );
});
