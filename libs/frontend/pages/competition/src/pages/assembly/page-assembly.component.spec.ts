import { ChangeDetectorRef, Component, input, output, signal, TemplateRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { RankingSystemService } from '@app/frontend-modules-graphql/ranking';
import { Club, Team } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { DocumentNode, getOperationAST } from 'graphql';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AutoComplete } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { Menu } from 'primeng/menu';
import { Select } from 'primeng/select';
import { of } from 'rxjs';
import { AssemblyGeneratorService } from './assembly-generator.service';
import { AssemblyComponent } from './components/assembly/assembly.component';
import { PageAssemblyComponent } from './page-assembly.component';
import { AssemblyService } from './page-assembly.service';

@Component({ selector: 'app-assembly', template: '' })
class AssemblyStubComponent {
  readonly formGroup = input.required<FormGroup>();
  readonly validationOverview = output<{ valid: boolean; template: TemplateRef<HTMLElement> }>();
}

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: { competition: { 'team-assembly': { title: string; season: string; club: string; team: string; encounter: string } } } = JSON.parse(
    readFileSync(assetPath, 'utf8'),
  );
  return { locale, asset };
});

describe('Assembly page heading and filters', () => {
  const club = Object.assign(new Club(), { id: 'club', name: 'Test club', slug: 'test-club' });
  const team = Object.assign(new Team(), { id: 'team', name: 'Test team', type: 'M', teamNumber: 1, season: 2026 });
  let harness: RouterTestingHarness;
  let component: PageAssemblyComponent;
  let loggedIn: ReturnType<typeof signal<boolean>>;
  let service: { formGroup: FormGroup; loadData: jest.Mock };
  let query: jest.Mock;

  beforeEach(async () => {
    loggedIn = signal(false);
    service = {
      formGroup: new FormGroup({
        season: new FormControl(2026),
        club: new FormControl<string | null>(null),
        team: new FormControl<string | null>(null),
        encounter: new FormControl<string | null>(null),
      }),
      loadData: jest.fn(),
    };
    query = jest.fn(({ query: document }: { query: DocumentNode }) => {
      switch (getOperationAST(document)?.name?.value) {
        case 'CompetitionYearsCompetition':
          return of({ data: { competitionEvents: [{ season: 2026 }, { season: 2025 }, { season: 2026 }] } });
        case 'GetClub':
          return of({ data: { club } });
        case 'GetClubs':
          return of({ data: { clubs: [club] } });
        case 'GetTeamsForClub':
          return of({ data: { teams: [team] } });
        case 'GetEncountersForTeam':
          return of({
            data: {
              competitionEncounters: [{ id: 'encounter', date: '2026-10-30T18:00:00Z', homeTeam: team, awayTeam: { name: 'Other team' } }],
            },
          });
        default:
          throw new Error('Unexpected assembly page query');
      }
    });
    await TestBed.configureTestingModule({
      imports: [PageAssemblyComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: 'competition/assembly', component: PageAssemblyComponent }]),
        { provide: Apollo, useValue: { query } },
        { provide: AuthService, useValue: { loggedIn } },
        { provide: RankingSystemService, useValue: { systemId: signal('system') } },
      ],
    })
      .overrideComponent(PageAssemblyComponent, {
        remove: { imports: [AssemblyComponent] },
        add: { imports: [AssemblyStubComponent] },
      })
      .overrideComponent(PageAssemblyComponent, {
        set: {
          providers: [MessageService, { provide: AssemblyService, useValue: service }, { provide: AssemblyGeneratorService, useValue: {} }],
        },
      })
      .compileComponents();
    const translations = TestBed.inject(TranslateService);
    locales.forEach(({ locale, asset }) => translations.setTranslation(locale, { all: asset }));
    translations.use('en');
    harness = await RouterTestingHarness.create();
  });

  async function mount(queryString = ''): Promise<void> {
    component = await harness.navigateByUrl(`/competition/assembly${queryString}`, PageAssemblyComponent);
    await settle();
  }

  async function settle(): Promise<void> {
    await harness.fixture.whenStable();
    harness.fixture.debugElement.query(By.directive(PageAssemblyComponent)).injector.get(ChangeDetectorRef).markForCheck();
    harness.detectChanges();
  }

  function filter(id: string) {
    const element = harness.fixture.debugElement.query(By.css(`p-select[inputId="${id}"]`));
    if (!element) throw new Error(`Missing assembly filter: ${id}`);
    return element;
  }

  it.each(locales)('renders one localized title and named fluid controls in $locale', async ({ locale, asset }) => {
    TestBed.inject(TranslateService).use(locale);
    await mount();
    const element = harness.routeNativeElement;
    const copy = asset.competition['team-assembly'];
    expect(element?.querySelectorAll('h1')).toHaveLength(1);
    expect(element?.querySelector('h1')?.textContent?.trim()).toBe(copy.title);
    expect(element?.querySelector('.t-eyebrow, .assembly-title')).toBeNull();
    expect(element?.querySelector('p-floatlabel')).toBeNull();
    expect([...(element?.querySelectorAll('p-card label') ?? [])].map((label) => label.textContent)).toEqual([
      copy.season,
      copy.club,
      copy.team,
      copy.encounter,
    ]);
    expect(harness.fixture.debugElement.queryAll(By.directive(Card))).toHaveLength(1);
    for (const [id, label] of [
      ['season-select', copy.season],
      ['team-select', copy.team],
      ['encounter-select', copy.encounter],
    ]) {
      const select = filter(id).injector.get(Select);
      expect(select.fluid()).toBe(true);
      expect(select.ariaLabel()).toBe(label);
    }
    expect(harness.fixture.debugElement.query(By.directive(AutoComplete)).injector.get(AutoComplete).fluid()).toBe(true);
    expect(element?.querySelector('label[for="club-select"]')?.textContent).toBe(copy.club);
  });

  it('preserves initial disabled dependencies, seasons and the assembly child form', async () => {
    await mount();
    expect(filter('team-select').injector.get(Select).disabled()).toBe(true);
    expect(filter('encounter-select').injector.get(Select).disabled()).toBe(true);
    expect(component.seasonOptions()).toEqual([
      { label: '2026 - 2027', value: 2026 },
      { label: '2025 - 2026', value: 2025 },
    ]);
    expect(harness.fixture.debugElement.query(By.directive(AssemblyStubComponent)).injector.get(AssemblyStubComponent).formGroup()).toBe(
      service.formGroup,
    );
  });

  it('preserves club search, grouped team selection, encounter selection and clearing', async () => {
    await mount();
    const autocomplete = harness.fixture.debugElement.query(By.directive(AutoComplete));
    autocomplete.triggerEventHandler('completeMethod', { query: 'Test' });
    await settle();
    expect(component.clubSuggestions()).toEqual([club]);
    autocomplete.triggerEventHandler('onSelect', { value: club });
    await settle();
    expect(component.teams()).toEqual([{ type: 'M', teams: [team] }]);
    expect(filter('team-select').injector.get(Select).group()).toBe(true);
    expect(filter('team-select').injector.get(Select).disabled()).toBe(false);
    expect(filter('encounter-select').injector.get(Select).disabled()).toBe(true);
    filter('team-select').triggerEventHandler('ngModelChange', 'team');
    await settle();
    expect(service.formGroup.get('team')?.value).toBe('team');
    expect(service.loadData).toHaveBeenCalledWith();
    expect(component.encounters()[0].label).toContain('Test team vs Other team');
    expect(filter('encounter-select').injector.get(Select).disabled()).toBe(false);
    expect(filter('encounter-select').injector.get(Select).showClear()).toBe(true);
    filter('encounter-select').triggerEventHandler('ngModelChange', 'encounter');
    await settle();
    expect(service.loadData).toHaveBeenLastCalledWith('encounter');
    expect(TestBed.inject(Router).url).toContain('encounter=encounter');
    filter('encounter-select').triggerEventHandler('ngModelChange', null);
    await settle();
    expect(service.formGroup.get('encounter')?.value).toBeNull();
    expect(service.loadData).toHaveBeenLastCalledWith(undefined);
    expect(TestBed.inject(Router).url).not.toContain('encounter=');
    autocomplete.triggerEventHandler('onClear', {});
    await settle();
    expect(component.selectedClub()).toBeNull();
    expect(component.selectedTeamId()).toBeNull();
    expect(component.teams()).toEqual([]);
    expect(component.encounters()).toEqual([]);
    expect(filter('team-select').injector.get(Select).disabled()).toBe(true);
    expect(filter('encounter-select').injector.get(Select).disabled()).toBe(true);
    expect(TestBed.inject(Router).url).not.toMatch(/club=|team=/);
  });

  it('preserves season changes and URL restoration without operational writes', async () => {
    await mount('?season=2026&club=club&team=team&encounter=encounter');
    expect(component.selectedClub()).toEqual(club);
    expect(component.selectedTeamId()).toBe('team');
    expect(component.selectedEncounterId()).toBe('encounter');
    expect(service.loadData).toHaveBeenCalledWith('encounter');
    filter('season-select').triggerEventHandler('ngModelChange', 2025);
    await settle();
    expect(component.selectedSeason()).toBe(2025);
    expect(service.formGroup.get('season')?.value).toBe(2025);
    expect(component.selectedTeamId()).toBeNull();
    expect(component.selectedEncounterId()).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/competition/assembly?season=2025&club=club');
    expect(query).toHaveBeenLastCalledWith(
      expect.objectContaining({
        variables: { args: { where: [{ clubId: { eq: 'club' }, season: { eq: 2025 } }] } },
      }),
    );
  });

  it('preserves download wiring and its busy disabled state', async () => {
    await mount();
    const download = jest.spyOn(component, 'download').mockResolvedValue();
    const button = harness.fixture.debugElement.query(By.directive(Button));
    button.triggerEventHandler('onClick', {});
    expect(download).toHaveBeenCalledTimes(1);
    component.pdfLoading.set(true);
    await settle();
    expect(button.injector.get(Button).loading()).toBe(true);
    expect(button.injector.get(Button).disabled()).toBe(true);
  });

  it('preserves authenticated save visibility and menu wiring without saving', async () => {
    await mount();
    expect(harness.fixture.debugElement.query(By.directive(Menu))).toBeNull();
    loggedIn.set(true);
    await settle();
    const menu = harness.fixture.debugElement.query(By.directive(Menu));
    expect(menu).toBeTruthy();
    expect(harness.fixture.debugElement.queryAll(By.directive(Button))[1].injector.get(Button).ariaLabel()).toBe('Save');
    const toggle = jest.spyOn(menu.injector.get(Menu), 'toggle').mockImplementation();
    harness.fixture.debugElement.queryAll(By.directive(Button))[1].triggerEventHandler('onClick', new MouseEvent('click'));
    expect(toggle).toHaveBeenCalledTimes(1);
    const save = jest.spyOn(component, 'save').mockResolvedValue();
    component.saveMenuItems()[0].command();
    expect(save).toHaveBeenCalledTimes(1);
    component.saveLoading.set(true);
    expect(component.saveMenuItems()[0].disabled).toBe(true);
  });
});
