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
import { ButtonDirective } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { AssemblyGeneratorService } from '../../assembly-generator.service';
import { AssemblyService, PlayerWithRanking } from '../../page-assembly.service';
import { AssemblyComponent } from './assembly.component';

type PoolCopy = {
  competition: {
    'team-assembly': {
      players: { title: string; backup: string };
      'select-all': string;
      'auto-generate': { 'player-joining': string };
    };
  };
  team: { 'no-players': string };
};

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: PoolCopy = JSON.parse(readFileSync(assetPath, 'utf8'));
  return { locale, asset };
});

function player(id: string): PlayerWithRanking {
  return Object.assign(new Player(), {
    id,
    firstName: 'Test',
    lastName: id,
    rankingLastPlaces: [Object.assign(new RankingLastPlace(), { single: 4, double: 6, mix: 8 })],
  });
}

describe('Assembly desktop player pool', () => {
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  let fixture: ComponentFixture<AssemblyComponent>;
  let service: AssemblyService;
  let element: HTMLElement;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(() => true),
      }),
    });
  });

  afterAll(() => {
    if (originalMatchMedia) Object.defineProperty(window, 'matchMedia', originalMatchMedia);
    else Reflect.deleteProperty(window, 'matchMedia');
  });

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
              throw new Error('Unexpected assembly pool test query');
            }),
          },
        },
      ],
    }).compileComponents();
    jest.spyOn(TestBed.inject(AssemblyGeneratorService), 'loadStats').mockResolvedValue();
    service = TestBed.inject(AssemblyService);
    service.loaded.set(true);
    service.type.set('M');
    service.players.set({ REGULAR: [player('regular')], BACKUP: [player('backup')] });
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

  function pool(): HTMLElement {
    const card = element.querySelector<HTMLElement>('p-card[aria-labelledby="assembly-pool-title"]');
    if (!card) throw new Error('Missing desktop player pool');
    return card;
  }

  function checkboxes(): HTMLInputElement[] {
    return [...pool().querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];
  }

  function disclosure(): HTMLButtonElement {
    const button = pool().querySelector<HTMLButtonElement>('button[aria-controls="assembly-backup-players"]');
    if (!button) throw new Error('Missing backup disclosure');
    return button;
  }

  it.each(locales)('names the region, controls and empty state in $locale', async ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    await settle();
    const copy = asset.competition['team-assembly'];
    expect(pool().getAttribute('role')).toBe('region');
    expect(pool().querySelector('h2')?.textContent?.trim()).toBe(copy.players.title);
    expect(checkboxes()[0].getAttribute('aria-label')).toBe(copy['select-all']);
    expect(checkboxes()[1].getAttribute('aria-label')).toBe(`${copy['auto-generate']['player-joining']}: Test regular`);
    expect(disclosure().textContent?.trim()).toBe(copy.players.backup);
    disclosure().click();
    await settle();
    expect(checkboxes()[2].getAttribute('aria-label')).toBe(`${copy['auto-generate']['player-joining']}: Test backup`);
    service.players.set({ REGULAR: [], BACKUP: [] });
    await settle();
    expect(pool().textContent).toContain(asset.team['no-players']);
    expect(pool().textContent).not.toContain('all.');
  });

  it('preserves ordered rows, ranks and CDK pool data including hidden backups', async () => {
    service.players.set({ REGULAR: [player('regular'), player('second')], BACKUP: [player('backup')] });
    await settle();
    const list = fixture.debugElement.query(By.css('#playerList')).injector.get(CdkDropList);
    expect(list.id).toBe('playerList');
    expect(list.data.map((item: PlayerWithRanking) => item.id)).toEqual(['regular', 'second', 'backup']);
    expect(list.connectedTo).toEqual(fixture.componentInstance.lists);
    expect(list.sortingDisabled).toBe(true);
    disclosure().click();
    await settle();
    const rows = [...pool().querySelectorAll('app-assembly-player')];
    expect(rows.map((row) => row.textContent?.trim())).toEqual(['Test regular4 - 6', 'Test second4 - 6', 'Test backup4 - 6']);
    const drags = fixture.debugElement.query(By.css('#playerList')).queryAll(By.directive(CdkDrag));
    expect(drags.map((drag) => drag.injector.get(CdkDrag).data.id)).toEqual(['regular', 'second', 'backup']);
  });

  it('selects and deselects all players including collapsed backups', async () => {
    expect(service.showBackup()).toBe(false);
    checkboxes()[0].click();
    await settle();
    expect(service.availablePlayers()).toEqual([]);
    expect(checkboxes().every((checkbox) => !checkbox.checked)).toBe(true);
    checkboxes()[0].click();
    await settle();
    expect(service.availablePlayers().map((item) => item.id)).toEqual(['regular', 'backup']);
    expect(checkboxes().every((checkbox) => checkbox.checked)).toBe(true);
  });

  it('updates individual regular and backup availability without changing membership or slots', async () => {
    const membership = service.players();
    disclosure().click();
    await settle();
    checkboxes()[1].click();
    await settle();
    expect(service.availablePlayers().map((item) => item.id)).toEqual(['backup']);
    expect(checkboxes().map((checkbox) => checkbox.checked)).toEqual([false, false, true]);
    checkboxes()[2].click();
    await settle();
    expect(service.availablePlayers()).toEqual([]);
    expect(service.players()).toBe(membership);
    expect(service.double1()).toEqual([]);
    expect(service.formGroup.get('double1')?.value).toEqual([]);
  });

  it('uses a non-submit disclosure with expanded state and a persistent controlled region', async () => {
    const button = disclosure();
    const region = pool().querySelector<HTMLElement>('#assembly-backup-players');
    if (!region) throw new Error('Missing controlled backup region');
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(region.hidden).toBe(true);
    button.click();
    await settle();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(region.hidden).toBe(false);
    expect(checkboxes()).toHaveLength(3);
    button.click();
    await settle();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(region.hidden).toBe(true);
    expect(checkboxes()).toHaveLength(2);
    expect(service.availablePlayers()).toHaveLength(2);
  });

  it('keeps native controls free of per-instance design-token overrides', async () => {
    disclosure().click();
    await settle();
    const card = fixture.debugElement.query(By.css('p-card[aria-labelledby="assembly-pool-title"]'));
    const controls = card.queryAll(By.directive(Checkbox));
    expect(controls).toHaveLength(3);
    for (const control of controls) {
      expect(control.injector.get(Checkbox).dt()).toBeUndefined();
    }
    expect(card.query(By.directive(ButtonDirective)).injector.get(ButtonDirective).dt()).toBeUndefined();
  });

  it('omits the disclosure without backups and shows an explicit empty state', async () => {
    service.players.set({ REGULAR: [], BACKUP: [] });
    await settle();
    expect(pool().querySelector('button[aria-controls="assembly-backup-players"]')).toBeNull();
    expect(pool().querySelector('p-message')?.textContent?.trim()).toBe(locales[0].asset.team['no-players']);
    expect(fixture.componentInstance.allPlayersSelected()).toBe(false);
    const list = fixture.debugElement.query(By.css('#playerList')).injector.get(CdkDropList);
    expect(list.data).toEqual([]);
  });

  it('retains the unchanged mobile branch without mounting the desktop pool', async () => {
    fixture.componentInstance.isMobile.set(true);
    await settle();
    expect(element.querySelector('#playerList')).toBeNull();
    expect(element.querySelectorAll('p-select')).toHaveLength(13);
    expect(element.querySelector('app-assembly-player')).toBeNull();
  });

  it('keeps the existing loading and unloaded gates', async () => {
    service.loading.set(true);
    await settle();
    expect(element.querySelector('#playerList')).toBeNull();
    expect(element.querySelector('p-progressbar')).toBeTruthy();
    service.loading.set(false);
    service.loaded.set(false);
    await settle();
    expect(element.querySelector('#playerList')).toBeNull();
    expect(element.querySelector('p-progressbar')).toBeNull();
  });
});
