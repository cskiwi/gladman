import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SettingsDialogComponent } from './settings-dialog.component';

describe('SettingsDialogComponent accessibility', () => {
  it('names all six numeric fields and associates the four help texts', async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsDialogComponent, TranslateModule.forRoot()],
      providers: [
        { provide: DynamicDialogConfig, useValue: { data: {} } },
        { provide: DynamicDialogRef, useValue: { close: jest.fn() } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SettingsDialogComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const element: HTMLElement = fixture.nativeElement;
    const fields = [...element.querySelectorAll('input')];
    const prefix = 'all.club.teamBuilder.settings.';

    expect(fields.map((field) => field.labels?.[0]?.textContent?.trim())).toEqual(
      ['presenceThreshold', 'performanceThreshold', 'minPlayersPerTeam', 'minMalesPerMxTeam', 'minFemalesPerMxTeam', 'maxPlayersPerTeam'].map(
        (key) => prefix + key,
      ),
    );
    expect(
      fields
        .filter((field) => field.hasAttribute('aria-describedby'))
        .map((field) => element.querySelector(`#${field.getAttribute('aria-describedby')}`)?.textContent?.trim()),
    ).toEqual(['presenceThresholdHelp', 'performanceThresholdHelp', 'minPlayersPerTeamHelp', 'maxPlayersPerTeamHelp'].map((key) => prefix + key));
  });
});
