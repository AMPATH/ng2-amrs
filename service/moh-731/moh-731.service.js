const dao = require('../../etl-dao');
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');

const moh731VlegacSectionDefinitions = require('../../service/moh-731/moh-731-legacy');
const moh731V2017SectionDefinitions = require('../../service/moh-731/moh-731-2017');
export class Moh731Service {
  getAggregateReport(reportParams) {
    return new Promise(function (resolve, reject) {
      reportParams.requestParams.isAggregated === true
        ? (reportParams.groupBy = '')
        : (reportParams.groupBy = 'groupByLocation');
      Promise.join(dao.runReport(reportParams), (results) => {
        // get sect
        if (reportParams.reportName === 'MOH-731-report') {
          results.sectionDefinitions = moh731VlegacSectionDefinitions;
        } else if (reportParams.reportName === 'MOH-731-report-2017') {
          results.sectionDefinitions = moh731V2017SectionDefinitions;
        }

        resolve(results);
      }).catch((errors) => {
        reject(errors);
      });
    });
  }

  getPatientListReport(reportParams) {
    let self = this;
    return new Promise(function (resolve, reject) {
      Promise.join(
        dao.getPatientListReport(reportParams),
        self.resolveLocationUuidsToName(reportParams.locationUuids),
        (results, locations) => {
          if (reportParams.reportName === 'MOH-731-report') {
            results.indicators = self.getIndicatorSectionDefinitions(
              reportParams.indicator,
              moh731VlegacSectionDefinitions
            );
          } else if (reportParams.reportName === 'MOH-731-report-2017') {
            results.indicators = self.getIndicatorSectionDefinitions(
              reportParams.indicator,
              moh731V2017SectionDefinitions
            );
          }
          results.locations = locations;
          resolve(results);
        }
      ).catch((errors) => {
        reject(errors);
      });
    });
  }

  resolveLocationUuidsToName(uuids) {
    return new Promise(function (resolve, reject) {
      // resolve location name
      dao.resolveLocationUuidsToName(uuids.split(','), function (loc) {
        resolve(loc);
      });
    });
  }

  getIndicatorSectionDefinitions(requestIndicators, sectionDefinitions) {
    let results = [];
    _.each(requestIndicators.split(','), function (requestIndicator) {
      _.each(sectionDefinitions, function (sectionDefinition) {
        _.each(sectionDefinition.indicators, function (indicator) {
          if (indicator.indicator === requestIndicator) {
            results.push(indicator);
          }
        });
      });
    });
    return results;
  }
}
