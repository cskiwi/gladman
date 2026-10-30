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
  competition: { 'team-assembly': Record<`double${1 | 2 | 3 | 4}` | `mix${1 | 2 | 3 | 4}`, string> & { stats: Record<string, string> } };
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

describe('Assembly desktop doubles slots', () => {
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
              throw new Error('Unexpected doubles test query');
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

  function card(slotId = 'double1'): HTMLElement {
    const result = element.querySelector<HTMLElement>(`p-card[aria-labelledby="assembly-${slotId}-title"]`);
    if (!result) throw new Error(`Missing doubles Card: ${slotId}`);
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

  it.each(locales)('names empty regions for male, female and mixed teams in $locale', async ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    for (const type of ['M', 'F', 'MX'] as const) {
      service.type.set(type);
      await settle();
      for (const index of [1, 2, 3, 4] as const) {
        const slot = card(`double${index}`);
        const prefix = type === 'M' ? asset.gender.males : type === 'F' ? asset.gender.females : '';
        const label = asset.competition['team-assembly'][`${type === 'MX' ? 'mix' : 'double'}${index}`];
        expect(slot.getAttribute('role')).toBe('region');
        expect(slot.querySelector('h3')?.textContent?.trim()).toBe(`${prefix} ${label}`.trim());
        expect(slot.textContent).toContain(asset.team['no-players']);
        expect(slot.textContent).not.toContain('all.');
      }
    }
  });

  it('preserves all four CDK contracts without per-instance styling overrides', () => {
    for (const id of ['double1', 'double2', 'double3', 'double4']) {
      const target = list(id);
      expect(target.id).toBe(id);
      expect(target.data).toBe(service.getSlotData(id));
      expect(target.connectedTo).toEqual(fixture.componentInstance.lists);
      expect(target.enterPredicate).toBe(fixture.componentInstance.canDropPredicate);
      expect(target.sortingDisabled).toBe(true);
      const nativeCard = fixture.debugElement.query(By.css(`p-card[aria-labelledby="assembly-${id}-title"]`)).injector.get(Card);
      expect(nativeCard.dt()).toBeUndefined();
    }
  });

  it('keeps pool copies, doubles transfer and return synchronized with local forms', async () => {
    const poolIds = list('playerList')
      .data.map((item) => item.id)
      .sort();
    drop('playerList', 'double1', 'a');
    await settle();
    expect(service.double1().map((item) => item.id)).toEqual(['a']);
    expect(service.formGroup.get('double1')?.value).toEqual(service.double1());
    expect(
      list('playerList')
        .data.map((item) => item.id)
        .sort(),
    ).toEqual(poolIds);
    expect(card().querySelectorAll('app-assembly-player')).toHaveLength(1);
    drop('playerList', 'double1', 'b');
    await settle();
    expect(service.double1()).toHaveLength(2);
    drop('double1', 'double2', 'a');
    await settle();
    expect(service.double1().map((item) => item.id)).toEqual(['b']);
    expect(service.formGroup.get('double2')?.value).toEqual(service.double2());
    drop('double2', 'playerList', 'a');
    await settle();
    expect(service.double2()).toEqual([]);
    expect(service.formGroup.get('double2')?.value).toEqual([]);
    expect(service.validate).toHaveBeenCalledTimes(4);
  });

  it('retains capacity, duplicate and mixed-gender entry predicates', async () => {
    const drags = fixture.debugElement
      .query(By.css('#playerList'))
      .queryAll(By.directive(CdkDrag))
      .map((item) => item.injector.get(CdkDrag));
    const [male, secondMale, female] = drags;
    service.type.set('MX');
    expect(list('double1').enterPredicate(female, list('double1'))).toBe(false);
    expect(list('double2').enterPredicate(male, list('double2'))).toBe(false);
    expect(list('double3').enterPredicate(male, list('double3'))).toBe(true);
    service.double3.set([male.data]);
    await settle();
    expect(list('double3').enterPredicate(male, list('double3'))).toBe(false);
    expect(list('double3').enterPredicate(secondMale, list('double3'))).toBe(false);
    expect(list('double3').enterPredicate(female, list('double3'))).toBe(true);
    service.double3.set([male.data, female.data]);
    await settle();
    expect(list('double3').enterPredicate(secondMale, list('double3'))).toBe(false);
  });

  it('still prevents copying the same pool player into more than two doubles', async () => {
    drop('playerList', 'double1', 'a');
    await settle();
    drop('playerList', 'double2', 'a');
    await settle();
    drop('playerList', 'double3', 'a');
    await settle();
    expect(service.double3()).toEqual([]);
    expect(service.formGroup.get('double3')?.value).toEqual([]);
  });

  it.each(locales)('preserves all statistics with localized hover/focus descriptions in $locale', async ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    service.double1.set([player('b'), player('a')]);
    generator.slotStats.set(new Map([['double1', { wins: 3, total: 4, winPct: 75 }]]));
    generator.playerStats.set(new Map([['a', { playerId: 'a', wins: 1, total: 4, winPct: 25 }]]));
    generator.slotPairStats.set(new Map([['double1', new Map([['a:b', { wins: 0, total: 2, winPct: 0 }]])]]));
    generator.totalPairStats.set(new Map([['a:b', { wins: 5, total: 10, winPct: 50 }]]));
    await settle();
    const statistics = [...card().querySelectorAll<HTMLElement>('[role="img"][tabindex="0"]')];
    expect(statistics.map((stat) => stat.textContent?.trim())).toEqual(['3/4', '25%', '0/2 (0%)', '5/10 (50%)']);
    expect(card().textContent).toContain(asset.competition['team-assembly'].stats['pair-on-slot']);
    expect(card().textContent).toContain(asset.competition['team-assembly'].stats['pair-total']);
    const tags = fixture.debugElement.query(By.css('p-card[aria-labelledby="assembly-double1-title"]')).queryAll(By.directive(Tag));
    expect(tags.map((tag) => tag.injector.get(Tag).severity())).toEqual(['success', 'danger', 'danger', 'success']);
    expect(tags.every((tag) => tag.injector.get(Tag).dt() === undefined)).toBe(true);
    const tooltips = fixture.debugElement.query(By.css('p-card[aria-labelledby="assembly-double1-title"]')).queryAll(By.directive(Tooltip));
    expect(tooltips).toHaveLength(4);
    for (const tooltip of tooltips) {
      const directive = tooltip.injector.get(Tooltip);
      expect(directive.tooltipEvent()).toBe('both');
      expect(directive.content()).toBe(tooltip.nativeElement.getAttribute('aria-label'));
      expect(directive.content()).not.toContain('all.');
    }
    expect(statistics[0].getAttribute('aria-label')).toBe(
      translations.instant('all.competition.team-assembly.stats.tooltip-text', { wins: 3, total: 4, pct: 75 }),
    );
    expect([...card().querySelectorAll('app-assembly-player')].map((row) => row.textContent?.trim())).toEqual(['Test b6', 'Test a6']);
  });

  it('omits absent statistics and pair summaries for a single player', async () => {
    service.double1.set([player('a')]);
    generator.slotPairStats.set(new Map([['double1', new Map([['a:b', { wins: 1, total: 2, winPct: 50 }]])]]));
    await settle();
    expect(card().querySelector('[role="img"]')).toBeNull();
    expect(card().textContent).not.toContain(locales[0].asset.competition['team-assembly'].stats['pair-on-slot']);
  });

  it('leaves mobile selectors and loading gates unchanged', async () => {
    fixture.componentInstance.isMobile.set(true);
    await settle();
    expect(element.querySelector('[aria-labelledby="assembly-double1-title"]')).toBeNull();
    expect(element.querySelectorAll('p-select')).toHaveLength(13);
    fixture.componentInstance.isMobile.set(false);
    service.loading.set(true);
    await settle();
    expect(element.querySelector('[aria-labelledby="assembly-double1-title"]')).toBeNull();
    expect(element.querySelector('p-progressbar')).toBeTruthy();
  });
});
