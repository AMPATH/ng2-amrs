import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/dist/ngx-formentry/';
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
        RouterModule,
        FormsModule,
        DateTimePickerModule,
        NgSelectModule,
        NgxPaginationModule,
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
