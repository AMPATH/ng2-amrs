import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { SessionService } from '../openmrs-api/session.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { SessionStorageService } from '../utils/session-storage.service';

// Load the implementations that should be tested
import { LoginComponent } from './login.component';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieModule } from 'ngx-cookie';
import { UserDefaultPropertiesService } from '../user-default-properties/user-default-properties.service';
import { UserService } from '../openmrs-api/user.service';
import { CookieService } from 'ngx-cookie';
import { FormListService } from '../patient-dashboard/common/forms/form-list.service';
import { FormUpdaterService } from '../patient-dashboard/common/formentry/form-updater.service';
import { FormOrderMetaDataService } from '../patient-dashboard/common/forms/form-order-metadata.service';
import { FormSchemaService } from '../patient-dashboard/common/formentry/form-schema.service';
import { FormSchemaCompiler } from 'ngx-openmrs-formentry/dist/ngx-formentry';
import { FormsResourceService } from '../openmrs-api/forms-resource.service';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
describe('LoginComponent Unit Tests', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => TestBed.configureTestingModule({
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
      ToastrService
    ],
    imports: [
      RouterTestingModule,
      NgamrsSharedModule,
      CookieModule.forRoot(),
      HttpClientTestingModule,
      ToastrModule.forRoot()
    ]
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should have required variables', inject([LoginComponent],
    (loginComponent: LoginComponent) => {
      expect(loginComponent.loginSuccess).toBeTruthy();
      expect(loginComponent.loginFailure).toBeTruthy();
      expect(loginComponent.error).toBe(undefined);
    }));
});
