import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

/** Presentational summary of an unscheduled game; the smart tab attaches drag behavior to the host. */
@Component({
  selector: 'app-schedule-game-card',
  standalone: true,
  imports: [TagModule],
  templateUrl: './schedule-game-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block cursor-move rounded-border border border-surface p-3 hover:bg-emphasis' },
})
export class ScheduleGameCardComponent {
  gameName = input.required<string>();
  drawName = input<string | null | undefined>(null);
  round = input<string | null | undefined>(null);
}
