import { Component, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RankingLastPlace, RankingSystem } from '@app/models';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { Tag } from 'primeng/tag';
import { of, Subject, throwError } from 'rxjs';
import { PlayerRankingProgressComponent } from './player-ranking-progress.component';

@Component({ template: '' })
class ProjectionHostComponent {}

describe('PlayerRankingProgressComponent', () => {
  let component: PlayerRankingProgressComponent;
  let fixture: ComponentFixture<PlayerRankingProgressComponent>;
  let rankingPlace: RankingLastPlace;
  let system: WritableSignal<RankingSystem | null>;
  let query: jest.Mock;

  beforeEach(async () => {
    const rankingSystem = {
      amountOfLevels: 4,
      pointsToGoUp: [30, 50, 70],
      pointsToGoDown: [10, 20, 30],
      pointsWhenWinningAgainst: [1, 1, 1, 1],
    } as RankingSystem;
    rankingPlace = {
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
    system = signal(rankingSystem);
    query = jest.fn(() =>
      of({ data: { player: { rankingLastPlaces: [rankingPlace] } } }),
    );

    await TestBed.configureTestingModule({
      imports: [
        PlayerRankingProgressComponent,
        ProjectionHostComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
        {
          provide: Apollo,
          useValue: { query },
        },
        {
          provide: RankingSystemService,
          useValue: {
            systemId: signal('system-id'),
            system,
          },
        },
      ],
    }).overrideComponent(ProjectionHostComponent, {
      add: { imports: [PlayerRankingProgressComponent] },
    }).overrideTemplate(ProjectionHostComponent, `
      <app-player-ranking-progress playerId="player-id">
        <span singleExtra>Single detail</span>
        <span doubleExtra>Double detail</span>
        <span mixExtra>Mixed detail</span>
      </app-player-ranking-progress>
    `).compileComponents();

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

  it('uses native links for each discipline level', () => {
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('a'),
    );

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/ranking/single', '/ranking/double', '/ranking/mix',
    ]);
    expect(links.map((link) => link.textContent?.trim())).toEqual([
      '3', '3', '3',
    ]);
    expect(links.every((link) => !!link.getAttribute('aria-label')))
      .toBe(true);
    expect(links.every((link) => link.classList.contains('p-button')))
      .toBe(true);
    expect(links.every((link) => link.classList.contains('p-button-lg')))
      .toBe(true);
    expect(links.every((link) => link.classList.contains('no-underline')))
      .toBe(true);
    expect(fixture.nativeElement.textContent)
      .not.toContain('all.ranking.breakdown.points');
  });

  it('uses native directional tags while keeping thresholds and messages', () => {
    const tags = fixture.debugElement.queryAll(By.directive(Tag));

    expect(tags.map((tag) => tag.componentInstance.severity())).toEqual([
      'success', 'danger', 'success', 'danger', 'success', 'danger',
    ]);
    expect(tags[0].componentInstance.icon()).toBe('pi pi-arrow-up');
    expect(tags[0].nativeElement.textContent).toContain('55');
    expect(tags[0].nativeElement.textContent).toContain('50');
    expect(tags[1].componentInstance.icon()).toBe('pi pi-arrow-down');
    expect(fixture.nativeElement.textContent)
      .toContain('all.ranking.progress.upgrade-reached');
    expect(fixture.nativeElement.textContent)
      .toContain('all.ranking.progress.downgrade-reached');
    expect(fixture.nativeElement.querySelectorAll('p-tag .sr-only'))
      .toHaveLength(6);
  });

  it('preserves all three per-discipline projection slots', async () => {
    const host = TestBed.createComponent(ProjectionHostComponent);
    host.detectChanges();
    await host.whenStable();
    host.detectChanges();

    expect(host.nativeElement.querySelector('[singleExtra]')?.textContent)
      .toBe('Single detail');
    expect(host.nativeElement.querySelector('[doubleExtra]')?.textContent)
      .toBe('Double detail');
    expect(host.nativeElement.querySelector('[mixExtra]')?.textContent)
      .toBe('Mixed detail');
  });

  it('handles top, floor, zero points, and missing downgrade points', async () => {
    Object.assign(rankingPlace, {
      single: 1, singlePoints: 0,
      double: 4, doublePoints: 0,
      mixPointsDowngrade: null,
    });
    fixture.componentRef.setInput('playerId', 'boundary-player');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const [single, double] = component.disciplines();
    expect(single.atTop).toBe(true);
    expect(double.atFloor).toBe(true);
    expect(fixture.nativeElement.textContent)
      .toContain('all.ranking.progress.at-top');
    expect(fixture.nativeElement.textContent)
      .toContain('all.ranking.progress.at-floor');
    expect(fixture.nativeElement.querySelectorAll('.p-tag-danger'))
      .toHaveLength(1);
    expect(fixture.nativeElement.querySelector('.p-tag-success')
      ?.textContent).toContain('all.ranking.progress.at-top');
    expect(fixture.nativeElement.textContent).toContain('0 / 30');
  });

  it('hides progress without a player or active system', async () => {
    fixture.componentRef.setInput('playerId', null);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a')).toBeNull();

    fixture.componentRef.setInput('playerId', 'player-id');
    system.set(null);
    fixture.detectChanges();
    expect(component.visible()).toBe(false);
    expect(fixture.nativeElement.querySelector('p-tag')).toBeNull();
  });

  it.each(['empty', 'error'])(
    'preserves hidden behavior for an %s response', async (state) => {
      query.mockReturnValue(state === 'empty'
        ? of({ data: { player: { rankingLastPlaces: [] } } })
        : throwError(() => new Error('Unavailable')));
      fixture.componentRef.setInput('playerId', 'missing-player');
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.visible()).toBe(false);
      expect(fixture.nativeElement.textContent.trim()).toBe('');
    },
  );

  it('stays hidden while ranking data is loading', async () => {
    query.mockReturnValue(new Subject());
    fixture.componentRef.setInput('playerId', 'loading-player');
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    expect(component.visible()).toBe(false);
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });
});
