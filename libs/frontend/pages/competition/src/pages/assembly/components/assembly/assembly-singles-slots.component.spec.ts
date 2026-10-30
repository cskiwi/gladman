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
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { AssemblyGeneratorService } from '../../assembly-generator.service';
import { AssemblyService, PlayerWithRanking } from '../../page-assembly.service';
import { AssemblyComponent } from './assembly.component';

type SlotCopy = {
  competition: { 'team-assembly': Record<`single${1 | 2 | 3 | 4}`, string> & { stats: Record<string, string> } };
  gender: { males: string; females: string };
  team: { 'no-players': string };
};

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: SlotCopy = JSON.parse(readFileSync(assetPath, 'utf8'));
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

describe('Assembly desktop singles slots', () => {
  let fixture: ComponentFixture<AssemblyComponent>;
  let service: AssemblyService;
  let generator: AssemblyGeneratorService;
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
              throw new Error('Unexpected singles test query');
            }),
          },
        },
      ],
    }).compileComponents();
    generator = TestBed.inject(AssemblyGeneratorService);
    jest.spyOn(generator, 'loadStats').mockResolvedValue();
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

  function card(slotId = 'single1'): HTMLElement {
    const result = element.querySelector<HTMLElement>(`p-card[aria-labelledby="assembly-${slotId}-title"]`);
    if (!result) throw new Error(`Missing singles Card: ${slotId}`);
    return result;
  }

  function list(id: string): CdkDropList<PlayerWithRanking[]> {
    return fixture.debugElement.query(By.css(`#${id}`)).injector.get(CdkDropList);
  }

  function drop(from: string, to: string, id: string): void {
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
      currentIndex: container.data.length,
      isPointerOverContainer: true,
      distance: { x: 100, y: 0 },
      dropPoint: { x: 100, y: 100 },
      event: new MouseEvent('mouseup'),
    });
  }

  it.each(locales)('names empty male, female and mixed regions in $locale', async ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    for (const type of ['M', 'F', 'MX'] as const) {
      service.type.set(type);
      await settle();
      for (const index of [1, 2, 3, 4] as const) {
        const slot = card(`single${index}`);
        const female = type === 'F' || (type === 'MX' && index > 2);
        const labelIndex = type === 'MX' && index > 2 ? (index === 3 ? 1 : 2) : index;
        const label = asset.competition['team-assembly'][`single${labelIndex}`];
        expect(slot.getAttribute('role')).toBe('region');
        expect(slot.querySelector('h3')?.textContent?.trim()).toBe(`${female ? asset.gender.females : asset.gender.males} ${label}`);
        expect(slot.textContent).toContain(asset.team['no-players']);
        expect(slot.textContent).not.toContain('all.');
      }
    }
  });

  it('preserves all four CDK contracts without per-instance styling overrides', () => {
    for (const id of ['single1', 'single2', 'single3', 'single4']) {
      const target = list(id);
      expect(target.id).toBe(id);
      expect(target.data).toBe(service.getSlotData(id));
      expect(target.connectedTo).toEqual(fixture.componentInstance.lists);
      expect(target.enterPredicate).toBe(fixture.componentInstance.canDropPredicate);
      expect(target.sortingDisabled).toBe(true);
      expect(card(id).contains(element.querySelector(`#${id}`))).toBe(true);
      const nativeCard = fixture.debugElement.query(By.css(`p-card[aria-labelledby="assembly-${id}-title"]`)).injector.get(Card);
      expect(nativeCard.dt()).toBeUndefined();
    }
  });

  it('preserves pool copying, singles transfer/return, substitute removal and scalar form values', async () => {
    const poolIds = list('playerList')
      .data.map((item) => item.id)
      .sort();
    service.substitutes.set([player('a')]);
    drop('playerList', 'single1', 'a');
    await settle();
    expect(service.single1().map((item) => item.id)).toEqual(['a']);
    expect(service.formGroup.get('single1')?.value).toBe(service.single1()[0]);
    expect(service.substitutes()).toEqual([]);
    expect(
      list('playerList')
        .data.map((item) => item.id)
        .sort(),
    ).toEqual(poolIds);
    expect(card().querySelectorAll('app-assembly-player')).toHaveLength(1);
    drop('single1', 'single2', 'a');
    await settle();
    expect(service.single1()).toEqual([]);
    expect(service.formGroup.get('single1')?.value).toBeNull();
    expect(service.formGroup.get('single2')?.value).toBe(service.single2()[0]);
    drop('single2', 'playerList', 'a');
    await settle();
    expect(service.single2()).toEqual([]);
    expect(service.formGroup.get('single2')?.value).toBeNull();
    expect(
      list('playerList')
        .data.map((item) => item.id)
        .sort(),
    ).toEqual(poolIds);
    expect(service.validate).toHaveBeenCalledTimes(3);
  });

  it('retains one-player capacity, duplicate and mixed-gender entry predicates', async () => {
    const drags = fixture.debugElement
      .query(By.css('#playerList'))
      .queryAll(By.directive(CdkDrag))
      .map((item) => item.injector.get(CdkDrag));
    const male = drags.find((item) => item.data.id === 'a');
    const female = drags.find((item) => item.data.id === 'c');
    if (!male || !female) throw new Error('Missing gender predicate fixtures');
    service.type.set('MX');
    for (const id of ['single1', 'single2']) {
      expect(list(id).enterPredicate(male, list(id))).toBe(true);
      expect(list(id).enterPredicate(female, list(id))).toBe(false);
    }
    for (const id of ['single3', 'single4']) {
      expect(list(id).enterPredicate(male, list(id))).toBe(false);
      expect(list(id).enterPredicate(female, list(id))).toBe(true);
    }
    service.single1.set([male.data]);
    await settle();
    expect(list('single1').enterPredicate(male, list('single1'))).toBe(false);
    expect(list('single1').enterPredicate(female, list('single1'))).toBe(false);
  });

  it('still prevents copying the same pool player into multiple singles', async () => {
    drop('playerList', 'single1', 'a');
    await settle();
    drop('playerList', 'single2', 'a');
    await settle();
    expect(service.single2()).toEqual([]);
    expect(service.formGroup.get('single2')?.value).toBeNull();
  });

  it.each(locales)('keeps statistics, rankings and localized hover/focus descriptions in $locale', async ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    service.single1.set([player('a')]);
    generator.slotStats.set(new Map([['single1', { wins: 1, total: 2, winPct: 50 }]]));
    generator.playerStats.set(new Map([['a', { playerId: 'a', wins: 1, total: 4, winPct: 25 }]]));
    await settle();
    const statistics = [...card().querySelectorAll<HTMLElement>('[role="img"][tabindex="0"]')];
    expect(statistics.map((stat) => stat.textContent?.trim())).toEqual(['1/2', '25%']);
    const debugCard = fixture.debugElement.query(By.css('p-card[aria-labelledby="assembly-single1-title"]'));
    const tags = debugCard.queryAll(By.directive(Tag));
    expect(tags.map((tag) => tag.injector.get(Tag).severity())).toEqual(['success', 'danger']);
    expect(tags.every((tag) => tag.injector.get(Tag).dt() === undefined)).toBe(true);
    const tooltips = debugCard.queryAll(By.directive(Tooltip));
    expect(tooltips).toHaveLength(2);
    for (const tooltip of tooltips) {
      const directive = tooltip.injector.get(Tooltip);
      expect(directive.tooltipEvent()).toBe('both');
      expect(directive.content()).toBe(tooltip.nativeElement.getAttribute('aria-label'));
      expect(directive.content()).not.toContain('all.');
    }
    expect(statistics[0].getAttribute('aria-label')).toBe(
      translations.instant('all.competition.team-assembly.stats.tooltip-text', { wins: 1, total: 2, pct: 50 }),
    );
    expect(card().querySelector('app-assembly-player')?.textContent?.trim()).toBe('Test a4');
    expect(card().textContent).not.toContain(asset.team['no-players']);
  });

  it('omits absent statistics without hiding the occupied player', async () => {
    service.single1.set([player('a')]);
    await settle();
    expect(card().querySelector('[role="img"]')).toBeNull();
    expect(card().querySelectorAll('app-assembly-player')).toHaveLength(1);
  });

  it('leaves mobile selectors and loading gates unchanged', async () => {
    fixture.componentInstance.isMobile.set(true);
    await settle();
    expect(element.querySelector('[aria-labelledby="assembly-single1-title"]')).toBeNull();
    expect(element.querySelectorAll('p-select')).toHaveLength(13);
    fixture.componentInstance.isMobile.set(false);
    service.loading.set(true);
    await settle();
    expect(element.querySelector('[aria-labelledby="assembly-single1-title"]')).toBeNull();
    expect(element.querySelector('p-progressbar')).toBeTruthy();
  });
});
