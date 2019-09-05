import {
    Json2Sql
} from 'ampath-json2sql';
import {
    Promise
} from 'bluebird';
import QueryService from '../database-access/query.service';
import ReportProcessorHelpersService from './report-processor-helpers.service';

// TODO: Move to data store
import * as moh_731_greencard from './json-reports/moh-731-greencard.json';
import * as moh_731_bluecard from './json-reports/moh-731-bluecard.json';
import * as main_dataset_aggregate from './json-reports/main-dataset-aggregate.json';
import * as main_dataset_aggregate_blue_card from './json-reports/main-dataset-aggregate-bluecard.json';
import * as main_dataset_aggregate_age_disaggregation from './json-reports/main-dataset-aggregate-age-disaggregation';
import * as main_dataset_aggregate_no_disaggregation from './json-reports/main-dataset-aggregate-no-disaggregation';
import * as main_dataset_aggregate_age15_disaggregation from './json-reports/main-dataset-aggregate-age15-disaggregation';
import * as main_dataset_aggregate_age18_disaggregation from './json-reports/main-dataset-aggregate-age18-disaggregation';
import * as main_dataset_base from './json-reports/main-dataset-base.json';
import * as main_dataset_base_blue_card from './json-reports/main-dataset-base-blue-card.json';
import * as main_dataset_base_age15 from './json-reports/main-dataset-base-age15.json';
import * as main_dataset_base_age18 from './json-reports/main-dataset-base-age18.json';
import * as regimen_dataset_aggregate from './json-reports/regimen-dataset-aggregate.json';
import * as regimen_dataset_base from './json-reports/regimen-dataset-base.json';
import * as retention_dataset_aggregate from './json-reports/retention-dataset-aggregate.json';
import * as retention_dataset_base from './json-reports/retention-dataset-base.json';
import * as pep_dataset_aggregate from './json-reports/pep-dataset-aggregate.json';
import * as pep_dataset_base from './json-reports/pep-dataset-base.json';
import * as patient_list_template from './json-reports/patient-list-template.json';
import * as patient_list_schedules_template from './json-reports/patient-list-schedules-template.json';
import * as patient_list_frozen_template from './json-reports/patient-list-frozen-template.json';
import * as ever_on_art_aggregate from './json-reports/ever-on-art-aggregate.json';
import * as ever_on_art_disaggregation from './json-reports/ever-on-art-disaggregation.json';
import * as ever_on_art_base from './json-reports/ever-on-art-base.json';
import * as referral_patient_list_template from './json-reports/referral-patient-list-template.json';
import * as referral_dataset_base from './json-reports/referral-dataset-base.json';
import * as referral_aggregate from './json-reports/referral-aggregate.json';
import * as cdm_dataset_base from './json-reports/cdm/cdm-dataset-base.json';

import * as starting_art_aggregation_age15 from './json-reports/starting-art-aggregation-age15.json';
import * as starting_art_base_age15 from './json-reports/starting-art-base-age15.json';
import * as starting_art_disaggregation_age15 from './json-reports/starting-art-disaggregation-age15.json';

import * as starting_art_aggregation_age_green from './json-reports/starting-art-aggregation-age-green.json';
import * as starting_art_base_age_green from './json-reports/starting-art-base-age-green.json';
import * as starting_art_disaggregation_age_green from './json-reports/starting-art-disaggregation-age-green.json';
import * as starting_art_disaggregation_age_only_green from './json-reports/starting-art-disaggregation-age-only-green.json';
import * as medical_history_dataset_base from './json-reports/medical-history-dataset-base.json';
import * as patint_change_status_tracker_base from './json-reports/patint-change-status-tracker-base.json';
import * as hiv_monthly_summary_dataset_base from './json-reports/hiv-monthly-summary-dataset-base.json';
import * as hiv_monthly_summary_dataset_aggregation from './json-reports/hiv-monthly-summary-aggregate.json';

