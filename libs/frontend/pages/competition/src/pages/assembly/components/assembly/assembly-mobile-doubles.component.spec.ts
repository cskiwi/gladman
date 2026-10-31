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

const slotIds = ['double1', 'double2', 'double3', 'double4'];
const locales = ['en', 'nl_BE', 'fr_BE'];

function player(id: string, gender = 'M'): PlayerWithRanking {
  return Object.assign(new Player(), { id, gender, firstName: 'Test', lastName: id, competitionPlayer: true });
}

describe('Assembly mobile doubles surfaces', () => {
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
              throw new Error('Unexpected mobile doubles query');
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

  function select(slotId: string, position: number): Select {
    return fixture.debugElement.queryAll(By.css(`p-card[aria-labelledby="assembly-mobile-${slotId}-title"] p-select`))[position].injector.get(Select);
  }

  it.each(locales)('names M/F/MX Cards and both positions with real %s copy', async (locale) => {
    translations.use(locale);
    for (const type of ['M', 'F', 'MX'] as const) {
      service.type.set(type);
      await settle();
      for (const slotId of slotIds) {
        const titleId = `assembly-mobile-${slotId}-title`;
        const slotLabel = service.getSlotLabel(slotId);
        const prefix = slotLabel.prefix ? translations.instant(slotLabel.prefix) : '';
        const expectedTitle = `${prefix} ${translations.instant(slotLabel.label)}`.trim();
        expect(element.querySelector(`#${titleId}`)?.textContent?.trim()).toBe(expectedTitle);
        expect(element.querySelector(`p-card[aria-labelledby="${titleId}"]`)?.getAttribute('role')).toBe('region');
        for (const position of [0, 1]) {
          const inputId = `assembly-mobile-${slotId}-${position}`;
          const controlName = `${expectedTitle} ${translations.instant('all.competition.player')} ${position + 1}`;
          expect(element.querySelector(`#${inputId}`)?.getAttribute('aria-label')?.trim()).toBe(controlName);
          expect(element.querySelector(`#${inputId}`)?.getAttribute('aria-label')).not.toContain('all.');
          expect(element.querySelector(`label[for="${inputId}"]`)).toBeNull();
          expect(select(slotId, position).placeholder()).toBe(translations.instant('all.v1.teamFormation.teamFormation.selectPlayer'));
          expect(select(slotId, position).placeholder()).not.toContain('all.');
        }
      }
    }
    const ids = Array.from(element.querySelectorAll('[id]'), (node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('shares native fluid Selects, full-name templates and original option identities across eight controls', () => {
    for (const slotId of slotIds) {
      for (const position of [0, 1]) {
        const control = select(slotId, position);
        expect(control.optionLabel()).toBe('label');
        expect(control.optionValue()).toBe('value');
        expect(control.options()[0].value).toBe(service.players().REGULAR[0]);
        expect(control.getOptionLabel(control.options()[0])).toBe('Test a');
        expect(control.getOptionLabel(control.options()[1])).toBe('Test b');
        expect(control.fluid()).toBe(true);
        expect(control.showClear()).toBe(true);
        expect(control.dataKey()).toBe('id');
        expect(control.dt()).toBeUndefined();
      }
    }
  });

  it.each(slotIds)('preserves both %s indices, native model values, clearing and array form synchronization', async (slotId) => {
    const values = service.players().REGULAR.slice(0, 2);
    const assign = jest.spyOn(service, 'setSlotPlayer');
    for (const position of [0, 1]) {
      select(slotId, position).onChange.emit({ originalEvent: new Event('change'), value: values[position] });
      await settle();
      expect(assign).toHaveBeenLastCalledWith(slotId, position, values[position]);
      expect(select(slotId, position).value).toBe(values[position]);
    }
    expect(service.getSlotData(slotId)).toEqual(values);
    expect(service.formGroup.get(slotId)?.value).toEqual(values);
    select(slotId, 1).onChange.emit({ originalEvent: new Event('change'), value: null });
    await settle();
    expect(assign).toHaveBeenLastCalledWith(slotId, 1, null);
    expect(service.getSlotData(slotId)).toEqual([values[0]]);
    expect(service.formGroup.get(slotId)?.value).toEqual([values[0]]);
    select(slotId, 0).onChange.emit({ originalEvent: new Event('change'), value: null });
    await settle();
    expect(service.getSlotData(slotId)).toEqual([]);
    expect(service.formGroup.get(slotId)?.value).toEqual([]);
    expect(service.validate).toHaveBeenCalled();
  });

  it('preserves existing regular/backup, partner exclusion and mixed-gender filtering', async () => {
    const options = (slotId: string, position: number) =>
      fixture.componentInstance.getMobilePlayerOptions(slotId, position).map((option) => option.id);
    expect(options('double1', 0)).toEqual(['a', 'b', 'c', 'backup']);
    service.setSlotPlayer('double1', 0, service.players().REGULAR[0]);
    await settle();
    expect(options('double1', 1)).toEqual(['b', 'c', 'backup']);
    service.type.set('MX');
    await settle();
    expect(options('double3', 0)).toContain('c');
    service.setSlotPlayer('double3', 0, service.players().REGULAR[0]);
    await settle();
    expect(options('double3', 1)).toEqual(['c']);
  });

  it('retains shared long-name wrapping in both selected positions', async () => {
    const values = [player('a'), player('b')];
    values[0].lastName = 'LongName'.repeat(30);
    values[1].lastName = 'OtherName'.repeat(30);
    service.players.set({ REGULAR: values, BACKUP: [] });
    service.double1.set(values);
    await settle();
    for (const position of [0, 1]) {
      expect(element.querySelector(`#assembly-mobile-double1-${position}`)?.textContent).toContain(`Test ${values[position].lastName}`);
    }
    expect(element.querySelectorAll('p-card[aria-labelledby="assembly-mobile-double1-title"] .wrap-anywhere')).toHaveLength(2);
  });

  it('retains empty/loading/unloaded gates, completed singles, mobile substitutes and excluded desktop slots', async () => {
    service.players.set({ REGULAR: [], BACKUP: [] });
    await settle();
    expect(element.querySelectorAll('p-select')).toHaveLength(13);
    expect(select('double1', 0).options()).toEqual([]);
    expect(element.querySelector('#assembly-mobile-single1')).toBeTruthy();
    expect(element.querySelector('p-fieldset p-select')).toBeTruthy();
    fixture.componentInstance.isMobile.set(false);
    await settle();
    expect(element.querySelector('#assembly-mobile-double1-title')).toBeNull();
    expect(element.querySelector('#double1[cdkDropList]')).toBeTruthy();
    service.loading.set(true);
    await settle();
    expect(element.querySelector('p-progressbar')).toBeTruthy();
    expect(element.querySelector('#double1')).toBeNull();
    service.loading.set(false);
    service.loaded.set(false);
    await settle();
    expect(element.querySelector('p-card')).toBeNull();
  });
});
