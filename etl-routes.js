/*jshint -W003, -W098, -W117, -W026 */
"use strict";
// var dao = require('./etl-dao');
var dao = require('./etl-dao');
var winston = require('winston');
var path = require('path');
var _ = require('underscore');
var Joi = require('joi');
module.exports = function () {

    return [
        {
            method: 'GET',
            path: '/',
            config: {
                handler: function (request, reply) {
                    reply('Hello, World! HAPI Demo Server');
                },
                description: 'Get HAPI',
                notes: 'Returns a message that shows HAPI is configured correctly',
                tags: ['api'],

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
                        logger.add(require('winston-daily-rotate-file'),
                            {filename: path.join(__dirname, 'logs', 'client-logs.log')});
                        logger.info(request.payload);
                    }

                    reply({message: 'ok'});
                }

            },

        },
        {
            method: 'GET',
            path: '/etl/patient/{uuid}',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatient(request, reply);
                },
                description: 'Get patient',
                notes: 'Returns a patient with the given parameter uuid',
                tags: ['api'],
                validate: {
                    params: {
                        uuid: Joi.string()
                            .required()
                            .description('the unique identifier for a patient'),

                    },

                }

            }
        },
        {
            method: 'GET',
            path: '/etl/patient/{uuid}/vitals',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatientVitals(request, reply);
                },
                description: 'Get patient vitals',
                notes: 'Returns a patient vitals with the given parameter uuid',
                tags: ['api'],
                validate: {
                    params: {
                        uuid: Joi.string()
                            .required()
                            .description('the unique identifier for a patient'),
                    }
                }

            }
        },
        {
            method: 'GET',
            path: '/etl/patient/{uuid}/data',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatientData(request, reply);
                },
                description: 'Get patient test data',
                notes: 'Returns a patient test data with the given parameter uuid',
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/patient/{uuid}/hiv-summary',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatientHivSummary(request, reply);
                },
                description: 'Get patient HIV summary',
                notes: 'Returns a patient HIV summary with the given parameter uuid',
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/clinic-encounter-data',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicEncounterData(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/monthly-appointment-visits',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicMonthlySummary(request, reply);
                },
                description: "Get a location's monthly appointment visits",
                notes: "Returns a location's monthly appointment visits with the given parameter uuid",
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/hiv-summary-indicators',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicHivSummayIndicators(request, reply);
                },
                description: "Get a location's HIV summary indicators",
                notes: "Returns a location's HIV summary indicators with the given parameter uuid",
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/appointment-schedule',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicAppointmentSchedule(request, reply);
                },
                description: "Get a location's appointment schedule",
                notes: "Returns a location's appointment-schedule with the given parameter uuid",
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/daily-visits',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicDailyVisits(request, reply);
                },
                description: "Get a location's daily visits",
                notes: "Returns a location's daily visits with the given parameter uuid",
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/has-not-returned',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getHasNotReturned(request, reply);
                },
                description: "Get a location's not returned visits",
                notes: "Returns a location's not returned visits with the given parameter uuid",
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/monthly-appointment-schedule',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicMonthlyAppointmentSchedule(request, reply);
                },
                description: "Get a location's monthly appointment schedule",
                notes: "Returns a location's monthly appointment schedule with the given parameter uuid",
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/monthly-visits',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicMonthlyVisits(request, reply);
                },
                description: "Get a location's monthly visits",
                notes: "Returns a location's monthly visits with the given parameter uuid",
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/defaulter-list',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicDefaulterList(request, reply);
                },
                description: "Get a location's defaulter list",
                notes: "Returns a location's defaulter list with the given parameter uuid",
                tags: ['api'],
            }
        },
        {
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
        },
        {
            method: 'GET',
            path: '/etl/custom_data/{userParams*3}',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getCustomData(request, reply);
                },
                /*
                 the rest request and query expression should be
                 /table/filter_column/filter/filter_value or
                 /table/filter_column/filter/filter_value?fields=(field1,field2,fieldn) or

                 */
            }
        },
        {
            method: 'GET',
            path: '/etl/patient/creation/statistics',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatientCountGroupedByLocation(request, reply);
                },
                description: "Get patients created by period",
                notes: "Returns a list of patients created by period for each location",
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{location}/patient/creation/statistics',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatientDetailsGroupedByLocation(request, reply);
                },
                description: "Get details of patient created in a location",
                notes: "Returns details of patient created in a location",
                tags: ['api'],
            }
        },
        {
            /**
             endpoint  to  get  Reports
             @todo Rename  to get-report-by-name,count by{patient/encounters},filter-params{location/starting date/ end date}
             @todo ,groupby params{location/monthly}
             **/

            method: 'GET',
            path: '/etl/get-report-by-report-name',
            config: {
                auth: 'simple',
                handler: function (request, reply) {

                    var asyncRequests = 0; //this should be the number of async requests needed before they are triggered
                    var onResolvedPromise = function (promise) {
                        asyncRequests--;
                        if (asyncRequests <= 0) { //voting process to ensure all pre-processing of request async operations are complete
                            dao.getReportIndicators(request, reply);
                        }
                    };
                    if (request.query.locationUuids) {
                        asyncRequests++;
                    }
                    if (asyncRequests === 0)
                        dao.getReportIndicators(request, reply);
                    if (request.query.locationUuids) {
                        dao.getIdsByUuidAsyc('amrs.location', 'location_id', 'uuid', request.query.locationUuids,
                            function (results) {
                                request.query.locations = results;
                            }).onResolved = onResolvedPromise;
                    }

                },
                description: 'Get MOH731 report',
                notes: 'Returns MOH731 report for each location',
                tags: ['api'],

            }
        },
        {
            method: 'GET',
            path: '/etl/location/{location}/patient-by-indicator',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatientListByIndicator(request, reply);
                },
                description: 'Get patient list by indicator',
                notes: 'Returns a patient list by indicator with a given uuid as parameter',
                tags: ['api'],
                validate: {
                    params: {
                        location: Joi.string()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/patient-by-indicator',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var asyncRequests = 0; //this should be the number of async requests needed before they are triggered

                    var onResolvedPromise = function (promise) {
                        asyncRequests--;
                        if (asyncRequests <= 0) { //voting process to ensure all pre-processing of request async operations are complete
                            dao.getPatientByIndicatorAndLocation(request, reply);
                        }
                    };

                    //establish the number of asyncRequests
                    //this is done prior to avoid any race conditions
                    if (request.query.locationUuids) {
                        asyncRequests++;
                    }

                    if (asyncRequests === 0)
                        dao.getPatientByIndicatorAndLocation(request, reply);
                    if (request.query.locationUuids) {
                        dao.getIdsByUuidAsyc('amrs.location', 'location_id', 'uuid', request.query.locationUuids,
                            function (results) {
                                request.query.locations = results;
                            }).onResolved = onResolvedPromise;
                    }
                },
                description: 'Get patient',
                notes: 'Returns a patient with the given parameter uuid',
                tags: ['api'],
            }
        },
        {
            method: 'GET',
            path: '/etl/data-entry-statistics/{sub}',
            config: {
                handler: function (request, reply) {
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
                },
            }
        },
        {
            /**
             endpoint  to  get  Reports Indicators
             @todo Rename  to get-report-indicators by  report  name
             **/

            method: 'GET',
            path: '/etl/indicators-schema',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getIndicatorsSchema(request, reply);
                },
                description: 'Get HIV monthly summary indicator schema',
                notes: 'Returns HIV monthly summary indicator schema ',
                tags: ['api'],

            }
        },
        {


            method: 'GET',
            path: '/etl/indicators-schema-with-sections',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getIndicatorsSchemaWithSections(request, reply);
                },
                description: 'Get indicator schema with sections',
                notes: 'Returns indicator schema with sections',
                tags: ['api'],

            }
        },
        {
            method: 'GET',
            path: '/etl/hiv-summary-data',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getHivSummaryData(request, reply);
                },
                description: 'Get HIV summary flat table',
                notes: 'Returns a HIV summary flat table',
                tags: ['api'],

            }
        },

    ];
}();
