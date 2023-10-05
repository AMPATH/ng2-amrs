var authorizer = require('../../authorization/etl-authorizer');
import { PMTCTRRIReportingService } from '../../service/rri/pmtct_rri_reporting.service.js';
import { PmtctRriSummaryService } from '../../service/rri/pmtct-rri-service.js';
var etlHelpers = require('../../etl-helpers');
var privileges = authorizer.getAllPrivileges();
var preRequest = require('../../pre-request-processing');
const routes = [
  {
    method: 'GET',

    path: '/etl/pmtct_rri_summary',
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
            'pmtct_rri_aggregate_summary',
            ['startDate', 'endDate', 'locationUuids'],
            requestParams
          );

          let service = new PmtctRriSummaryService(
            'pmtct_rri_aggregate_summary',
            reportParams.requestParams
          );
          service
            .generateReport()
            .then((result) => {
              reply(result);
            })
            .catch((error) => {
              console.error('Error: ', error);
              reply(error);
            });
        });
      },
      description: 'PMTCT, HEI, CALHIV and WRA RRI reports',
      notes: 'PMTCT, HEI, CALHIV and WRA RRI reports',
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
    path: '/etl/pmtct_rri_summary/patient-list',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, reply) {
        if (request.query.locationUuids) {
          preRequest.resolveLocationIdsToLocationUuids(request, function () {
            let requestParams = Object.assign(
              {},
              request.query,
              request.params
            );
            let reportParams = etlHelpers.getReportParams(
              'pmtct_rri_aggregate_summary',
              ['endDate', 'locationUuids'],
              requestParams
            );
            delete reportParams.requestParams['gender'];
            const pmtctrriService = new PmtctRriSummaryService(
              'pmtct_rri_aggregate_summary',
              reportParams.requestParams
            );
            pmtctrriService
              .generatePatientListReport(reportParams.requestParams)
              .then((result) => {
                reply(result);
              })
              .catch((error) => {
                reply(error);
              });
          });
        }
      },
      description:
        'Get patient list for txnew summary report of the location and month provided',
      notes: 'Returns patient list of txnew summary indicators',
      tags: ['api']
    }
  },

  {
    method: 'GET',

    path: '/etl/pmtct_rri_aggregate',
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
            'pmtct_rri_summary',
            ['startDate', 'endDate', 'locationUuids'],
            requestParams
          );
          let service = new PMTCTRRIReportingService(
            'pmtctRriSummary',
            reportParams.requestParams
          );
          service
            .getPmtctRriSummaryReport(reportParams.requestParams)
            .then((result) => {
              reply(result);
            })
            .catch((error) => {
              reply(error);
            });
        });
      },
      description: 'PMTCT, HEI, CALHIV and WRA RRI reports',
      notes: 'PMTCT, HEI, CALHIV and WRA RRI reports',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: true
        },
        params: {}
      }
    }
  }
];
exports.routes = (server) => server.route(routes);
