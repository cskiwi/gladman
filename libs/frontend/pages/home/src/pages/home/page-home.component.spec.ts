import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Table } from 'primeng/table';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { PageHomeComponent } from './page-home.component';

describe('PageHomeComponent', () => {
  let fixture: ComponentFixture<PageHomeComponent>;
  const user = signal<{ id: string } | null>(null);

  beforeEach(async () => {
    user.set(null);
    const rankingSystem = {
      name: 'Test ranking system',
      amountOfLevels: 3,
      pointsToGoUp: [100, 50, 0],
      pointsToGoDown: [25, 0],
      pointsWhenWinningAgainst: [10, 20, 30],
      calculationLastUpdate: null,
    };

    await TestBed.configureTestingModule({
      imports: [PageHomeComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: Apollo,
          useValue: {
            query: jest.fn(() =>
              of({ data: { rankingSystem, player: { rankingLastPlaces: [] } } }),
            ),
          },
        },
        {
          provide: RankingSystemService,
          useValue: {
            systemId: signal('test-system'),
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
