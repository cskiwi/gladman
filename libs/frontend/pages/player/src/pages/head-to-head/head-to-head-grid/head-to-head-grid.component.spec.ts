import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HeadToHeadGridComponent } from './head-to-head-grid.component';
import { HeadToHeadGrid } from './sort.type';

describe(HeadToHeadGridComponent.name, () => {
  let fixture: ComponentFixture<HeadToHeadGridComponent>;
  const rows: HeadToHeadGrid[] = [
    {
      player: { id: 'alpha', fullName: 'Alpha Player' },
      club: { id: 'club', name: 'Example Club' },
      partner: { id: 'zulu', fullName: 'Zulu Partner' },
      partnerClub: { id: 'other-club', name: 'Partner Club' },
      winRate: 25,
      amountOfGames: 8,
    },
    {
      player: { id: 'beta', fullName: 'Beta Player' },
      partner: { id: 'able', fullName: 'Able Partner' },
      winRate: 100,
      amountOfGames: 1,
    },
  ];

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HeadToHeadGridComponent, TranslateModule.forRoot()],
    });
    fixture = TestBed.createComponent(HeadToHeadGridComponent);
    fixture.componentRef.setInput('dataSource', [...rows]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function host(): HTMLElement {
    return fixture.nativeElement;
  }

  function bodyRows(): HTMLTableRowElement[] {
    return Array.from(host().querySelectorAll<HTMLTableRowElement>('tbody tr'));
  }

  it('renders named partner results with descending win rate and unchanged unweighted aggregates', () => {
    expect(host().querySelector('table')?.getAttribute('aria-label')).toBe('all.head-to-head.filters.partners');
    expect(host().querySelectorAll('th')).toHaveLength(3);
    expect(bodyRows()[0].cells[0].textContent).toContain('Beta Player');
    expect(bodyRows()[1].cells[0].textContent).toContain('Example Club');
    expect(host().querySelector('tfoot')?.textContent).toContain('62.5 %');
    expect(host().querySelector('tfoot')?.textContent).toContain('all.head-to-head.grid.total: 9');
  });

  it('renders opponent partner clubs and sorts the displayed partner names instead of objects', async () => {
    fixture.componentRef.setInput('viewMode', 'opponents');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(host().querySelector('table')?.getAttribute('aria-label')).toBe('all.head-to-head.filters.opponents');
    const headers = host().querySelectorAll<HTMLElement>('th');
    expect(headers).toHaveLength(4);
    expect(headers[2].textContent).toContain('all.head-to-head.win-rate-against');
    expect(bodyRows().find((row) => row.cells[1].textContent?.includes('Zulu Partner'))?.cells[1].textContent).toContain('Partner Club');
    headers[1].click();
    fixture.detectChanges();
    expect(headers[1].getAttribute('aria-sort')).toBe('ascending');
    expect(bodyRows().map((row) => row.cells[1].querySelector('div')?.textContent)).toEqual(['Able Partner', 'Zulu Partner']);
    headers[1].click();
    fixture.detectChanges();
    expect(bodyRows()[0].cells[1].textContent).toContain('Zulu Partner');
  });

  it.each([
    { mode: 'partners', columns: 3 },
    { mode: 'opponents', columns: 4 },
  ] as const)('shows translated empty feedback without aggregate values in $mode mode', async ({ mode, columns }) => {
    fixture.componentRef.setInput('viewMode', mode);
    fixture.componentRef.setInput('dataSource', []);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(bodyRows()).toHaveLength(1);
    expect(bodyRows()[0].cells[0].colSpan).toBe(columns);
    expect(bodyRows()[0].querySelector('[role="status"]')?.textContent).toBe('all.player.noResults');
    expect(host().querySelector('tfoot')?.textContent?.trim()).toBe('');

    fixture.componentRef.setInput('dataSource', [...rows]);
    fixture.detectChanges();
    expect(host().querySelector('[role="status"]')).toBeNull();
    expect(bodyRows()).toHaveLength(2);
    expect(host().querySelector('tfoot')?.textContent).toContain('62.5 %');
  });

  it('retains a missing-partner marker and omits unavailable club metadata', async () => {
    fixture.componentRef.setInput('viewMode', 'opponents');
    fixture.componentRef.setInput('dataSource', [{ player: rows[0].player, winRate: 0, amountOfGames: 1 }]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(bodyRows()[0].cells[1].textContent?.trim()).toBe('-');
    expect(bodyRows()[0].cells[0].querySelector('.text-muted-color')).toBeNull();
    expect(bodyRows()[0].textContent).not.toContain('undefined');
  });
});
