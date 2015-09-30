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
var routes = require('./etl-routes');


// var httpsServer = tls.createServer({
//     key: fs.readFileSync(settings.sslSettings.key),
//     cert: fs.readFileSync(settings.sslSettings.crt)
// });

var server = new Hapi.Server(
    {connections: {
        //routes: {cors:{origin:["https://amrs.ampath.or.ke:8443"]}}
        routes: {cors:true}
    }
    });


server.connection({
    port: 8002,
    host:'localhost'
    // tls: httpsServer
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

var getFilters = function(filters) {
    var s="";
    var vals = [],column;
     _.each(filters,function(item) {
         column = item.column;
         for(var f in item.filters) {
             if(item.filters[f] === undefined || item.filters[f] === null || item.filters[f] === "") continue;
             console.log(item.filters[f]);
             s += column;
             if(f === "start") s += " >= ?";
             else if(f === "end") s += " <= ?";
             else s+= " like ?"
             vals.push(item.filters[f]);
             s += " AND "
         }
     });
    s = s.substring(0, s.length-5)
    if(s !== "")
        s = "(" + s + ")";
    console.log(s);
    console.log(vals);
    return {s:s,vals:vals};
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

        //Adding routes
        for (var route in routes) {
            server.route(routes[route]);
        }

        

        server.start(function () {
            server.log('info', 'Server running at: ' + server.info.uri);
        });
});
