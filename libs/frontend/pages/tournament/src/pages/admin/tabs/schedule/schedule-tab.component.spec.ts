import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { print } from 'graphql';
import { of, Subject, throwError } from 'rxjs';
import { ScheduleTabComponent } from './schedule-tab.component';

describe('Scheduling read feedback', () => {
  let fixture: ComponentFixture<ScheduleTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const empty = { data: { tournamentSchedule: [], tournamentScheduleCourts: [], unscheduledGames: [] } };

  beforeEach(async () => {
    query = jest.fn(() => of(empty));
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [ScheduleTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(ScheduleTabComponent);
    fixture.componentRef.setInput('tournament', { id: 'safe-tournament' });
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  afterEach(() => expect(mutate).not.toHaveBeenCalled());

  it('keeps genuine empty success distinct from an error and uses the real court contract', async () => {
    await settle();
    expect(fixture.componentInstance.error()).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('all.tournament.admin.schedule.noSlots');
    const request = query.mock.calls[0][0];
    expect(request.variables).toEqual({ tournamentEventId: 'safe-tournament', date: undefined });
    expect(request.fetchPolicy).toBe('network-only');
    expect(print(request.query)).toContain('tournamentScheduleCourts(tournamentEventId: $tournamentEventId)');
    expect(print(request.query)).toContain('gamePlayer {');
    expect(print(request.query)).not.toContain('player {');
    expect(print(request.query)).not.toContain('location {');
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('shows native busy feedback without empty summaries or operational controls while pending', async () => {
    const pending = new Subject<typeof empty>();
    query.mockReturnValue(pending);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('p-progressbar')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.schedule.noSlots');
    expect(fixture.nativeElement.querySelector('p-button')).toBeNull();
    pending.next(empty);
    pending.complete();
    await settle();
    expect(fixture.nativeElement.querySelector('[aria-busy="true"]')).toBeNull();
  });

  it('retains server diagnostics, hides empty success and retries without a mutation', async () => {
    query.mockReturnValueOnce(throwError(() => new Error('Safe scheduling read failure')));
    await settle();
    expect(fixture.componentInstance.error()).toBe('Safe scheduling read failure');
    expect(fixture.nativeElement.querySelector('p-message')?.textContent).toContain('Safe scheduling read failure');
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.schedule.noSlots');
    expect(fixture.componentInstance.stats().totalSlots).toBe(0);
    const retry: HTMLButtonElement = fixture.nativeElement.querySelector('p-button button');
    expect(retry.textContent).toContain('all.button.refresh');
    retry.click();
    await settle();
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.error()).toBeNull();
    expect(fixture.nativeElement.querySelector('p-message')).toBeNull();
  });

  it.each([
    {},
    { tournamentSchedule: [], tournamentScheduleCourts: [] },
    { tournamentSchedule: null, tournamentScheduleCourts: [], unscheduledGames: [] },
    { tournamentSchedule: [], tournamentScheduleCourts: null, unscheduledGames: [] },
    { tournamentSchedule: [], tournamentScheduleCourts: [], unscheduledGames: null },
  ])('does not interpret malformed payload %j as empty success', async (data) => {
    query.mockReturnValueOnce(of({ data }));
    await settle();
    expect(fixture.componentInstance.error()).toBe('all.error.genericTitle');
    expect(fixture.nativeElement.querySelector('p-message')).not.toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.schedule.noSlots');
  });

  it('preserves populated player identities and replaces the grid with explicit feedback on a failed refresh', async () => {
    const game = { id: 'safe-game', gamePlayerMemberships: [{ single: 1, gamePlayer: { fullName: 'Safe One' } }] };
    const response = {
      data: {
        tournamentSchedule: [
          { id: 'safe-slot', courtId: 'safe-court', startTime: '2026-11-09T09:00:00Z', endTime: '2026-11-09T09:30:00Z', status: 'AVAILABLE' },
        ],
        tournamentScheduleCourts: [{ id: 'safe-court', name: 'Safe Court' }],
        unscheduledGames: [game],
      },
    };
    query.mockReturnValueOnce(of(response));
    await settle();
    expect(fixture.componentInstance.slots()).toHaveLength(1);
    expect(fixture.componentInstance.courts()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Safe One vs TBD');
    query.mockReturnValueOnce(throwError(() => new Error('Safe refresh failure')));
    fixture.componentInstance.refetch();
    await settle();
    expect(fixture.componentInstance.error()).toBe('Safe refresh failure');
    expect(() => fixture.componentInstance.slots()).not.toThrow();
    expect(fixture.nativeElement.textContent).not.toContain('all.tournament.admin.schedule.noSlots');
    expect(fixture.nativeElement.querySelector('p-select')).toBeNull();
  });

  it('reacts to tournament and date changes with current request variables', async () => {
    await settle();
    const date = new Date('2026-11-09T00:00:00Z');
    fixture.componentInstance.selectedDate.set(date);
    await settle();
    expect(query.mock.lastCall?.[0].variables).toEqual({ tournamentEventId: 'safe-tournament', date });
    fixture.componentRef.setInput('tournament', { id: 'safe-other' });
    await settle();
    expect(query.mock.lastCall?.[0].variables).toEqual({ tournamentEventId: 'safe-other', date });
  });

  it('ignores a stale response after the tournament changes', async () => {
    const stale = new Subject<{
      data: { tournamentSchedule: []; tournamentScheduleCourts: { id: string; name: string }[]; unscheduledGames: [] };
    }>();
    query.mockReturnValueOnce(stale);
    fixture.detectChanges();
    const firstSignal: AbortSignal = query.mock.calls[0][0].context.signal;
    fixture.componentRef.setInput('tournament', { id: 'safe-other' });
    await settle();
    expect(firstSignal.aborted).toBe(true);
    stale.next({ data: { ...empty.data, tournamentScheduleCourts: [{ id: 'safe-stale-court', name: 'Stale Court' }] } });
    stale.complete();
    await settle();
    expect(query.mock.lastCall?.[0].variables.tournamentEventId).toBe('safe-other');
    expect(fixture.componentInstance.error()).toBeNull();
    expect(fixture.componentInstance.courts()).toEqual([]);
    expect(fixture.nativeElement.textContent).not.toContain('Stale Court');
  });
});
