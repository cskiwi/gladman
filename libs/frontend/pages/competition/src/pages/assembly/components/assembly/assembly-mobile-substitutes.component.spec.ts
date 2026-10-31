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

const locales = ['en', 'nl_BE', 'fr_BE'];
const titleId = 'assembly-mobile-substitutes-title';

function player(id: string): PlayerWithRanking {
  return Object.assign(new Player(), { id, gender: 'M', firstName: 'Test', lastName: id, competitionPlayer: true });
}

describe('Assembly mobile substitutes picker', () => {
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
              throw new Error('Unexpected mobile substitutes query');
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
    service.players.set({ REGULAR: [player('a'), player('b')], BACKUP: [player('backup')] });
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

  function select(): Select {
    return fixture.debugElement.query(By.css(`p-card[aria-labelledby="${titleId}"] p-select`)).injector.get(Select);
  }

  it.each(locales)('uses real %s copy for its heading, accessible name and prompt', async (locale) => {
    translations.use(locale);
    await settle();
    const heading = element.querySelector(`#${titleId}`);
    expect(heading?.textContent?.trim()).toBe(translations.instant('all.competition.team-assembly.substitude'));
    expect(element.querySelector(`p-card[aria-labelledby="${titleId}"]`)?.getAttribute('role')).toBe('region');
    expect(element.querySelector('#assembly-mobile-substitutes')?.getAttribute('aria-labelledby')).toBe(titleId);
    expect(select().placeholder()).toBe(translations.instant('all.v1.teamFormation.teamFormation.selectPlayer'));
    expect(select().placeholder()).not.toContain('all.');
    const ids = Array.from(element.querySelectorAll('[id]'), (node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('reuses native fluid sizing and full-name option identities without scoped styling', () => {
    const control = select();
    expect(control.fluid()).toBe(true);
    expect(control.showClear()).toBe(true);
    expect(control.dataKey()).toBe('id');
    expect(control.optionLabel()).toBe('label');
    expect(control.optionValue()).toBe('value');
    expect(control.options().map((option) => option.id)).toEqual(['a', 'b', 'backup']);
    expect(control.options()[0].value).toBe(service.players().REGULAR[0]);
    expect(control.getOptionLabel(control.options()[0])).toBe('Test a');
    expect(control.dt()).toBeUndefined();
  });

  it('preserves append indices, selected feedback, clearing and array form synchronization', async () => {
    const values = service.players().REGULAR;
    const assign = jest.spyOn(service, 'setSlotPlayer');
    select().updateModel(values[0]);
    select().onChange.emit({ originalEvent: new Event('change'), value: values[0] });
    await settle();
    expect(assign).toHaveBeenLastCalledWith('substituteList', 0, values[0]);
    expect(service.substitutes()).toEqual([values[0]]);
    expect(select().value).toBe(values[0]);
    select().updateModel(values[1]);
    select().onChange.emit({ originalEvent: new Event('change'), value: values[1] });
    await settle();
    expect(assign).toHaveBeenLastCalledWith('substituteList', 1, values[1]);
    expect(service.substitutes()).toEqual(values);
    expect(service.formGroup.get('subtitudes')?.value).toEqual(values);
    select().updateModel(null);
    select().onChange.emit({ originalEvent: new Event('change'), value: null });
    await settle();
    expect(assign).toHaveBeenLastCalledWith('substituteList', 2, null);
    expect(select().value).toBeNull();
    // Clearing the append picker does not remove an already appended substitute.
    expect(service.substitutes()).toEqual(values);
    expect(service.formGroup.get('subtitudes')?.value).toEqual(values);
    expect(service.validate).toHaveBeenCalled();
  });

  it('preserves regular/backup filtering and excludes already appended substitutes', async () => {
    service.setSlotPlayer('substituteList', 0, service.players().REGULAR[0]);
    await settle();
    expect(
      select()
        .options()
        .map((option) => option.id),
    ).toEqual(['b', 'backup']);
    service.setSlotPlayer('single1', 0, service.players().REGULAR[1]);
    await settle();
    expect(
      select()
        .options()
        .map((option) => option.id),
    ).not.toContain('b');
  });

  it('retains the shared full-name selected template and long-name wrapping', async () => {
    const value = service.players().REGULAR[0];
    value.lastName = 'LongName'.repeat(30);
    service.players.set({ REGULAR: [value], BACKUP: [] });
    await settle();
    select().updateModel(value);
    await settle();
    expect(element.querySelector('#assembly-mobile-substitutes')?.textContent).toContain(`Test ${value.lastName}`);
    expect(element.querySelector(`#assembly-mobile-substitutes .whitespace-normal.wrap-anywhere`)).toBeTruthy();
  });

  it('retains empty/loading/unloaded gates and completed mobile/desktop branches', async () => {
    service.players.set({ REGULAR: [], BACKUP: [] });
    await settle();
    expect(select().options()).toEqual([]);
    expect(element.querySelectorAll('p-select')).toHaveLength(13);
    expect(element.querySelector('#assembly-mobile-single1')).toBeTruthy();
    expect(element.querySelector('#assembly-mobile-double1-0')).toBeTruthy();
    fixture.componentInstance.isMobile.set(false);
    await settle();
    expect(element.querySelector(`#${titleId}`)).toBeNull();
    expect(element.querySelector('#substituteList[cdkDropList]')).toBeTruthy();
    service.loading.set(true);
    await settle();
    expect(element.querySelector('p-progressbar')).toBeTruthy();
    expect(element.querySelector('#substituteList')).toBeNull();
    service.loading.set(false);
    service.loaded.set(false);
    await settle();
    expect(element.querySelector('p-card')).toBeNull();
  });
});
