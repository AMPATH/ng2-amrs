import { AdministrativeUnitsDao } from '../../dao/location/AdministrativeUnitsDao';
const routes = [
  {
    method: 'GET',
    path: '/etl/administrative-units',
    config: {
      handler: function (request, reply) {
        let service = new AdministrativeUnitsDao();
        service
          .getAllCounties()
          .then((res) => reply(res))
          .catch((err) => {
            console.log('ERROR ', err);
            reply(err);
          });
      },
      description: 'Get all counties ',
      notes: 'Returns all counties',
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
