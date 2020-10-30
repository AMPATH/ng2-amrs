'use strict';
var _ = require('underscore');
var s = require('underscore.string');
var toSnakeCase = require('to-snake-case');
var disaggregationFilters = require('./disaggregation-filters.json');
var indicatorFilterOptions = require('./indicator-filter-options.json');

module.exports = (function () {
  return {
    disaggregateDynamicIndicators: disaggregateDynamicIndicators,
    disaggregateFixedIndicators: disaggregateFixedIndicators,
    replaceIndicatorParam: replaceIndicatorParam
  };

  function disaggregateDynamicIndicators(report, indicatorsSchema, request) {
    var report = _.assign({}, report);
    var results = [];
    report.derivedIndicators = [];
    _.each(report.indicators, function (reportIndicator) {
      if (
        reportIndicator.canBeDisaggregated &&
        reportIndicator.canBeDisaggregated === true
      ) {
        _.each(indicatorsSchema, function (indicator) {
          if (reportIndicator.expression === indicator.name) {
            _.each(indicatorFilterOptions, function (filterOption) {
              switch (filterOption.control) {
                case 'ageRangeFilter':
                  var params = request.requestParams[filterOption.control];
                  if (params) {
                    params = params.split(',').map(Number);
                    for (var i = params[0]; i < params[1]; i++) {
                      var name = indicator.name + '_age_' + (i + 1);
                      var expression = s.replaceAll(
                        filterOption.expression,
                        '@min',
                        i
                      );
                      expression = s.replaceAll(expression, '@max', i + 1);
                      results.push(
                        generateAggregateColumn(
                          indicator,
                          reportIndicator,
                          name,
                          expression,
                          request
                        )
                      );
                    }
                  }
                  break;
                case 'ageGroupFilter':
                  var params = request.requestParams[filterOption.control];
                  if (params) {
                    params = params.split(',');
                    _.each(filterOption.options, function (option) {
                      _.each(params, function (param) {
                        if (option.value === param) {
                          var name =
                            indicator.name +
                            '_age_' +
                            toSnakeCase(option.value);
                          var expression = s.replaceAll(
                            filterOption.expression,
                            '@min',
                            option.queryParam[0]
                          );
                          expression = s.replaceAll(
                            expression,
                            '@max',
                            option.queryParam[1]
                          );
                          results.push(
                            generateAggregateColumn(
                              indicator,
                              reportIndicator,
                              name,
                              expression,
                              request
                            )
                          );
                        }
                      });
                    });
                  }
                  break;
                case 'genderFilter':
                  var params = request.requestParams[filterOption.control];
                  if (params) {
                    params = params.split(',');
                    _.each(filterOption.options, function (option) {
                      _.each(params, function (param) {
                        if (option.value === param) {
                          var name =
                            indicator.name + '_' + toSnakeCase(option.value);
                          var expression = s.replaceAll(
                            filterOption.expression,
                            '@gender',
                            option.queryParam
                          );
                          results.push(
                            generateAggregateColumn(
                              indicator,
                              reportIndicator,
                              name,
                              expression,
                              request
                            )
                          );
                        }
                      });
                    });
                  }
                  break;
                case 'patientCareStatusFilter':
                  var params = request.requestParams[filterOption.control];
                  if (params) {
                    params = params.split(',');
                    _.each(filterOption.options, function (option) {
                      _.each(params, function (param) {
                        if (option.value === param) {
                          var name =
                            indicator.name + '_' + toSnakeCase(option.value);
                          var expression = s.replaceAll(
                            filterOption.expression,
                            '@paramBound',
                            option.queryParam
                          );
                          results.push(
                            generateAggregateColumn(
                              indicator,
                              reportIndicator,
                              name,
                              expression,
                              request
                            )
                          );
                        }
                      });
                    });
                  }
                  break;
              }
            });
          }
        });
      }
    });
    return _.uniq(results);
  }

  function generateAggregateColumn(
    indicator,
    reportIndicator,
    name,
    expression,
    requestParam
  ) {
    var column = reportIndicator.sql + ' as ' + name;
    var indicatorExpression = replaceIndicatorParam(
      indicator.expression,
      requestParam
    );
    indicatorExpression = indicatorExpression + ' and (' + expression + ')';
    column = column.replace('$expression', indicatorExpression);

    return column;
  }

  function disaggregateFixedIndicators(reports, indicatorsSchema) {
    _.each(reports, function (report) {
      _.each(report.indicators, function (reportIndicator) {
        if (reportIndicator.disaggregation) {
          _.each(indicatorsSchema, function (indicator) {
            if (reportIndicator.disaggregation.indicator === indicator.name) {
              var derivedIndicator = {
                label: '',
                description: '',
                expression: ''
              };
              _.each(reportIndicator.disaggregation.filters, function (filter) {
                var disaggregation = disaggregationFilters[filter];
                if (disaggregation) {
                  derivedIndicator.label += ' ' + disaggregation.label;
                  derivedIndicator.description +=
                    ', ' + disaggregation.description;
                  derivedIndicator.expression +=
                    ' and ' + disaggregation.expression;
                }
              });
              if (derivedIndicator.expression !== '') {
                // del repetition
                indicatorsSchema = indicatorsSchema.filter(function (el) {
                  return el.name !== reportIndicator.expression;
                });

                // push to the arrau
                indicatorsSchema.unshift({
                  name: reportIndicator.expression,
                  label: indicator.label + ' ' + derivedIndicator.label,
                  description:
                    indicator.description +
                    'and disaggregated ' +
                    derivedIndicator.description,
                  expression: indicator.expression + derivedIndicator.expression
                });
              }
            }
          });
        }
      });
    });
  }

  function replaceIndicatorParam(_indicatorExpression, requestParam) {
    var indicatorExpression = _indicatorExpression;
    var result;

    if (s.include(indicatorExpression, '@endDate')) {
      if (requestParam.whereParams) {
        var dateParam = _.find(requestParam.whereParams, function (param) {
          if (param.name === 'endDate') return param;
        });

        if (dateParam) {
          indicatorExpression = s.replaceAll(
            indicatorExpression,
            '@endDate',
            "'" + dateParam.value + "'"
          );
        }
      }
    }

    if (s.include(indicatorExpression, '@startDate')) {
      if (requestParam.whereParams) {
        var dateParam = _.find(requestParam.whereParams, function (param) {
          if (param.name === 'startDate') return param;
        });

        if (dateParam) {
          indicatorExpression = s.replaceAll(
            indicatorExpression,
            '@startDate',
            "'" + dateParam.value + "'"
          );
        }
      }
    }

    if (s.include(indicatorExpression, '@referenceDate')) {
      if (requestParam.whereParams) {
        var referenceParam = _.find(requestParam.whereParams, function (param) {
          if (param.name === 'referenceDate') return param;
        });

        if (referenceParam) {
          indicatorExpression = s.replaceAll(
            indicatorExpression,
            '@referenceDate',
            "'" + referenceParam.value + "'"
          );
        }
      }
    }

    if (s.include(indicatorExpression, '@locations')) {
      if (requestParam.whereParams) {
        var locationsParam = _.find(requestParam.whereParams, function (param) {
          if (param.name === 'locations') return param;
        });
        if (locationsParam) {
          indicatorExpression = s.replaceAll(
            indicatorExpression,
            '@locations',
            "'" + locationsParam.value + "'"
          );
        }
      }
    }

    return indicatorExpression;
  }
})();
