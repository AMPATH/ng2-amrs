import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { OncologyLandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgamrsSharedModule,
  ],
  exports: [
    OncologyLandingPageComponent
  ],
  declarations: [
    OncologyLandingPageComponent
  ],
  providers: [],
})
export class PatientDashboardOncologyModule { }
