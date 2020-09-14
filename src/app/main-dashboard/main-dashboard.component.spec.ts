/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { MainDashboardComponent } from './main-dashboard.component';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from '../utils/local-storage.service';
import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { UserService } from '../openmrs-api/user.service';
import { UserDefaultPropertiesService } from '../user-default-properties';
import { AppState } from '../app.service';
import { RoutesProviderService } from '../shared/dynamic-route/route-config-provider.service';
import { of } from 'rxjs';
import { StaticNavBarComponent, SideNavigationComponent } from '../navigation';
import { MOTDNotificationComponent } from '../Motd/motd-notification.component';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { MatSidenavModule } from '@angular/material';
import { MainDashboardModule } from './main-dashboard.module';
import { SessionService } from '../openmrs-api/session.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  CookieOptionsProvider,
  CookieService,
  CookieModule,
  COOKIE_OPTIONS
} from 'ngx-cookie';
import { BrowserModule } from '@angular/platform-browser';
import { InjectionToken } from '@angular/core';

class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  public params = of([{ id: 1 }]);
}

describe('Component: MainDashboard', () => {
  let component: MainDashboardComponent;
  let fixture: ComponentFixture<MainDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgamrsSharedModule,
        MatSidenavModule,
        MainDashboardModule,
        HttpClientTestingModule,
        BrowserModule,
        CookieModule
      ],
      providers: [
        RoutesProviderService,
        LocalStorageService,
        CookieService,
        AuthenticationService,
        UserService,
        DynamicRoutesService,
        SessionService,
        CookieOptionsProvider,
        CookieOptionsProvider,
        UserDefaultPropertiesService,
        AppState,
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: COOKIE_OPTIONS,
          useClass: {}
        },
        {
          provide: InjectionToken,
          useClass: {}
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create an instance', () => {
    expect(component).toBeDefined();
  });*/
});
