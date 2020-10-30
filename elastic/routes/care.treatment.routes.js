module.exports = (function () {
  'use strict';
  var elasticAccess = require('../elastic.access.js');

  function enrolledHandler(request, reply) {
    elasticAccess.getEnrolledInCare({}, function (data) {
      //Create json
      var response = {
        total: data
      };
      reply(JSON.stringify(response));
    });
  }

  function enrolledInCareMohHandler(request, reply) {
    elasticAccess.getEnrolledInCareMOh(request.query, function (data) {
      reply(data);
    });
  }

  function activeInCareMohHandler(request, reply) {
    elasticAccess.getActiveInCareMoh(request.query, function (data) {
      reply(data);
    });
  }

  return [
    {
      method: 'GET',
      path: '/home',
      handler: function (request, reply) {
        var server = {
          name: 'Indicators Rest Server',
          version: '0.0.1',
          description: 'You know for blazing fast speeds ...'
        };
        reply(JSON.stringify(server));
      }
    },
    {
      method: 'GET',
      path: '/enrolled-in-care',
      handler: enrolledHandler
    },
    {
      method: 'GET',
      path: '/enrolled-in-care/moh',
      handler: enrolledInCareMohHandler
    },
    {
      method: 'GET',
      path: '/active-in-care/moh',
      handler: activeInCareMohHandler
    }
  ];
})();
