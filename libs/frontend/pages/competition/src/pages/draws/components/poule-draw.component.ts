import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Entry } from '@app/models';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-poule-draw',
  imports: [TranslateModule, TooltipModule, RouterModule, CardModule, MessageModule, TableModule, TagModule],
  templateUrl: './poule-draw.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PouleDrawComponent {
  entries = input.required<Entry[]>();
}
