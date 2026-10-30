import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-form-sequence',
  imports: [TagModule],
  templateUrl: './form-sequence.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSequenceComponent {
  results = input.required<('W' | 'L')[]>();
}
