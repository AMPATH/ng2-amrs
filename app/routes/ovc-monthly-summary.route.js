var authorizer = require('../../authorization/etl-authorizer');
import {
    OvcMonthlySummary
} from '../ovc-report/ovc-monthly-summary.service';
var etlHelpers = require('../../etl-helpers');
var privileges = authorizer.getAllPrivileges();
var preRequest = require('../../pre-request-processing');
const routes = [
    {
        method: 'GET',
        path: '/etl/ovc-monthly-summary',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                }
            },
            handler: function (request, reply) {
                preRequest.resolveLocationIdsToLocationUuids(request,
                    function () {
                        let requestParams = Object.assign({}, request.query, request.params);
                        let reportParams = etlHelpers.getReportParams('ovc-monthly-summary',
                            ['endDate', 'locationUuids'],
                            requestParams);

                        let service = new OvcMonthlySummary('ovcReport', reportParams.requestParams);
                        service.generateAggregateReport().then((result) => {
                            reply(result);

                        }).catch((error) => {
                            reply(error);
                        });
                    });

            },
            description: 'ovc-monthly-summary dataset',
            notes: 'ovc-monthly-summary dataset',
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
        path: '/etl/ovc-monthly-summary-patient-list',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                }
            },
            handler: function (request, reply) {
                request.query.reportName = 'ovc-monthly-summarypatient-list';
                preRequest.resolveLocationIdsToLocationUuids(request,
                    function () {
                        let requestParams = Object.assign({}, request.query, request.params);

                        let requestCopy = _.cloneDeep(requestParams);
                        let reportParams = etlHelpers.getReportParams(request.query.reportName, ['startDate', 'endDate', 'locationUuids', 'locations'], requestParams);
                        const service = new OvcMonthlySummary('ovcReport', requestCopy);

                        service.generatePatientListReport(requestParams.indicators.split(',')).then((results) => { //.indicators.split(',')
                            reply(results);
                        })
                            .catch((err) => {
                                reply(Boom.internal('An error occured', err));
                            });
                    });

            },
            description: 'Get patient list for ovc monthly summary report of the location and month provided',
            notes: 'Returns patient list of  monthly summary indicators',
            tags: ['api']
        }

    }
]
exports.routes = server => server.route(routes);
