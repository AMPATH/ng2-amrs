var authorizer = require('../../authorization/etl-authorizer');
var privileges = authorizer.getAllPrivileges();
var facilitymappings = require('../facility-mappings/facility-mapping');

const routes = [
  {
    method: 'GET',
    path: '/etl/parentlocations',
    config: {
      plugins: {},
      handler: function (request, reply) {
        facilitymappings
          .getParentLocations(request.query.p)
          .then((result) => {
            reply(result);
          })
          .catch((error) => {
            reply(error);
          });
      },
      description: 'List of facilities with MFL code',
      notes: 'Returns facilities list',
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
    path: '/etl/childlocations',
    config: {
      plugins: {},
      handler: function (request, reply) {
        facilitymappings
          .getChildLocations(request.query)
          .then((result) => {
            reply(result);
          })
          .catch((error) => {
            reply(error);
          });
      },
      description: 'List of facilities with MFL code',
      notes: 'Returns facilities list',
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
