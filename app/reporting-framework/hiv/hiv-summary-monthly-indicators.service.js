const dao = require('../../../etl-dao');
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
import { BaseMysqlReport } from '../base-mysql.report';
import { IndicatorDefinitionService } from './indicator-definition.service';
import { PatientlistMysqlReport } from '../patientlist-mysql.report';
export class HivSummaryMonthlyIndicatorsService {
  getAggregateReport(reportParams) {
    let self = this;
    let indicatorDef = new IndicatorDefinitionService();
    return new Promise(function (resolve, reject) {
      reportParams.groupBy = 'groupByYear,groupByMonth';
      reportParams.countBy = 'num_persons';
      let indicators;
      if (reportParams.requestParams.indicators) {
        indicators = reportParams.requestParams.indicators.split(',');
        let columnWhitelist = indicators.concat([
          'location_id',
          'location_uuid',
          'month',
          'reporting_month',
          'location',
          'encounter_datetime',
          'person_id',
          'age_range',
          'gender',
          'encounter_month',
          'encounter_year'
        ]);
        reportParams.requestParams.columnWhitelist = columnWhitelist;
      }

      let report = new BaseMysqlReport(
        'hivMonthlySummaryReportAggregate',
        reportParams.requestParams
      );

      Promise.join(report.generateReport(), (results) => {
        let result = results.results.results;
        results.size = result ? result.length : 0;
        results.result = result;
        delete results['results'];
        results.indicatorDefinitions = indicatorDef.getDefinitions(indicators);
        resolve(results);
        //TODO Do some post processing
      }).catch((errors) => {
        reject(errors);
      });
    });
  }
  getPatientListReport(reportParams) {
    // let self = this;
    // return new Promise(function (resolve, reject) {
    //     //TODO: Do some pre processing
    //     Promise.join(dao.getPatientListReport(reportParams),
    //         (results) => {
    //             resolve(results);
    //         }).catch((errors) => {
    //             reject(errors);
    //         });
    // });
    console.log('fetching patient list', reportParams);
    let self = this;
    let gender = reportParams.gender.split(',');
    let locations = reportParams.locationUuids.split(',');
    reportParams.locationUuids = locations;
    reportParams.gender = gender;
    reportParams.limitParam = reportParams.limit;
    reportParams.offSetParam = reportParams.startIndex;
    let report = new PatientlistMysqlReport(
      'hivMonthlySummaryReportAggregate',
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
}
