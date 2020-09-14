import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupEnrollmentSummaryComponent } from './group-enrollment-summary.component';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { GroupManagerModule } from '../../group-manager/group-manager.module';
import { GroupEnrollmentComponent } from './group-enrollment/group-enrollment.component';

@NgModule({
  declarations: [GroupEnrollmentSummaryComponent, GroupEnrollmentComponent],
  imports: [CommonModule, NgamrsSharedModule, GroupManagerModule],
  providers: [],
  entryComponents: [],
  exports: [GroupEnrollmentComponent]
})
export class GroupEnrollmentModule {}
