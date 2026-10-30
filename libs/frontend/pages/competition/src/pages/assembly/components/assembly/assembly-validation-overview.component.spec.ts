import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Card } from 'primeng/card';
import { Message } from 'primeng/message';
import { AssemblyGeneratorService } from '../../assembly-generator.service';
import { AssemblyService, ValidationMessage } from '../../page-assembly.service';
import { AssemblyComponent } from './assembly.component';

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: { v1: { teamFormation: { errors: Record<string, string> } } } = JSON.parse(readFileSync(assetPath, 'utf8'));
  return { locale, asset };
});

@Component({
  imports: [AssemblyComponent, NgTemplateOutlet],
  template: `
    <app-assembly [formGroup]="service.formGroup" (validationOverview)="overview = $event" />
    <section data-testid="dialog-content">
      <ng-container *ngTemplateOutlet="overview?.template ?? null" />
    </section>
  `,
})
class ValidationOutletHost {
  readonly service = TestBed.inject(AssemblyService);
  readonly assembly = viewChild.required(AssemblyComponent);
  overview?: { valid: boolean; template: TemplateRef<HTMLElement> };
}

describe('Assembly validation overview', () => {
  let fixture: ComponentFixture<ValidationOutletHost>;
  let service: AssemblyService;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationOutletHost, TranslateModule.forRoot()],
      providers: [
        AssemblyService,
        AssemblyGeneratorService,
        { provide: AuthService, useValue: { hasAnyPermission: () => false } },
        { provide: RankingSystemService, useValue: {} },
        {
          provide: Apollo,
          useValue: {
            query: jest.fn(() => {
              throw new Error('Unexpected validation-overview test query');
            }),
          },
        },
      ],
    }).compileComponents();
    jest.spyOn(TestBed.inject(AssemblyGeneratorService), 'loadStats').mockResolvedValue();
    service = TestBed.inject(AssemblyService);
    service.loaded.set(true);
    service.type.set('M');
    const translations = TestBed.inject(TranslateService);
    locales.forEach(({ locale, asset }) => translations.setTranslation(locale, { all: asset }));
    translations.use('en');
    fixture = TestBed.createComponent(ValidationOutletHost);
    element = fixture.nativeElement;
    await settle();
  });

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function region(): HTMLElement {
    const card = element.querySelector<HTMLElement>('p-card[aria-labelledby="assembly-validation-title"]');
    if (!card) throw new Error('Missing validation Card');
    return card;
  }

  function setValidation(errors: ValidationMessage[], warnings: ValidationMessage[] = [], valid = false): void {
    service.validationResult.set({
      baseTeamIndex: 0,
      baseTeamPlayers: [],
      titularsIndex: 0,
      titularsPlayers: [],
      valid,
      errors,
      warnings,
    });
  }

  function playerMessage(name: string): ValidationMessage {
    return { message: 'all.v1.teamFormation.errors.comp-status', params: { player: { fullName: name } } };
  }

  it.each(locales)('names the native region and success state in $locale', async ({ locale, asset }) => {
    TestBed.inject(TranslateService).use(locale);
    setValidation([], [], true);
    await settle();
    expect(region().getAttribute('role')).toBe('region');
    expect(region().querySelector('h2')?.textContent?.trim()).toBe(asset.v1.teamFormation.errors['title']);
    expect(region().textContent).toContain(asset.v1.teamFormation.errors['none']);
    expect(region().querySelector('ul')).toBeNull();
    const debugCard = fixture.debugElement.query(By.css('p-card[aria-labelledby="assembly-validation-title"]'));
    expect(debugCard.injector.get(Card).dt()).toBeUndefined();
    const message = debugCard.query(By.directive(Message)).injector.get(Message);
    expect(message.severity()).toBe('success');
    expect(message.icon()).toBe('pi pi-check-circle');
    expect(message.closable()).toBe(false);
    expect(message.life()).toBeUndefined();
    expect(fixture.componentInstance.overview?.valid).toBe(true);
  });

  it.each(locales)('keeps repeated-code parameters and error-before-warning order in $locale', async ({ locale, asset }) => {
    TestBed.inject(TranslateService).use(locale);
    setValidation([playerMessage('Test Alpha'), playerMessage('Test Beta')], [playerMessage('Test Gamma')]);
    await settle();
    const messages = [...region().querySelectorAll('p-message')];
    expect(messages.map((message) => message.textContent?.trim())).toEqual(
      ['Test Alpha', 'Test Beta', 'Test Gamma'].map((name) => asset.v1.teamFormation.errors['comp-status'].replace('{playerFullName}', name)),
    );
    expect(region().querySelector('ul')?.getAttribute('role')).toBe('list');
    expect(region().querySelectorAll('li')).toHaveLength(3);
    const debugCard = fixture.debugElement.query(By.css('p-card[aria-labelledby="assembly-validation-title"]'));
    expect(debugCard.queryAll(By.directive(Message)).map((item) => item.injector.get(Message).severity())).toEqual(['error', 'error', 'warn']);
    expect(debugCard.queryAll(By.directive(Message)).map((item) => item.injector.get(Message).icon())).toEqual([
      'pi pi-times-circle',
      'pi pi-times-circle',
      'pi pi-exclamation-triangle',
    ]);
    expect(region().textContent).not.toContain('{player');
    expect(region().textContent).not.toContain('all.');
    expect(fixture.componentInstance.overview?.valid).toBe(false);
  });

  it('updates parameters when a fresh validation result retains the same message code', async () => {
    setValidation([playerMessage('Old synthetic player')]);
    await settle();
    setValidation([playerMessage('New synthetic player')]);
    await settle();
    expect(region().textContent).toContain('New synthetic player');
    expect(region().textContent).not.toContain('Old synthetic player');
  });

  it('reuses the emitted template in a second outlet without duplicate heading IDs', async () => {
    setValidation([playerMessage('Synthetic error')], [playerMessage('Synthetic warning')]);
    await settle();
    const outlet = element.querySelector('[data-testid="dialog-content"]');
    expect(outlet?.textContent?.trim()).toBe(region().querySelector('.p-card-content')?.textContent?.trim());
    expect(outlet?.querySelectorAll('p-message')).toHaveLength(2);
    expect(element.querySelectorAll('#assembly-validation-title')).toHaveLength(1);
    expect(outlet?.querySelector('[id]')).toBeNull();
    setValidation([], [], true);
    await settle();
    expect(outlet?.querySelector('p-message')?.classList.contains('p-message-success')).toBe(true);
    expect(fixture.componentInstance.overview?.valid).toBe(true);
  });

  it('shows warning-only results without a success message and clears stale diagnostics', async () => {
    setValidation([], [playerMessage('Warning only')]);
    await settle();
    expect(region().querySelectorAll('p-message')).toHaveLength(1);
    expect(region().querySelector('.p-message-warn')).not.toBeNull();
    setValidation([], [], true);
    await settle();
    expect(region().querySelector('li')).toBeNull();
    expect(region().querySelector('.p-message-success')).not.toBeNull();
    expect(region().textContent).not.toContain('Warning only');
  });

  it('keeps the validation summary available in mobile and desktop branches', async () => {
    for (const mobile of [true, false]) {
      fixture.componentInstance.assembly().isMobile.set(mobile);
      await settle();
      expect(region().querySelector('p-message')).not.toBeNull();
    }
  });

  it('preserves loading and loaded visibility gates', async () => {
    service.loading.set(true);
    await settle();
    expect(element.querySelector('#assembly-validation-title')).toBeNull();
    expect(element.querySelector('p-progressbar')).not.toBeNull();
    service.loading.set(false);
    service.loaded.set(false);
    await settle();
    expect(element.querySelector('#assembly-validation-title')).toBeNull();
    service.loaded.set(true);
    await settle();
    expect(region()).toBeTruthy();
  });
});
