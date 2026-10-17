import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { IS_MOBILE } from '@app/frontend-utils';
import { Game } from '@app/models';
import { TranslateModule } from '@ngx-translate/core';
import { Tag } from 'primeng/tag';
import { RecentGamesPlayerComponent } from './recent-games-player.component';
import { PlayerRecentGamesService } from './recent-games-player.service';

jest.mock('./recent-games-player.service');

describe('RecentGamesPlayerComponent point indicators', () => {
  let fixture: ComponentFixture<RecentGamesPlayerComponent>;
  const games = signal<Game[]>([]);

  beforeEach(async () => {
    games.set([]);
    (PlayerRecentGamesService as jest.Mock).mockImplementation(() => ({
      games,
      loading: signal(false),
      loadingMore: signal(false),
      hasMore: signal(false),
      counts: signal({ total: 1, singles: 1, doubles: 0, mixed: 0 }),
      setPageSize: jest.fn(),
      filter: { patchValue: jest.fn() },
    }));

    await TestBed.configureTestingModule({
      imports: [RecentGamesPlayerComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: IS_MOBILE, useValue: signal(true) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentGamesPlayerComponent);
    fixture.componentRef.setInput('for', 'current-player');
  });

  it.each([
    [452, '+452', 'success'],
    [-25, '-25', 'danger'],
  ])('renders %s points as %s with native %s severity',
    (points, label, severity) => {
      games.set([{
        id: 'game', gameType: 'S',
        rankingPoints: [{ playerId: 'current-player', points }],
      } as Game]);
      fixture.detectChanges();

      const tags = fixture.debugElement.queryAll(By.directive(Tag));
      const pointTag = tags.find(tag =>
        tag.componentInstance.value() === label);
      expect(pointTag?.componentInstance.severity()).toBe(severity);
      expect(pointTag?.nativeElement.textContent).toContain(label);
      expect(pointTag?.nativeElement.hasAttribute('tabindex')).toBe(false);
    });

  it('omits zero current-player points regardless of opponent points', () => {
      games.set([{
        id: 'game', gameType: 'S',
        rankingPoints: [
          { playerId: 'opponent', points: 999 },
          { playerId: 'current-player', points: 0 },
        ],
      } as Game]);
      fixture.detectChanges();

      const tags = fixture.debugElement.queryAll(By.directive(Tag));
      expect(tags.map(tag => tag.componentInstance.value())).toEqual(['S']);
  });

  it('omits points when ranking data is missing', () => {
    games.set([{ id: 'game', gameType: 'S' } as Game]);
    fixture.detectChanges();

    const tags = fixture.debugElement.queryAll(By.directive(Tag));
    expect(tags.map(tag => tag.componentInstance.value())).toEqual(['S']);
  });
});