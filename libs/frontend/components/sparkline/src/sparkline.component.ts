import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { SparkBar } from './sparkline.model';

@Component({
  selector: 'app-sparkline',
  templateUrl: './sparkline.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SparklineComponent {
  bars = input.required<SparkBar[]>();

  private readonly wonKey = 'all.ranking.breakdown.add-game.won';
  private readonly lostKey = 'all.ranking.breakdown.add-game.lost';
  private readonly resultLabels = toSignal(
    inject(TranslateService).stream([this.wonKey, this.lostKey]),
  );

  protected readonly description = computed(() => {
    const labels = this.resultLabels();

    return this.bars().map((bar) => {
      const result = bar.status === 'win'
        ? labels?.[this.wonKey]
        : bar.status === 'loss' ? labels?.[this.lostKey] : undefined;

      return `${bar.height}%${result ? ` ${result}` : ''}`;
    }).join('; ');
  });
}
