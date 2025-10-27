import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { DateTimePickerModule } from '@ampath-kenya/ngx-openmrs-formentry';
import { PatientCreationComponent } from './patient-creation.component';
import { PatientCreationService } from './patient-creation.service';
import { PatientCreationResourceService } from '../openmrs-api/patient-creation-resource.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { PatientIdentifierTypeResService } from '../openmrs-api/patient-identifierTypes-resource.service';
import { LocationResourceService } from '../openmrs-api/location-resource.service';
import { UserService } from '../openmrs-api/user.service';
import {
  MatAutocompleteModule,
  MatCardModule,
  MatSelectModule
} from '@angular/material';
import { PatientOtpVerificationModule } from '../otp-verification/hie-otp-verification/patient-otp-verification.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DateTimePickerModule,
    NgSelectModule,
    NgxPaginationModule,
    ModalModule,
    MatCardModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    PatientOtpVerificationModule
  ],
  declarations: [PatientCreationComponent],
  exports: [PatientCreationComponent],
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
export class PatientRegistrationModule {}
