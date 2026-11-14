import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Apollo } from 'apollo-angular';
import { of, throwError } from 'rxjs';
import { TeamDetailService } from './page-team-detail.service';

describe('team detail failed-load selectors', () => {
  const query = jest.fn();
  const team = { id: 'team', name: 'Example team', teamPlayerMemberships: [] };

  beforeEach(() => {
    query.mockReset();
    query.mockReturnValue(of({ data: { team, entries: [], competitionEncounters: [] } }));
    TestBed.configureTestingModule({
      providers: [{ provide: Apollo, useValue: { query } }],
    });
  });

  it.each(['team', 'related'])('keeps selectors safe after a %s request fails and recovers on a new team', async (failure) => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    if (failure === 'related') {
      query.mockReturnValueOnce(of({ data: { team } }));
    }
    query.mockReturnValueOnce(throwError(() => new Error('Synthetic failure')));
    try {
      const service = TestBed.runInInjectionContext(() => new TeamDetailService());
      service.filter.controls.teamId.setValue('failed-team');
      TestBed.tick();
      await TestBed.inject(ApplicationRef).whenStable();

      expect(service.error()).toBeTruthy();
      expect(service.loading()).toBe(false);
      expect(service.team()).toBeUndefined();
      expect(service.players()).toEqual([]);
      expect(service.entry()).toBeNull();
      expect(service.playerStats().size).toBe(0);
      expect(log).toHaveBeenCalled();

      service.filter.controls.teamId.setValue('recovered-team');
      TestBed.tick();
      await TestBed.inject(ApplicationRef).whenStable();
      expect(service.error()).toBeNull();
      expect(service.team()).toEqual(team);
      expect(service.players()).toEqual([]);
      expect(service.entry()).toBeNull();
    } finally {
      log.mockRestore();
    }
  });
});

describe('team roster membership feedback', () => {
  const mutate = jest.fn();

  beforeEach(() => {
    mutate.mockReset();
    TestBed.configureTestingModule({
      providers: [{ provide: Apollo, useValue: { mutate } }],
    });
  });

  it.each(['add', 'remove'] as const)('logs and exposes %s request failures, then clears feedback on successful retry', async (operation) => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const service = TestBed.runInInjectionContext(() => new TeamDetailService());
    const perform = () => (operation === 'add' ? service.addPlayerToTeam('team', 'player') : service.removePlayerFromTeam('membership'));
    mutate.mockReturnValueOnce(throwError(() => new Error('Synthetic failure')));
    try {
      await perform();
      expect(service.membershipError()).toBe(`all.team.detail.roster.${operation}Error`);
      expect(log).toHaveBeenCalledTimes(1);
      expect(mutate.mock.calls[0][0].variables).toEqual(
        operation === 'add' ? { teamId: 'team', playerId: 'player', membershipType: 'REGULAR' } : { id: 'membership' },
      );

      mutate.mockReturnValueOnce(
        of({ data: operation === 'add' ? { addTeamPlayerMembership: { id: 'membership' } } : { removeTeamPlayerMembership: true } }),
      );
      await perform();
      expect(service.membershipError()).toBeNull();
    } finally {
      log.mockRestore();
    }
  });

  it.each(['add', 'remove'] as const)('reports a rejected %s result instead of silently accepting it', async (operation) => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mutate.mockReturnValue(of({ data: operation === 'add' ? { addTeamPlayerMembership: null } : { removeTeamPlayerMembership: false } }));
    try {
      const service = TestBed.runInInjectionContext(() => new TeamDetailService());
      if (operation === 'add') await service.addPlayerToTeam('team', 'player');
      else await service.removePlayerFromTeam('membership');
      expect(service.membershipError()).toBe(`all.team.detail.roster.${operation}Error`);
      expect(log).toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });
});
