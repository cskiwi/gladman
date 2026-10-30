import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Player, RankingLastPlace } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { PlayerWithRanking } from '../../page-assembly.service';
import { AssemblyPlayerComponent } from './assembly-player.component';

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: {
    competition: { 'team-assembly': { 'level-exemption': string } };
    v1: { teamFormation: { errors: { 'comp-status': string } } };
  } = JSON.parse(readFileSync(assetPath, 'utf8'));
  return { locale, asset };
});

describe('AssemblyPlayerComponent', () => {
  let fixture: ComponentFixture<AssemblyPlayerComponent>;
  let player: PlayerWithRanking;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssemblyPlayerComponent, TranslateModule.forRoot()],
    }).compileComponents();
    player = Object.assign(new Player(), {
      id: 'synthetic-player',
      firstName: 'Test',
      lastName: 'Player',
      competitionPlayer: true,
      rankingLastPlaces: [Object.assign(new RankingLastPlace(), { single: 4, double: 6, mix: 8 })],
    });
    fixture = TestBed.createComponent(AssemblyPlayerComponent);
    fixture.componentRef.setInput('player', player);
    fixture.componentRef.setInput('eventType', 'M');
  });

  it.each([
    ['M', undefined, '4 - 6'],
    ['F', undefined, '4 - 6'],
    ['MX', undefined, '4 - 6 - 8'],
    ['M', 'single1', '4'],
    ['F', 'single4', '4'],
    ['MX', 'single2', '4'],
    ['M', 'double3', '6'],
    ['F', 'double4', '6'],
    ['MX', 'double1', '6'],
    ['MX', 'double2', '6'],
    ['MX', 'double3', '8'],
    ['MX', 'double4', '8'],
  ])('preserves %s / %s ranking selection', (eventType, showType, expected) => {
    fixture.componentRef.setInput('eventType', eventType);
    fixture.componentRef.setInput('showType', showType);
    fixture.detectChanges();
    expect(fixture.componentInstance.ranking()).toBe(expected);
    expect(fixture.nativeElement.textContent).toContain('Test Player');
    expect(fixture.nativeElement.textContent).toContain(expected);
    expect(fixture.debugElement.queryAll(By.directive(Tag))).toHaveLength(0);
  });

  it('updates names, rankings and default competition status when the input changes', () => {
    fixture.detectChanges();
    fixture.componentRef.setInput('player', Object.assign(new Player(), { firstName: 'New', lastName: 'Name' }));
    fixture.componentRef.setInput('eventType', 'MX');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('New Name');
    expect(fixture.componentInstance.ranking()).toBe('12 - 12 - 12');
    expect(fixture.debugElement.queryAll(By.directive(Tag))).toHaveLength(0);
    fixture.componentRef.setInput('showType', 'single1');
    fixture.detectChanges();
    expect(fixture.componentInstance.ranking()).toBe('12');
  });

  it('uses 12 only for missing ranks and preserves zero', () => {
    fixture.componentRef.setInput('player', {
      ...player,
      rankingLastPlaces: [Object.assign(new RankingLastPlace(), { single: 0, double: undefined, mix: 7 })],
    });
    fixture.componentRef.setInput('eventType', 'MX');
    fixture.detectChanges();
    expect(fixture.componentInstance.ranking()).toBe('0 - 12 - 7');
  });

  it.each(locales)('names both native warning tags and resolves real $locale copy', ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    fixture.componentRef.setInput('player', { ...player, competitionPlayer: false });
    fixture.componentRef.setInput('levelException', true);
    fixture.detectChanges();
    const expected = [
      asset.v1.teamFormation.errors['comp-status'].replace('{playerFullName}', 'Test Player'),
      asset.competition['team-assembly']['level-exemption'],
    ];
    const tags = fixture.debugElement.queryAll(By.directive(Tag));
    expect(tags).toHaveLength(2);
    tags.forEach((element, index) => {
      expect(element.injector.get(Tag).severity()).toBe('warn');
      expect(element.nativeElement.getAttribute('role')).toBe('img');
      expect(element.nativeElement.getAttribute('tabindex')).toBe('0');
      expect(element.nativeElement.getAttribute('aria-label')).toBe(expected[index]);
      const tooltip = element.injector.get(Tooltip);
      expect(tooltip.content()).toBe(expected[index]);
      expect(tooltip.tooltipEvent()).toBe('both');
    });
    expect(expected.join()).not.toMatch(/\{|all\./);
  });

  it('updates warning copy on language and player changes and removes retired statuses', () => {
    const translations = TestBed.inject(TranslateService);
    locales.forEach(({ locale, asset }) => translations.setTranslation(locale, { all: asset }));
    translations.use('en');
    fixture.componentRef.setInput('player', { ...player, competitionPlayer: false });
    fixture.componentRef.setInput('levelException', true);
    fixture.detectChanges();
    translations.use('fr_BE');
    fixture.componentRef.setInput('player', { ...player, firstName: 'Updated', competitionPlayer: false });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p-tag').getAttribute('aria-label')).toBe(
      locales[2].asset.v1.teamFormation.errors['comp-status'].replace('{playerFullName}', 'Updated Player'),
    );
    fixture.componentRef.setInput('player', player);
    fixture.componentRef.setInput('levelException', false);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.directive(Tag))).toHaveLength(0);
  });
});
