import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { OncologyLandingPageComponent } from './landing-page/landing-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PocHttpInteceptor } from 'src/app/shared/services/poc-http-interceptor';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
    HttpClientModule
  ],
  exports: [
    OncologyLandingPageComponent
  ],
  declarations: [
    OncologyLandingPageComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PocHttpInteceptor,
      multi: true
    }
  ],
})
export class PatientDashboardOncologyModule { }
