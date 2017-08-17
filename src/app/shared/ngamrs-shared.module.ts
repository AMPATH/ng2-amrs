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
import { HivSummaryService } from '../patient-dashboard/hiv-summary/hiv-summary.service';
import { PatientSideNavComponent
} from '../patient-dashboard/patient-side-nav/patient-side-nav.component';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { SessionService } from '../openmrs-api/session.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { UserDefaultPropertiesService
} from '../user-default-properties/user-default-properties.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CacheModule } from 'ionic-cache';
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
        FormsModule,
        NgxMyDatePickerModule,
        RouterModule,
        Ng2Bs3ModalModule,
        ModalModule.forRoot(),
        // BrowserAnimationsModule
        CacheModule
    ],
    exports: [BusyModule, LaddaModule, DisplayErrorComponent,
        StringToDatePipe, Ng2FilterPipe, OnlineTrackerComponent,
        BuildVersionComponent, PatientSideNavComponent,
        DateSelectorComponent, PdfViewerComponent, NgxMyDatePickerModule,
      OpenmrsApi, Ng2Bs3ModalModule, ModalModule],
    declarations: [
        DisplayErrorComponent, StringToDatePipe, Ng2FilterPipe,
        OnlineTrackerComponent,
        BuildVersionComponent, DateSelectorComponent, PdfViewerComponent,
        PatientSideNavComponent
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
