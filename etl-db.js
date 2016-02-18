/*jshint -W003, -W097, -W117, -W026 */
"use strict";

var mysql = require('mysql');
var squel = require('squel');
var _ = require('underscore');
var settings = require('./conf/settings.js');

var errorHandler = function (errorType, error) {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    var errorDescription = errorType + ' occurred at ' + datetime;
    console.log(errorDescription, error);
};

module.exports = function () {
    var service = {};
    var pool = mysql.createPool(settings.mysqlPoolSettings);
    var getServerConnection = function (connectHandler) {
        pool.getConnection(function (err, connection) {
            if (err) {
                errorHandler('exports:Database connection error', err);
                return connectHandler(err, null);
            }
            return connectHandler(null, connection);
        });
    };
    var queryLimit = 300;
    var queryOffset = 0;
    service.queryReportServer= queryReportServer;
        function queryReportServer(sql, callback) {
        var result = {};
        getServerConnection(function (err, connection) {
            if (err) {
                errorHandler('ExecuteMultiReport: Database connection error', err);
                return;
            }

            connection.query(sql.query, sql.sqlParams, function (err, rows, fields) {
                if (err) {
                    errorHandler('Error querying server', err);
                    result.errorMessage = "Error querying server";
                    result.error = err;
                    result.sql = sql.query;
                    result.sqlParams = sql.sqlParams;
                }
                else {
                    result.startIndex = sql.offset || queryOffset;
                    result.size = rows.length;
                    result.result = rows;
                    result.sql = sql.query;
                    result.sqlParams = sql.sqlParams;
                }
                callback(result);
                connection.release();
            });
        });
    }
    service.queryServer = function (queryParts, callback) {
        var result = {};
        var sql = queryParts.sql;
        var values = queryParts.values;

        console.log('Sql query', sql);
        getServerConnection(function (err, connection) {
            if (err) {
                errorHandler('queryServer: Database connection error', err);
                return;
            }

            connection.query(sql, values, function (err, rows, fields) {
                if (err) {
                    errorHandler('queryServer: Error querying server', err);
                    result.errorMessage = "Error querying server";
                    result.error = err;
                }
                else {
                    result.startIndex = queryOffset;
                    result.size = rows.length;
                    result.result = rows;
                }
                callback(result);
                connection.release();
            });
        });
    };
    service.createQuery=createQuery;
        function createQuery(queryParts, sq) {
        var result = {};
        var multiquery = "";
        var multuvalues = [];
        var tableAlias = 't1';
        if (queryParts['alias'])tableAlias = queryParts['alias'];
        var s;
        if (sq) {
            s = squel.select()
                .from(sq, tableAlias);

        } else {
            s = squel.select()
                .from(queryParts.table, tableAlias);
        }
        _.each(queryParts['joins'], function (join) {
            if (join.joinedQuerParts) {

                var sq = createQuery(join.joinedQuerParts[0]);
                if (join.joinType == 'JOIN') s.join(sq, join.alias, join.joinExpression);
                if (join.joinType == 'INNER JOIN') s.join(sq, join.alias, join.joinExpression);
                if (join.joinType == 'OUTER JOIN') s.outer_join(sq, join.alias, join.joinExpression);
                if (join.joinType == 'LEFT OUTER JOIN') s.left_outer_join(sq, join.alias, join.joinExpression);
            } else {
                if (join.joinType == 'JOIN') s.join(join.schema + '.' + join.tableName, join.alias, join.joinExpression);
                if (join.joinType == 'INNER JOIN') s.join(join.schema + '.' + join.tableName, join.alias, join.joinExpression);
                if (join.joinType == 'OUTER JOIN') s.outer_join(join.schema + '.' + join.tableName, join.alias, join.joinExpression);
                if (join.joinType == 'LEFT OUTER JOIN') s.left_outer_join(join.schema + '.' + join.tableName, join.alias, join.joinExpression);
            }
        });


        if (queryParts.columns && queryParts.columns !== "*") {
            if (typeof queryParts.columns === "string") {
                // if (queryParts.columns.substring(0, 1) === "(")
                //     queryParts.columns = queryParts.columns.substring(1, -1);
                queryParts.columns = queryParts.columns.split(',');
            }
            var i = 0;
            _.each(queryParts.columns, function (columnName) {
                if (i === 0 && columnName.substring(0, 1) === "(")
                    s.field(columnName.split("(")[1]);
                else if (i === queryParts.columns.length - 1) {
                    var col = columnName;
                    var n = columnName.split(")").length - 1;
                    if (n === 1 && !_.contains(col, "("))
                        s.field(columnName.split(")")[0]);
                    else s.field(col);
                }
                else s.field(columnName);
                i++;
            });
        }
        if (queryParts.concatColumns && queryParts.concatColumns !== "*") {
            if (typeof queryParts.concatColumns === "string") {
                // if (queryParts.columns.substring(0, 1) === "(")
                //     queryParts.columns = queryParts.columns.substring(1, -1);
                queryParts.concatColumns = queryParts.concatColumns.split(';');
            }
            var i = 0;
            _.each(queryParts.concatColumns, function (columnName) {
                if (i === 0 && columnName.substring(0, 1) === "(")
                    s.field(columnName.split("(")[1]);
                else if (i === queryParts.concatColumns.length - 1) {
                    var col = columnName;
                    var n = columnName.split(")").length - 1;
                    if (n === 1 && !_.contains(col, "("))
                        s.field(columnName.split(")")[0]);
                    else s.field(col);
                }
                else s.field(columnName);
                i++;
            });
        }


        s.where.apply(this, queryParts['where']);
        _.each(queryParts['order'], function (param) {
            s.order(param.column, param.asc);
        });
        s.limit(queryParts['limit'] || queryLimit);
        s.offset(queryParts['offset'] || queryOffset);
        _.each(queryParts['group'], function (col) {
            s.group(col);
        });

        return s;
    };
    service.transformQueryPartsToSql=transformQueryPartsToSql;
        function transformQueryPartsToSql(queryParts) {
        var tableAlias = 't1';
        if (queryParts['alias'])tableAlias = queryParts['alias'];
        var s = squel.select()
            .from(queryParts['table'], tableAlias);

        _.each(queryParts['joins'], function (join) {
            s.join(join[0], join[1], join[2]);
        });

        _.each(queryParts['outerJoins'], function (join) {
            s.outer_join(join[0], join[1], join[2]);
        });

        _.each(queryParts['leftOuterJoins'], function (join) {
            s.left_outer_join(join[0], join[1], join[2]);
        });


        if (queryParts.columns && queryParts.columns !== "*") {
            if (typeof queryParts.columns === "string") {
                // if (queryParts.columns.substring(0, 1) === "(")
                //     queryParts.columns = queryParts.columns.substring(1, -1);
                queryParts.columns = queryParts.columns.split(',');
            }
            var i = 0;
            _.each(queryParts.columns, function (columnName) {
                if (i === 0 && columnName.substring(0, 1) === "(")
                    s.field(columnName.split("(")[1]);
                else if (i === queryParts.columns.length - 1) {
                    var col = columnName;
                    var n = columnName.split(")").length - 1;
                    if (n === 1 && !_.contains(col, "("))
                        s.field(columnName.split(")")[0]);
                    else s.field(col);
                }
                else s.field(columnName);
                i++;
            });
        }
        if (queryParts.concatColumns && queryParts.concatColumns !== "*") {
            if (typeof queryParts.concatColumns === "string") {
                // if (queryParts.columns.substring(0, 1) === "(")
                //     queryParts.columns = queryParts.columns.substring(1, -1);
                queryParts.concatColumns = queryParts.concatColumns.split(';');
            }
            var i = 0;
            _.each(queryParts.concatColumns, function (columnName) {
                if (i === 0 && columnName.substring(0, 1) === "(")
                    s.field(columnName.split("(")[1]);
                else if (i === queryParts.concatColumns.length - 1) {
                    var col = columnName;
                    var n = columnName.split(")").length - 1;
                    if (n === 1 && !_.contains(col, "("))
                        s.field(columnName.split(")")[0]);
                    else s.field(col);
                }
                else s.field(columnName);
                i++;
            });
        }


        s.where.apply(this, queryParts['where']);
        _.each(queryParts['order'], function (param) {
            s.order(param.column, param.asc);
        });
        s.limit(queryParts['limit'] || queryLimit);
        s.offset(queryParts['offset'] || queryOffset);
        _.each(queryParts['group'], function (col) {
            s.group(col);
        });


        var q = s.toParam();

        console.log(q.text.replace("\\", ""));
        console.log(q.values);

        var sql = q.text.replace("\\", "");
        var values = q.values;
        return {query: sql, sqlParams: values, offset: queryParts['offset'] || queryOffset}
    }
    service.transformReportQueryPartsToSql=transformReportQueryPartsToSql;
        function transformReportQueryPartsToSql(queryPartsArray) {
        var query = "";
        var sqlParams = [];
        _.each(queryPartsArray, function (queryParts) {
            if (queryParts !== undefined) {
                var s;
                if (queryParts.nestedParts !== undefined && queryParts.nestedParts.length > 0) {
                    s = createQuery(queryParts, createQuery(queryParts.nestedParts[0]));
                } else {
                    s = createQuery(queryParts);
                }
                var q = s.toParam();
                var sql = q.text.replace("\\", "");
                var values = q.values;
                if (query === "") {
                    query = sql;
                } else {
                    query = query + ";" + sql;
                }
                _.each(values, function (res) {
                    sqlParams.push(res);
                });
            }
        });
        return {query: query, sqlParams: sqlParams, offset: queryOffset}
    };
    service.queryServer_test = function (queryParts, callback) {
        var sql = transformQueryPartsToSql(queryParts);
        queryReportServer(sql, function (result) {
            callback(result);
        });
    };
    service.reportQueryServer = function reportQueryServer (queryPartsArray, callback) {
        var sql = transformReportQueryPartsToSql(queryPartsArray);
        queryReportServer(sql, function (result) {
            callback(result);
        });
    };
    return service;
}();
