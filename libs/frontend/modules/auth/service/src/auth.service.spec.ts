import { makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Player } from '@app/models';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { Apollo } from 'apollo-angular';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { of, Subject } from 'rxjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('restores the authenticated user from SSR before Auth0 initializes', () => {
    const user = { id: 'player-id', fullName: 'SSR User' } as Player;
    const authenticated = new Subject<boolean>();

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: Apollo, useValue: { query: jest.fn(() => of({ data: { me: user } })) } },
        {
          provide: Auth0Service,
          useValue: {
            isAuthenticated$: authenticated.asObservable(),
            getAccessTokenSilently: () => of('browser-token'),
          },
        },
        { provide: SsrCookieService, useValue: { check: () => false, get: () => '', set: jest.fn() } },
      ],
    });

    const transferState = TestBed.inject(TransferState);
    transferState.set(makeStateKey<{ loggedIn: boolean; user: Player | null }>('auth.state'), {
      loggedIn: true,
      user,
    });

    const auth = TestBed.inject(AuthService);

    expect(auth.loggedIn()).toBe(true);
    expect(auth.user()).toEqual(user);
    expect(transferState.hasKey(makeStateKey('auth.state'))).toBe(false);
  });
});
