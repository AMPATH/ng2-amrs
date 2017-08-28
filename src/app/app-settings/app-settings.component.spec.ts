import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRoutes } from '@angular/router';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { UtilsModule } from '../utils/utils.module';
import { AppSettingsComponent } from './app-settings.component';
import { AppSettingsService } from './app-settings.service';
import { RouterTestingModule } from '@angular/router/testing';

import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { ModalModule } from 'ngx-bootstrap/modal';

import { AuthenticationService } from '../openmrs-api/authentication.service';
import { SessionService } from '../openmrs-api/session.service';
import { CookieModule } from 'ngx-cookie';
import { CookieService } from 'angular2-cookie/services/cookies.service';

describe('AppSettingsComponent Tests', () => {
  let comp: AppSettingsComponent;
  let fixture: ComponentFixture<AppSettingsComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ModalModule.forRoot(), UtilsModule,
        RouterTestingModule, CookieModule.forRoot()],
      declarations: [AppSettingsComponent],
      providers: [
        MockBackend,
        BaseRequestOptions,
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        AppSettingsService,
        AuthenticationService,
        SessionService,
        CookieService,
        provideRoutes([])
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppSettingsComponent);
        comp = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.css('div .form-group'));
      });
  }));

  it('AppSettingsComponent should exist', () => {
    expect(comp).toBeTruthy();
  });

  it('Should display default Openmrs server url', () => {
    fixture.detectChanges();
    expect(debugElement.nativeElement.textContent).toContain(comp.openmrsServerUrls[0]);
  });

  it('Should display default ETL server url', () => {
    fixture.autoDetectChanges();
    let formElements = fixture.debugElement.queryAll(By.css('div .form-group'));
    expect(formElements[1].nativeElement.textContent).toContain(comp.etlServerUrls[0]);
  });

  it('Should display the Debug Mode Option', () => {
    fixture.autoDetectChanges();
    let debugEl = fixture.debugElement.queryAll(By.css('#debugMode'));
    expect(debugEl.length).toEqual(1);
  });

  it('Should set cookie for debug mode if enabled', () => {
    fixture.autoDetectChanges();
    comp.hideFields = true;
    comp.toggleDebugMode();
    expect(comp.getDebugMode()).toBe('true');
    comp.removeDebugCookie();
  });
});
