import { Component, output, input } from '@angular/core';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TranslateModule } from '@ngx-translate/core';
import type { CartItem } from '../../page-general-enrollment.service';

@Component({
  selector: 'app-enrollment-cart',
  standalone: true,
  imports: [CardModule, ButtonModule, DividerModule, TranslateModule],
  templateUrl: './enrollment-cart.component.html',
})
export class EnrollmentCartComponent {
  readonly items = input<CartItem[]>([]);
  readonly isSubmitting = input(false);
  readonly clearCart = output<void>();
  readonly submitCart = output<void>();
  readonly removeItem = output<string>();

  /**
   * Handle remove item
   */
  onRemoveItem(subEventId: string): void {
    if (this.isSubmitting()) return;
    this.removeItem.emit(subEventId);
  }

  /**
   * Handle clear cart
   */
  onClearCart(): void {
    if (this.isSubmitting()) return;
    this.clearCart.emit();
  }

  /**
   * Handle submit cart
   */
  onSubmitCart(): void {
    if (this.isSubmitting()) return;
    this.submitCart.emit();
  }
}
