"use strict";
var _ = require('underscore');
//Report Indicators Json Schema Path
var indicatorsSchema = require('./reports/indicators.json');
var reports = require('./reports/report-schema.json');

//etl-factory builds and generates queries dynamically in a generic way using indicator-schema and report-schema json files
module.exports = function() {
    return {
       buildReportExpression:function buildReportExpression(queryParams, successCallback) {
       //Check for undefined params
       if(queryParams  === null || queryParams === undefined) return "";
       var result="";
       //Load json schema into the query builder
        _.each(reports,function(report) {
            if(report.reportName===queryParams.reportName) {
                _.each(report.indicators, function (name) {
                    console.log('here is the requested indicators', name);
                    _.each(indicatorsSchema, function (indicator) {
                        if (indicator.name === name) {

                                _.each(indicator.reportIndicators, function (reportIndicator) {
                                    if (reportIndicator.name ===queryParams.countBy) {
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
        },
       buildPatientListExpression:function builPatientListExpression(queryParams, successCallback) {
            //Check for undefined params
            if(queryParams  === null || queryParams === undefined) return "";
           //Initialize returned obj
            var result={
                whereClause:"",
                resource:""
            };
            //Load json schema into the query builder
            _.each(indicatorsSchema, function (indicator) {
                if (indicator.name === queryParams.reportIndicator) {
                    if (indicator.expression != "") {
                        result.whereClause= "and "+indicator.expression;
                    }else{
                        result.whereClause= indicator.expression;
                    }
                    result.resource=indicator.resource;
                }
            });
           successCallback(result);
        },
       buildIndicatorsSchema:function buildIndicatorsSchema(queryParams, successCallback) {
            //Check for undefined params
            if(queryParams  === null || queryParams === undefined) return "";
            var result=[];
           //Load json schema into the query builder
            _.each(reports,function(report) {
                if(report.reportName===queryParams.reportName) {
                    _.each(report.indicators, function (name) {
                        console.log('here is the requested indicators', name);
                        _.each(indicatorsSchema, function (indicator) {
                            if (indicator.name === name) {
                                result.push(indicator);
                            }
                        });
                    });
                }
            });
            successCallback(result);
        }
    }
}();
