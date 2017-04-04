import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { RouterModule, Router } from '@angular/router';

import { AuthGuard } from './shared/guards/auth.guard';
import { LoginGuard } from './shared/guards/login.guard';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/dist/providers';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app-routing.module';
// App is our top level component
import { App } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { About } from './about';
import { NoContent } from './no-content';
import { AuthenticationModule } from './authentication';
import { MainDashboardModule } from './main-dashboard/main-dashboard.module';
import { AppSettingsModule } from './app-settings';
import { UserDefaultPropertiesModule } from './user-default-properties';
import { DynamicRoutesService } from './shared/dynamic-route/dynamic-routes.service';
import { ResponsiveModule, ResponsiveConfig, ResponsiveConfigInterface } from 'ng2-responsive';
import { AppFeatureAnalytics } from './shared/app-analytics/app-feature-analytics.service';
import { HttpClient } from './shared/services/http-client.service';
import { TitleCasePipe } from './shared/pipes/title-case.pipe';
import { LocalStorageService } from './utils/local-storage.service';
import { SessionStorageService } from './utils/session-storage.service';
import { CacheService } from 'ionic-cache/ionic-cache';
import { DataCacheService } from './shared/services/data-cache.service';
import { UsefulLinksModule } from './useful-links';
import { FeedBackComponent } from './feedback';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { LabOrderSearchModule } from './lab-order-search/lab-order-search.module';


// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App,
    About,
    TitleCasePipe,
    NoContent,
    FeedBackComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    Ng2Bs3ModalModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    Angulartics2Module.forRoot([Angulartics2Piwik]),
    MainDashboardModule,
    AuthenticationModule,
    AppSettingsModule,
    UserDefaultPropertiesModule,
    UsefulLinksModule,
    LabOrderSearchModule,
    BusyModule.forRoot(
      new BusyConfig({
        message: 'Please Wait...',
        backdrop: true,
        delay: 200,
        minDuration: 600,
        wrapperClass: 'my-class',

      })
    )
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    DynamicRoutesService,
    Angulartics2Piwik,
    AppFeatureAnalytics,
    AuthGuard,
    LoginGuard,
    LocalStorageService,
    { provide: ResponsiveConfig, useFactory: () => new ResponsiveConfig() },
    {
      provide: Http,
      useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions,
        router: Router, sessionStorageService: SessionStorageService) =>
        new HttpClient(xhrBackend, requestOptions, router, sessionStorageService),
      deps: [XHRBackend, RequestOptions, Router, SessionStorageService]
    },
    CacheService,
    DataCacheService
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {
  }

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
