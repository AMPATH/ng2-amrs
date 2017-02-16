'use strict';

var _ = require('underscore');
var
    Promise = require('bluebird');
var db = require('../etl-db');

var serviceDef = {
    fullPatientListComparison: fullPatientListComparison,
    comparePatientLists: comparePatientLists,
    generateComparisonStats: generateComparisonStats,
    getAllResultsForHandler: getAllResultsForHandler,
    fetchAndCompareList: fetchAndCompareList,
    resolvePersonIds: resolvePersonIds
};

module.exports = serviceDef;

function fetchAndCompareList(patientList, requestObject, handler) {
    return new Promise(function (resolve, reject) {
        getAllResultsForHandler(requestObject, handler)
            .then(function (response) {
                var compared = fullPatientListComparison(patientList, response.result);

                if (compared.onlyIncoming.length > 0) {
                    resolvePersonIds(_getPersonids(compared.onlyIncoming))
                        .then(function (results) {
                            compared.onlyIncoming = results.result;
                            resolve(compared);
                        })
                        .catch(function (error) {
                            console.error('Error resolving patient_ids', error);
                            resolve(compared);
                        });
                } else {
                    resolve(compared);
                }
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

function _getPersonids(patientList) {
    var patients = [];
    _.each(patientList, function (patient) {
        patients.push(patient.person_id);
    });
    return patients;
}

function resolvePersonIds(personIdsArray) {
    var list = '';

    if (Array.isArray(personIdsArray)) {
        list = JSON.stringify(personIdsArray);
    } else {
        list = personIdsArray;
    }

    list = list.replace('[', "").replace(']', "");

    var sql = "select t1.person_id, t1.uuid as patient_uuid, t4.patient_id, t1.gender," +
        " t1.birthdate,  extract(year from (from_days(datediff(now(), t1.birthdate)))) as age," +
        "concat(COALESCE(t2.given_name,''),' ',COALESCE(t2.middle_name,''),' ',COALESCE(t2.family_name,''))" +
        "as person_name, group_concat(distinct t3.identifier separator ', ') as identifiers FROM amrs.person `t1`" +
        "INNER JOIN amrs.person_name `t2` ON (t1.person_id = t2.person_id)" +
        "LEFT OUTER JOIN amrs.patient `t4` ON (t1.person_id = t4.patient_id)" +
        "LEFT OUTER JOIN amrs.patient_identifier `t3` ON (t1.person_id = t3.patient_id)" +
        "WHERE t1.person_id in (?)  GROUP BY t1.person_id";

    sql = sql.replace('?', list);

    var queryObject = {
        query: sql,
        sqlParams: []
    }

    return new Promise(function (resolve, reject) {
        db.queryReportServer(queryObject, function (response) {
            if (response.error) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}


