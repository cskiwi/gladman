import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { Player } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AssemblyGeneratorService } from '../../assembly-generator.service';
import { AssemblyService } from '../../page-assembly.service';
import { AssemblyComponent } from './assembly.component';

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: { competition: { 'team-assembly': { 'auto-generate': Record<string, string> } } } = JSON.parse(readFileSync(assetPath, 'utf8'));
  return { locale, asset };
});

describe('Assembly time-range translations', () => {
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, 'matchMedia');
  let fixture: ComponentFixture<AssemblyComponent>;
  let loadStats: jest.SpyInstance;

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
              throw new Error('Unexpected assembly translation test query');
            }),
          },
        },
      ],
    }).compileComponents();
    const generator = TestBed.inject(AssemblyGeneratorService);
    loadStats = jest.spyOn(generator, 'loadStats').mockResolvedValue();
    generator.pairStats.set([
      {
        player1: Object.assign(new Player(), { id: 'one', firstName: 'Test', lastName: 'One' }),
        player2: Object.assign(new Player(), { id: 'two', firstName: 'Test', lastName: 'Two' }),
        wins: 1,
        total: 2,
        winPct: 50,
      },
    ]);
    const service = TestBed.inject(AssemblyService);
    service.loaded.set(true);
    fixture = TestBed.createComponent(AssemblyComponent);
    fixture.componentRef.setInput('formGroup', service.formGroup);
    fixture.componentInstance.isMobile.set(false);
  });

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it.each(locales)('renders translated selected values, all options and generation copy in $locale', async ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    await settle();
    const copy = asset.competition['team-assembly']['auto-generate'];
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain(copy['title']);
    for (const key of ['variations', 'best-results', 'random', 'clear']) {
      expect(element.textContent).toContain(copy[key]);
    }

    for (const selector of ['p-select[inputId="time-range-select"]', 'app-partner-combinations p-select']) {
      const select = fixture.debugElement.query(By.css(selector));
      expect(select).toBeTruthy();
      expect(select.nativeElement.querySelector('[role="combobox"]').textContent.trim()).toBe(copy['both-seasons']);
      expect(select.nativeElement.querySelector('[role="combobox"]').getAttribute('aria-label')).toBe(copy['time-range']);
      select.nativeElement.querySelector('[role="combobox"]').click();
      await settle();
      const options = [...select.nativeElement.querySelectorAll('[role="option"]')] as HTMLElement[];
      expect(options.map((option) => option.textContent?.trim())).toEqual([
        copy['both-seasons'],
        copy['this-season'],
        copy['last-season'],
        copy['last-x-weeks'],
      ]);
      options[1].click();
      await settle();
      expect(select.nativeElement.querySelector('[role="combobox"]').textContent.trim()).toBe(copy['this-season']);
      expect(select.nativeElement.textContent).not.toContain('all.competition.team-assembly.auto-generate.');
    }
    expect(loadStats).toHaveBeenCalled();
  });
});
