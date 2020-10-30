var authorizer = require('../../authorization/etl-authorizer');
import { PrepMonthlySummaryService } from '../../service/prep-monthly-summary.service';
var etlHelpers = require('../../etl-helpers');
var privileges = authorizer.getAllPrivileges();
var preRequest = require('../../pre-request-processing');
const routes = [
  {
    method: 'GET',
    path: '/etl/prep-monthly-summary',
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
            'prep-monthly-summary',
            ['endDate', 'locationUuids'],
            requestParams
          );
          reportParams.requestParams.isAggregated = true;

          let service = new PrepMonthlySummaryService(
            'prepMonthlySummaryReport',
            reportParams.requestParams
          );
          service
            .getAggregateReport()
            .then((result) => {
              reply(result);
            })
            .catch((error) => {
              reply(error);
            });
        });
      },
      description: 'prep monthly summary dataset',
      notes: 'prep monthly summary dataset',
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
    path: '/etl/prep-monthly-summary-patient-list',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, reply) {
        request.query.reportName = 'prep-summary-patient-list';
        preRequest.resolveLocationIdsToLocationUuids(request, function () {
          let requestParams = Object.assign({}, request.query, request.params);

          let requestCopy = _.cloneDeep(requestParams);
          let reportParams = etlHelpers.getReportParams(
            request.query.reportName,
            ['startDate', 'endDate', 'locationUuids', 'locations'],
            requestParams
          );
          requestCopy.locationUuids = reportParams.requestParams.locationUuids;
          const prepService = new PrepMonthlySummaryService(
            'prepMonthlySummaryReport',
            requestCopy
          );

          prepService
            .generatePatientList(requestParams.indicators.split(','))
            .then((results) => {
              reply(results);
            })
            .catch((err) => {
              reply(err);
            });
        });
      },
      description:
        'Get patient list for prep monthly summary report of the location and month provided',
      notes: 'Returns patient list of prep monthly summary indicators',
      tags: ['api']
    }
  }
];
exports.routes = (server) => server.route(routes);
