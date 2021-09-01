import { Json2Sql } from 'ampath-json2sql';
import { Promise } from 'bluebird';
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
import * as referral_peer_aggregate from './json-reports/referral-peer-aggregate.json';
import * as referral_patient_list_peer_base from './json-reports/referral-peer-base.json';
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
import * as differentiated_care_weight_dataset from './json-reports/differentiated-care-weight-dataset.json';

// appointment adherence
import * as appointment_adherence from './json-reports/retention-report/appointment-adherence.json';
import * as retention_appointment_adherence_aggregate from './json-reports/retention-appointment-adherence-aggregate';
import * as retention_appointment_adherence_base from './json-reports/retention-appointment-adherence-base.json';
import * as retention_report_patient_list_template from './json-reports/retention-report-patient-list-template.json';
// defaulter tracing
import * as retention_defaulter_tracing_base from './json-reports/retention-defaulter-tracing-base.json';
import * as retention_defaulter_tracing_aggregate from './json-reports/retention-defaulter-tracing-aggregate.json';
// retention visits
import * as retention_visits_base from './json-reports/retention-report-visits-base.json';
import * as retention_visits_aggregate from './json-reports/retention-report-visits-aggregate.json';
import * as retention_intervention_cohort from './json-reports/retention-intervention-cohort.json';
import * as retention_ltfu_base from './json-reports/retention-ltfu-base.json';
import * as retention_ltfu_aggregate from './json-reports/retention-ltfu-aggregate.json';

import * as surge_report_base from './json-reports/surge-report-base.json';
import * as surge_report_aggregate from './json-reports/surge-report-aggregate.json';

import * as surge_daily_report_base from './json-reports/surge-daily-report-base';
import * as surge_daily_report_aggregate from './json-reports/surge-daily-report-aggregate';
import * as surge from './json-reports/surge-report.json';
import * as prep_base_report from './json-reports/prep-base-report.json';
import * as prep_aggregate_report from './json-reports/prep-aggregate-report.json';
import * as prep_dataset_report from './json-reports/prep-dataset-report.json';
import * as ltfu_surge_baseline_report from './json-reports/ltfus-surge-baseline-base.json';
import * as ltfu_surge_baseline_aggregate_report from './json-reports/ltfus-surge-baseline-aggregate.json';
import * as prep_report_patient_list_template from './json-reports/prep-report-patient-list-template.json';

import * as hiv_latest_clinical_encounter_date_base from './json-reports/hiv-latest-clinical-encounter-date-base.json';
import * as prep_monthly_summary from './json-reports/prep-monthly-summary.json';
import * as prep_monthly_summary_aggregate_report from './json-reports/prep-monthly-summary-aggregate.json';
import * as prep_monthly_summary_base_report from './json-reports/prep-monthly-summary-base.json';
import * as prep_monthly_populationtype_disaggregation from './json-reports/prep-monthly-population-type-disaggregation.json';
import * as prep_monthly_breastfeeding_disaggregation from './json-reports/prep-monthly-breastfeeding-disaggregation.json';
import * as prep_monthly_pregnancy_disaggregation from './json-reports/prep-monthly-pregnancy-disaggregation.json';
import * as prep_monthly_newly_enrolled_breastfeeding_disaggregation from './json-reports/prep-monthly-newly-enrolled-breastfeeding-disaggregation.json';
import * as prep_monthly_newly_enrolled_pregnancy_disaggregation from './json-reports/prep-monthly-newly-enrolled-pregnancy-disaggregation.json';
import * as prep_latest_clinical_encounter_date_base from './json-reports/prep_latest_clinical_encounter_date_base.json';
import * as prep_initial_encounter_date from './json-reports/prep-initial-encounter-date.json';
import * as prep_clinical_remainder from './json-reports/prep-clinical-reminder-report.json';
import * as moh_408 from './json-reports/moh-408.json';
import * as hei_infant_feeding_aggregate from './json-reports/hei-infant-feeding-aggregate.json';
import * as hei_infant_feeding_base from './json-reports/hei-infant-feeding-base.json';
import * as hei_infant_feeding_no_disaggregation_aggregate from './json-reports/hei-infant-feeding-no-disaggregation-aggregate.json';
import * as hei_infant_feeding_no_disaggregation_base from './json-reports/hei-infant-feeding-no-disaggregation-base.json';
import * as hei_infant_testing_base from './json-reports/hei-infant-testing-base.json';
import * as hei_infant_testing_aggregate from './json-reports/hei-infant-testing-aggregate.json';
import * as hei_retention_pairs_base from './json-reports/hei-retention-pairs-base.json';
import * as hei_retention_pairs_aggregate from './json-reports/hei-retention-pairs-aggregate.json';
import * as hei_mother_base from './json-reports/hei-mother-base.json';
import * as hei_mother_aggregate from './json-reports/hei-mother-aggregate.json';
import * as hei_program_outcome_base from './json-reports/hei-program-outcome-base.json';
import * as hei_program_outcome_aggregate from './json-reports/hei-program-outcome-aggregate.json';
import * as hei_original_cohort_base from './json-reports/hei-original-cohort-base.json';
import * as hei_original_cohort_aggregate from './json-reports/hei-original-cohort-aggregate.json';
import * as hei_unknown_program_outcome_aggregate from './json-reports/hei-unknown-program-outcome-aggregate.json';
import * as hei_unknown_program_outcome_base from './json-reports/hei-unknown-program-outcome-base.json';
import * as hei_report_patient_list_template from './json-reports/hei-report-patient-list-template.json';

