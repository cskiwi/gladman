import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TournamentSubEvent } from '@app/models';
import { GameType } from '@app/models-enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { PageGeneralEnrollmentComponent } from './page-general-enrollment.component';
import { PageGeneralEnrollmentService, CartItem, SubEventWithCalculations } from './page-general-enrollment.service';
import { EnrollmentFiltersComponent } from './components/enrollment-filters/enrollment-filters.component';
import { EnrollmentCartComponent } from './components/enrollment-cart/enrollment-cart.component';
import { SubEventSelectionGridComponent } from './components/sub-event-selection-grid/sub-event-selection-grid.component';

describe('General enrollment chrome', () => {
  const event = Object.assign(new TournamentSubEvent(), {
    id: 'singles',
    name: 'Safe singles',
    gameType: GameType.S,
    _availableSpots: -1,
    _isEnrollmentOpen: true,
    _isAlreadyEnrolled: false,
    _isEligible: true,
  });
  let service: ReturnType<typeof createService>;

  function createService() {
    return {
      loading: signal(false),
      filteredSubEvents: signal<SubEventWithCalculations[]>([event]),
      cartItems: signal<CartItem[]>([]),
      cartCount: signal(0),
      cartId: signal<string | null>('safe-cart'),
      filters: signal({
        eventType: [] as string[],
        gameType: [] as string[],
        level: [] as number[],
        enrollmentStatus: 'ALL' as const,
        searchText: '',
        showOnlyMyLevel: false,
      }),
      userRanking: signal(null),
      userGender: signal(null),
      init: jest.fn(),
      updateFilters: jest.fn(),
      addToCart: jest.fn(),
      removeFromCart: jest.fn(),
      clearCart: jest.fn(),
      submitCart: jest.fn(() => of([{ id: 'safe-enrollment' }])),
    };
  }

  beforeEach(async () => {
    service = createService();
    await TestBed.configureTestingModule({
      imports: [PageGeneralEnrollmentComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: 'tournament/:tournamentId/enroll', component: PageGeneralEnrollmentComponent }]),
        { provide: PageGeneralEnrollmentService, useValue: service },
      ],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      all: {
        button: { back: 'Back' },
        enrollment: {
          title: 'Tournament enrollment',
          subtitle: 'Select events to enter',
          availableEvents: 'Available events',
          loading: 'Loading events',
          noEventsMatch: 'No matching events',
          tryAdjustingFilters: 'Try adjusting filters',
        },
      },
    });
    translate.use('en');
  });

  async function mount() {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/tournament/event/enroll', PageGeneralEnrollmentComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    const element = harness.routeNativeElement;
    if (!element) throw new Error('Enrollment route did not mount');
    return { harness, component, element };
  }

  it('renders the compact localized heading, native Card and existing route initialization', async () => {
    const { element } = await mount();
    expect(service.init).toHaveBeenCalledWith('event');
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('header h1')?.textContent).toContain('Tournament enrollment');
    expect(element.querySelector('header p')?.textContent).toContain('Select events to enter');
    expect(element.querySelector('p-card .p-card-body app-enrollment-filters')).not.toBeNull();
    expect(element.querySelector('#available-events-heading')?.textContent).toContain('(1)');
    expect(element.querySelector('section')?.getAttribute('aria-labelledby')).toBe('available-events-heading');
    expect(element.querySelector('.t-eyebrow')).toBeNull();
    expect(service.submitCart).not.toHaveBeenCalled();
  });

  it('keeps Back a native named button navigating to the same tournament', async () => {
    const { element } = await mount();
    const back = element.querySelector<HTMLButtonElement>('header button');
    expect(back?.type).toBe('button');
    expect(back?.textContent).toContain('Back');
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    back?.click();
    expect(navigate).toHaveBeenCalledWith(['/tournament', 'event']);
  });

  it('names the native loading progressbar and hides children until loading finishes', async () => {
    service.loading.set(true);
    const { harness, element } = await mount();
    expect(element.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(element.querySelector('[role="progressbar"]')?.getAttribute('aria-label')).toBe('Loading events');
    expect(element.querySelector('app-enrollment-filters')).toBeNull();
    expect(element.querySelector('app-enrollment-cart')).toBeNull();
    service.loading.set(false);
    harness.detectChanges();
    expect(element.querySelector('[role="progressbar"]')).toBeNull();
    expect(element.querySelector('app-enrollment-cart')).not.toBeNull();
  });

  it('uses native information feedback for no results without hiding filters or cart', async () => {
    service.filteredSubEvents.set([]);
    const { element } = await mount();
    expect(element.querySelector('.p-message-info')?.textContent).toContain('No matching events');
    expect(element.querySelector('.p-message-info')?.textContent).toContain('Try adjusting filters');
    expect(element.querySelector('#available-events-heading')?.textContent).toContain('(0)');
    expect(element.querySelector('app-enrollment-filters')).not.toBeNull();
    expect(element.querySelector('app-enrollment-cart')).not.toBeNull();
    expect(element.querySelector('app-sub-event-selection-grid')).toBeNull();
  });

  it('preserves child bindings and delegates filter, selection, removal and clear outputs', async () => {
    service.cartItems.set([{ subEventId: 'singles', subEventName: 'Safe singles', eventType: 'M', gameType: 'S' }]);
    const { harness, component } = await mount();
    const filters = harness.fixture.debugElement.query(By.directive(EnrollmentFiltersComponent)).componentInstance as EnrollmentFiltersComponent;
    const grid = harness.fixture.debugElement.query(By.directive(SubEventSelectionGridComponent)).componentInstance as SubEventSelectionGridComponent;
    const cart = harness.fixture.debugElement.query(By.directive(EnrollmentCartComponent)).componentInstance as EnrollmentCartComponent;
    expect(filters.filters()).toEqual(service.filters());
    expect(grid.subEvents()).toEqual([event]);
    expect(grid.selectedIds()).toEqual(['singles']);
    expect(cart.items()).toEqual(service.cartItems());
    filters.filtersChange.emit(service.filters());
    grid.subEventSelect.emit(event);
    grid.subEventRemove.emit('singles');
    cart.removeItem.emit('singles');
    cart.clearCart.emit();
    expect(service.updateFilters).toHaveBeenCalledWith(service.filters());
    expect(service.addToCart).toHaveBeenCalledWith(event);
    expect(service.removeFromCart).toHaveBeenCalledTimes(2);
    expect(service.removeFromCart).toHaveBeenCalledWith('singles', 'safe-cart');
    expect(service.clearCart).toHaveBeenCalledWith('safe-cart');
    expect(component.selectedIds()).toEqual(['singles']);
  });

  it('preserves submitting state and success/error feedback with a mock-only submission', async () => {
    service.cartItems.set([{ subEventId: 'singles', subEventName: 'Safe singles', eventType: 'M', gameType: 'S' }]);
    const result = new Subject<{ id: string }[]>();
    service.submitCart.mockReturnValue(result);
    const { harness, component, element } = await mount();
    const messages = harness.routeDebugElement?.injector.get(MessageService);
    if (!messages) throw new Error('Enrollment MessageService missing');
    const add = jest.spyOn(messages, 'add');
    const cart = harness.fixture.debugElement.query(By.directive(EnrollmentCartComponent)).componentInstance as EnrollmentCartComponent;
    const buttons = element.querySelectorAll<HTMLButtonElement>('app-enrollment-cart button');
    buttons[2].click();
    harness.detectChanges();
    expect(service.submitCart).toHaveBeenCalledWith('safe-cart');
    expect(cart.isSubmitting()).toBe(true);
    buttons.forEach((button) => {
      expect(button.disabled).toBe(true);
      button.click();
    });
    expect(service.submitCart).toHaveBeenCalledTimes(1);
    expect(service.removeFromCart).not.toHaveBeenCalled();
    expect(service.clearCart).not.toHaveBeenCalled();
    result.next([{ id: 'safe-enrollment' }]);
    harness.detectChanges();
    expect(component.isSubmitting()).toBe(false);
    buttons.forEach((button) => expect(button.disabled).toBe(false));
    expect(add).toHaveBeenLastCalledWith(expect.objectContaining({ severity: 'success' }));
    buttons[2].click();
    harness.detectChanges();
    const error = new Error('Safe submission failure');
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      result.error(error);
      expect(component.isSubmitting()).toBe(false);
      harness.detectChanges();
      buttons.forEach((button) => expect(button.disabled).toBe(false));
      expect(add).toHaveBeenLastCalledWith(expect.objectContaining({ severity: 'error' }));
      expect(log).toHaveBeenCalledWith('Submit cart error:', error);
    } finally {
      log.mockRestore();
    }
  });
});
