var authorizer = require('../../authorization/etl-authorizer');
var privileges = authorizer.getAllPrivileges();
var caseManagementData = require('../case-management/case-management')
var definitions = require('../case-management/case-management-indicator-service');
const routes = [
    {
        method: 'GET',
        path: '/etl/case-management',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                }
            },
            handler: function (request, reply) {
                let params = {
                    minDefaultPeriod: request.query.minDefaultPeriod,
                    maxDefaultPeriod: request.query.maxDefaultPeriod,
                    minFollowupPeriod: request.query.minFollowupPeriod,
                    maxFollowupPeriod: request.query.maxFollowupPeriod,
                    rtcStartDate: request.query.rtcStartDate,
                    rtcEndDate: request.query.rtcEndDate,
                    phoneFollowUpStartDate: request.query.phoneFollowUpStartDate,
                    locationUuid: request.query.locationUuid,
                    hasCaseManager: request.query.hasCaseManager,
                    hasPhoneRTC: request.query.hasPhoneRTC,
                    elevatedVL: request.query.elevatedVL,
                    dueForVl: request.query.dueForVl,
                    caseManagerUserId: request.query.caseManagerUserId,
                    isNewlyEnrolled: request.query.isNewlyEnrolled,
                    startIndex: request.query.startIndex,
                    limit: request.query.limit
                }
                caseManagementData.getCaseManagementData(params,
                    (result) => {
                        if (result.error) {
                            reply(result);
                        } else {
                            reply(result);
                        }
                    })
            },
            description: 'Case Management Data',
            notes: 'Returns patient list',
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
        path: '/etl/case-managers',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                }
            },
            handler: function (request, reply) {
                let params = {
                    locationUuid: request.query.locationUuid
                }
                caseManagementData.getCaseManagers(params).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });
            },
            description: 'List of case management providers filtered by locations',
            notes: 'Returns providers list',
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
        method: 'POST',
        path: '/etl/assign-patients',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                }
            },
            handler: function (request, reply) {
                let payload = {
                    patients: request.payload.patients,
                    caseManagers: request.payload.caseManagers
                }
                caseManagementData.assignPatientsToCaseManagers(payload).then((result) => {
                    let response = {}
                    if (result.length > 0) {
                        response = {
                            type: 'Error',
                            code: 500,
                            body: result
                        }
                    } else {
                        response = {
                            type: 'Success',
                            code: 200,
                            message: "All patients successfully assigned",
                        }
                    }
                    reply(response);
                }).catch((error) => {
                    reply(error);
                });
            },
            description: 'Used for massive asignments of patients to case managers',
            notes: 'Returns assignment response',
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
        method: 'POST',
        path: '/etl/unassign-patients',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                }
            },
            handler: function (request, reply) {
                let payload = {
                    patients: request.payload.patients
                }
                caseManagementData.unAssignPatients(payload.patients).then((result) => {
                    let response = {}
                    if (result.length > 0) {
                        response = {
                            type: 'Error',
                            code: 500,
                            body: result
                        }
                    } else {
                        response = {
                            type: 'Success',
                            code: 200,
                            message: "All patients were successfully unassigned",
                        }
                    }
                    reply(response);
                }).catch((error) => {
                    reply(error);
                });
            },
            description: 'Used for massive asignments of patients to case managers',
            notes: 'Returns assignment response',
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
        path: '/etl/case-management/indicators',
        config: {
            plugins: {
            },
            handler: function (request, reply) {
                definitions.getIndicatorDefinitions().then((result)=> {
                    reply(result);
                }).catch((error) => {
                    reply(error)
                });

            },
            description: 'List of case management indicators and their definitions',
            notes: 'Returns Case Management indicators',
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