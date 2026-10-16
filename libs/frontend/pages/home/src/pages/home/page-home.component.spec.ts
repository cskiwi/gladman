import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { PageHomeComponent } from './page-home.component';

describe('PageHomeComponent', () => {
  let fixture: ComponentFixture<PageHomeComponent>;

  beforeEach(async () => {
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
            query: jest.fn(() => of({ data: { rankingSystem } })),
          },
        },
        {
          provide: RankingSystemService,
          useValue: {
            systemId: signal('test-system'),
          },
        },
        {
          provide: AuthService,
          useValue: {
            user: signal(null),
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
});
