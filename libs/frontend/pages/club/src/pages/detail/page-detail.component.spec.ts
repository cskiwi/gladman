import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { AuthService } from '@app/frontend-modules-auth/service';
import { SeoService } from '@app/frontend-modules-seo/service';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { PageDetailComponent } from './page-detail.component';

describe('club detail tab navigation', () => {
  const canEdit = signal(false);

  beforeEach(() => {
    canEdit.set(false);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: ':clubId', component: PageDetailComponent }]),
        { provide: AuthService, useValue: { hasAnyPermission: () => canEdit() } },
        { provide: SeoService, useValue: { update: jest.fn() } },
        { provide: Apollo, useValue: { query: () => of({ data: { club: { id: 'club', teams: [] } } }) } },
      ],
    }).overrideComponent(PageDetailComponent, { set: { template: '' } });
  });

  it('restores valid tabs and falls back for missing or invalid values', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/club?tab=schedule', PageDetailComponent);
    expect(component.activeTab()).toBe('schedule');

    for (const tab of ['overview', 'players', 'tournaments']) {
      await harness.navigateByUrl(`/club?tab=${tab}`, PageDetailComponent);
      expect(component.activeTab()).toBe(tab);
    }

    await harness.navigateByUrl('/club?tab=invalid', PageDetailComponent);
    expect(component.activeTab()).toBe('overview');
    await harness.navigateByUrl('/club', PageDetailComponent);
    expect(component.activeTab()).toBe('overview');
  });

  it('updates the URL while preserving other parameters and follows route changes', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/club?filter=active&tab=players', PageDetailComponent);
    const router = TestBed.inject(Router);

    component.onTabChange('tournaments');
    await harness.fixture.whenStable();
    expect(router.parseUrl(router.url).queryParams).toEqual({ filter: 'active', tab: 'tournaments' });
    expect(component.activeTab()).toBe('tournaments');

    await harness.navigateByUrl('/club?filter=active&tab=players', PageDetailComponent);
    expect(component.activeTab()).toBe('players');
  });

  it('only activates the team builder when permission is available', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/club?tab=team-builder', PageDetailComponent);
    expect(component.activeTab()).toBe('overview');

    canEdit.set(true);
    expect(component.activeTab()).toBe('team-builder');
    canEdit.set(false);
    expect(component.activeTab()).toBe('overview');
  });
});
