import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of } from 'rxjs';
import { EnrollmentsTabComponent } from './enrollments-tab.component';

describe('Enrollment-management summary presentation', () => {
  let fixture: ComponentFixture<EnrollmentsTabComponent>;
  let element: HTMLElement;
  let mutate: jest.Mock;
  const counts = signal({ total: 0, confirmed: 0, pending: 0, waitingList: 0, cancelled: 0 });

  beforeEach(async () => {
    counts.set({ total: 0, confirmed: 0, pending: 0, waitingList: 0, cancelled: 0 });
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [EnrollmentsTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query: jest.fn(() => of({ data: { subEventEnrollments: [] } })), mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(EnrollmentsTabComponent);
    fixture.componentRef.setInput('tournament', { id: 'safe-event', tournamentSubEvents: [] });
    fixture.componentInstance.stats = counts;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    expect(mutate).not.toHaveBeenCalled();
  });

  function values() {
    return Array.from(element.querySelectorAll('dl dd:first-of-type')).map((cell) => cell.textContent?.trim());
  }

  it('groups five named counts in one native Card and a non-interactive definition list', () => {
    const summary = element.querySelector('p-card');
    expect(summary?.classList.contains('border-surface')).toBe(true);
    expect(summary?.querySelectorAll('dl')).toHaveLength(1);
    expect(summary?.querySelectorAll('dt')).toHaveLength(5);
    expect(summary?.querySelectorAll('dd')).toHaveLength(10);
    expect(summary?.querySelector('button, a, input, [tabindex], i')).toBeNull();
    expect(summary?.querySelector('[style]')).toBeNull();
    expect(summary?.innerHTML).not.toMatch(/(?:green|blue|orange|red|primary|surface)-\d|dark:|uppercase|hover:/);
    expect(values()).toEqual(['0', '0', '0', '0', '0']);
  });

  it('preserves exact input values, ordering and reactive replacement without deriving new totals', () => {
    counts.set({ total: 90000, confirmed: 12, pending: 3, waitingList: 4, cancelled: 5 });
    fixture.detectChanges();
    expect(values()).toEqual(['90000', '12', '3', '4', '5']);
    counts.set({ total: 1, confirmed: 0, pending: 1, waitingList: 0, cancelled: 0 });
    fixture.detectChanges();
    expect(values()).toEqual(['1', '0', '1', '0', '0']);
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses existing %s labels and preserves descriptions without blank total labels', (locale) => {
    const assetPath = join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json');
    const asset: { tournament: { admin: { enrollments: Record<string, string> } } } = JSON.parse(readFileSync(assetPath, 'utf8'));
    const labels = asset.tournament.admin.enrollments;
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: asset });
    translate.use(locale);
    fixture.detectChanges();
    expect(Array.from(element.querySelectorAll('dl dt')).map((cell) => cell.textContent?.trim())).toEqual(
      ['totalEntries', 'confirmed', 'pending', 'waitingList', 'cancelled'].map((key) => labels[key]),
    );
    expect(Array.from(element.querySelectorAll('dl dd:last-of-type')).map((cell) => cell.textContent?.trim())).toEqual(
      ['totalDescription', 'confirmedDescription', 'pendingDescription', 'waitingListDescription', 'cancelledDescription'].map((key) => labels[key]),
    );
    expect(element.querySelector('dt')?.textContent?.trim()).not.toBe('');
  });
});
