import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';
import { GroupManagerSearchComponent } from './group-manager-search/group-manager-search.component';
import { GroupManagerSearchResultsComponent } from './group-manager-search/group-manager-search-results.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { GroupManagerRouting } from './group-manager.routes';
import { GroupDetailSummaryComponent } from './group-detail/group-detail-summary.component';
import { DatePickerModalComponent } from './modals/date-picker-modal.component';
import { SuccessModalComponent } from './modals/success-modal.component';
import { GroupEditorComponent } from './group-editor/group-editor-component';
import { GroupSearchInputComponent } from './group-manager-search/group-search-input/group-search-input.component';

@NgModule({
    declarations: [
        GroupManagerSearchComponent,
        GroupManagerSearchResultsComponent,
        GroupDetailComponent,
        GroupDetailSummaryComponent,
        DatePickerModalComponent,
        SuccessModalComponent,
        GroupEditorComponent,
        GroupSearchInputComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgamrsSharedModule,
        GroupManagerRouting
     ],
    exports: [
      GroupSearchInputComponent,
      GroupEditorComponent
    ],
    providers: [
        DatePipe
    ],
    entryComponents: [
        DatePickerModalComponent,
        SuccessModalComponent    ]
})
export class GroupManagerModule {}
