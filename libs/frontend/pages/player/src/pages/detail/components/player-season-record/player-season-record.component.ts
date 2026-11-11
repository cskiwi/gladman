import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { PlayerStatsService } from '../player-stats.service';

@Component({
  selector: 'app-player-season-record',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, ProgressBarModule, TagModule, TranslateModule],
  templateUrl: './player-season-record.component.html',
})
export class PlayerSeasonRecordComponent {
  private readonly statsService = new PlayerStatsService();

  readonly playerId = input.required<string>();

  readonly wins = this.statsService.wins;
  readonly losses = this.statsService.losses;
  readonly totalGames = this.statsService.totalGames;
  readonly longestStreak = this.statsService.longestStreak;
  readonly thisMonth = this.statsService.thisMonthRecord;
  readonly winRate = this.statsService.winRate;
  readonly loading = this.statsService.loading;

  constructor() {
    effect(() => {
      this.statsService.filter.get('playerId')?.setValue(this.playerId());
    });
  }
}
