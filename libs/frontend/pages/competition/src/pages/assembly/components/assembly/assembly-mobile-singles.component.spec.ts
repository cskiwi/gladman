import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { Player } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Select } from 'primeng/select';
import { AssemblyGeneratorService } from '../../assembly-generator.service';
import { AssemblyService, PlayerWithRanking } from '../../page-assembly.service';
import { AssemblyComponent } from './assembly.component';

const slotIds = ['single1', 'single2', 'single3', 'single4'];
const locales = ['en', 'nl_BE', 'fr_BE'];

function player(id: string, gender = 'M'): PlayerWithRanking {
  return Object.assign(new Player(), { id, gender, firstName: 'Test', lastName: id, competitionPlayer: true });
}

describe('Assembly mobile singles selectors', () => {
  let fixture: ComponentFixture<AssemblyComponent>;
  let service: AssemblyService;
  let element: HTMLElement;
  let translations: TranslateService;

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
              throw new Error('Unexpected mobile singles query');
            }),
          },
        },
      ],
    }).compileComponents();
    jest.spyOn(TestBed.inject(AssemblyGeneratorService), 'loadStats').mockResolvedValue();
    service = TestBed.inject(AssemblyService);
    jest.spyOn(service, 'validate').mockResolvedValue();
    service.loaded.set(true);
    service.type.set('M');
    service.players.set({ REGULAR: [player('a'), player('b'), player('c', 'F')], BACKUP: [player('backup')] });
    translations = TestBed.inject(TranslateService);
    for (const locale of locales) {
      const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
      translations.setTranslation(locale, { all: JSON.parse(readFileSync(assetPath, 'utf8')) });
    }
    translations.use('en');
    fixture = TestBed.createComponent(AssemblyComponent);
    fixture.componentRef.setInput('formGroup', service.formGroup);
    fixture.componentInstance.isMobile.set(true);
    element = fixture.nativeElement;
    await settle();
  });

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function select(slotId = 'single1'): Select {
    return fixture.debugElement.query(By.css(`p-card[aria-labelledby="assembly-mobile-${slotId}-title"] p-select`)).injector.get(Select);
  }

  it.each(locales)('names all M/F/MX regions and controls with real $locale copy', async (locale) => {
    translations.use(locale);
    for (const type of ['M', 'F', 'MX'] as const) {
      service.type.set(type);
      await settle();
      for (const slotId of slotIds) {
        const titleId = `assembly-mobile-${slotId}-title`;
        const title = element.querySelector(`#${titleId}`);
        const label = service.getSlotLabel(slotId);
        expect(title?.textContent?.trim()).toBe(`${translations.instant(label.prefix)} ${translations.instant(label.label)}`);
        expect(element.querySelector(`p-card[aria-labelledby="${titleId}"]`)?.getAttribute('role')).toBe('region');
        expect(element.querySelector(`#assembly-mobile-${slotId}`)?.getAttribute('aria-labelledby')).toBe(titleId);
        expect(select(slotId).placeholder()).toBe(translations.instant('all.v1.teamFormation.teamFormation.selectPlayer'));
        expect(select(slotId).placeholder()).not.toContain('all.');
      }
    }
  });

  it('shares the full-name callback and native fluid presentation across all four controls', () => {
    for (const slotId of slotIds) {
      const control = select(slotId);
      expect(control.optionLabel()).toBe('label');
      expect(control.optionValue()).toBe('value');
      expect(control.getOptionLabel(control.options()[0])).toBe('Test a');
      expect(control.getOptionLabel(control.options()[1])).toBe('Test b');
      expect(control.options()[0].value).toBe(service.players().REGULAR[0]);
      expect(control.fluid()).toBe(true);
      expect(control.showClear()).toBe(true);
      expect(control.dataKey()).toBe('id');
      expect(control.dt()).toBeUndefined();
    }
  });

  it.each(slotIds)('preserves %s assignment, clearing, validation and scalar form synchronization', async (slotId) => {
    const assign = jest.spyOn(service, 'setSlotPlayer');
    const value = player('a');
    select(slotId).onChange.emit({ originalEvent: new Event('change'), value });
    await settle();
    expect(assign).toHaveBeenLastCalledWith(slotId, 0, value);
    expect(service.getSlotData(slotId)).toEqual([value]);
    expect(service.formGroup.get(slotId)?.value).toBe(value);
    expect(select(slotId).value).toBe(value);
    select(slotId).onChange.emit({ originalEvent: new Event('change'), value: null });
    await settle();
    expect(assign).toHaveBeenLastCalledWith(slotId, 0, null);
    expect(service.getSlotData(slotId)).toEqual([]);
    expect(service.formGroup.get(slotId)?.value).toBeNull();
    expect(service.validate).toHaveBeenCalled();
  });

  it('preserves regular/backup filtering, mixed gender rules and the occupied-slot option contract', async () => {
    service.type.set('MX');
    await settle();
    expect(fixture.componentInstance.getMobilePlayerOptions('single1', 0).map((option) => option.value.id)).toEqual(['a', 'b', 'backup']);
    expect(fixture.componentInstance.getMobilePlayerOptions('single3', 0).map((option) => option.value.id)).toEqual(['c']);
    service.single1.set([player('a')]);
    await settle();
    expect(fixture.componentInstance.getMobilePlayerOptions('single1', 0).map((option) => option.value.id)).toEqual(['a']);
  });

  it('wraps long selected full names without losing identity', async () => {
    const value = player('a');
    value.lastName = 'LongName'.repeat(30);
    service.players.set({ REGULAR: [value], BACKUP: [] });
    service.single1.set([value]);
    await settle();
    const label = element.querySelector('#assembly-mobile-single1')?.textContent;
    expect(label).toContain(`Test ${value.lastName}`);
    expect(element.querySelector('p-card[aria-labelledby="assembly-mobile-single1-title"] .wrap-anywhere')).toBeTruthy();
  });

  it('uses full-name labels and the same wrapping template in every mobile lineup Select', () => {
    const controls = fixture.debugElement.queryAll(By.directive(Select)).map((debug) => debug.injector.get(Select));
    expect(controls).toHaveLength(13);
    for (const control of controls) {
      expect(control.optionLabel()).toBe('label');
      expect(control.optionValue()).toBe('value');
      expect(control.options().map((option: { label: string }) => option.label)).toContain('Test a');
      expect(control.getOptionLabel(control.options()[1])).toBe('Test b');
    }
  });

  it('retains unique stable native option tracking keys across all mobile lineup Selects', async () => {
    const controls = fixture.debugElement.queryAll(By.directive(Select)).map((debug) => debug.injector.get(Select));
    const keys = controls.map((control) => control.options().map((option, index) => control.trackOption(option, index)));
    for (const controlKeys of keys) {
      expect(controlKeys.every((key) => key !== undefined && key !== null && key !== '')).toBe(true);
      expect(new Set(controlKeys).size).toBe(controlKeys.length);
    }
    service.players.set({ ...service.players() });
    await settle();
    expect(controls.map((control) => control.options().map((option, index) => control.trackOption(option, index)))).toEqual(keys);
  });

  it.each(['double1', 'double2', 'double3', 'double4'])('retains both %s player positions and full-name selected values', async (slotId) => {
    const slotIndex = Number(slotId.slice(-1)) - 1;
    const controls = fixture.debugElement.queryAll(By.directive(Select)).slice(slotIndex * 2, slotIndex * 2 + 2);
    const values = service.players().REGULAR.slice(0, 2);
    for (const index of [0, 1]) {
      controls[index].injector.get(Select).onChange.emit({ originalEvent: new Event('change'), value: values[index] });
      await settle();
      expect(service.getSlotData(slotId)[index]).toBe(values[index]);
      expect(service.formGroup.get(slotId)?.value[index]).toBe(values[index]);
      expect(controls[index].nativeElement.textContent).toContain(`Test ${values[index].id}`);
    }
    controls[1].injector.get(Select).onChange.emit({ originalEvent: new Event('change'), value: null });
    await settle();
    expect(service.getSlotData(slotId)).toEqual([values[0]]);
  });

  it('retains substitute append dispatch and original player values with full-name labels', async () => {
    const control = fixture.debugElement.queryAll(By.directive(Select))[12];
    const value = service.players().REGULAR[0];
    const assign = jest.spyOn(service, 'setSlotPlayer');
    expect(control.injector.get(Select).getOptionLabel(control.injector.get(Select).options()[0])).toBe('Test a');
    control.injector.get(Select).onChange.emit({ originalEvent: new Event('change'), value });
    await settle();
    expect(assign).toHaveBeenCalledWith('substituteList', 0, value);
    expect(service.substitutes()).toEqual([value]);
    expect(control.injector.get(Select).getOptionLabel(control.injector.get(Select).options()[0])).toBe('Test b');
  });

  it('retains empty/loading gates, 13 mobile Selects and the excluded desktop branch', async () => {
    service.players.set({ REGULAR: [], BACKUP: [] });
    await settle();
    expect(select().options()).toEqual([]);
    expect(element.querySelectorAll('p-select')).toHaveLength(13);
    fixture.componentInstance.isMobile.set(false);
    await settle();
    expect(element.querySelector('#assembly-mobile-single1')).toBeNull();
    expect(element.querySelector('#single1[cdkDropList]')).toBeTruthy();
    service.loading.set(true);
    await settle();
    expect(element.querySelector('p-progressbar')).toBeTruthy();
    expect(element.querySelector('#single1')).toBeNull();
    service.loading.set(false);
    service.loaded.set(false);
    await settle();
    expect(element.querySelector('p-card')).toBeNull();
  });
});
