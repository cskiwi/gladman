import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TournamentSubEvent } from '@app/models';
import { GameType } from '@app/models-enum';
import { TranslateModule } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { of } from 'rxjs';
import { Slider } from 'primeng/slider';
import { PageGeneralEnrollmentComponent } from './page-general-enrollment.component';
import { PageGeneralEnrollmentService } from './page-general-enrollment.service';
import { EnrollmentFiltersComponent } from './components/enrollment-filters/enrollment-filters.component';
import { SubEventSelectionGridComponent } from './components/sub-event-selection-grid/sub-event-selection-grid.component';

describe('Enrollment level filtering in the mounted list', () => {
  const events = [
    { id: 'low', name: 'Safe low', minLevel: 1, maxLevel: 2 },
    { id: 'middle', name: 'Safe middle', minLevel: 5, maxLevel: 6 },
    { id: 'high', name: 'Safe high', minLevel: 11, maxLevel: 12 },
    { id: 'unknown', name: 'MS 1-2', minLevel: null, maxLevel: null },
    { id: 'lower-only', name: 'Safe lower bound only', minLevel: 3 },
    { id: 'upper-only', name: 'Safe upper bound only', maxLevel: 9 },
  ].map((event) =>
    Object.assign(new TournamentSubEvent(), {
      gameType: GameType.S,
      eventType: 'M',
      ...event,
    }),
  );
  const unknownIds = ['lower-only', 'unknown', 'upper-only'];
  const mutate = jest.fn();

  beforeEach(async () => {
    mutate.mockClear();
    await TestBed.configureTestingModule({
      imports: [PageGeneralEnrollmentComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: 'tournament/:tournamentId/enroll', component: PageGeneralEnrollmentComponent }]),
        {
          provide: Apollo,
          useValue: {
            query: jest.fn(() =>
              of({
                data: {
                  me: null,
                  enrollmentSession: null,
                  tournamentEnrollments: [],
                  tournamentSubEvents: events,
                },
              }),
            ),
            mutate,
          },
        },
        { provide: SsrCookieService, useValue: { get: jest.fn(() => '') } },
      ],
    }).compileComponents();
  });

  async function mount() {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tournament/safe-event/enroll', PageGeneralEnrollmentComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    const filters = harness.fixture.debugElement.query(By.directive(EnrollmentFiltersComponent)).componentInstance as EnrollmentFiltersComponent;
    const gridElement = harness.fixture.debugElement.query(By.directive(SubEventSelectionGridComponent));
    const grid = gridElement.componentInstance as SubEventSelectionGridComponent;
    const element = harness.routeNativeElement;
    if (!element) throw new Error('Enrollment route did not mount');
    return { harness, filters, grid, gridElement, element, service: TestBed.inject(PageGeneralEnrollmentService) };
  }

  it('updates rendered events, not just thumb values, when both range handles change with the keyboard', async () => {
    const { harness, element, grid, gridElement, service } = await mount();
    expect(grid.subEvents()).toHaveLength(6);
    const handles = element.querySelectorAll('app-enrollment-filters input[type="range"]');
    Array.from({ length: 4 }).forEach(() =>
      handles[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', code: 'ArrowRight', bubbles: true })),
    );
    Array.from({ length: 6 }).forEach(() =>
      handles[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', code: 'ArrowLeft', bubbles: true })),
    );
    harness.detectChanges();
    expect(service.filters().level).toEqual([5, 6]);
    expect(
      grid
        .subEvents()
        .map((event) => event.id)
        .sort(),
    ).toEqual([...unknownIds, 'middle'].sort());
    const text = (gridElement.nativeElement as HTMLElement).textContent;
    expect(text).toContain('Safe middle');
    expect(text).not.toMatch(/\bSafe low\b/);
    expect(text).not.toContain('Safe high');
    expect(text).toContain('MS 1-2');
    expect(element.querySelector('#available-events-heading')?.textContent).toContain('(4)');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('applies pointer range changes to the rendered list only on release and keeps unknown bounds visible', async () => {
    const { harness, filters, grid, service } = await mount();
    const slider = harness.fixture.debugElement.query(By.directive(Slider)).componentInstance as Slider;
    filters.levelRangeControl.setValue([11, 12]);
    slider.onChange.emit({ event: new Event('pointermove'), values: [11, 12] });
    harness.detectChanges();
    expect(service.filters().level).toEqual([]);
    expect(grid.subEvents()).toHaveLength(6);
    slider.onSlideEnd.emit({ originalEvent: new Event('pointerup'), values: [11, 12] });
    harness.detectChanges();
    expect(
      grid
        .subEvents()
        .map((event) => event.id)
        .sort(),
    ).toEqual([...unknownIds, 'high'].sort());
    expect(mutate).not.toHaveBeenCalled();
  });

  it('keeps known inclusive endpoint matches and treats missing/null bounds as unknown without parsing names', async () => {
    const { harness, grid, service } = await mount();
    service.updateFilters({ ...service.filters(), level: [2] });
    harness.detectChanges();
    expect(
      grid
        .subEvents()
        .map((event) => event.id)
        .sort(),
    ).toEqual([...unknownIds, 'low'].sort());
    service.updateFilters({ ...service.filters(), level: [7] });
    harness.detectChanges();
    expect(
      grid
        .subEvents()
        .map((event) => event.id)
        .sort(),
    ).toEqual(unknownIds);
    expect(mutate).not.toHaveBeenCalled();
  });
});
