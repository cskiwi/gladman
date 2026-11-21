import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-tier-badge',
  templateUrl: './tier-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TierBadgeComponent {
  level = input.required<number | string>();
  size = input<'default' | 'sm'>('default');
  label = input<string>();

  displayValue = computed(() => {
    const level = this.level();
    const label = this.label();

    return label ? `${label} ${level}` : `${level}`;
  });
}
