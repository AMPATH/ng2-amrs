var Hapi = require('hapi');
var mysql = require('mysql');
var Good = require('good');
var Basic = require('hapi-auth-basic');
var http = require('http');
var settings = require('./settings.js');

/*
 var connection = mysql.createConnection({
 host     : 'amrsreporting.ampath.or.ke',
 user     : 'jdick'
 });
*/



var server = new Hapi.Server(
    {connections: {
        routes: {cors:true}
    }
    });
server.connection({ port: 3000 });

/*
var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : '127.0.0.1',
    port            : '3307',
    user            : 'jdick',
    password        : ''
});
*/
var pool = mysql.createPool(settings.mysqlPoolSettings);


var validate = function (username,password,callback) {

    //Openmrs context
    var options = {
        hostname: 'etl1.ampath.or.ke',
        port:8080,
        path:'/amrs/ws/rest/v1/session',
        headers: {
            'Authorization': "Basic " + new Buffer(username + ":" + password).toString("base64")
        }
    };

    http.get(options,function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            var result = JSON.parse(body);
            console.log(result);
            callback(null,result.authenticated,{});
        });
    }).on('error', function(error) {
        console.log(error);
        callback(null,false);
    });


};



server.register([
    {register: Basic, options:{}},
    {
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
        server.auth.strategy('simple', 'basic', { validateFunc: validate });
        server.route({
            method: 'GET',
            path: '/',
            config: {
                auth: 'simple',
                handler: function(request,reply) {
                    reply('hello world');
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/patient/{uuid}',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;

                    pool.getConnection(function (err, connection) {
                        connection.query('select * from reporting_JD.flat_moh_indicators where person_id=' + uuid,
                            function (err, rows, fields) {
                                console.log(rows);
                                reply(rows);
                            });
                    });
                }
            }
        });


        server.start(function () {
            server.log('info', 'Server running at: ' + server.info.uri);
        });
});