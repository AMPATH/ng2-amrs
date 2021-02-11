var authorizer = require('../../authorization/etl-authorizer');
import { FamilyTestingService } from '../family-history/family-history.service';
var privileges = authorizer.getAllPrivileges();

const routes = [
  {
    method: 'GET',
    path: '/etl/family-history-patient-list',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, reply) {
        let familyTestingService = new FamilyTestingService();

        familyTestingService.getPatientList(request.query).then((result) => {
          if (result.error) {
            reply(result);
          } else {
            reply(result);
          }
        });
      },
      description: 'Family testing patient list',
      notes: 'Family testing patient list',
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
    path: '/etl/patient-family-history',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, reply) {
        let familyTestingService = new FamilyTestingService();

        familyTestingService
          .getPatientContacts(request.query)
          .then((result) => {
            if (result.error) {
              reply(result);
            } else {
              reply(result);
            }
          });
      },
      description: 'Family testing patient list',
      notes: 'Family testing patient list',
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
    method: 'PUT',
    path: '/etl/update-contact',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, h) {
        try {
          let familyTestingService = new FamilyTestingService();

          familyTestingService
            .updateRegisteredContact(request.payload)
            .then((result) => {
              const res = {
                type: 'Success',
                message: 'Contact Updated successfully',
                body: result
              };
              h.response(res);
            });
        } catch (err) {
          h.response(error);
        }
      },
      description: 'Update contact after a successful registration',
      notes: 'Update contact after a successful registration',
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
    path: '/etl/contact-tracing',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, h) {
        try {
          const service = new FamilyTestingService();

          let params = {
            payload: request.payload,
            query: request.query
          };
          service.saveContactTracing(params).then((result) => {
            const res = {
              type: 'Success',
              message: 'Tracing information saved',
              body: result
            };
            h.response(res);
          });
        } catch (err) {
          h.response(error);
        }
      },
      description: 'Contact tracing information',
      notes: 'contact tracing information',
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
    path: '/etl/contact-tracing-history',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, h) {
        try {
          const service = new FamilyTestingService();

          service.getContactTracingHistory(request.query).then((result) => {
            h.response(result);
          });
        } catch (err) {
          h.response(error);
        }
      },
      description: 'Tracing information saved',
      notes: 'Tracing information saved',
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
    method: 'DELETE',
    path: '/etl/contact',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewClinicDashBoard
        }
      },
      handler: function (request, h) {
        try {
          const service = new FamilyTestingService();

          service.deleteContact(request.query).then((result) => {
            const res = {
              type: 'Success',
              message: `Contact with id ${request.query.contact_id} deleted successfully`,
              body: result
            };
            h.response(res);
          });
        } catch (err) {
          h.response(error);
        }
      },
      description: 'Delete contact endpoint',
      notes: 'Delete contact endpoint',
      tags: ['api'],
      validate: {
        options: {
          allowUnknown: true
        },
        params: {}
      }
    }
  }
];
exports.routes = (server) => server.route(routes);
