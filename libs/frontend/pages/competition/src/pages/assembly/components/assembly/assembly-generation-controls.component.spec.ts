import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { Player } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ButtonDirective } from 'primeng/button';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';
import { AssemblyGeneratorService, GenerateStrategy } from '../../assembly-generator.service';
import { AssemblyService } from '../../page-assembly.service';
import { AssemblyComponent } from './assembly.component';

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: { competition: { 'team-assembly': { 'auto-generate': Record<string, string> } } } = JSON.parse(readFileSync(assetPath, 'utf8'));
  return { locale, asset };
});

describe('Assembly desktop generation controls', () => {
  let fixture: ComponentFixture<AssemblyComponent>;
  let service: AssemblyService;
  let generator: AssemblyGeneratorService;
  let element: HTMLElement;
  let generate: jest.SpyInstance;

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
              throw new Error('Unexpected generation-controls test query');
            }),
          },
        },
      ],
    }).compileComponents();
    generator = TestBed.inject(AssemblyGeneratorService);
    jest.spyOn(generator, 'loadStats').mockResolvedValue();
    generate = jest.spyOn(generator, 'generate').mockResolvedValue();
    service = TestBed.inject(AssemblyService);
    jest.spyOn(service, 'validate').mockResolvedValue();
    service.loaded.set(true);
    service.type.set('M');
    service.players.set({
      REGULAR: [Object.assign(new Player(), { id: 'one', firstName: 'Test', lastName: 'One', gender: 'M', competitionPlayer: true })],
      BACKUP: [],
    });
    service.setAllPlayersAvailable(true);
    fixture = TestBed.createComponent(AssemblyComponent);
    fixture.componentRef.setInput('formGroup', service.formGroup);
    fixture.componentInstance.isMobile.set(false);
    element = fixture.nativeElement;
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation('en', { all: locales[0].asset });
    translations.use('en');
    await settle();
  });

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function region(): HTMLElement {
    const result = element.querySelector<HTMLElement>('p-card[aria-labelledby="assembly-generation-title"]');
    if (!result) throw new Error('Missing generation Card');
    return result;
  }

  function buttons(): HTMLButtonElement[] {
    return [...region().querySelectorAll('button')];
  }

  it.each(locales)('names the native region and all controls in $locale', async ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    await settle();
    const copy = asset.competition['team-assembly']['auto-generate'];
    expect(region().getAttribute('role')).toBe('region');
    expect(region().querySelector('h2')?.textContent?.trim()).toBe(copy['title']);
    expect(buttons().map((button) => button.textContent?.trim())).toEqual(['variations', 'best-results', 'random', 'clear'].map((key) => copy[key]));
    expect(region().querySelector('[role="combobox"]')?.getAttribute('aria-label')).toBe(copy['time-range']);
    expect(region().textContent).not.toContain('all.');
    const debugRegion = fixture.debugElement.query(By.css('p-card[aria-labelledby="assembly-generation-title"]'));
    expect(debugRegion.injector.get(Card).dt()).toBeUndefined();
    expect(region().querySelector('p-button')).toBeNull();
    expect(debugRegion.queryAll(By.directive(ButtonDirective)).map((item) => item.injector.get(ButtonDirective).fluid())).toEqual([
      true,
      true,
      true,
      true,
    ]);
    expect(buttons().map((button) => button.type)).toEqual(['button', 'button', 'button', 'button']);
    expect([...region().querySelectorAll('button i')].every((icon) => icon.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(
      debugRegion
        .queryAll(By.directive(Tooltip))
        .filter((item) => item.injector.get(Tooltip).content())
        .map((item) => {
          const tooltip = item.injector.get(Tooltip);
          return { content: tooltip.content(), event: tooltip.tooltipEvent() };
        }),
    ).toEqual(['variations', 'best-results', 'random'].map((key) => ({ content: copy[`${key}-tooltip`], event: 'both' })));
  });

  it.each<GenerateStrategy>(['variations', 'best-results', 'random'])('dispatches %s with selected range and weeks', async (strategy) => {
    fixture.componentInstance.selectedTimeRange.set('last-weeks');
    fixture.componentInstance.selectedWeeks.set(7);
    await settle();
    const weeks = region().querySelector<HTMLInputElement>('#weeks-input');
    expect(weeks?.value).toBe('7');
    expect(weeks?.min).toBe('1');
    expect(weeks?.max).toBe('52');
    expect(region().querySelector('label[for="weeks-input"]')?.textContent?.trim()).toBe(
      locales[0].asset.competition['team-assembly']['auto-generate']['weeks'],
    );
    buttons()[['variations', 'best-results', 'random'].indexOf(strategy)].click();
    await settle();
    expect(generate).toHaveBeenCalledWith({ strategy, timeRange: 'last-weeks', weeks: 7 });
    expect(fixture.componentInstance.generating()).toBe(false);
    fixture.componentInstance.selectedTimeRange.set('season');
    await settle();
    expect(region().querySelector('#weeks-input')).toBeNull();
  });

  it('disables generation but not clear when no players are available', async () => {
    service.setAllPlayersAvailable(false);
    await settle();
    expect(buttons().map((button) => button.disabled)).toEqual([true, true, true, false]);
    buttons()[0].click();
    expect(generate).not.toHaveBeenCalled();
  });

  it('keeps all strategies loading and disabled until generation settles', async () => {
    let finish!: () => void;
    generate.mockImplementation(() => new Promise<void>((resolve) => (finish = resolve)));
    buttons()[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.generating()).toBe(true);
    expect(buttons().map((button) => button.disabled)).toEqual([true, true, true, false]);
    expect(buttons().map((button) => button.getAttribute('aria-busy'))).toEqual(['true', 'true', 'true', null]);
    expect(region().querySelectorAll('button .pi-spin.pi-spinner')).toHaveLength(3);
    finish();
    await settle();
    expect(buttons().map((button) => button.disabled)).toEqual([false, false, false, false]);
    expect(region().querySelectorAll('button .pi-spinner')).toHaveLength(0);
    expect([...region().querySelectorAll('button i')].map((icon) => icon.className)).toEqual([
      'pi pi-sync',
      'pi pi-star',
      'pi pi-bolt',
      'pi pi-trash',
    ]);
  });

  it('propagates generation failure and restores loading state without a success fallback', async () => {
    const failure = new Error('Synthetic generation failure');
    generate.mockRejectedValue(failure);
    await expect(fixture.componentInstance.generateAssembly('random')).rejects.toThrow(failure);
    expect(fixture.componentInstance.generating()).toBe(false);
    await settle();
    expect(buttons().every((button) => !button.disabled)).toBe(true);
  });

  it('clears every local slot and synchronizes the existing form without changing the pool', async () => {
    const pool = service.players();
    const player = pool.REGULAR[0];
    for (const slot of [
      service.single1,
      service.single2,
      service.single3,
      service.single4,
      service.double1,
      service.double2,
      service.double3,
      service.double4,
      service.substitutes,
    ]) {
      slot.set([player]);
    }
    service.syncFormFromSlots();
    buttons()[3].click();
    await settle();
    for (const id of ['single1', 'single2', 'single3', 'single4', 'double1', 'double2', 'double3', 'double4', 'substituteList']) {
      expect(service.getSlotData(id)).toEqual([]);
    }
    expect(service.formGroup.get('single1')?.value).toBeNull();
    expect(service.formGroup.get('double1')?.value).toEqual([]);
    expect(service.formGroup.get('subtitudes')?.value).toEqual([]);
    expect(service.players()).toBe(pool);
    expect(service.validate).toHaveBeenCalled();
    expect(generate).not.toHaveBeenCalled();
  });

  it('keeps generation controls outside the mobile, loading and unloaded branches', async () => {
    fixture.componentInstance.isMobile.set(true);
    await settle();
    expect(element.querySelector('#assembly-generation-title')).toBeNull();
    expect(element.querySelectorAll('p-select')).toHaveLength(13);
    fixture.componentInstance.isMobile.set(false);
    service.loading.set(true);
    await settle();
    expect(element.querySelector('#assembly-generation-title')).toBeNull();
    expect(element.querySelector('p-progressbar')).toBeTruthy();
    service.loading.set(false);
    service.loaded.set(false);
    await settle();
    expect(element.querySelector('#assembly-generation-title')).toBeNull();
  });
});
