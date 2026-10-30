import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { Player } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { AssemblyGeneratorService } from '../../assembly-generator.service';
import { AssemblyService, ValidationResult } from '../../page-assembly.service';
import { AssemblyComponent } from './assembly.component';

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: {
    competition: { 'team-assembly': { players: { base: string; team: string }; 'level-exemption': string } };
  } = JSON.parse(readFileSync(assetPath, 'utf8'));
  return { locale, asset };
});

describe('Assembly player summaries', () => {
  let fixture: ComponentFixture<AssemblyComponent>;
  let service: AssemblyService;
  let element: HTMLElement;
  let result: ValidationResult;
  let exception: jest.SpyInstance;

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
              throw new Error('Unexpected player-summary test query');
            }),
          },
        },
      ],
    }).compileComponents();
    jest.spyOn(TestBed.inject(AssemblyGeneratorService), 'loadStats').mockResolvedValue();
    service = TestBed.inject(AssemblyService);
    exception = jest.spyOn(service, 'isException').mockImplementation((id) => id === 'base-b');
    service.loaded.set(true);
    service.type.set('M');
    result = {
      baseTeamIndex: 24,
      titularsIndex: 18,
      baseTeamPlayers: [
        Object.assign(new Player(), { id: 'base-a', firstName: 'Synthetic', lastName: 'Alpha', single: 6, double: 7, mix: 8 }),
        Object.assign(new Player(), { id: 'base-b', firstName: 'Synthetic', lastName: 'Beta', single: 5, double: 6, mix: 7 }),
      ],
      titularsPlayers: [Object.assign(new Player(), { id: 'titular-a', firstName: 'Synthetic', lastName: 'Gamma', single: 4, double: 5, mix: 6 })],
      valid: true,
      errors: [],
      warnings: [],
    };
    service.validationResult.set(result);
    const translations = TestBed.inject(TranslateService);
    locales.forEach(({ locale, asset }) => translations.setTranslation(locale, { all: asset }));
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

  function summary(id = 'assembly-base-title'): HTMLElement {
    const card = element.querySelector<HTMLElement>(`p-card[aria-labelledby="${id}"]`);
    if (!card) throw new Error(`Missing summary ${id}`);
    return card;
  }

  function text(node: Element | null): string {
    if (!node) throw new Error('Missing summary content');
    return node.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  }

  it.each(locales)('names both native regions and exemptions in $locale', async ({ locale, asset }) => {
    TestBed.inject(TranslateService).use(locale);
    await settle();
    for (const [id, label] of [
      ['assembly-base-title', asset.competition['team-assembly'].players.base],
      ['assembly-titulars-title', asset.competition['team-assembly'].players.team],
    ]) {
      const card = summary(id);
      expect(card.getAttribute('role')).toBe('region');
      expect(card.querySelector('h2')?.textContent?.trim()).toBe(label);
      expect(element.querySelectorAll(`#${id}`)).toHaveLength(1);
      expect(card.querySelector('ul')?.getAttribute('role')).toBe('list');
      const debugCard = fixture.debugElement.query(By.css(`p-card[aria-labelledby="${id}"]`));
      expect(debugCard.injector.get(Card).dt()).toBeUndefined();
    }
    const tag = summary().querySelector('p-tag');
    expect(tag?.getAttribute('aria-label')).toBe(asset.competition['team-assembly']['level-exemption']);
    expect(tag?.getAttribute('role')).toBe('img');
    expect(tag?.getAttribute('tabindex')).toBe('0');
    const debugTag = fixture.debugElement.query(By.css('p-card[aria-labelledby="assembly-base-title"] p-tag'));
    expect(debugTag.injector.get(Tag).severity()).toBe('warn');
    expect(debugTag.injector.get(Tag).icon()).toBe('pi pi-lock');
    expect(debugTag.injector.get(Tooltip).tooltipEvent()).toBe('both');
    expect(debugTag.injector.get(Tooltip).content()).toBe(asset.competition['team-assembly']['level-exemption']);
  });

  it.each(['M', 'F', 'MX'])('preserves ordered validation rankings and sums for %s', async (type) => {
    service.type.set(type);
    await settle();
    const mixed = type === 'MX';
    const rows = [...summary().querySelectorAll('li')].map(text);
    expect(rows).toEqual([
      `Synthetic Alpha 6 - 7${mixed ? ' - 8' : ''} (${mixed ? 21 : 13})`,
      `Synthetic Beta 5 - 6${mixed ? ' - 7' : ''} (${mixed ? 18 : 11})`,
    ]);
    expect(text(summary().querySelector('p'))).toBe('Index: 24');
    const titulars = summary('assembly-titulars-title');
    expect(text(titulars.querySelector('li'))).toBe(`Synthetic Gamma 4 - 5${mixed ? ' - 6' : ''} (${mixed ? 15 : 9})`);
    expect(text(titulars.querySelector('p'))).toBe('Index: 18');
    expect(titulars.querySelector('p-tag')).toBeNull();
    expect(exception).toHaveBeenCalledWith('base-b');
  });

  it('updates both summaries without stale names, exemptions or index values', async () => {
    service.validationResult.set({
      ...result,
      baseTeamIndex: 0,
      titularsIndex: 0,
      baseTeamPlayers: [Object.assign(new Player(), { id: 'zero', firstName: 'New', lastName: 'Zero', single: 0, double: 0, mix: 0 })],
      titularsPlayers: [],
    });
    await settle();
    expect(text(summary().querySelector('li'))).toBe('New Zero 0 - 0 (0)');
    expect(text(summary().querySelector('p'))).toBe('Index: 0');
    expect(summary().querySelector('p-tag')).toBeNull();
    expect(summary('assembly-titulars-title').querySelector('li')).toBeNull();
    expect(text(summary('assembly-titulars-title').querySelector('p'))).toBe('Index: 0');
    expect(text(summary())).not.toContain('Synthetic');
  });

  it('keeps empty validation summaries explicit without fabricating players', async () => {
    service.validationResult.set(null);
    await settle();
    for (const id of ['assembly-base-title', 'assembly-titulars-title']) {
      expect(summary(id).querySelector('li')).toBeNull();
      expect(text(summary(id).querySelector('p'))).toBe('Index: 0');
      expect(summary(id).querySelector('h2')).not.toBeNull();
    }
  });

  it('retains the same summary content in both responsive branches', async () => {
    const before = text(summary());
    fixture.componentInstance.isMobile.set(true);
    await settle();
    expect(text(summary())).toBe(before);
    expect(element.querySelectorAll('p-select')).toHaveLength(13);
    fixture.componentInstance.isMobile.set(false);
    await settle();
    expect(text(summary())).toBe(before);
    expect(element.querySelector('#playerList')).not.toBeNull();
  });

  it('does not render summaries while loading or before a lineup is loaded', async () => {
    service.loading.set(true);
    await settle();
    expect(element.querySelector('#assembly-base-title')).toBeNull();
    expect(element.querySelector('p-progressbar')).not.toBeNull();
    service.loading.set(false);
    service.loaded.set(false);
    await settle();
    expect(element.querySelector('#assembly-titulars-title')).toBeNull();
    expect(element.querySelector('p-progressbar')).toBeNull();
  });
});
