import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { TierBadgeComponent } from '@app/frontend-components/tier-badge';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { PlayerStatsService } from '../player-stats.service';

@Component({
  selector: 'app-player-strongest-matchups',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, ProgressBarModule, TagModule, TranslateModule, TierBadgeComponent],
  templateUrl: './player-strongest-matchups.component.html',
})
export class PlayerStrongestMatchupsComponent {
  private readonly statsService = new PlayerStatsService();

  readonly playerId = input.required<string>();
  readonly opponents = this.statsService.strongestOpponents;
  readonly loading = this.statsService.loading;

  constructor() {
    effect(() => {
      this.statsService.filter.get('playerId')?.setValue(this.playerId());
    });
  }
}
