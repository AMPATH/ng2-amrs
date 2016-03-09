const Hapi = require('hapi');
const mysql = require('mysql');
const Good = require('good');
const Basic = require('hapi-auth-basic');
const https = require('https');
const settings = require('./conf/settings.js');
const config = require('./conf/config');
const corsHeaders = require('hapi-cors-headers');
const _ = require('underscore');
const tls = require('tls');
const fs = require('fs');
const routes = require('./etl-routes');
const elasticRoutes = require('./elastic/routes/care.treatment.routes');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');


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


server.connection({
    port: config.etl.port,
    host: config.etl.host,
    tls: config.etl.tls
});


var pool = mysql.createPool(settings.mysqlPoolSettings);

var validate = function (username, password, callback) {

    //Openmrs context
    var options = {
        hostname: config.openmrs.host,
        port: config.openmrs.port,
        path: '/amrs/ws/rest/v1/session',
        headers: {
            'Authorization': "Basic " + new Buffer(username + ":" + password).toString("base64")
        }
    };

    https.get(options, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var result = JSON.parse(body);
            console.log(result);
            callback(null, result.authenticated, {});
        });
    }).on('error', function (error) {
        console.log(error);
        callback(null, false);
    });


};

const HapiSwaggerOptions = {
    info: {
        'title': 'REST API Documentation',
        'version': Pack.version,
    }
};


server.register([
        Inert,
        Vision,
        {
            'register': HapiSwagger,
            'options': HapiSwaggerOptions
        },
        {
            register: Basic,
            options: {}
        }, {
            register: Good,
            options: {
                reporters: [{
                    reporter: require('good-console'),
                    events: {
                        response: '*',
                        log: '*'
                    }
                }]
            }
        }],

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

        server.ext('onPreResponse', corsHeaders);
        server.start(function () {
            server.log('info', 'Server running at: ' + server.info.uri);
        });
    });
module.exports = server;
