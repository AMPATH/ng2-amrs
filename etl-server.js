var Hapi = require('hapi');
var mysql = require('mysql');
var Good = require('good');
var requestConfig = require('./request-config');
var Basic = require('hapi-auth-basic');
var https = require('http');
var config = require('./conf/config');
var requestConfig = require('./request-config');
var corsHeaders = require('hapi-cors-headers');
var _ = require('underscore');
var moment = require('moment');
var tls = require('tls');
var fs = require('fs');
var routes = require('./etl-routes');
var elasticRoutes = require('./elastic/routes/care.treatment.routes');
var Inert = require('inert');
var Vision = require('vision');
var HapiSwagger = require('hapi-swagger');
var Pack = require('./package');
var hapiAuthorization = require('hapi-authorization');
var authorizer = require('./authorization/etl-authorizer');
var cluster = require('cluster');
var os = require('os');
var locationAuthorizer = require('./authorization/location-authorizer.plugin');
var cache = require('./session-cache');
var numCPUs = os.cpus().length;
var server = new Hapi.Server({
    connections: {
        //routes: {cors:{origin:["https://amrs.ampath.or.ke:8443"]}}
        routes: {
            cors: {
                additionalHeaders: ['JSNLog-RequestId']
            }
        }
    }
});

var tls_config = false;
if (config.etl.tls) {
    tls_config = tls.createServer({
        key: fs.readFileSync(config.etl.key),
        cert: fs.readFileSync(config.etl.cert)
    });
}

server.connection({
    port: config.etl.port,
    host: config.etl.host,
    tls: tls_config
});
var pool = mysql.createPool(config.mysql);

var validate = function (username, password, callback) {
    try {
        //Openmrs context
        var openmrsAppName = config.openmrs.applicationName || 'amrs';
        var authBuffer = new Buffer(username + ":" + password).toString("base64");
        var options = {
            hostname: config.openmrs.host,
            port: config.openmrs.port,
            path: '/' + openmrsAppName + '/ws/rest/v1/session',
            headers: {
                'Authorization': "Basic " + authBuffer
            }
        };
        var key = '';
        cache.encriptKey(authBuffer, function (hash) {
            key = hash;
            if (cache.getFromToCache(key) === null) {
                if (config.openmrs.https) {
                    https = require('https');
                }
                https.get(options, function (res) {
                    var body = '';
                    res.on('data', function (chunk) {
                        body += chunk;
                    });
                    res.on('end', function () {
                        var result = JSON.parse(body);
                        if (result.authenticated === true) {
                            var user = result.user.username;
                            authorizer.setUser(result.user);
                            authorizer.getUserAuthorizedLocations(result.user.userProperties, function (authorizedLocations) {
                                var currentUser = {
                                    username: username,
                                    role: authorizer.isSuperUser() ?
                                        authorizer.getAllPrivilegesArray() : authorizer.getCurrentUserPreviliges(),
                                    authorizedLocations: authorizedLocations
                                };
                                cache.saveToCache(key, {
                                    result: result,
                                    currentUser: currentUser
                                });
                                callback(null, result.authenticated, currentUser);
                            });
                        } else {
                            console.log('An error occurred while trying to validate; user is not authenticated');
                            callback(null, false);
                        }
                    });
                }).on('error', function (error) {
                    //console.log(error);
                    callback(null, false);
                });
            } else {
                var cached = cache.getFromToCache(key);
                authorizer.setUser(cached.result.user);
                cache.saveToCache(key, {
                    result: cached.result,
                    currentUser: cached.currentUser
                });
                callback(null, cached.result.authenticated, cached.currentUser);
            }
        }, function () {
            callback(null, false);
        });
    } catch (ex){
        console.log('An error occurred while trying to validate',ex);
        callback(null, false);
    }
};

var HapiSwaggerOptions = {
    info: {
        'title': 'REST API Documentation',
        'version': Pack.version,
    },
    tags: [{
        'name': 'patient'
    }, {
        'name': 'location'
    }],
    sortEndpoints: 'path'
};

server.ext('onRequest', function (request, reply) {
    requestConfig.setAuthorization(request.headers.authorization);
    return reply.continue();

});
server.register([
        Inert,
        Vision, {
            'register': HapiSwagger,
            'options': HapiSwaggerOptions
        }, {
            register: Basic,
            options: {}
        }, {
            register: hapiAuthorization,
            options: {
                roles: authorizer.getAllPrivilegesArray()
            }
        }, {
            register: Good,
            options: {
                reporters: []
            }
        }, {
            register: locationAuthorizer,
            options: {}
        }
    ],

    function (err) {
        if (err) {
            throw err; // something bad happened loading the plugin
        }
        server.auth.strategy('simple', 'basic', {
            validateFunc: validate
        });

        //Adding routes
        for (var route in routes) {
            server.route(routes[route]);
        }

        for (var route in elasticRoutes) {
            server.route(elasticRoutes[route]);
        }

        server.on('response', function (request) {
            if (request.response === undefined || request.response === null) {
                console.log("No response");
            } else {
                var user = '';
                if (request.auth && request.auth.credentials)
                    user = request.auth.credentials.username;
                console.log(
                    'Username:',
                    user + '\n' +
                    moment().local().format("YYYY-MM-DD HH:mm:ss") + ': ' + server.info.uri + ': ' + request.method.toUpperCase() + ' ' + request.url.path + ' \n ' + request.response.statusCode
                );

            }
        });


        server.ext('onPreResponse', corsHeaders);

        if (config.clusteringEnabled === true && cluster.isMaster) {

            for (var i = 0; i < numCPUs; i++) {
                cluster.fork();
            }

            cluster.on('exit', function (worker, code, signal) {
                //refork the cluster
                //cluster.fork();
            });


        } else {
            //TODO start HAPI server here
            server.start(function () {
                console.log('info', 'Server running at: ' + server.info.uri);
                server.log('info', 'Server running at: ' + server.info.uri);
            });

        }


    });
module.exports = server;
