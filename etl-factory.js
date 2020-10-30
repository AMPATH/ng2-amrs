'use strict';
var _ = require('underscore');
var s = require('underscore.string');
var walk = require('walk');
var helpers = require('./etl-helpers');
var indicatorHandlersDefinition = require('./etl-processors.js');
var indicatorProcessor = require('./service/indicator-processor/indicator-processor.service');
//Report Indicators Json Schema Path
var indicatorsSchemaDefinition = require('./reports/indicators.json');
var patientLevelIndicatorsSchema = require('./reports/patient-level.indicators.json');
var patientLabOrderProperties = require('./patient-lab-orders.json');
var reportList = [];
//iterate the report folder picking  files satisfying  regex *report.json
reportList.push.apply(reportList, require('./reports/hiv-summary-report.json'));
// MOH-731 Legacy
reportList.push.apply(
  reportList,
  require('./reports/moh-731-legacy/moh-731-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/moh-731-legacy/moh-731-cohort-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/moh-731-legacy/moh-731-indicator-report.json')
);

// MOH-731 2017
reportList.push.apply(
  reportList,
  require('./reports/moh-731-2017/moh-731-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/moh-731-2017/moh-731-cohort-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/moh-731-2017/moh-731-indicator-report.json')
);

reportList.push.apply(
  reportList,
  require('./reports/patient-register-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/clinic-calander-report-v2.json')
);
reportList.push.apply(
  reportList,
  require('./reports/daily-visits-appointment.report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/clinical-reminder-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/dataentry-statistics.json')
);
reportList.push.apply(
  reportList,
  require('./reports/clinical-overview-visualization-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/hiv-summary-monthly-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/patient-flow-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/clinic-comparator-report.json')
);
reportList.push.apply(reportList, require('./reports/labs-report.json'));
reportList.push.apply(
  reportList,
  require('./reports/viral-load-monitoring-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/medical-history-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/clinic-lab-orders-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/patient-status-change-tracker-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/datasets/pep-dataset-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/patient-monthly-care-status.json')
);
reportList.push.apply(
  reportList,
  require('./reports/patient-daily-care-status.json')
);
reportList.push.apply(reportList, require('./reports/cohort-report.json'));
reportList.push.apply(
  reportList,
  require('./reports/patient-care-cascade-report.json')
);
reportList.push.apply(
  reportList,
  require('./reports/patient-referral-report.json')
);
//etl-factory builds and generates queries dynamically in a generic way using indicator-schema and report-schema json files
module.exports = (function () {
  var reports = [];
  var indicatorsSchema = [];
  var indicatorHandlers;
  initialize(
    reportList,
    indicatorsSchemaDefinition,
    indicatorHandlersDefinition,
    patientLevelIndicatorsSchema
  );
  return {
    buildPatientListExpression: buildPatientListExpression,
    buildIndicatorsSchema: buildIndicatorsSchema,
    buildIndicatorsSchemaWithSections: buildIndicatorsSchemaWithSections,
    singleReportToSql: singleReportToSql,
    resolveIndicators: resolveIndicators,
    buildPatientListReportExpression: buildPatientListReportExpression,
    buildETLPatientLabOrdersExpression: buildETLPatientLabOrdersExpression,
    indicatorsSchema: indicatorsSchema,
    reports: reports
  };

  function initialize(
    _reports,
    _indicatorsSchema,
    _indicatorHandlers,
    _patientLevelIndicatorsSchema
  ) {
    reports = _reports;
    indicatorsSchema = [];
    indicatorsSchema.push.apply(indicatorsSchema, _indicatorsSchema);
    indicatorsSchema.push.apply(
      indicatorsSchema,
      _patientLevelIndicatorsSchema
    );
    indicatorHandlers = _indicatorHandlers;
    // disaggregation fixed indicators
    indicatorProcessor.disaggregateFixedIndicators(reports, indicatorsSchema);
    // remove duplicates
    indicatorsSchema = _.uniq(indicatorsSchema, 'name');
  }
  function getExpression() {
    var expression = s.replaceAll(
      filterOption.expression,
      filterOption.options
    );
    _.each(report.disintegrationFilterOptions, function (filterOption) {});
  }

  function resolveIndicators(reportName, result, requestIndicators) {
    _.each(reports, function (report) {
      if (report.name === reportName) {
        _.each(report.indicatorHandlers, function (handler) {
          indicatorHandlers[handler.processor](
            handler.indicators,
            result,
            requestIndicators
          );
        });
      }
    });
    return result;
  }

  function buildPatientListExpression(queryParams, successCallback) {
    //Check for undefined params
    if (queryParams === null || queryParams === undefined) return '';
    //Initialize returned obj
    var result = {
      whereClause: '',
      resource: ''
    };
    var whereClause = '';
    //create WhereClause
    _.each(indicatorsSchema, function (indicator) {
      _.each(queryParams.reportIndicator.split(','), function (indicatorName) {
        if (indicator.name === indicatorName) {
          if (indicator.expression !== '') {
            var indicatorExpression = indicatorProcessor.replaceIndicatorParam(
              indicator.expression,
              queryParams
            );
            whereClause += '(' + indicatorExpression + ') or ';
          }
        }
      });
    });
    var lastIndex = whereClause.lastIndexOf(' or ');
    whereClause = whereClause.substring(0, lastIndex);
    if (whereClause !== '') result.whereClause = ' and ' + whereClause;
    //identify resource/table
    _.each(reports, function (report) {
      if (report.name === queryParams.reportName) {
        result.resource =
          report.table['schema'] + '.' + report.table['tableName'];
      }
    });
    successCallback(result);
  }

  function buildIndicatorsSchema(queryParams, successCallback) {
    //Check for undefined params
    if (queryParams === null || queryParams === undefined) return '';
    var result = [];
    //Load json schema into the query builder
    _.each(reports, function (report) {
      if (report.name === queryParams.reportName) {
        _.each(report.indicators, function (reportIndicator) {
          _.each(indicatorsSchema, function (indicator) {
            if (indicator.name === reportIndicator.expression) {
              result.push(indicator);
            }
          });
        });
      }
    });
    successCallback(result);
  }

  /**
     Returns the report json schema,resolved from  request parameter reportName
     **/
  function buildIndicatorsSchemaWithSections(queryParams, successCallback) {
    //Check for undefined params
    var allReportSections;
    if (queryParams === null || queryParams === undefined) return '';
    var result = [];
    //Load json schema into the query builder
    _.each(reports, function (report) {
      if (report.name === queryParams.reportName) {
        allReportSections = report.sections;
        _.each(report.indicators, function (reportIndicator) {
          _.each(indicatorsSchema, function (indicator) {
            if (indicator.name === reportIndicator.expression) {
              //add section infor
              try {
                if (reportIndicator.section !== undefined) {
                  var res = {
                    section_key: reportIndicator.section,
                    indicator_key: indicator
                  };
                } else {
                  var res = {
                    section_key: '',
                    indicator_key: indicator
                  };
                }
                result.push(res);
              } catch (e) {
                result.push(indicator);
              }
            }
          });
        });
      }
    });
    successCallback([result, allReportSections]);
  }

  function _buildQueryParts(requestParams, reportName, queryPartsArray) {
    if (reportName) {
      reportName = reportName;
    } else {
      reportName = requestParams.reportName;
    }

    var queryParts;
    _.each(reports, function (report) {
      if (report.name === reportName) {
        var nestedParts = '';
        var tableName = '';
        if (
          report.table.dynamicDataset &&
          report.table.dynamicDataset !== reportName
        ) {
          _buildQueryParts(
            requestParams,
            report.table.dynamicDataset,
            queryPartsArray
          );
          //get the last item of the array
          var n = queryPartsArray.length;
          nestedParts = queryPartsArray[n - 1];
          //remove the object from the array
          queryPartsArray.splice(n - 1, 1);
        } else {
          nestedParts = undefined;
        }

        if (report.table['tableName'] === '@tableName') {
          tableName = requestParams.tableName;
        } else {
          tableName = report.table['tableName'];
        }
        var queryParts = {
          columns: indicatorsToColumns(
            report,
            requestParams.countBy,
            requestParams
          ),
          concatColumns: concatColumnsToColumns(report),
          table: report.table['schema'] + '.' + tableName,
          alias: report.table['alias'],
          indexExpression: report.table['indexExpression'] || null,
          nestedParts: nestedParts,
          joins: joinsToSql(report.joins, requestParams),
          where: filtersToSql(
            requestParams.whereParams,
            report.parameters,
            report.filters
          ),
          group: groupClauseToSql(
            report.groupClause,
            requestParams.groupBy,
            report.parameters
          ),
          having: filtersToSql(
            requestParams.whereParams,
            report.parameters,
            report.having
          ),
          order: orderByToSql(report),
          offset: requestParams.offset,
          limit: requestParams.limit
        };
        queryPartsArray.push(queryParts);
      }
    });
  }

  function singleReportToSql(requestParams, reportName) {
    if (requestParams === null || requestParams === undefined) return '';
    var queryPartsArray = [];
    _buildQueryParts(requestParams, reportName, queryPartsArray);
    return queryPartsArray;
  }

  function orderByToSql(report) {
    var order = [];
    if (!report.orderBy) return null;
    _.each(report.orderBy, function (orderBy) {
      order.push({
        column: orderBy.column,
        asc: orderBy.order.toLowerCase() === 'asc'
      });
    });
    return order;
  }

  //converts a set of indicators into sql columns
  function indicatorsToColumns(report, countBy, requestParam) {
    // console.log('request parameters', requestParam);
    var result = [];
    //converts a set of supplementColumns  into sql columns
    _.each(supplementColumnsToColumns(report), function (column) {
      result.push(column);
    });
    //converts set of indicators to sql columns
    _.each(report.indicators, function (singleIndicator) {
      _.each(indicatorsSchema, function (indicator) {
        if (requestParam.requestIndicators) {
          //compare request params indicator list corresponds to the singleIndicator
          _.each(requestParam.requestIndicators.split(','), function (
            requestIndicatorName
          ) {
            if (indicator.name === requestIndicatorName) {
              if (indicator.name === singleIndicator.expression) {
                //Determine indicator type, whether it is derived or an independent indicator
                if (singleIndicator.sql.match(/\[(.*?)\]/)) {
                  result.push(
                    processesDerivedIndicator(
                      report,
                      singleIndicator,
                      indicator,
                      requestParam
                    )
                  );
                } else {
                  var column =
                    singleIndicator.sql + ' as ' + singleIndicator.label;
                  //check if indicator expression has endDate and startDate parameters
                  var indicatorExpression = indicatorProcessor.replaceIndicatorParam(
                    indicator.expression,
                    requestParam
                  );
                  column = column.replace('$expression', indicatorExpression);
                  result.push(column);
                }
              }
            }
          });
        } else {
          if (indicator.name === singleIndicator.expression) {
            //Determine indicator type, whether it is derived or an independent indicator
            if (singleIndicator.sql.match(/\[(.*?)\]/)) {
              result.push(
                processesDerivedIndicator(
                  report,
                  singleIndicator,
                  indicator,
                  requestParam
                )
              );
            } else {
              var column = singleIndicator.sql + ' as ' + indicator.name;
              //check if indicator expression has endDate and startDate parameters
              var indicatorExpression = indicatorProcessor.replaceIndicatorParam(
                indicator.expression,
                requestParam
              );
              column = column.replace('$expression', indicatorExpression);
              result.push(column);
            }
          }
        }
      });
    });
    // add dynamically derived indicators
    var dynamicIndicators = indicatorProcessor.disaggregateDynamicIndicators(
      report,
      indicatorsSchema,
      requestParam
    );
    result.push.apply(result, dynamicIndicators);
    return result;
  }

  //converts set of derived indicators to sql columns
  function processesDerivedIndicator(
    report,
    derIndicator,
    indicator,
    requestParam
  ) {
    var reg = /[\[\]']/g; //regex [] indicator
    var matches = [];
    var derivedIndicator = _.assign({}, derIndicator);
    derivedIndicator.sql.replace(/\[(.*?)\]/g, function (g0, g1) {
      matches.push(g1);
    });
    derivedIndicator.sql = derivedIndicator.sql.replace(reg, '');
    _.each(matches, function (indicatorKey) {
      _.each(report.indicators, function (singleIndicator) {
        if (indicatorKey === singleIndicator.expression) {
          _.each(indicatorsSchema, function (indicator) {
            if (indicator.name === indicatorKey) {
              var column = singleIndicator.sql;
              // console.log('Derived Indicator request param', requestParam);
              var indicatorExpression = indicatorProcessor.replaceIndicatorParam(
                indicator.expression,
                requestParam
              );
              column = column.replace('$expression', indicatorExpression);
              derivedIndicator.sql = derivedIndicator.sql.replace(
                indicatorKey,
                column
              );
            }
          });
        }
      });
    });
    // console.log('track derived indicator', derivedIndicator.sql);
    return derivedIndicator.sql + ' as ' + indicator.name;
  }

  //converts a set of supplement columns of type single into sql columns
  function supplementColumnsToColumns(report) {
    var result = [];
    _.each(report.supplementColumns, function (supplementColumn) {
      if (supplementColumn.type === 'single') {
        var column = supplementColumn.sql + ' as ' + supplementColumn.label;
        result.push(column);
      } else if (supplementColumn.type === 'all') {
        var column = supplementColumn.sql;
        result.push(column);
      }
    });
    return result;
  }

  //converts a set of supplement columns of type multiple into sql columns
  function concatColumnsToColumns(report) {
    var result = '';
    _.each(report.supplementColumns, function (supplementColumn) {
      if (supplementColumn.type === 'multiple') {
        var column = supplementColumn.sql + ' as ' + supplementColumn.label;
        result += column;
        result += ', ';
      }
    });
    var lastIndex = result.lastIndexOf(',');
    result = result.substring(0, lastIndex);
    return result;
  }

  //converts an array of tables into sql
  function joinsToSql(joins, requestParams) {
    var result = [];
    _.each(joins, function (join) {
      if (join.tableName) {
        var r = [
          join['schema'] + '.' + join['tableName'],
          join['alias'],
          join['joinExpression'],
          join['joinType']
        ];
        var joinOject = {
          schema: join.schema,
          tableName: join.tableName,
          alias: join.alias,
          joinExpression: join.joinExpression,
          joinType: join.joinType
        };
        result.push(joinOject);
      } else {
        var queryParts = singleReportToSql(requestParams, join.dynamicDataset);
        // console.log('show the query parts here:', queryParts.length);
        var joinOject = {
          schema: join.schema,
          tableName: join.tableName,
          alias: join.alias,
          joinExpression: join.joinExpression,
          joinType: join.joinType,
          joinedQuerParts: queryParts[0]
        };
        // console.log('testing dynamicDataset', joinOject);
        result.push(joinOject);
        //var r = [join['schema'] + '.' + join['tableName'], join['alias'], join['joinExpression'], join['joinType']];
      }
    });
    return result;
  }

  //converts an array of group clause into squel consumable
  function groupClauseToSql(groupClauses, groupBy, reportParams) {
    var result = [];
    _.each(groupBy.split(','), function (by) {
      _.each(groupClauses, function (groupClause) {
        if (groupClause['parameter'] === by || groupClause['processForce']) {
          _.each(reportParams, function (reportParam) {
            if (reportParam['name'] === groupClause['parameter']) {
              _.each(reportParam['defaultValue'], function (value) {
                result.push(value['expression']);
              });
            }
          });
        }
      });
    });
    return result;
  }

  function _getMatchingWhereExpression(whereParams, reportFilter) {
    var matchingWhereExpression = _.find(whereParams, function (whereParam) {
      if (
        (whereParam['name'] === reportFilter['parameter'] &&
          whereParam['value']) ||
        reportFilter['processForce'] === true
      ) {
        return whereParam;
      }
    });
    return matchingWhereExpression;
  }

  //converts an array of filters into sql
  function filtersToSql(whereParams, reportParams, reportFilters) {
    var result = [];
    var expression = '';
    var parameters = [];
    // console.log('Report/Json Params', reportParams);
    // console.log('Report/Filters', reportFilters);
    // console.log('Web/Client Params', whereParams);
    _.each(reportFilters, function (reportFilter) {
      // console.log('final report--->', reportFilter);
      //search in the web/Client params to see if there is a matching Param
      //Process an array of Parameters in the report filters
      var reportFilterParam = reportFilter['parameter'];
      var reportFilterParamArray = [];
      if (s.include(reportFilterParam, ',')) {
        reportFilterParamArray = reportFilterParam.split(',');
      }
      var matchingWhereExpression;

      if (reportFilterParamArray.length > 1) {
        for (var i in reportFilterParamArray) {
          var dummyReportFilter = {
            parameter: reportFilterParamArray[i],
            processForce: reportFilter['processForce']
          };
          matchingWhereExpression = _getMatchingWhereExpression(
            whereParams,
            dummyReportFilter
          );
          if (!_.isUndefined(matchingWhereExpression) && i === '0') {
            expression += reportFilter['expression'];
            expression += ' and ';
          }
          if (!_.isUndefined(matchingWhereExpression)) {
            var matchingReportParam = _.find(reportParams, function (
              reportParam
            ) {
              if (reportParam['name'] === matchingWhereExpression['name'])
                return reportParam;
            });

            if (
              !_.isUndefined(matchingReportParam) &&
              reportFilter['processForce'] !== true
            ) {
              parameters.push(matchingWhereExpression['value']);
            }
          }
        }
      } else {
        matchingWhereExpression = _getMatchingWhereExpression(
          whereParams,
          reportFilter
        );
        if (!_.isUndefined(matchingWhereExpression)) {
          expression += reportFilter['expression'];
          expression += ' and ';

          var matchingReportParam = _.find(reportParams, function (
            reportParam
          ) {
            if (reportParam['name'] === matchingWhereExpression['name'])
              return reportParam;
          });
          // console.log('final params-report', matchingReportParam);
          // console.log('final params-where', matchingWhereExpression);
          if (
            !_.isUndefined(matchingReportParam) &&
            reportFilter['processForce'] !== true
          ) {
            parameters.push(matchingWhereExpression['value']);
          }
        }
      }
    });
    var lastIndex = expression.lastIndexOf('and');
    expression = expression.substring(0, lastIndex);
    result.push(expression);
    // console.log('final results', result);
    // console.log('final paras', parameters);
    result.push.apply(result, parameters);

    return result;
  }

  //converts a set of indicators into sql columns
  function indicatorsToFilter(report, requestParam) {
    // console.log('request parameters', requestParam);
    var result = '';
    //converts set of indicators to sql columns
    _.each(report.indicators, function (singleIndicator) {
      _.each(indicatorsSchema, function (indicator) {
        if (requestParam.requestIndicators) {
          //compare request params indicator list corresponds to the singleIndicator
          _.each(requestParam.requestIndicators.split(','), function (
            requestIndicatorName
          ) {
            if (indicator.name === requestIndicatorName) {
              if (indicator.name === singleIndicator.expression) {
                //Determine indicator type, whether it is derived or an independent indicator
                if (singleIndicator.sql.match(/\[(.*?)\]/)) {
                  //result.push(processesDerivedIndicator(report, singleIndicator, indicator));
                } else {
                  //check if indicator expression has endDate and startDate parameters
                  var indicatorExpression = indicatorProcessor.replaceIndicatorParam(
                    indicator.expression,
                    requestParam
                  );
                  result += '(' + indicatorExpression + ') or ';
                }
              }
            }
          });
        }
      });
    });
    var lastIndex = result.lastIndexOf(' or ');
    result = result.substring(0, lastIndex);
    return result;
  }

  function reportWhereClauseToFilter(queryParams, reportName) {
    var reportParams = queryParams;
    //
    var whereClause = '';
    var table = '';
    _.each(reports, function (report) {
      if (report.name === reportName) {
        // reportParams.reportName = reportName;
        var reportWhereClause = filtersToSql(
          reportParams.whereParams,
          report.parameters,
          report.filters
        );
        if (report.table.schema !== '' && report.table.table !== '') {
          table = report.table['schema'] + '.' + report.table['tableName'];
        }
        var indicatorWhereClause = indicatorsToFilter(report, reportParams);
        if (reportWhereClause[0]) {
          reportWhereClause[0] =
            reportWhereClause[0] + ' and ' + indicatorWhereClause;
        } else {
          reportWhereClause[0] = indicatorWhereClause;
        }
        if (indicatorWhereClause) whereClause = reportWhereClause;
      }
    });

    return {
      whereClause: whereClause,
      table: table
    };
  }

  function dynamicDataSetToFilter(queryParams, reportName) {
    var query = '';
    var param = [];
    if (reportName !== undefined) {
      var resource = reportWhereClauseToFilter(queryParams, reportName);
      var filter = resource.whereClause;
      if (filter) {
        query += filter[0] + ' and ';
        filter.shift();
        param.push.apply(param, filter);
      }
      var lastIndex = query.lastIndexOf(' and ');
      query = query.substring(0, lastIndex);
    }
    return {
      query: query,
      params: param
    };
  }

  function getAllDatasets(reportName, allReports) {
    _.each(reports, function (report) {
      if (report.name === reportName) {
        _.each(report.joins, function (join) {
          if (join.dynamicDataset) {
            allReports.push(join.dynamicDataset);
            getAllDatasets(join.dynamicDataset, allReports);
          }
        });
        if (report.table.dynamicDataset) {
          allReports.push(report.table.dynamicDataset);
          getAllDatasets(report.table.dynamicDataset, allReports);
        }
      }
    });
    return allReports;
  }

  function buildQueryAndParams(reportName, queryParams) {
    var query = '';
    var param = [];
    _.each(reports, function (report) {
      if (report.name === reportName) {
        var filter = dynamicDataSetToFilter(queryParams, report.name);
        if (filter.query !== '') {
          query += filter.query + ' and ';
          param.push.apply(param, filter.params);
        }
        _.each(report.joins, function (join) {
          if (join.dynamicDataset) {
            var filter = buildQueryAndParams(join.dynamicDataset, queryParams);
            if (filter.query !== '') {
              query += filter.query + ' and ';
              param.push.apply(param, filter.params);
            }
          }
        });
        if (report.table.dynamicDataset) {
          var filter = buildQueryAndParams(
            report.table.dynamicDataset,
            queryParams,
            query,
            param
          );
          if (filter.query !== '') {
            query += filter.query + ' and ';
            param.push.apply(param, filter.params);
          }
        }
      }
    });

    var lastIndex = query.lastIndexOf(' and ');
    query = query.substring(0, lastIndex);
    return {
      query: query,
      params: param
    };
  }

  function generateCohortFilters(queryParams, reportName) {
    var query = '';
    var param = [];
    if (reportName !== undefined) {
      _.each(reports, function (report) {
        if (report.name === reportName) {
          var reportWhereClause = filtersToSql(
            queryParams.whereParams,
            report.parameters,
            report.filters
          );
          if (reportWhereClause) {
            query += reportWhereClause[0];
            reportWhereClause.shift();
            param.push.apply(param, reportWhereClause);
          }
        }
      });
    }
    return {
      query: query,
      params: param
    };
  }

  function breakDownDerivedIndicator(ri) {
    var matches = [];
    var reportIndicator = _.assign({}, ri);
    reportIndicator.sql.replace(/\[(.*?)\]/g, function (g0, g1) {
      matches.push(g1);
    });
    return matches;
  }

  function generatePatientListFilter(queryParams) {
    var query = '';
    var param = [];
    var dataSets = getAllDatasets(queryParams.reportName, [
      queryParams.reportName
    ]);
    _.each(dataSets, function (dataSet) {
      _.each(reports, function (report) {
        if (report.name === dataSet) {
          _.each(report.indicators, function (singleIndicator) {
            _.each(indicatorsSchema, function (indicator) {
              if (queryParams.requestIndicators) {
                //compare request params indicator list corresponds to the singleIndicator
                _.each(queryParams.requestIndicators.split(','), function (
                  requestIndicatorName
                ) {
                  if (indicator.name === requestIndicatorName) {
                    if (indicator.name === singleIndicator.expression) {
                      // handle derived indicators
                      var numeratorDenominator = breakDownDerivedIndicator(
                        singleIndicator
                      );
                      if (numeratorDenominator.length > 0) {
                        queryParams.requestIndicators = queryParams.requestIndicators
                          .split(singleIndicator.expression)
                          .join(numeratorDenominator[0]);
                      }
                      var filter = dynamicDataSetToFilter(
                        queryParams,
                        report.name
                      );
                      if (filter.query !== '') {
                        query += filter.query + ' and ';
                        param.push.apply(param, filter.params);
                        // generateCohortFilters
                        if (report.table.dynamicDataset) {
                          var cohortFilter = generateCohortFilters(
                            queryParams,
                            report.table.dynamicDataset
                          );
                          if (cohortFilter.query !== '') {
                            query += cohortFilter.query + ' and ';
                            param.push.apply(param, cohortFilter.params);
                          }
                        }
                      }
                    }
                  }
                });
              }
            });
          });
        }
      });
    });
    var lastIndex = query.lastIndexOf(' and ');
    query = query.substring(0, lastIndex);
    return {
      query: query,
      params: param
    };
  }

  function getReportDataSet(queryParams) {
    var reportName = queryParams.reportName;
    var extraPatientListColumns = [
      'case when (timestampdiff(day,t1.vl_order_date,now()) between 0 and 14) and (t1.vl_1_date is null or t1.vl_order_date > t1.vl_1_date) then true else false end as has_pending_vl_test',
      'date_format(t1.enrollment_date,"%d-%m-%Y") as enrollment_date',
      'date_format(t1.hiv_start_date,"%d-%m-%Y") as hiv_start_date',
      't1.arv_start_location',
      'date_format(t1.arv_first_regimen_start_date,"%d-%m-%Y") as arv_first_regimen_start_date',
      'date_format(t1.arv_start_date,"%d-%m-%Y") as cur_regimen_arv_start_date',
      't1.cur_arv_line',
      't1.cur_arv_meds',
      't1.arv_first_regimen',
      't1.vl_1',
      'date_format(t1.vl_1_date,"%d-%m-%Y") as vl_1_date',
      'date_format(t1.rtc_date,"%d-%m-%Y") as rtc_date',
      'date_format(t1.tb_prophylaxis_start_date,"%d-%m-%Y") as tb_prophylaxis_start_date',
      'date_format(t1.pcp_prophylaxis_start_date,"%d-%m-%Y") as pcp_prophylaxis_start_date',
      'date_format(t1.tb_tx_start_date,"%d-%m-%Y") as tb_tx_start_date',
      't1.encounter_type',
      'date_format(t1.encounter_datetime,"%d-%m-%Y") as encounter_datetime',
      'date_format(t1.death_date,"%d-%m-%Y") as death_date',
      't1.out_of_care',
      't1.transfer_out',
      't1.patient_care_status',
      't1.prev_rtc_date',
      't1.prev_encounter_datetime_hiv'
    ];
    var dataSets = getAllDatasets(queryParams.reportName, [
      queryParams.reportName
    ]);
    _.each(dataSets, function (dataSet) {
      _.each(reports, function (report) {
        if (report.name === dataSet) {
          _.each(report.indicators, function (singleIndicator) {
            _.each(queryParams.requestIndicators.split(','), function (
              requestIndicatorName
            ) {
              if (singleIndicator.expression === requestIndicatorName) {
                // handle dates table
                if (report.patientListColumns)
                  extraPatientListColumns = report.patientListColumns;
                if (report.table.tableName !== 'flat_hiv_summary')
                  reportName = dataSet;
              }
            });
          });
        }
      });
    });
    return {
      reportName: reportName,
      extraPatientListColumns: extraPatientListColumns
    };
  }

  function buildPatientListReportExpression(queryParams) {
    var result = {
      whereClause: [],
      resource: '',
      queryParts: []
    };
    if (queryParams === null || queryParams === undefined) return '';
    var reportDataSet = getReportDataSet(queryParams);
    queryParams.reportName = reportDataSet.reportName;
    var filter = generatePatientListFilter(queryParams);
    result.whereClause.push(filter.query);
    result.whereClause.push.apply(result.whereClause, filter.params);
    result.resource = filter.table;
    _.each(reports, function (report) {
      if (report.name === queryParams.reportName) {
        var join = joinsToSql(report.joins, queryParams) || [];
        join.push({
          schema: 'amrs',
          tableName: 'person_name',
          alias: 'person_name',
          joinExpression:
            't1.person_id = person_name.person_id and (person_name.voided is null || person_name.voided = 0)',
          joinType: 'INNER JOIN'
        });
        join.push({
          schema: 'amrs',
          tableName: 'patient_identifier',
          alias: 'id',
          joinExpression: 't1.person_id = id.patient_id',
          joinType: 'LEFT OUTER JOIN'
        });
        join.push({
          schema: 'amrs',
          tableName: 'person',
          alias: 'person',
          joinExpression: 't1.person_id = person.person_id',
          joinType: 'INNER JOIN'
        });
        //remove dynamic datasets from joins
        join = _.filter(join, function (j) {
          return _.isUndefined(j.joinedQuerParts);
        });
        var columns = [
          't1.person_id',
          't1.encounter_id',
          't1.location_id',
          't1.location_uuid',
          't1.uuid as patient_uuid',
          'person.gender',
          'person.birthdate',
          'extract(year from (from_days(datediff(now(),person.birthdate)))) as age'
        ];
        columns.push.apply(columns, reportDataSet.extraPatientListColumns);
        var schema =
          report.table['schema'] === '' ? 'etl' : report.table['schema'];
        var tableName =
          report.table['tableName'] === ''
            ? 'flat_hiv_summary'
            : report.table['tableName'];
        var queryParts = {
          columns: columns,
          concatColumns: [
            "concat(COALESCE(person_name.given_name,''),' ',COALESCE(person_name.middle_name,''),' ',COALESCE(person_name.family_name,'')) as person_name",
            "group_concat(distinct id.identifier separator ', ') as identifiers"
          ],
          table: schema + '.' + tableName,
          alias: report.table['alias'],
          indexExpression: report.table['indexExpression'] || null,
          joins: join,
          where: result.whereClause,
          having: filtersToSql(
            queryParams.whereParams,
            report.parameters,
            report.having
          ),
          group: ['t1.person_id'],
          order: [
            {
              column: 't1.encounter_datetime',
              asc: false
            }
          ],
          offset: queryParams.startIndex,
          limit: queryParams.limit
        };
        result.queryParts = [queryParts];
      }
    });
    return result.queryParts;
  }

  function buildETLPatientLabOrdersExpression(queryParams, successCallback) {
    var result = {
      columns: '',
      table: '',
      where: []
    };
    _.each(
      patientLabOrderProperties.patientLabOrderSchema.parameters,
      function (parameter) {
        if (parameter !== '') {
          result.columns += parameter.name + ',';
        }
      }
    );
    //regular expression to remove the last comma;
    result.columns = result.columns.replace(/,\s*$/, '');
    result.table =
      patientLabOrderProperties.patientLabOrderSchema.table.schema +
      '.' +
      patientLabOrderProperties.patientLabOrderSchema.table.tableName;
    result.where.push(
      patientLabOrderProperties.patientLabOrderSchema.filters[0].expression
    );
    successCallback(result);
  }
})();
