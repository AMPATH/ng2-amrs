var Hapi = require('hapi');
var mysql = require('mysql');
var Good = require('good');
var Basic = require('hapi-auth-basic');
var http = require('http');
var settings = require('./settings.js');
var squel = require ('squel');
var _ = require('underscore');

var server = new Hapi.Server(
    {connections: {
        routes: {cors:true}
    }
    });
server.connection({ port: 3000 });

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

//order=columname|asc,columnName|desc

var getSortOrder = function(param) {
    if(!param) return null;
    console.log(param);
    param = param.split(',')
    var parts;
    var order = [];
    _.each(param,function(order_by) {
        parts = order_by.split('|');
        order.push({column:parts[0],asc:(parts[1].toLowerCase() === "asc")});
    })
    return order;
}

var queryLimit = 20;
var queryOffset = 0;
var queryServer = function(queryParts,callback) {
    var s = squel.select()
        .from(queryParts['table'])

    s.where.apply(this,queryParts['where']);
    _.each(queryParts['order'], function(param) {s.order(param.column, param.asc);});
    s.limit(queryParts['limit'] || queryLimit);
    s.offset(queryParts['offset'] || queryOffset)
    var q = s.toParam();
    console.log(q);

    pool.getConnection(function (err, connection) {
        if(err) {
            console.log('Database Connection Error');
            return;
        }
        connection.query(q.text, q.values,
            function (err, rows, fields) {
                connection.release();
                if(err) console.log(err);
                callback(rows);
            });
    });

}

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
                //auth: 'simple',
                handler: function(request,reply) {
                    reply('hello world');
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/patient/{uuid}',
            config: {
                //auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    console.log(request.params);
                    var order = getSortOrder(request.query.order);

                    var queryParts = {
                        table:"reporting_JD.moh_data",
                        where:["uuid = ?",uuid],
                        order: order || [{column:'encounter_datetime',asc:false}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    queryServer(queryParts,reply);
                }
            }
        });


        server.start(function () {
            server.log('info', 'Server running at: ' + server.info.uri);
        });
});