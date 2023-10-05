const authorizer = require('../../authorization/etl-authorizer');
import { PrepMonthlyReportService } from '../../service/prep/prep-monthly-report.service';
const etlHelpers = require('../../etl-helpers');
const privileges = authorizer.getAllPrivileges();
const preRequest = require('../../pre-request-processing');

/**
1 -- TG
2 -- AGYW
3 -- MSM
4 -- Men at High Risk
5 -- FSW
6 -- PWID
7 -- Other Women
8 -- SeroDiscordant Couple
9 -- PBFW
*/

const routes = [
  {
    method: 'GET',
    path: '/etl/prep-monthly-report',
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
            'prep-monthly-report',
            ['endDate', 'locationUuids'],
            requestParams
          );

          let service = new PrepMonthlyReportService(
            'prep-monthly-report',
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
      description: 'PrEP monthly summary dataset',
      notes: 'PrEP monthly summary dataset',
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
    path: '/etl/prep-monthly-report-patient-list',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, reply) {
        request.query.reportName = 'prep-monthly-report-patient-list';
        preRequest.resolveLocationIdsToLocationUuids(request, function () {
          let requestParams = Object.assign({}, request.query, request.params);

          let requestCopy = _.cloneDeep(requestParams);
          let reportParams = etlHelpers.getReportParams(
            request.query.reportName,
            ['startDate', 'endDate', 'locationUuids', 'locations'],
            requestParams
          );
          requestCopy.locationUuids = reportParams.requestParams.locationUuids;
          const service = new PrepMonthlyReportService(
            'prep-monthly-report',
            requestCopy
          );
          service
            .generatePatientListReport(requestParams.indicators.split(','))
            .then((results) => {
              _.each(results.result, (item) => {
                item.arv_first_regimen = etlHelpers.getARVNames(
                  item.arv_first_regimen
                );
                item.cur_meds = etlHelpers.getARVNames(item.cur_meds);
              });
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
