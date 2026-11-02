import { Route } from '@angular/router';
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

  it('preserves tournament detail, editing, enrollment, draw and live routes', () => {
    expect(routePaths(routes)).toEqual(
      expect.arrayContaining([
        'create',
        ':tournamentId',
        ':tournamentId/edit',
        ':tournamentId/admin',
        ':tournamentId/my-enrollments',
        ':tournamentId/enroll',
        ':tournamentId/sub-events/:subEventId/enroll',
        ':tournamentId/sub-events/:subEventId/draws/:drawId',
        ':tournamentId/live/courts',
        ':tournamentId/live/results',
        ':tournamentId/live/upcoming',
        ':tournamentId/live/kiosk',
      ]),
    );
  });
});
