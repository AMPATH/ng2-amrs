var authorizer = require('../../authorization/etl-authorizer');
var privileges = authorizer.getAllPrivileges();
import { getOncologyIntegratedProgramSnapshot } from '../../service/oncology/patient-oncology-summary-service'
const routes = [{
    method: 'GET',
    path: '/etl/patient/{uuid}/oncology/integrated-program',
    config: {
        plugins: {
            'hapiAuthorization': {
                role: privileges.canViewPatient
            }
        },
        handler: function (request, reply) {
            let requestParams = Object.assign({}, request.query, request.params);
            getOncologyIntegratedProgramSnapshot(requestParams).then(data => {
                reply(data);
            }).catch((error) => {
                reply(error);
            });
        },
        description: "Get the screening and diagnosis history report",
        notes: "Returns the the screening programs a patient has been through",
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