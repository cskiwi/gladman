import { Component, input, output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { SeoService } from '@app/frontend-modules-seo/service';
import { TournamentEvent } from '@app/models';
import { TournamentPhase } from '@app/models-enum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { of, Subject, throwError } from 'rxjs';
import { PageAdminComponent } from './page-admin.component';
import { SettingsTabComponent } from './tabs/settings/settings-tab.component';
import { EnrollmentsTabComponent } from './tabs/enrollments/enrollments-tab.component';
import { DrawsTabComponent } from './tabs/draws/draws-tab.component';
import { ScheduleTabComponent } from './tabs/schedule/schedule-tab.component';
import { CheckinTabComponent } from './tabs/checkin/checkin-tab.component';

@Component({ selector: 'app-settings-tab', template: '' })
class SettingsStub {
  readonly tournament = input.required<TournamentEvent>();
  readonly tournamentUpdated = output<void>();
}

@Component({ selector: 'app-enrollments-tab', template: '' })
class EnrollmentsStub {
  readonly tournament = input.required<TournamentEvent>();
}

@Component({ selector: 'app-draws-tab', template: '' })
class DrawsStub {
  readonly tournament = input.required<TournamentEvent>();
}

@Component({ selector: 'app-schedule-tab', template: '' })
class ScheduleStub {
  readonly tournament = input.required<TournamentEvent>();
}

@Component({ selector: 'app-checkin-tab', template: '' })
class CheckinStub {
  readonly tournament = input.required<TournamentEvent>();
}

describe('Tournament administration chrome', () => {
  const originalResizeObserver = globalThis.ResizeObserver;
  let query: jest.Mock;
  let mutate: jest.Mock;
  let hasAnyPermission: jest.Mock;
  let seoUpdate: jest.Mock;
  const event = (phase = TournamentPhase.DRAFT) => ({
    id: 'event',
    name: 'Safe tournament',
    clubId: 'safe-club',
    phase,
    tournamentSubEvents: [],
  });

  beforeAll(() => {
    globalThis.ResizeObserver = class {
      observe = jest.fn();
      unobserve = jest.fn();
      disconnect = jest.fn();
    };
  });

  afterAll(() => {
    globalThis.ResizeObserver = originalResizeObserver;
  });

  beforeEach(async () => {
    query = jest.fn(() => of({ data: { tournamentEvent: event() } }));
    mutate = jest.fn();
    hasAnyPermission = jest.fn(() => false);
    seoUpdate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [PageAdminComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: 'tournament/:tournamentId/admin', component: PageAdminComponent }]),
        { provide: Apollo, useValue: { query, mutate } },
        { provide: AuthService, useValue: { hasAnyPermission } },
        { provide: SeoService, useValue: { update: seoUpdate } },
      ],
    })
      .overrideComponent(PageAdminComponent, {
        remove: { imports: [SettingsTabComponent, EnrollmentsTabComponent, DrawsTabComponent, ScheduleTabComponent, CheckinTabComponent] },
        add: { imports: [SettingsStub, EnrollmentsStub, DrawsStub, ScheduleStub, CheckinStub] },
      })
      .compileComponents();
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('en', {
      all: {
        button: { back: 'Back' },
        tournament: {
          title: 'Tournament',
          edit: { messages: { loading: 'Loading tournament' } },
          admin: {
            title: 'Tournament admin',
            noPermission: 'You cannot manage this tournament',
            tabs: { settings: 'Settings', enrollments: 'Enrollments', draws: 'Draws', schedule: 'Schedule', checkin: 'Check-in' },
          },
        },
      },
    });
    translations.use('en');
  });

  async function mount(search = '', settle = true) {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl(`/tournament/event/admin${search}`, PageAdminComponent);
    if (settle) await harness.fixture.whenStable();
    harness.detectChanges();
    const element = harness.routeNativeElement;
    if (!element) throw new Error('Administration route did not mount');
    return { harness, component, element };
  }

  afterEach(() => {
    expect(mutate).not.toHaveBeenCalled();
  });

  it('renders localized compact identity, named Back and native permission feedback without exposing tabs', async () => {
    const { element } = await mount();
    expect(element.querySelectorAll('h1')).toHaveLength(1);
    expect(element.querySelector('h1')?.textContent).toContain('Tournament admin');
    expect(element.querySelector('header p')?.textContent).toContain('Safe tournament');
    expect(element.querySelector('.t-eyebrow')).toBeNull();
    expect(element.querySelector('header button[pButton]')?.textContent?.trim()).toBe('Back');
    expect(element.querySelector('header button i')?.getAttribute('aria-hidden')).toBe('true');
    expect(element.querySelector('p-message[role="alert"]')?.textContent).toContain('You cannot manage this tournament');
    expect(element.querySelector('.p-message-warn')).not.toBeNull();
    expect(element.querySelector('p-tabs')).toBeNull();
    expect(element.querySelector('app-breadcrumb a[href="/tournament/event"]')?.textContent).toContain('Safe tournament');
    expect(query).toHaveBeenCalledWith(expect.objectContaining({ variables: { id: 'event' }, fetchPolicy: 'network-only' }));
    expect(hasAnyPermission).toHaveBeenCalledWith(['edit-any:tournament', 'edit-any:club', 'safe-club_edit:club', 'safe-club_edit:tournament']);
    expect(seoUpdate).toHaveBeenCalledWith(expect.objectContaining({ title: 'Admin - Safe tournament' }));
  });

  it('preserves Back destination and the native button type', async () => {
    const { element } = await mount();
    const navigate = jest.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const button = element.querySelector<HTMLButtonElement>('header button');
    expect(button?.type).toBe('button');
    button?.click();
    expect(navigate).toHaveBeenCalledWith(['/tournament', 'event']);
  });

  it('announces pending loading with three native skeletons and no exposed tabs', async () => {
    const response = new Subject<{ data: { tournamentEvent: ReturnType<typeof event> } }>();
    query.mockReturnValue(response);
    const { harness, element } = await mount('', false);
    expect(element.querySelector('[aria-busy="true"] [role="status"]')?.textContent).toBe('Loading tournament');
    expect(element.querySelectorAll('p-skeleton')).toHaveLength(3);
    expect(element.querySelector('p-panel p-skeleton')).not.toBeNull();
    expect(element.querySelector('p-skeleton[width]')).toBeNull();
    expect(element.querySelector('p-tabs')).toBeNull();
    response.next({ data: { tournamentEvent: event() } });
    response.complete();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('[aria-busy]')).toBeNull();
    expect(element.querySelector('header p')?.textContent).toContain('Safe tournament');
  });

  it('renders native read-error feedback without exposing any tab child', async () => {
    query.mockReturnValue(throwError(() => new Error('Safe read failure')));
    const { element } = await mount();
    expect(element.querySelector('.p-message-error')?.textContent).toContain('An error occurred');
    expect(element.querySelector('p-message')?.getAttribute('role')).toBe('alert');
    expect(element.querySelector('p-tabs')).toBeNull();
  });

  it.each([
    [TournamentPhase.DRAFT, [false, true, true, true, true]],
    [TournamentPhase.ENROLLMENT_OPEN, [false, false, true, true, true]],
    [TournamentPhase.ENROLLMENT_CLOSED, [false, false, false, true, true]],
    [TournamentPhase.DRAWS_MADE, [false, false, false, false, true]],
    [TournamentPhase.SCHEDULED, [false, false, false, false, false]],
    [TournamentPhase.IN_PROGRESS, [false, false, false, false, false]],
    [TournamentPhase.COMPLETED, [false, false, false, false, false]],
  ])('preserves native tab phase gates for %s', async (phase, disabled) => {
    hasAnyPermission.mockReturnValue(true);
    query.mockReturnValue(of({ data: { tournamentEvent: event(phase) } }));
    const { element } = await mount();
    expect(element.querySelector('p-panel .p-panel-content p-tabs[scrollable]')).not.toBeNull();
    const tabs = Array.from(element.querySelectorAll<HTMLElement>('[role="tab"]'));
    expect(tabs.map((tab) => tab.getAttribute('aria-disabled') === 'true')).toEqual(disabled);
    expect(tabs.map((tab) => tab.textContent?.trim())).toEqual(['Settings', 'Enrollments', 'Draws', 'Schedule', 'Check-in']);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(element.querySelector('app-settings-tab')).not.toBeNull();
    expect(element.querySelector('p-message')).toBeNull();
    expect(Array.from(element.querySelectorAll('p-tab i')).every((icon) => icon.getAttribute('aria-hidden') === 'true')).toBe(true);
  });

  it.each(['settings', 'enrollments', 'draws', 'schedule', 'checkin'])('preserves the %s query mapping and child input', async (tab) => {
    hasAnyPermission.mockReturnValue(true);
    query.mockReturnValue(of({ data: { tournamentEvent: event(TournamentPhase.COMPLETED) } }));
    const { harness, component, element } = await mount(`?tab=${tab}&keep=safe`);
    expect(component.activeTabIndex()).toBe(component.tabIndexMap[tab]);
    expect(element.querySelector('[role="tab"][aria-selected="true"]')?.textContent?.trim()).toBe(
      { settings: 'Settings', enrollments: 'Enrollments', draws: 'Draws', schedule: 'Schedule', checkin: 'Check-in' }[tab],
    );
    const children = harness.fixture.debugElement.queryAll(
      (node) =>
        node.componentInstance instanceof SettingsStub ||
        node.componentInstance instanceof EnrollmentsStub ||
        node.componentInstance instanceof DrawsStub ||
        node.componentInstance instanceof ScheduleStub ||
        node.componentInstance instanceof CheckinStub,
    );
    expect(children.length).toBeGreaterThan(0);
    children.forEach((child) => expect(child.componentInstance.tournament()).toEqual(event(TournamentPhase.COMPLETED)));
  });

  it('preserves merged query navigation and Settings refetch without mutation', async () => {
    hasAnyPermission.mockReturnValue(true);
    query.mockReturnValue(of({ data: { tournamentEvent: event(TournamentPhase.COMPLETED) } }));
    const { harness, element } = await mount('?tab=settings&keep=safe');
    element.querySelectorAll<HTMLElement>('[role="tab"]')[1].click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/tournament/event/admin?tab=enrollments&keep=safe');
    const settings = harness.fixture.debugElement.query((node) => node.componentInstance instanceof SettingsStub)?.componentInstance as SettingsStub;
    expect(settings).toBeDefined();
    const reads = query.mock.calls.length;
    settings.tournamentUpdated.emit();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(query.mock.calls.length).toBeGreaterThan(reads);
  });
});
