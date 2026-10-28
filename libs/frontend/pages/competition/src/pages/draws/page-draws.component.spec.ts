import { ChangeDetectorRef, Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SyncButtonComponent } from '@app/frontend-components/sync';
import { AuthService } from '@app/frontend-modules-auth/service';
import { SeoService } from '@app/frontend-modules-seo/service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { ButtonDirective } from 'primeng/button';
import { of } from 'rxjs';
import { PageDrawsComponent } from './page-draws.component';

const createData = () => ({
  competitionEvent: {
    id: 'competition',
    name: 'Test competition',
    slug: 'test-competition',
    visualCode: 'competition-code',
  },
  competitionSubEvent: {
    id: 'sub-event',
    name: 'First division',
    maxLevel: 3,
    eventType: 'M',
  },
  competitionDraw: {
    id: 'draw-id-12345',
    name: 'First division - A',
    type: 'POULE',
    size: 9,
    visualCode: 'draw-code',
    competitionEncounters: [],
  },
  entries: [],
});

@Component({ selector: 'app-sync-button', template: '' })
class SyncStubComponent {
  readonly config = input<unknown>();
}

describe('Competition draw hero identity and actions', () => {
  let harness: RouterTestingHarness;
  let component: PageDrawsComponent;
  let element: HTMLElement;
  let data: ReturnType<typeof createData>;

  beforeEach(async () => {
    data = createData();
    await TestBed.configureTestingModule({
      imports: [PageDrawsComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([
          {
            path: 'competition/:competitionId/sub-events/:subEventId/draws/:drawId',
            component: PageDrawsComponent,
          },
        ]),
        { provide: Apollo, useValue: { query: jest.fn(() => of({ data })) } },
        { provide: AuthService, useValue: { hasAnyPermission: () => false } },
        { provide: SeoService, useValue: { update: jest.fn() } },
      ],
    })
      .overrideComponent(PageDrawsComponent, {
        remove: { imports: [SyncButtonComponent] },
        add: { imports: [SyncStubComponent] },
      })
      .compileComponents();
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('en', {
      all: { competition: { draw: 'Draw', size: 'Size', maxLevel: 'Max level' } },
    });
    translations.use('en');
    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/competition/test-competition/sub-events/sub-event/draws/draw-id-12345', PageDrawsComponent);
    await harness.fixture.whenStable();
    harness.detectChanges();
    const routeElement = harness.routeNativeElement;
    if (!routeElement) throw new Error('Competition draw route did not mount');
    element = routeElement;
  });

  function refresh(): void {
    harness.fixture.debugElement.query(By.directive(PageDrawsComponent)).injector.get(ChangeDetectorRef).markForCheck();
    harness.detectChanges();
  }

  function required<T>(value: T | null | undefined): T {
    if (value == null) throw new Error('Expected mounted draw data or element');
    return value;
  }

  it('preserves the title, sub-event, avatar and ordered optional metadata', () => {
    expect(element.querySelector('app-hero-title')?.textContent).toBe('First division - A');
    expect(element.querySelector('[identity] > span')?.textContent).toBe('First division');
    expect(element.querySelector('app-hero-avatar')?.textContent).toBe('P');
    const tags = [...element.querySelectorAll('[identity] p-tag')];
    expect(tags.map((tag) => tag.textContent?.trim())).toEqual(['POULE', 'Size 9', 'Max level 3', 'M']);
    expect(tags.every((tag) => tag.classList.contains('p-tag-secondary'))).toBe(true);
    expect(element.querySelector('[identity] .t-eyebrow')).toBeNull();
  });

  it.each(['type', 'size'] as const)('omits absent draw metadata: %s', (key) => {
    const draw = { ...required(component.draw()), [key]: key === 'size' ? 0 : '' };
    component.draw = signal(draw);
    refresh();
    expect(element.querySelectorAll('[identity] p-tag')).toHaveLength(3);
  });

  it.each(['maxLevel', 'eventType'] as const)('omits absent sub-event metadata: %s', (key) => {
    component.subEvent = signal({ ...required(component.subEvent()), [key]: key === 'maxLevel' ? 0 : '' });
    refresh();
    expect(element.querySelectorAll('[identity] p-tag')).toHaveLength(3);
  });

  it('uses the existing localized size and level labels', () => {
    TestBed.inject(TranslateService).setTranslation('nl_BE', {
      all: { competition: { draw: 'Poule', size: 'Grootte', maxLevel: 'Max niveau' } },
    });
    TestBed.inject(TranslateService).use('nl_BE');
    refresh();
    expect(element.querySelector('[identity]')?.textContent).toContain('Grootte 9');
    expect(element.querySelector('[identity]')?.textContent).toContain('Max niveau 3');
  });

  it('uses a named native secondary text Button with the same safe external destination', () => {
    const link = element.querySelector<HTMLAnchorElement>('[actions] a');
    expect(link?.getAttribute('href')).toBe('https://www.toernooi.nl/sport/league/draw?id=competition-code&draw=draw-code');
    expect(link?.target).toBe('_blank');
    expect(link?.rel).toBe('noopener noreferrer');
    expect(link?.getAttribute('aria-label')).toBe('First division - A (toernooi.nl)');
    expect(link?.querySelector('i')?.getAttribute('aria-hidden')).toBe('true');
    const button = harness.fixture.debugElement.query(By.css('[actions] a')).injector.get(ButtonDirective);
    expect(button.severity()).toBe('secondary');
    expect(button.variant()).toBe('text');
    expect(button.size()).toBe('small');
    expect(button.dt()).toBeUndefined();
    expect(button.pt()).toBeUndefined();
    expect(link?.classList.contains('no-underline')).toBe(true);
    expect(link?.classList.contains('focus-visible:ring-primary')).toBe(true);
  });

  it.each(['competition', 'draw'] as const)('hides the external link without the %s visual code', (source) => {
    if (source === 'competition') {
      component.competition = signal({ ...required(component.competition()), visualCode: '' });
    } else {
      component.draw = signal({ ...required(component.draw()), visualCode: '' });
    }
    refresh();
    expect(element.querySelector('[actions] a')).toBeNull();
  });

  it('preserves the localized fallback heading and matches the external accessible name', () => {
    component.draw = signal({ ...required(component.draw()), name: '' });
    refresh();
    expect(element.querySelector('app-hero-title')?.textContent).toBe('Draw draw-id-');
    expect(element.querySelector('[actions] a')?.getAttribute('aria-label')).toBe('Draw draw-id- (toernooi.nl)');
  });

  it('preserves action order and sync configuration', () => {
    expect([...required(element.querySelector('[actions]')).children].map((child) => child.tagName)).toEqual(['A', 'APP-SYNC-BUTTON']);
    const sync = harness.fixture.debugElement.query(By.directive(SyncStubComponent)).componentInstance as SyncStubComponent;
    expect(sync.config()).toEqual({
      level: 'draw',
      drawId: 'draw-id-12345',
      eventName: 'Test competition',
      subEventName: 'First division',
      drawName: 'First division - A',
    });
  });
});
