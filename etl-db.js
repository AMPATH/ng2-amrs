/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var Promise = require('bluebird');
var mysql = require('mysql');
var squel = require('squel');
var _ = require('underscore');
var config = require('./conf/config');
var moment = require('moment');

var errorHandler = function (errorType, error) {
  var currentdate = new Date();
  var datetime =
    currentdate.getDate() +
    '/' +
    (currentdate.getMonth() + 1) +
    '/' +
    currentdate.getFullYear() +
    ' @ ' +
    currentdate.getHours() +
    ':' +
    currentdate.getMinutes() +
    ':' +
    currentdate.getSeconds();
  var errorDescription = errorType + ' occurred at ' + datetime;
};

module.exports = (function () {
  var pool = mysql.createPool(config.mysql);
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

  function _updateJoins(join, s, sq) {
    if (sq) {
      if (_.isUndefined(join.joinExpression) || join.joinExpression === '') {
        if (join.joinType == 'JOIN') s.join(sq, join.alias);
        if (join.joinType == 'INNER JOIN') s.join(sq, join.alias);
        if (join.joinType == 'OUTER JOIN') s.outer_join(sq, join.alias);
        if (join.joinType == 'LEFT OUTER JOIN')
          s.left_outer_join(sq, join.alias);
      } else {
        if (join.joinType == 'JOIN')
          s.join(sq, join.alias, join.joinExpression);
        if (join.joinType == 'INNER JOIN')
          s.join(sq, join.alias, join.joinExpression);
        if (join.joinType == 'OUTER JOIN')
          s.outer_join(sq, join.alias, join.joinExpression);
        if (join.joinType == 'LEFT OUTER JOIN')
          s.left_outer_join(sq, join.alias, join.joinExpression);
      }
    } else {
      if (_.isUndefined(join.joinExpression) || join.joinExpression === '') {
        if (join.joinType == 'JOIN')
          s.join(join.schema + '.' + join.tableName, join.alias);
        if (join.joinType == 'INNER JOIN')
          s.join(join.schema + '.' + join.tableName, join.alias);
        if (join.joinType == 'OUTER JOIN')
          s.outer_join(join.schema + '.' + join.tableName, join.alias);
        if (join.joinType == 'LEFT OUTER JOIN')
          s.left_outer_join(join.schema + '.' + join.tableName, join.alias);
      } else {
        if (join.joinType == 'JOIN')
          s.join(
            join.schema + '.' + join.tableName,
            join.alias,
            join.joinExpression
          );
        if (join.joinType == 'INNER JOIN')
          s.join(
            join.schema + '.' + join.tableName,
            join.alias,
            join.joinExpression
          );
        if (join.joinType == 'OUTER JOIN')
          s.outer_join(
            join.schema + '.' + join.tableName,
            join.alias,
            join.joinExpression
          );
        if (join.joinType == 'LEFT OUTER JOIN')
          s.left_outer_join(
            join.schema + '.' + join.tableName,
            join.alias,
            join.joinExpression
          );
      }
    }
  }

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
          result.errorMessage = 'Error querying server';
          result.error = err;
          result.sql = sql.query;
          result.sqlParams = sql.sqlParams;
        } else {
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

  function queryServer(queryParts, callback) {
    var result = {};
    var sql = queryParts.sql;
    var values = queryParts.values;

    getServerConnection(function (err, connection) {
      if (err) {
        errorHandler('queryServer: Database connection error', err);
        return;
      }

      connection.query(sql, values, function (err, rows, fields) {
        if (err) {
          errorHandler('queryServer: Error querying server', err);
          result.errorMessage = 'Error querying server';
          result.error = err;
        } else {
          result.startIndex = queryOffset;
          result.size = rows.length;
          result.result = rows;
        }
        callback(result);
        connection.release();
      });
    });
  }

  function createQuery(queryParts, sq) {
    var result = {};
    var multiquery = '';
    var multuvalues = [];
    var tableAlias = 't1';
    if (queryParts['alias']) tableAlias = queryParts['alias'];
    if (queryParts['indexExpression'])
      tableAlias += ' ' + queryParts['indexExpression'];
    var s;
    if (sq) {
      s = squel.select().from(sq, tableAlias);
    } else {
      s = squel.select();
      if (queryParts['indexExpression'])
        s = squel.select({ autoQuoteAliasNames: false });
      s.from(queryParts.table, tableAlias);
    }
    _.each(queryParts['joins'], function (join) {
      if (join.joinedQuerParts) {
        var joinedParts = join.joinedQuerParts;
        var sq = '';
        if (
          joinedParts.nestedParts !== undefined &&
          joinedParts.nestedParts !== ''
        ) {
          // This is for cases where joined reports has some a sub query
          sq = createQuery(joinedParts, createQuery(joinedParts.nestedParts));
        } else {
          sq = createQuery(joinedParts);
        }
        _updateJoins(join, s, sq);
      } else {
        _updateJoins(join, s);
      }
    });

    if (queryParts.columns && queryParts.columns !== '*') {
      if (typeof queryParts.columns === 'string') {
        // if (queryParts.columns.substring(0, 1) === "(")
        //     queryParts.columns = queryParts.columns.substring(1, -1);
        queryParts.columns = queryParts.columns.split(',');
      }
      var i = 0;
      _.each(queryParts.columns, function (columnName) {
        if (i === 0 && columnName.substring(0, 1) === '(')
          s.field(columnName.split('(')[1]);
        else if (i === queryParts.columns.length - 1) {
          var col = columnName;
          var n = columnName.split(')').length - 1;
          if (n === 1 && !_.contains(col, '('))
            s.field(columnName.split(')')[0]);
          else s.field(col);
        } else s.field(columnName);
        i++;
      });
    }
    if (queryParts.concatColumns && queryParts.concatColumns !== '*') {
      if (typeof queryParts.concatColumns === 'string') {
        // if (queryParts.columns.substring(0, 1) === "(")
        //     queryParts.columns = queryParts.columns.substring(1, -1);
        queryParts.concatColumns = queryParts.concatColumns.split(';');
      }
      var i = 0;
      _.each(queryParts.concatColumns, function (columnName) {
        if (i === 0 && columnName.substring(0, 1) === '(')
          s.field(columnName.split('(')[1]);
        else if (i === queryParts.concatColumns.length - 1) {
          var col = columnName;
          var n = columnName.split(')').length - 1;
          if (n === 1 && !_.contains(col, '('))
            s.field(columnName.split(')')[0]);
          else s.field(col);
        } else s.field(columnName);
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

    if (queryParts['having'][0] !== '') s.having(queryParts['having'][0]);

    return s;
  }

  function transformQueryPartsToSql(queryParts) {
    var tableAlias = 't1';
    if (queryParts['alias']) tableAlias = queryParts['alias'];
    var s = squel.select().from(queryParts['table'], tableAlias);

    _.each(queryParts['joins'], function (join) {
      s.join(join[0], join[1], join[2]);
    });

    _.each(queryParts['outerJoins'], function (join) {
      s.outer_join(join[0], join[1], join[2]);
    });

    _.each(queryParts['leftOuterJoins'], function (join) {
      s.left_outer_join(join[0], join[1], join[2]);
    });

    if (queryParts.columns && queryParts.columns !== '*') {
      if (typeof queryParts.columns === 'string') {
        // if (queryParts.columns.substring(0, 1) === "(")
        //     queryParts.columns = queryParts.columns.substring(1, -1);
        queryParts.columns = queryParts.columns.split(',');
      }
      var i = 0;
      _.each(queryParts.columns, function (columnName) {
        if (i === 0 && columnName.substring(0, 1) === '(')
          s.field(columnName.split('(')[1]);
        else if (i === queryParts.columns.length - 1) {
          var col = columnName;
          var n = columnName.split(')').length - 1;
          if (n === 1 && !_.contains(col, '('))
            s.field(columnName.split(')')[0]);
          else s.field(col);
        } else s.field(columnName);
        i++;
      });
    }
    if (queryParts.concatColumns && queryParts.concatColumns !== '*') {
      if (typeof queryParts.concatColumns === 'string') {
        // if (queryParts.columns.substring(0, 1) === "(")
        //     queryParts.columns = queryParts.columns.substring(1, -1);
        queryParts.concatColumns = queryParts.concatColumns.split(';');
      }
      var i = 0;
      _.each(queryParts.concatColumns, function (columnName) {
        if (i === 0 && columnName.substring(0, 1) === '(')
          s.field(columnName.split('(')[1]);
        else if (i === queryParts.concatColumns.length - 1) {
          var col = columnName;
          var n = columnName.split(')').length - 1;
          if (n === 1 && !_.contains(col, '('))
            s.field(columnName.split(')')[0]);
          else s.field(col);
        } else s.field(columnName);
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

    console.log(q.text.replace('\\', ''));
    console.log(q.values);

    var sql = q.text.replace('\\', '');
    var values = q.values;
    return {
      query: sql,
      sqlParams: values,
      offset: queryParts['offset'] || queryOffset
    };
  }

  function transformReportQueryPartsToSql(queryPartsArray) {
    var query = '';
    var sqlParams = [];
    var s;
    //The queryPartsArray may never have more than one element and
    // that is why we just need to get the sql
    _.each(queryPartsArray, function (queryParts) {
      if (queryParts !== undefined) {
        if (
          queryParts.nestedParts !== undefined &&
          queryParts.nestedParts !== ''
        ) {
          // This is done so that we can always pick up sub queries
          s = createQuery(queryParts, createQuery(queryParts.nestedParts));
        } else {
          s = createQuery(queryParts);
        }
        var q = s.toParam();
        var sql = q.text.replace('\\', '');
        var values = q.values;
        query = sql;
        _.each(values, function (res) {
          sqlParams.push(res);
        });
      }
    });

    return {
      query: query,
      sqlParams: sqlParams,
      offset: queryPartsArray[0]['offset'] || queryOffset
    };
  }

  function reportQueryServer(queryPartsArray, callback) {
    var sql = transformReportQueryPartsToSql(queryPartsArray);
    queryReportServer(sql, function (result) {
      callback(result);
    });
  }

  function queryServer_test(queryParts, callback) {
    var sql = transformQueryPartsToSql(queryParts);
    queryReportServer(sql, function (result) {
      callback(result);
    });
  }

  function queryServer_testToPromisify(queryParts, callback) {
    var sql = transformQueryPartsToSql(queryParts);
    queryReportServer(sql, function (result) {
      callback(null, result);
    });
  }
  function saveRecord(table, fields) {
    return new Promise(function (resolve, reject) {
      try {
        var query = squel.insert().into(table).setFieldsRows(fields).toParam();

        saveQueryServer(query, function (response) {
          resolve(response);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  function insertQueryServer(queryParts, callback) {
    var column1 = queryParts.columns[0];
    var column2 = queryParts.columns[1];
    var column3 = queryParts.columns[2];
    var value1 = queryParts.values[0];
    var s = squel
      .insert()
      .into(queryParts['table'])
      .setFieldsRows([
        {
          person_uuid: value1,
          date_updated: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
          date_created: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
        }
      ])
      .toParam();
    saveQueryServer(s, function (response) {
      callback(response);
    });
  }
  function updateQueryServer(queryParts, callback) {
    var value1 = queryParts.values[0];
    var value2 = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
    var s = squel
      .update()
      .table(queryParts['table'])
      .set('date_updated', value2)
      .where('person_uuid=?', value1)
      .toParam();
    saveQueryServer(s, function (response) {
      callback(response);
    });
  }
  function saveQueryServer(sql, callback) {
    var result = {};
    getServerConnection(function (err, connection) {
      if (err) {
        errorHandler('ExecuteMultiReport: Database connection error', err);
        return;
      }
      connection.query(sql.text, sql.values, function (err, rows, fields) {
        if (err) {
          errorHandler('Error querying server', err);
          result.errorMessage = 'Error querying server';
          result.error = err;
          result.sql = sql.text;
          result.sqlParams = sql.values;
        } else {
          result.size = rows.length;
          result.sql = sql.text;
          result.sqlParams = sql.values;
        }
        callback(result);
        connection.release();
      });
    });
  }
  return {
    queryReportServer: queryReportServer,
    queryServer: queryServer,
    createQuery: createQuery,
    transformQueryPartsToSql: transformQueryPartsToSql,
    transformReportQueryPartsToSql: transformReportQueryPartsToSql,
    reportQueryServer: reportQueryServer,
    queryServer_test: queryServer_test,
    queryDb: Promise.promisify(queryServer_testToPromisify),
    insertQueryServer: insertQueryServer,
    saveRecord: saveRecord,
    saveQueryServer: saveQueryServer,
    updateQueryServer: updateQueryServer
  };
})();
