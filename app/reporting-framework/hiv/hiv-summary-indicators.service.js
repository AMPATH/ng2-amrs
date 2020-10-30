import { BaseMysqlReport } from '../base-mysql.report';
import { PatientlistMysqlReport } from '../patientlist-mysql.report';
import { IndicatorDefinitionService } from './indicator-definition.service';

const dao = require('../../../etl-dao');
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
export class HivSummaryIndicatorsService {
  composite_indicators = {
    perc_virally_suppressed_in_past_year: {
      childIndictors: [
        'virally_suppressed_in_past_year',
        'viral_load_resulted_in_past_year'
      ],
      patientlistIndicator: 'virally_suppressed_in_past_year'
    },
    perc_not_virally_suppressed_in_past_year: {
      childIndictors: [
        'not_virally_suppressed_in_past_year',
        'viral_load_resulted_in_past_year'
      ],
      patientlistIndicator: 'not_virally_suppressed_in_past_year'
    },
    perc_on_arvs: {
      childIndictors: ['on_arvs'],
      patientlistIndicator: 'on_arvs'
    },
    perc_on_arv_first_line: {
      childIndictors: ['on_arvs_first_line', 'on_arvs'],
      patientlistIndicator: 'on_arvs_first_line'
    },
    perc_on_arv_second_line: {
      childIndictors: ['on_arvs_second_line', 'on_arvs'],
      patientlistIndicator: 'on_arvs_second_line'
    },
    perc_on_arv_third_line: {
      childIndictors: ['on_arvs_third_line', 'on_arvs'],
      patientlistIndicator: 'on_arvs_third_line'
    },
    perc_with_pending_viral_load: {
      childIndictors: ['pending_vl_order', 'on_arvs'],
      patientlistIndicator: 'pending_vl_order'
    },
    perc_on_arvs_lte_6_months: {
      childIndictors: ['on_arvs_lte_26_weeks', 'on_arvs'],
      patientlistIndicator: 'on_arvs_lte_26_weeks'
    },
    perc_on_arvs_gt_6_months: {
      childIndictors: ['on_arvs_gt_26_weeks', 'on_arvs'],
      patientlistIndicator: 'on_arvs_gt_26_weeks'
    }
  };

  getAggregateReport(reportParams) {
    let self = this;
    reportParams.groupBy = 'groupByLocation';
    reportParams.countBy = 'num_persons';
    let params = reportParams.requestParams;

    if (params.indicators) {
      let indicators = params.indicators.split(',');
      let columnWhitelist = indicators.concat([
        'location_id',
        'location_uuid',
        'month',
        'location',
        'encounter_datetime',
        'person_id'
      ]);

      columnWhitelist = this.addDerivateIndicatorsForPercIndicators(
        columnWhitelist
      );
      params.columnWhitelist = columnWhitelist;
    }
    let report = new BaseMysqlReport('hivSummaryBaseAggregate', params);
    return new Promise(function (resolve, reject) {
      Promise.join(report.generateReport(), (result) => {
        let indicatorDefinitionService = new IndicatorDefinitionService();
        let returnedResult = {};
        try {
          returnedResult.indicatorDefinitions = indicatorDefinitionService.getDefinitions(
            params.indicators
          );
        } catch (error) {
          console.log(error);
        }

        returnedResult.schemas = result.schemas;
        returnedResult.sqlQuery = result.sqlQuery;
        returnedResult.result = result.results.results;
        resolve(returnedResult);
        //TODO Do some post processing
      }).catch((errors) => {
        reject(errors);
      });
    });
  }
  getPatientListReport(reportParams) {
    console.log('Params', reportParams);
    let self = this;
    let gender = reportParams.gender.split(',');
    let locations = reportParams.locationUuids.split(',');
    reportParams.locationUuids = locations;
    reportParams.gender = gender;
    reportParams.limitParam = reportParams.limit;
    reportParams.offSetParam = reportParams.startIndex;
    let report = new PatientlistMysqlReport(
      'hivSummaryBaseAggregate',
      reportParams
    );
    return new Promise(function (resolve, reject) {
      //TODO: Do some pre processing
      Promise.join(
        report.generatePatientListReport(reportParams.indicator.split(',')),
        (result) => {
          let returnedResult = {};
          returnedResult.schemas = result.schemas;
          returnedResult.sqlQuery = result.sqlQuery;
          returnedResult.result = result.results.results;
          resolve(returnedResult);
        }
      ).catch((errors) => {
        reject(errors);
      });
    });
  }

  addDerivateIndicatorsForPercIndicators(indicatorsArray) {
    let additionalIndicators = [];
    for (var i = 0; i < indicatorsArray.length; i++) {
      let indicator = indicatorsArray[i];

      if (this.composite_indicators[indicator]) {
        additionalIndicators = additionalIndicators.concat(
          this.composite_indicators[indicator].childIndictors
        );
      }
    }
    return indicatorsArray.concat(additionalIndicators);
  }
}
