import { Promise } from 'bluebird';
import { MultiDatasetReport } from './multi-dataset.report';
import { PatientlistMysqlReport } from './patientlist-mysql.report';
import { interfaces } from 'mocha';
var helpers = require('../../etl-helpers');

let mockPatientList = [
    {
        gender: 'F',
        birthdate: '1959-12-31T21:00:00.000Z',
        age: 58,
        person_id: 761391,
        location_uuid: '0900abdc-1352-11df-a1f1-0026b9348838',
        location: 'Moi University',
        location_id: 72,
        cur_arv_meds: '628 ## 633 ## 797',
        enrollment_date: '22-12-2008',
        arv_first_regimen_start_date: '01-01-1900',
        cur_regimen_arv_start_date: '17-10-2017',
        cur_arv_line: 1,
        vl_1: 6730,
        vl_1_date: '19-02-2018',
        age_range: 'older_than_24',
        enrolled_this_month: 0,
        art_revisit_this_month: 1,
        current_in_care: 1,
        pre_art: 0,
        started_art_pregnant: 0,
        started_art_and_has_tb: 0,
        active_on_art: 1,
        on_ctx_prophylaxis: 1,
        current_on_art: 1,
        screened_for_tb: 1,
        tb_screened_this_visit_this_month: 1,
        tb_screened_positive: 0,
        screened_for_cervical_ca: 0,
        started_ipt: 0,
        completed_ipt_past_12_months: 0,
        condoms_provided: 0,
        started_modern_contraception: 0,
        on_modern_contraception: 0,
        scheduled_visits: 0,
        unscheduled_visits: 1,
        total_visits: 1,
        f_gte_18_visits: 1,
        patient_uuid: '8d9f8be2-e772-49ef-94c1-2f3560739162',
        uuid: '8d9f8be2-e772-49ef-94c1-2f3560739162',
        person_name: 'LILY CHEBET MITEI',
        identifiers: '256MU-8, 15205-00086' 
    }
]

export class MultiDatasetPatientlistReport extends MultiDatasetReport {
    constructor(reportName, params) {
        super(reportName, params);
    }
    // interprate
    generatePatientListReport(indicators) {
        let additionalParams = {
            type: 'patient-list',
            indicators: indicators
        };

        let that = this;
        return new Promise((resolve, reject) => {
            this.generateReport(additionalParams).
                then((results) => {

                    for (let i = 0; i < results.length; i++) {
                        if (results[i].results && results[i].results.results && results[i].results.results.results) {

                            let datta = this.interprateCurrentArvMeds(results[i].results.results.results);

                            resolve({
                                result: datta,
                                queriesAndSchemas: results[i],
                                indicators: indicators,
                                size: that.params.limit,
                                startIndex: that.params.startIndex,
                                allResults: results
                            });
                            break;
                        }
                    }
                    reject('Patientlist error:', results);
                }).catch((err) => {
                    console.error('Patientlist Error', err);
                    reject(err);
                });
        });
    }

    transformedPatientlistResults(results){
      return  _.reduce(results, helpers.getARVNames(results.cur_arv_meds) );

    }

    interprateCurrentArvMeds(result) {
        let transformedResults = [];

        result.forEach((element) => {
            let dataObject = {};
            dataObject['gender'] = element.gender,
                dataObject['birthdate'] = element.birthdate,
                dataObject['age'] = element.age,
                dataObject['person_id'] = element.person_id,
                dataObject['location_uuid'] = element.location_uuid,
                dataObject['location'] = element.location,
                dataObject['location_id'] = element.location_id,
                dataObject['cur_arv_meds'] = helpers.getARVNames(element.cur_arv_meds),
                dataObject['enrollment_date'] = element.enrollment_date,
                dataObject['arv_first_regimen_start_date'] = element.arv_first_regimen_start_date,
                dataObject['cur_regimen_arv_start_date'] = element.cur_regimen_arv_start_date,
                dataObject['cur_arv_line'] = element.cur_arv_line,
                dataObject['vl_1'] = element.vl_1,
                dataObject['vl_1_date'] = element.vl_1_date,
                dataObject['age_range'] = element.age_range,
                dataObject['enrolled_this_month'] = element.enrolled_this_month,
                dataObject['art_revisit_this_month'] = element.art_revisit_this_month,
                dataObject['current_in_care'] = element.current_in_care,
                dataObject['pre_art'] = element.pre_art,
                dataObject['started_art_pregnant'] = element.started_art_pregnant,
                dataObject['started_art_and_has_tb'] = element.started_art_and_has_tb,
                dataObject['active_on_art'] = element.active_on_art,
                dataObject['on_ctx_prophylaxis'] = element.on_ctx_prophylaxis,
                dataObject['current_on_art'] = element.current_on_art,
                dataObject['screened_for_tb'] = element.screened_for_tb,
                dataObject['screened_for_tb_blue'] = element.screened_for_tb_blue,
                dataObject['tb_screened_positive'] = element.tb_screened_positive,
                dataObject['screened_for_cervical_ca'] = element.screened_for_cervical_ca,
                dataObject['started_ipt'] = element.started_ipt,
                dataObject['completed_ipt_past_12_months'] = element.completed_ipt_past_12_months,
                dataObject['condoms_provided'] = element.condoms_provided,
                dataObject['age_rstarted_modern_contraceptionange'] = element.started_modern_contraception,
                dataObject['on_modern_contraception'] = element.on_modern_contraception,
                dataObject['scheduled_visits'] = element.scheduled_visits,
                dataObject['unscheduled_visits'] = element.unscheduled_visits,
                dataObject['total_visits'] = element.total_visits,
                dataObject['f_gte_18_visits'] = element.f_gte_18_visits,
                dataObject['patient_uuid'] = element.patient_uuid,
                dataObject['uuid'] = element.uuid,
                dataObject['person_name'] = element.person_name,
                dataObject['identifiers'] = element.identifiers,
                dataObject['phone_number'] = element.phone_number,
                dataObject['latest_rtc_date'] = element.latest_rtc_date,
                dataObject['latest_vl'] = element.latest_vl,
                dataObject['latest_vl_date'] = element.latest_vl_date,
                dataObject['last_appointment'] = element.last_appointment,
                dataObject['previous_vl'] = element.previous_vl,
                dataObject['previous_vl_date'] = element.previous_vl_date,
                dataObject['nearest_center'] = element.nearest_center

            const finalObj = Object.assign(element,dataObject);

            transformedResults.push(finalObj);
        })
        return transformedResults;

    }

    getReportHandler(reportName, params) {
        return new PatientlistMysqlReport(reportName, params);
    }

    runSingleReport(reportObject, additionalParams) {
        if (additionalParams && additionalParams.type === 'patient-list') {
            return reportObject.generatePatientListReport(additionalParams.indicators);
        }
        return reportObject.generateReport();
    }
}