import * as clinic_comparator_aggregate from './json-reports/clinic-comparator-aggregate.json';
import * as clinic_comparator_base from './json-reports/clinic-comparator-base.json';

import * as dataentry_statistics_aggregate from './json-reports/dataentry-statistics-aggregate.json';
import * as dataentry_statistics_base from './json-reports/dataentry-statistics-base.json';

import * as hiv_summary_aggregate from './json-reports/hiv-summary-aggregate.json';
import * as hiv_summary_base from './json-reports/hiv-summary-base.json';
import * as patient_flow from './json-reports/patient-flow.json';
import * as clinical_art_overview_aggregate from './json-reports/clinical-art-overview-aggregate.json';
import * as clinical_art_overview_base from './json-reports/clinical-art-overview-base.json';
import * as clinical_hiv_comparative_overview_aggregate from './json-reports/clinical-hiv-comparative-overview-aggregate.json';
import * as clinical_hiv_comparative_overview_base from './json-reports/clinical-hiv-comparative-overview-base.json';
import * as daily_has_not_returned_aggregate from './json-reports/daily-has-not-returned-aggregate.json';
import * as daily_has_not_returned_base from './json-reports/daily-has-not-returned-base.json';
import * as daily_has_not_returned_cohort from './json-reports/daily-has-not-returned-cohort.json';
import * as next_drug_pickup_encounter_base from './json-reports/next-drug-pickup-encounter.base.json';
import * as daily_appointments_aggregate from './json-reports/daily-appointments-aggregate.json';
import * as daily_appointments_base from './json-reports/daily-appointments-base.json';
import * as daily_appointment_latest_rtc_cohort_base from './json-reports/daily-appointment-latest-rtc-cohort-base.json';
import * as daily_attendance_aggregate from './json-reports/daily-attendance-aggregate.json';
import * as daily_attendance_base from './json-reports/daily-attendance-base.json';
import * as patint_change_status_tracker_aggregate from './json-reports/patint-change-status-tracker-aggregate.json';
import * as labs_report_aggregate from './json-reports/labs-report-aggregate.json';
import * as labs_report_base from './json-reports/labs-report-base.json';
import * as labs_and_imaging_dataset_base from './json-reports/labs-and-imaging-dataset-base.json';
import * as patients_requiring_viral_load_template from './json-reports/patients-requiring-viral-load-template.json';
import * as clinic_lab_orders_report from './json-reports/clinic-lab-orders-report-base.json';
import * as clinical_reminders_report from './json-reports/clinical-reminder-report.json';

import * as breast_cancer_daily_screening_summary_aggregate from './json-reports/breast-cancer-daily-screening-summary-aggregate.json';
import * as breast_cancer_monthly_screening_summary_aggregate from './json-reports/breast-cancer-monthly-screening-summary-aggregate.json';
import * as breast_cancer_monthly_screening_summary_base from './json-reports/breast-cancer-monthly-screening-summary-base.json';
import * as breast_cancer_patient_list_template from './json-reports/breast-cancer-patient-list-template.json';

import * as lung_cancer_treatment_monthly_summary_aggregate from './json-reports/lung-cancer-treatment-monthly-summary-aggregate.json';
import * as lung_cancer_treatment_daily_summary_aggregate from './json-reports/lung-cancer-treatment-daily-summary-aggregate.json';
import * as lung_cancer_treatment_summary_base from './json-reports/lung-cancer-treatment-summary-base.json';
import * as lung_cancer_treatment_patient_list_template from './json-reports/lung-cancer-treatment-patient-list-template.json';
import * as lung_cancer_treatment_monthly_summary_base from './json-reports/lung-cancer-treatment-monthly-summary-base.json';

import * as cervical_cancer_daily_screening_summary_aggregate from './json-reports/cervical-cancer-daily-screening-summary-aggregate.json';
import * as cervical_cancer_monthly_screening_summary_aggregate from './json-reports/cervical-cancer-monthly-screening-summary-aggregate.json';
import * as cervical_cancer_monthly_screening_summary_base from './json-reports/cervical-cancer-monthly-screening-summary-base.json';

