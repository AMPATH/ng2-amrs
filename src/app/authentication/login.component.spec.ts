import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
  Http, Response, Headers, BaseRequestOptions,
  ResponseOptions
} from '@angular/http';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { SessionService } from '../openmrs-api/session.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { SessionStorageService } from '../utils/session-storage.service';

// Load the implementations that should be tested
import { LoginComponent } from './login.component';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { UserDefaultPropertiesService } from
  '../user-default-properties/user-default-properties.service';
import { UserService } from '../openmrs-api/user.service';

describe('LoginComponent Unit Tests', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backendInstance: MockBackend,
          defaultOptions: BaseRequestOptions) => {
          return new Http(backendInstance, defaultOptions);
        },
        deps: [MockBackend, BaseRequestOptions]
      },
      LoginComponent,
      AuthenticationService,
      AppSettingsService,
      SessionService,
      LocalStorageService,
      SessionStorageService,
      provideRoutes([]),
      UserDefaultPropertiesService,
      UserService
    ],
    imports: [
      RouterTestingModule
    ]
  }));

  it('should have required variables', inject([LoginComponent],
    (loginComponent: LoginComponent) => {
      expect(loginComponent.loginSuccess).toBeTruthy();
      expect(loginComponent.loginFailure).toBeTruthy();
      expect(loginComponent.error).toBe(undefined);
    }));
});
