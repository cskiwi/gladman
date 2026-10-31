import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ProgressBar } from 'primeng/progressbar';
import { AssemblyGeneratorService } from '../../assembly-generator.service';
import { AssemblyService } from '../../page-assembly.service';
import { AssemblyComponent } from './assembly.component';

const locales = ['en', 'nl_BE', 'fr_BE'];
const statusId = 'assembly-loading-status';

describe('Assembly loading feedback', () => {
  let fixture: ComponentFixture<AssemblyComponent>;
  let service: AssemblyService;
  let translations: TranslateService;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssemblyComponent, TranslateModule.forRoot()],
      providers: [
        AssemblyService,
        AssemblyGeneratorService,
        { provide: AuthService, useValue: { hasAnyPermission: () => false } },
        { provide: RankingSystemService, useValue: {} },
        {
          provide: Apollo,
          useValue: {
            query: jest.fn(() => {
              throw new Error('Unexpected loading feedback query');
            }),
          },
        },
      ],
    }).compileComponents();
    jest.spyOn(TestBed.inject(AssemblyGeneratorService), 'loadStats').mockResolvedValue();
    service = TestBed.inject(AssemblyService);
    jest.spyOn(service, 'validate').mockResolvedValue();
    service.loading.set(true);
    service.type.set('M');
    translations = TestBed.inject(TranslateService);
    for (const locale of locales) {
      const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
      translations.setTranslation(locale, { all: JSON.parse(readFileSync(assetPath, 'utf8')) });
    }
    translations.use('en');
    fixture = TestBed.createComponent(AssemblyComponent);
    fixture.componentRef.setInput('formGroup', service.formGroup);
    element = fixture.nativeElement;
    await settle();
  });

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it.each(locales)('names the native progress bar with readable real %s loading copy', async (locale) => {
    translations.use(locale);
    await settle();
    const status = element.querySelector(`#${statusId}`);
    const bar = element.querySelector('[role="progressbar"]');
    expect(status?.textContent?.trim()).toBe(translations.instant('all.loading.players'));
    expect(status?.textContent).not.toContain('all.');
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.getAttribute('aria-atomic')).toBe('true');
    expect(bar?.getAttribute('aria-labelledby')).toBe(statusId);
    expect(element.querySelectorAll(`#${statusId}`)).toHaveLength(1);
    expect(element.querySelectorAll('[role="progressbar"]')).toHaveLength(1);
  });

  it('keeps native indeterminate styling without fake completion or scoped overrides', () => {
    const bar = fixture.debugElement.query(By.directive(ProgressBar)).injector.get(ProgressBar);
    expect(bar.mode()).toBe('indeterminate');
    expect(bar.value()).toBeUndefined();
    expect(bar.dt()).toBeUndefined();
    expect(bar.color()).toBeUndefined();
    expect(element.querySelector('[role="progressbar"]')?.hasAttribute('aria-valuenow')).toBe(false);
    expect(element.querySelector('[role="progressbar"]')?.hasAttribute('tabindex')).toBe(false);
    expect(element.querySelector(`#${statusId}`)?.hasAttribute('tabindex')).toBe(false);
    expect(element.querySelector('[role="progressbar"]')?.classList.contains('p-progressbar-indeterminate')).toBe(true);
  });

  it.each([true, false])('preserves loading priority and loaded transitions when mobile is %s', async (mobile) => {
    fixture.componentInstance.isMobile.set(mobile);
    service.loaded.set(true);
    await settle();
    expect(element.querySelector(`#${statusId}`)).toBeTruthy();
    expect(element.querySelector('p-card')).toBeNull();
    expect(element.querySelector('p-select')).toBeNull();
    service.loading.set(false);
    await settle();
    expect(element.querySelector(`#${statusId}`)).toBeNull();
    expect(element.querySelector('[role="progressbar"]')).toBeNull();
    expect(element.querySelector('#assembly-base-title')).toBeTruthy();
    expect(element.querySelector(mobile ? '#assembly-mobile-single1' : '#playerList')).toBeTruthy();
    const form = service.formGroup.getRawValue();
    service.loading.set(true);
    await settle();
    expect(element.querySelectorAll(`#${statusId}`)).toHaveLength(1);
    expect(element.querySelector('p-card')).toBeNull();
    expect(service.formGroup.getRawValue()).toEqual(form);
  });

  it('removes loading feedback without inventing initial-unloaded or error success states', async () => {
    service.loading.set(false);
    service.loaded.set(false);
    await settle();
    expect(element.querySelector(`#${statusId}`)).toBeNull();
    expect(element.querySelector('p-card')).toBeNull();
    service.error.set('Test load failure');
    await settle();
    expect(element.querySelector(`#${statusId}`)).toBeNull();
    expect(element.querySelector('[role="progressbar"]')).toBeNull();
    expect(service.error()).toBe('Test load failure');
    expect(service.loaded()).toBe(false);
    expect(element.textContent).not.toContain('Test load failure');
  });

  it('retains the native loading branch during a stored error without changing service state', async () => {
    service.error.set('Test previous failure');
    await settle();
    expect(element.querySelector(`#${statusId}`)).toBeTruthy();
    expect(element.querySelector('[role="progressbar"]')).toBeTruthy();
    expect(service.error()).toBe('Test previous failure');
    expect(service.loaded()).toBe(false);
  });
});
