import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CdmLandingPageComponent } from './landing-page/landing-page.component';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
  ],
  exports: [
    CdmLandingPageComponent
  ],
  declarations: [
    CdmLandingPageComponent
  ],
  providers: [],
})
export class PatientDashboardCdmModule { }
