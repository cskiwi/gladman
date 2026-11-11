import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TournamentScheduleSlot } from '@app/models';
import { ScheduleSlotStatus } from '@app/models-enum';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

/** Presentational content of a single court/time slot; drag-and-drop and mutations stay in the smart tab. */
@Component({
  selector: 'app-schedule-slot',
  standalone: true,
  imports: [TranslateModule, ButtonModule, TagModule, TooltipModule],
  templateUrl: './schedule-slot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
})
export class ScheduleSlotComponent {
  slot = input.required<TournamentScheduleSlot>();
  gameName = input<string>('');
  updating = input<boolean>(false);

  toggleBlock = output<void>();
  remove = output<void>();

  readonly status = ScheduleSlotStatus;
}
