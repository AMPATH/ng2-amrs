const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
const indicatorsSchemaDefinition = require('../reports/indicators.json');
export class PatientStatusChangeTrackerService {

    getAggregateReport(reportParams) {
        let self = this;
        return new Promise(function (resolve, reject) {
            reportParams.groupBy = 'groupByEndDate';
            dao.runReport(reportParams)
                .then((results) => {
                        results = self.runPostProcessing(results);
                        resolve(results);
                    }
                ).catch((errors) => {
                console.log(errors)
                reject(errors);
            });
        });
    }


    getPatientListReport(reportParams) {
        let self = this;
        reportParams['reportName'] = 'patient-status-change-tracker-report';
        return new Promise(function (resolve, reject) {
            //TODO: Do some pre processing
            Promise.join(dao.getPatientListReport(reportParams),
                (results) => {
                    results.indicators = self.getIndicatorDefinitions(reportParams.indicator);
                    resolve(results);
                }).catch((errors) => {
                console.log('--->', errors);
                reject(errors);
            });
        });
    }

    getIndicatorDefinitions(requestIndicators) {
        let results = [];
        _.each(requestIndicators.split(','), function (requestIndicator) {
            _.each(indicatorsSchemaDefinition, function (indicator) {
                if (indicator.name === requestIndicator) {
                    results.push(indicator);
                }

            });
        });
        return results;
    }

    runPostProcessing(results) {
        results.indicators = [];

        _.each(results.result, (row, j) => {

            // calculate lost
            row.patients_lost = row.active_in_care_to_transfer_out + row.active_in_care_to_death + row.active_in_care_to_LTFU;
            results.indicators.push({
                name:'patients_lost',
                label:'patients_lost',
                description:'row.active_in_care_to_transfer_out + row.active_in_care_to_death + row.active_in_care_to_LTFU',
                expression:'row.active_in_care_to_transfer_out + row.active_in_care_to_death + row.active_in_care_to_LTFU'
            });

            // calculate gain
            row.patients_gained = row.new_patients + row.transfer_in + row.LTFU_to_active_in_care;
            results.indicators.push({
                name:'patients_gained',
                label:'patients_gained',
                description:'row.new_patients + row.transfer_in + row.LTFU_to_active_in_care',
                expression:'row.new_patients + row.transfer_in + row.LTFU_to_active_in_care'
            });

            // calculate patient_change_from_past_month
            row.patient_change_from_past_month = row.patients_gained + row.patients_lost;
            results.indicators.push({
                name:'patient_change_from_past_month',
                label:'patient_change_from_past_month',
                description:'row.patients_gained + row.patients_lost',
                expression:'row.patients_gained + row.patients_lost'
            });

            // calculate lost
            row.patients_lost = row.active_in_care_to_transfer_out + row.active_in_care_to_death + row.active_in_care_to_LTFU;
            results.indicators.push({
                name:'patients_lost',
                label:'patients_lost',
                description:'row.active_in_care_to_transfer_out + row.active_in_care_to_death + row.active_in_care_to_LTFU',
                expression:'row.active_in_care_to_transfer_out + row.active_in_care_to_death + row.active_in_care_to_LTFU'
            });

            // calculate patients_gained_this_month
            row.patients_gained_this_month = row.new_patients + row.transfer_in;
            results.indicators.push({
                name:'patients_gained_this_month',
                label:'patients_gained_this_month',
                description:'row.new_patients + row.transfer_in',
                expression:'row.new_patients + row.transfer_in'
            });

            // calculate patients_lost_this_month
            row.patients_lost_this_month = row.transfer_out_patients_this_month + row.HIV_negative_patients_this_month +
                row.deaths_this_month + row.self_disengaged_patients_this_month;
            results.indicators.push({
                name:'patients_lost_this_month',
                label:'patients_lost_this_month',
                description:'row.transfer_out_patients_this_month + row.HIV_negative_patients_this_month + row.deaths_this_month + row.self_disengaged_patients_this_month',
                expression:'row.transfer_out_patients_this_month + row.HIV_negative_patients_this_month + row.deaths_this_month + row.self_disengaged_patients_this_month'
            });

            // calculate patient_change_from_past_month
            row.patient_change_this_month = row.patients_gained_this_month + row.patients_lost_this_month;
            results.indicators.push({
                name:'patient_change_this_month',
                label:'patient_change_this_month',
                description:'row.patients_gained_this_month + row.patients_lost_this_month',
                expression:' row.patients_gained_this_month + row.patients_lost_this_month'
            });

            // calculate cumulative_deficit
            row.cumulative_deficit = row.total_patients - (row.transfer_out_patients + row.deaths + row.LTFU +
                row.HIV_negative_patients + row.self_disengaged_patients + row.active_in_care);
            results.indicators.push({
                name:'cumulative_deficit',
                label:'cumulative_deficit',
                description:'total_patients - (transfer_out_patients + deaths + LTFU + HIV_negative_patients + self_disengaged_patients + active_in_care)',
                expression:'total_patients - (transfer_out_patients + deaths + LTFU + HIV_negative_patients + self_disengaged_patients + active_in_care)'
            });


        });

        // indicator definitions
        _.each(results.result[0], (row, requestIndicator) => {
            _.each(indicatorsSchemaDefinition, function (indicator) {
                if (indicator.name === requestIndicator) {
                    results.indicators.push(indicator);
                }

            });
        });

        //remove duplicates
        results.indicators=_.uniq(results.indicators, 'name');
        return results;
    }

}