import * as patient_gain_loses_base from './json-reports/patient-gain-loses-base.json';
import * as patient_gain_loses_aggregate from './json-reports/patient-gain-loses-aggregate.json';
import * as patient_gain_lose_dataset_1 from './json-reports/patient-gain-lose-dataset-1.json';
import * as patient_gain_lose_dataset_2 from './json-reports/patient-gain-lose-dataset-2.json';

import * as ovc_report from './json-reports/ovc-report.json';
import * as ovc_in_hiv_dataset_base from './json-reports/ovc-in-hiv-dataset-base.json';
import * as ovc_in_hiv_dataset_aggregate from './json-reports/ovc-in-hiv-dataset-aggregate.json';
import * as ovc_in_hei_dataset_base from './json-reports/ovc-in-hei-dataset-base.json';
import * as ovc_in_hei_dataset_aggregate from './json-reports/ovc-in-hei-dataset-aggregate.json';
import * as ovc_patient_list_template from './json-reports/ovc-patient-list-template.json';
import * as ovc_in_hei_patient_list_template from './json-reports/ovc-in-hei-patient-list-template.json';

import * as tb_preventive_ipt_monthly_summary_aggregate from './json-reports/tb-preventive-ipt-monthly-summary-aggregate.json';
import * as tb_preventive_monthly_summary_aggregate from './json-reports/tb-preventive-monthly-summary-aggregate.json';
import * as tb_preventive_dataSet_base from './json-reports/tb-preventive-dataset-base.json';
import * as tb_preventive_report from './json-reports/tb-preventive-report.json';

import * as monthly_gains_losses from './json-reports/gains-and-losses/monthly-gains-and-losses.json';
import * as hiv_monthly_loss_aggregate from './json-reports/hiv-monthly-losses-aggregate.json';
import * as hiv_monthly_loss_base from './json-reports/hiv-monthly-losses-base.json';
import * as hiv_monthly_gains_aggregate from './json-reports/hiv-monthly-gains-aggregate.json';
import * as hiv_monthly_gains_base from './json-reports/hiv-monthly-gains-base.json';
import * as patient_gains_and_losses_patient_list_template from './json-reports/patient-gains-and-losses-patient-list-template.json';

