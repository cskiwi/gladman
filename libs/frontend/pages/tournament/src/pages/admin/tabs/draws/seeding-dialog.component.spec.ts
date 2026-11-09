import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { DrawsTabComponent } from './draws-tab.component';
import { SeedingMethod } from './draws-tab.service';

describe('Draw seeding dialog', () => {
  let fixture: ComponentFixture<DrawsTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const entries = [{ id: 'safe-entry', player1: { fullName: 'Safe Player' } }];
  const draw = { id: 'safe-draw', name: 'Safe draw', type: 'KO', entries };
  const response = { data: { tournamentSubEvent: { entries, unassignedEntries: [], drawTournaments: [draw] } } };

  beforeEach(async () => {
    query = jest.fn(() => of(response));
    mutate = jest.fn(() => of({ data: { autoSeedDraw: entries } }));
    await TestBed.configureTestingModule({
      imports: [DrawsTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    fixture = TestBed.createComponent(DrawsTabComponent);
    fixture.componentRef.setInput('tournament', {
      id: 'safe-tournament',
      tournamentSubEvents: [{ id: 'safe-singles', name: 'Safe singles', gameType: 'S' }],
    });
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function required<T extends Element = HTMLElement>(selector: string): T {
    const host: HTMLElement = fixture.nativeElement;
    const element = host.querySelector<T>(selector);
    if (!element) throw new Error(`Missing test element: ${selector}`);
    return element;
  }

  function dialog(): HTMLElement {
    return required('[role="dialog"]');
  }

  function trigger(): HTMLButtonElement {
    return required<HTMLButtonElement>('[data-testid="draw"] p-button button');
  }

  async function open() {
    await settle();
    trigger().click();
    await settle();
  }

  function cancel(): HTMLButtonElement {
    return required<HTMLButtonElement>('[role="dialog"] form p-button button');
  }

  function submit(): HTMLButtonElement {
    return required<HTMLButtonElement>('[role="dialog"] button[type="submit"]');
  }

  it('renders actual form actions, a fluid labelled selector and an explicitly named Close', async () => {
    await open();
    const select = required('[role="dialog"] [role="combobox"]');
    expect(select.id).toBe('seedingMethod');
    expect(select.getAttribute('aria-labelledby')).toBe('seeding-method-label');
    expect(dialog().querySelector('label')?.getAttribute('for')).toBe(select.id);
    expect(dialog().querySelector('.p-dialog-close-button')?.getAttribute('aria-label')).toBe('all.button.close');
    expect(dialog().classList.contains('sm:w-md')).toBe(true);
    expect(dialog().style.width).toBe('');
    expect(dialog().querySelector('p-select')?.classList.contains('p-select-fluid')).toBe(true);
    expect(cancel().textContent).toContain('all.button.cancel');
    expect(submit().textContent).toContain('all.tournament.admin.draws.applySeeding');
    expect(submit().disabled).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each<SeedingMethod>(['BY_RANKING', 'RANDOM', 'MANUAL'])('preserves %s payload and refetches only on mock success', async (method) => {
    await open();
    fixture.componentInstance.seedingMethod.setValue(method);
    submit().click();
    await settle();
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0].variables).toEqual({ input: { drawId: 'safe-draw', method } });
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.showSeedingDialog()).toBe(false);
  });

  it('resets to ranking on reopen and cancellation never mutates', async () => {
    await open();
    fixture.componentInstance.seedingMethod.setValue('RANDOM');
    cancel().click();
    await settle();
    expect(fixture.componentInstance.showSeedingDialog()).toBe(false);
    trigger().click();
    await settle();
    expect(fixture.componentInstance.seedingDrawId()).toBe('safe-draw');
    expect(fixture.componentInstance.seedingMethod.value).toBe('BY_RANKING');
    expect(mutate).not.toHaveBeenCalled();
  });

  it('restores focus to the actual opening button when the native dialog finishes hiding', async () => {
    await open();
    const focus = jest.spyOn(trigger(), 'focus');
    cancel().click();
    await settle();
    fixture.componentInstance.restoreSeedingFocus();
    expect(focus).toHaveBeenCalled();
  });

  it('dismisses by Escape when idle without submitting', async () => {
    await open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    await settle();
    expect(fixture.componentInstance.showSeedingDialog()).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('locks dismissal and selection, shows loading and guards duplicate submission while pending', async () => {
    await open();
    const pending = new Subject<{ data: { autoSeedDraw: typeof entries } }>();
    mutate.mockReturnValueOnce(pending);
    submit().click();
    fixture.detectChanges();
    expect(dialog().querySelector('form')?.getAttribute('aria-busy')).toBe('true');
    expect(cancel().disabled).toBe(true);
    expect(submit().disabled).toBe(true);
    expect(submit().querySelector('[data-pc-section="loadingicon"]')).not.toBeNull();
    expect(dialog().querySelector('.p-dialog-close-button')).toBeNull();
    required('[role="dialog"] [role="combobox"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(dialog().querySelector('[role="listbox"]')).toBeNull();
    expect(fixture.componentInstance.seedingMethod.value).toBe('BY_RANKING');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    fixture.componentInstance.closeSeedingDialog();
    fixture.detectChanges();
    expect(fixture.componentInstance.showSeedingDialog()).toBe(true);
    required('[role="dialog"] form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.componentInstance.applySeeding();
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.showSeedingDialog()).toBe(true);
    pending.next({ data: { autoSeedDraw: entries } });
    pending.complete();
    await settle();
    expect(fixture.componentInstance.showSeedingDialog()).toBe(false);
  });

  it.each(['error', 'missing-data'])('retains the dialog and chosen method on %s and permits retry', async (kind) => {
    await open();
    fixture.componentInstance.seedingMethod.setValue('RANDOM');
    mutate.mockReturnValueOnce(kind === 'error' ? throwError(() => new Error('Safe seeding failure')) : of({ data: {} }));
    submit().click();
    await settle();
    expect(fixture.componentInstance.showSeedingDialog()).toBe(true);
    expect(fixture.componentInstance.seedingMethod.value).toBe('RANDOM');
    expect(dialog().querySelector('p-message')?.textContent).toContain(kind === 'error' ? 'Safe seeding failure' : 'all.error.genericTitle');
    expect(query).toHaveBeenCalledTimes(1);
    expect(submit().disabled).toBe(false);
    submit().click();
    await settle();
    expect(mutate).toHaveBeenCalledTimes(2);
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.showSeedingDialog()).toBe(false);
  });

  it('disables submission without a method or target', async () => {
    await open();
    fixture.componentInstance.seedingMethod.setValue(null);
    await settle();
    expect(submit().disabled).toBe(true);
    await fixture.componentInstance.applySeeding();
    fixture.componentInstance.seedingMethod.setValue('BY_RANKING');
    fixture.componentInstance.seedingDrawId.set(null);
    await settle();
    expect(submit().disabled).toBe(true);
    await fixture.componentInstance.applySeeding();
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses nonempty %s copy and updates native option labels on language change', async (locale) => {
    const translate = TestBed.inject(TranslateService);
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale).subscribe();
    await open();
    const copy = dictionary.tournament.admin.draws;
    for (const key of ['seedByRanking', 'seedRandom', 'seedManual', 'seedingDescription', 'seedingMethod', 'seedingOptions', 'applySeeding']) {
      expect(copy[key]).toBeTruthy();
    }
    expect(fixture.componentInstance.seedingMethodOptions()).toEqual([
      { label: copy.seedByRanking, value: 'BY_RANKING' },
      { label: copy.seedRandom, value: 'RANDOM' },
      { label: copy.seedManual, value: 'MANUAL' },
    ]);
    expect(dialog().textContent).toContain(copy.seedingDescription);
    expect(dialog().textContent).toContain(copy.seedByRanking);
    expect(submit().textContent).toContain(copy.applySeeding);
    translate.setTranslation('safe-switch', { all: { tournament: { admin: { draws: { seedByRanking: 'Safe alternate ranking' } } } } });
    translate.use('safe-switch').subscribe();
    await settle();
    expect(fixture.componentInstance.seedingMethodOptions()[0].label).toBe('Safe alternate ranking');
    expect(dialog().textContent).toContain('Safe alternate ranking');
    expect(mutate).not.toHaveBeenCalled();
  });
});
