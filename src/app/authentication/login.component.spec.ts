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
      .createSpy('MockSwUpdate.activateUpdate')
      .and.callFake(() => Promise.resolve());

    checkForUpdate = jasmine
      .createSpy('MockSwUpdate.checkForUpdate')
      .and.callFake(() => Promise.resolve());
  }

  const mockWindow = {
    location: {
      href: 'https://ngx.ampath.or.ke/ng2-amrs/#/login'
    }
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        provideRoutes([]),
        AuthenticationService,
        CookieService,
        FormOrderMetaDataService,
        FormListService,
        FormSchemaCompiler,
        FormSchemaService,
        FormsResourceService,
        LoginComponent,
        OnlineTrackerService,
        SessionService,
        SessionStorageService,
        UserDefaultPropertiesService,
        UserService,
        ToastrService,
        {
          provide: AppSettingsService,
          useValue: appSettingsServiceStub
        },
        {
          provide: FormUpdaterService,
          useValue: formUpdaterServiceStub
        },
        {
          provide: LocalStorageService,
          useValue: localStorageServiceStub
        },
        {
          provide: SwUpdate,
          useClass: MockSwUpdate
        },
        {
          provide: Window,
          useValue: mockWindow
        }
      ],
      imports: [
        CookieModule.forRoot(),
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        NgamrsSharedModule,
        RouterTestingModule
      ]
    }).compileComponents()
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    authService = TestBed.get(AuthenticationService);
    formUpdaterService = TestBed.get(FormUpdaterService);
    router = TestBed.get(Router);

    usernameInput = nativeElement.querySelector('input#username');
    passwordInput = nativeElement.querySelector('input#password');
    loginBtn = nativeElement.querySelector('button#login');
    buildVersion = nativeElement.querySelector('p.text-right.text-bold');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', () => {
    fixture.detectChanges();

    expect(usernameInput.textContent).toEqual('');
    expect(passwordInput).toBeTruthy();
    expect(loginBtn.textContent).toMatch(/Log in/i);
    expect(buildVersion.textContent).toMatch(/v\d+\.\d+\.\d+\-SNAPSHOT/i);
  });

  it('renders an error if the login credentials are invalid', () => {
    usernameInput.value = 'Chuck Norris';
    passwordInput.value = 'An actual password';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    authenticateSpy = spyOn(authService, 'authenticate').and.callFake(() =>
      of({
        authenticated: false
      })
    );

    click(loginBtn);
    fixture.detectChanges();

    const errorDiv = nativeElement.querySelector('div.error');
    expect(errorDiv.textContent).toMatch(/Wrong username or password/i);
    expect(passwordInput.textContent).toBe('');
  });

  it('calls login() with the username and password when submitted', () => {
    usernameInput.value = 'Chuck Norris';
    passwordInput.value = 'The login form submits a password to Chuck Norris';
    usernameInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    authenticateSpy = spyOn(authService, 'authenticate').and.callFake(() =>
      of({
        authenticated: true
      })
    );

    click(loginBtn);
    expect(authenticateSpy).toHaveBeenCalledTimes(1);
    expect(authenticateSpy).toHaveBeenCalledWith(
      usernameInput.value,
      passwordInput.value
    );
  });
});
