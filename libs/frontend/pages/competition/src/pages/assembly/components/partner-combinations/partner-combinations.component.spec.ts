import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Player } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Fieldset } from 'primeng/fieldset';
import { Table } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { AssemblyGeneratorService, PairStat, TimeRange } from '../../assembly-generator.service';
import { PartnerCombinationsComponent } from './partner-combinations.component';

const locales = ['en', 'nl_BE', 'fr_BE'].map((locale) => {
  const assetPath = join(__dirname, '..', '..', '..', '..', '..', '..', '..', '..', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
  const asset: {
    competition: { 'team-assembly': { 'auto-generate': Record<string, string>; stats: Record<string, string> } };
  } = JSON.parse(readFileSync(assetPath, 'utf8'));
  return { locale, asset };
});

function pair(index: number, winPct = 50): PairStat {
  return {
    player1: Object.assign(new Player(), { id: `first-${index}`, firstName: 'Alex', lastName: `Example ${index}` }),
    player2: Object.assign(new Player(), { id: `second-${index}`, firstName: 'Sam', lastName: `Demonstration ${index}` }),
    total: index + 2,
    wins: 1,
    winPct,
  };
}

describe('Assembly partner combinations', () => {
  let fixture: ComponentFixture<PartnerCombinationsComponent>;
  let element: HTMLElement;
  const generator = {
    pairStats: signal<PairStat[]>([]),
    loadingStats: signal(false),
    loadStats: jest.fn<Promise<void>, [TimeRange, number, boolean]>(),
  };

  beforeEach(async () => {
    generator.pairStats.set([pair(0), pair(1, 49)]);
    generator.loadingStats.set(false);
    generator.loadStats.mockReset().mockResolvedValue();
    await TestBed.configureTestingModule({
      imports: [PartnerCombinationsComponent, TranslateModule.forRoot()],
      providers: [{ provide: AssemblyGeneratorService, useValue: generator }],
    }).compileComponents();
    fixture = TestBed.createComponent(PartnerCombinationsComponent);
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

  function required<T extends Element>(selector: string): T {
    const result = element.querySelector<T>(selector);
    if (!result) throw new Error(`Missing ${selector}`);
    return result;
  }

  function table(): Table<PairStat> {
    return fixture.debugElement.query(By.directive(Table)).componentInstance;
  }

  function rows(): HTMLTableRowElement[] {
    return [...element.querySelectorAll<HTMLTableRowElement>('tbody tr')];
  }

  async function filter(query: string): Promise<void> {
    const search = required<HTMLInputElement>('#partner-search');
    search.value = query;
    search.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, table().filterDelay() + 1));
    await settle();
  }

  it.each(locales)('names the disclosure, controls and statistics in $locale', async ({ locale, asset }) => {
    const translations = TestBed.inject(TranslateService);
    translations.setTranslation(locale, { all: asset });
    translations.use(locale);
    fixture.componentInstance.selectedTimeRange.set('last-weeks');
    await settle();
    const copy = asset.competition['team-assembly'];
    expect(required('.p-fieldset-toggle-button').getAttribute('aria-label')).toBe(copy.stats['partners-title']);
    expect(required('[role="combobox"]').getAttribute('aria-label')).toBe(copy['auto-generate']['time-range']);
    expect(required('#partner-weeks').getAttribute('aria-label')).toBe(copy['auto-generate']['weeks']);
    expect(required('#partner-search').getAttribute('aria-label')).toBe(copy.stats['search']);
    expect(required('#partner-search').getAttribute('placeholder')).toBe(copy.stats['search']);
    expect(required('button[pButton]').getAttribute('aria-label')).toBe(copy.stats['refresh']);
    expect(required('button[pButton]').textContent?.trim()).toBe('');
    expect(element.querySelector('label')).toBeNull();
    const tooltip = fixture.debugElement.query(By.css('button[pButton]')).injector.get(Tooltip);
    expect(tooltip.content()).toBe(copy.stats['refresh']);
    expect(tooltip.tooltipEvent()).toBe('both');
    expect(required<HTMLButtonElement>('button[pButton]').type).toBe('button');
    const tags = fixture.debugElement.queryAll(By.directive(Tag));
    expect(tags.map((item) => item.injector.get(Tag).severity())).toEqual(['danger', 'success']);
    expect(tags.map((item) => item.injector.get(Tag).value())).toEqual(['49%', '50%']);
    expect(required('p-tag').getAttribute('aria-label')).toBe(
      copy.stats['tooltip-text'].replace('{{wins}}', '1').replace('{{total}}', '3').replace('{{pct}}', '49'),
    );
    expect(element.textContent).not.toContain('all.');
    expect(element.querySelector('p-button')).toBeNull();
    expect([...element.querySelectorAll('th')].every((header) => header.scope === 'col')).toBe(true);
  });

  it.each<TimeRange>(['both-seasons', 'season', 'last-season', 'last-weeks'])(
    'preserves %s selection and forced refresh with selected weeks',
    async (range) => {
      fixture.componentInstance.selectedTimeRange.set(range);
      fixture.componentInstance.selectedWeeks.set(7);
      await settle();
      expect(required('[role="combobox"]').textContent?.trim()).toBe(
        locales[0].asset.competition['team-assembly']['auto-generate'][
          range === 'season' ? 'this-season' : range === 'last-weeks' ? 'last-x-weeks' : range
        ],
      );
      expect(element.querySelector('#partner-weeks') !== null).toBe(range === 'last-weeks');
      required<HTMLButtonElement>('button[pButton]').click();
      await settle();
      expect(generator.loadStats).toHaveBeenCalledTimes(1);
      expect(generator.loadStats).toHaveBeenCalledWith(range, 7, true);
    },
  );

  it('updates the bounded weeks model through its input without refreshing automatically', async () => {
    fixture.componentInstance.selectedTimeRange.set('last-weeks');
    await settle();
    const weeks = required<HTMLInputElement>('#partner-weeks');
    expect([weeks.min, weeks.max, weeks.value]).toEqual(['1', '52', '52']);
    weeks.value = '9';
    weeks.dispatchEvent(new Event('input'));
    await settle();
    expect(fixture.componentInstance.selectedWeeks()).toBe(9);
    expect(generator.loadStats).not.toHaveBeenCalled();
    required<HTMLButtonElement>('button[pButton]').click();
    await settle();
    expect(generator.loadStats).toHaveBeenCalledWith('last-weeks', 9, true);
  });

  it('disables refresh while loading, exposes busy state and preserves the rows', async () => {
    generator.loadingStats.set(true);
    await settle();
    const button = required<HTMLButtonElement>('button[pButton]');
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.pi-spinner.pi-spin')?.getAttribute('aria-hidden')).toBe('true');
    button.click();
    expect(generator.loadStats).not.toHaveBeenCalled();
    expect(rows()).toHaveLength(2);
    generator.loadingStats.set(false);
    await settle();
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-busy')).toBe('false');
    expect(button.querySelector('.pi-refresh')).not.toBeNull();
  });

  it('preserves descending total sorting and native size and stripes', async () => {
    expect(table().size()).toBe('small');
    expect(table().stripedRows()).toBe(true);
    expect(rows().map((row) => row.cells[2].textContent?.trim())).toEqual(['3', '2']);
    required<HTMLTableCellElement>('th[pSortableColumn="total"]').click();
    await settle();
    expect(rows().map((row) => row.cells[2].textContent?.trim())).toEqual(['2', '3']);
  });

  it.each(['Alex', 'Example', 'Sam', 'Demonstration'])('filters the existing four name fields for %s', async (query) => {
    generator.pairStats.set([
      pair(0),
      {
        ...pair(1),
        player1: Object.assign(new Player(), { firstName: 'Taylor', lastName: 'Other' }),
        player2: Object.assign(new Player(), { firstName: 'Robin', lastName: 'Different' }),
      },
    ]);
    await settle();
    await filter(query);
    expect(rows()).toHaveLength(1);
    expect(rows()[0].textContent).toContain('Example 0');
    expect(generator.loadStats).not.toHaveBeenCalled();
  });

  it('shows the translated empty filtered result and restores rows when cleared', async () => {
    await filter('missing-safe-name');
    expect(required<HTMLTableCellElement>('tbody td').colSpan).toBe(5);
    expect(rows()[0].textContent?.trim()).toBe(locales[0].asset.competition['team-assembly'].stats['no-data']);
    await filter('');
    expect(rows()).toHaveLength(2);
  });

  it('retains the paginator threshold and twenty-row pages', async () => {
    generator.pairStats.set(Array.from({ length: 10 }, (_, index) => pair(index)));
    await settle();
    expect(element.querySelector('p-paginator')).toBeNull();
    generator.pairStats.set(Array.from({ length: 21 }, (_, index) => pair(index)));
    await settle();
    expect(table().paginator()).toBe(true);
    expect(table().rows()).toBe(20);
    expect(rows()).toHaveLength(20);
    required<HTMLButtonElement>('.p-paginator-next').click();
    await settle();
    expect(rows()).toHaveLength(1);
    expect(rows()[0].textContent).toContain('Example 0');
  });

  it('preserves expanded-by-default native collapse and expand', async () => {
    const fieldset = fixture.debugElement.query(By.directive(Fieldset)).injector.get(Fieldset);
    const toggle = required<HTMLButtonElement>('.p-fieldset-toggle-button');
    expect(fieldset.collapsed()).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    toggle.click();
    await settle();
    expect(fieldset.collapsed()).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    toggle.click();
    await settle();
    expect(fieldset.collapsed()).toBe(false);
  });

  it('still hides the disclosure when no pair statistics exist', async () => {
    generator.pairStats.set([]);
    await settle();
    expect(element.querySelector('p-fieldset')).toBeNull();
    expect(generator.loadStats).not.toHaveBeenCalled();
  });
});
