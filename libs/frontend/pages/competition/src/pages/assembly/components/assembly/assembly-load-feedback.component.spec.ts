import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Message } from 'primeng/message';
import { of, throwError } from 'rxjs';
import { AssemblyGeneratorService } from '../../assembly-generator.service';
import { AssemblyService } from '../../page-assembly.service';
import { AssemblyComponent } from './assembly.component';

const locales = ['en', 'nl_BE', 'fr_BE'];
const copy = 'all.competition.team-assembly.';

describe('Assembly load-error and unselected feedback', () => {
  let fixture: ComponentFixture<AssemblyComponent>;
  let service: AssemblyService;
  let translations: TranslateService;
  let element: HTMLElement;
  const query = jest.fn();

  beforeEach(async () => {
    query.mockReset().mockImplementation(() => {
      throw new Error('Unexpected feedback query');
    });
    await TestBed.configureTestingModule({
      imports: [AssemblyComponent, TranslateModule.forRoot()],
      providers: [
        AssemblyService,
        AssemblyGeneratorService,
        { provide: AuthService, useValue: { hasAnyPermission: () => false } },
        { provide: RankingSystemService, useValue: { systemId: () => 'system-id' } },
        { provide: Apollo, useValue: { query } },
      ],
    }).compileComponents();
    jest.spyOn(TestBed.inject(AssemblyGeneratorService), 'loadStats').mockResolvedValue();
    service = TestBed.inject(AssemblyService);
    jest.spyOn(service, 'validate').mockResolvedValue();
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

  function message(): Message {
    return fixture.debugElement.query(By.directive(Message)).injector.get(Message);
  }

  it.each(locales)('shows polite native initial guidance with real %s copy', async (locale) => {
    translations.use(locale);
    await settle();
    const status = element.querySelector('p-message');
    expect(status?.textContent?.trim()).toBe(translations.instant(`${copy}select-team`));
    expect(status?.textContent).not.toContain('all.');
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.getAttribute('aria-live')).toBe('polite');
    expect(status?.getAttribute('aria-atomic')).toBe('true');
    expect(message().severity()).toBe('secondary');
    expect(message().closable()).toBe(false);
    expect(message().life()).toBeUndefined();
    expect(element.querySelector('button')).toBeNull();
    expect(query).not.toHaveBeenCalled();
  });

  it.each(locales)('shows persistent native errors and a localized retry name in %s', async (locale) => {
    translations.use(locale);
    service.error.set('<script>Private server detail</script>');
    await settle();
    const alert = element.querySelector('p-message');
    expect(alert?.textContent?.trim()).toBe(translations.instant(`${copy}load-error`));
    expect(alert?.getAttribute('role')).toBe('alert');
    expect(alert?.getAttribute('aria-live')).toBe('assertive');
    expect(alert?.getAttribute('aria-atomic')).toBe('true');
    expect(message().severity()).toBe('error');
    expect(message().closable()).toBe(false);
    expect(message().life()).toBeUndefined();
    expect(message().dt()).toBeUndefined();
    expect(element.textContent).not.toContain('Private server detail');
    expect(element.querySelector('script')).toBeNull();
    expect(element.querySelector('button')?.textContent?.trim()).toBe(translations.instant(`${copy}retry-load`));
  });

  it.each([null, 'encounter-id'])('retries the current form encounter %s using the existing load method', async (encounter) => {
    service.formGroup.patchValue({ team: 'team-id', encounter }, { emitEvent: false });
    service.error.set('Test failure');
    const load = jest.spyOn(service, 'loadData').mockResolvedValue();
    await settle();
    const form = service.formGroup.getRawValue();
    const button = element.querySelector('button');
    expect(button?.type).toBe('button');
    expect(button?.disabled).toBe(false);
    button?.click();
    await settle();
    expect(load).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith(encounter ?? undefined);
    expect(service.formGroup.getRawValue()).toEqual(form);
    expect(query).not.toHaveBeenCalled();
  });

  it('disables retry without a current team, including an empty stored error', async () => {
    service.error.set('');
    const load = jest.spyOn(service, 'loadData').mockResolvedValue();
    await settle();
    expect(message().severity()).toBe('error');
    const button = element.querySelector('button');
    expect(button?.disabled).toBe(true);
    button?.click();
    expect(load).not.toHaveBeenCalled();
  });

  it.each([true, false])('preserves loading and loaded priority and restores feedback on mobile %s', async (mobile) => {
    fixture.componentInstance.isMobile.set(mobile);
    service.error.set('Previous failure');
    service.loaded.set(true);
    service.loading.set(true);
    await settle();
    expect(element.querySelector('[role="progressbar"]')).toBeTruthy();
    expect(element.querySelector('p-message')).toBeNull();
    service.loading.set(false);
    await settle();
    expect(element.querySelector('#assembly-base-title')).toBeTruthy();
    expect(element.querySelector(mobile ? '#assembly-mobile-single1' : '#playerList')).toBeTruthy();
    expect(element.textContent).not.toContain(translations.instant(`${copy}load-error`));
    service.loaded.set(false);
    await settle();
    expect(message().severity()).toBe('error');
    expect(element.querySelector('p-card')).toBeNull();
    service.error.set(null);
    await settle();
    expect(message().severity()).toBe('secondary');
  });

  it('surfaces a real load failure and retry failure without exposing server detail or changing selection', async () => {
    service.formGroup.patchValue({ team: 'team-id' }, { emitEvent: false });
    query.mockReturnValue(throwError(() => new Error('Safe test query failure')));
    await service.loadData();
    await settle();
    expect(service.error()).toBe('Safe test query failure');
    expect(service.loaded()).toBe(false);
    expect(service.loading()).toBe(false);
    expect(message().severity()).toBe('error');
    const load = jest.spyOn(service, 'loadData');
    element.querySelector('button')?.focus();
    element.querySelector('button')?.click();
    await load.mock.results[0].value;
    await settle();
    expect(query).toHaveBeenCalledTimes(2);
    expect(service.formGroup.get('team')?.value).toBe('team-id');
    expect(message().severity()).toBe('error');
    expect(element.querySelector('button')?.disabled).toBe(false);
    expect(document.activeElement).toBe(element.querySelector('button'));
  });

  it('uses real retry loading gates and restores the loaded branch after a successful read', async () => {
    service.formGroup.patchValue({ team: 'team-id' }, { emitEvent: false });
    service.error.set('Previous failure');
    query.mockReturnValue(of({ data: { team: { id: 'team-id', type: 'M', teamPlayerMemberships: [], entries: [] } } }));
    const load = jest.spyOn(service, 'loadData');
    await settle();
    element.querySelector('button')?.focus();
    element.querySelector('button')?.click();
    fixture.detectChanges();
    expect(element.querySelector('[role="progressbar"]')).toBeTruthy();
    expect(element.querySelector('button')).toBeNull();
    await load.mock.results[0].value;
    await settle();
    expect(service.error()).toBeNull();
    expect(service.loading()).toBe(false);
    expect(service.loaded()).toBe(true);
    expect(element.querySelector('#assembly-base-title')).toBeTruthy();
    expect(element.textContent).not.toContain(translations.instant(`${copy}load-error`));
    expect(document.activeElement).toBe(element.querySelector('section'));
    expect(element.querySelector('section')?.getAttribute('tabindex')).toBe('-1');
    expect(element.querySelector('section')?.getAttribute('aria-label')).toBe(translations.instant(`${copy}title`));
  });

  it('returns to initial guidance when a real load has no selected team', async () => {
    service.error.set('Old failure');
    await service.loadData();
    await settle();
    expect(service.error()).toBeNull();
    expect(service.loading()).toBe(false);
    expect(service.loaded()).toBe(false);
    expect(message().severity()).toBe('secondary');
    expect(query).not.toHaveBeenCalled();
  });
});
