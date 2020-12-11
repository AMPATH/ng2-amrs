var authorizer = require('../../authorization/etl-authorizer');
import { HivTBReport } from '../../service/tb-preventive-monthly-summary.service';
var etlHelpers = require('../../etl-helpers');
var privileges = authorizer.getAllPrivileges();
var preRequest = require('../../pre-request-processing');
const routes = [
  {
    method: 'GET',
    path: '/etl/tb-preventive-monthly-summary',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, reply) {
        preRequest.resolveLocationIdsToLocationUuids(request, function () {
          let requestParams = Object.assign({}, request.query, request.params);
          let reportParams = etlHelpers.getReportParams(
            'tb-preventive-monthly-summary',
            ['endDate', 'locationUuids'],
            requestParams
          );

          console.log(
            'reportParams.requestParams ',
            reportParams.requestParams
          );

          let service = new HivTBReport(
            'TbPreventiveReport',
            reportParams.requestParams
          );
          service
            .generateAggregateReport()
            .then((result) => {
              reply(result);
            })
            .catch((error) => {
              reply(error);
            });
        });
      },
      description: 'tb preventive monthly summary dataset',
      notes: 'tb preventive monthly summary dataset',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: true
        },
        params: {}
      }
    }
  },
  {
    method: 'GET',
    path: '/etl/tb-preventive-monthly-summary-patient-list',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, reply) {
        request.query.reportName = 'tb-preventive-summary-patient-list';
        preRequest.resolveLocationIdsToLocationUuids(request, function () {
          let requestParams = Object.assign({}, request.query, request.params);

          let requestCopy = _.cloneDeep(requestParams);
          let reportParams = etlHelpers.getReportParams(
            request.query.reportName,
            ['startDate', 'endDate', 'locationUuids', 'locations'],
            requestParams
          );
          requestCopy.locationUuids = reportParams.requestParams.locationUuids;
          const service = new HivTBReport('TbPreventiveReport', requestCopy);
          service
            .generatePatientListReport(requestParams.indicators.split(','))
            .then((results) => {
              reply(results);
            })
            .catch((err) => {
              reply(err);
            });
        });
      },
      description:
        'Get patient list for tb-on-hiv monthly summary report of the location and month provided',
      notes: 'Returns patient list of tb-on-hiv monthly summary indicators',
      tags: ['api']
    }
  }
];
exports.routes = (server) => server.route(routes);
