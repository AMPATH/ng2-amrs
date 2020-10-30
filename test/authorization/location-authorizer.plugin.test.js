// External modules
var expect = require('chai').expect;
var Hapi = require('hapi');

// Internal modules
var libpath = '../../authorization';
var Plugin = require(libpath + '/location-authorizer.plugin.js');

// Declare internals
var internals = {};

function NOOP() {}
/**
 * This is a test for hapi js plugin that extends the route end points to allow
 * location based authorization.
 */
describe('openmrsLocationAuthorizer', function () {
  var plugin = {
    name: 'openmrsLocationAuthorizer',
    version: '0.0.0',
    register: Plugin.register,
    path: libpath
  };

  it('does not interfere with handlers throwing exceptions', function (done) {
    var server = new Hapi.Server();
    server.connection();
    server.route({
      method: 'GET',
      path: '/',
      config: {
        handler: function (request, reply) {
          throw new Error('uncaught exception test');
        }
      }
    });
    server.register(plugin, {}, function (err) {
      server.start(function (err) {
        server.inject({ method: 'GET', url: '/' }, function (res) {
          internals.asyncCheck(function () {
            expect(res.statusCode).to.equal(500);
            server.stop(NOOP);
          }, done);
        });
      });
    });
  });

  it('makes sure that openmrsLocationAuthorizer can be enabled only for secured routes', function (done) {
    var server = new Hapi.Server(0);
    server.connection();
    server.route({
      method: 'GET',
      path: '/',
      config: {
        plugins: {
          openmrsLocationAuthorizer: {
            locationParameter: [{ type: 'params', name: 'uuid' }]
          }
        },
        handler: function (request, reply) {
          reply('TEST');
        }
      }
    });
    server.register(plugin, {}, function (err) {
      server.start(function (err) {
        expect(err).to.not.be.undefined;
        expect(err).to.match(
          /openmrsLocationAuthorizer can be enabled only for secured route/
        );
        server.stop(NOOP); // Make sure the server is stopped
        done();
      });
    });
  });

  it('should allow openmrsLocationAuthorizer for routes secured in the route config', function (done) {
    var server = new Hapi.Server(0);
    server.connection();
    server.auth.scheme('custom', internals.authSchema);
    server.auth.strategy('default', 'custom', false, {});
    server.route({
      method: 'GET',
      path: '/',
      config: {
        auth: 'default',
        plugins: {
          openmrsLocationAuthorizer: {
            locationParameter: [{ type: 'params', name: 'uuid' }]
          }
        },
        handler: function (request, reply) {
          reply('TEST');
        }
      }
    });
    server.register(plugin, {}, function (err) {
      server.start(function (err) {
        expect(err).to.be.undefined;
        server.stop(NOOP); // Make sure the server is stopped
        done();
      });
    });
  });

  it('should allow openmrsLocationAuthorizer for routes secured globally with authentication', function (done) {
    var server = new Hapi.Server(0);
    server.connection();
    server.auth.scheme('custom', internals.authSchema);
    server.auth.strategy('default', 'custom', false, {});
    server.auth.default('default');
    server.route({
      method: 'GET',
      path: '/',
      config: {
        plugins: {
          openmrsLocationAuthorizer: {
            locationParameter: [{ type: 'params', name: 'uuid' }]
          }
        },
        handler: function (request, reply) {
          reply('TEST');
        }
      }
    });
    server.register(plugin, {}, function (err) {
      server.start(function (err) {
        expect(err).to.be.undefined;
        server.stop(NOOP); // Make sure the server is stopped
        done();
      });
    });
  });

  it(
    'should allow openmrsLocationAuthorizer for routes secured globally with authentication and blacklisting routes' +
      ' to require authorization',
    function (done) {
      var server = new Hapi.Server(0);
      server.connection({
        routes: {
          plugins: {
            openmrsLocationAuthorizer: {
              locationParameter: [{ type: 'params', name: 'uuid' }]
            }
          }
        }
      });
      server.auth.scheme('custom', internals.authSchema);
      server.auth.strategy('default', 'custom', false, {});
      server.auth.default('default');
      server.route({
        method: 'GET',
        path: '/',
        config: {
          //plugins: {'openmrsLocationAuthorizer': {locationParameter: [{ type: 'params',name: 'uuid' }]}},
          handler: function (request, reply) {
            reply('TEST');
          }
        }
      });
      server.register(plugin, {}, function (err) {
        server.start(function (err) {
          expect(err).to.be.undefined;
          server.stop(NOOP); // Make sure the server is stopped
          done();
        });
      });
    }
  );

  it('should error with global authentication not set and blacklisting routes to require authorization', function (done) {
    var server = new Hapi.Server(0);
    server.connection({
      routes: {
        plugins: {
          openmrsLocationAuthorizer: {
            locationParameter: [{ type: 'params', name: 'uuid' }]
          }
        }
      }
    });
    //server.auth.scheme('custom', internals.authSchema);
    //server.auth.strategy('default', 'custom', false, {});
    //server.auth.default('default');
    server.route({
      method: 'GET',
      path: '/',
      config: {
        //plugins: {'openmrsLocationAuthorizer': {locationParameter: [{ type: 'params',name: 'uuid' }]}},
        handler: function (request, reply) {
          reply('TEST');
        }
      }
    });
    server.register(plugin, {}, function (err) {
      server.start(function (err) {
        expect(err).to.not.be.undefined;
        expect(err).to.match(
          /openmrsLocationAuthorizer can be enabled only for secured route/
        );
        server.stop(NOOP); // Make sure the server is stopped
        done();
      });
    });
  });

  it(
    'should not error with global authentication set, blacklisting routes to require authorization, and disabling ' +
      'authentication and authorization for a specific route',
    function (done) {
      var plugin = {
        name: 'openmrsLocationAuthorizer',
        version: '0.0.0',
        register: Plugin.register,
        path: libpath,
        options: {
          roles: false
        }
      };

      var server = new Hapi.Server(0);
      server.connection({
        routes: {
          plugins: {
            openmrsLocationAuthorizer: {
              locationParameter: [{ type: 'params', name: 'uuid' }]
            }
          }
        }
      });

      server.auth.scheme('custom', internals.authSchema);
      server.auth.strategy('default', 'custom', false, {});
      server.auth.default('default');

      server.route({
        method: 'GET',
        path: '/',
        config: {
          auth: false,
          plugins: { openmrsLocationAuthorizer: false },
          handler: function (request, reply) {
            reply('TEST');
          }
        }
      });

      server.register(plugin, {}, function (err) {
        server.inject({ method: 'GET', url: '/' }, function (res) {
          internals.asyncCheck(function () {
            expect(res.statusCode).to.equal(200);
          }, done);
        });
      });
    }
  );

  it('should error with global auth set but auth false on route', function (done) {
    var server = new Hapi.Server(0);
    server.connection();
    server.auth.scheme('custom', internals.authSchema);
    server.auth.strategy('default', 'custom', false, {});
    server.auth.default('default');
    server.route({
      method: 'GET',
      path: '/',
      config: {
        auth: false,
        plugins: {
          openmrsLocationAuthorizer: {
            locationParameter: [{ type: 'params', name: 'uuid' }]
          }
        },
        handler: function (request, reply) {
          reply('TEST');
        }
      }
    });
    server.register(plugin, {}, function (err) {
      server.start(function (err) {
        expect(err).to.not.be.undefined;
        server.stop(NOOP); // Make sure the server is stopped
        done();
      });
    });
  });

  it('ignores routes without openmrsLocationAuthorizer instructions', function (done) {
    var server = new Hapi.Server();
    server.connection();
    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
        reply('TEST');
      }
    });
    server.register(plugin, {}, function (err) {
      server.inject('/', function (res) {
        expect(res.payload).to.equal('TEST');
        done();
      });
    });
  });

  it('Validates the openmrsLocationAuthorizer plugin options are optional', function (done) {
    var server = new Hapi.Server(0);
    server.connection();
    server.auth.scheme('custom', internals.authSchema);
    server.auth.strategy('default', 'custom', true, {});
    server.route({
      method: 'GET',
      path: '/',
      config: {
        auth: 'default',
        plugins: { openmrsLocationAuthorizer: { bla: 'USER' } },
        handler: function (request, reply) {
          reply('TEST');
        }
      }
    });

    var plugin = {
      name: 'openmrsLocationAuthorizer',
      version: '0.0.0',
      register: Plugin.register,
      path: libpath
    };

    server.register(plugin, {}, function (err) {
      expect(err).to.be.undefined;
      done();
    });
  });
});

internals.authSchema = function () {
  var scheme = {
    authenticate: function (request, reply) {
      return reply({
        username: 'asafdav',
        locationParameter: [{ type: 'params', name: 'uuid' }]
      });
    },
    payload: function (request, reply) {
      return reply(request.auth.credentials.payload);
    },
    response: function (request, reply) {
      return reply();
    }
  };

  return scheme;
};

internals.asyncCheck = function (f, done) {
  try {
    f();
    done();
  } catch (e) {
    done(e);
  }
};
