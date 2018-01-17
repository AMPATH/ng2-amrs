import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgamrsSharedModule
  ],
  exports: [],
  declarations: [],
  providers: [],

})
export class ReferralModule {
}
