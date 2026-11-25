import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { PlayerRankingComponent } from './player-ranking.component';

describe(PlayerRankingComponent.name, () => {
  const places = [
    { id: 'older', rankingDate: '2026-02-01', single: 7, double: 8, mix: 9, updatePossible: true },
    { id: 'between', rankingDate: '2026-02-20', single: 6, double: 7, mix: 8, singlePoints: 12 },
    { id: 'boundary', rankingDate: '2026-03-01', single: 5, double: 6, mix: 7, updatePossible: true },
    { id: 'next', rankingDate: '2026-03-20', single: 4, double: 5, mix: 6, singlePoints: 0, doublePoints: null },
  ];
  let fixture: ComponentFixture<PlayerRankingComponent>;
  let systemId: ReturnType<typeof signal<string | null>>;
  let loaded: ReturnType<typeof signal<boolean>>;
  let requests: Subject<unknown>[];
  let query: jest.Mock;
  let mutate: jest.Mock;

  beforeEach(async () => {
    systemId = signal('example-system');
    loaded = signal(true);
    requests = [];
    query = jest.fn(() => {
      const request = new Subject<unknown>();
      requests.push(request);
      return request;
    });
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [PlayerRankingComponent, TranslateModule.forRoot()],
      providers: [
        { provide: Apollo, useValue: { query, mutate } },
        { provide: RankingSystemService, useValue: { systemId, loaded } },
        MessageService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PlayerRankingComponent);
    fixture.componentRef.setInput('player', { id: 'example-player' });
    fixture.detectChanges();
  });

  function component() {
    return fixture.componentInstance;
  }

  function host(): HTMLElement {
    return fixture.nativeElement;
  }

  async function respond(data: unknown, request = requests[requests.length - 1]) {
    request.next(data);
    request.complete();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('distinguishes named loading from empty results and preserves the query contract', async () => {
    expect(host().querySelector('[role="progressbar"]')?.getAttribute('aria-label')).toBe('all.ranking.edit.loading');
    expect(host().textContent).not.toContain('all.ranking.edit.no-ranking');
    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { id: 'example-player', args: { where: [{ systemId: { eq: 'example-system' } }] } },
        fetchPolicy: 'network-only',
      }),
    );
    await respond({ data: { player: { rankingPlaces: [] } } });
    expect(host().querySelector('[role="progressbar"]')).toBeNull();
    expect(host().querySelector('.p-message-info')?.textContent).toContain('all.ranking.edit.no-ranking');
    expect(host().querySelector('table')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it('preserves descending groups and renders named native tables, zero points and dated edit actions', async () => {
    await respond({ data: { player: { rankingPlaces: places } } });
    expect(
      component()
        .rankingGroups()
        .map(([boundary, group]) => [boundary?.id, group.map((place) => place.id)]),
    ).toEqual([
      [undefined, ['next']],
      ['boundary', ['boundary', 'between']],
      ['older', ['older']],
    ]);
    expect(host().querySelectorAll('p-accordion-panel')).toHaveLength(3);
    const table = host().querySelector('table');
    expect(table?.querySelector('caption')?.textContent).toContain('all.ranking.edit.next-ranking');
    expect(table?.querySelectorAll('thead th[scope="col"]')).toHaveLength(5);
    const cells = table?.querySelectorAll('tbody td');
    expect(cells?.[1].textContent).toContain('Mar 20, 2026');
    expect(cells?.[1].querySelector('button')).toBeNull();
    expect(cells?.[2].textContent).toContain('4');
    expect(cells?.[2].textContent).toContain('all.ranking.breakdown.points: 0');
    expect(cells?.[3].textContent?.trim()).toBe('5');
    expect(cells?.[4].textContent?.trim()).toBe('6');
    const updateDate = host().querySelectorAll('table')[1].querySelectorAll('tbody tr')[0].querySelectorAll('td')[1];
    expect(updateDate.querySelector('span')?.textContent).toContain('Mar 1, 2026');
    expect(updateDate.querySelector('p-tag')).toBeNull();
    const panels = host().querySelectorAll('p-accordion-panel');
    expect(panels[0].querySelector('p-accordion-header p-tag')).toBeNull();
    expect(panels[1].querySelector('p-accordion-header p-tag')?.textContent).toContain('all.ranking.edit.update-possible');
    expect(panels[1].querySelector('tbody p-tag')).toBeNull();
    expect(host().querySelector('button[aria-label="all.ranking.edit.edit: Mar 20, 2026"]')).not.toBeNull();
    expect(host().querySelector('.cursor-pointer')).toBeNull();
  });

  it('updates discipline headers and concise points metadata when the locale changes', async () => {
    await respond({ data: { player: { rankingPlaces: places } } });
    const translate = TestBed.inject(TranslateService);
    for (const [locale, singles, doubles, mixed, points] of [
      ['en', 'Singles', 'Doubles', 'Mixed', 'Points'],
      ['nl_BE', 'Enkel', 'Dubbel', 'Gemengd', 'Punten'],
      ['fr_BE', 'Simples', 'Doubles', 'Mixte', 'Points'],
    ]) {
      translate.setTranslation(locale, {
        all: { game: { filter: { singles, doubles, mixed } }, ranking: { breakdown: { points } } },
      });
      translate.use(locale);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      const table = host().querySelector('table');
      const headers = Array.from(table?.querySelectorAll('thead th') ?? []).map((header) => header.textContent?.trim());
      expect(headers.slice(2)).toEqual([singles, doubles, mixed]);
      expect(table?.querySelector('tbody td:nth-child(3) div')?.textContent?.trim()).toBe(`${points}: 0`);
    }
  });

  it('opens the exact existing place or a blank add form without submitting a mutation', async () => {
    await respond({ data: { player: { rankingPlaces: places } } });
    host().querySelector<HTMLButtonElement>('button[aria-label="all.ranking.edit.edit: Mar 20, 2026"]')?.click();
    fixture.detectChanges();
    expect(component().dialogVisible()).toBe(true);
    expect(component().editingPlace()).toEqual(expect.objectContaining({ id: 'next', playerId: 'example-player', systemId: 'example-system' }));
    expect(component().editForm.getRawValue()).toEqual(expect.objectContaining({ rankingDate: new Date('2026-03-20'), single: 4, singlePoints: 0 }));
    component().dialogVisible.set(false);
    fixture.detectChanges();
    host().querySelector<HTMLButtonElement>('button')?.click();
    fixture.detectChanges();
    expect(component().isNewPlace()).toBe(true);
    expect(component().editForm.get('single')?.value).toBeNull();
    expect(component().editForm.pristine).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['rejected', 'missing', 'partial'])('reports %s reads without empty or stale success content', async (outcome) => {
    if (outcome === 'rejected') {
      requests[0].error(new Error('Safe failed ranking read'));
      await fixture.whenStable();
      fixture.detectChanges();
    } else {
      await respond({
        data: { player: outcome === 'missing' ? null : { rankingPlaces: places } },
        ...(outcome === 'partial' ? { error: new Error('Safe partial ranking read') } : {}),
      });
    }
    expect(host().querySelector('.p-message-error[role="alert"]')?.textContent).toContain('all.ranking.edit.load-error');
    expect(host().textContent).not.toContain('all.ranking.edit.no-ranking');
    expect(host().querySelector('table')).toBeNull();
    expect(host().querySelector('[role="progressbar"]')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['success', 'failure'])('ignores a stale %s after context changes and permits current-context recovery', async (outcome) => {
    const original = requests[0];
    systemId.set('another-system');
    fixture.detectChanges();
    expect(query).toHaveBeenCalledTimes(2);
    await respond({ data: { player: { rankingPlaces: [places[3]] } } });
    if (outcome === 'failure') {
      original.error(new Error('Safe stale read failure'));
      await fixture.whenStable();
      fixture.detectChanges();
    } else {
      await respond({ data: { player: { rankingPlaces: [] } } }, original);
    }
    expect(
      component()
        .rankingGroups()[0][1]
        .map((place) => place.id),
    ).toEqual(['next']);
    expect(component().loadError()).toBe(false);
    expect(component().loading()).toBe(false);
  });

  it('waits for system context, reports its absence and clears previous data during a player switch', async () => {
    await respond({ data: { player: { rankingPlaces: places } } });
    systemId.set(null);
    loaded.set(false);
    fixture.detectChanges();
    expect(component().rankingGroups()).toEqual([]);
    expect(component().loading()).toBe(true);
    loaded.set(true);
    fixture.detectChanges();
    expect(component().loadError()).toBe(true);
    expect(component().loading()).toBe(false);
    systemId.set('recovered-system');
    fixture.componentRef.setInput('player', { id: 'other-player' });
    fixture.detectChanges();
    expect(component().loadError()).toBe(false);
    expect(component().loading()).toBe(true);
    expect(query.mock.calls[1][0].variables.id).toBe('other-player');
    await respond({ data: { player: { rankingPlaces: [] } } });
    expect(component().loadError()).toBe(false);
    expect(host().textContent).toContain('all.ranking.edit.no-ranking');
  });
});
