import { ChangeDetectionStrategy, Component, computed, effect, input } from '@angular/core';
import { FormSequenceComponent } from '@app/frontend-components/form-sequence';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { PlayerStatsService } from '../player-stats.service';

@Component({
  selector: 'app-player-current-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, ProgressBarModule, TranslateModule, FormSequenceComponent],
  templateUrl: './player-current-form.component.html',
})
export class PlayerCurrentFormComponent {
  private readonly statsService = new PlayerStatsService();

  readonly playerId = input.required<string>();
  readonly loading = this.statsService.loading;

  readonly results = computed(() => this.statsService.form().map((sample) => sample.result));
  readonly wins = computed(() => this.results().filter((result) => result === 'W').length);
  readonly losses = computed(() => this.results().filter((result) => result === 'L').length);

  constructor() {
    effect(() => {
      this.statsService.filter.get('playerId')?.setValue(this.playerId());
    });
  }
}
