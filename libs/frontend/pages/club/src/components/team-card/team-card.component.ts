import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FormSequenceComponent } from '@app/frontend-components/form-sequence';
import { Team } from '@app/models';
import { TeamCardService } from './team-card.service';

type GenderCode = 'H' | 'D' | 'G' | 'N';

interface TeamPlayerRow {
  id: string;
  slug: string;
  fullName: string;
  initials: string;
  isCaptain: boolean;
  single?: number;
  double?: number;
  mix?: number;
  isOwn: boolean;
  /** Last 5 W/L results as returned by the API; empty when no games were played. */
  form: ('W' | 'L')[];
}

@Component({
  selector: 'app-team-card',
  imports: [
    RouterModule,
    TranslateModule,
    AvatarModule,
    ButtonModule,
    CardModule,
    DividerModule,
    SkeletonModule,
    TableModule,
    TagModule,
    TooltipModule,
    FormSequenceComponent,
  ],
  providers: [TeamCardService],
  templateUrl: './team-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCardComponent {
  private readonly service = inject(TeamCardService);

  team = input.required<Team>();
  clubId = input.required<string>();
  canEdit = input<boolean>(false);
  /** Id of the currently logged-in player (for the "YOU" highlight). */
  ownPlayerId = input<string | null>(null);

  editClicked = output<Team>();

  constructor() {
    effect(() => {
      const id = this.team()?.id ?? null;
      if (id) this.service.setTeamId(id);
    });
  }

  /** Compute team code like "1G", "2H", "3D" from teamNumber + gender. */
  readonly teamCode = computed(() => {
    const t = this.team();
    const num = t.teamNumber ?? '';
    const g = this.genderCode();
    if (g === 'N') return `${num}` || (t.abbreviation ?? '');
    return `${num}${g}`;
  });

  /** Gender letter shown in the division badge (Belgian convention). */
  readonly genderCode = computed<GenderCode>(() => {
    const t = this.team().type;
    if (t === 'M') return 'H';
    if (t === 'F') return 'D';
    if (t === 'MX') return 'G';
    return 'N';
  });

  /** Sorted player rows; captain first, own player highlighted. */
  readonly playerRows = computed<TeamPlayerRow[]>(() => {
    const t = this.team();
    const own = this.ownPlayerId();
    const captainId = t.captainId ?? t.captain?.id ?? null;
    const list = (t.teamPlayerMemberships ?? [])
      .map<TeamPlayerRow | null>((m) => {
        const p = m.player;
        if (!p) return null;
        const initials = (p.firstName?.[0] ?? '') + (p.lastName?.[0] ?? '');
        const last = p.rankingLastPlaces?.[0];
        const rawForm: boolean[] = Array.isArray((p as { recentForm?: boolean[] }).recentForm)
          ? ((p as { recentForm?: boolean[] }).recentForm as boolean[])
          : [];
        const form = rawForm.slice(0, 5).map((won) => (won ? ('W' as const) : ('L' as const)));
        return {
          id: p.id!,
          slug: p.slug ?? p.id!,
          fullName: p.fullName ?? `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim(),
          initials: initials.toUpperCase() || '?',
          isCaptain: p.id === captainId,
          single: last?.single ?? undefined,
          double: last?.double ?? undefined,
          mix: last?.mix ?? undefined,
          isOwn: !!(own && p.id === own),
          form,
        };
      })
      .filter((r): r is TeamPlayerRow => r !== null);

    // Sort: own first → captain → others (by name)
    return list.sort((a, b) => {
      if (a.isOwn && !b.isOwn) return -1;
      if (!a.isOwn && b.isOwn) return 1;
      if (a.isCaptain && !b.isCaptain) return -1;
      if (!a.isCaptain && b.isCaptain) return 1;
      return a.fullName.localeCompare(b.fullName);
    });
  });

  /** First N rows rendered in the card (others hidden behind "+X more"). */
  readonly visibleRows = computed(() => {
    const rows = this.playerRows();
    return this.expanded() ? rows : rows.slice(0, 5);
  });
  readonly hiddenRowCount = computed(() => Math.max(0, this.playerRows().length - 5));

  /** Roster expansion state — when true, show all players instead of the first 5. */
  readonly expanded = signal(false);

  toggleExpanded(event?: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    this.expanded.update((v) => !v);
  }

  readonly stats = this.service.stats;
  readonly winRate = this.service.winRate;
  readonly statsLoading = this.service.loading;

  onEdit(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.editClicked.emit(this.team());
  }
}
