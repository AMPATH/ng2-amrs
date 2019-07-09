var authorizer = require('../../authorization/etl-authorizer');
import {
    SurgeReportService
} from '../../service/surge-reports/surge-report-service';
var privileges = authorizer.getAllPrivileges();
const routes = [
    {
        method: 'GET',
        path: '/etl/surge-report',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                }
            },
            handler: function (request, reply) {
                let requestParams = Object.assign({}, request.query, request.params);
                requestParams.reportName = 'surgeReport';
                let service = new SurgeReportService();
                service.getAggregateReport(requestParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });

            },
            description: 'Get aggregates of surge indicators on location and time filters',
            notes: 'Returns aggregates of surge indicators',
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
        path: '/etl/surge-report-patient-list',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                }
            },
            handler: function (request, reply) {
                let requestParams = Object.assign({}, request.query, request.params);
                requestParams.reportName = 'surgeReport';
                let service = new SurgeReportService();
                service.getPatientListReport(requestParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });

            },
            description: 'Get patient list for surge indicators report on location and time filters',
            notes: 'Returns patient list of surge indicators',
            tags: ['api']
        }

    }
]
exports.routes = server => server.route(routes);