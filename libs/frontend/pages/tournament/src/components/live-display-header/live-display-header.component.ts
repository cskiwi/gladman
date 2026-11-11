import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { BreadcrumbComponent } from '@app/frontend-components/breadcrumb';
import { HeroAvatarComponent, HeroComponent, HeroTitleComponent } from '@app/frontend-components/hero';

export type LiveConnectionState = 'connected' | 'connecting' | 'offline';

/**
 * Presentational title area for the public live displays: breadcrumb, hero and connection status.
 * With a `tournamentName` the hero identifies the tournament and `title` names the current display.
 */
@Component({
  selector: 'app-live-display-header',
  imports: [TagModule, BreadcrumbComponent, HeroComponent, HeroAvatarComponent, HeroTitleComponent],
  templateUrl: './live-display-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveDisplayHeaderComponent {
  readonly title = input.required<string>();
  readonly state = input.required<LiveConnectionState>();
  readonly tournamentName = input<string>();
  readonly tournamentId = input<string>();

  readonly breadcrumbItems = computed<MenuItem[]>(() => {
    const name = this.tournamentName();
    const id = this.tournamentId();
    return name && id ? [{ label: name, routerLink: ['/tournament', id] }, { label: this.title() }] : [{ label: this.title() }];
  });

  readonly crestText = computed(() => {
    const words = (this.tournamentName() ?? '').trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (words[0] ?? '?').slice(0, 3).toUpperCase();
  });
}
