import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ConfirmDialogModule , DialogModule
  } from 'primeng/primeng';
import { GroupManagerSearchComponent } from './group-manager-search/group-manager-search.component';
import { CommunityGroupService } from '../openmrs-api/community-group-resource.service';
import { FormsModule } from '@angular/forms';
import { GroupManagerSearchResultsComponent } from './group-manager-search/group-manager-search-results.component';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupManagerRouting } from './group-manager.routes';
import { GroupDetailSummaryComponent } from './group-detail/group-detail-summary.component';
import { CommunityGroupMemberService } from '../openmrs-api/community-group-member-resource.service';
import { CommunityGroupAttributeService } from '../openmrs-api/community-group-attribute-resource.service';
import { DatePickerModalComponent } from './modals/date-picker-modal.component';
import { SuccessModalComponent } from './modals/success-modal.component';
import { CommunityGroupLeaderService } from '../openmrs-api/community-group-leader-resource.service';
import { GroupEditorComponent } from './group-editor/group-editor-component';

@NgModule({
    declarations: [
        GroupManagerSearchComponent,
        GroupManagerSearchResultsComponent,
        GroupDetailComponent,
        GroupDetailSummaryComponent,
        DatePickerModalComponent,
        SuccessModalComponent,
        GroupEditorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgamrsSharedModule,
        GroupManagerRouting,
        ConfirmDialogModule,
        DialogModule
     ],
    exports: [],
    providers: [
        CommunityGroupService,
        CommunityGroupMemberService,
        CommunityGroupAttributeService,
        CommunityGroupLeaderService
    ],
    entryComponents: [
        DatePickerModalComponent,
        SuccessModalComponent
    ]
})
export class GroupManagerModule {}
