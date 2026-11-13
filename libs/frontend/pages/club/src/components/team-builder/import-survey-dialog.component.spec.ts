import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Player } from '@app/models';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { Tag } from 'primeng/tag';
import { ExcelParserService } from '../../pages/detail/tabs/team-builder/services/excel-parser.service';
import { MatchResult, PlayerMatcherService } from '../../pages/detail/tabs/team-builder/services/player-matcher.service';
import { SurveyResponse } from '../../pages/detail/tabs/team-builder/types/survey-response';
import { ImportSurveyDialogComponent } from './import-survey-dialog.component';

describe('ImportSurveyDialogComponent', () => {
  const prefix = 'all.club.teamBuilder.import.';
  const survey: SurveyResponse = {
    externalId: '',
    createdOn: '',
    createdBy: '',
    fullName: 'Example Player',
    firstName: 'Example',
    lastName: 'Player',
    currentTeams: [],
    desiredTeamCount: 1,
    preferredPlayDay: '',
    team1Choice1: '',
    team1Choice2: '',
    team2Choice1: '',
    team2Choice2: '',
    canMeet75PercentTeam1: '',
    unavailabilityPeriodsTeam1: '',
    canMeet75PercentTeam2: '',
    unavailabilityPeriodsTeam2: '',
    comments: '',
    meetingAttendance: '',
    availableDates: [],
    stoppingCompetition: false,
    linkedContactIds: [],
  };

  async function render() {
    const parser = { parseFile: jest.fn().mockResolvedValue([survey]) };
    const matcher = { matchPlayers: jest.fn().mockResolvedValue([]), searchPlayerByName: jest.fn() };
    const close = jest.fn();
    await TestBed.configureTestingModule({
      imports: [ImportSurveyDialogComponent, TranslateModule.forRoot()],
      providers: [
        { provide: DynamicDialogConfig, useValue: { data: { systemId: 'example-system', clubPlayers: [] } } },
        { provide: DynamicDialogRef, useValue: { close } },
      ],
    })
      .overrideComponent(ImportSurveyDialogComponent, {
        set: {
          providers: [
            { provide: ExcelParserService, useValue: parser },
            { provide: PlayerMatcherService, useValue: matcher },
          ],
        },
      })
      .compileComponents();
    const fixture = TestBed.createComponent(ImportSurveyDialogComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    return { fixture, component: fixture.componentInstance, element: fixture.nativeElement as HTMLElement, parser, matcher, close };
  }

  it('only parses validated local uploads and shows processing, failure and retry states', async () => {
    const { fixture, component, element, parser, matcher } = await render();
    const uploader = fixture.debugElement.query(By.directive(FileUpload)).injector.get(FileUpload);
    const select = (file: File) => uploader.onFileSelect({ type: 'change', target: { files: [file] } });
    select(new File(['invalid'], 'survey.txt', { type: 'text/plain' }));
    select(new File([new Uint8Array(10000001)], 'large.xlsx'));
    expect(parser.parseFile).not.toHaveBeenCalled();
    expect(component.step()).toBe('upload');
    let rejectParse!: (reason: Error) => void;
    parser.parseFile.mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectParse = reject;
      }),
    );
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    select(new File(['example'], 'survey.xlsx'));
    fixture.detectChanges();
    expect(component.step()).toBe('matching');
    expect(element.querySelector('[role="status"]')?.textContent).toContain(prefix + 'matching');
    expect(element.querySelector('p-progressbar')).not.toBeNull();
    rejectParse(new Error('Invalid workbook'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelector('p-message')?.textContent).toContain(prefix + 'failed');
    expect(component.loading()).toBe(false);
    expect(log).toHaveBeenCalled();
    log.mockRestore();
    const retryUploader = fixture.debugElement.query(By.directive(FileUpload)).injector.get(FileUpload);
    retryUploader.onFileSelect({ type: 'change', target: { files: [new File(['example'], 'survey.xlsx')] } });
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.step()).toBe('review');
    expect(matcher.matchPlayers).toHaveBeenCalledWith([survey], 'example-system', []);
    expect(element.querySelector('p-message')?.textContent).toContain(prefix + 'empty');
    expect([...element.querySelectorAll('button')].find((button) => button.textContent?.includes(prefix + 'confirm'))?.disabled).toBe(true);
    expect(component.importError()).toBe(false);
  });

  it('names row actions and keeps counts, manual selection and exact confirmation payloads', async () => {
    const { fixture, component, element, close } = await render();
    const results: MatchResult[] = [{ survey: { ...survey }, player: null, confidence: 'none' }];
    component.matchResults.set(results);
    component.step.set('review');
    fixture.detectChanges();
    expect(element.textContent).toContain(prefix + 'confidenceLevels.none');
    const confirmButton = [...element.querySelectorAll('button')].find((button) => button.textContent?.includes(prefix + 'confirm'));
    expect(confirmButton?.disabled).toBe(true);
    const createButton = [...element.querySelectorAll('button')].find((button) => button.textContent?.includes(prefix + 'createNew'));
    createButton?.click();
    fixture.detectChanges();
    expect(component.createNewCount).toBe(1);
    expect(confirmButton?.disabled).toBe(false);
    element.querySelector<HTMLButtonElement>('button[aria-label*="cancelCreate"]')?.click();
    fixture.detectChanges();
    expect(component.actionableCount).toBe(0);
    element.querySelector<HTMLButtonElement>('button[aria-label*="selectPlayer"]')?.click();
    fixture.detectChanges();
    const input = element.querySelector<HTMLInputElement>('input[role="combobox"]');
    expect(input?.labels?.[0]?.textContent).toContain(prefix + 'selectPlayer');
    const player = Object.assign(new Player(), { id: 'example-player', firstName: 'Example', lastName: 'Player' });
    component.onPlayerSelected(results[0], player);
    fixture.detectChanges();
    expect(component.matchedCount).toBe(1);
    expect(component.createNewCount).toBe(0);
    expect(results[0].survey.matchedPlayerId).toBe(player.id);
    expect(element.textContent).toContain(prefix + 'confidenceLevels.high');
    confirmButton?.click();
    expect(close).toHaveBeenCalledWith(component.matchResults());
    expect(close.mock.calls[0][0][0]).toBe(results[0]);
  });

  it('cancels from every step without applying results', async () => {
    const { fixture, component, element, close } = await render();
    for (const step of ['upload', 'matching', 'review'] as const) {
      component.step.set(step);
      fixture.detectChanges();
      const cancel = [...element.querySelectorAll('button')].find((button) => button.textContent?.includes(prefix + 'cancel'));
      expect(cancel).toBeDefined();
      cancel?.click();
    }
    expect(close.mock.calls).toEqual([[null], [null], [null]]);
  });

  it('distinguishes every matched confidence level with localized text and native severity', async () => {
    const { fixture, component } = await render();
    component.matchResults.set(
      (['high', 'medium', 'low'] as const).map((confidence) => ({
        survey: { ...survey },
        player: Object.assign(new Player(), { firstName: 'Example', lastName: 'Player' }),
        confidence,
      })),
    );
    component.step.set('review');
    fixture.detectChanges();
    const tags = fixture.debugElement.queryAll(By.directive(Tag)).map((tag) => tag.injector.get(Tag));
    expect(tags.map((tag) => tag.value())).toEqual(['high', 'medium', 'low'].map((level) => prefix + 'confidenceLevels.' + level));
    expect(tags.map((tag) => tag.severity())).toEqual(['success', 'warn', 'danger']);
  });
});
