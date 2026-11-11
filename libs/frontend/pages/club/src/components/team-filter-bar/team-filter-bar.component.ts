import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TeamGenderFilter } from '../../pages/detail/tabs/club-teams-tab.service';

interface BucketCounts {
  all: number;
  M: number;
  F: number;
  MX: number;
}

@Component({
  selector: 'app-team-filter-bar',
  imports: [FormsModule, TranslateModule, SelectButtonModule],
  templateUrl: './team-filter-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamFilterBarComponent {
  readonly filter = input.required<TeamGenderFilter>();
  readonly counts = input.required<BucketCounts>();

  readonly filterChange = output<TeamGenderFilter>();

  readonly countKey = computed(() => `all.club.detail.teams.count.${this.counts().all === 1 ? 'one' : 'other'}`);

  readonly options = computed(() => {
    const counts = this.counts();
    return [
      { key: 'all', value: 'all' as const, count: counts.all },
      { key: 'men', value: 'M' as const, count: counts.M },
      { key: 'women', value: 'F' as const, count: counts.F },
      { key: 'mixed', value: 'MX' as const, count: counts.MX },
    ];
  });

  select(filter: TeamGenderFilter) {
    if (filter !== this.filter()) {
      this.filterChange.emit(filter);
    }
  }
}
