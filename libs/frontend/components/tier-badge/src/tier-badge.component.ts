import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-tier-badge',
  imports: [TagModule],
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

  designTokens = computed(() =>
    this.size() === 'sm'
      ? {
          primary: { color: '{text.color}' },
          borderRadius: '4px',
          fontSize: '0.8125rem',
          fontWeight: '700',
          padding: '0.2rem 8px',
        }
      : {
          primary: { color: '{text.color}' },
          borderRadius: '4px',
          fontWeight: '700',
          padding: '0.375rem 11px',
        },
  );
}
