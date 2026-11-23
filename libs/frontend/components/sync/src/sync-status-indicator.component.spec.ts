import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Tag } from 'primeng/tag';
import { SyncStatusConfig, SyncStatusIndicatorComponent, SyncStatusType } from './sync-status-indicator.component';

describe('SyncStatusIndicatorComponent', () => {
  let fixture: ComponentFixture<SyncStatusIndicatorComponent>;
  const config: SyncStatusConfig = {
    entityType: 'competition',
    entityCode: 'test-competition',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncStatusIndicatorComponent, TranslateModule.forRoot()],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      all: {
        sync: {
          status: {
            synced: 'Synced',
            syncing: 'Syncing',
            queued: 'Queued',
            failed: 'Failed',
            neverSynced: 'Never synced',
          },
        },
      },
    });
    translate.use('en');
    fixture = TestBed.createComponent(SyncStatusIndicatorComponent);
    fixture.componentRef.setInput('config', config);
  });

  it.each<[SyncStatusType, string, string, string]>([
    ['synced', 'success', 'pi-check-circle', 'Synced'],
    ['syncing', 'info', 'pi-spinner', 'Syncing'],
    ['queued', 'warn', 'pi-clock', 'Queued'],
    ['failed', 'danger', 'pi-exclamation-triangle', 'Failed'],
    ['never-synced', 'secondary', 'pi-minus-circle', 'Never synced'],
  ])('renders %s with native severity and a non-color name', (currentStatus, severity, icon, name) => {
    fixture.componentRef.setInput('config', { ...config, currentStatus });
    fixture.detectChanges();

    const tag = fixture.debugElement.query(By.directive(Tag));
    expect(tag.componentInstance.severity()).toBe(severity);
    expect(tag.nativeElement.querySelector(`.${icon}`)).toBeTruthy();
    expect(tag.nativeElement.getAttribute('role')).toBe('img');
    expect(tag.nativeElement.getAttribute('aria-label')).toBe(name);
    expect(tag.nativeElement.textContent.trim()).toBe('');
    expect(fixture.nativeElement.querySelector('button, a, [tabindex]')).toBeNull();
  });

  it('updates the accessible name and appearance when parent status changes', () => {
    fixture.componentRef.setInput('config', {
      ...config,
      currentStatus: 'syncing',
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.pi-spin')).toBeTruthy();

    fixture.componentRef.setInput('config', {
      ...config,
      currentStatus: 'failed',
    });
    fixture.detectChanges();
    const tag = fixture.debugElement.query(By.directive(Tag));
    expect(tag.nativeElement.getAttribute('aria-label')).toBe('Failed');
    expect(tag.componentInstance.severity()).toBe('danger');
    expect(fixture.nativeElement.querySelector('.pi-spin')).toBeNull();
  });
});
