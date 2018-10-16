var authorizer = require('../../authorization/etl-authorizer');
var privileges = authorizer.getAllPrivileges();
import {
    PatientlistMysqlReport
} from '../reporting-framework/patientlist-mysql.report'
const routes  = [  {
    method: 'GET',
    path: '/etl/enhanced-adherence-program/patient-list',
    config: {
        plugins: {
            'hapiAuthorization': {
                role: privileges.canViewPatient
            }
        },
        handler: function (request, reply) {
            let requestParams = Object.assign({}, request.query, request.params);
            let locationUuids = request.query.locationUuids.split(',')
            let indicators = [];
            if(requestParams.indicators){
                indicators = requestParams.indicators.split(',');
            }
            requestParams.locationUuids = locationUuids;
            let report = new PatientlistMysqlReport('enhancedAdherenceHIVProgramAggregate', requestParams);
            report.generatePatientListReport(indicators).then((result) => {
                reply(result);
            }).catch((error) => {
                reply(error);
            });
        },
        description: "Get the medical history report",
        notes: "Returns the the medical history of the selected patient",
        tags: ['api'],
        validate: {
            options: {
                allowUnknown: true
            },
            params: {}
        }
    }
}
]
exports.routes = server => server.route(routes);