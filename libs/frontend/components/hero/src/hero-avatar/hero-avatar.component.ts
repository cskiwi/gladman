import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';

export type HeroAvatarVariant = 'primary' | 'rank';

/**
 * Native theme-aware avatar for a page's initials or identity icon.
 * Used as the avatar slot inside `<app-hero>`.
 */
@Component({
  selector: 'app-hero-avatar',
  imports: [AvatarModule],
  templateUrl: './hero-avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex shrink-0',
    avatar: '',
  },
})
export class HeroAvatarComponent {
  variant = input<HeroAvatarVariant>('primary');

  protected avatarClasses = computed(() =>
    this.variant() === 'rank'
      ? 'bg-emphasis text-color'
      : 'bg-highlight text-primary',
  );
}
