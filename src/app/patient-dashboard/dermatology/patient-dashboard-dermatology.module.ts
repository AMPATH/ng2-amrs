import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { DermatologyLandingPageComponent } from './landing-page/landing-page.component';

import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../utils/session-storage.service';
import { HttpClient } from '../../shared/services/http-client.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
  ],
  exports: [
    DermatologyLandingPageComponent
  ],
  declarations: [
    DermatologyLandingPageComponent
  ],
  providers: [
    {
      provide: Http,
      useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions,
                   router: Router, sessionStorageService: SessionStorageService) =>
        new HttpClient(xhrBackend, requestOptions, router, sessionStorageService),
      deps: [XHRBackend, RequestOptions, Router, SessionStorageService]
    }
  ],
})
export class PatientDashboardDermatologyModule { }
