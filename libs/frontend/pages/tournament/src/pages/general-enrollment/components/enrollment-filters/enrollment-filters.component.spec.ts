import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RankingLastPlace } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Slider } from 'primeng/slider';
import { EnrollmentFiltersComponent } from './enrollment-filters.component';

describe('Enrollment filters and rankings', () => {
  const allFilters = {
    eventType: [] as string[],
    gameType: [] as string[],
    level: [] as number[],
    enrollmentStatus: 'ALL' as const,
    searchText: '',
    showOnlyMyLevel: false,
  };
  const ranking = Object.assign(new RankingLastPlace(), {
    single: 4,
    double: 6,
    mix: 5,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentFiltersComponent, TranslateModule.forRoot()],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      all: {
        enrollment: {
          filters: {
            eventType: 'Event type',
            category: 'Category',
            level: 'Level',
            status: 'Enrollment status',
            clear: 'Clear',
            yourRankings: 'Your rankings',
            showOnlyMyLevel: 'Only my level',
            single: 'Singles',
            double: 'Doubles',
            mixed: 'Mixed',
            statusOptions: {
              all: 'All events',
              available: 'Available',
              open: 'Open',
            },
          },
        },
      },
    });
    translate.use('en');
  });

  async function mount(options?: { gender?: 'M' | 'F' | null; ranking?: RankingLastPlace | null; filters?: typeof allFilters }) {
    const fixture = TestBed.createComponent(EnrollmentFiltersComponent);
    fixture.componentRef.setInput('userGender', options?.gender ?? null);
    fixture.componentRef.setInput('userRanking', options?.ranking ?? null);
    if (options?.filters) {
      fixture.componentRef.setInput('filters', options.filters);
    }
    const emit = jest.spyOn(fixture.componentInstance.filtersChange, 'emit');
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return { fixture, component: fixture.componentInstance, element, emit };
  }

  it('associates persistent translated labels with all native fields', async () => {
    const { element } = await mount({ filters: allFilters });
    const names = ['Event type', 'Category', 'Enrollment status'];
    const controls = element.querySelectorAll('[role="combobox"]');
    expect(controls).toHaveLength(3);
    controls.forEach((control, index) => {
      const id = control.getAttribute('aria-labelledby');
      expect(element.querySelector(`#${id}`)?.textContent?.trim()).toBe(names[index]);
      expect(element.querySelector(`label[for="${control.id}"]`)).not.toBeNull();
    });
    const handles = element.querySelectorAll('input[type="range"]');
    expect(handles).toHaveLength(2);
    handles.forEach((handle) => {
      expect(handle.getAttribute('aria-labelledby')).toBe('enrollment-level-label');
    });
    expect(element.querySelector('#enrollment-level-label')?.textContent).toContain('Level: 1 - 12');
    expect(element.querySelector('section')).toBeNull();
  });

  it('shows only supplied rankings in a named semantic summary and associates the checkbox', async () => {
    const partial = Object.assign(new RankingLastPlace(), { single: 4, mix: 5 });
    const { element, emit } = await mount({ ranking: partial, filters: allFilters });
    expect(element.querySelector('section')?.getAttribute('aria-labelledby')).toBe('enrollment-rankings-heading');
    expect(element.querySelector('h2')?.textContent).toContain('Your rankings');
    expect(Array.from(element.querySelectorAll('dt'), (item) => item.textContent?.trim())).toEqual(['Singles', 'Mixed']);
    expect(Array.from(element.querySelectorAll('dd'), (item) => item.textContent?.trim())).toEqual(['Level 4', 'Level 5']);
    expect(element.querySelectorAll('dd .p-tag-secondary')).toHaveLength(2);
    element.querySelector<HTMLLabelElement>('label[for="showOnlyMyLevel"]')?.click();
    expect(emit).toHaveBeenLastCalledWith({
      ...allFilters,
      level: Array.from({ length: 12 }, (_, i) => i + 1),
      showOnlyMyLevel: true,
    });
  });

  it('updates the native neutral ranking Tags without changing supplied filters', async () => {
    const { fixture, element, emit } = await mount({ ranking, filters: allFilters });
    expect(Array.from(element.querySelectorAll('dd .p-tag-secondary'), (item) => item.textContent?.trim())).toEqual([
      'Level 4',
      'Level 6',
      'Level 5',
    ]);
    expect(element.querySelector('section')?.querySelectorAll('p-card, button, [tabindex]')).toHaveLength(0);
    const partial = Object.assign(new RankingLastPlace(), { double: 12 });
    fixture.componentRef.setInput('userRanking', partial);
    fixture.detectChanges();
    expect(Array.from(element.querySelectorAll('dt'), (item) => item.textContent?.trim())).toEqual(['Doubles']);
    expect(element.querySelector('dd .p-tag-secondary')?.textContent?.trim()).toBe('Level 12');
    fixture.componentRef.setInput('userRanking', null);
    fixture.detectChanges();
    expect(element.querySelector('section')).toBeNull();
    expect(element.querySelector('#showOnlyMyLevel')).toBeNull();
    expect(emit).not.toHaveBeenCalled();
  });

  it('hides the summary for a ranking object without discipline values', async () => {
    const { element, emit } = await mount({ ranking: new RankingLastPlace(), filters: allFilters });
    expect(element.querySelector('section')).toBeNull();
    expect(element.querySelectorAll('dd .p-tag')).toHaveLength(0);
    expect(emit).not.toHaveBeenCalled();
  });

  it.each([
    ['M', ['MX', 'M']],
    ['F', ['MX', 'F']],
    [null, ['MX']],
  ] as const)('preserves %s gender defaults and ranking-derived inclusive levels', async (gender, eventType) => {
    const { component, emit } = await mount({ gender, ranking });
    expect(component.levelRangeControl.value).toEqual([4, 6]);
    expect(emit).toHaveBeenLastCalledWith({
      eventType,
      gameType: [],
      level: [4, 5, 6],
      enrollmentStatus: 'AVAILABLE',
      searchText: '',
      showOnlyMyLevel: true,
    });
  });

  it('keeps supplied filters and emits existing event/category/status payloads', async () => {
    const { component, emit } = await mount({
      filters: { ...allFilters, eventType: ['F'], level: [3, 5] },
    });
    expect(emit).not.toHaveBeenCalled();
    expect(component.eventTypeControl.value).toEqual(['F']);
    expect(component.levelRangeControl.value).toEqual([3, 5]);
    component.eventTypeControl.setValue(['M', 'MX']);
    component.gameTypeControl.setValue(['D']);
    component.enrollmentStatusControl.setValue('OPEN');
    expect(emit).toHaveBeenLastCalledWith({
      ...allFilters,
      eventType: ['M', 'MX'],
      gameType: ['D'],
      level: [3, 4, 5],
      enrollmentStatus: 'OPEN',
    });
  });

  it('applies keyboard changes from both native range handles to the parent filter', async () => {
    const { fixture, element, component, emit } = await mount({ filters: allFilters });
    const handles = element.querySelectorAll('input[type="range"]');
    handles[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(component.levelRangeControl.value).toEqual([2, 12]);
    expect(emit).toHaveBeenLastCalledWith({
      ...allFilters,
      level: Array.from({ length: 11 }, (_, i) => i + 2),
    });
    handles[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', code: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(component.levelRangeControl.value).toEqual([2, 11]);
    expect(emit).toHaveBeenLastCalledWith({
      ...allFilters,
      level: Array.from({ length: 10 }, (_, i) => i + 2),
    });
    expect(element.querySelector('#enrollment-level-label')?.textContent).toContain('Level: 2 - 11');
  });

  it('keeps pointer filtering deferred until release and supports native-input changes', async () => {
    const { fixture, component, emit } = await mount({ filters: allFilters });
    const slider = fixture.debugElement.query(By.directive(Slider)).componentInstance as Slider;
    component.levelRangeControl.setValue([3, 5]);
    slider.onChange.emit({ event: new Event('pointermove'), values: [3, 5] });
    expect(emit).not.toHaveBeenCalled();
    slider.onSlideEnd.emit({ originalEvent: new Event('pointerup'), values: [3, 5] });
    expect(emit).toHaveBeenLastCalledWith({ ...allFilters, level: [3, 4, 5] });
    emit.mockClear();
    component.levelRangeControl.setValue([4, 5]);
    slider.onChange.emit({ event: new Event('change'), values: [4, 5] });
    expect(emit).toHaveBeenLastCalledWith({ ...allFilters, level: [4, 5] });
  });

  it('preserves ranked reset defaults and hides Clear after reaching them', async () => {
    const { fixture, element, component, emit } = await mount({ gender: 'F', ranking, filters: allFilters });
    element.querySelector<HTMLButtonElement>('p-button button')?.click();
    fixture.detectChanges();
    expect(emit).toHaveBeenLastCalledWith({
      eventType: ['MX', 'F'],
      gameType: [],
      level: [4, 5, 6],
      enrollmentStatus: 'AVAILABLE',
      searchText: '',
      showOnlyMyLevel: false,
    });
    expect(component.hasActiveFilters()).toBe(false);
    expect(element.querySelector('p-button')).toBeNull();
  });

  it('keeps disabled native filters explicit and non-interactive', async () => {
    const { fixture, element, component, emit } = await mount({ ranking, filters: allFilters });
    component.eventTypeControl.disable({ emitEvent: false });
    component.gameTypeControl.disable({ emitEvent: false });
    component.levelRangeControl.disable({ emitEvent: false });
    component.enrollmentStatusControl.disable({ emitEvent: false });
    component.showOnlyMyLevelControl.disable({ emitEvent: false });
    fixture.detectChanges();
    expect(element.querySelectorAll('[role="combobox"][aria-disabled="true"]')).toHaveLength(3);
    expect(
      Array.from(element.querySelectorAll<HTMLInputElement>('input[type="range"], input[type="checkbox"]')).every((input) => input.disabled),
    ).toBe(true);
    expect(emit).not.toHaveBeenCalled();
  });
});
