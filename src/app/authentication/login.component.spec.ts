import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRoutes, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';

import { of, Subject } from 'rxjs';

import { CookieModule, CookieService } from 'ngx-cookie';
import { FormSchemaCompiler } from '@ampath-kenya/ngx-openmrs-formentry';
import { LoginComponent } from './login.component';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { ToastrService, ToastrModule } from 'ngx-toastr';

import { AuthenticationService } from '../openmrs-api/authentication.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { FormListService } from '../patient-dashboard/common/forms/form-list.service';
import { FormOrderMetaDataService } from '../patient-dashboard/common/forms/form-order-metadata.service';
import { FormSchemaService } from '../patient-dashboard/common/formentry/form-schema.service';
import { FormUpdaterService } from '../patient-dashboard/common/formentry/form-updater.service';
import { FormsResourceService } from '../openmrs-api/forms-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { OnlineTrackerService } from '../online-tracker/online-tracker.service';
import { SessionService } from '../openmrs-api/session.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { UserService } from '../openmrs-api/user.service';
import { UserDefaultPropertiesService } from '../user-default-properties/user-default-properties.service';
import { click } from '../test-helpers';

const testServerTemplates = [
  {
    name: 'AMRS POC',
    amrsURL: '/amrs',
    etlUrl: '/etl-latest/etl'
  }
];

const appSettingsServiceStub = {
  getServerTemplates: () => testServerTemplates,
  getOpenmrsRestbaseurl: () => '/amrs/ws/rest/v1'
};

const formUpdaterServiceStub = {
  lastChecked: () => new Date(),
  getDateLastChecked: () => new Date().toDateString(),
  getUpdatedForms: () => of([])
};

const localStorageServiceStub = {
  getItem: () => '',
  getObject: () => {},
  setItem: (item) => {},
  setObject: (obj) => {}
};

describe('LoginComponent Unit Tests', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;
  let authService: AuthenticationService;
  let formUpdaterService: FormUpdaterService;
  let authenticateSpy: jasmine.Spy;
  let router: Router;

  let usernameInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let loginBtn: HTMLButtonElement;
  let buildVersion: HTMLParagraphElement;

  class MockSwUpdate {
    $$availableSubj = new Subject<{ available: { hash: string } }>();
    $$activatedSubj = new Subject<{ current: { hash: string } }>();

    available = this.$$availableSubj.asObservable();
    activated = this.$$activatedSubj.asObservable();

    activateUpdate = jasmine
      .createSpy("MockSwUpdate.activateUpdate")
      .and.callFake(() => Promise.resolve());

    checkForUpdate = jasmine
      .createSpy("MockSwUpdate.checkForUpdate")
      .and.callFake(() => Promise.resolve());
  }
  // provide our implementations or mocks to the dependency injector
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        LoginComponent,
        AuthenticationService,
        AppSettingsService,
        SessionService,
        LocalStorageService,
        SessionStorageService,
        CookieService,
        provideRoutes([]),
        UserDefaultPropertiesService,
        UserService,
        FormListService,
        FormsResourceService,
        FormSchemaCompiler,
        FormSchemaService,
        FormUpdaterService,
        FormOrderMetaDataService,
        ToastrService,
        {
          provide: SwUpdate,
          useClass: MockSwUpdate,
        },
      ],
      imports: [
        RouterTestingModule,
        NgamrsSharedModule,
        CookieModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
    })
  );

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should have required variables", inject(
    [LoginComponent],
    (loginComponent: LoginComponent) => {
      expect(loginComponent.loginSuccess).toBeTruthy();
      expect(loginComponent.loginFailure).toBeTruthy();
      expect(loginComponent.error).toBe(undefined);
    }
  ));
});
