"use strict";

var mysql = require('mysql');
var settings = require('./conf/settings.js');
var squel = require ('squel');
var _ = require('underscore');

module.exports = function() {
	var service = {};
	var pool  = mysql.createPool(settings.mysqlPoolSettings);


	var getServerConnection = function(connectHandler) {
		pool.getConnection(function(err, connection) {
			if (err) {
				console.log('Error While connecting to the database', err);
            	return connectHandler(err, null);
			}
			return connectHandler(null, connection);
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

	service.queryServer = function(queryParts, callback) {
        var result = {};
		var sql = queryParts.sql;
		var values = queryParts.values;
		// var queryHandler = queryParts.callback;

        console.log('Sql query', sql);
		getServerConnection(function(err, connection) {
			if (err) return queryHandler(err, null);

			connection.query(sql, values, function(err, rows, fields) {
                if(err) {
                    result.errorMessage = "Error querying server"
                    result.error = err;
                }
                else {
                    result.startIndex = queryOffset;
                    result.size = rows.length;
                    result.result = rows;
                }
                // queryHandler(err, result);
                callback(result);
                connection.release();
			});
		});
	};



	service.queryServer_test = function(queryParts, callback) {
    var result = {};
    var tableAlias='t1';
        if(queryParts['alias'])tableAlias=queryParts['alias'];
    var s = squel.select()
        .from(queryParts['table'],tableAlias);

    _.each(queryParts['joins'],function(join) {
        s.join(join[0],join[1],join[2]);
    });

    _.each(queryParts['outerJoins'],function(join) {
        s.outer_join(join[0],join[1],join[2]);
    });

    _.each(queryParts['leftOuterJoins'],function(join) {
        s.left_outer_join(join[0],join[1],join[2]);
    });


    if (queryParts.columns && queryParts.columns !== "*" ) {
        if(typeof queryParts.columns === "string") {
            // if (queryParts.columns.substring(0, 1) === "(")
            //     queryParts.columns = queryParts.columns.substring(1, -1);
            queryParts.columns = queryParts.columns.split(',');
        }
        var i = 0;
        _.each(queryParts.columns, function (columnName) {
            if (i === 0 && columnName.substring(0,1) === "(")
                s.field(columnName.split("(")[1]);
            else if (i === queryParts.columns.length-1)
            {
                var col = columnName;
                var n = columnName.split(")").length-1;
                if(n === 1 && !_.contains(col,"("))
                    s.field(columnName.split(")")[0]);
                else s.field(col);
            }
            else s.field(columnName);
            i++;
        });
    }
    if (queryParts.concatColumns && queryParts.concatColumns !== "*" ) {
        if(typeof queryParts.concatColumns === "string") {
            // if (queryParts.columns.substring(0, 1) === "(")
            //     queryParts.columns = queryParts.columns.substring(1, -1);
            queryParts.concatColumns = queryParts.concatColumns.split(';');
        }
        var i = 0;
        _.each(queryParts.concatColumns, function (columnName) {
            if (i === 0 && columnName.substring(0,1) === "(")
                s.field(columnName.split("(")[1]);
            else if (i === queryParts.concatColumns.length-1)
            {
                var col = columnName;
                var n = columnName.split(")").length-1;
                if(n === 1 && !_.contains(col,"("))
                    s.field(columnName.split(")")[0]);
                else s.field(col);
            }
            else s.field(columnName);
            i++;
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

    var sql = q.text.replace("\\","");
	var values = q.values;
	//var queryHandler = params.callback;


    getServerConnection(function(err, connection) {
			if (err) return queryHandler(err, null);

			connection.query(sql, values, function(err, rows, fields) {
				if(err) {
                    result.errorMessage = "Error querying server";
                    result.error = err;
                    result.sql=sql;
                    result.sqlParams=values;
                }
                else {
                    result.startIndex = queryParts.offset || queryOffset;
                    result.size = rows.length;
                    result.result = rows;
                    result.sql=sql;
                    result.sqlParams=values;
                }
				// queryHandler(err, result);
				callback(result);
				connection.release();
			});
		});


    // pool.getConnection(function (err, connection) {
    //     if(err) {
    //         result.errorMessage = "Database Connection Error";
    //         result.error = err;
    //         console.log('Database Connection Error');
    //         callback(result);
    //         return;
    //     }
    //     connection.query((q.text.replace("\\","")), q.values,
    //         function (err, rows, fields) {
    //             connection.release();
    //             if(err) {
    //                 result.errorMessage = "Error querying server"
    //                 result.error = err;
    //             }
    //             else {
    //                 result.startIndex = queryParts.offset || queryOffset;
    //                 result.size = rows.length;
    //                 result.result = rows;
    //             }
    //             callback(result);
    //         });
    // });

};
  service.ExecuteMultiReport = function(sql,values, callback) {
    var result = {};
        var tableAlias='t1';
        getServerConnection(function(err, connection) {
            if (err) return queryHandler(err, null);

            connection.query(sql, values, function(err, rows, fields) {
                if(err) {
                    result.errorMessage = "Error querying server";
                    result.error = err;
                    result.sql=sql;
                    result.sqlParams=values;
                }
                else {
                   // result.startIndex = queryParts.offset || queryOffset;
                    result.size = rows.length;
                    result.result = rows;
                    result.sql=sql;
                    result.sqlParams=values;
                }
                // queryHandler(err, result);
                callback(result);
                connection.release();
            });
        });

    };
    service.reportQueryServer = function(queryParts, callback) {
    console.log(queryParts,"current query part")
        var result = {};
        var tableAlias='t1';
        if(queryParts['alias'])tableAlias=queryParts['alias'];
        var s = squel.select()
            .from(queryParts['table'],tableAlias);

        _.each(queryParts['joins'],function(join) {
            if (join[3]=='JOIN') s.join(join[0],join[1],join[2]);
            if (join[3]=='INNER JOIN') s.join(join[0],join[1],join[2]);
            if (join[3]=='OUTER JOIN') s.outer_join(join[0],join[1],join[2]);
            if (join[3]=='LEFT OUTER JOIN') s.left_outer_join(join[0],join[1],join[2]);
        });


        if (queryParts.columns && queryParts.columns !== "*" ) {
            if(typeof queryParts.columns === "string") {
                // if (queryParts.columns.substring(0, 1) === "(")
                //     queryParts.columns = queryParts.columns.substring(1, -1);
                queryParts.columns = queryParts.columns.split(',');
            }
            var i = 0;
            _.each(queryParts.columns, function (columnName) {
                if (i === 0 && columnName.substring(0,1) === "(")
                    s.field(columnName.split("(")[1]);
                else if (i === queryParts.columns.length-1)
                {
                    var col = columnName;
                    var n = columnName.split(")").length-1;
                    if(n === 1 && !_.contains(col,"("))
                        s.field(columnName.split(")")[0]);
                    else s.field(col);
                }
                else s.field(columnName);
                i++;
            });
        }
        if (queryParts.concatColumns && queryParts.concatColumns !== "*" ) {
            if(typeof queryParts.concatColumns === "string") {
                // if (queryParts.columns.substring(0, 1) === "(")
                //     queryParts.columns = queryParts.columns.substring(1, -1);
                queryParts.concatColumns = queryParts.concatColumns.split(';');
            }
            var i = 0;
            _.each(queryParts.concatColumns, function (columnName) {
                if (i === 0 && columnName.substring(0,1) === "(")
                    s.field(columnName.split("(")[1]);
                else if (i === queryParts.concatColumns.length-1)
                {
                    var col = columnName;
                    var n = columnName.split(")").length-1;
                    if(n === 1 && !_.contains(col,"("))
                        s.field(columnName.split(")")[0]);
                    else s.field(col);
                }
                else s.field(columnName);
                i++;
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

        var sql = q.text.replace("\\","");
        var values = q.values;
        // var queryHandler = params.callback;


        getServerConnection(function(err, connection) {
            if (err) return queryHandler(err, null);

            connection.query(sql, values, function(err, rows, fields) {
                if(err) {
                    result.errorMessage = "Error querying server";
                    result.error = err;
                    result.sql=sql;
                    result.sqlParams=values;
                }
                else {
                    result.startIndex = queryParts.offset || queryOffset;
                    result.size = rows.length;
                    result.result = rows;
                    result.sql=sql;
                    result.sqlParams=values;
                }
                // queryHandler(err, result);
                callback(result);
                connection.release();
            });
        });

    };

    service.reportMultiQueryServer = function(queryPartsArray) {
    var  multiquery="";
    var multuvalues=[];
     var result = {};
     var tableAlias='t1';
    _.each(queryPartsArray,function(queryParts){
       // console.log(queryParts,"current query part")
       if(queryParts!==undefined)
       {

            var result = {};
            var tableAlias='t1';
            if(queryParts['alias'])tableAlias=queryParts['alias'];
            var s = squel.select()
                .from(queryParts['table'],tableAlias);

            _.each(queryParts['joins'],function(join) {
                if (join[3]=='JOIN') s.join(join[0],join[1],join[2]);
                if (join[3]=='INNER JOIN') s.join(join[0],join[1],join[2]);
                if (join[3]=='OUTER JOIN') s.outer_join(join[0],join[1],join[2]);
                if (join[3]=='LEFT OUTER JOIN') s.left_outer_join(join[0],join[1],join[2]);
            });


            if (queryParts.columns && queryParts.columns !== "*" ) {
                if(typeof queryParts.columns === "string") {
                    // if (queryParts.columns.substring(0, 1) === "(")
                    //     queryParts.columns = queryParts.columns.substring(1, -1);
                    queryParts.columns = queryParts.columns.split(',');
                }
                var i = 0;
                _.each(queryParts.columns, function (columnName) {
                    if (i === 0 && columnName.substring(0,1) === "(")
                        s.field(columnName.split("(")[1]);
                    else if (i === queryParts.columns.length-1)
                    {
                        var col = columnName;
                        var n = columnName.split(")").length-1;
                        if(n === 1 && !_.contains(col,"("))
                            s.field(columnName.split(")")[0]);
                        else s.field(col);
                    }
                    else s.field(columnName);
                    i++;
                });
            }
            if (queryParts.concatColumns && queryParts.concatColumns !== "*" ) {
                if(typeof queryParts.concatColumns === "string") {
                    // if (queryParts.columns.substring(0, 1) === "(")
                    //     queryParts.columns = queryParts.columns.substring(1, -1);
                    queryParts.concatColumns = queryParts.concatColumns.split(';');
                }
                var i = 0;
                _.each(queryParts.concatColumns, function (columnName) {
                    if (i === 0 && columnName.substring(0,1) === "(")
                        s.field(columnName.split("(")[1]);
                    else if (i === queryParts.concatColumns.length-1)
                    {
                        var col = columnName;
                        var n = columnName.split(")").length-1;
                        if(n === 1 && !_.contains(col,"("))
                            s.field(columnName.split(")")[0]);
                        else s.field(col);
                    }
                    else s.field(columnName);
                    i++;
                });
            }


            s.where.apply(this,queryParts['where']);
            _.each(queryParts['order'], function(param) {s.order(param.column, param.asc);});
            s.limit(queryParts['limit'] || queryLimit);
            s.offset(queryParts['offset'] || queryOffset);
            _.each(queryParts['group'],function(col) {s.group(col);});


            var q = s.toParam();

            console.log(q.text.replace("\\",""));
            console.log(q.values,"Values  passed");

            var sql = q.text.replace("\\","");
            var values = q.values;
            // var queryHandler = params.callback;
            if( multiquery===""){
            multiquery=sql;}else{
    multiquery= multiquery+";"+sql;
    }
    _.each(values,function(res){
    multuvalues.push(res);
    })
      }
    });
    return [ multiquery,multuvalues];
    };


	return service;
}();