import * as patient_list_with_contacts_template from './json-reports/patient-list-with-contacts-template.json';
import * as enhanced_adherence_hiv_program_aggregate from './json-reports/enhanced-adherence-hiv-program-aggregate.json';
import * as enhanced_adherence_hiv_program_base from './json-reports/enhanced-adherence-hiv-program-base';
import * as patient_program_cohort from './json-reports/patient-program-cohort';
import * as enhanced_adherence_hiv_program_cohort from './json-reports/enhanced-adherence-hiv-program-cohort';

import * as currently_enrolled_patients_base from './json-reports/currently-enrolled-patients.base';
import * as currently_enrolled_patients_aggregate from './json-reports/currently-enrolled-patients-aggregate';
import * as combined_breast_cervical_cancer_daily_screening_summary_aggregate from './json-reports/combined-breast-cervical-cancer-daily-screening-summary-aggregate.json';
import * as combined_breast_cervical_cancer_monthly_screening_summary_aggregate from './json-reports/combined-breast-cervical-cancer-monthly-screening-summary-aggregate.json';
import * as combined_breast_cervical_cancer_monthly_screening_summary_base from './json-reports/combined-breast-cervical-cancer-monthly-screening-summary-base.json';
import * as combined_breast_cervical_cancer_daily_screening_summary_base from './json-reports/combined-breast-cervical-cancer-daily-screening-summary-base.json';
import * as combined_breast_cervical_cancer_patient_list_template from './json-reports/combined-breast-cervical-cancer-patient-list-template.json';

import * as lung_cancer_daily_screening_summary_aggregate from './json-reports/lung-cancer-daily-screening-summary-aggregate.json';
import * as lung_cancer_monthly_screening_summary_aggregate from './json-reports/lung-cancer-monthly-screening-summary-aggregate.json';
import * as lung_cancer_monthly_screening_summary_base from './json-reports/lung-cancer-monthly-screening-summary-base.json';
import * as lung_cancer_patient_list_template from './json-reports/lung-cancer-patient-list-template.json';

import * as differentiated_care_program_aggregate from './json-reports/differentiated-care-program-aggregate.json';
import * as differentiated_care_program_base from './json-reports/differentiated-care-program-base.json';

import * as surge_report_base from './json-reports/surge-report-base.json';
import * as surge_report_aggregate from './json-reports/surge-report-aggregate.json';

import * as referral_patient_list_peer_base from './json-reports/referral-peer-base';
import * as referral_peer_aggregate from './json-reports/referral-peer-aggregate';
import * as surge_daily_report_base from './json-reports/surge-daily-report-base';
import * as surge_daily_report_aggregate from './json-reports/surge-daily-report-aggregate';
import * as surge from './json-reports/surge-report.json';
import * as prep_base_report from './json-reports/prep-base-report.json';
import * as prep_aggregate_report from './json-reports/prep-aggregate-report.json';
import * as patient_list_prep_template from './json-reports/patient-list-prep-template.json';

export class BaseMysqlReport {
    constructor(reportName, params) {
        this.reportName = reportName;
        this.params = params;
    }

