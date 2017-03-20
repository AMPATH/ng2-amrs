/*jshint -W003, -W098, -W117, -W026 */
"use strict";
// var dao = require('./etl-dao');
var dao = require('./etl-dao');
var preRequest = require('./pre-request-processing');
var pack = require('./package');
var winston = require('winston');
var path = require('path');
var _ = require('underscore');
var Joi = require('joi');
var eidLabData = require('./eid-data-synchronization/eid-lab-results');
var eidService = require('./service/eid.service');
var patientListCompare = require('./service/patient-list-compare.service.js');
var Boom = require('boom');
var authorizer = require('./authorization/etl-authorizer');
var config = require('./conf/config');
var privileges = authorizer.getAllPrivileges();
var etlHelpers = require('./etl-helpers.js');
var crypto = require('crypto');
import { MonthlyScheduleService } from './service/monthly-schedule-service'
import { SlackService } from './service/slack-service'
var patientReminderService = require('./service/patient-reminder.service.js');
module.exports = function () {

    var routes = [{
        method: 'GET',
        path: '/',
        config: {
            plugins: {
                'hapiAuthorization': false
            },
            handler: function (request, reply) {

                console.log('default rote', request.path);

                reply('Welcome to Ampath ETL service.');
                //return reply(Boom.forbidden('Not this end point bruh'));
            },
            description: 'Home',
            notes: 'Returns a message that shows ETL service is running.',
            tags: ['api'],
        }
    },
    {
        method: 'POST',
        path: '/etl/user-feedback',
        config: {
            plugins: {
                'hapiAuthorization': false
            },
            handler: function (request, reply) {
                let payload = request.payload;
                let message = `*From*  ${payload.name} \n *Phone:*  ${payload.phone} \n *Message:* \n \`\`\`${payload.message}\`\`\``;
                let service = new SlackService();
                service.sendUserFeedBack(message).then((status) => {
                    reply(status);
                }).catch((error) => {
                    reply(Boom.badData(error));
                });
            },
            description: 'User feedback end point',
            notes: 'This receive user feedback sent from the client and sends it to slack',
            tags: ['api', 'feedback'],
        }
    },
    {
        method: 'GET',
        path: '/etl/get-monthly-schedule',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                if (request.query.locationUuids) {
                    preRequest.resolveLocationIdsToLocationUuids(request,
                        function () {
                            let reportParams = etlHelpers.getReportParams('name', ['startDate', 'endDate', 'locations'], request.query);
                            let service = new MonthlyScheduleService();
                            service.getMonthlyScheduled(reportParams).then((result) => {
                                reply(result);
                            }).catch((error) => {
                                reply(error);
                            })
                        });
                }
            },
            description: 'Get monthly schedule',
            notes: 'Returns a list of appointments,visits and has not returned',
            tags: ['api'],
        }
    },
    {
        method: 'GET',
        path: '/etl/daily-appointments/{startDate}',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                if (request.query.locationUuids) {
                    preRequest.resolveLocationIdsToLocationUuids(request,
                        function () {
                            request.query.groupBy = 'groupByPerson,groupByd';
                            let compineRequestParams = Object.assign({}, request.query, request.params);
                            let reportParams = etlHelpers.getReportParams('daily-appointments', ['startDate', 'locations', 'groupBy'], compineRequestParams);

                            dao.runReport(reportParams).then((result) => {
                                reply(result);
                            }).catch((error) => {
                                reply(error);
                            })
                        });
                }
            },
            description: 'Get daily appointments list',
            notes: 'Returns a list of patients with appointments',
            tags: ['api'],
        }
    },
    {
        method: 'GET',
        path: '/etl/daily-visits/{startDate}',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                if (request.query.locationUuids) {
                    preRequest.resolveLocationIdsToLocationUuids(request,
                        function () {
                            request.query.groupBy = 'groupByPerson,groupByd';
                            let compineRequestParams = Object.assign({}, request.query, request.params);
                            let reportParams = etlHelpers.getReportParams('daily-attendance', ['startDate', 'locations', 'groupBy'], compineRequestParams);

                            dao.runReport(reportParams).then((result) => {
                                reply(result);
                            }).catch((error) => {
                                reply(error);
                            })
                        });
                }
            },
            description: 'Get daily attendance list',
            notes: 'Returns a facility daily attendance list',
            tags: ['api'],
        }
    },
    {
        method: 'GET',
        path: '/etl/daily-has-not-returned/{startDate}',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                if (request.query.locationUuids) {
                    preRequest.resolveLocationIdsToLocationUuids(request,
                        function () {
                            request.query.groupBy = 'groupByPerson,groupByd';
                            let compineRequestParams = Object.assign({}, request.query, request.params);
                            let reportParams = etlHelpers.getReportParams('daily-has-not-returned', ['startDate', 'locations', 'groupBy'], compineRequestParams);

                            dao.runReport(reportParams).then((result) => {
                                reply(result);
                            }).catch((error) => {
                                reply(error);
                            })
                        });
                }
            },
            description: 'Get a list of patients who did not attend a scheduled visit',
            notes: 'Returns a list of patients who did not attend their scheduled visits on the selected date',
            tags: ['api'],
        }
    },
    {
        method: 'GET',
        path: '/etl/clinic-lab-orders/{dateActivated}',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                if (request.query.locationUuids) {
                    preRequest.resolveLocationIdsToLocationUuids(request,
                        function () {
                            request.query.groupBy = 'groupByPerson,groupByd';
                            let compineRequestParams = Object.assign({}, request.query, request.params);
                            let reportParams = etlHelpers.getReportParams('clinic-lab-orders-report', ['dateActivated', 'locations', 'groupBy'], compineRequestParams);

                            dao.runReport(reportParams).then((result) => {
                                _.each(result.result, (row) => {
                                    row.order_type = etlHelpers.getTestsOrderedNames(row.order_type);
                                });
                                reply(result);
                            }).catch((error) => {
                                reply(error);
                            })
                        });
                }
            },
            description: 'Get a list of patients who made lab orders on a selected date',
            notes: 'Returns a list of patients patients who made lab orders through selected clinics on a selected date',
            tags: ['api'],
        }
    },
    {
        method: 'GET',
        path: '/etl/defaulter-list',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                dao.getDefaulterList(request, reply);
            },
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            description: "Get a location's defaulter list",
            notes: "Returns a location's defaulter list.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/etl/patient/{patientUuid}/hiv-clinical-reminder/{referenceDate}',
        config: {
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                let compineRequestParams = Object.assign({}, request.query, request.params);
                let reportParams = etlHelpers.getReportParams('clinical-reminder-report', ['@referenceDate', 'patientUuid', 'indicators'], compineRequestParams);
                if (reportParams.whereParams[0].name === '@referenceDate') {
                    reportParams.whereParams[0].value = request.params.referenceDate;
                }
                dao.runReport(reportParams).then((results) => {

                    try {
                        let processedResults = patientReminderService.generateReminders(results.result);
                        results.result = processedResults;
                        reply(results);
                    } catch (err) {
                        console.log('Error occurred while processing reminders', err)
                    }

                }).catch((error) => {
                    reply(error);
                })
            },
            description: 'Get a list of reminders for selected patient and indicators',
            notes: 'Returns a  list of reminders for selected patient and indicators on a given reference date',
            tags: ['api'],
        }
    },
    {
        method: 'POST',
        path: '/etl/forms/error',
        config: {
            auth: 'simple',
            handler: function (request, reply) {

                dao.logError(request, reply);
            }
        }
    },
    {
        method: 'POST',
        path: '/javascript-errors',
        config: {
            handler: function (request, reply) {
                if (request.payload) {
                    var logger = new winston.Logger({
                        transports: [
                            new winston.transports.File({
                                level: 'info',
                                filename: 'client-logs.log',
                                handleExceptions: true,
                                json: true,
                                colorize: false,
                            }),
                        ],
                        exitOnError: false,
                    });
                    logger.add(require('winston-daily-rotate-file'), {
                        filename: path.join(__dirname, 'logs', 'client-logs.log')
                    });
                    logger.info(request.payload);
                }

                reply({
                    message: 'ok'
                });
            }

        }
    }, {
        method: 'GET',
        path: '/etl/patient/{uuid}',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                }
            },
            handler: function (request, reply) {
                dao.getPatient(request, reply);
            }
        }
    }, {
        method: 'GET',
        path: '/etl/patient/{uuid}/clinical-notes',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                }
            },
            handler: function (request, reply) {
                dao.getClinicalNotes(request, reply);
            },
            description: 'Get patient clinical notes',
            notes: 'Returns a list of notes constructed from several ' +
            'patient information sources, particularly encounters',
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The patient's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/patient/{uuid}/hiv-patient-clinical-summary',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    roles: [privileges.canViewPatient, privileges.canViewDataAnalytics]
                }
            },
            handler: function (request, reply) {
                dao.getHivPatientClinicalSummary(request, reply);
            }

        }
    }, {
        method: 'GET',
        path: '/etl/location/{id}/hiv-patient-clinical-summary',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    roles: [privileges.canViewPatient, privileges.canViewDataAnalytics]
                }
            },
            handler: function (request, reply) {
                dao.getHivPatientClinicalSummary(request, reply);
            }

        }
    }, {
        method: 'GET',
        path: '/etl/patient/{uuid}/vitals',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                }
            },
            handler: function (request, reply) {
                dao.getPatientVitals(request, reply);
            },
            description: 'Get patient vitals',
            notes: "Returns a list of historical patient's vitals with the given patient uuid.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The patient's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/patient/{uuid}/data',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                }
            },
            handler: function (request, reply) {
                dao.getPatientData(request, reply);
            },
            description: 'Get patient lab test data',
            notes: 'Returns a list of historical lab tests data of a patient with the given patient uuid.',
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The patient's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/patient/{uuid}/hiv-summary',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                }
            },
            handler: function (request, reply) {
                dao.getPatientHivSummary(request, reply);
            },
            description: 'Get patient HIV summary',
            notes: "Returns a list of historical patient's HIV summary with the given patient uuid. " +
            "A patient's HIV summary includes details such as last appointment date, " +
            "current ARV regimen etc. as at that encounter's date. ",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The patient's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/location/{uuid}/clinic-encounter-data',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                dao.getClinicEncounterData(request, reply);
            }
        }
    }, {
        method: 'GET',
        path: '/etl/location/{uuid}/monthly-appointment-visits',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                dao.getClinicMonthlySummary(request, reply);
            },
            description: "Get a location's monthly appointment visits",
            notes: "Returns a location's monthly appointment visits with the given location uuid.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The location's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/location/{uuid}/hiv-summary-indicators',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewDataAnalytics
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                dao.getClinicHivSummayIndicators(request, reply);
            },
            description: "Get a location's HIV summary indicators",
            notes: "Returns a location's HIV summary indicators.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The location's uuid(universally unique identifier)."),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/etl/clinical-hiv-comparative-overview',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewDataAnalytics
                },
            },
            handler: function (request, reply) {

                request.query.reportName = 'clinical-hiv-comparative-overview-report';
                let compineRequestParams = Object.assign({}, request.query, request.params);
                let reportParams = etlHelpers.getReportParams('clinical-hiv-comparative-overview-report',
                    ['startDate', 'endDate', 'indicator', 'locationUuids', 'order', 'gender'], compineRequestParams);

                dao.runReport(reportParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });
            },
            description: "Get the clinical hiv comparative overview summary",
            notes: "Returns a comparative summary of various indicator eg enrollement, on_art,and vl suppression",
            tags: ['api'],
            validate: {
            }
        }
    },
    {
        method: 'GET',
        path: '/etl/clinical-hiv-comparative-overview/patient-list',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                },
            },
            handler: function (request, reply) {

                request.query.reportName = 'clinical-hiv-comparative-overview-report';
                let compineRequestParams = Object.assign({}, request.query, request.params);

                dao.getPatientListReport(compineRequestParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });
            },
            description: "Get the clinical hiv comparative overview patient",
            notes: "Returns the patient list for various indicators in the clinical hiv comparative summary",
            tags: ['api'],
            validate: {

            }
        }
    },
    {
        method: 'GET',
        path: '/etl/clinical-patient-care-status-overview',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewDataAnalytics
                },
            },
            handler: function (request, reply) {

                request.query.reportName = 'clinical-patient-care-status-overview-report';
                let compineRequestParams = Object.assign({}, request.query, request.params);
                let reportParams = etlHelpers.getReportParams('clinical-patient-care-status-overview-report',
                    ['startDate', 'endDate', 'indicator', 'locationUuids', 'order', 'gender'], compineRequestParams);

                dao.runReport(reportParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });
            },
            description: "Get the clinical patint care status patient list",
            notes: "Returns a comparative summary of all patient status indicators eg on_art,out_of_care,in_care,transferred_out.....",
            tags: ['api'],
            validate: {
            }
        }
    },
    {
        method: 'GET',
        path: '/etl/clinical-patient-care-status-overview/patient-list',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                },
            },
            handler: function (request, reply) {

                request.query.reportName = 'clinical-patient-care-status-overview-report';
                let compineRequestParams = Object.assign({}, request.query, request.params);

                dao.getPatientListReport(compineRequestParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });
            },
            description: "Get the clinical-patient-care-status-overview patient list",
            notes: "Returns the patient list for various indicators in the clinical-patient-care-status-overview",
            tags: ['api'],
            validate: {

            }
        }
    },
    {
        method: 'GET',
        path: '/etl/clinical-art-overview',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewDataAnalytics
                },
            },
            handler: function (request, reply) {

                request.query.reportName = 'clinical-art-overview-report';
                let compineRequestParams = Object.assign({}, request.query, request.params);
                let reportParams = etlHelpers.getReportParams('clinical-art-overview-report',
                    ['startDate', 'endDate', 'indicator', 'locationUuids', 'order', 'gender'], compineRequestParams);

                dao.runReport(reportParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });
            },
            description: "Get the clinical art  overview summary",
            notes: "Returns the a comparative summary of art drugs used by patients",
            tags: ['api'],
            validate: {
            }
        }
    },
    {
        method: 'GET',
        path: '/etl/clinical-art-overview/patient-list',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                },
            },
            handler: function (request, reply) {

                request.query.reportName = 'clinical-art-overview-report';
                let compineRequestParams = Object.assign({}, request.query, request.params);

                dao.getPatientListReport(compineRequestParams).then((result) => {
                    reply(result);
                }).catch((error) => {
                    reply(error);
                });
            },
            description: "Get the  clinical art overview patient list",
            notes: "Returns the patient list for clinical-art-overview report",
            tags: ['api'],
            validate: {

            }
        }
    },
    {
        method: 'GET',
        path: '/etl/location/{uuid}/appointment-schedule',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                dao.getClinicAppointmentSchedule(request, reply);
            },
            description: "Get a location's appointment schedule",
            notes: "Returns a location's appointment-schedule with the given location uuid.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The location's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/patient-flow-data',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'query', //can be in either query or params so you have to specify
                        name: 'locationUuids' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                preRequest.resolveLocationIdsToLocationUuids(request,
                    function () {
                        dao.getPatientFlowData(request, reply);
                    });
            },
            description: "Get a location's patient movement and waiting time data",
            notes: "Returns a location's patient flow with the given location uuid.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {}
            }
        }
    }, {
        method: 'GET',
        path: '/etl/clinic-lab-orders-data',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'query', //can be in either query or params so you have to specify
                        name: 'locationUuids' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                preRequest.resolveLocationIdsToLocationUuids(request,
                    function () {
                        dao.getClinicLabOrdersData(request, reply);
                    });
            },
            description: "Get a location's lab orders data",
            notes: "Returns a location's lab orders data with the given location uuid.",
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
        path: '/etl/location/{uuid}/daily-visits',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                dao.getClinicDailyVisits(request, reply);
            },
            description: "Get a location's daily visits",
            notes: "Returns a location's daily visits with the given parameter uuid.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The location's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/location/{uuid}/has-not-returned',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                dao.getHasNotReturned(request, reply);
            },
            description: "Get a location's not returned visits",
            notes: "Returns a location's not returned visits with the given parameter uuid.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The location's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/location/{uuid}/monthly-appointment-schedule',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                dao.getClinicMonthlyAppointmentSchedule(request, reply);
            },
            description: "Get a location's monthly appointment schedule",
            notes: "Returns a location's monthly appointment schedule.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The location's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/location/{uuid}/monthly-visits',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                dao.getClinicMonthlyVisits(request, reply);
            },
            description: "Get a location's monthly visits",
            notes: "Returns the actual number of patient visits for each day in a given month and location.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The location's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/location/{uuid}/defaulter-list',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                dao.getClinicDefaulterList(request, reply);
            },
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewClinicDashBoard
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'params', //can be in either query or params so you have to specify
                        name: 'uuid' //name of the location parameter
                    }]
                }
            },
            description: "Get a location's defaulter list",
            notes: "Returns a location's defaulter list.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    uuid: Joi.string()
                        .required()
                        .description("The location's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        method: 'OPTIONS',
        path: '/{param*}',
        handler: function (request, reply) {
            // echo request headers back to caller (allow any requested)
            var additionalHeaders = [];
            if (request.headers['access-control-request-headers']) {
                additionalHeaders = request.headers['access-control-request-headers'].split(', ');
            }
            var headers = _.union('Authorization, Content-Type, If-None-Match'.split(', '), additionalHeaders);

            reply().type('text/plain')
                .header('Access-Control-Allow-Headers', headers.join(', '));
        }
    }, {
        method: 'GET',
        path: '/etl/custom_data/{userParams*3}',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                dao.getCustomData(request, reply);
            }
            /*
             the rest request and query expression should be
             /table/filter_column/filter/filter_value or
             /table/filter_column/filter/filter_value?fields=(field1,field2,fieldn) or

             */
        }
    }, {
        method: 'GET',
        path: '/etl/patient/creation/statistics',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    roles: [privileges.canViewDataEntryStats, privileges.canViewPatient]
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'query', //can be in either query or params so you have to specify
                        name: 'locationUuids' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {
                dao.getPatientCountGroupedByLocation(request, reply);
            },
            description: "Get patients created by period",
            notes: "Returns a list of patients created within a specified time period in all locations.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                query: {
                    startDate: Joi.string()
                        .optional()
                        .description("The start date to filter by"),
                    endDate: Joi.string()
                        .optional()
                        .description("The end date to filter by"),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/location/{location}/patient/creation/statistics',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    roles: [privileges.canViewDataEntryStats, privileges.canViewPatient]
                }
            },
            handler: function (request, reply) {
                dao.getPatientDetailsGroupedByLocation(request, reply);
            },
            description: "Get details of patient created in a location",
            notes: "Returns details of patient created in a location",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    location: Joi.string()
                        .required()
                        .description("The location's uuid(universally unique identifier)."),
                }
            }
        }
    }, {
        /**
         endpoint  to  get  Reports
         @todo Rename  to get-report-by-name,count by{patient/encounters},filter-params{location/starting date/ end date}
         @todo ,groupby params{location/monthly}
         **/

        method: 'GET',
        path: '/etl/get-report-by-report-name',
        config: {
            auth: 'simple',
            plugins: {
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'query', //can be in either query or params so you have to specify
                        name: 'locationUuids' //name of the location parameter
                    }],
                    exemptedParameter: [ //set this if you want to prevent validation checks for certain reports
                        {
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'clinical-reminder-report' //parameter value
                        },{
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'patient-register-report' //parameter value
                        }, {
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'medical-history-report' //parameter value
                        }
                    ],
                    aggregateReport: [ //set this if you want to  validation checks for certain aggregate reports
                        {
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'hiv-summary-report' //parameter value
                        }, {
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'hiv-summary-monthly-report' //parameter value
                        }, {
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'MOH-731-report' //parameter value
                        }, {
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'MOH-731-allsites-report' //parameter value
                        }, {
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'clinic-comparator-report' //parameter value
                        }, {
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'clinical-hiv-comparative-overview-report' //parameter value
                        }, {
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'clinical-art-overview-report' //parameter value
                        }, {
                            type: 'query', //can be in either query or params so you have to specify
                            name: 'report', //name of the parameter
                            value: 'clinical-patient-care-status-overview-report' //parameter value
                        }

                    ]
                }
            },
            handler: function (request, reply) {
                //security check
                if (!authorizer.hasReportAccess(request.query.report)) {
                    return reply(Boom.forbidden('Unauthorized'));
                }
                preRequest.resolveLocationIdsToLocationUuids(request,
                    function () {
                        let requestParams = Object.assign({}, request.query, request.params);
                        let reportParams = etlHelpers.getReportParams(request.query.report,
                            ['startDate', 'endDate', 'indicator', 'locationUuids', 'locations', 'referenceDate',
                               'patientUuid', 'startAge', 'endAge', 'age', 'order', 'gender'],
                            requestParams);

                        dao.runReport(reportParams).then((result) => {
                            reply(result);
                        }).catch((error) => {
                            reply(error);
                        });
                    });
            },
            description: 'Get report ',
            notes: "General api endpoint that returns a report by passing " +
            "the report name parameter and a list of custom parameters " +
            "depending on the report e.g start date, end date for MOH-731 report.",
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                query: {
                    report: Joi.string()
                        .required()
                        .description("The name of the report to get indicators")
                }
            }

        }
    }, {
        method: 'GET',
        path: '/etl/location/{locationUuids}/patient-by-indicator',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    roles: [privileges.canViewPatient, privileges.canViewDataAnalytics]
                }
            },
            handler: function (request, reply) {
                request.query.reportName = 'hiv-summary-report';
                preRequest.resolveLocationIdsToLocationUuids(request,
                    function () {
                        dao.getPatientListReport(Object.assign({}, request.query, request.params))
                            .then((result) => {
                                reply(result);
                            }).catch((error) => {
                            reply(Boom.badRequest(error.toString()));
                        });
                    });
            },
            description: 'Get patient list by indicator',
            notes: 'Returns a patient list by indicator for a given location.',
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                params: {
                    locationUuids: Joi.string()
                        .required()
                        .description("The location's uuid(universally unique identifier).")
                },
                query: {
                    indicator: Joi.string()
                        .required()
                        .description("A list of comma separated indicators")
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/patient-by-indicator',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    roles: [privileges.canViewPatient, privileges.canViewDataAnalytics]
                }
            },
            handler: function (request, reply) {
                request.query.reportName = 'hiv-summary-monthly-report';
                preRequest.resolveLocationIdsToLocationUuids(request,
                    function () {
                        dao.getPatientListReport(Object.assign({}, request.query, request.params))
                            .then((result) => {
                                reply(result);
                            }).catch((error) => {
                            reply(Boom.badRequest(error.toString()));
                        });
                    });
            },
            description: 'Get patient',
            notes: 'Returns a patient by passing a given indicator and location.',
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                query: {
                    indicator: Joi.string()
                        .required()
                        .description("A list of comma separated indicators"),
                    locationUuids: Joi.string()
                        .required()
                        .description("A list of comma separated location uuids")
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/data-entry-statistics/{sub}',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewDataEntryStats
                },
                'openmrsLocationAuthorizer': {
                    locationParameter: [{
                        type: 'query', //can be in either query or params so you have to specify
                        name: 'locationUuids' //name of the location parameter
                    }]
                }
            },
            handler: function (request, reply) {

                if (request.params.sub === 'patientList' &&
                    !authorizer.hasPrivilege(privileges.canViewPatient)) {
                    return reply(Boom.forbidden('Unauthorized'));
                }

                var asyncRequests = 0; //this should be the number of async requests needed before they are triggered

                var onResolvedPromise = function (promise) {
                    asyncRequests--;
                    if (asyncRequests <= 0) { //voting process to ensure all pre-processing of request async operations are complete
                        dao.getDataEntryIndicators(request.params.sub, request, reply);
                    }
                };

                //establish the number of asyncRequests
                //this is done prior to avoid any race conditions
                if (request.query.formUuids) {
                    asyncRequests++;
                }
                if (request.query.encounterTypeUuids) {
                    asyncRequests++;
                }
                if (request.query.locationUuids) {
                    asyncRequests++;
                }

                if (asyncRequests === 0)
                    dao.getDataEntryIndicators(request.params.sub, request, reply);

                if (request.query.formUuids) {
                    dao.getIdsByUuidAsyc('amrs.form', 'form_id', 'uuid', request.query.formUuids,
                        function (results) {
                            request.query.formIds = results;
                        }).onResolved = onResolvedPromise;
                }
                if (request.query.encounterTypeUuids) {

                    dao.getIdsByUuidAsyc('amrs.encounter_type', 'encounter_type_id', 'uuid', request.query.encounterTypeUuids,
                        function (results) {
                            request.query.encounterTypeIds = results;
                        }).onResolved = onResolvedPromise;
                }
                if (request.query.locationUuids) {
                    dao.getIdsByUuidAsyc('amrs.location', 'location_id', 'uuid', request.query.locationUuids,
                        function (results) {
                            request.query.locationIds = results;
                        }).onResolved = onResolvedPromise;
                }
            }
        }
    }, {
        /**
         endpoint  to  get  Reports Indicators
         @todo Rename  to get-report-indicators by  report  name
         **/

        method: 'GET',
        path: '/etl/indicators-schema',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewDataAnalytics
                }
            },
            handler: function (request, reply) {
                //security check
                if (!authorizer.hasReportAccess(request.query.report)) {
                    return reply(Boom.forbidden('Unauthorized'));
                }

                dao.getIndicatorsSchema(request, reply);
            },
            description: 'Get HIV monthly summary indicator schema',
            notes: 'Returns HIV monthly summary indicator schema. ',
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                query: {
                    report: Joi.string()
                        .required()
                        .description("The name of the report to get indicators")
                }
            }
        }
    }, {


        method: 'GET',
        path: '/etl/indicators-schema-with-sections',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewDataAnalytics
                }
            },
            handler: function (request, reply) {
                dao.getIndicatorsSchemaWithSections(request, reply);
            }

        }
    }, {
        method: 'GET',
        path: '/etl/hiv-summary-data',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    roles: [privileges.canViewPatient, privileges.canViewDataAnalytics]
                }
            },
            handler: function (request, reply) {
                dao.getHivSummaryData(request, reply);
            }

        }
    }, {
        method: 'POST',
        path: '/etl/compare-patient-lists',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var r = request;
                var handler;
                _.each(routes, function (route) {
                    if (route.path === request.payload.path) {
                        handler = route.config.handler;
                    }
                });

                var requestObject = {
                    query: request.payload.query,
                    params: request.payload.params
                };

                if (handler) {
                    patientListCompare.fetchAndCompareList(request.payload.patientList,
                        requestObject, handler)
                        .then(function (comparison) {
                            if (request.query.includeBoth === true || request.query.includeBoth === 'true') {
                                reply(comparison);
                            } else {
                                delete comparison.both;
                                reply(comparison);
                            }
                        })
                        .catch(function (error) {
                            reply(Boom.badImplementation('An internal error occured'));
                        })
                } else {
                    reply(Boom.badRequest('Unknown patient list etl path'));
                }

            }
        }
    },
    {
        method: 'GET',
        path: '/etl/patient-list-by-indicator',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    roles: [privileges.canViewPatient, privileges.canViewDataAnalytics]
                }
            },
            handler: function (request, reply) {
                preRequest.resolveLocationIdsToLocationUuids(request,
                    function () {
                        dao.getPatientListReport(Object.assign({}, request.query, request.params))
                            .then((result) => {
                                reply(result);
                            }).catch((error) => {
                            reply(Boom.badRequest(JSON.stringify(error)));
                        });
                    });
            },
            description: 'Get patient list',
            notes: 'Returns a patient by passing a given indicator, report and location.',
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                query: {
                    indicator: Joi.string()
                        .required()
                        .description("A list of comma separated indicators"),
                    locationUuids: Joi.string()
                        .required()
                        .description("A list of comma separated location uuids"),
                    reportName: Joi.string()
                        .required()
                        .description("the name of the report you want patient list"),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/patient-lab-orders',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                if (config.eidSyncOn === true)
                    eidLabData.getPatientLabResults(request, reply);
                else
                    reply(Boom.notImplemented('Sorry, sync service temporarily unavailable.'));
            }
        }
    }, {
        method: 'POST',
        path: '/etl/eid/order/{lab}',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': {
                    role: privileges.canViewPatient
                }
            },
            handler: function (request, reply) {
                dao.postLabOrderToEid(request, reply);
            }
        }
    }, {
        method: 'GET',
        path: '/etl/session/invalidate',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                dao.invalidateUserSession(request, reply);
            }
        }
    }, {
        method: 'GET',
        path: '/etl/lab-cohorts',
        config: {
            auth: false,
            plugins: {
                'hapiAuthorization': false
            },
            handler: function (request, reply) {

                var eidSyncApiKey = config.eidSyncApiKey;
                var headers = request.headers;

                var h_eidSyncApiKey = request.headers.eidsyncapikey;

                if (eidSyncApiKey === h_eidSyncApiKey) {
                    dao.loadLabCohorts(request, reply);
                } else {
                    reply(Boom.unauthorized('invalid api key'))
                }
            },
            description: 'Home',
            notes: 'Returns a message that shows ETL service is running.',
            tags: ['api'],
            validate: {
                options: {
                    allowUnknown: true
                },
                query: {
                    startDate: Joi.string()
                        .required()
                        .description("The start date to filter by"),
                    endDate: Joi.string()
                        .required()
                        .description("The end date to filter by"),
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/lab-cohorts-sync',
        config: {
            auth: false,
            plugins: {
                'hapiAuthorization': false
            },
            handler: function (request, reply) {

                var eidSyncApiKey = config.eidSyncApiKey;
                var headers = request.headers;

                var h_eidSyncApiKey = request.headers.eidsyncapikey;

                if (eidSyncApiKey === h_eidSyncApiKey) {
                    dao.syncLabCohorts(request, reply);
                } else {
                    reply(Boom.unauthorized('invalid api key'));
                }
            },
            description: 'Home',
            notes: 'Returns a message that shows ETL service is running.',
            tags: ['api']
        }
    }, {
        method: 'GET',
        path: '/etl/eid/load-order-justifications',
        config: {
            auth: 'simple',
            handler: function (request, reply) {

                dao.loadOrderJustifications(request, reply);
            },
            description: 'Justifications',
            notes: 'Returns order justification(s)',
            tags: ['api']
        }
    }, {
        method: 'POST',
        path: '/etl/fileupload',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                var replyPayload = {};
                var image = etlHelpers.decodeBase64Image(request.payload.data);
                var imageTypeRegularExpression = /\/(.*?)$/;
                var imageTypeDetected = image
                    .type
                    .match(imageTypeRegularExpression);
                var seed = crypto.randomBytes(20);
                var uniqueSHA1String = crypto
                    .createHash('sha1')
                    .update(seed)
                    .digest('hex');
                var userUploadedImagePath = config.etl.uploadsDirectory +
                    uniqueSHA1String +
                    '.' +
                    imageTypeDetected[1];
                try {
                    require('fs').writeFile(userUploadedImagePath, image.data,
                        function () {
                            replyPayload = {
                                image: uniqueSHA1String +
                                '.' +
                                imageTypeDetected[1]
                            };
                            reply(replyPayload);
                            console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                        });
                } catch (error) {
                    console.log('ERROR:', error);
                    replyPayload = {
                        error: 'Error Uploading image'
                    };
                    reply(replyPayload);
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/files/{param*}',
        config: {
            auth: 'simple',
            handler: {
                directory: {
                    path: config.etl.uploadsDirectory,
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    }, {
        method: 'GET',
        path: '/etl/eid/patients-with-results',
        config: {
            auth: 'simple',
            plugins: {
                'hapiAuthorization': false
            },
            handler: function (request, reply) {
                if (request.query.startDate && request.query.endDate) {
                    eidService.getPatientIdentifiersFromEIDResults(request.query.startDate,
                        request.query.endDate)
                        .then(function (response) {
                            reply(response);
                        })
                        .catch(function (error) {
                            reply(Boom.badImplementation('A server error occured'))
                        });
                } else {
                    reply(Boom.badRequest('startDate and endDate required'));
                }

            }
        }
    }
    ];

    return routes;
}();
