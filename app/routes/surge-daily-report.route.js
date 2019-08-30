var authorizer = require('../../authorization/etl-authorizer');
import {
    SurgeDailyReportService
} from '../../service/surge-reports/surge-daily-report-service';
var privileges = authorizer.getAllPrivileges();
const routes = [
    {
        method: 'GET',
        path: '/etl/surge-daily-report',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                }
            },
            handler: function (request, reply) {
                let requestParams = Object.assign({}, request.query, request.params);
                requestParams.reportName = 'surgeDailyReport';
                let service = new SurgeDailyReportService();
                service.getAggregateReport(requestParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });

            },
            description: 'Get aggregates of surge daily report of a given date  and location ',
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
        path: '/etl/surge-daily-report-patient-list',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                }
            },
            handler: function (request, reply) {
                let requestParams = Object.assign({}, request.query, request.params);
                requestParams.reportName = 'surgeDailyReport';
                let service = new SurgeDailyReportService();
                service.getPatientListReport(requestParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });

            },
            description: 'Get patient list for surge indicators report of the location and date provided',
            notes: 'Returns patient list of surge indicators',
            tags: ['api']
        }

    }
]
exports.routes = server => server.route(routes);