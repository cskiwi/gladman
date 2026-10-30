import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { Player, RankingLastPlace } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Card } from 'primeng/card';
import { Tooltip } from 'primeng/tooltip';
import { AssemblyGeneratorService } from '../../assembly-generator.service';
import { AssemblyService, PlayerWithRanking } from '../../page-assembly.service';
import { AssemblyPlayerComponent } from '../assembly-player/assembly-player.component';
import { AssemblyComponent } from './assembly.component';

type SubstituteCopy = {
  competition: { 'team-assembly': { substitude: string } };
  team: { 'no-players': string };
};

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: SubstituteCopy = JSON.parse(readFileSync(assetPath, 'utf8'));
  return { locale, asset };
});

function player(id: string, gender = 'M'): PlayerWithRanking {
  return Object.assign(new Player(), {
    id,
    gender,
    firstName: 'Test',
    lastName: id,
    competitionPlayer: true,
    rankingLastPlaces: [Object.assign(new RankingLastPlace(), { single: 4, double: 6, mix: 8 })],
  });
}

describe('Assembly desktop substitutes container', () => {
  let fixture: ComponentFixture<AssemblyComponent>;
  let service: AssemblyService;
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
              throw new Error('Unexpected substitutes test query');
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
    service.players.set({ REGULAR: [player('a'), player('b'), player('c', 'F')], BACKUP: [] });
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

  function card(): HTMLElement {
    const result = element.querySelector<HTMLElement>('p-card[aria-labelledby="assembly-substitutes-title"]');
    if (!result) throw new Error('Missing substitutes Card');
    return result;
  }

  function list(id = 'substituteList'): CdkDropList<PlayerWithRanking[]> {
    return fixture.debugElement.query(By.css(`#${id}`)).injector.get(CdkDropList);
  }

  function drop(from: string, to: string, id: string, currentIndex = list(to).data.length): void {
    const source = fixture.debugElement.query(By.css(`#${from}`));
    const drag = source
      .queryAll(By.directive(CdkDrag))
      .map((item) => item.injector.get(CdkDrag))
      .find((item) => item.data.id === id);
    if (!drag) throw new Error(`Missing player drag: ${id}`);
    const previousContainer = list(from);
    const container = list(to);
    container.dropped.emit({
      previousContainer,
      container,
      item: drag,
      previousIndex: previousContainer.data.findIndex((item) => item.id === id),
      currentIndex,
      isPointerOverContainer: true,
      distance: { x: 100, y: 0 },
      dropPoint: { x: 100, y: 100 },
      event: new MouseEvent('mouseup'),
    });
  }

  it.each(locales)('names the native empty region in $locale', async ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    await settle();
    expect(card().getAttribute('role')).toBe('region');
    expect(card().querySelector('h3')?.textContent?.trim()).toBe(asset.competition['team-assembly'].substitude);
    expect(card().textContent).toContain(asset.team['no-players']);
    expect(card().textContent).not.toContain('all.');
    const nativeCard = fixture.debugElement.query(By.css('p-card[aria-labelledby="assembly-substitutes-title"]')).injector.get(Card);
    expect(nativeCard.dt()).toBeUndefined();
  });

  it('preserves the CDK data, connections, entry predicate and enabled sorting', () => {
    const target = list();
    expect(target.id).toBe('substituteList');
    expect(target.data).toBe(service.substitutes());
    expect(target.connectedTo).toEqual(fixture.componentInstance.lists);
    expect(target.enterPredicate).toBe(fixture.componentInstance.canDropPredicate);
    expect(target.sortingDisabled).toBe(false);
    expect(card().contains(element.querySelector('#substituteList'))).toBe(true);
  });

  it('copies multiple pool players, syncs the existing form array and returns without duplicating the pool', async () => {
    const poolIds = list('playerList')
      .data.map((item) => item.id)
      .sort();
    drop('playerList', 'substituteList', 'a');
    await settle();
    drop('playerList', 'substituteList', 'b');
    await settle();
    expect(service.substitutes().map((item) => item.id)).toEqual(['a', 'b']);
    expect(service.formGroup.get('subtitudes')?.value).toEqual(service.substitutes());
    expect(card().querySelectorAll('app-assembly-player')).toHaveLength(2);
    expect(card().textContent).not.toContain(locales[0].asset.team['no-players']);
    expect(
      list('playerList')
        .data.map((item) => item.id)
        .sort(),
    ).toEqual(poolIds);
    drop('substituteList', 'playerList', 'a');
    await settle();
    drop('substituteList', 'playerList', 'b');
    await settle();
    expect(service.substitutes()).toEqual([]);
    expect(service.formGroup.get('subtitudes')?.value).toEqual([]);
    expect(
      list('playerList')
        .data.map((item) => item.id)
        .sort(),
    ).toEqual(poolIds);
    expect(service.validate).toHaveBeenCalledTimes(4);
  });

  it('keeps within-list reordering enabled without changing the existing validation contract', async () => {
    service.substitutes.set([player('a'), player('b')]);
    service.syncFormFromSlots();
    await settle();
    drop('substituteList', 'substituteList', 'b', 0);
    await settle();
    expect(service.substitutes().map((item) => item.id)).toEqual(['b', 'a']);
    expect(service.formGroup.get('subtitudes')?.value).toBe(service.substitutes());
    expect(service.validate).not.toHaveBeenCalled();
  });

  it('retains duplicate and singles/doubles exclusions without imposing a gender or capacity limit', async () => {
    const drags = fixture.debugElement
      .query(By.css('#playerList'))
      .queryAll(By.directive(CdkDrag))
      .map((item) => item.injector.get(CdkDrag));
    service.type.set('MX');
    service.substitutes.set([player('other-1'), player('other-2'), player('other-3')]);
    await settle();
    expect(drags.every((drag) => list().enterPredicate(drag, list()))).toBe(true);
    service.substitutes.set([player('a')]);
    service.single1.set([player('b')]);
    service.double2.set([player('c', 'F')]);
    await settle();
    expect(drags.every((drag) => !list().enterPredicate(drag, list()))).toBe(true);
  });

  it('transfers substitutes into singles/doubles and synchronizes their respective form shapes', async () => {
    service.substitutes.set([player('a'), player('b')]);
    await settle();
    drop('substituteList', 'single1', 'a');
    await settle();
    drop('substituteList', 'double1', 'b');
    await settle();
    expect(service.substitutes()).toEqual([]);
    expect(service.formGroup.get('subtitudes')?.value).toEqual([]);
    expect(service.formGroup.get('single1')?.value).toBe(service.single1()[0]);
    expect(service.formGroup.get('double1')?.value).toEqual(service.double1());
    expect(service.validate).toHaveBeenCalledTimes(2);
  });

  it('reuses ranked mixed-event rows and existing accessible warning Tooltips', async () => {
    const substitute = player('long-synthetic-name');
    substitute.firstName = 'Synthetic long first name';
    substitute.competitionPlayer = false;
    service.type.set('MX');
    jest.spyOn(service, 'isException').mockReturnValue(true);
    service.substitutes.set([substitute]);
    await settle();
    const row = fixture.debugElement.query(By.css('#substituteList app-assembly-player'));
    const component = row.injector.get(AssemblyPlayerComponent);
    expect(component.player()).toBe(substitute);
    expect(component.eventType()).toBe('MX');
    expect(component.levelException()).toBe(true);
    expect(row.injector.get(CdkDrag).data).toBe(substitute);
    expect(row.nativeElement.textContent).toContain(substitute.firstName);
    expect(row.nativeElement.textContent).toContain('4 - 6 - 8');
    expect(row.queryAll(By.directive(Tooltip)).every((tooltip) => tooltip.injector.get(Tooltip).tooltipEvent() === 'both')).toBe(true);
    expect(card().querySelectorAll('[role="img"][tabindex="0"]')).toHaveLength(2);
  });

  it('leaves mobile selectors, loading and unloaded gates unchanged', async () => {
    fixture.componentInstance.isMobile.set(true);
    await settle();
    expect(element.querySelector('[aria-labelledby="assembly-substitutes-title"]')).toBeNull();
    expect(element.querySelectorAll('p-select')).toHaveLength(13);
    fixture.componentInstance.isMobile.set(false);
    service.loading.set(true);
    await settle();
    expect(element.querySelector('[aria-labelledby="assembly-substitutes-title"]')).toBeNull();
    expect(element.querySelector('p-progressbar')).toBeTruthy();
    service.loading.set(false);
    service.loaded.set(false);
    await settle();
    expect(element.querySelector('[aria-labelledby="assembly-substitutes-title"]')).toBeNull();
  });
});
