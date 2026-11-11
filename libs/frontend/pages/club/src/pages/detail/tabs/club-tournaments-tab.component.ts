import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TournamentPhase } from '@app/models-enum';
import { ClubTournamentsTabService } from './club-tournaments-tab.service';

type PhaseSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

const PHASE_LABELS: Record<TournamentPhase, string> = {
  [TournamentPhase.DRAFT]: 'all.tournament.phases.draft',
  [TournamentPhase.ENROLLMENT_OPEN]: 'all.tournament.phases.enrollmentOpen',
  [TournamentPhase.ENROLLMENT_CLOSED]: 'all.tournament.phases.enrollmentClosed',
  [TournamentPhase.DRAWS_MADE]: 'all.tournament.phases.drawsMade',
  [TournamentPhase.SCHEDULED]: 'all.tournament.phases.scheduled',
  [TournamentPhase.IN_PROGRESS]: 'all.tournament.phases.inProgress',
  [TournamentPhase.COMPLETED]: 'all.tournament.phases.completed',
};

const PHASE_SEVERITIES: Record<TournamentPhase, PhaseSeverity> = {
  [TournamentPhase.DRAFT]: 'secondary',
  [TournamentPhase.ENROLLMENT_OPEN]: 'info',
  [TournamentPhase.ENROLLMENT_CLOSED]: 'warn',
  [TournamentPhase.DRAWS_MADE]: 'warn',
  [TournamentPhase.SCHEDULED]: 'info',
  [TournamentPhase.IN_PROGRESS]: 'success',
  [TournamentPhase.COMPLETED]: 'contrast',
};

@Component({
  selector: 'app-club-tournaments-tab',
  standalone: true,
  imports: [TranslateModule, ButtonModule, MessageModule, SkeletonModule, TableModule, TagModule, RouterLink, DatePipe],
  providers: [ClubTournamentsTabService],
  templateUrl: './club-tournaments-tab.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClubTournamentsTabComponent {
  readonly service = inject(ClubTournamentsTabService);

  clubId = input.required<string>();
  canCreate = input<boolean>(false);

  createTournament = output<void>();

  readonly pageSize = 10;
  readonly skeletonRows = [1, 2, 3, 4, 5];

  constructor() {
    effect(() => {
      this.service.setClubId(this.clubId());
    });
  }

  getPhaseLabel(phase: TournamentPhase): string {
    return PHASE_LABELS[phase] ?? 'all.common.unknown';
  }

  getPhaseSeverity(phase: TournamentPhase): PhaseSeverity {
    return PHASE_SEVERITIES[phase] ?? 'secondary';
  }
}
