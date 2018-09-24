'use strict';
var Promise = require('bluebird');
var db = require('../../etl-db');

var def = {
    getPatientHivSummary: getPatientHivSummary
};

module.exports = def;

function getPatientHivSummary(patientUuid, clinicalOnly,
    params, startIndex, limit) {

    var whereClause = clinicalOnly ?
        ['uuid = ? AND is_clinical_encounter = true', patientUuid] :
        ['uuid = ?', patientUuid];
    var queryObject = {
        columns: '*',
        table: 'etl.flat_hiv_summary_v15b',
        where: whereClause,
        order: [{
            column: 'encounter_datetime',
            asc: false
        }],
        offset: startIndex,
        limit: limit
    };

    return db.queryDb(queryObject);
}