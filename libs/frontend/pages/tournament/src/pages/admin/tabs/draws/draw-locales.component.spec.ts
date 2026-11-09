import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { of, throwError } from 'rxjs';
import { DrawsTabComponent } from './draws-tab.component';
import { DrawsTabService } from './draws-tab.service';

const locales = ['en', 'nl_BE', 'fr_BE'] as const;
const prefix = 'all.tournament.admin.draws.';
const operations = [
  { key: 'generateEntriesFailed', run: (service: DrawsTabService) => service.generateEntries('safe-sub-event', true) },
  { key: 'deleteDrawFailed', run: (service: DrawsTabService) => service.deleteDraw('safe-draw') },
  { key: 'assignEntriesFailed', run: (service: DrawsTabService) => service.assignEntriesToDraw(['safe-entry'], 'safe-draw') },
  { key: 'removeEntryFailed', run: (service: DrawsTabService) => service.removeEntryFromDraw('safe-entry') },
  { key: 'clearSeedsFailed', run: (service: DrawsTabService) => service.clearDrawSeeds('safe-draw') },
] as const;

function dictionary(locale: string) {
  return JSON.parse(readFileSync(join(process.cwd(), 'libs', 'backend', 'translate', 'assets', 'i18n', locale, 'all.json'), 'utf8'));
}

