import { TestBed } from '@angular/core/testing';
import { TournamentSubEvent } from '@app/models';
import { GameType } from '@app/models-enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import type { SubEventWithCalculations } from '../../page-general-enrollment.service';
import { SubEventSelectionGridComponent } from './sub-event-selection-grid.component';

describe('Enrollment selection Cards', () => {
  function event(overrides: Partial<SubEventWithCalculations> = {}): SubEventWithCalculations {
    return Object.assign(new TournamentSubEvent(), {
      id: 'safe-event',
      name: 'Safe singles',
      eventType: 'M',
      gameType: GameType.S,
      minLevel: 3,
      maxLevel: 5,
      _availableSpots: 8,
      _isEnrollmentOpen: true,
      _isAlreadyEnrolled: false,
      _isEligible: true,
      _waitingListCount: 0,
      ...overrides,
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubEventSelectionGridComponent, TranslateModule.forRoot()],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      all: {
        common: { level: 'Level', unknown: 'Unknown' },
        enrollment: {
          addToCart: 'Add to cart',
          removeFromCart: 'Remove from cart',
          alreadyEnrolled: 'Already enrolled',
          notEligible: 'Not eligible',
        },
        tournament: {
          capacity: 'Capacity',
          unlimited: 'Unlimited',
          full: 'Full',
          fullWaitingList: 'Full (waiting list)',
          spotsLeft: '{{count}} spots left',
          inWaitingList: 'on the waiting list',
          eventTypes: { men: 'Men', women: 'Women', mixed: 'Mixed' },
          gameTypes: { singles: 'Singles', doubles: 'Doubles', mixed: 'Mixed' },
        },
      },
    });
    translate.use('en');
  });

  async function mount(events = [event()], selectedIds: string[] = []) {
    const fixture = TestBed.createComponent(SubEventSelectionGridComponent);
    fixture.componentRef.setInput('subEvents', events);
    fixture.componentRef.setInput('selectedIds', selectedIds);
    const component = fixture.componentInstance;
    const select = jest.spyOn(component.subEventSelect, 'emit');
    const remove = jest.spyOn(component.subEventRemove, 'emit');
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return { fixture, component, element, select, remove };
  }

  it('renders ordered native Cards with semantic wrapping titles, metadata and named actions', async () => {
    const { element } = await mount([event(), event({ id: 'safe-double', name: 'Safe doubles', gameType: GameType.D })]);
    expect(element.querySelectorAll('.p-card')).toHaveLength(2);
    expect(Array.from(element.querySelectorAll('h3'), (heading) => heading.textContent?.trim())).toEqual(['Safe singles', 'Safe doubles']);
    expect(element.textContent).toContain('Men');
    expect(element.textContent).toContain('Singles');
    expect(element.textContent).toContain('Doubles');
    expect(element.textContent).toContain('3 - 5');
    element.querySelectorAll('button').forEach((button) => {
      const name = button
        .getAttribute('aria-labelledby')
        ?.split(' ')
        .map((id) => element.querySelector(`#${id}`)?.textContent?.trim());
      expect(name?.[0]).toBe('Add to cart');
      expect(name?.[1]).toMatch(/^Safe /);
      expect(button.type).toBe('button');
    });
    expect(element.querySelector('.truncate, .cursor-pointer, p-chip')).toBeNull();
  });

  it('emits exactly one base event on selection without calculated fields or changing its input', async () => {
    const source = event();
    const { element, select, remove } = await mount([source]);
    element.querySelector<HTMLElement>('.p-card')?.click();
    expect(select).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
    element.querySelector<HTMLButtonElement>('button')?.click();
    expect(select).toHaveBeenCalledTimes(1);
    expect(select).toHaveBeenCalledWith(
      expect.objectContaining({ id: source.id, name: source.name, gameType: GameType.S, minLevel: 3, maxLevel: 5 }),
    );
    expect(Object.keys(select.mock.calls[0][0]).filter((key) => key.startsWith('_'))).toEqual([]);
    expect(source._isEligible).toBe(true);
    expect(remove).not.toHaveBeenCalled();
  });

  it('reflects parent-controlled selection and emits exactly one removal without selecting', async () => {
    const { fixture, element, select, remove } = await mount([event()], ['safe-event']);
    const button = element.querySelector<HTMLButtonElement>('button');
    expect(button?.textContent).toContain('Remove from cart');
    button?.click();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledWith('safe-event');
    expect(select).not.toHaveBeenCalled();
    fixture.componentRef.setInput('selectedIds', []);
    fixture.detectChanges();
    expect(button?.textContent).toContain('Add to cart');
  });

  it.each([false, true])('disables ineligible actions, including already-enrolled=%s', async (alreadyEnrolled) => {
    const item = event({ _isEligible: false, _isAlreadyEnrolled: alreadyEnrolled });
    const { component, element, select, remove } = await mount([item], [item.id]);
    const button = element.querySelector<HTMLButtonElement>('button');
    expect(button?.disabled).toBe(true);
    expect(button?.textContent).toContain(alreadyEnrolled ? 'Already enrolled' : 'Not eligible');
    button?.click();
    component.toggleSelection(item);
    expect(select).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it.each([
    [-1, false, 'Unlimited', 'success'],
    [0, false, 'Full', 'danger'],
    [0, true, 'Full (waiting list)', 'danger'],
    [1, false, '1 spots left', 'warn'],
    [4, false, '4 spots left', 'warn'],
    [5, false, '5 spots left', 'success'],
  ] as const)('preserves capacity %s and waiting-list=%s presentation', async (spots, waitingList, label, severity) => {
    const { element } = await mount([event({ _availableSpots: spots, waitingListEnabled: waitingList, _waitingListCount: 2 })]);
    expect(element.querySelector('.p-tag')?.textContent).toBe(label);
    expect(element.querySelector(`.p-tag-${severity}`)).not.toBeNull();
    expect(element.textContent?.includes('2 on the waiting list')).toBe(spots === 0 && waitingList);
  });

  it('renders no tiles for an empty list and keeps unknown bounds absent', async () => {
    const { fixture, element } = await mount([]);
    expect(element.querySelectorAll('.p-card')).toHaveLength(0);
    fixture.componentRef.setInput('subEvents', [event({ minLevel: undefined, maxLevel: undefined })]);
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Level:');
  });
});
