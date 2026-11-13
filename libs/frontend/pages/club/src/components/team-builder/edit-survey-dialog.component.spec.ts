import { TestBed } from '@angular/core/testing';
import { Player } from '@app/models';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SurveyResponse } from '../../pages/detail/tabs/team-builder/types/survey-response';
import { TeamBuilderPlayer } from '../../pages/detail/tabs/team-builder/types/team-builder.types';
import { EditSurveyDialogComponent } from './edit-survey-dialog.component';

describe('EditSurveyDialogComponent', () => {
  const survey: SurveyResponse = {
    externalId: 'example-survey',
    createdOn: '2026-01-01',
    createdBy: 'example-import',
    fullName: 'Example Player',
    firstName: 'Example',
    lastName: 'Player',
    currentTeams: ['Current team'],
    desiredTeamCount: 2,
    preferredPlayDay: 'Friday',
    team1Choice1: 'First',
    team1Choice2: 'Second',
    team2Choice1: 'Third',
    team2Choice2: 'Fourth',
    canMeet75PercentTeam1: 'Yes',
    canMeet75PercentTeam2: 'No',
    unavailabilityPeriodsTeam1: 'December',
    unavailabilityPeriodsTeam2: 'January',
    comments: 'Existing remarks',
    meetingAttendance: 'Attending',
    availableDates: ['2026-02-01'],
    stoppingCompetition: false,
    linkedContactIds: ['example-contact'],
    matchedPlayerId: 'example-player',
    matchedPlayerName: 'Example Player',
    matchConfidence: 'medium',
  };

  async function render(existing?: SurveyResponse) {
    const player: TeamBuilderPlayer = Object.assign(new Player(), {
      id: 'example-player',
      firstName: 'Example',
      lastName: 'Player',
      survey: existing,
    });
    const close = jest.fn();
    await TestBed.configureTestingModule({
      imports: [EditSurveyDialogComponent, TranslateModule.forRoot()],
      providers: [
        { provide: DynamicDialogConfig, useValue: { data: { player } } },
        { provide: DynamicDialogRef, useValue: { close } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(EditSurveyDialogComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const button = (key: string) => {
      const result = [...element.querySelectorAll('button')].find((item) => item.textContent?.includes('all.button.' + key));
      if (!result) throw new Error('Missing ' + key + ' action');
      return result;
    };
    return { fixture, element, close, player, button };
  }

  it('labels every editable field and binds both team groups independently while preserving imported metadata', async () => {
    const { fixture, element, close, button } = await render(survey);
    const fields = [...element.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')];
    expect(fields).toHaveLength(12);
    expect(fields.every((field) => field.labels?.length === 1 && field.labels[0].textContent?.trim())).toBe(true);

    const updates = {
      preferredPlayDay: 'Saturday',
      team1Choice1: 'First revised',
      team1Choice2: 'Second revised',
      team2Choice1: 'Third revised',
      team2Choice2: 'Fourth revised',
      canMeet75PercentTeam1: 'Maybe / free text',
      canMeet75PercentTeam2: 'Non',
      unavailabilityPeriodsTeam1: 'February',
      unavailabilityPeriodsTeam2: 'March',
      comments: 'Revised remarks',
    };
    for (const [key, value] of Object.entries(updates)) {
      const id = key === 'preferredPlayDay' ? 'play-day' : key;
      const field = element.querySelector<HTMLInputElement | HTMLTextAreaElement>('#survey-' + id);
      if (!field) throw new Error('Missing ' + key + ' input');
      expect(field.value).toBe(survey[key as keyof typeof updates]);
      field.value = value;
      field.dispatchEvent(new Event('input'));
    }
    element.querySelector<HTMLInputElement>('#survey-stopping')?.click();
    const count = element.querySelector<HTMLInputElement>('#survey-team-count');
    if (!count) throw new Error('Missing team count');
    count.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    count.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    fixture.detectChanges();
    await fixture.whenStable();
    button('save').click();
    expect(close).toHaveBeenCalledWith({ ...survey, ...updates, desiredTeamCount: 0, stoppingCompetition: true });
    expect(survey.comments).toBe('Existing remarks');
  });

  it('initializes an absent survey with editable defaults and creates manual identity/matching metadata', async () => {
    const { element, close, button, player } = await render();
    expect(element.querySelector<HTMLInputElement>('#survey-team-count')?.value).toBe('1');
    expect(element.querySelector<HTMLInputElement>('#survey-stopping')?.checked).toBe(false);
    expect(
      [...element.querySelectorAll<HTMLInputElement>('input[type=text], textarea')].filter((field) => field.value !== '' && field.value !== '1'),
    ).toEqual([]);
    button('save').click();
    expect(close).toHaveBeenCalledWith({
      ...survey,
      externalId: '',
      createdOn: expect.any(String),
      createdBy: 'manual',
      currentTeams: [],
      desiredTeamCount: 1,
      preferredPlayDay: '',
      team1Choice1: '',
      team1Choice2: '',
      team2Choice1: '',
      team2Choice2: '',
      canMeet75PercentTeam1: '',
      canMeet75PercentTeam2: '',
      unavailabilityPeriodsTeam1: '',
      unavailabilityPeriodsTeam2: '',
      comments: '',
      meetingAttendance: '',
      availableDates: [],
      linkedContactIds: [],
      matchConfidence: 'high',
    });
    expect(player.survey).toBeUndefined();
  });

  it('cancels edited values without changing the existing survey', async () => {
    const { element, close, button, player } = await render(survey);
    const comments = element.querySelector<HTMLTextAreaElement>('#survey-comments');
    if (!comments) throw new Error('Missing remarks');
    comments.value = 'Discard these changes';
    comments.dispatchEvent(new Event('input'));
    button('cancel').click();
    expect(close).toHaveBeenCalledWith(null);
    expect(player.survey).toBe(survey);
    expect(player.survey?.comments).toBe('Existing remarks');
  });
});
