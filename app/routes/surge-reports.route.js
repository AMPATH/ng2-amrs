var authorizer = require('../../authorization/etl-authorizer');
var privileges = authorizer.getAllPrivileges();
var surge_weeks = require('../../service/surge-reports/surge-weeks.service');
const routes = [
  {
    method: 'GET',
    path: '/etl/surge-weeks',
    config: {
      plugins: {
        hapiAuthorization: {
          role: privileges.canViewPatient
        }
      },
      handler: function (request, reply) {
        surge_weeks
          .getSurgeWeeks()
          .then((result) => {
            reply(result);
          })
          .catch((err) => console.log('ERROR', err));
      },
      description: 'Surge weeks',
      notes: 'Surge weekst',
      tags: ['Surge weeks api'],
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