    generateReport() {
        // 1. Fetch report schema
        // 2. Generate report sql using json2sql
        // 3. Execute sql statement using sql generator
        const that = this;
        return new Promise((resolve, error) => {
            // fetch reports
            that.fetchReportSchema(that.reportName)
                .then((reportSchemas) => {
                    that.reportSchemas = reportSchemas;
                    // generate query
                    that.generateReportQuery(that.reportSchemas, that.params)
                        .then((sqlQuery) => {
                            // allow user to use 'null' as parameter values
                            sqlQuery = sqlQuery.replace(/\'null\'/g, "null");
                            // console.log('Query: ', sqlQuery);

                            that.reportQuery = sqlQuery;
                            // run query
                            // console.log('Query', sqlQuery);
                            that.executeReportQuery(that.reportQuery)
                                .then((result) => {
                                    return that.transFormResults(that.reportSchemas, result);
                                })
                                .then((results) => {
                                    that.queryResults = results;

                                    resolve({
                                        schemas: that.reportSchemas,
                                        sqlQuery: that.reportQuery,
                                        results: that.queryResults
                                    });
                                })
                                .catch((err) => {
                                    error(err);
                                });

                        })
                        .catch((err) => {
                            error(err);
                        });
                })
                .catch((err) => {
                    error(err);
                })
        });
    }

    fetchReportSchema(reportName, version) {
        return new Promise((resolve, reject) => {
            switch (reportName) {
                case 'MOH-731-greencard':
                    resolve({
                        main: this.cloneJsonSchema(moh_731_greencard)
                    });
                    break;
                case 'MOH-731-bluecard':
                    resolve({
                        main: this.cloneJsonSchema(moh_731_bluecard)
                    });
                    break;
                case 'patient-list-template':
                    resolve({
                        main: this.cloneJsonSchema(patient_list_template) //patient_list_frozen_template
                    });
                    break;
                case 'patient-list-frozen-template':
                    resolve({
                        main: this.cloneJsonSchema(patient_list_frozen_template) //patient_list_frozen_template
                    });
                    break;
                case 'patient-list-schedules-template':
                    resolve({
                        main: this.cloneJsonSchema(patient_list_schedules_template)
                    });
                    break;
                case 'patient-list-with-contacts-template':
                    resolve({
                        main: this.cloneJsonSchema(patient_list_with_contacts_template)
                    });
                    break;
                case 'patient-list-prep-template':
                    resolve({
                        main: this.cloneJsonSchema(patient_list_prep_template)
                    });
                    break;
                case 'mainDatasetAggregate':
                    resolve({
                        main: this.cloneJsonSchema(main_dataset_aggregate),
                        mainDataSetBase: this.cloneJsonSchema(main_dataset_base)
                    });
                    break;
                case 'mainDatasetAggregateBlueCard':
                    resolve({
                        main: this.cloneJsonSchema(main_dataset_aggregate_blue_card),
                        mainDataSetBaseBlueCard: this.cloneJsonSchema(main_dataset_base_blue_card)
                    });
                    break;
                case 'regimenDataSetAggregate':
                    resolve({
                        main: this.cloneJsonSchema(regimen_dataset_aggregate),
                        regimenDataSetbase: this.cloneJsonSchema(regimen_dataset_base)
                    });
                    break;
                case 'retentionDataSetAggregate':
                    resolve({
                        main: this.cloneJsonSchema(retention_dataset_aggregate),
                        retentionDataSetbase: this.cloneJsonSchema(retention_dataset_base)
                    });
                    break;
                case 'mainDatasetAggregateAgeDisaggregation':
                    resolve({
                        main: this.cloneJsonSchema(main_dataset_aggregate_age_disaggregation),
                        mainDataSetBase: this.cloneJsonSchema(main_dataset_base)
                    });
                    break;
                case 'mainDatasetAggregateNoDisaggregation':
                    resolve({
                        main: this.cloneJsonSchema(main_dataset_aggregate_no_disaggregation),
                        mainDataSetBase: this.cloneJsonSchema(main_dataset_base)
                    });
                    break;
                case 'mainDatasetAggregateAge15Disaggregation':
                    resolve({
                        main: this.cloneJsonSchema(main_dataset_aggregate_age15_disaggregation),
                        mainDataSetBaseAge15: this.cloneJsonSchema(main_dataset_base_age15)
                    });
                    break;
                case 'mainDatasetAggregateAge18Disaggregation':
                    resolve({
                        main: this.cloneJsonSchema(main_dataset_aggregate_age18_disaggregation),
                        mainDataSetBaseAge18: this.cloneJsonSchema(main_dataset_base_age18)
                    });
                    break;
                case 'pepDatasetAggregate':
                    resolve({
                        main: this.cloneJsonSchema(pep_dataset_aggregate),
                        pepDataSetbase: this.cloneJsonSchema(pep_dataset_base)
                    });
                    break;
                case 'hivMonthlySummaryReportAggregate':
                    resolve({
                        main: this.cloneJsonSchema(hiv_monthly_summary_dataset_aggregation),
                        hivMonthlySummaryDataSetBase: this.cloneJsonSchema(hiv_monthly_summary_dataset_base)
                    });
                    break;
                case 'clinicComparatorAggregate':
                    resolve({
                        main: this.cloneJsonSchema(clinic_comparator_aggregate),
                        clinicComparatorBase: this.cloneJsonSchema(clinic_comparator_base)
                    });
                    break;
                case 'dataEntryStatisticsAggregate':
                    resolve({
                        main: this.cloneJsonSchema(dataentry_statistics_aggregate),
                        dataEntryStatistics: this.cloneJsonSchema(dataentry_statistics_base)
                    });
                    break;
                case 'hivSummaryBaseAggregate':
                    resolve({
                        main: this.cloneJsonSchema(hiv_summary_aggregate),
                        hivSummaryBase: this.cloneJsonSchema(hiv_summary_base)
                    });
                    break;
                case 'patientFlow':
                    resolve({
                        main: this.cloneJsonSchema(patient_flow)
                    });
                    break;
                case 'clinicHivComparativeOverviewAggregate':
                    resolve({
                        main: this.cloneJsonSchema(clinical_hiv_comparative_overview_aggregate),
                        clinicHivComparativeOverviewBase: this.cloneJsonSchema(clinical_hiv_comparative_overview_base)
                    });
                    break;
                case 'clinicalArtOverviewAggregeate':
                    resolve({
                        main: this.cloneJsonSchema(clinical_art_overview_aggregate),
                        clinicalArtOverviewBase: this.cloneJsonSchema(clinical_art_overview_base)
                    });
                    break;
                case 'dailyAppointmentsAggregate':
                    resolve({
                        main: this.cloneJsonSchema(daily_appointments_aggregate),
                        dailyAppointmentsBase: this.cloneJsonSchema(daily_appointments_base),
                        dailyAppointmentlatestRtcCohortBase: this.cloneJsonSchema(daily_appointment_latest_rtc_cohort_base)
                    });
                    break;
                case 'dailyAttendanceAggregate':
                    resolve({
                        main: this.cloneJsonSchema(daily_attendance_aggregate),
                        dailyAttendanceBase: this.cloneJsonSchema(daily_attendance_base)
                    });
                    break;
                case 'dailyHasNotReturnedAggregate':
                    resolve({
                        main: this.cloneJsonSchema(daily_has_not_returned_aggregate),
                        dailyHasNotReturnedBase: this.cloneJsonSchema(daily_has_not_returned_base),
                        dailyHasNotReturnedCohort: this.cloneJsonSchema(daily_has_not_returned_cohort),
                        nextDrugPickupEncounterBase: this.cloneJsonSchema(next_drug_pickup_encounter_base)
                    });
                    break;
                case 'dailyHasNotReturnedCohort':
                    resolve({
                        main: this.cloneJsonSchema(daily_has_not_returned_cohort)
                    });
                    break;
                case 'patintChangeStatusTrackerAggregate':
                    resolve({
                        main: this.cloneJsonSchema(patint_change_status_tracker_aggregate),
                        patintChangeStatusTrackerDataSetbase: this.cloneJsonSchema(patint_change_status_tracker_base)
                    });
                    break;
                case 'everOnARTAggregate':
                    resolve({
                        main: this.cloneJsonSchema(ever_on_art_aggregate),
                        everOnARTBase: this.cloneJsonSchema(ever_on_art_base)
                    });
                    break;
                case 'everOnARTDisaggregation':
                    resolve({
                        main: this.cloneJsonSchema(ever_on_art_disaggregation),
                        everOnARTBase: this.cloneJsonSchema(ever_on_art_base)
                    })
                    break;
                case 'referral-patient-list-template':
                    resolve({
                        main: this.cloneJsonSchema(referral_patient_list_template)
                    });
                    break;
                case 'patients-requiring-viral-load-template':
                    resolve({
                        main: this.cloneJsonSchema(patients_requiring_viral_load_template)
                    });
                    break;
                case 'referralAggregate':
                    resolve({
                        main: this.cloneJsonSchema(referral_aggregate),
                        referralDatasetbase: this.cloneJsonSchema(referral_dataset_base)
                    });
                    break;
                case 'StartingARTAggregationAge15':
                    resolve({
                        main: this.cloneJsonSchema(starting_art_aggregation_age15),
                        StartingARTSetBaseAge15: this.cloneJsonSchema(starting_art_base_age15)
                    });
                    break;
                case 'StartingARTDisaggregationAge15':
                    resolve({
                        main: this.cloneJsonSchema(starting_art_disaggregation_age15),
                        StartingARTSetBaseAge15: this.cloneJsonSchema(starting_art_base_age15)
                    });
                    break;
                case 'StartingARTAggregationAgeGreen':
                    resolve({
                        main: this.cloneJsonSchema(starting_art_aggregation_age_green),
                        StartingARTSetBaseAgeGreen: this.cloneJsonSchema(starting_art_base_age_green)
                    });
                    break;
                case 'StartingARTDisaggregationAgeGreen':
                    resolve({
                        main: this.cloneJsonSchema(starting_art_disaggregation_age_green),
                        StartingARTSetBaseAgeGreen: this.cloneJsonSchema(starting_art_base_age_green)
                    });
                    break;
                case 'StartingARTDisaggregationAgeOnlyGreen':
                    resolve({
                        main: this.cloneJsonSchema(starting_art_disaggregation_age_only_green),
                        StartingARTSetBaseAgeGreen: this.cloneJsonSchema(starting_art_base_age_green)
                    })
                case 'medicalHistoryReport':
                    resolve({
                        main: this.cloneJsonSchema(medical_history_dataset_base)

                    });
                    break;
                case 'breastCancerDailySummaryAggregate':
                    resolve({
                        main: this.cloneJsonSchema(breast_cancer_daily_screening_summary_aggregate),
                        breastCancerMonthlySummaryBase: this.cloneJsonSchema(breast_cancer_monthly_screening_summary_base)
                    });
                case 'breastCancerMonthlySummaryAggregate':
                    resolve({
                        main: this.cloneJsonSchema(breast_cancer_monthly_screening_summary_aggregate),
                        breastCancerMonthlySummaryBase: this.cloneJsonSchema(breast_cancer_monthly_screening_summary_base)
                    });
                    break;
                case 'lungCancerTreatmentMonthlySummaryAggregate':
                    resolve({
                        main: this.cloneJsonSchema(lung_cancer_treatment_monthly_summary_aggregate),
                        lungCancerTreatmentMonthlySummaryBase: this.cloneJsonSchema(lung_cancer_treatment_monthly_summary_base)
                    });
                    break;
                case 'lungCancerTreatmentDailySummaryAggregate':
                    resolve({
                        main: this.cloneJsonSchema(lung_cancer_treatment_daily_summary_aggregate),
                        lungCancerTreatmentSummaryBase: this.cloneJsonSchema(lung_cancer_treatment_summary_base)
                    });
                    break;
                case 'lung_cancer_treatment_patient_list_template':
                    resolve({
                        main: this.cloneJsonSchema(lung_cancer_treatment_patient_list_template)
                    });
                    break;
                case 'combinedBreastCervicalCancerDailySummaryAggregate':
                    resolve({
                        main: this.cloneJsonSchema(combined_breast_cervical_cancer_daily_screening_summary_aggregate),
                        combinedBreastCervicalCancerDailySummaryBase: this.cloneJsonSchema(combined_breast_cervical_cancer_daily_screening_summary_base)
                    })
                case 'combinedBreastCervicalCancerMonthlySummaryAggregate':
                    resolve({
                        main: this.cloneJsonSchema(combined_breast_cervical_cancer_monthly_screening_summary_aggregate),
                        combinedBreastCervicalCancerMonthlySummaryBase: this.cloneJsonSchema(combined_breast_cervical_cancer_monthly_screening_summary_base)
                    });
                    break;
                case 'breast_cancer_patient_list_template':
                    resolve({
                        main: this.cloneJsonSchema(breast_cancer_patient_list_template)
                    });
                    break;
                case 'combined_breast_cervical_cancer_patient_list_template':
                    resolve({
                        main: this.cloneJsonSchema(combined_breast_cervical_cancer_patient_list_template)
                    });
                    break;
                case 'cervicalCancerDailySummaryAggregate':
                    resolve({
                        main: this.cloneJsonSchema(cervical_cancer_daily_screening_summary_aggregate),
                        cervicalCancerMonthlyReportBase: this.cloneJsonSchema(cervical_cancer_monthly_screening_summary_base)
                    });
                case 'cervicalCancerMonthlySummaryAggregate':
                    resolve({
                        main: this.cloneJsonSchema(cervical_cancer_monthly_screening_summary_aggregate),
                        cervicalCancerMonthlyReportBase: this.cloneJsonSchema(cervical_cancer_monthly_screening_summary_base)
                    });
                    break;


                case 'lungCancerDailySummaryAggregate':
                    resolve({
                        main: this.cloneJsonSchema(lung_cancer_daily_screening_summary_aggregate),
                        lungCancerMonthlySummaryBase: this.cloneJsonSchema(lung_cancer_monthly_screening_summary_base)
                    });
                case 'lungCancerMonthlySummaryAggregate':
                    resolve({
                        main: this.cloneJsonSchema(lung_cancer_monthly_screening_summary_aggregate),
                        lungCancerMonthlySummaryBase: this.cloneJsonSchema(lung_cancer_monthly_screening_summary_base)
                    });
                    break;
                case 'lung_cancer_patient_list_template':
                    resolve({
                        main: this.cloneJsonSchema(lung_cancer_patient_list_template)
                    });
                    break;

                case 'labsReportAggregate':
                    resolve({
                        main: this.cloneJsonSchema(labs_report_aggregate),
                        labsReportBase: this.cloneJsonSchema(labs_report_base),

                    });
                    break;
                case 'patients-requiring-viral-load-template':
                    resolve({
                        main: this.cloneJsonSchema(patients_requiring_viral_load_template)
                    });
                    break;
                case 'clinicLabOrdersReport':
                    resolve({
                        main: this.cloneJsonSchema(clinic_lab_orders_report)
                    })
                    break;
                case 'cdmPatientSummary':
                    resolve({
                        main: this.cloneJsonSchema(cdm_dataset_base)
                    });
                    break;
                case 'clinicalReminderReport':
                    resolve({
                        main: this.cloneJsonSchema(clinical_reminders_report),
                        flatLabsAndImagingDataSetbase: this.cloneJsonSchema(labs_and_imaging_dataset_base)
                    });
                    break;
                case 'enhancedAdherenceHIVProgramAggregate':
                    resolve({
                        main: this.cloneJsonSchema(enhanced_adherence_hiv_program_aggregate),
                        enhancedAdherenceHIVProgramBase: this.cloneJsonSchema(enhanced_adherence_hiv_program_base),
                        patientProgramCohort: this.cloneJsonSchema(patient_program_cohort),
                        enhancedAdherenceHIVProgramCohort: this.cloneJsonSchema(enhanced_adherence_hiv_program_cohort)
                    });
                    break;
                case 'currentlyEnrolledPatientsAggregate':
                    resolve({
                        main: this.cloneJsonSchema(currently_enrolled_patients_aggregate),
                        currentlyEnrolledPatientsBase: this.cloneJsonSchema(currently_enrolled_patients_base)
                    });
                    break;
                case 'differentiatedCareProgramAggregate':
                    resolve({
                        main: this.cloneJsonSchema(differentiated_care_program_aggregate),
                        differentiatedCareProgramBase: this.cloneJsonSchema(differentiated_care_program_base)
                    });
                    break;
                case 'surgeReport':
                    resolve({
                        main: this.cloneJsonSchema(surge_report_aggregate),
                        surgeReport: this.cloneJsonSchema(surge_report_base)
                    });
                    break;
                case 'referral-patient-peer-navigator-list':
                        resolve({
                            main: this.cloneJsonSchema(referral_peer_aggregate),
                            referralDatasetbase: this.cloneJsonSchema(referral_patient_list_peer_base)
                        });
                        break;
                case 'surgeDailyReport':
                    resolve({
                        main: this.cloneJsonSchema(surge_daily_report_aggregate),
                        surgeDailyReport: this.cloneJsonSchema(surge_daily_report_base)
                    });
                    break;
                case 'prepReport':
                    resolve({
                        main: this.cloneJsonSchema(prep_aggregate_report),
                        prepBaseReport: this.cloneJsonSchema(prep_base_report)
                    });
                    break;
                case 'surge':
                    resolve({
                        main: this.cloneJsonSchema(surge)
                    });
                    break;
                default:
                    reject('Unknown report ', reportName);
                    break;
            }

        });
    }

    generateReportQuery(reportSchemas, params) {
        // console.log('Passed params', params)
        // console.log('report schemas', JSON.stringify(reportSchemas, null, 4));
        let jSql = this.getJson2Sql(reportSchemas, params);
        return new Promise((resolve, reject) => {
            try {
                resolve(jSql.generateSQL().toString());
            } catch (error) {
                console.error('Error generating report sql statement', error);
                reject('Encountered an unexpected error', error);
            }
        });
    }


    getJson2Sql(reportSchemas, params) {
        return new Json2Sql(reportSchemas.main, reportSchemas, params);
    }

    executeReportQuery(sqlQuery) {
        // console.log('Executing Query', sqlQuery);
        let runner = this.getSqlRunner();
        return new Promise((resolve, reject) => {
            runner.executeQuery(sqlQuery)
                .then((results) => {
                    resolve({
                        results: results
                    });
                })
                .catch((error) => {
                    reject(error)
                });
        });
    }

    transFormResults(reportSchemas, result) {
        return new Promise((resolve, reject) => {
            try {
                if (reportSchemas && reportSchemas.main && reportSchemas.main.transFormDirectives &&
                    reportSchemas.main.transFormDirectives.disaggregationColumns &&
                    reportSchemas.main.transFormDirectives.joinColumn) {
                    const reportProcessorHelpersService = new ReportProcessorHelpersService();
                    let final = reportProcessorHelpersService.tranform(result.results, {
                        use: reportSchemas.main.transFormDirectives.disaggregationColumns,
                        skip: reportSchemas.main.transFormDirectives.skipColumns || [],
                        joinColumn: reportSchemas.main.transFormDirectives.joinColumn
                    });
                    result.results = final;
                }
                resolve(result);
            } catch (error) {
                console.error(error);
                reject(error);
                // expected output: SyntaxError: unterminated string literal
                // Note - error messages will vary depending on browser
            }
        });
    }

    getSqlRunner() {
        return new QueryService();
    }

    cloneJsonSchema(schema) {
        return JSON.parse(JSON.stringify(schema));
    }
}