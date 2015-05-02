var Hapi = require('hapi');
var mysql = require('mysql');
var Good = require('good');
var Basic = require('hapi-auth-basic');
var https = require('https');
var settings = require('./conf/settings.js');
var squel = require ('squel');
var _ = require('underscore');
var tls = require('tls');
var fs = require('fs');


var httpsServer = tls.createServer({
    key: fs.readFileSync(settings.sslSettings.key),
    cert: fs.readFileSync(settings.sslSettings.crt)
});

var server = new Hapi.Server(
    {connections: {
        //routes: {cors:{origin:["https://amrs.ampath.or.ke:8443"]}}
        routes: {cors:true}
    }
    });


server.connection({
    port: 8002,
    tls: httpsServer
});


var pool = mysql.createPool(settings.mysqlPoolSettings);

var validate = function (username,password,callback) {

    //Openmrs context
    var options = {
        hostname: 'amrs.ampath.or.ke',
        port:8443,
        path:'/amrs/ws/rest/v1/session',
        headers: {
            'Authorization': "Basic " + new Buffer(username + ":" + password).toString("base64")
        }
    };

    https.get(options,function(res) {
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
    var parts;
    var order = [];
    _.each(param.split(','),function(order_by) {
        parts = order_by.split('|');
        order.push({column:parts[0],asc:(parts[1].toLowerCase() === "asc")});
    })
    return order;
}

var queryLimit = 300;
var queryOffset = 0;
var queryServer = function(queryParts,callback) {
    var result = {};
    var s = squel.select()
        .from(queryParts['table'],"t1");

    _.each(queryParts['joins'],function(join) {
        s.join(join[0],join[1],join[2]);
    });

    _.each(queryParts['outerJoins'],function(join) {
        s.outer_join(join[0],join[1],join[2]);
    });


    if (queryParts.columns && queryParts.columns !== "*" ) {
        if(typeof queryParts.columns === "string") {
            if (queryParts.columns.substring(0, 1) === "(")
                queryParts.columns = queryParts.columns.substring(1, -1);
            queryParts.columns = queryParts.columns.split(',');
        }
        _.each(queryParts.columns, function (columnName) {
            s.field(columnName);
        });
    }


    s.where.apply(this,queryParts['where']);
    _.each(queryParts['order'], function(param) {s.order(param.column, param.asc);});
    s.limit(queryParts['limit'] || queryLimit);
    s.offset(queryParts['offset'] || queryOffset);
    _.each(queryParts['group'],function(col) {s.group(col);});


    var q = s.toParam();

    console.log(q.text.replace("\\",""));
    console.log(q.values);
    pool.getConnection(function (err, connection) {
        if(err) {
            result.errorMessage = "Database Connection Error";
            result.error = err;
            console.log('Database Connection Error');
            callback(result);
            return;
        }
        connection.query((q.text.replace("\\","")), q.values,
            function (err, rows, fields) {
                connection.release();
                if(err) {
                    result.errorMessage = "Error querying server"
                    result.error = err;
                }
                else {
                    result.startIndex = queryParts.offset || queryOffset;
                    result.size = rows.length;
                    result.result = rows;
                }
                callback(result);
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
            path: '/etl/patient/{uuid}',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);

                    var queryParts = {
                        columns : request.query.fields || "*",
                        table:"etl.flat_hiv_summary",
                        where:["uuid = ?",uuid],
                        order: order || [{column:'encounter_datetime',asc:false}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    queryServer(queryParts,reply);
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/etl/patient/{uuid}/vitals',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);

                    var queryParts = {
                        columns : request.query.fields || "*",
                        table:"etl.flat_vitals",
                        where:["uuid = ?",uuid],
                        order: order || [{column:'encounter_datetime',asc:false}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    queryServer(queryParts,reply);
                }
            }
        });


        server.route({
            method: 'GET',
            path: '/etl/patient/{uuid}/data',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);

                    var queryParts = {
                        columns : request.query.fields || "*",
                        table:"etl.flat_labs_and_imaging",
                        where:["uuid = ?",uuid],
                        order: order || [{column:'encounter_datetime',asc:false}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    queryServer(queryParts,reply);
                }
            }
        });

        server.route({
            method: 'GET',
            path: '/etl/patient/{uuid}/hiv-summary',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);

                    var queryParts = {
                        columns : request.query.fields || "*",
                        table:"etl.flat_hiv_summary",
                        where:["uuid = ?",uuid],
                        order: order || [{column:'encounter_datetime',asc:false}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    queryServer(queryParts,reply);
                }
            }
        });


        /*
        REST ENDPOINTS FOR LOCATION : /etl/location/uuid/
        hiv-summary : summary stats on clinic
        appointments : patients with rtc dates between startDate and endDate


         */

        server.route({
            method: 'GET',
            path: '/etl/location/{uuid}/hiv-summary-indicators',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);

                    var query = ""

                    var queryParts = {
                        columns : request.query.fields || "*",
                        table:"etl.hiv_summary_indicators",
                        where:["location = ?",uuid],
                        order: order || [{column:'encounter_datetime',asc:false}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    queryServer(queryParts,reply);
                }
            }
        });


        server.route({
            method: 'GET',
            path: '/etl/location/{uuid}/appointment-schedule',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);
                    var startDate = request.query.startDate || new Date().toISOString().substring(0,10);
                    var endDate = request.query.endDate || new Date().toISOString().substring(0,10);

                    var queryParts = {
                        columns : request.query.fields || "t1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers",
                        table:"etl.flat_hiv_summary",
                        joins:[
                            ['etl.derived_encounter','t2','t1.encounter_id = t2.encounter_id'],
                            ['amrs.person_name','t3','t1.person_id = t3.person_id'],
                            ['amrs.patient_identifier','t4','t1.person_id=t4.patient_id']
                        ],
                        where:["t1.location_uuid = ? and t2.next_encounter_datetime is null and date(rtc_date) >= ? and date(rtc_date) <= ?",uuid,startDate,endDate],
                        group:['person_id'],
                        order: order || [{column:'family_name',asc:true}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    queryServer(queryParts,reply);
                }
            }
        });


        server.route({
            method: 'GET',
            path: '/etl/location/{uuid}/monthly-appointment-schedule',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);
                    var startDate = request.query.startDate || new Date().toISOString().substring(0,10);

                    var queryParts = {
                        columns : request.query.fields || ["date(rtc_date) as rtc_date","date_format(rtc_date,'%W') as day_of_week","count(*) as total"],
                        table:"etl.flat_hiv_summary",
                        joins:[
                            ['etl.derived_encounter','t2','t1.encounter_id = t2.encounter_id'],
                        ],
                        where:["t1.location_uuid = ? and t2.next_encounter_datetime is null and date_format(rtc_date,'%Y-%m') = date_format(?,'%Y-%m')",uuid,startDate],
                        group:['rtc_date'],
                        order: order || [{column:'rtc_date',asc:true}],
                        offset:request.query.startIndex,
                        limit:request.query.limit
                    }

                    queryServer(queryParts,reply);
                }
            }
        });




        server.route({
            method: 'GET',
            path: '/etl/location/{uuid}/defaulter-list',
            config: {
                auth: 'simple',
                handler: function (request, reply) {
                    var uuid = request.params.uuid;
                    var order = getSortOrder(request.query.order);

                    var defaulterPeriod = request.query.defaulterPeriod || 30;

                    var queryParts = {
                        columns : request.query.fields || "*",
                        table:"etl.flat_defaulters",
                        where:["location_uuid = ? and days_since_rtc >= ?",uuid,defaulterPeriod],
                        order: order || [{column:'risk_category',asc:true},{column:'days_since_rtc',asc:true}],
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