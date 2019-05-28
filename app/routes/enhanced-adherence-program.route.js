var authorizer = require('../../authorization/etl-authorizer');
var privileges = authorizer.getAllPrivileges();
var helpers = require('../../etl-helpers');
var _ = require('underscore');
var moment = require('moment');
import {
    PatientlistMysqlReport
} from '../reporting-framework/patientlist-mysql.report';
const routes = [{
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
            if (requestParams.indicators) {
                indicators = requestParams.indicators.split(',');
            }

            if(!requestParams.lower_vl){
                requestParams.lower_vl = 401;
            }
            requestParams.locationUuids = locationUuids;
            requestParams.startDate = requestParams.startDate.split('T')[0];
            requestParams.endDate = requestParams.endDate.split('T')[0];
            let report = new PatientlistMysqlReport('enhancedAdherenceHIVProgramAggregate', requestParams);
            report.generatePatientListReport(indicators).then((result) => {
                if (result.results.results.length > 0) {
                    _.each(result.results.results, (item) => {
                        item.cur_meds = helpers.getARVNames(item.cur_meds);
                        item.vl_1_date = moment(item.vl_1_date).format('DD-MM-YYYY');
                    });
                    reply(result);
                } else {
                    reply(result);
                }

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
}]
exports.routes = server => server.route(routes);