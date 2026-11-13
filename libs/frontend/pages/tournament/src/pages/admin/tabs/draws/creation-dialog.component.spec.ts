import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, Subject, throwError } from 'rxjs';
import { DrawsTabComponent } from './draws-tab.component';

describe('Draw creation dialog', () => {
  let fixture: ComponentFixture<DrawsTabComponent>;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const draw = { id: 'safe-draw', name: 'Safe draw', type: 'KO' };
  const response = { data: { tournamentSubEvent: { entries: [], drawTournaments: [] } } };

  beforeEach(async () => {
    query = jest.fn(() => of(response));
    mutate = jest.fn(() => of({ data: { createTournamentDraw: draw } }));
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

  function trigger(emptyList = false): HTMLButtonElement {
    return required<HTMLButtonElement>(
      emptyList ? '[data-testid="empty-draw-list"] button' : '[data-testid="draw-filters"] p-button:nth-child(2) button',
    );
  }

  async function open(emptyList = false) {
    await settle();
    trigger(emptyList).click();
    await settle();
  }

  function cancel(): HTMLButtonElement {
    return required<HTMLButtonElement>('[role="dialog"] form p-button button');
  }

  function submit(): HTMLButtonElement {
    return required<HTMLButtonElement>('[role="dialog"] button[type="submit"]');
  }

  it('renders only effective controls with native labels, required validation and usable actions', async () => {
    await open();
    const dialog = required('[role="dialog"]');
    expect(dialog.classList.contains('sm:w-md')).toBe(true);
    expect(dialog.style.width).toBe('');
    expect(Object.keys(fixture.componentInstance.drawForm.controls)).toEqual(['name', 'type', 'size']);
    expect(dialog.querySelector('p-inputnumber, #subEventType, #minLevel, #maxLevel')).toBeNull();
    expect(required<HTMLInputElement>('#drawName').required).toBe(true);
    expect(dialog.querySelector('label[for="drawName"]')).not.toBeNull();
    for (const id of ['drawType', 'drawSize']) {
      const select = required(`#${id}`);
      const label = dialog.querySelector(`label[for="${id}"]`);
      expect(select.getAttribute('role')).toBe('combobox');
      expect(select.getAttribute('aria-labelledby')).toBe(label?.id);
    }
    expect(dialog.querySelector('.p-dialog-close-button')?.getAttribute('aria-label')).toBe('all.button.close');
    expect(cancel().textContent).toContain('all.button.cancel');
    expect(submit().textContent).toContain('all.button.create');
    expect(submit().disabled).toBe(true);
    await fixture.componentInstance.createDraw();
    await settle();
    expect(required('#draw-name-error').textContent).toContain('all.common.required');
    expect(required('#drawName').getAttribute('aria-describedby')).toBe('draw-name-error');
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['KO', 'POULE', 'QUALIFICATION'])('preserves selected sub-event and %s payload with optional size omitted', async (type) => {
    await open();
    fixture.componentInstance.drawForm.patchValue({ name: 'Safe draw', type });
    await settle();
    submit().click();
    await settle();
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0].variables).toEqual({ input: { subEventId: 'safe-singles', name: 'Safe draw', type, size: undefined } });
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.showCreateDrawDialog()).toBe(false);
  });

  it.each([4, 8, 16, 32, 64])('preserves size %i in the existing mutation', async (size) => {
    await open();
    fixture.componentInstance.drawForm.patchValue({ name: 'Safe draw', size });
    await fixture.componentInstance.createDraw();
    expect(mutate.mock.calls[0][0].variables).toEqual({ input: { subEventId: 'safe-singles', name: 'Safe draw', type: 'KO', size } });
  });

  it.each([false, true])('cancels without mutation, resets defaults and restores the actual opener (empty list: %s)', async (emptyList) => {
    await open(emptyList);
    fixture.componentInstance.drawForm.patchValue({ name: 'Safe draft', type: 'POULE', size: 16 });
    const focus = jest.spyOn(trigger(emptyList), 'focus');
    cancel().click();
    await settle();
    fixture.componentInstance.restoreCreationFocus();
    expect(focus).toHaveBeenCalled();
    trigger(emptyList).click();
    await settle();
    expect(fixture.componentInstance.drawForm.getRawValue()).toEqual({ name: null, type: 'KO', size: null });
    expect(fixture.componentInstance.drawForm.pristine).toBe(true);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('dismisses by Escape or native Close without submitting', async () => {
    await open();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    await settle();
    expect(fixture.componentInstance.showCreateDrawDialog()).toBe(false);
    await open();
    required<HTMLButtonElement>('.p-dialog-close-button').click();
    await settle();
    expect(fixture.componentInstance.showCreateDrawDialog()).toBe(false);
    expect(mutate).not.toHaveBeenCalled();
  });

  it('locks pending input, clear, dismissal and duplicate submits until mock success', async () => {
    await open();
    fixture.componentInstance.drawForm.patchValue({ name: 'Safe draw', size: 16 });
    const pending = new Subject<{ data: { createTournamentDraw: typeof draw } }>();
    mutate.mockReturnValueOnce(pending);
    await settle();
    submit().click();
    fixture.detectChanges();
    expect(required('form').getAttribute('aria-busy')).toBe('true');
    expect(required<HTMLInputElement>('#drawName').readOnly).toBe(true);
    expect(cancel().disabled).toBe(true);
    expect(submit().disabled).toBe(true);
    expect(submit().querySelector('[data-pc-section="loadingicon"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.p-dialog-close-button, .p-select-clear-icon')).toBeNull();
    required('#drawType').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="listbox"]')).toBeNull();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    required('[role="dialog"] form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.componentInstance.closeCreateDrawDialog();
    await fixture.componentInstance.createDraw();
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.showCreateDrawDialog()).toBe(true);
    pending.next({ data: { createTournamentDraw: draw } });
    pending.complete();
    await settle();
    expect(fixture.componentInstance.showCreateDrawDialog()).toBe(false);
  });

  it.each(['error', 'missing-data', 'malformed-data'])('retains form on %s, displays an error and permits retry', async (kind) => {
    await open();
    fixture.componentInstance.drawForm.patchValue({ name: 'Safe draft', type: 'POULE', size: 8 });
    mutate.mockReturnValueOnce(
      kind === 'error'
        ? throwError(() => new Error('Safe creation failure'))
        : of({ data: kind === 'missing-data' ? {} : { createTournamentDraw: {} } }),
    );
    await settle();
    submit().click();
    await settle();
    expect(fixture.componentInstance.showCreateDrawDialog()).toBe(true);
    expect(fixture.componentInstance.drawForm.getRawValue()).toEqual({ name: 'Safe draft', type: 'POULE', size: 8 });
    expect(required('[role="dialog"] p-message').textContent).toContain(kind === 'error' ? 'Safe creation failure' : 'all.error.genericTitle');
    expect(query).toHaveBeenCalledTimes(1);
    expect(submit().disabled).toBe(false);
    submit().click();
    await settle();
    expect(mutate).toHaveBeenCalledTimes(2);
    expect(query).toHaveBeenCalledTimes(2);
    expect(fixture.componentInstance.showCreateDrawDialog()).toBe(false);
    await open();
    expect(fixture.componentInstance.updateError()).toBeNull();
  });

  it('guards a missing type or selected sub-event without mutation', async () => {
    await open();
    fixture.componentInstance.drawForm.patchValue({ name: 'Safe draw', type: null });
    await settle();
    expect(submit().disabled).toBe(true);
    await fixture.componentInstance.createDraw();
    fixture.componentInstance.drawForm.controls.type.setValue('KO');
    fixture.componentInstance.subEventControl.setValue(null);
    await fixture.componentInstance.createDraw();
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(['en', 'nl_BE', 'fr_BE'])('uses nonempty localized creation options in %s and reacts to a locale switch', async (locale) => {
    const translate = TestBed.inject(TranslateService);
    const dictionary = JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
    translate.setTranslation(locale, { all: dictionary });
    translate.use(locale).subscribe();
    await open();
    const copy = dictionary.tournament.admin.draws;
    for (const key of ['createDraw', 'drawName', 'drawType', 'drawSize', 'selectSize', 'knockout', 'roundRobin', 'qualification']) {
      expect(copy[key]).toBeTruthy();
    }
    expect(fixture.componentInstance.drawTypeOptions()).toEqual([
      { label: copy.knockout, value: 'KO' },
      { label: copy.roundRobin, value: 'POULE' },
      { label: copy.qualification, value: 'QUALIFICATION' },
    ]);
    expect(fixture.componentInstance.drawSizeOptions().map((option) => option.label)).toEqual(
      [4, 8, 16, 32, 64].map((size) => `${size} ${dictionary.tournament.entries}`),
    );
    expect(required('[role="dialog"]').textContent).toContain(copy.knockout);
    translate.setTranslation('safe-switch', { all: { tournament: { entries: 'Safe entries', admin: { draws: { knockout: 'Safe knockout' } } } } });
    translate.use('safe-switch').subscribe();
    await settle();
    expect(fixture.componentInstance.drawTypeOptions()[0].label).toBe('Safe knockout');
    expect(fixture.componentInstance.drawSizeOptions()[0].label).toBe('4 Safe entries');
    expect(mutate).not.toHaveBeenCalled();
  });
});
