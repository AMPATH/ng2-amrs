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
import * as ever_on_art_aggregate from './json-reports/ever-on-art-aggregate.json';
import * as ever_on_art_disaggregation from './json-reports/ever-on-art-disaggregation.json';
import * as ever_on_art_base from './json-reports/ever-on-art-base.json';
import * as referral_patient_list_template from './json-reports/referral-patient-list-template.json';
import * as referral_dataset_base from './json-reports/referral-dataset-base.json';
import * as referral_aggregate from './json-reports/referral-aggregate.json';

import * as starting_art_aggregation_age15 from './json-reports/starting-art-aggregation-age15.json';
import * as starting_art_base_age15 from './json-reports/starting-art-base-age15.json';
import * as starting_art_disaggregation_age15 from './json-reports/starting-art-disaggregation-age15.json';

import * as starting_art_aggregation_age_green from './json-reports/starting-art-aggregation-age-green.json';
import * as starting_art_base_age_green from './json-reports/starting-art-base-age-green.json';
import * as starting_art_disaggregation_age_green from './json-reports/starting-art-disaggregation-age-green.json';
import * as starting_art_disaggregation_age_only_green from './json-reports/starting-art-disaggregation-age-only-green.json';
import * as medical_history_dataset_base from './json-reports/medical-history-dataset-base.json';

import * as breast_cancer_monthly_screening_summary_aggregate from './json-reports/breast-cancer-monthly-screening-summary-aggregate.json';
import * as breast_cancer_monthly_screening_summary_base from './json-reports/breast-cancer-monthly-screening-summary-base.json';
import * as breast_cancer_patient_list_template from './json-reports/breast-cancer-patient-list-template.json';

import * as cervical_cancer_monthly_screening_summary_aggregate from './json-reports/cervical-cancer-monthly-screening-summary-aggregate.json';
import * as cervical_cancer_monthly_screening_summary_base from './json-reports/cervical-cancer-monthly-screening-summary-base.json';

export class BaseMysqlReport{
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
                            // console.log(sqlQuery);
                            // allow user to use 'null' as parameter values
                            sqlQuery = sqlQuery.replace(/\'null\'/g, "null");
                            that.reportQuery = sqlQuery;
                            // run query
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
                        main: moh_731_greencard
                    });
                    break;
                case 'MOH-731-bluecard':
                    resolve({
                        main: moh_731_bluecard
                    });
                    break;
                case 'patient-list-template':
                    resolve({
                        main: patient_list_template
                    });
                    break;
                case 'mainDatasetAggregate':
                    resolve({
                        main: main_dataset_aggregate,
                        mainDataSetBase: main_dataset_base
                    });
                    break;
                case 'mainDatasetAggregateBlueCard':
                    resolve({
                        main: main_dataset_aggregate_blue_card,
                        mainDataSetBaseBlueCard: main_dataset_base_blue_card
                    });
                    break;
                case 'regimenDataSetAggregate':
                    resolve({
                        main: regimen_dataset_aggregate,
                        regimenDataSetbase: regimen_dataset_base
                    });
                    break;
                case 'retentionDataSetAggregate':
                    resolve({
                        main: retention_dataset_aggregate,
                        retentionDataSetbase: retention_dataset_base
                    });
                    break;
                case 'mainDatasetAggregateAgeDisaggregation':
                    resolve({
                        main: main_dataset_aggregate_age_disaggregation,
                        mainDataSetBase: main_dataset_base
                    });
                    break;
                case 'mainDatasetAggregateNoDisaggregation':
                    resolve({
                        main: main_dataset_aggregate_no_disaggregation,
                        mainDataSetBase: main_dataset_base
                    });
                    break;
                case 'mainDatasetAggregateAge15Disaggregation':
                    resolve({
                        main: main_dataset_aggregate_age15_disaggregation,
                        mainDataSetBaseAge15: main_dataset_base_age15
                    });
                    break;
                case 'mainDatasetAggregateAge18Disaggregation':
                    resolve({
                        main: main_dataset_aggregate_age18_disaggregation,
                        mainDataSetBaseAge18: main_dataset_base_age18
                    });
                    break;
                case 'pepDatasetAggregate':
                    resolve({
                        main: pep_dataset_aggregate,
                        pepDataSetbase: pep_dataset_base
                    });
                    break;
                case 'everOnARTAggregate':
                    resolve({
                        main: ever_on_art_aggregate,
                        everOnARTBase: ever_on_art_base
                    });
                    break;
                case 'everOnARTDisaggregation':
                    resolve({
                        main: ever_on_art_disaggregation,
                        everOnARTBase: ever_on_art_base
                    })
                    break;
                case 'referral-patient-list-template':
                    resolve({
                        main: referral_patient_list_template
                    });
                    break;
                case 'referralAggregate':
                    resolve({
                        main: referral_aggregate,
                        referralDatasetbase: referral_dataset_base
                    });
                    break;
                case 'StartingARTAggregationAge15':
                    resolve({
                        main: starting_art_aggregation_age15,
                        StartingARTSetBaseAge15: starting_art_base_age15
                    });
                    break;
                case 'StartingARTDisaggregationAge15':
                    resolve({
                        main: starting_art_disaggregation_age15,
                        StartingARTSetBaseAge15: starting_art_base_age15
                    });
                    break;
                case 'StartingARTAggregationAgeGreen':
                    resolve({
                        main: starting_art_aggregation_age_green,
                        StartingARTSetBaseAgeGreen: starting_art_base_age_green
                    });
                    break;
                case 'StartingARTDisaggregationAgeGreen':
                    resolve({
                        main: starting_art_disaggregation_age_green,
                        StartingARTSetBaseAgeGreen: starting_art_base_age_green
                    });
                    break;
                case 'StartingARTDisaggregationAgeOnlyGreen':
                    resolve({
                        main: starting_art_disaggregation_age_only_green,
                        StartingARTSetBaseAgeGreen: starting_art_base_age_green
                    })
                case 'medicalHistoryReport':
                    resolve({
                        main: medical_history_dataset_base

                    });
                    break;
                case 'breastCancerMonthlySummaryAggregate':
                    resolve({
                        main: breast_cancer_monthly_screening_summary_aggregate,
                        breastCancerMonthlySummaryBase: breast_cancer_monthly_screening_summary_base
                    });
                    break;
                case 'breast_cancer_patient_list_template':
                resolve({
                    main: breast_cancer_patient_list_template
                });
                break;
                case 'cervicalCancerMonthlySummaryAggregate':
                resolve({
                    main: cervical_cancer_monthly_screening_summary_aggregate,
                    cervicalCancerMonthlyReportBase: cervical_cancer_monthly_screening_summary_base
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
}