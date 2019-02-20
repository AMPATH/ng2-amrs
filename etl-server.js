try {
    var Hapi = require('hapi');
    var mysql = require('mysql');
    var Good = require('good');
    const requestAgent = require('superagent');
    const agentCache = require('./app/utils/super-agent-cache');
    var requestConfig = require('./request-config');
    var Basic = require('hapi-auth-basic');
    // var etlBroadcast =require('./etl-broadcast');
    var https = require('http');
    var config = require('./conf/config');
    var requestConfig = require('./request-config');
    var corsHeaders = require('hapi-cors-headers');
    var _ = require('underscore');
    var moment = require('moment');
    console.log('1');
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
    // var Nes = require('nes');
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

    if (config.testMode === true) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    server.connection({
        port: config.etl.port,
        host: config.etl.host,
        tls: tls_config,
        routes: { log: true }
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
            let agent = requestAgent.agent();
            let cachedAgent = agentCache.getAgent(username);
            if (cachedAgent) {
                agent = cachedAgent;
            }
            let protocal = 'http';
            if(config.openmrs.https){
                protocal = 'https';
            }


            agent
                .get(`${protocal}://${username}:${password}@${options.hostname}:${options.port}${options.path}`).set('Accept', 'application/json')
                .then((res) => {
                    let parsedResponse = JSON.parse(res.text);
                    if (parsedResponse.authenticated) {
                        agentCache.saveAgent(parsedResponse.user.username, agent);
                    }
                    if (parsedResponse.authenticated === true) {
                        var user = parsedResponse.user.username;
                        authorizer.setUser(parsedResponse.user);
                        authorizer.getUserAuthorizedLocations(parsedResponse.user.userProperties, function (authorizedLocations) {
                            var currentUser = {
                                username: username,
                                role: authorizer.isSuperUser() ?
                                    authorizer.getAllPrivilegesArray() : authorizer.getCurrentUserPreviliges(),
                                authorizedLocations: authorizedLocations
                            };
                            callback(null, parsedResponse.authenticated, currentUser);
                        });
                    } else {
                        console.log('An error occurred while trying to validate; user is not authenticated');
                        callback(null, false);
                    }
                    return parsedResponse;
                }).catch((error) => {
                    console.log(error);
                    callback(null, false);
                    return {
                        error: "Well that was unexpected talk to the expert"
                    }
                });
        } catch (ex) {
            console.log('An error occurred while trying to validate', ex);
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
        },
        {
            register: require('hapi-routes'),
            options: {
                dir: `${__dirname}/app/routes`,
            },
        },
        {
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
        // {
        //   'register': Nes,
        //   'options': etlBroadcast.getOptions(server)
        // }
    ],

        function (err) {
            if (err) {
                console.error(err)
                throw err; // something bad happened loading the plugin
            }
            server.auth.strategy('simple', 'basic', 'required', {
                validateFunc: validate
            });

            //Adding routes
            for (var route in routes) {
                try {
                    server.route(routes[route]);
                }
                catch (badThing) {
                    console.error(badThing);
                }
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

} catch (error) {
    console.log('error-starting', error);
    throw error;
}

