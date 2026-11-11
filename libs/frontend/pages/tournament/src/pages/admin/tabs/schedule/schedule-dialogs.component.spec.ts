import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ScheduleStrategy } from '@app/models-enum';
import { TranslateModule } from '@ngx-translate/core';
import { ScheduleAutoDialogComponent } from './schedule-auto-dialog.component';
import { ScheduleGenerateDialogComponent } from './schedule-generate-dialog.component';

describe('schedule dialogs', () => {
  describe('generate dialog', () => {
    let fixture: ComponentFixture<ScheduleGenerateDialogComponent>;
    let component: ScheduleGenerateDialogComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ScheduleGenerateDialogComponent, TranslateModule.forRoot(), NoopAnimationsModule],
      }).compileComponents();
      fixture = TestBed.createComponent(ScheduleGenerateDialogComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('courts', [{ id: 'c1', name: 'Court 1' }]);
      fixture.componentRef.setInput('firstDay', '2026-11-09T00:00:00Z');
    });

    it('resets to defaults with all courts and the first day each time it opens', async () => {
      component.visible.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.form.getRawValue()).toMatchObject({
        courtIds: ['c1'],
        startTime: '09:00',
        endTime: '18:00',
        slotDurationMinutes: 30,
        breakMinutes: 0,
      });
      expect(component.form.controls.dates.value).toHaveLength(1);
      component.form.controls.startTime.setValue('10:00');
      component.visible.set(false);
      fixture.detectChanges();
      component.visible.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.form.controls.startTime.value).toBe('09:00');
    });

    it('emits the form value once and ignores submit while updating or invalid', async () => {
      const emitted: unknown[] = [];
      component.generate.subscribe((value) => emitted.push(value));
      component.visible.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
      component.submit();
      expect(emitted).toEqual([expect.objectContaining({ courtIds: ['c1'], slotDurationMinutes: 30, breakMinutes: 0 })]);
      fixture.componentRef.setInput('updating', true);
      component.submit();
      component.form.controls.courtIds.setValue([]);
      fixture.componentRef.setInput('updating', false);
      component.submit();
      expect(emitted).toHaveLength(1);
    });

    it('offers the courts of the chosen venue, selects them all, and keeps input when venues load later', async () => {
      component.visible.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
      component.form.controls.startTime.setValue('10:00');
      fixture.componentRef.setInput('venues', [
        {
          id: 'v1',
          name: 'Hall',
          courts: [
            { id: 'a', name: 'Court 1' },
            { id: 'b', name: 'Court 2' },
          ],
        },
      ]);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(component.form.controls.startTime.value).toBe('10:00');
      expect(component.courtOptions()).toEqual([{ id: 'c1', name: 'Court 1' }]);
      component.venueControl.setValue('v1');
      component.onVenueChange();
      expect(component.courtOptions().map((court) => court.id)).toEqual(['a', 'b']);
      expect(component.form.controls.courtIds.value).toEqual(['a', 'b']);
    });

    it('does not close while updating', () => {
      component.visible.set(true);
      fixture.componentRef.setInput('updating', true);
      component.close();
      expect(component.visible()).toBe(true);
      fixture.componentRef.setInput('updating', false);
      component.close();
      expect(component.visible()).toBe(false);
    });
  });

  describe('auto-schedule dialog', () => {
    let fixture: ComponentFixture<ScheduleAutoDialogComponent>;
    let component: ScheduleAutoDialogComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ScheduleAutoDialogComponent, TranslateModule.forRoot(), NoopAnimationsModule],
      }).compileComponents();
      fixture = TestBed.createComponent(ScheduleAutoDialogComponent);
      component = fixture.componentInstance;
    });

    it('defaults to minimize wait with 15 minutes rest and emits the selection', async () => {
      const emitted: unknown[] = [];
      component.run.subscribe((value) => emitted.push(value));
      component.visible.set(true);
      fixture.detectChanges();
      await fixture.whenStable();
      component.form.controls.minRestMinutes.setValue(null);
      component.submit();
      expect(emitted).toEqual([{ strategy: ScheduleStrategy.MINIMIZE_WAIT, minRestMinutes: 15 }]);
    });

    it('limits listed conflicts to five and counts the rest', () => {
      const conflicts = Array.from({ length: 8 }, (_, i) => ({
        gameId: `g${i}`,
        playerId: 'p',
        playerName: 'Safe',
        conflictingGameIds: [],
        message: `Conflict ${i}`,
      }));
      fixture.componentRef.setInput('result', { scheduledCount: 3, skippedCount: 8, conflicts });
      expect(component.listedConflicts()).toHaveLength(5);
      expect(component.hiddenConflictCount()).toBe(3);
    });

    it('does not submit while updating', () => {
      const emitted: unknown[] = [];
      component.run.subscribe((value) => emitted.push(value));
      fixture.componentRef.setInput('updating', true);
      component.submit();
      expect(emitted).toHaveLength(0);
    });
  });
});
