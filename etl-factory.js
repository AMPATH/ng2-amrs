"use strict";
var _ = require('underscore');
var fs = require('fs');
//Report Indicators Json Schema Path
var indicatorsSchemaPath = './reports/indicators.json';
var reportSchemaPath = './reports/report-schema.json';

//etl-factory builds and generates queries dynamically in a generic way using indicator-schema and report-schema json files
module.exports = function() {
    return {
       buildReportExpression:function buildReportExpression(queryParams, successCallback) {
       //Check for undefined params
       if(queryParams  === null || queryParams === undefined) return "";
       var result="";
       //Load json schema into the query builder
       fs.readFile(indicatorsSchemaPath, 'utf8', function (indicatorError, indicatorData) {
        if (indicatorError) throw indicatorError; // we'll not consider error handling for now
        var indicatorsSchema= JSON.parse(indicatorData);
        fs.readFile(reportSchemaPath, 'utf8', function (reportError, reportData) {
             if (reportError) throw reportError; // we'll not consider error handling for now
             var reports=JSON.parse(reportData);
                _.each(reports,function(report) {
                    if(report.reportName===queryParams.reportName) {
                        _.each(report.indicators, function (name) {
                            console.log('here is the requested indicators', name);
                            _.each(indicatorsSchema, function (indicator) {
                                if (indicator.name === name) {

                                        _.each(indicator.reportIndicators, function (reportIndicator) {
                                            if (reportIndicator.name ===queryParams.reportType) {
                                                result += ", ";
                                                var str = reportIndicator.groupFunction + "( ";
                                                if (reportIndicator.distinct === true)str += "distinct ";

                                                if (reportIndicator.conditional === true) {
                                                    str += "if(" + indicator.expression + "," +
                                                        reportIndicator.fieldToCalulate + ",null)) as " + indicator.name;
                                                }
                                                else if (reportIndicator.conditional === false) {
                                                    str += reportIndicator.fieldToCalulate + ") as " + indicator.name;
                                                }
                                                result += str.toString();
                                            }
                                        });

                                }
                            });
                        });
                    }
            });
           successCallback(result);
           });
       });

        }
    }
}();
