// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgamrsSharedModule } from '../shared/ngamrs-shared.module';

// This Module's Components
import { DashboardsViewerComponent } from './dashboards-viewer/dashboards-viewer.component';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { DashboardListService } from './../etl-api/dashboard-list.service';

@NgModule({
    imports: [
        CommonModule,
        NgamrsSharedModule
    ],
    declarations: [
        DashboardsViewerComponent,
        DashboardListComponent
    ],
    exports: [
        DashboardsViewerComponent,
        DashboardListComponent
    ],
    providers: [
        DashboardListService
    ]
})
export class KibanaLibModule {

}
