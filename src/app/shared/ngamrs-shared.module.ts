import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BusyModule, BusyConfig } from 'angular2-busy';
import { LaddaModule } from 'angular2-ladda';
import { CommonModule } from '@angular/common';
import {
  MdProgressSpinnerModule, MdProgressBarModule, MdTabsModule, MdSnackBarModule
} from '@angular/material';
import { CacheService } from 'ionic-cache';
import { SelectModule } from 'angular2-select';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastComponent } from '../patient-dashboard/common/formentry/form-updater-toast.component';
import { DisplayErrorComponent } from './display-error/display-error.component';
import { DateSelectorComponent } from './components/date-selector.component';
import { StringToDatePipe } from './pipes/string-to-date.pipe';
import { Ng2FilterPipe } from './pipes/ng2-filter.pipe';
import { OpenmrsApi } from '../openmrs-api/openmrs-api.module';
import { OnlineTrackerComponent } from '../online-tracker';
import { BuildVersionComponent } from '../build-version';
import { RoutesProviderService } from './dynamic-route/route-config-provider.service';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { FormsModule } from '@angular/forms';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { HivSummaryService } from '../patient-dashboard/hiv/hiv-summary/hiv-summary.service';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { SessionService } from '../openmrs-api/session.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { UserDefaultPropertiesService
} from '../user-default-properties/user-default-properties.service';
import { Angulartics2Module } from 'angulartics2';
import { Ng2PaginationModule } from 'ng2-pagination';
import { CacheModule } from 'ionic-cache';
import { LocationFilterComponent
} from './locations/location-filter/location-filter.component';
import { EtlApi } from '../etl-api/etl-api.module';
import { KibanaVizHostComponent } from './kibana-viz-host/kibana-viz-host.component';

@NgModule({
  imports: [
    BusyModule.forRoot(
      {
        message: 'Please Wait...',
        backdrop: false,
        delay: 200,
        minDuration: 600,
        wrapperClass: 'my-class',
        template: `
                      <div class="loader" ><span><i class="fa fa-spinner fa-spin">
      </i>{{message}}</span></div>`,
      }
    ),
    LaddaModule.forRoot({
      style: 'expand-right',
      spinnerSize: 20,
      spinnerColor: 'white',
      spinnerLines: 12
    }),
    CommonModule,
    OpenmrsApi,
    EtlApi,
    Angulartics2Module.forChild(),
    FormsModule,
    NgxMyDatePickerModule,
    RouterModule,
    Ng2Bs3ModalModule,
    Ng2PaginationModule,
    ModalModule.forRoot(),
    // BrowserAnimationsModule
    CacheModule,
    SelectModule,
    MdSnackBarModule
  ],
  exports: [BusyModule, LaddaModule, DisplayErrorComponent,
    StringToDatePipe, Ng2FilterPipe, OnlineTrackerComponent,
    BuildVersionComponent, KibanaVizHostComponent,
    DateSelectorComponent, PdfViewerComponent, NgxMyDatePickerModule,
    OpenmrsApi, EtlApi, Ng2Bs3ModalModule, ModalModule, LocationFilterComponent, ToastComponent],
  declarations: [
    DisplayErrorComponent, StringToDatePipe, Ng2FilterPipe, KibanaVizHostComponent,
    OnlineTrackerComponent, ToastComponent,
    BuildVersionComponent, DateSelectorComponent, PdfViewerComponent, LocationFilterComponent
  ],
  entryComponents: [
    ToastComponent
  ],
  providers: [Ng2FilterPipe, StringToDatePipe, RoutesProviderService, HivSummaryService],
})
export class NgamrsSharedModule {

  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgamrsSharedModule,
      providers: [AuthenticationService, SessionService,
        SessionStorageService, UserDefaultPropertiesService]
    };
  }
}
