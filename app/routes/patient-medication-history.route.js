var authorizer = require('../../authorization/etl-authorizer');
var privileges = authorizer.getAllPrivileges();
import { generateMedsDataSet, getOncMeds } from '../../service/oncology/patient-oncology-summary-service'
var helpers = require('../../etl-helpers');
const routes = [{
    method: 'GET',
    path: '/etl/patient/{uuid}/oncology/medication-history',
    config: {
        plugins: {
            'hapiAuthorization': {
                role: privileges.canViewPatient
            }
        },
        handler: function (request, reply) {
            let oncMedsDetailed = [];
            let oncMedHistory = {};
            let requestParams = Object.assign({}, request.query, request.params);
            getOncMeds(requestParams, '', '').then((data) => {
                if (!!data) {
                    let groupedMedsData = generateMedsDataSet(data.result);
                    _.each(groupedMedsData, (summary) => {
                        if (summary.drugs) {
                            let planAndDate = summary.treatment_plan;
                            _.each(summary.drugs, function (data) {
                                let oncMed = {};
                                _.each(data, function (a) {
                                    if (a.concept_id === 9918) {
                                        oncMed.cur_onc_meds = helpers.getConceptName(a.value_coded);
                                    } else if (a.concept_id === 1899) {
                                        oncMed.cur_onc_meds_dose = a.value_numeric;
                                    } else if (a.concept_id === 1896) {
                                        oncMed.cur_onc_meds_frequency = helpers.getConceptName(a.value_coded);
                                    } else if (a.concept_id === 7463) {
                                        oncMed.cur_onc_meds_route = helpers.getConceptName(a.value_coded);
                                    }
                                    if (planAndDate) {
                                        oncMed.meds_start_date = planAndDate[0].obs_datetime;
                                        oncMed.chemotherapy_plan = helpers.getConceptName(planAndDate[0].value_coded);
                                    }
                                });
                                if (oncMed !== '') {
                                    oncMedsDetailed.push(oncMed);
                                }
                            });
                        }
                    });
                    oncMedHistory.result = oncMedsDetailed;
                    reply(oncMedHistory);
                }
            }).catch((error) => {
                reply(error);
            });

        },
        description: "Get the medication history report",
        notes: "Returns the the medication history of the selected patient",
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