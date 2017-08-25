import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { SessionService } from './session.service';
import { AuthenticationService } from './authentication.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { CookieService, CookieModule } from 'ngx-cookie';

import { Constants } from '../utils/constants';


// Load the implementations that should be tested

describe('AuthenticationService Unit Tests', () => {

  let appSettingsService: AppSettingsService;
  let sessionStorageService: SessionStorageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CookieModule.forRoot()],
      declarations: [],
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        AppSettingsService,
        SessionService,
        LocalStorageService,
        SessionStorageService,
        AuthenticationService,
        CookieService
      ],
    });
  }));

  it('it should authenticate user requests', inject([MockBackend,
    SessionStorageService, AuthenticationService],
    (backend: MockBackend, service: SessionStorageService,
      authenticationService: AuthenticationService) => {

      let username = 'test';
      let password = 'test';

      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({
          body: JSON.stringify({
            authenticated: true,
            user: {}
          })
        });
        connection.mockRespond(new Response(options));
      });

      authenticationService.authenticate(username, password)
        .subscribe((response) => {
          expect(response.json().authenticated).toEqual(true);
          expect(response.json().user).toBeTruthy();

          let expectedCredentials = btoa(username + ':' + password);
          expect(service.getItem(Constants.CREDENTIALS_KEY))
            .toEqual(expectedCredentials);
          expect(service.getItem(Constants.USER_KEY))
            .toEqual(JSON.stringify({}));
        });
    }));

  it('it should clear user details on logout', inject([MockBackend,
    SessionStorageService, AuthenticationService],
    (backend: MockBackend, service: SessionStorageService,
      authenticationService: AuthenticationService) => {

      backend.connections.subscribe((connection: MockConnection) => {
        let options = new ResponseOptions({
          body: JSON.stringify({})
        });
        connection.mockRespond(new Response(options));
      });

      authenticationService.logOut()
        .subscribe((response) => {
          expect(response.json()).toEqual({});

          expect(service.getItem(Constants.CREDENTIALS_KEY)).toEqual(null);
          expect(service.getItem(Constants.USER_KEY)).toEqual(null);
        });

    }));
});
