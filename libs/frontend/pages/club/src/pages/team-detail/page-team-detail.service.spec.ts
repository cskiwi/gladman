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
