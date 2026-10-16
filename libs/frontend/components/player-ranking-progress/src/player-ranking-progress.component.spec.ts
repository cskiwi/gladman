import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RankingLastPlace, RankingSystem } from '@app/models';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { PlayerRankingProgressComponent } from './player-ranking-progress.component';

describe('PlayerRankingProgressComponent', () => {
  let component: PlayerRankingProgressComponent;
  let fixture: ComponentFixture<PlayerRankingProgressComponent>;

  beforeEach(async () => {
    const rankingSystem = {
      amountOfLevels: 4,
      pointsToGoUp: [30, 50, 70],
      pointsToGoDown: [10, 20, 30],
      pointsWhenWinningAgainst: [1, 1, 1, 1],
    } as RankingSystem;
    const rankingPlace = {
      id: 'ranking-place',
      single: 3,
      singlePoints: 55,
      singlePointsDowngrade: 20,
      double: 3,
      doublePoints: 40,
      doublePointsDowngrade: 9,
      mix: 3,
      mixPoints: 40,
      mixPointsDowngrade: 20,
      systemId: 'system-id',
    } as RankingLastPlace;

    await TestBed.configureTestingModule({
      imports: [PlayerRankingProgressComponent],
      providers: [
        {
          provide: Apollo,
          useValue: {
            query: () =>
              of({ data: { player: { rankingLastPlaces: [rankingPlace] } } }),
          },
        },
        {
          provide: RankingSystemService,
          useValue: {
            systemId: signal('system-id'),
            system: signal(rankingSystem),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerRankingProgressComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('playerId', 'player-id');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('shows crossed thresholds before the nearer remaining threshold', () => {
    const [single, double, mix] = component.disciplines();

    expect(single.reachedThreshold).toBe('upgrade');
    expect(single.nearer).toBe('upgrade');
    expect(double.reachedThreshold).toBe('downgrade');
    expect(double.nearer).toBe('downgrade');
    expect(mix.reachedThreshold).toBeNull();
    expect(mix.nearer).toBe('upgrade');
    expect(mix.pointsToUpgrade).toBe(10);
    expect(mix.pointsBeforeDowngrade).toBe(11);
  });
});
