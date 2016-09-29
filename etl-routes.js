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
var Boom = require('boom');
var authorizer = require('./authorization/etl-authorizer');
var config = require('./conf/config');
var privileges = authorizer.getAllPrivileges();
var etlHelpers = require('./etl-helpers.js');
var crypto = require('crypto');
module.exports = function() {

  return [{
    method: 'GET',
    path: '/',
    config: {
      plugins: {
        'hapiAuthorization': false
      },
      handler: function(request, reply) {

        console.log('default rote', request.path);

        reply('Welcome to Ampath ETL service.');
        //return reply(Boom.forbidden('Not this end point bruh'));
      },
      description: 'Home',
      notes: 'Returns a message that shows ETL service is running.',
      tags: ['api'],
    }
  }, {
    method: 'POST',
    path: '/javascript-errors',
    config: {
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
    path: '/etl/patient/{uuid}/vitals',
    config: {
      auth: 'simple',
      plugins: {
        'hapiAuthorization': {
          role: privileges.canViewPatient
        }
      },
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
  }, {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
        preRequest.resolveLocationIdsToLocationUuids(request,
          function() {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
    handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
            }, { //patient-list-report-currently_in_care_total
              type: 'query', //can be in either query or params so you have to specify
              name: 'report', //name of the parameter
              value: 'patient-list-report-not_on_art_total' //parameter value
            }, {
              type: 'query', //can be in either query or params so you have to specify
              name: 'report', //name of the parameter
              value: 'patient-list-report-currently_in_care_total' //parameter value
            }, {
              type: 'query', //can be in either query or params so you have to specify
              name: 'report', //name of the parameter
              value: 'patient-list-report-on_art_total' //parameter value
            }, {
              type: 'query', //can be in either query or params so you have to specify
              name: 'report', //name of the parameter
              value: 'patient-list-report-patients_requiring_vl' //parameter value
            }, {
              type: 'query', //can be in either query or params so you have to specify
              name: 'report', //name of the parameter
              value: 'patient-list-report-tested_appropriately' //parameter value
            }, {
              type: 'query', //can be in either query or params so you have to specify
              name: 'report', //name of the parameter
              value: 'patient-list-report-not_tested_appropriately' //parameter value
            }, {
              type: 'query', //can be in either query or params so you have to specify
              name: 'report', //name of the parameter
              value: 'patient-list-report-virally_suppressed' //parameter value
            }, {
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
      handler: function(request, reply) {
        //security check
        if (!authorizer.hasReportAccess(request.query.report)) {
          return reply(Boom.forbidden('Unauthorized'));
        }

        var asyncRequests = 0; //this should be the number of async requests needed before they are triggered
        var onResolvedPromise = function(promise) {
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
            function(results) {
              request.query.locations = results;
            }).onResolved = onResolvedPromise;
        }
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
    path: '/etl/location/{location}/patient-by-indicator',
    config: {
      auth: 'simple',
      plugins: {
        'hapiAuthorization': {
          roles: [privileges.canViewPatient, privileges.canViewDataAnalytics]
        }
      },
      handler: function(request, reply) {
        dao.getPatientListByIndicator(request, reply);
      },
      description: 'Get patient list by indicator',
      notes: 'Returns a patient list by indicator for a given location.',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: true
        },
        params: {
          location: Joi.string()
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
      handler: function(request, reply) {
        var asyncRequests = 0; //this should be the number of async requests needed before they are triggered

        var onResolvedPromise = function(promise) {
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
            function(results) {
              request.query.locations = results;
            }).onResolved = onResolvedPromise;
        }
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
            .description("A list of comma separated location uuids"),
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
      handler: function(request, reply) {

        if (request.params.sub === 'patientList' &&
          !authorizer.hasPrivilege(privileges.canViewPatient)) {
          return reply(Boom.forbidden('Unauthorized'));
        }

        var asyncRequests = 0; //this should be the number of async requests needed before they are triggered

        var onResolvedPromise = function(promise) {
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
            function(results) {
              request.query.formIds = results;
            }).onResolved = onResolvedPromise;
        }
        if (request.query.encounterTypeUuids) {

          dao.getIdsByUuidAsyc('amrs.encounter_type', 'encounter_type_id', 'uuid', request.query.encounterTypeUuids,
            function(results) {
              request.query.encounterTypeIds = results;
            }).onResolved = onResolvedPromise;
        }
        if (request.query.locationUuids) {
          dao.getIdsByUuidAsyc('amrs.location', 'location_id', 'uuid', request.query.locationUuids,
            function(results) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
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
      handler: function(request, reply) {
        dao.getHivSummaryData(request, reply);
      }

    }
  }, {
    method: 'GET',
    path: '/etl/patient-list-by-indicator',
    config: {
      auth: 'simple',
      plugins: {
        'hapiAuthorization': {
          roles: [privileges.canViewPatient, privileges.canViewDataAnalytics]
        }
      },
      handler: function(request, reply) {
        var asyncRequests = 0; //this should be the number of async requests needed before they are triggered

        var onResolvedPromise = function(promise) {
          asyncRequests--;
          if (asyncRequests <= 0) { //voting process to ensure all pre-processing of request async operations are complete
            dao.getPatientListReportByIndicatorAndLocation(request, reply);
          }
        };

        //establish the number of asyncRequests
        //this is done prior to avoid any race conditions
        if (request.query.locationUuids) {
          asyncRequests++;
        }

        if (asyncRequests === 0)
          dao.getPatientListReportByIndicatorAndLocation(request, reply);
        if (request.query.locationUuids) {
          dao.getIdsByUuidAsyc('amrs.location', 'location_id', 'uuid', request.query.locationUuids,
            function(results) {
              request.query.locations = results;
            }).onResolved = onResolvedPromise;
        }
      }
    }
  }, {
    method: 'GET',
    path: '/etl/patient-lab-orders',
    config: {
      auth: 'simple',
      handler: function(request, reply) {
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
      handler: function(request, reply) {
        dao.postLabOrderToEid(request, reply);
      }
    }
  }, {
    method: 'GET',
    path: '/etl/session/invalidate',
    config: {
      auth: 'simple',
      handler: function(request, reply) {
        dao.invalidateUserSession(request, reply);
      }
    }
  }, {
    method: 'GET',
    path: '/etl/lab-cohorts',
    config: {
      auth: 'simple',
      handler: function(request, reply) {

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
      auth: 'simple',
      handler: function(request, reply) {

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
      tags: ['api'],
      validate: {
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
    path: '/etl/eid/load-order-justifications',
    config: {
      auth: 'simple',
      handler: function(request, reply) {

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
      handler: function(request, reply) {
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
            function() {
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
  }];
}();
