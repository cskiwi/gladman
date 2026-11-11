import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { RecentGamesComponent } from '@app/frontend-components/games/recent';
import { UpcomingGamesComponent } from '@app/frontend-components/games/upcoming';
import { HeroAvatarComponent, HeroComponent, HeroTitleComponent } from '@app/frontend-components/hero';
import { BreadcrumbComponent } from '@app/frontend-components/breadcrumb';
import { PlayerRankingProgressComponent } from '@app/frontend-components/player-ranking-progress';
import { SeoService } from '@app/frontend-modules-seo/service';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { injectParams } from 'ngxtension/inject-params';
import { ShowLevelService } from './components/show-level/show-level.service';
import { DetailService } from './page-detail.service';
import { PlayerCurrentFormComponent } from './components/player-current-form/player-current-form.component';
import { PlayerSeasonRecordComponent } from './components/player-season-record/player-season-record.component';
import { PlayerStrongestMatchupsComponent } from './components/player-strongest-matchups/player-strongest-matchups.component';
import { PlayerTeamsComponent } from './components/player-teams/player-teams.component';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-page-detail',
  imports: [
    BreadcrumbComponent,
    ProgressBarModule,
    ButtonModule,
    MessageModule,
    TagModule,
    MenuModule,
    RouterModule,
    TranslateModule,
    HeroComponent,
    HeroAvatarComponent,
    HeroTitleComponent,
    PlayerRankingProgressComponent,
    RecentGamesComponent,
    UpcomingGamesComponent,
    PlayerCurrentFormComponent,
    PlayerSeasonRecordComponent,
    PlayerStrongestMatchupsComponent,
    PlayerTeamsComponent,
  ],
  templateUrl: './page-detail.component.html',
})
export class PageDetailComponent {
  private readonly dataService = new DetailService();
  private readonly seoService = inject(SeoService);
  private readonly playerId = injectParams('playerId');
  private readonly rankingService = inject(RankingSystemService);
  readonly showLevelService = inject(ShowLevelService);

  // selectors
  player = this.dataService.player;
  club = this.dataService.club;
  error = this.dataService.error;
  loading = this.dataService.loading;

  auth = inject(AuthService);
  user = this.auth.user;

  clubs = computed(() => (this.user()?.clubPlayerMemberships ?? []).filter((m) => m?.active));

  rankingPlace = this.showLevelService.rankingPlace;
  maxLevel = computed(() => this.rankingService.system()?.amountOfLevels ?? 12);

  playerInitials = computed(() => {
    const p = this.player();
    if (!p) return '';
    const first = (p.firstName ?? '').trim().charAt(0);
    const lastWords = (p.lastName ?? '').trim().split(/\s+/).filter(Boolean);
    const last = lastWords.length ? lastWords[lastWords.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  });

  private readonly editLabel = toSignal(inject(TranslateService).stream('all.button.edit'));
  editMenuItems = computed(() => [
    {
      label: this.editLabel(),
      icon: 'pi pi-user-edit',
      routerLink: ['edit'],
    },
  ]);

  // Follow state is UI-only for now; persistence will come later.
  readonly following = signal(false);
  toggleFollow(): void {
    this.following.update((v) => !v);
  }

  constructor() {
    effect(() => {
      this.dataService.filter.get('playerId')?.setValue(this.playerId());
    });

    effect(() => {
      const player = this.player();
      if (player) {
        this.seoService.update({
          seoType: 'player',
          player,
        });
      }
    });

    // Load ranking data when player and system are available
    effect(() => {
      const player = this.player();
      const systemId = this.rankingService.systemId();
      if (player?.id && systemId) {
        this.showLevelService.getRanking(player.id, systemId);
      }
    });
  }
}
