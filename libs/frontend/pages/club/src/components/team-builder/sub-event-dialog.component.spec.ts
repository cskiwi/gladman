import { TestBed } from '@angular/core/testing';
import { CompetitionSubEvent } from '@app/models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TEAM_BUILDER_AUTO_SUB_EVENT } from '../../pages/detail/tabs/team-builder/types/team-builder.types';
import { SubEventDialogComponent } from './sub-event-dialog.component';

describe('SubEventDialogComponent', () => {
  const first = Object.assign(new CompetitionSubEvent(), {
    id: 'first',
    name: 'First division',
    level: 1,
    maxLevel: 2,
    minBaseIndex: 0,
    maxBaseIndex: 32,
  });
  const second = Object.assign(new CompetitionSubEvent(), {
    id: 'second',
    name: 'Second division',
    level: 2,
    maxLevel: 4,
    minBaseIndex: 20,
    maxBaseIndex: 52,
  });
  const unnamed = Object.assign(new CompetitionSubEvent(), { id: 'unnamed' });
  const options = [
    { value: TEAM_BUILDER_AUTO_SUB_EVENT, label: 'Auto' },
    { value: second.id, label: '[LIGA] Second division' },
    { value: first.id, label: '[LIGA] First division' },
    { value: unnamed.id, label: 'Unnamed' },
  ];

  async function render(selectedValue = TEAM_BUILDER_AUTO_SUB_EVENT, autoOnly = false) {
    const close = jest.fn();
    const data = {
      currentSubEvent: autoOnly ? undefined : second,
      selectedValue,
      options: autoOnly ? options.slice(0, 1) : options,
      allSubEvents: [second, first, unnamed],
    };
    await TestBed.configureTestingModule({
      imports: [SubEventDialogComponent, TranslateModule.forRoot()],
      providers: [
        { provide: DynamicDialogConfig, useValue: { data } },
        { provide: DynamicDialogRef, useValue: { close } },
      ],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      'all.common.level': 'Level',
      'all.club.teamBuilder.subEvent.otherGroup': 'Other sub-events',
    });
    translate.use('en');
    const fixture = TestBed.createComponent(SubEventDialogComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const action = (key: string) => {
      const button = [...element.querySelectorAll('button')].find((item) => item.textContent?.includes('all.button.' + key));
      if (!button) throw new Error('Missing ' + key + ' action');
      return button;
    };
    return { fixture, element, close, action, data };
  }

  it('labels native choices, preserves grouping and metadata, and applies the exact selected ID only on confirmation', async () => {
    const { fixture, element, close, action, data } = await render(second.id);
    const radios = [...element.querySelectorAll<HTMLInputElement>('input[type=radio]')];
    expect(radios.map((radio) => radio.id)).toEqual(['sub-event-auto', 'sub-event-first', 'sub-event-second', 'sub-event-unnamed']);
    expect(radios.every((radio) => radio.labels?.length === 1 && radio.labels[0].textContent?.trim())).toBe(true);
    expect(radios.map((radio) => radio.checked)).toEqual([false, false, true, false]);
    expect([...element.querySelectorAll('h3')].map((heading) => heading.textContent?.trim())).toEqual(['LIGA', 'Other sub-events']);
    expect(element.querySelector('label[for=sub-event-first]')?.textContent).toContain('0 – 32');
    expect(element.querySelector('label[for=sub-event-unnamed]')?.textContent).toContain('Level ?');
    expect(element.querySelector('label[for=sub-event-unnamed]')?.textContent).toContain('? – ?');
    radios[1].click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(radios.map((radio) => radio.checked)).toEqual([false, true, false, false]);
    expect(close).not.toHaveBeenCalled();
    expect(data.selectedValue).toBe(second.id);
    action('apply').click();
    expect(close).toHaveBeenCalledWith(first.id);
    expect(options[1].value).toBe(second.id);
  });

  it('supports Auto as the only option when no current division or matching options exist', async () => {
    const { element, close, action } = await render(TEAM_BUILDER_AUTO_SUB_EVENT, true);
    const radios = element.querySelectorAll<HTMLInputElement>('input[type=radio]');
    expect(radios).toHaveLength(1);
    expect(radios[0].checked).toBe(true);
    expect(element.textContent).not.toContain('all.club.teamBuilder.card.currentSubEvent');
    action('apply').click();
    expect(close).toHaveBeenCalledWith(TEAM_BUILDER_AUTO_SUB_EVENT);
  });

  it('discards a changed choice on Cancel without modifying the supplied selection', async () => {
    const { fixture, element, close, action, data } = await render(first.id);
    element.querySelector<HTMLInputElement>('#sub-event-auto')?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    action('cancel').click();
    expect(close).toHaveBeenCalledWith(null);
    expect(data.selectedValue).toBe(first.id);
  });
});
