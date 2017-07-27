import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

// import { BusyModule, BusyConfig } from 'angular2-busy';
import { LaddaModule } from 'angular2-ladda';
import { CommonModule } from '@angular/common';
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
import { BusyModule, BusyConfig } from 'angular2-busy';
import { HivSummaryService } from '../patient-dashboard/hiv/hiv-summary/hiv-summary.service';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { SessionService } from '../openmrs-api/session.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { UserDefaultPropertiesService
} from '../user-default-properties/user-default-properties.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Angulartics2Module } from 'angulartics2';
import { Ng2PaginationModule } from 'ng2-pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CacheModule } from 'ionic-cache';
import { LocationFilterComponent
} from './locations/location-filter/location-filter.component';
import { SelectModule } from 'angular2-select';
import { EtlApi } from '../etl-api/etl-api.module';
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
    SelectModule
  ],
  exports: [BusyModule, LaddaModule, DisplayErrorComponent,
    StringToDatePipe, Ng2FilterPipe, OnlineTrackerComponent,
    BuildVersionComponent,
    DateSelectorComponent, PdfViewerComponent, NgxMyDatePickerModule,
    OpenmrsApi, Ng2Bs3ModalModule, ModalModule, LocationFilterComponent],
  declarations: [
    DisplayErrorComponent, StringToDatePipe, Ng2FilterPipe,
    OnlineTrackerComponent,
    BuildVersionComponent, DateSelectorComponent, PdfViewerComponent, LocationFilterComponent
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
