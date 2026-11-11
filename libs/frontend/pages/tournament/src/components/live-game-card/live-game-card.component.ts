import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';

/** Presentational card for one scheduled game on the public live displays. */
@Component({
  selector: 'app-live-game-card',
  imports: [DatePipe, CardModule, TagModule],
  templateUrl: './live-game-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveGameCardComponent {
  readonly time = input<string>();
  readonly badge = input<string>();
  readonly category = input<string>();
  readonly round = input<string>();
  /** Player names of the first side, one per entry. */
  readonly team1 = input<string[]>([]);
  readonly team2 = input<string[]>([]);
  readonly court = input<string>();
}
