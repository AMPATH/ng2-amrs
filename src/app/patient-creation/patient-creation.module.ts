import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2PaginationModule } from 'ng2-pagination';
import {
  MdSnackBarModule
} from '@angular/material';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';
import { PatientCreationComponent } from './patient-creation.component';
import { PatientCreationService } from './patient-creation.service';
import {
  PatientCreationResourceService
} from '../openmrs-api/patient-creation-resource.service';
import { SessionStorageService } from '../utils/session-storage.service';
import {
    PatientIdentifierTypeResService
} from '../openmrs-api/patient-identifierTypes-resource.service';
import {
    LocationResourceService
} from '../openmrs-api/location-resource.service';
import { UserService } from '../openmrs-api/user.service';
@NgModule({
    imports: [
        CommonModule,
        MdSnackBarModule,
        RouterModule,
        FormsModule,
        DateTimePickerModule,
        NgSelectModule,
        Ng2PaginationModule,
        ModalModule
    ],
    declarations: [
        PatientCreationComponent
    ],
    exports: [
        PatientCreationComponent
    ],
    providers: [
        PatientCreationService,
        PatientCreationResourceService,
        BsModalService,
        SessionStorageService,
        PatientIdentifierTypeResService,
        LocationResourceService,
        UserService
    ]
})
export class PatientRegistrationModule {
}
