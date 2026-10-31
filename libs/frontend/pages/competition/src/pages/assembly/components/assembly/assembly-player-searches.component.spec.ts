import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { Player } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AutoComplete } from 'primeng/autocomplete';
import { AssemblyGeneratorService } from '../../assembly-generator.service';
import { AssemblyService, PlayerWithRanking } from '../../page-assembly.service';
import { AssemblyComponent } from './assembly.component';

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: {
    competition: { 'team-assembly': { captain: string; 'change-team': string; players: { title: string } } };
    club: { teamBuilder: { addPlayer: string } };
    button: { edit: string };
  } = JSON.parse(readFileSync(assetPath, 'utf8'));
  return { locale, asset };
});

describe.each([false, true])('Assembly player searches (mobile: %s)', (mobile) => {
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  let fixture: ComponentFixture<AssemblyComponent>;
  let service: AssemblyService;
  let element: HTMLElement;
  let regular: PlayerWithRanking;
  let backup: PlayerWithRanking;

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
              throw new Error('Unexpected player-search test query');
            }),
          },
        },
      ],
    }).compileComponents();
    jest.spyOn(TestBed.inject(AssemblyGeneratorService), 'loadStats').mockResolvedValue();
    service = TestBed.inject(AssemblyService);
    jest.spyOn(service, 'validate').mockResolvedValue();
    regular = Object.assign(new Player(), { id: 'regular', firstName: 'Alex', lastName: 'Regular', gender: 'M', competitionPlayer: true });
    backup = Object.assign(new Player(), { id: 'backup', firstName: 'Alex', lastName: 'Backup', gender: 'M', competitionPlayer: true });
    service.loaded.set(true);
    service.type.set('M');
    service.players.set({ REGULAR: [regular], BACKUP: [backup] });
    fixture = TestBed.createComponent(AssemblyComponent);
    fixture.componentRef.setInput('formGroup', service.formGroup);
    fixture.componentInstance.isMobile.set(mobile);
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

  function autocomplete(id: string): AutoComplete {
    const match = fixture.debugElement.queryAll(By.directive(AutoComplete)).find((node) => node.componentInstance.inputId() === id);
    if (!match) throw new Error(`Missing AutoComplete ${id}`);
    return match.componentInstance;
  }

  function input(id: string): HTMLInputElement {
    const result = element.querySelector<HTMLInputElement>(`#${id}`);
    if (!result) throw new Error(`Missing input ${id}`);
    return result;
  }

  async function search(id: string, query: string): Promise<void> {
    const control = input(id);
    control.focus();
    control.value = query;
    control.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, autocomplete(id).delay() + 20));
    await settle();
  }

  it.each(locales)('associates unique localized labels and native options in $locale', async ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    await settle();
    expect(element.querySelectorAll('p-autocomplete')).toHaveLength(2);
    for (const [id, label] of [
      ['assembly-captain', asset.competition['team-assembly'].captain],
      ['assembly-add-player', asset.club.teamBuilder.addPlayer],
    ]) {
      expect(element.querySelectorAll(`#${id}`)).toHaveLength(1);
      expect(input(id).labels?.[0]?.textContent?.trim()).toBe(label);
      const control = autocomplete(id);
      expect(control.optionLabel()).toBe(fixture.componentInstance.playerOptionLabel);
      expect(control.getOptionLabel(regular)).toBe('Alex Regular');
      expect(control.forceSelection()).toBe(true);
      expect(control.fluid()).toBe(true);
      expect(input(id).getAttribute('role')).toBe('combobox');
    }
    expect(element.querySelectorAll('label[for^="assembly-"]')).toHaveLength(2);
  });

  it.each(['assembly-captain', 'assembly-add-player'])('searches both pools by name and exposes an empty result in %s', async (id) => {
    await search(id, 'aLeX');
    expect(autocomplete(id).suggestions()).toEqual([regular, backup]);
    expect([...element.querySelectorAll('[role="option"]')].map((node) => node.textContent?.trim())).toEqual(['Alex Regular', 'Alex Backup']);
    expect([...element.querySelectorAll('[role="option"]')].map((node) => node.getAttribute('aria-label'))).toEqual(['Alex Regular', 'Alex Backup']);
    await search(id, 'bAcKuP');
    expect(autocomplete(id).suggestions()).toEqual([backup]);
    await search(id, 'missing');
    expect(autocomplete(id).suggestions()).toEqual([]);
    expect(element.querySelector('.p-autocomplete-empty-message')?.textContent?.trim()).toBe('No results found');
  });

  it('selects a native captain suggestion, displays its name and stores its ID only', async () => {
    await search('assembly-captain', 'alex');
    const options = element.querySelectorAll<HTMLElement>('[role="option"]');
    options[1].click();
    await settle();
    expect(service.formGroup.get('captain')?.value).toBe(backup.id);
    expect(input('assembly-captain').value).toBe('Alex Backup');
    expect(input('assembly-add-player').value).toBe('');
  });

  it('dispatches the selected player object once without changing captain', async () => {
    const add = jest.spyOn(service, 'addPlayer').mockImplementation();
    service.formGroup.get('captain')?.setValue('existing-captain');
    await search('assembly-add-player', 'regular');
    element.querySelector<HTMLElement>('[role="option"]')?.click();
    await settle();
    expect(add).toHaveBeenCalledTimes(1);
    expect(add).toHaveBeenCalledWith(regular);
    expect(input('assembly-add-player').value).toBe('Alex Regular');
    expect(service.formGroup.get('captain')?.value).toBe('existing-captain');
  });

  it.each(['assembly-captain', 'assembly-add-player'])('clears unmatched text without dispatching from %s', async (id) => {
    const captain = jest.spyOn(fixture.componentInstance, 'selectCaptain');
    const add = jest.spyOn(service, 'addPlayer').mockImplementation();
    await search(id, 'missing');
    input(id).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' }));
    await new Promise((resolve) => setTimeout(resolve, 20));
    input(id).dispatchEvent(new Event('change'));
    input(id).dispatchEvent(new Event('blur'));
    await settle();
    expect(input(id).value).toBe('');
    expect(captain).not.toHaveBeenCalled();
    expect(add).not.toHaveBeenCalled();
  });

  it('switches responsive branches without duplicate inputs and keeps local searches usable', async () => {
    await search('assembly-captain', 'regular');
    fixture.componentInstance.isMobile.set(!mobile);
    await settle();
    expect(element.querySelectorAll('#assembly-captain')).toHaveLength(1);
    expect(element.querySelectorAll('#assembly-add-player')).toHaveLength(1);
    expect(input('assembly-captain').compareDocumentPosition(input('assembly-add-player')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    await search('assembly-add-player', 'backup');
    expect(autocomplete('assembly-add-player').suggestions()).toEqual([backup]);
    expect(element.querySelectorAll('p-select')).toHaveLength(mobile ? 1 : 13);
  });

  it('uses the desktop Card presentation for both searches while preserving responsive grouping', () => {
    const captain = input('assembly-captain');
    const add = input('assembly-add-player');
    const pool = element.querySelector(`p-card[aria-labelledby="${mobile ? 'assembly-mobile-player-pool-title' : 'assembly-pool-title'}"]`);
    expect(pool).not.toBeNull();
    expect(captain.closest('p-card')).not.toBe(pool);
    expect(captain.closest('p-card')?.getAttribute('aria-label')).toBe(locales[0].asset.competition['team-assembly'].captain);
    expect(add.closest('p-card')).toBe(pool);
    expect(pool?.querySelector('h2')?.textContent?.trim()).toBe(locales[0].asset.competition['team-assembly'].players.title);
    expect(captain.closest('p-card')?.querySelectorAll('p-card')).toHaveLength(0);
    expect(add.closest('p-card')?.querySelectorAll('p-card')).toHaveLength(0);
    if (mobile) {
      expect(element.querySelector('#playerList')).toBeNull();
      expect(element.querySelectorAll('p-select')).toHaveLength(13);
      const substitutes = element.querySelector('p-card[aria-labelledby="assembly-mobile-substitutes-title"]');
      if (!substitutes) throw new Error('Missing mobile substitutes Card');
      expect(captain.compareDocumentPosition(substitutes) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(substitutes.compareDocumentPosition(add) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    } else {
      const list = element.querySelector('#playerList');
      if (!list) throw new Error('Missing grouped player list');
      expect(captain.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      if (!pool) throw new Error('Missing player Card');
      expect(captain.compareDocumentPosition(pool) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(list.compareDocumentPosition(add) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(list.contains(captain)).toBe(false);
      expect(list.contains(add)).toBe(false);
    }
  });

  it.each([false, true])('keeps native change-team guidance gated by desktop permission (%s)', async (permitted) => {
    fixture.destroy();
    jest.spyOn(TestBed.inject(AuthService), 'hasAnyPermission').mockReturnValue(permitted);
    service.formGroup.get('club')?.setValue('test-club');
    fixture = TestBed.createComponent(AssemblyComponent);
    fixture.componentRef.setInput('formGroup', service.formGroup);
    fixture.componentInstance.isMobile.set(mobile);
    element = fixture.nativeElement;
    await settle();

    const guidance = element.querySelector('#assembly-change-team-description');
    if (mobile || !permitted) {
      expect(guidance).toBeNull();
      return;
    }
    expect(guidance?.textContent?.trim()).toBe(locales[0].asset.competition['team-assembly']['change-team']);
    const card = guidance?.closest('p-card');
    expect(card?.getAttribute('role')).toBe('region');
    expect(card?.getAttribute('aria-label')).toBe(locales[0].asset.button.edit);
    expect(card?.getAttribute('aria-describedby')).toBe('assembly-change-team-description');
    expect(card?.classList.contains('bg-emphasis')).toBe(false);
    const button = card?.querySelector('button');
    expect(button?.textContent?.trim()).toBe(locales[0].asset.button.edit);
    expect(button?.classList.contains('p-button-outlined')).toBe(true);
    expect(button?.classList.contains('p-button-secondary')).toBe(true);
    const add = jest.spyOn(service, 'addPlayer').mockImplementation();
    const captain = service.formGroup.get('captain')?.value;
    button?.click();
    await settle();
    expect(service.formGroup.get('captain')?.value).toBe(captain);
    expect(add).not.toHaveBeenCalled();
    expect(TestBed.inject(AuthService).hasAnyPermission).toHaveBeenCalledWith(['test-club_edit:team', 'edit-any:club']);
  });
});
