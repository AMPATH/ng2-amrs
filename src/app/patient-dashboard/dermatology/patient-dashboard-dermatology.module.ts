import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { DermatologyLandingPageComponent } from './landing-page/landing-page.component';

import { Http, XHRBackend, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../utils/session-storage.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    HttpClientModule
  ],
  exports: [
    DermatologyLandingPageComponent
  ],
  declarations: [
    DermatologyLandingPageComponent
  ],
  providers: [
  ],
})
export class PatientDashboardDermatologyModule { }
