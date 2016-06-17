var _ = require('underscore');
var moment = require('moment');

var moduleExport = {
    groupResultsByVisitId: groupResultsByVisitId,

    //helpers
    _handleTimeToBeSeenByClinician: _handleTimeToBeSeenByClinician,
    _getTimeSpanInMinutes: _getTimeSpanInMinutes,
    _handleTimeToCompleteVisit: _handleTimeToCompleteVisit
};

module.exports = moduleExport;

function groupResultsByVisitId(arrayOfResults) {
    var grouped = {};

    _.each(arrayOfResults, function (result) {
        if (_.isEmpty(grouped[result.visit_id])) {
            grouped[result.visit_id] = {
                patient_id: result.patient_id,
                names: result.given_name + ' ' + result.middle_name + ' ' + result.family_name,
                identifiers: result.identifiers,

                visit_id: result.visit_id,
                registered: typeof result.triaged === 'string' ? result.visit_start : new Date(result.visit_start).toISOString(),
                visit_end: result.visit_end,
                encounters: []
            };
        }
        var visit = grouped[result.visit_id];
        _handleTriaged(result, visit);
        _handleSeenByClinician(result, visit);
        _handleCompletedVisit(result, visit);
        _handleEncouters(result, visit);
    });
    var results = [];
    for (var e in grouped) {

        //calculate time periods first
        _handleTimeToBeSeenByClinician(grouped[e]);
        _handleTimeToCompleteVisit(grouped[e]);

        results.push(grouped[e]);
    }

    return results;
}

function _handleTriaged(result, visit) {
    //triaged
    //necessary check to ensure the first triage encounter is used
    if (_.isEmpty(visit.triaged)) {
        visit.triaged = typeof result.triaged === 'string' ? result.triaged : new Date(result.triaged).toISOString();
        visit.time_to_be_triaged = result.time_to_be_triaged;
    }
}

function _handleSeenByClinician(result, visit) {
    //clinical encounter
    //necessary check to ensure the first clinical encounter is used
    if (_.isEmpty(visit.seen_by_clinician)) {
        visit.seen_by_clinician = null;
        if (result.seen_by_clinician !== null && result.seen_by_clinician !== undefined)
            visit.seen_by_clinician = typeof result.seen_by_clinician === 'string' ? result.seen_by_clinician : new Date(result.seen_by_clinician).toISOString();
    }
}

function _handleEncouters(result, visit) {

    if (!_.isNull(result.encounter_type)) {
        var encounter = {
            encounter_type: result.encounter_type,
            encounter_start: result.encounter_start,
            encounter_end: result.encounter_end
        };
        visit.encounters.push(encounter);
    }

}

function _handleCompletedVisit(result, visit) {
    visit.completed_visit = null;

    if (result.encounter_end !== null && result.encounter_end !== undefined)
            visit.completed_visit = typeof result.encounter_end === 'string' ? result.encounter_end : new Date(result.encounter_end).toISOString();

}

function _handleTimeToBeSeenByClinician(visit) {
    visit.time_to_be_seen_by_clinician = null;

    if (!_.isEmpty(visit.triaged)) {
        if (!_.isEmpty(visit.seen_by_clinician))
            visit.time_to_be_seen_by_clinician =
                _getTimeSpanInMinutes(visit.triaged, visit.seen_by_clinician);
    } else {
        if (!_.isEmpty(visit.seen_by_clinician) && !_.isEmpty(visit.registered))
            visit.time_to_be_seen_by_clinician =
                _getTimeSpanInMinutes(visit.registered, visit.seen_by_clinician);
    }
}

function _handleTimeToCompleteVisit(visit) {
    visit.time_to_complete_visit = null;

    if (!_.isEmpty(visit.registered) && !_.isEmpty(visit.completed_visit)) {
        visit.time_to_complete_visit =
            _getTimeSpanInMinutes(visit.registered, visit.completed_visit);
    }
}

function _getTimeSpanInMinutes(timeA, timeB) {
    var a = moment(timeA);
    var b = moment(timeB);
    return Math.round((b.diff(a) / (1000 * 60)));
}