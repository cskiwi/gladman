import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { CheckinTabComponent } from './checkin-tab.component';

describe('Check-in summary', () => {
  let fixture: ComponentFixture<CheckinTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const stats = { total: 12, checkedIn: 4, pending: 7, noShow: 1, checkInRate: 100 / 3 };
  const response = { data: { tournamentCheckInList: [], checkInStats: stats } };

  beforeEach(async () => {
    query = jest.fn(() => of(response));
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [CheckinTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckinTabComponent);
    fixture.componentRef.setInput('tournament', { id: 'safe-tournament' });
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function summary(): HTMLElement {
    return fixture.nativeElement.querySelector('[data-testid="checkin-summary"]');
  }

  it('renders five native definition-list metrics and preserves one-decimal percentage precision', async () => {
    await settle();
    expect(summary().tagName.toLowerCase()).toBe('p-panel');
    expect(summary().querySelectorAll('dt')).toHaveLength(5);
    expect(Array.from(summary().querySelectorAll('dd:nth-of-type(1)'), (node) => node.textContent?.trim())).toEqual(['12', '4', '7', '1', '33.3%']);
    expect(summary().querySelector('p-card')).toBeNull();
    expect(query.mock.lastCall[0].variables.tournamentEventId).toBe('safe-tournament');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('renders genuine zero statistics without hiding meaningful labels', async () => {
    query.mockReturnValue(
      of({ data: { tournamentCheckInList: [], checkInStats: { total: 0, checkedIn: 0, pending: 0, noShow: 0, checkInRate: 0 } } }),
    );
    await settle();
    expect(Array.from(summary().querySelectorAll('dd:nth-of-type(1)'), (node) => node.textContent?.trim())).toEqual(['0', '0', '0', '0', '0%']);
    expect(summary().querySelectorAll('dt')).toHaveLength(5);
    expect(summary().querySelector('p-message')).toBeNull();
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('renders nonblank mounted summary copy from the actual %s dictionary', async (locale) => {
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale);
    await settle();
    expect(summary().querySelector('.p-panel-title')?.textContent).toContain(dictionary.tournament.admin.checkin.title);
    fixture.componentInstance.summaryItems.forEach((item, index) => {
      const copy = dictionary.tournament.admin.checkin;
      expect(copy[item.label].trim()).not.toBe('');
      expect(copy[item.description].trim()).not.toBe('');
      expect(summary().querySelectorAll('dt')[index].textContent?.trim()).toBe(copy[item.label]);
      expect(summary().querySelectorAll('dd:nth-of-type(2)')[index].textContent?.trim()).toBe(copy[item.description]);
    });
    expect(mutate).not.toHaveBeenCalled();
  });

  it('shows named native loading instead of false zero metrics while the read is pending', async () => {
    const pending = new Subject<typeof response>();
    query.mockReturnValue(pending);
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    expect(summary().querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(summary().querySelector('[role="status"]')?.textContent).toContain('all.tournament.edit.messages.loading');
    expect(summary().querySelector('p-skeleton')).not.toBeNull();
    expect(summary().querySelector('dl')).toBeNull();
    pending.next(response);
    pending.complete();
    await settle();
    expect(summary().querySelectorAll('dt')).toHaveLength(5);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('surfaces query errors safely and recovers through the native refresh action without a mutation', async () => {
    query.mockReturnValueOnce(throwError(() => new Error('Safe read failure')));
    await settle();
    expect(summary().querySelector('p-message')?.textContent).toContain('Safe read failure');
    expect(summary().querySelector('dl')).toBeNull();
    expect(fixture.componentInstance.checkIns()).toEqual([]);
    const refresh: HTMLButtonElement | null = summary().querySelector('p-button button');
    expect(refresh?.getAttribute('aria-label')).toBe('all.button.refresh');
    refresh?.focus();
    refresh?.click();
    await settle();
    expect(query).toHaveBeenCalledTimes(2);
    expect(summary().querySelector('p-message')).toBeNull();
    expect(summary().querySelectorAll('dt')).toHaveLength(5);
    expect(document.activeElement).toBe(refresh);
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each([{ data: undefined }, { data: { tournamentCheckInList: [] } }])(
    'rejects an incomplete successful response rather than displaying zeros',
    async (result) => {
      query.mockReturnValue(of(result));
      await settle();
      expect(summary().querySelector('p-message')?.textContent).toContain('missing records or statistics');
      expect(summary().querySelector('dl')).toBeNull();
      expect(mutate).not.toHaveBeenCalled();
    },
  );
});