describe.each(locales)('Mounted draw locales: %s', (locale) => {
  let fixture: ComponentFixture<DrawsTabComponent>;
  let translate: TranslateService;
  let query: jest.Mock;
  let mutate: jest.Mock;
  const entry = { id: 'safe-entry' };
  const draw = { id: 'safe-draw', name: 'Safe "named" draw', type: 'KO', entries: [entry] };

  beforeEach(async () => {
    query = jest.fn(() =>
      of({
        data: {
          tournamentSubEvent: {
            entries: [entry],
            unassignedEntries: [entry],
            drawTournaments: [
              draw,
              { ...draw, id: 'safe-poule', type: 'POULE' },
              { ...draw, id: 'safe-qualification', type: 'QUALIFICATION' },
              { ...draw, id: 'safe-unknown', type: undefined },
              { ...draw, id: 'safe-future', type: 'FUTURE_TYPE' },
            ],
          },
        },
      }),
    );
    mutate = jest.fn();
    await TestBed.configureTestingModule({
      imports: [DrawsTabComponent, TranslateModule.forRoot()],
      providers: [{ provide: Apollo, useValue: { query, mutate } }],
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    locales.forEach((language) => translate.setTranslation(language, { all: dictionary(language) }));
    translate.use(locale);
    fixture = TestBed.createComponent(DrawsTabComponent);
    fixture.componentRef.setInput('tournament', {
      id: 'safe-tournament',
      tournamentSubEvents: [{ id: 'safe-sub-event', name: 'Safe singles', gameType: 'S' }],
    });
  });

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('renders all descriptions, friendly type labels and unknown identities without hiding future type codes', async () => {
    await settle();
    const copy = dictionary(locale).tournament.admin.draws;
    const host: HTMLElement = fixture.nativeElement;
    fixture.componentInstance.summaryItems.forEach((item, index) => {
      expect(copy[item.description].trim()).not.toBe('');
      expect(host.querySelectorAll('[data-testid="draws-summary"] dl > div')[index].textContent).toContain(copy[item.description]);
    });
    expect(Array.from(host.querySelectorAll('[data-testid="draw"] p-tag'), (tag) => tag.textContent?.trim())).toEqual([
      copy.knockout,
      copy.roundRobin,
      copy.qualification,
      dictionary(locale).common.unknown,
      'FUTURE_TYPE',
    ]);
    expect(host.querySelector('[data-testid="draw"] tbody')?.textContent).toContain(dictionary(locale).common.unknown);
    expect(host.textContent).not.toContain('all.tournament.');
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each([
    { key: 'confirmRegenerateEntries', run: (component: DrawsTabComponent) => component.generateEntries() },
    { key: 'confirmDeleteDraw', run: (component: DrawsTabComponent) => component.deleteDraw(draw) },
    { key: 'confirmClearSeeds', run: (component: DrawsTabComponent) => component.clearSeeds(draw) },
  ])('localizes $key and preserves cancellation without writes', async ({ key, run }) => {
    await settle();
    const confirmation = jest.spyOn(window, 'confirm').mockReturnValue(false);
    try {
      await run(fixture.componentInstance);
      const expected = translate.instant(prefix + key, { name: draw.name });
      expect(expected).not.toBe(prefix + key);
      expect(expected.trim()).not.toBe('');
      expect(confirmation).toHaveBeenCalledWith(expected);
      if (key !== 'confirmRegenerateEntries') expect(expected).toContain(draw.name);
      expect(mutate).not.toHaveBeenCalled();
      expect(query).toHaveBeenCalledTimes(1);
    } finally {
      confirmation.mockRestore();
    }
  });

  it('preserves accepted regeneration payload and successful refetch', async () => {
    await settle();
    const confirmation = jest.spyOn(window, 'confirm').mockReturnValue(true);
    mutate.mockReturnValueOnce(of({ data: { generateEntriesFromEnrollments: [entry] } }));
    try {
      await fixture.componentInstance.generateEntries();
      await settle();
      expect(mutate.mock.calls[0][0].variables).toEqual({ input: { subEventId: 'safe-sub-event', force: true } });
      expect(query).toHaveBeenCalledTimes(2);
    } finally {
      confirmation.mockRestore();
    }
  });

  it('switches locales without losing selected identities, draft values or option payloads and without extra reads', async () => {
    await settle();
    const component = fixture.componentInstance;
    component.selectedEntries.set(component.unassignedEntries());
    component.targetDrawId.set(draw.id);
    component.openCreateDrawDialog();
    component.drawForm.patchValue({ name: 'Safe draft', type: 'POULE', size: 16 });
    component.seedingMethod.setValue('RANDOM');
    for (const language of locales) {
      translate.use(language);
      await settle();
      const copy = dictionary(language).tournament.admin.draws;
      expect(component.drawTypeOptions().map((option) => option.label)).toEqual([copy.knockout, copy.roundRobin, copy.qualification]);
      expect(component.drawTypeOptions().map((option) => option.value)).toEqual(['KO', 'POULE', 'QUALIFICATION']);
      expect(component.seedingMethodOptions().map((option) => option.label)).toEqual([copy.seedByRanking, copy.seedRandom, copy.seedManual]);
      expect(component.seedingMethodOptions().map((option) => option.value)).toEqual(['BY_RANKING', 'RANDOM', 'MANUAL']);
      expect(component.drawSizeOptions().map((option) => option.value)).toEqual([4, 8, 16, 32, 64]);
      expect(component.drawSizeOptions()[2].label).toBe(`16 ${dictionary(language).tournament.entries}`);
      expect(component.drawForm.getRawValue()).toEqual({ name: 'Safe draft', type: 'POULE', size: 16 });
      expect(component.seedingMethod.value).toBe('RANDOM');
      expect(component.selectedSubEvent()?.id).toBe('safe-sub-event');
      expect(component.selectedEntries()).toEqual([entry]);
      expect(component.targetDrawId()).toBe(draw.id);
      expect(component.getEntryName(entry)).toBe(dictionary(language).common.unknown);
    }
    component.closeCreateDrawDialog();
    await settle();
    expect(query).toHaveBeenCalledTimes(1);
    expect(mutate).not.toHaveBeenCalled();
  });

  it.each(operations)('localizes non-Error $key, preserves server diagnostics and recovers after failure', async ({ key, run }) => {
    const service = TestBed.runInInjectionContext(() => new DrawsTabService());
    const refetch = jest.spyOn(service, 'refetch');
    mutate.mockReturnValueOnce(throwError(() => 'safe non-Error failure'));
    expect(await run(service)).toBe(false);
    expect(dictionary(locale).tournament.admin.draws[key].trim()).not.toBe('');
    expect(service.updateError()).toBe(dictionary(locale).tournament.admin.draws[key]);
    expect(service.updateError()).not.toBe(prefix + key);
    expect(service.updating()).toBe(false);
    expect(refetch).not.toHaveBeenCalled();

    mutate.mockReturnValueOnce(throwError(() => new Error('Safe server diagnostic')));
    expect(await run(service)).toBe(false);
    expect(service.updateError()).toBe('Safe server diagnostic');
    expect(refetch).not.toHaveBeenCalled();

    mutate.mockReturnValueOnce(
      of({
        data: {
          generateEntriesFromEnrollments: [],
          deleteTournamentDraw: true,
          assignEntriesToDraw: [],
          removeEntryFromDraw: entry,
          clearDrawSeeds: [],
        },
      }),
    );
    expect(await run(service)).toBe(true);
    expect(service.updateError()).toBeNull();
    expect(service.updating()).toBe(false);
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
