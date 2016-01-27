var Hapi = require('hapi');
var mysql = require('mysql');
var Good = require('good');
var Basic = require('hapi-auth-basic');
var https = require('https');
var settings = require('./conf/settings.js');
var corsHeaders = require('hapi-cors-headers');
var _ = require('underscore');
var tls = require('tls');
var fs = require('fs');
var routes = require('./etl-routes');
var elasticRoutes = require('./elastic/routes/care.treatment.routes');

var httpsServer = tls.createServer({
    key: fs.readFileSync(settings.sslSettings.key),
    cert: fs.readFileSync(settings.sslSettings.crt)
});

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
    port: 8002,
    host:'localhost'
    //tls: httpsServer
});


var pool = mysql.createPool(settings.mysqlPoolSettings);

var validate = function(username, password, callback) {

  //Openmrs context
  var options = {
      hostname: 'amrs.ampath.or.ke',
      port:8443,
      path:'/amrs/ws/rest/v1/session',
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


server.register([{
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
