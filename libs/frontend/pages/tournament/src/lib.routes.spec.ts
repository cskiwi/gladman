import { TestBed } from '@angular/core/testing';
import { provideRouter, Route, Router } from '@angular/router';
import { routes } from './lib.routes';

function routePaths(config: Route[], prefix = ''): string[] {
  return config.flatMap((route) => {
    const path = [prefix, route.path].filter(Boolean).join('/');
    return [path, ...routePaths(route.children ?? [], path)];
  });
}

describe('Tournament route contract', () => {
  it('does not expose the retired club tournament page', () => {
    expect(routePaths(routes).some((path) => path.split('/').includes('club'))).toBe(false);
  });

  it('exposes general enrollment but not the retired sub-event or my-enrollments pages', () => {
    const paths = routePaths(routes);
    expect(paths).toContain(':tournamentId/enroll');
    expect(paths).not.toContain(':tournamentId/my-enrollments');
    expect(paths).not.toContain(':tournamentId/sub-events/:subEventId/enroll');
  });

  it.each(['/tournament/test/my-enrollments', '/tournament/test/sub-events/test/enroll'])('does not match retired URL %s', async (url) => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'tournament', children: routes }])],
    });
    await expect(TestBed.inject(Router).navigateByUrl(url)).rejects.toThrow('Cannot match any routes');
  });

  it('preserves tournament detail, editing, enrollment, draw and live routes', () => {
    expect(routePaths(routes)).toEqual(
      expect.arrayContaining([
        'create',
        ':tournamentId',
        ':tournamentId/edit',
        ':tournamentId/admin',
        ':tournamentId/enroll',
        ':tournamentId/sub-events/:subEventId/draws/:drawId',
        ':tournamentId/live/courts',
        ':tournamentId/live/results',
        ':tournamentId/live/upcoming',
        ':tournamentId/live/kiosk',
      ]),
    );
  });
});
