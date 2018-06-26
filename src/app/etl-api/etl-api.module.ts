import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSettingsModule } from '../app-settings/app-settings.module';
import { IndicatorResourceService } from './indicator-resource.service';
import { PatientReminderResourceService } from './patient-reminder-resource.service';
import { VitalsResourceService } from './vitals-resource.service';
import { LabsResourceService } from './labs-resource.service';
import { ClinicalNotesResourceService } from './clinical-notes-resource.service';
import { MedicationHistoryResourceService } from './medication-history-resource.service';
import { HivSummaryResourceService } from './hiv-summary-resource.service';
import { MonthlyScheduleResourceService } from './monthly-scheduled-resource.service';
import { ErrorLogResourceService } from './error-log-resource.service';
import { HivPatientClinicalSummaryResourceService
} from './hiv-patient-clinical-summary-resource.service';
import { ClinicLabOrdersResourceService } from './clinic-lab-orders-resource.service';
import {
  ClinicalSummaryVisualizationResourceService
} from './clinical-summary-visualization-resource.service';
import { LabOrderResourceService } from './lab-order-resource.service';
import { Moh731ResourceService } from './moh-731-resource.service';
import { HivSummaryIndicatorsResourceService } from './hiv-summary-indicators-resource.service';
import { PatientStatusVisualizationResourceService
 } from './patient-status-change-visualization-resource.service';
import { Moh731PatientListResourceService } from './moh-731-patientlist-resource.service';
import { FileUploadResourceService } from './file-upload-resource.service';
import { UserCohortResourceService } from './user-cohort-resource.service';
import { CohortUserResourceService } from './cohort-list-user-resource.service';
import { PatientsRequiringVLResourceService } from './patients-requiring-vl-resource.service';
import {
  PatientsRequiringVLResourceServiceMock
} from './patients-requiring-vl-resource.service.mock';
import { DailyScheduleResourceService } from './daily-scheduled-resource.service';
import { HivClinicFlowResourceService } from './hiv-clinic-flow-resource.service';
import { DefaulterListResourceService } from './defaulter-list-resource.service';
import {
  HivMonthlySummaryIndicatorsResourceService
} from './hiv-monthly-summary-indicators-resource.service';
import { PatientProgramResourceService } from './patient-program-resource.service';
import { PatientReferralResourceService } from './patient-referral-resource.service';
import { CdmSummaryResourceService } from './cdm-summary-resource.service';
// import { ReferralProviderResourceService } from './referral-provider-resource.service';
import { RadiologyImagingResourceService } from './radiology-imaging-resource.service';

@NgModule({
  imports: [CommonModule, AppSettingsModule],
  declarations: [],
  providers: [
    DailyScheduleResourceService,
    IndicatorResourceService,
    PatientReminderResourceService,
    VitalsResourceService,
    LabsResourceService,
    ClinicalNotesResourceService,
    MedicationHistoryResourceService,
    HivSummaryResourceService,
    ErrorLogResourceService,
    HivPatientClinicalSummaryResourceService,
    MonthlyScheduleResourceService,
    ClinicLabOrdersResourceService,
    ClinicalSummaryVisualizationResourceService,
    LabOrderResourceService,
    Moh731ResourceService,
    PatientStatusVisualizationResourceService,
    HivSummaryIndicatorsResourceService,
    Moh731PatientListResourceService,
    FileUploadResourceService,
    UserCohortResourceService,
    CohortUserResourceService,
    PatientsRequiringVLResourceService,
    PatientsRequiringVLResourceServiceMock,
    DefaulterListResourceService,
    HivMonthlySummaryIndicatorsResourceService,
    PatientProgramResourceService,
    PatientReferralResourceService,
    CdmSummaryResourceService,
    // ReferralProviderResourceService
    RadiologyImagingResourceService
  ],
  exports: []
})
export class EtlApi {
}
