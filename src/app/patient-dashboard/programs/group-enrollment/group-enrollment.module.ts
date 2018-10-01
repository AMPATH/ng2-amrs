import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupEnrollmentComponent } from './group-enrollment.component';
import { NgamrsSharedModule } from '../../../shared/ngamrs-shared.module';
import { GroupManagerModule } from '../../../group-manager/group-manager.module';
import { GroupEnrollmentModalComponent } from './group-enrollment-modal/group-enrollment-modal.component';

@NgModule({
    declarations: [
        GroupEnrollmentComponent,
        GroupEnrollmentModalComponent
    ],
    imports: [
        CommonModule,
        NgamrsSharedModule,
        GroupManagerModule
     ],
    exports: [
    ],
    providers: [],
    entryComponents: [
        GroupEnrollmentModalComponent
    ]
})
export class GroupEnrollmentModule {}
