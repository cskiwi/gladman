import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Player, TournamentSubEvent } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AutoComplete } from 'primeng/autocomplete';
import { of, throwError } from 'rxjs';
import { PartnerSelectionDialogComponent } from './partner-selection-dialog.component';

describe('Enrollment partner dialog', () => {
  const partner = Object.assign(new Player(), {
    id: 'safe-partner',
    firstName: 'Safe',
    lastName: 'Partner',
  });
  const subEvent = Object.assign(new TournamentSubEvent(), { id: 'safe-double', name: 'Safe doubles' });
  let close: jest.Mock;
  let query: jest.Mock;

  beforeEach(async () => {
    close = jest.fn();
    query = jest.fn(() => of({ data: { searchPartners: [partner] } }));
    await TestBed.configureTestingModule({
      imports: [PartnerSelectionDialogComponent, TranslateModule.forRoot()],
      providers: [
        { provide: DynamicDialogRef, useValue: { close } },
        { provide: DynamicDialogConfig, useValue: { data: { subEvent } } },
        { provide: Apollo, useValue: { query } },
      ],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      all: {
        button: { cancel: 'Cancel' },
        search: { noResults: 'No matching partners' },
        enrollment: {
          additionalNotes: 'Additional notes',
          optional: '(Optional)',
          characters: 'characters',
          continue: 'Continue',
          partnerSelection: {
            title: 'Partner selection',
            placeholder: 'Start typing a partner name',
            description: 'Search for an optional doubles partner',
            notes: 'Optional notes',
          },
        },
      },
    });
    translate.use('en');
  });

  async function mount() {
    const fixture = TestBed.createComponent(PartnerSelectionDialogComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    return { fixture, component: fixture.componentInstance, element };
  }

  it('associates native fields with persistent labels and helper descriptions', async () => {
    const { fixture, component, element } = await mount();
    expect(component.subEvent).toBe(subEvent);
    const input = element.querySelector<HTMLInputElement>('#enrollment-partner');
    expect(input?.getAttribute('role')).toBe('combobox');
    expect(element.querySelector('label[for="enrollment-partner"]')?.textContent).toContain('Partner selection');
    expect(input?.getAttribute('aria-describedby')).toBe('enrollment-partner-description');
    expect(element.querySelector('.p-autocomplete-dropdown')?.getAttribute('aria-label')).toBe('Partner selection');
    const autocomplete = fixture.debugElement.query(By.directive(AutoComplete)).componentInstance as AutoComplete;
    expect(autocomplete.emptyMessage()).toBe('No matching partners');
    const notes = element.querySelector<HTMLTextAreaElement>('#enrollment-notes');
    expect(element.querySelector('label[for="enrollment-notes"]')?.textContent).toContain('Additional notes');
    expect(notes?.getAttribute('aria-describedby')).toBe('enrollment-notes-count');
    expect(notes?.maxLength).toBe(500);
    expect(element.querySelector('.p-textarea')).not.toBeNull();
    expect(element.querySelector('p-autocomplete.p-autocomplete-fluid')).not.toBeNull();
    expect(element.querySelectorAll('i, .border-t, .p-6')).toHaveLength(0);
    expect(query).not.toHaveBeenCalled();
  });

  it.each(['', ' ', 'a', ' a '])('retains the two-character trimmed search threshold for %j', async (value) => {
    const { component } = await mount();
    component.filteredPartners = [partner];
    component.searchPartners({ query: value });
    expect(query).not.toHaveBeenCalled();
    expect(component.filteredPartners).toEqual([]);
  });

  it('sends trimmed search text and preserves suggestion objects', async () => {
    const { component } = await mount();
    component.searchPartners({ query: ' Safe ' });
    expect(query).toHaveBeenCalledWith(expect.objectContaining({ variables: { query: 'Safe' } }));
    expect(component.filteredPartners).toEqual([partner]);
  });

  it('logs a failed search and clears stale suggestions without closing', async () => {
    const { component } = await mount();
    const error = new Error('Safe search failure');
    query.mockReturnValue(throwError(() => error));
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      component.filteredPartners = [partner];
      component.searchPartners({ query: 'Safe' });
      expect(log).toHaveBeenCalledWith('Partner search error:', error);
      expect(component.filteredPartners).toEqual([]);
      expect(close).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it('keeps Cancel distinct from continuing without an optional partner', async () => {
    const { element } = await mount();
    const buttons = element.querySelectorAll<HTMLButtonElement>('button.p-button');
    buttons.forEach((button) => expect(button.type).toBe('button'));
    buttons[0].click();
    expect(close).toHaveBeenLastCalledWith();
    buttons[1].click();
    expect(close).toHaveBeenLastCalledWith({ partnerId: undefined, notes: undefined });
  });

  it('preserves selected partner, edited notes and the live character count', async () => {
    const { fixture, component, element } = await mount();
    component.form.controls.partner.setValue(partner);
    const notes = element.querySelector<HTMLTextAreaElement>('textarea');
    if (!notes) throw new Error('Notes field missing');
    notes.value = 'Safe fixture notes';
    notes.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.form.controls.notes.value).toBe('Safe fixture notes');
    expect(element.querySelector('#enrollment-notes-count')?.textContent).toContain('18 / 500 characters');
    expect(element.querySelector<HTMLInputElement>('#enrollment-partner')?.value).toBe(partner.fullName);
    element.querySelectorAll<HTMLButtonElement>('button.p-button')[1].click();
    expect(close).toHaveBeenCalledWith({ partnerId: 'safe-partner', notes: 'Safe fixture notes' });
  });

  it('disables Continue for invalid notes and restores it at the inclusive limit', async () => {
    const { fixture, component, element } = await mount();
    component.form.controls.notes.setValue('x'.repeat(501));
    fixture.detectChanges();
    const buttons = element.querySelectorAll<HTMLButtonElement>('button.p-button');
    expect(buttons[1].disabled).toBe(true);
    expect(element.querySelector('textarea')?.getAttribute('aria-invalid')).toBe('true');
    buttons[1].click();
    component.onSubmit();
    expect(close).not.toHaveBeenCalled();
    expect(buttons[0].disabled).toBe(false);
    component.form.controls.notes.setValue('x'.repeat(500));
    fixture.detectChanges();
    expect(buttons[1].disabled).toBe(false);
    expect(element.querySelector('textarea')?.getAttribute('aria-invalid')).toBe('false');
    buttons[1].click();
    expect(close).toHaveBeenCalledWith({ partnerId: undefined, notes: 'x'.repeat(500) });
  });
});
