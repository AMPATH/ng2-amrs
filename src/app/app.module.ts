import '../styles/styles.scss';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule, Router } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';
import { LoginGuard } from './shared/guards/login.guard';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { NgamrsSharedModule } from './shared/ngamrs-shared.module';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ROUTES } from './app-routing.module';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { NoContentComponent } from './no-content';
import { DynamicRoutesService } from './shared/dynamic-route/dynamic-routes.service';
import { AppFeatureAnalytics } from './shared/app-analytics/app-feature-analytics.service';
import { HttpClient } from './shared/services/http-client.service';
import { TitleCasePipe } from './shared/pipes/title-case.pipe';
import { LocalStorageService } from './utils/local-storage.service';
import { SessionStorageService } from './utils/session-storage.service';
import { CacheService } from 'ionic-cache';
import { DataCacheService } from './shared/services/data-cache.service';
import { FeedBackComponent } from './feedback';
import { FormVisitTypeSearchModule } from
  './patient-dashboard/common/form-visit-type-search/form-visit-type-search.module';
import { LabOrderSearchModule } from './lab-order-search/lab-order-search.module';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CookieModule } from 'ngx-cookie';
import { OnlineTrackerService } from './online-tracker/online-tracker.service';
import { PouchdbService } from './pouchdb-service/pouchdb.service';
import {
  DepartmentProgramsConfigService
} from './etl-api/department-programs-config.service';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

interface StoreType {
  state: InternalStateType;
  restoreInputValues: () => void;
  disposeOldHosts: () => void;
}
export function httpClient(xhrBackend: XHRBackend, requestOptions: RequestOptions,
  router: Router, sessionStorageService: SessionStorageService) {
  return new HttpClient(xhrBackend, requestOptions, router, sessionStorageService);
}
/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    TitleCasePipe,
    NoContentComponent,
    FeedBackComponent
  ],
  imports: [ // import Angular's modules
    BrowserAnimationsModule,
    BrowserModule,
    FormVisitTypeSearchModule,
    CommonModule,
    CookieModule.forRoot(),
    ModalModule.forRoot(),
    NgamrsSharedModule.forRoot(),
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true, enableTracing: false }),
    Angulartics2Module.forRoot([Angulartics2Piwik]),
    ServiceWorkerModule.register('/combined-worker.js', { enabled: environment.production }),
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS,
    DynamicRoutesService,
    Angulartics2Piwik,
    AppFeatureAnalytics,
    AuthGuard,
    LoginGuard,
    LocalStorageService,
    OnlineTrackerService,
    DepartmentProgramsConfigService,
    PouchdbService,
    {
      provide: Http,
      useFactory: httpClient,
      deps: [XHRBackend, RequestOptions, Router, SessionStorageService]
    },
    CacheService,
    DataCacheService
  ],
  exports: [
    LabOrderSearchModule
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {
  }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      const restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

}
