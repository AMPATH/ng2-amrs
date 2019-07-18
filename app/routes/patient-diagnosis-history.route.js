var authorizer = require('../../authorization/etl-authorizer');
var privileges = authorizer.getAllPrivileges();
import { getPatientOncologyDiagnosis } from '../../service/oncology/patient-oncology-summary-service'

var helpers = require('../../etl-helpers');
const routes = [{
    method: 'GET',
    path: '/etl/patient/{uuid}/oncology/diagnosis-history',
    config: {
        plugins: {
            'hapiAuthorization': {
                role: privileges.canViewPatient
            }
        },
        handler: function (request, reply) {
            let requestParams = Object.assign({}, request.query, request.params);
            getPatientOncologyDiagnosis(requestParams).then(data => {
                let diagnosisData = data;
                _.each(diagnosisData.result, (summary) => {
                    summary.diagnosis = helpers.getConceptName(summary.value_coded);
                    summary.diagnosis_date = helpers.filterDate(summary.diagnosis_date);
                });
                reply(diagnosisData);
            }).catch((error) => {
                reply(error);
            });
        },
        description: "Get the diagnosis history report",
        notes: "Returns the the diagnosis history of the selected patient",
        tags: ['api'],
        validate: {
            options: {
                allowUnknown: true
            },
            params: {}
        }
    }
}];
exports.routes = server => server.route(routes);