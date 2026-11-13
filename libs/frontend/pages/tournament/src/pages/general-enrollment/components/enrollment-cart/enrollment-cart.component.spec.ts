import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import type { CartItem } from '../../page-general-enrollment.service';
import { EnrollmentCartComponent } from './enrollment-cart.component';

describe('Enrollment cart presentation', () => {
  const single: CartItem = {
    subEventId: 'safe-single',
    subEventName: 'Safe singles',
    eventType: 'M',
    gameType: 'S',
  };
  const double: CartItem = {
    subEventId: 'safe-double',
    subEventName: 'Safe doubles',
    eventType: 'F',
    gameType: 'D',
    preferredPartnerId: 'safe-partner',
    notes: 'Private fixture note',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentCartComponent, TranslateModule.forRoot()],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      all: {
        enrollment: {
          removeFromCart: 'Remove from cart',
          cart: {
            title: 'Enrollment cart',
            empty: 'Your cart is empty',
            emptyDescription: 'Select events to add them to your cart',
            eventSelected: 'event selected',
            eventsSelected: 'events selected',
            partnerSelected: 'Partner selected',
            totalEvents: 'Total events',
            clear: 'Clear cart',
            enrollNow: 'Enroll now',
          },
        },
      },
    });
    translate.use('en');
  });

  async function mount(items: CartItem[] = [], submitting = false) {
    const fixture = TestBed.createComponent(EnrollmentCartComponent);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('isSubmitting', submitting);
    const component = fixture.componentInstance;
    const remove = jest.spyOn(component.removeItem, 'emit');
    const clear = jest.spyOn(component.clearCart, 'emit');
    const submit = jest.spyOn(component.submitCart, 'emit');
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return { fixture, component, element, remove, clear, submit };
  }

  it('renders a named native Card and translated empty feedback without actions or a summary', async () => {
    const { element } = await mount();
    const region = element.querySelector('.p-card[role="region"]');
    expect(region?.getAttribute('aria-labelledby')).toBe('enrollment-cart-heading');
    expect(element.querySelector('h2')?.textContent).toContain('Enrollment cart');
    expect(element.querySelector('.p-card-content > p')?.textContent).toContain('Your cart is empty');
    expect(element.textContent).toContain('Select events to add them to your cart');
    expect(element.querySelectorAll('button, li, dl')).toHaveLength(0);
  });

  it.each([
    [[single], '1 event selected'],
    [[single, double], '2 events selected'],
  ] as const)('preserves selected count and summary for %s', async (items, subtitle) => {
    const { element } = await mount([...items]);
    expect(element.querySelector('.p-card-subtitle')?.textContent?.replace(/\s+/g, ' ').trim()).toBe(subtitle);
    expect(element.querySelector('dt')?.textContent).toBe('Total events');
    expect(element.querySelector('dd')?.textContent).toBe(String(items.length));
    expect(element.querySelectorAll('ul > li')).toHaveLength(items.length);
  });

  it('preserves item order, game codes and partner indication without exposing private data', async () => {
    const { element } = await mount([double, single]);
    expect(Array.from(element.querySelectorAll('h3'), (heading) => heading.textContent?.trim())).toEqual(['Safe doubles', 'Safe singles']);
    const rows = element.querySelectorAll('li');
    expect(rows[0].textContent).toContain('D');
    expect(rows[0].textContent).toContain('Partner selected');
    expect(rows[1].textContent).toContain('S');
    expect(rows[1].textContent).not.toContain('Partner selected');
    expect(element.textContent).not.toContain('safe-partner');
    expect(element.textContent).not.toContain('Private fixture note');
    expect(element.querySelectorAll('.truncate')).toHaveLength(0);
  });

  it('uses localized event-specific remove labels and native button types', async () => {
    const { element } = await mount([single, double]);
    const buttons = element.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons[0].getAttribute('aria-label')).toBe('Remove from cart Safe singles');
    expect(buttons[1].getAttribute('aria-label')).toBe('Remove from cart Safe doubles');
    buttons.forEach((button) => expect(button.type).toBe('button'));
  });

  it('emits exactly one removal, clear and submission without mutating parent-controlled items', async () => {
    const items = [single, double];
    const { element, remove, clear, submit } = await mount(items);
    const buttons = element.querySelectorAll<HTMLButtonElement>('button');
    buttons[1].click();
    buttons[2].click();
    buttons[3].click();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith('safe-double');
    expect(clear).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(items).toEqual([single, double]);
    expect(element.querySelectorAll('li')).toHaveLength(2);
  });

  it('reflects parent-controlled removal and clearing', async () => {
    const { fixture, element } = await mount([single, double]);
    fixture.componentRef.setInput('items', [double]);
    fixture.detectChanges();
    expect(element.querySelectorAll('li')).toHaveLength(1);
    expect(element.querySelector('h3')?.textContent).toBe('Safe doubles');
    fixture.componentRef.setInput('items', []);
    fixture.detectChanges();
    expect(element.querySelector('.p-card-content > p')?.textContent).toContain('Your cart is empty');
    expect(element.querySelectorAll('button')).toHaveLength(0);
  });

  it('locks all actions during submission, including direct handlers, and restores them afterwards', async () => {
    const { fixture, component, element, remove, clear, submit } = await mount([single], true);
    expect(element.querySelector('p-card')?.getAttribute('aria-busy')).toBe('true');
    expect(element.querySelector('button .pi-spinner')).not.toBeNull();
    element.querySelectorAll<HTMLButtonElement>('button').forEach((button) => {
      expect(button.disabled).toBe(true);
      button.click();
    });
    component.onRemoveItem(single.subEventId);
    component.onClearCart();
    component.onSubmitCart();
    expect(remove).not.toHaveBeenCalled();
    expect(clear).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
    fixture.componentRef.setInput('isSubmitting', false);
    fixture.detectChanges();
    expect(element.querySelector('button .pi-spinner')).toBeNull();
    element.querySelectorAll<HTMLButtonElement>('button').forEach((button) => expect(button.disabled).toBe(false));
    element.querySelector<HTMLButtonElement>('button')?.click();
    expect(remove).toHaveBeenCalledWith(single.subEventId);
  });
});
