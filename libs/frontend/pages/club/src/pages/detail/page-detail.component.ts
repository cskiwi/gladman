import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { HeroAvatarComponent, HeroComponent, HeroTitleComponent } from '@app/frontend-components/hero';
import { BreadcrumbComponent } from '@app/frontend-components/breadcrumb';
import { AuthService } from '@app/frontend-modules-auth/service';
import { SeoService } from '@app/frontend-modules-seo/service';
import { Team } from '@app/models';
import { TranslateModule } from '@ngx-translate/core';
import { injectParams } from 'ngxtension/inject-params';
import { injectQueryParams } from 'ngxtension/inject-query-params';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { TeamEditComponent } from '../../components/team-edit/team-edit.component';
import { ClubScheduleCardComponent } from '../../components/club-schedule-card';
import { ClubTopPerformersCardComponent } from '../../components/club-top-performers-card';
import { DetailService } from './page-detail.service';
import {
  ClubScheduleTabComponent,
  ClubTeamsTabComponent,
  ClubTournamentsTabComponent,
  ClubPlayersTabComponent,
  ClubTeamBuilderTabComponent,
} from './tabs';

const SIDEBAR_HIDDEN_KEY = 'club-detail.sidebar-hidden';

@Component({
  selector: 'app-page-detail',
  imports: [
    BreadcrumbComponent,
    CommonModule,
    RouterModule,
    MessageModule,
    ProgressBarModule,
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    TranslateModule,
    CardModule,
    TabsModule,
    TagModule,
    TooltipModule,
    HeroComponent,
    HeroAvatarComponent,
    HeroTitleComponent,
    ClubTeamsTabComponent,
    ClubPlayersTabComponent,
    ClubScheduleTabComponent,
    ClubTournamentsTabComponent,
    ClubTeamBuilderTabComponent,
    ClubScheduleCardComponent,
    ClubTopPerformersCardComponent,
  ],
  providers: [DialogService],
  host: { class: 'flex flex-col' },
  templateUrl: './page-detail.component.html',
})
export class PageDetailComponent {
  readonly dataService = new DetailService();
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly clubId = injectParams('clubId');
  private readonly tabParam = injectQueryParams('tab');

  readonly activeTab = computed(() => {
    const tab = this.tabParam();
    if (tab === 'team-builder') return this.canAccessTeamBuilder() ? tab : 'overview';
    return tab && ['overview', 'players', 'schedule', 'tournaments'].includes(tab) ? tab : 'overview';
  });

  // selectors
  club = this.dataService.club;
  currentSeason = this.dataService.currentSeason;
  availableSeasons = this.dataService.availableSeasons;
  stats = this.dataService.stats;
  teams = this.dataService.teams;
  teamCount = this.dataService.teamCount;

  /** Distinct league/type buckets across the club's teams (M/W/Mix). */
  readonly teamLeagueCount = computed(() => {
    const types = new Set(
      this.teams()
        .map((t) => t.type)
        .filter(Boolean),
    );
    return types.size;
  });

  /** Crest text â€” uses abbreviation if present, otherwise initials of the name. */
  readonly clubCrestText = computed(() => {
    const c = this.club();
    if (!c) return '';
    if (c.abbreviation) return c.abbreviation.slice(0, 4).toUpperCase();
    const source = c.fullName || c.name || '';
    return source
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  });

  error = this.dataService.error;
  loading = this.dataService.loading;

  /** Whether the right-hand sidebar (upcoming fixtures + top performers) is hidden. Persisted per browser. */
  readonly sidebarHidden = signal(this.readSidebarHidden());

  private readonly auth = inject(AuthService);

  // Form control getters
  get seasonControl() {
    return this.dataService.filter.get('season') as FormControl<number>;
  }

  private readonly dialogService = inject(DialogService);

  toggleSidebar(): void {
    const hidden = !this.sidebarHidden();
    this.sidebarHidden.set(hidden);
    try {
      localStorage.setItem(SIDEBAR_HIDDEN_KEY, String(hidden));
    } catch {
      // storage unavailable (private mode, SSR) – keep the in-memory state only
    }
  }

  private readSidebarHidden(): boolean {
    try {
      return localStorage.getItem(SIDEBAR_HIDDEN_KEY) === 'true';
    } catch {
      return false;
    }
  }

  canEditTeam(team: Team): boolean {
    return this.auth.hasAnyPermission(['edit-any:team', 'edit-any:club', `${team.id}_edit:team`]);
  }

  canAccessTeamBuilder(): boolean {
    const clubId = this.clubId();
    return this.auth.hasAnyPermission(['edit-any:club', `${clubId}_edit:club`]);
  }

  onTabChange(value: string | number | undefined): void {
    if (value === undefined) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: value.toString() },
      queryParamsHandling: 'merge',
    });
  }

  canCreateTournament(): boolean {
    const clubId = this.clubId();
    return this.auth.hasAnyPermission(['create-any:tournament', 'edit-any:club', `${clubId}_edit:club`, `${clubId}_create:tournament`]);
  }

  createTournament(): void {
    const clubId = this.clubId();
    // Navigate to tournament creation page with club context
    this.router.navigate(['/tournament', 'create'], { queryParams: { clubId } });
  }

  editTeam(team: Team): void {
    const ref = this.dialogService.open(TeamEditComponent, {
      header: 'Edit Team',
      data: { team },
      width: '90%',
      maximizable: true,
      style: { maxWidth: '800px' },
    });

    ref?.onClose.subscribe((updatedTeam: Team | undefined) => {
      if (updatedTeam) {
        // Refresh club data
        this.dataService.filter.get('clubId')?.setValue(this.clubId());
      }
    });
  }

  constructor() {
    effect(() => {
      const clubId = this.clubId();
      if (clubId) {
        this.dataService.filter.get('clubId')?.setValue(clubId);
      }
    });

    effect(() => {
      const club = this.club();
      if (club) {
        this.seoService.update({
          seoType: 'club',
          club,
        });
      }
    });
  }
}