//MOH-412 HIV Cervical Cancer Screening
import * as hiv_cervical_cancer_screening_monthly_report from './json-reports/moh-412/cervical-cancer-screening-monthly-report.json';
import * as hiv_cervical_cancer_screening_monthly_pcf_report from './json-reports/moh-412/cervical-cancer-screening-monthly-pcf-report.json';
import * as hiv_cervical_cancer_screening_monthly_aggregate from './json-reports/hiv-cervical-cancer-screening-monthly-aggregate.json';
import * as hiv_cervical_cancer_screening_monthly_pcf_aggregate from './json-reports/hiv-cervical-cancer-screening-monthly-pcf-aggregate.json';
import * as hiv_cervical_cancer_screening_monthly_base from './json-reports/hiv-cervical-cancer-screening-monthly-base.json';
import * as hiv_cervical_cancer_positive_screening_monthly_aggregate from './json-reports/hiv-cervical-cancer-positive-screening-monthly-aggregate.json';
import * as hiv_cervical_cancer_positive_screening_monthly_pcf_aggregate from './json-reports/hiv-cervical-cancer-positive-screening-monthly-pcf-aggregate.json';
import * as hiv_cervical_cancer_positive_screening_monthly_base from './json-reports/hiv-cervical-cancer-positive-screening-monthly-base.json';
import * as hiv_cervical_cancer_treatment_monthly_aggregate from './json-reports/hiv-cervical-cancer-treatment-monthly-aggregate.json';
import * as hiv_cervical_cancer_treatment_monthly_pcf_aggregate from './json-reports/hiv-cervical-cancer-treatment-monthly-pcf-aggregate.json';
import * as hiv_cervical_cancer_treatment_monthly_base from './json-reports/hiv-cervical-cancer-treatment-monthly-base.json';
import * as hiv_positive_cervical_cancer_screening_monthly_aggregate from './json-reports/hiv-positive-cervical-cancer-screening-monthly-aggregate.json';
import * as hiv_positive_cervical_cancer_screening_monthly_pcf_aggregate from './json-reports/hiv-positive-cervical-cancer-screening-monthly-pcf-aggregate.json';
import * as hiv_positive_cervical_cancer_screening_monthly_base from './json-reports/hiv-positive-cervical-cancer-screening-monthly-base.json';
import * as hiv_cervical_cancer_screening_monthly_main_dataset_aggregate from './json-reports/hiv-cervical-cancer-screening-monthly-main-dataset-aggregate.json';
import * as hiv_cervical_cancer_screening_monthly_main_dataset_pcf_aggregate from './json-reports/hiv-cervical-cancer-screening-monthly-main-dataset-pcf-aggregate.json';
import * as hiv_cervical_cancer_screening_monthly_main_dataset_base from './json-reports/hiv-cervical-cancer-screening-monthly-main-dataset-base.json';
import * as hiv_cervical_cancer_monthly_summary_lesions_base from './json-reports/hiv-cervical-cancer-monthly-summary-lesions-base.json';
import * as hiv_cervical_cancer_monthly_summary_lesions_aggregate from './json-reports/hiv-cervical-cancer-monthly-summary-lesions-aggregate.json';
import * as hiv_cervical_cancer_monthly_summary_lesions_pcf_aggregate from './json-reports/hiv-cervical-cancer-monthly-summary-lesions-pcf-aggregate.json';
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
      that
        .fetchReportSchema(that.reportName)
        .then((reportSchemas) => {
          that.reportSchemas = reportSchemas;
          // generate query
          that
            .generateReportQuery(that.reportSchemas, that.params)
            .then((sqlQuery) => {
              // allow user to use 'null' as parameter values
              sqlQuery = sqlQuery.replace(/\'null\'/g, 'null');

              that.reportQuery = sqlQuery;
              // run query
              // console.log('Query', sqlQuery);
              that
                .executeReportQuery(that.reportQuery)
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
        });
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
        case 'prep-report-patient-list-template':
          resolve({
            main: this.cloneJsonSchema(prep_report_patient_list_template)
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
            mainDataSetBaseBlueCard: this.cloneJsonSchema(
              main_dataset_base_blue_card
            )
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
            main: this.cloneJsonSchema(
              main_dataset_aggregate_age_disaggregation
            ),
            mainDataSetBase: this.cloneJsonSchema(main_dataset_base)
          });
          break;
        case 'mainDatasetAggregateNoDisaggregation':
          resolve({
            main: this.cloneJsonSchema(
              main_dataset_aggregate_no_disaggregation
            ),
            mainDataSetBase: this.cloneJsonSchema(main_dataset_base)
          });
          break;
        case 'mainDatasetAggregateAge15Disaggregation':
          resolve({
            main: this.cloneJsonSchema(
              main_dataset_aggregate_age15_disaggregation
            ),
            mainDataSetBaseAge15: this.cloneJsonSchema(main_dataset_base_age15)
          });
          break;
        case 'mainDatasetAggregateAge18Disaggregation':
          resolve({
            main: this.cloneJsonSchema(
              main_dataset_aggregate_age18_disaggregation
            ),
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
            hivMonthlySummaryDataSetBase: this.cloneJsonSchema(
              hiv_monthly_summary_dataset_base
            )
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
            main: this.cloneJsonSchema(
              clinical_hiv_comparative_overview_aggregate
            ),
            clinicHivComparativeOverviewBase: this.cloneJsonSchema(
              clinical_hiv_comparative_overview_base
            )
          });
          break;
        case 'clinicalArtOverviewAggregeate':
          resolve({
            main: this.cloneJsonSchema(clinical_art_overview_aggregate),
            clinicalArtOverviewBase: this.cloneJsonSchema(
              clinical_art_overview_base
            )
          });
          break;
        case 'dailyAppointmentsAggregate':
          resolve({
            main: this.cloneJsonSchema(daily_appointments_aggregate),
            dailyAppointmentsBase: this.cloneJsonSchema(
              daily_appointments_base
            ),
            dailyAppointmentlatestRtcCohortBase: this.cloneJsonSchema(
              daily_appointment_latest_rtc_cohort_base
            )
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
            dailyHasNotReturnedBase: this.cloneJsonSchema(
              daily_has_not_returned_base
            ),
            dailyHasNotReturnedCohort: this.cloneJsonSchema(
              daily_has_not_returned_cohort
            ),
            nextDrugPickupEncounterBase: this.cloneJsonSchema(
              next_drug_pickup_encounter_base
            )
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
            patintChangeStatusTrackerDataSetbase: this.cloneJsonSchema(
              patint_change_status_tracker_base
            )
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
          });
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
        case 'referral-patient-peer-navigator-list':
          resolve({
            main: this.cloneJsonSchema(referral_peer_aggregate),
            referralDatasetbase: this.cloneJsonSchema(
              referral_patient_list_peer_base
            )
          });
          break;
        case 'StartingARTAggregationAge15':
          resolve({
            main: this.cloneJsonSchema(starting_art_aggregation_age15),
            StartingARTSetBaseAge15: this.cloneJsonSchema(
              starting_art_base_age15
            )
          });
          break;
        case 'StartingARTDisaggregationAge15':
          resolve({
            main: this.cloneJsonSchema(starting_art_disaggregation_age15),
            StartingARTSetBaseAge15: this.cloneJsonSchema(
              starting_art_base_age15
            )
          });
          break;
        case 'StartingARTAggregationAgeGreen':
          resolve({
            main: this.cloneJsonSchema(starting_art_aggregation_age_green),
            StartingARTSetBaseAgeGreen: this.cloneJsonSchema(
              starting_art_base_age_green
            )
          });
          break;
        case 'StartingARTDisaggregationAgeGreen':
          resolve({
            main: this.cloneJsonSchema(starting_art_disaggregation_age_green),
            StartingARTSetBaseAgeGreen: this.cloneJsonSchema(
              starting_art_base_age_green
            )
          });
          break;
        case 'StartingARTDisaggregationAgeOnlyGreen':
          resolve({
            main: this.cloneJsonSchema(
              starting_art_disaggregation_age_only_green
            ),
            StartingARTSetBaseAgeGreen: this.cloneJsonSchema(
              starting_art_base_age_green
            )
          });
        case 'medicalHistoryReport':
          resolve({
            main: this.cloneJsonSchema(medical_history_dataset_base)
          });
          break;
        case 'breastCancerDailySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              breast_cancer_daily_screening_summary_aggregate
            ),
            breastCancerMonthlySummaryBase: this.cloneJsonSchema(
              breast_cancer_monthly_screening_summary_base
            )
          });
        case 'breastCancerMonthlySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              breast_cancer_monthly_screening_summary_aggregate
            ),
            breastCancerMonthlySummaryBase: this.cloneJsonSchema(
              breast_cancer_monthly_screening_summary_base
            )
          });
          break;
        case 'lungCancerTreatmentMonthlySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              lung_cancer_treatment_monthly_summary_aggregate
            ),
            lungCancerTreatmentMonthlySummaryBase: this.cloneJsonSchema(
              lung_cancer_treatment_monthly_summary_base
            )
          });
          break;
        case 'lungCancerTreatmentDailySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              lung_cancer_treatment_daily_summary_aggregate
            ),
            lungCancerTreatmentSummaryBase: this.cloneJsonSchema(
              lung_cancer_treatment_summary_base
            )
          });
          break;
        case 'lung_cancer_treatment_patient_list_template':
          resolve({
            main: this.cloneJsonSchema(
              lung_cancer_treatment_patient_list_template
            )
          });
          break;
        case 'combinedBreastCervicalCancerDailySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              combined_breast_cervical_cancer_daily_screening_summary_aggregate
            ),
            combinedBreastCervicalCancerDailySummaryBase: this.cloneJsonSchema(
              combined_breast_cervical_cancer_daily_screening_summary_base
            )
          });
        case 'combinedBreastCervicalCancerMonthlySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              combined_breast_cervical_cancer_monthly_screening_summary_aggregate
            ),
            combinedBreastCervicalCancerMonthlySummaryBase: this.cloneJsonSchema(
              combined_breast_cervical_cancer_monthly_screening_summary_base
            )
          });
          break;
        case 'breast_cancer_patient_list_template':
          resolve({
            main: this.cloneJsonSchema(breast_cancer_patient_list_template)
          });
          break;
        case 'combined_breast_cervical_cancer_patient_list_template':
          resolve({
            main: this.cloneJsonSchema(
              combined_breast_cervical_cancer_patient_list_template
            )
          });
          break;
        case 'cervicalCancerDailySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              cervical_cancer_daily_screening_summary_aggregate
            ),
            cervicalCancerMonthlyReportBase: this.cloneJsonSchema(
              cervical_cancer_monthly_screening_summary_base
            )
          });
        case 'cervicalCancerMonthlySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              cervical_cancer_monthly_screening_summary_aggregate
            ),
            cervicalCancerMonthlyReportBase: this.cloneJsonSchema(
              cervical_cancer_monthly_screening_summary_base
            )
          });
          break;

        case 'lungCancerDailySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              lung_cancer_daily_screening_summary_aggregate
            ),
            lungCancerMonthlySummaryBase: this.cloneJsonSchema(
              lung_cancer_monthly_screening_summary_base
            )
          });
        case 'lungCancerMonthlySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              lung_cancer_monthly_screening_summary_aggregate
            ),
            lungCancerMonthlySummaryBase: this.cloneJsonSchema(
              lung_cancer_monthly_screening_summary_base
            )
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
            labsReportBase: this.cloneJsonSchema(labs_report_base)
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
          });
          break;
        case 'cdmPatientSummary':
          resolve({
            main: this.cloneJsonSchema(cdm_dataset_base)
          });
          break;
        case 'clinicalReminderReport':
          resolve({
            main: this.cloneJsonSchema(clinical_reminders_report),
            flatLabsAndImagingDataSetbase: this.cloneJsonSchema(
              labs_and_imaging_dataset_base
            )
          });
          break;
        case 'enhancedAdherenceHIVProgramAggregate':
          resolve({
            main: this.cloneJsonSchema(
              enhanced_adherence_hiv_program_aggregate
            ),
            enhancedAdherenceHIVProgramBase: this.cloneJsonSchema(
              enhanced_adherence_hiv_program_base
            ),
            patientProgramCohort: this.cloneJsonSchema(patient_program_cohort),
            enhancedAdherenceHIVProgramCohort: this.cloneJsonSchema(
              enhanced_adherence_hiv_program_cohort
            ),
            hivLatestClinicalEncounterDateBase: this.cloneJsonSchema(
              hiv_latest_clinical_encounter_date_base
            )
          });
          break;
        case 'currentlyEnrolledPatientsAggregate':
          resolve({
            main: this.cloneJsonSchema(currently_enrolled_patients_aggregate),
            currentlyEnrolledPatientsBase: this.cloneJsonSchema(
              currently_enrolled_patients_base
            )
          });
          break;
        case 'differentiatedCareProgramAggregate':
          resolve({
            main: this.cloneJsonSchema(differentiated_care_program_aggregate),
            differentiatedCareProgramBase: this.cloneJsonSchema(
              differentiated_care_program_base
            ),
            hivLatestClinicalEncounterDateBase: this.cloneJsonSchema(
              hiv_latest_clinical_encounter_date_base
            )
          });
          break;
        case 'surgeReport':
          resolve({
            main: this.cloneJsonSchema(surge_report_aggregate),
            surgeReport: this.cloneJsonSchema(surge_report_base)
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
            prepBaseReport: this.cloneJsonSchema(prep_base_report),
            prepDatasetReport: this.cloneJsonSchema(prep_dataset_report)
          });
          break;
        case 'surgeBaselineReport':
          resolve({
            main: this.cloneJsonSchema(ltfu_surge_baseline_aggregate_report),
            surgeBaselineReport: this.cloneJsonSchema(
              ltfu_surge_baseline_report
            )
          });
          break;
        case 'surge':
          resolve({
            main: this.cloneJsonSchema(surge)
          });
          break;
        case 'retention-report':
          resolve({
            main: this.cloneJsonSchema(appointment_adherence)
          });
          break;
        case 'retentionAppointmentAdherenceAggregate':
          resolve({
            main: this.cloneJsonSchema(
              retention_appointment_adherence_aggregate
            ),
            retentionAppointmentAdherenceBase: this.cloneJsonSchema(
              retention_appointment_adherence_base
            )
          });
          break;
        case 'retentionDefaulterTracingAggregate':
          resolve({
            main: this.cloneJsonSchema(retention_defaulter_tracing_aggregate),
            retentionDefaulterTracingBase: this.cloneJsonSchema(
              retention_defaulter_tracing_base
            )
          });
          break;
        case 'retentionVisitsAggregate':
          resolve({
            main: this.cloneJsonSchema(retention_visits_aggregate),
            retentionVisitsBase: this.cloneJsonSchema(retention_visits_base),
            retentionInterventionCohort: this.cloneJsonSchema(
              retention_intervention_cohort
            )
          });
          break;
        case 'retentionLtfuAggregate':
          resolve({
            main: this.cloneJsonSchema(retention_ltfu_aggregate),
            retentionLtfuBase: this.cloneJsonSchema(retention_ltfu_base)
          });
          break;
        case 'retention-report-patient-list-template':
          resolve({
            main: this.cloneJsonSchema(retention_report_patient_list_template)
          });
          break;
        case 'prepMonthlySummaryReport':
          resolve({
            main: this.cloneJsonSchema(prep_monthly_summary),
            prepLatestClinicalEncounterDate: this.cloneJsonSchema(
              prep_latest_clinical_encounter_date_base
            )
          });
          break;
        case 'prepMonthlySummaryNoDisaggregation':
          resolve({
            main: this.cloneJsonSchema(prep_monthly_summary_aggregate_report),
            prepMonthlySummaryBaseReport: this.cloneJsonSchema(
              prep_monthly_summary_base_report
            ),
            prepLatestClinicalEncounterDate: this.cloneJsonSchema(
              prep_latest_clinical_encounter_date_base
            )
          });
          break;
        case 'prepMonthlySummaryPopulationTypeDisaggregation':
          resolve({
            main: this.cloneJsonSchema(
              prep_monthly_populationtype_disaggregation
            ),
            prepMonthlySummaryBaseReport: this.cloneJsonSchema(
              prep_monthly_summary_base_report
            ),
            prepLatestClinicalEncounterDate: this.cloneJsonSchema(
              prep_latest_clinical_encounter_date_base
            )
          });
          break;
        case 'prepMonthlySummaryBreastFeedingDisaggregation':
          resolve({
            main: this.cloneJsonSchema(
              prep_monthly_breastfeeding_disaggregation
            ),
            prepMonthlySummaryBaseReport: this.cloneJsonSchema(
              prep_monthly_summary_base_report
            ),
            prepLatestClinicalEncounterDate: this.cloneJsonSchema(
              prep_latest_clinical_encounter_date_base
            )
          });
          break;
        case 'prepMonthlyNewlyEnrolledBreastFeedingDisaggregation':
          resolve({
            main: this.cloneJsonSchema(
              prep_monthly_newly_enrolled_breastfeeding_disaggregation
            ),
            prepMonthlySummaryBaseReport: this.cloneJsonSchema(
              prep_monthly_summary_base_report
            ),
            prepLatestClinicalEncounterDate: this.cloneJsonSchema(
              prep_latest_clinical_encounter_date_base
            )
          });
          break;
        case 'prepMonthlyNewlyEnrolledPregnancyDisaggregation':
          resolve({
            main: this.cloneJsonSchema(
              prep_monthly_newly_enrolled_pregnancy_disaggregation
            ),
            prepMonthlySummaryBaseReport: this.cloneJsonSchema(
              prep_monthly_summary_base_report
            ),
            prepLatestClinicalEncounterDate: this.cloneJsonSchema(
              prep_latest_clinical_encounter_date_base
            )
          });
          break;
        case 'prepMonthlySummaryPregnancyDisaggregation':
          resolve({
            main: this.cloneJsonSchema(prep_monthly_pregnancy_disaggregation),
            prepMonthlySummaryBaseReport: this.cloneJsonSchema(
              prep_monthly_summary_base_report
            ),
            prepLatestClinicalEncounterDate: this.cloneJsonSchema(
              prep_latest_clinical_encounter_date_base
            )
          });
          break;
        case 'MOH-408':
          resolve({
            main: this.cloneJsonSchema(moh_408)
          });
          break;
        case 'heiInfantFeedingAggregate':
          resolve({
            main: this.cloneJsonSchema(hei_infant_feeding_aggregate),
            heiInfantFeedingBase: this.cloneJsonSchema(hei_infant_feeding_base)
          });
          break;
        case 'heiInfantFeedingNoDisaggregationAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hei_infant_feeding_no_disaggregation_aggregate
            ),
            heiInfantFeedingNoDisaggregationBase: this.cloneJsonSchema(
              hei_infant_feeding_no_disaggregation_base
            )
          });
          break;
        case 'heiInfantTestingAggregate':
          resolve({
            main: this.cloneJsonSchema(hei_infant_testing_aggregate),
            heiInfantTestingBase: this.cloneJsonSchema(hei_infant_testing_base)
          });
          break;
        case 'heiRetentionPairsAggregate':
          resolve({
            main: this.cloneJsonSchema(hei_retention_pairs_aggregate),
            heiRetentionPairsBase: this.cloneJsonSchema(
              hei_retention_pairs_base
            )
          });
          break;
        case 'heiMotherAggregate':
          resolve({
            main: this.cloneJsonSchema(hei_mother_aggregate),
            heiMotherBase: this.cloneJsonSchema(hei_mother_base)
          });
          break;
        case 'heiProgramOutcomeAggregate':
          resolve({
            main: this.cloneJsonSchema(hei_program_outcome_aggregate),
            heiProgramOutcomeBase: this.cloneJsonSchema(
              hei_program_outcome_base
            )
          });
          break;
        case 'heiUknownProgramOutcomeAggregate':
          resolve({
            main: this.cloneJsonSchema(hei_unknown_program_outcome_aggregate),
            heiUknownProgramOutcomeBase: this.cloneJsonSchema(
              hei_unknown_program_outcome_base
            )
          });
          break;
        case 'heiOriginalCohortAggregate':
          resolve({
            main: this.cloneJsonSchema(hei_original_cohort_aggregate),
            heiOriginalCohortBase: this.cloneJsonSchema(
              hei_original_cohort_base
            )
          });
          break;
        case 'hei-report-patient-list-template':
          resolve({
            main: this.cloneJsonSchema(hei_report_patient_list_template)
          });
          break;
        case 'patientGainLoseAggregate':
          resolve({
            main: this.cloneJsonSchema(patient_gain_loses_aggregate),
            patientGainLosesBaseReport: this.cloneJsonSchema(
              patient_gain_loses_base
            ),
            patientGainLoseDatasetOne: this.cloneJsonSchema(
              patient_gain_lose_dataset_1
            ),
            patientGainLoseDatasetTwo: this.cloneJsonSchema(
              patient_gain_lose_dataset_2
            )
          });
          break;
        case 'ovcReport':
          resolve({
            main: this.cloneJsonSchema(ovc_report)
          });
        case 'ovcInHivDatasetAggregate':
          resolve({
            main: this.cloneJsonSchema(ovc_in_hiv_dataset_aggregate),
            ovcInHivDatasetBase: this.cloneJsonSchema(ovc_in_hiv_dataset_base)
          });
        case 'ovcInHeiDatasetAggregate':
          resolve({
            main: this.cloneJsonSchema(ovc_in_hei_dataset_aggregate),
            ovcInHeiDatasetBase: this.cloneJsonSchema(ovc_in_hei_dataset_base)
          });
        case 'ovc-patient-list-template':
          resolve({
            main: this.cloneJsonSchema(ovc_patient_list_template)
          });
          break;
        case 'ovc-in-hei-patient-list-template':
          resolve({
            main: this.cloneJsonSchema(ovc_in_hei_patient_list_template)
          });
          break;
        case 'prepClinicalReminderReport':
          resolve({
            main: this.cloneJsonSchema(prep_clinical_remainder),
            prepLatestClinicalEncounterDate: this.cloneJsonSchema(
              prep_latest_clinical_encounter_date_base
            ),
            prepInitialClinicalEncounterDate: this.cloneJsonSchema(
              prep_initial_encounter_date
            )
          });
          break;
        case 'TbPreventiveReport':
          resolve({
            main: this.cloneJsonSchema(tb_preventive_report)
          });
          break;
        case 'TbPreventiveIptMonthlySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(
              tb_preventive_ipt_monthly_summary_aggregate
            ),
            TbPreventiveDataSetBase: this.cloneJsonSchema(
              tb_preventive_dataSet_base
            )
          });
          break;
        case 'TbPreventiveMonthlySummaryAggregate':
          resolve({
            main: this.cloneJsonSchema(tb_preventive_monthly_summary_aggregate),
            TbPreventiveDataSetBase: this.cloneJsonSchema(
              tb_preventive_dataSet_base
            )
          });
          break;
        case 'monthly-gains-and-losses':
          resolve({
            main: this.cloneJsonSchema(monthly_gains_losses)
          });
          break;
        case 'hivMonthlyLossesAggregate':
          resolve({
            main: this.cloneJsonSchema(hiv_monthly_loss_aggregate),
            hivMonthlyLossesBase: this.cloneJsonSchema(hiv_monthly_loss_base)
          });
        case 'hivMonthlyGainsAggregate':
          resolve({
            main: this.cloneJsonSchema(hiv_monthly_gains_aggregate),
            hivMonthlyGainsBase: this.cloneJsonSchema(hiv_monthly_gains_base)
          });
        case 'patient-gains-and-losses-patient-list-template':
          resolve({
            main: this.cloneJsonSchema(
              patient_gains_and_losses_patient_list_template
            )
          });
          break;
        case 'MOH-412-report':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_screening_monthly_report
            )
          });
          break;
        case 'MOH-412-PCF-report':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_screening_monthly_pcf_report
            )
          });
          break;
        case 'hivCervicalCancerScreeningMonthlyAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_screening_monthly_aggregate
            ),
            hivCervicalCancerScreeningMonthlyBase: this.cloneJsonSchema(
              hiv_cervical_cancer_screening_monthly_base
            )
          });
        case 'hivCervicalCancerScreeningMonthlyPcfAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_screening_monthly_pcf_aggregate
            ),
            hivCervicalCancerScreeningMonthlyBase: this.cloneJsonSchema(
              hiv_cervical_cancer_screening_monthly_base
            )
          });
        case 'hivCervicalCancerPositiveScreeningMonthlyAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_positive_screening_monthly_aggregate
            ),
            hivCervicalCancerPositiveScreeningMonthlyBase: this.cloneJsonSchema(
              hiv_cervical_cancer_positive_screening_monthly_base
            )
          });
        case 'hivCervicalCancerPositiveScreeningMonthlyPcfAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_positive_screening_monthly_pcf_aggregate
            ),
            hivCervicalCancerPositiveScreeningMonthlyBase: this.cloneJsonSchema(
              hiv_cervical_cancer_positive_screening_monthly_base
            )
          });
        case 'hivCervicalCancerTreatmentMonthlyAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_treatment_monthly_aggregate
            ),
            hivCervicalCancerTreatmentMonthlyBase: this.cloneJsonSchema(
              hiv_cervical_cancer_treatment_monthly_base
            )
          });
        case 'hivCervicalCancerTreatmentMonthlyPcfAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_treatment_monthly_pcf_aggregate
            ),
            hivCervicalCancerTreatmentMonthlyBase: this.cloneJsonSchema(
              hiv_cervical_cancer_treatment_monthly_base
            )
          });
        case 'hivPositiveCervicalCancerScreeningMonthlyAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_positive_cervical_cancer_screening_monthly_aggregate
            ),
            hivPositiveCervicalCancerScreeningMonthlyBase: this.cloneJsonSchema(
              hiv_positive_cervical_cancer_screening_monthly_base
            )
          });
        case 'hivPositiveCervicalCancerScreeningMonthlyPcfAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_positive_cervical_cancer_screening_monthly_pcf_aggregate
            ),
            hivPositiveCervicalCancerScreeningMonthlyBase: this.cloneJsonSchema(
              hiv_positive_cervical_cancer_screening_monthly_base
            )
          });
        case 'hivCervicalCancerScreeningMonthlyMainDatasetAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_screening_monthly_main_dataset_aggregate
            ),
            hivCervicalCancerScreeningMonthlyMainDatasetBase: this.cloneJsonSchema(
              hiv_cervical_cancer_screening_monthly_main_dataset_base
            )
          });
        case 'hivCervicalCancerScreeningMonthlyMainDatasetPcfAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_screening_monthly_main_dataset_pcf_aggregate
            ),
            hivCervicalCancerScreeningMonthlyMainDatasetBase: this.cloneJsonSchema(
              hiv_cervical_cancer_screening_monthly_main_dataset_base
            )
          });
        case 'hivCervicalCancerMonthlySummaryLesionsAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_monthly_summary_lesions_aggregate
            ),
            hivCervicalCancerMonthlySummaryLesionsBase: this.cloneJsonSchema(
              hiv_cervical_cancer_monthly_summary_lesions_base
            )
          });
        case 'hivCervicalCancerMonthlySummaryLesionsPcfAggregate':
          resolve({
            main: this.cloneJsonSchema(
              hiv_cervical_cancer_monthly_summary_lesions_pcf_aggregate
            ),
            hivCervicalCancerMonthlySummaryLesionsBase: this.cloneJsonSchema(
              hiv_cervical_cancer_monthly_summary_lesions_base
            )
          });
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
      runner
        .executeQuery(sqlQuery)
        .then((results) => {
          resolve({
            results: results
          });
        })
        .catch((error) => {
          console.error('Error Executing Mysql Query', error);
          reject(error);
        });
    });
  }

  transFormResults(reportSchemas, result) {
    return new Promise((resolve, reject) => {
      try {
        if (
          reportSchemas &&
          reportSchemas.main &&
          reportSchemas.main.transFormDirectives &&
          reportSchemas.main.transFormDirectives.disaggregationColumns &&
          reportSchemas.main.transFormDirectives.joinColumn
        ) {
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
