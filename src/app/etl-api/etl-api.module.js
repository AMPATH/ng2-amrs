"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var app_settings_module_1 = require("../app-settings/app-settings.module");
var indicator_resource_service_1 = require("./indicator-resource.service");
var patient_reminder_resource_service_1 = require("./patient-reminder-resource.service");
var vitals_resource_service_1 = require("./vitals-resource.service");
var labs_resource_service_1 = require("./labs-resource.service");
var clinical_notes_resource_service_1 = require("./clinical-notes-resource.service");
var medication_history_resource_service_1 = require("./medication-history-resource.service");
var hiv_summary_resource_service_1 = require("./hiv-summary-resource.service");
var monthly_scheduled_resource_service_1 = require("./monthly-scheduled-resource.service");
var error_log_resource_service_1 = require("./error-log-resource.service");
var hiv_patient_clinical_summary_resource_service_1 = require("./hiv-patient-clinical-summary-resource.service");
var clinic_lab_orders_resource_service_1 = require("./clinic-lab-orders-resource.service");
var clinical_summary_visualization_resource_service_1 = require("./clinical-summary-visualization-resource.service");
var lab_order_resource_service_1 = require("./lab-order-resource.service");
var moh_731_resource_service_1 = require("./moh-731-resource.service");
var hiv_summary_indicators_resource_service_1 = require("./hiv-summary-indicators-resource.service");
var patient_status_change_visualization_resource_service_1 = require("./patient-status-change-visualization-resource.service");
var moh_731_patientlist_resource_service_1 = require("./moh-731-patientlist-resource.service");
var file_upload_resource_service_1 = require("./file-upload-resource.service");
var user_cohort_resource_service_1 = require("./user-cohort-resource.service");
var cohort_list_user_resource_service_1 = require("./cohort-list-user-resource.service");
var patients_requiring_vl_resource_service_1 = require("./patients-requiring-vl-resource.service");
var patients_requiring_vl_resource_service_mock_1 = require("./patients-requiring-vl-resource.service.mock");
var daily_scheduled_resource_service_1 = require("./daily-scheduled-resource.service");
var defaulter_list_resource_service_1 = require("./defaulter-list-resource.service");
var EtlApi = (function () {
    function EtlApi() {
    }
    EtlApi = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, app_settings_module_1.AppSettingsModule],
            declarations: [],
            providers: [
                daily_scheduled_resource_service_1.DailyScheduleResourceService,
                indicator_resource_service_1.IndicatorResourceService,
                patient_reminder_resource_service_1.PatientReminderResourceService,
                vitals_resource_service_1.VitalsResourceService,
                labs_resource_service_1.LabsResourceService,
                clinical_notes_resource_service_1.ClinicalNotesResourceService,
                medication_history_resource_service_1.MedicationHistoryResourceService,
                hiv_summary_resource_service_1.HivSummaryResourceService,
                error_log_resource_service_1.ErrorLogResourceService,
                hiv_patient_clinical_summary_resource_service_1.HivPatientClinicalSummaryResourceService,
                monthly_scheduled_resource_service_1.MonthlyScheduleResourceService,
                clinic_lab_orders_resource_service_1.ClinicLabOrdersResourceService,
                clinical_summary_visualization_resource_service_1.ClinicalSummaryVisualizationResourceService,
                lab_order_resource_service_1.LabOrderResourceService,
                moh_731_resource_service_1.Moh731ResourceService,
                patient_status_change_visualization_resource_service_1.PatientStatusVisualizationResourceService,
                hiv_summary_indicators_resource_service_1.HivSummaryIndicatorsResourceService,
                moh_731_patientlist_resource_service_1.Moh731PatientListResourceService,
                file_upload_resource_service_1.FileUploadResourceService,
                user_cohort_resource_service_1.UserCohortResourceService,
                cohort_list_user_resource_service_1.CohortUserResourceService,
                patients_requiring_vl_resource_service_1.PatientsRequiringVLResourceService,
                patients_requiring_vl_resource_service_mock_1.PatientsRequiringVLResourceServiceMock,
                defaulter_list_resource_service_1.DefaulterListResourceService
            ],
            exports: []
        })
    ], EtlApi);
    return EtlApi;
}());
exports.EtlApi = EtlApi;
