"use strict";
// var dao = require('./etl-dao');
var dao = require('./etl-dao');
var winston = require('winston');
var path = require('path');
var _ = require('underscore');
module.exports = function () {

    return [
        {
            method: 'GET',
            path: '/',
            config: {
                handler: function (request, reply) {
                    reply('Hello, World! HAPI Demo Server');
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
                        logger.add(require('winston-daily-rotate-file'),
                            {filename: path.join(__dirname, 'logs', 'client-logs.log')});
                        logger.info(request.payload);
                    }

                    reply({message: 'ok'});
                }

            }
        },
        {
            method: 'GET',
            path: '/etl/patient/{uuid}',
            config: {
                //auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatient(request, reply);
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
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/patient/{uuid}/hiv-summary',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatientHivSummary(request, reply);
                }
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
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/hiv-summary-indicators',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicHivSummayIndicators(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/appointment-schedule',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicAppointmentSchedule(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/daily-visits',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicDailyVisits(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/has-not-returned',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getHasNotReturned(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/monthly-appointment-schedule',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicMonthlyAppointmentSchedule(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/monthly-visits',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicMonthlyVisits(request, reply);
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{uuid}/defaulter-list',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getClinicDefaulterList(request, reply);
                }
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
                }
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
                }
            }
        },
        {
            method: 'GET',
            path: '/etl/location/{location}/patient/creation/statistics',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatientDetailsGroupedByLocation(request, reply);
                }
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
                    switch (request.query.report) {
                        case 'MOH-731':
                        {
                            console.log("using this  case>>>>>> MOH-731")
                            dao.getReportIndicators(request, reply);
                            break;
                        }
                        default:
                        {
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
                            if (asyncRequests == 0)
                                dao.getReportIndicators(request, reply);
                            if (request.query.locationUuids) {
                                dao.getIdsByUuidAsyc('amrs.location', 'location_id', 'uuid', request.query.locationUuids,
                                    function (results) {
                                        request.query.locationIds = results;
                                    }).onResolved = onResolvedPromise;
                            }
                            break;
                        }
                    }
                }

            }
        },
        {
            method: 'GET',
            path: '/etl/location/{location}/patient-by-indicator',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getPatientListByIndicator(request, reply);
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

                    if (asyncRequests == 0)
                        dao.getPatientByIndicatorAndLocation(request, reply);
                    if (request.query.locationUuids) {
                        dao.getIdsByUuidAsyc('amrs.location', 'location_id', 'uuid', request.query.locationUuids,
                            function (results) {
                                request.query.locationIds = results;
                            }).onResolved = onResolvedPromise;
                    }
                }
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

                    if (asyncRequests == 0)
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
                }

            }
        },
        {


            method: 'GET',
            path: '/etl/indicators-schema-with-sections',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getIndicatorsSchemaWithSections(request, reply);
                }

            }
        },
        {
            method: 'GET',
            path: '/etl/hiv-summary-data',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    dao.getHivSummaryData(request, reply);
                }

            }
        },

    ];
}();
