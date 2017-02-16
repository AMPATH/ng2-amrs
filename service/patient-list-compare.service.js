'use strict';

var _ = require('underscore');
var
    Promise = require('bluebird');

var serviceDef = {
    fullPatientListComparison: fullPatientListComparison,
    comparePatientLists: comparePatientLists,
    generateComparisonStats: generateComparisonStats,
    getAllResultsForHandler: getAllResultsForHandler,
    fetchAndCompareList: fetchAndCompareList
};

module.exports = serviceDef;

function fetchAndCompareList(patientList, requestObject, handler) {
    return new Promise(function (resolve, reject) {
        getAllResultsForHandler(requestObject, handler)
            .then(function (response) {
                resolve(fullPatientListComparison(patientList, response.result));
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

function fullPatientListComparison(incoming, poc) {
    var comparison = comparePatientLists(incoming, poc);
    generateComparisonStats(comparison, incoming, poc);
    return comparison;
}

function comparePatientLists(incoming, poc) {
    var comparison = {
        both: [],
        onlyPoc: [],
        onlyIncoming: []
    };

    for (var i = 0; i < incoming.length; i++) {
        var inItem = incoming[i];
        var foundPoc = null;
        for (var j = 0; j < poc.length; j++) {
            if (inItem.person_id === poc[j].person_id) {
                foundPoc = poc[j];
                break;
            }
        }

        if (foundPoc !== null) {
            comparison.both.push(foundPoc);
        } else {
            comparison.onlyIncoming.push(inItem);
        }
    }

    for (var i = 0; i < poc.length; i++) {
        var pocItem = poc[i];
        var foundIncoming = null;
        for (var j = 0; j < incoming.length; j++) {
            if (pocItem.person_id === incoming[j].person_id) {
                foundIncoming = poc[j];
                break;
            }
        }

        if (foundIncoming === null) {
            comparison.onlyPoc.push(pocItem);
        }
    }

    return comparison;
}

function generateComparisonStats(comparisonResults, incoming, poc) {
    comparisonResults.summaryStats = {};
    comparisonResults.summaryStats.totalPoc = poc.length;
    comparisonResults.summaryStats.totalIncoming = incoming.length;
    comparisonResults.summaryStats.totalBoth = comparisonResults.both.length;
    comparisonResults.summaryStats.totalOnlyPoc = comparisonResults.onlyPoc.length;
    comparisonResults.summaryStats.totalOnlyIncoming = comparisonResults.onlyIncoming.length;
}

function getAllResultsForHandler(requestObject, handler) {
    requestObject.query.startIndex = 0;
    requestObject.query.limit = 1000000;

    return new Promise(function (resolve, reject) {
        handler(requestObject, function (results) {
            // TODO: check for error on the returned results
            resolve(results);
        });
    });
}


