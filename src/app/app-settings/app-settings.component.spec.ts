import { APP_BASE_HREF } from '@angular/common';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { provideRoutes, Router } from '@angular/router';

import { AppSettingsComponent } from './app-settings.component';
import { AppSettingsService } from './app-settings.service';
import { UtilsModule } from '../utils/utils.module';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CookieModule, CookieService } from 'ngx-cookie';

import { AuthenticationService } from '../openmrs-api/authentication.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { SessionService } from '../openmrs-api/session.service';

describe('AppSettingsComponent Tests', () => {
  let comp: AppSettingsComponent;
  let fixture: ComponentFixture<AppSettingsComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;
  let title: HTMLHeadingElement;
  let templatesBtn: HTMLButtonElement;
  let openmrsUrlSelect: HTMLSelectElement;
  let etlUrlSelect: HTMLSelectElement;
  let formentryDebugLabel: HTMLLabelElement;
  let formentryDebugInput: HTMLInputElement;
  let saveBtn: HTMLButtonElement;
  let authService: AuthenticationService;
  let localStorageService: LocalStorageService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppSettingsComponent],
      imports: [
        CookieModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        UtilsModule
      ],
      providers: [
        provideRoutes([]),
        { provide: APP_BASE_HREF, useValue: '/' },
        AppSettingsService,
        CookieService,
        AuthenticationService,
        SessionService,
        LocalStorageService
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppSettingsComponent);
        comp = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;

        authService = TestBed.get(AuthenticationService);
        localStorageService = TestBed.get(LocalStorageService);
        router = TestBed.get(Router);

        title = nativeElement.querySelector('h2#title');
        templatesBtn = nativeElement.querySelector('button#templates');
        openmrsUrlSelect = nativeElement.querySelector(
          'select#openmrsServerUrl'
        );
        etlUrlSelect = nativeElement.querySelector('select#etlServerUrl');
        formentryDebugLabel = nativeElement.querySelector(
          'label#formentryDebug'
        );
        formentryDebugInput = nativeElement.querySelector('input#debugMode');
        saveBtn = nativeElement.querySelector('button#saveBtn');

        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  afterAll(() => {
    localStorageService.clear();
  });

  it('should instantiate the component', () => {
    expect(title.textContent).toMatch(/POC Server Settings/i);
    expect(templatesBtn.textContent).toMatch(/Templates/i);
    expect(openmrsUrlSelect.options.length).toBeGreaterThan(0);
    expect(etlUrlSelect.options.length).toBeGreaterThan(0);
    expect(formentryDebugLabel.textContent).toMatch(/FormEntry Debug Mode/i);
    expect(formentryDebugInput.checked).toBeFalsy();
    expect(saveBtn.textContent).toMatch('Save');
  });

  it('changing the template updates the server URL select fields automatically', fakeAsync(() => {
    const templateOptions: HTMLElement = debugElement.query(
      By.css('[dropdownToggle]')
    ).nativeElement;
    templateOptions.click();
    tick();
    fixture.detectChanges();

    const templateList = nativeElement.querySelectorAll('a#templateOption');
    (templateList[2] as HTMLElement).click(); // Select test servers (AMRS Test option)
    tick();
    fixture.detectChanges();

    expect(openmrsUrlSelect.textContent).toContain('/test-amrs');
    expect(etlUrlSelect.textContent).toContain('/etl-server-test-worcester');
  }));

  it('clicking add should allow you to add a custom server URL', async(() => {
    const testETLURL = 'https://localhost:8000/test-server/etl';
    const etlURLBtn: HTMLButtonElement = nativeElement.querySelector(
      'button#etlUrlBtn'
    );
    const addServerURLInput: HTMLInputElement = nativeElement.querySelector(
      'input#addServerUrl'
    );
    const saveURLBtn: HTMLButtonElement = nativeElement.querySelector(
      'button#saveServerUrl'
    );

    etlURLBtn.click();
    fixture.detectChanges();

    addServerURLInput.value = testETLURL;
    addServerURLInput.dispatchEvent(new Event('input'));
    saveURLBtn.click();

    fixture.detectChanges();

    expect(etlUrlSelect.textContent).toContain(testETLURL);
  }));

  it('clicking save persists your app settings and redirects to login page', () => {
    const authServiceSpy: jasmine.Spy = spyOn(authService, 'clearSessionCache');
    const localStorageSpy: jasmine.Spy = spyOn(localStorageService, 'setItem');
    const routerSpy: jasmine.Spy = spyOn(router, 'navigate');

    saveBtn.click();
    expect(localStorageSpy).toHaveBeenCalledTimes(1);
    expect(localStorageSpy).toHaveBeenCalledWith(
      'appSettingsAction',
      'newSettings'
    );
    expect(authServiceSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalledTimes(1);
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });
});
