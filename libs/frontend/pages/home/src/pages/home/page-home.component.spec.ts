import { signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of, Subject, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { PageHomeComponent } from './page-home.component';

describe('PageHomeComponent', () => {
  let fixture: ComponentFixture<PageHomeComponent>;
  const user = signal<{ id: string } | null>(null);
  const systemId = signal<string | null>('test-system');
  const rankingSystem = {
    name: 'Test ranking system',
    amountOfLevels: 3,
    pointsToGoUp: [100, 50, 0],
    pointsToGoDown: [25, 0],
    pointsWhenWinningAgainst: [10, 20, 30],
    calculationLastUpdate: null,
  };
  let query: jest.Mock;

  beforeEach(async () => {
    user.set(null);
    systemId.set('test-system');
    query = jest.fn(() =>
      of({ data: { rankingSystem, player: { rankingLastPlaces: [] } } }),
    );

    await TestBed.configureTestingModule({
      imports: [PageHomeComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: Apollo,
          useValue: {
            query,
          },
        },
        {
          provide: RankingSystemService,
          useValue: {
            systemId,
            system: signal(rankingSystem),
          },
        },
        {
          provide: AuthService,
          useValue: {
            user,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PageHomeComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders ordered level data, zero values, and null placeholders', () => {
    const element = fixture.nativeElement as HTMLElement;
    const rows = Array.from(element.querySelectorAll('tbody tr'));

    expect(rows).toHaveLength(3);
    expect(
      rows.map((row) =>
        Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim()),
      ),
    ).toEqual([
      ['1', '—', '0', '30'],
      ['2', '50', '25', '20'],
      ['3', '100', '—', '10'],
    ]);
  });

  it('does not render the authenticated ranking strip anonymously', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-player-ranking-progress')).toBeNull();
  });

  it('updates displayed data using the selected declared GraphQL variable', async () => {
    expect(query).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { rankingSystemId: 'test-system' } }),
    );
    query.mockImplementation(({ variables }: { variables: { rankingSystemId?: string } }) => of({
      data: {
        rankingSystem: variables.rankingSystemId === 'alternate-system' ? {
          ...rankingSystem,
          name: 'Alternate fixture ranking system',
          amountOfLevels: 2,
          pointsToGoUp: [200, 0],
          pointsToGoDown: [30],
          pointsWhenWinningAgainst: [15, 5],
        } : rankingSystem,
      },
    }));
    systemId.set('alternate-system');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({ variables: { rankingSystemId: 'alternate-system' } }),
    );
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Alternate fixture ranking system');
    expect(Array.from(element.querySelectorAll('tbody tr')).map((row) =>
      Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim()),
    )).toEqual([
      ['1', '—', '30', '5'],
      ['2', '200', '—', '15'],
    ]);
  });

  it('announces loading until a pending request completes', async () => {
    const response = new Subject<unknown>();
    query.mockReturnValueOnce(response);
    systemId.set('pending-system');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[role="status"]')?.getAttribute('aria-label'))
      .toBe('all.points.table.loading-ranking-system');
    expect(element.querySelectorAll('p-skeleton')).toHaveLength(3);
    expect(element.querySelector('p-message')).toBeNull();
    expect(element.querySelector('p-table')).toBeNull();

    response.next({ data: { rankingSystem } });
    response.complete();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('[role="status"]')).toBeNull();
    expect(element.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  it('renders informational feedback without querying when no system is selected', async () => {
    query.mockClear();
    systemId.set(null);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(query).not.toHaveBeenCalled();
    expect(element.querySelector('.p-message-info')?.textContent)
      .toContain('all.points.table.no-ranking-system');
    expect(element.querySelector('p-table')).toBeNull();
    expect(element.querySelector('[role="status"]')).toBeNull();
  });

  it('renders an explicit empty table when the system has no levels', async () => {
    query.mockReturnValueOnce(of({
      data: { rankingSystem: { ...rankingSystem, amountOfLevels: 0, pointsWhenWinningAgainst: [] } },
    }));
    systemId.set('empty-system');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelectorAll('thead th')).toHaveLength(4);
    expect(element.querySelector('tbody td')?.getAttribute('colspan')).toBe('4');
    expect(element.querySelector('tbody')?.textContent).toContain('all.points.table.no-level-data');
    expect(element.querySelector('p-message')).toBeNull();
  });

  it.each(['initial', 'subsequent'] as const)('renders and recovers from an %s request failure', async (request) => {
    query.mockReturnValueOnce(throwError(() => new HttpErrorResponse({
      status: 503,
      statusText: 'Fixture ranking service unavailable',
    })));
    if (request === 'initial') {
      fixture.destroy();
      fixture = TestBed.createComponent(PageHomeComponent);
    } else {
      systemId.set('failed-system');
    }
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.p-message-error')?.textContent)
      .toContain('Fixture ranking service unavailable');
    expect(element.querySelector('.p-message-info')).toBeNull();
    expect(element.querySelector('[role="status"]')).toBeNull();
    expect(element.querySelector('p-table')).toBeNull();

    systemId.set('recovered-system');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(element.querySelector('p-message')).toBeNull();
    expect(element.querySelector('h1')?.textContent?.trim()).toBe('Test ranking system');
    expect(element.querySelectorAll('tbody tr')).toHaveLength(3);
  });

  it('does not render player rankings when a user has no ID', () => {
    user.set({ id: '' });
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-player-ranking-progress')).toBeNull();
  });

  it('uses the shared hero and section heading without duplicating headings', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-hero .p-card')).not.toBeNull();
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('h1')?.textContent?.trim())
      .toBe('Test ranking system');
    expect(element.querySelectorAll('h2')).toHaveLength(1);
    expect(element.querySelector('app-section-header h2')).not.toBeNull();
  });

  it('keeps the reference data in a native scrollable table within a card', () => {
    const table = fixture.debugElement.query(By.directive(Table));
    const element = fixture.nativeElement as HTMLElement;
    expect(table).not.toBeNull();
    expect(table.componentInstance.scrollable()).toBe(true);
    expect(table.componentInstance.dt()).toEqual({
      row: { background: '{content.background}' },
    });
    expect(element.querySelector('section .p-card p-table')).not.toBeNull();
    expect(element.querySelectorAll('thead th')).toHaveLength(4);
  });

  it('projects the ranking strip into the hero only while authenticated', async () => {
    user.set({ id: 'fixture-player' });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-hero [stats] app-player-ranking-progress'))
      .toHaveLength(1);
    user.set(null);
    fixture.detectChanges();
    expect(element.querySelector('app-player-ranking-progress')).toBeNull();
  });
});
