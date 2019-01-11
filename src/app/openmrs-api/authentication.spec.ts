import { TestBed, async, inject } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { SessionService } from './session.service';
import { AuthenticationService } from './authentication.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { CookieService, CookieModule } from 'ngx-cookie';

import { Constants } from '../utils/constants';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('AuthenticationService Unit Tests', () => {
  let authenticatiService: AuthenticationService;

  let sessionStorageService: SessionStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CookieModule.forRoot()],
      declarations: [],
      providers: [
        AppSettingsService,
        SessionService,
        LocalStorageService,
        SessionStorageService,
        AuthenticationService,
        CookieService
      ],
    });

    authenticatiService = TestBed.get(AuthenticationService);
    sessionStorageService = TestBed.get(SessionStorageService);
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be defined', () => {
    expect(authenticatiService).toBeDefined();
  });

  it('it should authenticate user requests', () => {
    const username = 'test';
    const password = 'test';
    const res = {
      authenticated: true,
      user: {}
    };
    authenticatiService.authenticate(username, password)
      .subscribe((response) => {
        expect(res.authenticated).toEqual(true);
        expect(res.user).toBeTruthy();

        const expectedCredentials = btoa(username + ':' + password);
        expect(sessionStorageService.getItem(Constants.CREDENTIALS_KEY))
          .toEqual(expectedCredentials);
        expect(sessionStorageService.getItem(Constants.USER_KEY))
          .toEqual(JSON.stringify({}));
      });
  });

  it('it should clear user details on logout', () => {
    authenticatiService.logOut()
      .subscribe((response) => {
        expect(response).toEqual({});
        expect(sessionStorageService.getItem(Constants.CREDENTIALS_KEY)).toEqual(null);
        expect(sessionStorageService.getItem(Constants.USER_KEY)).toEqual(null);
      });
  });
});
