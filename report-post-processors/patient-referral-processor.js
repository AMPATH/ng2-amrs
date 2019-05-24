var _ = require('lodash');
var moment = require('moment');

var moduleExport = {
    UngroupResults: UngroupResults,
    groupResultsByLocation: groupResultsByLocation,
    getListOfDistinctStatesFromResult: getListOfDistinctStatesFromResult

};
var res;

module.exports = moduleExport;


function getListOfLocationIdsFromResult(results) {
    var locations = [];
    var unique = {};
    for (var i in results) {
        if (typeof(unique[results[i].location_id]) == "undefined") {
            locations.push(results[i].location_id);
        }
        unique[results[i].location_id] = 0;
    }
    return locations;
}

function getListOfDistinctStatesFromResult(results) {
    var states = [];
    var unique = {};
    for (var i in res) {
        if (typeof(unique[res[i].state_name]) == "undefined") {
            states.push({
                name: res[i].state_name.split(' ').join('_'),

            });

        }
        unique[res[i].state_name.split(' ').join('_')] = 0;
    }

    return states;

}

function getListOfDStatesFromResult(results) {
    var st = [];
    var unique = {};
    for (var i in results) {
        if (typeof(unique[results[i].program_id]) == "undefined") {
            st.push(results[i].program_id);

        }
        unique[results[i].program_id] = 0;
    }
    return st;

}

function UngroupResults(results) {
    return results;
}

function groupResultsByLocation(arrayOfResults) {
    var grouped = {};
    _.each(arrayOfResults, (result) => {
        grouped[result.location_id] = {
            location: result.location,
            locationId: result.location_id,
            locationUuids: result.locationUuids,
            programs: []
        }
    });

    _.each(arrayOfResults, (result) => {
        const prog = {
            counts: result.counts,
            location: result.location,
            location_id: result.locationId,
            locationUuids: result.locationUuids,
            program: result.program,
            programUuids: result.programUuids
        }
        grouped[result.location_id].programs.push(prog);
    });

    var results = [];
    for (var e in grouped) {
        results.push(grouped[e]);
    }
    return results;
}


function groupResultsByLocation2(arrayOfResults) {
    res = arrayOfResults;
    var grouped = {};
    _.each(arrayOfResults, function (result) {
        if (_.isEmpty(grouped[result.location_id])) {
            grouped[result.location_id] = {
                locationUuids: result.locationUuids,
                location: result.location,
                locationId: result.location_id,
                programs: []
            };
        }
        var loc = grouped[result.location_id];
        _handlePrograms(result, loc);
    });
    var results = [];
    for (var e in grouped) {

        results.push(grouped[e]);
    }

    return results;

}

function _handlePrograms(result, loc) {
    if (!_.isNull(result.program_id)) {
        var program = {
            locationUuids: result.locationUuids,
            location: result.location,
            location_id: result.location_id,
            program_id: result.program_id,
            program: result.program,
            programUuids: result.programUuids,
            counts:result.counts
        };
        var existingProg = _.find(loc.programs, function (prog) {
            return result.program_id === prog.program_id
        });
        if(existingProg) {
            _.merge(existingProg, program);
            loc.programs.push( program);
        } else {
            loc.programs.push(program);
        }
        loc.programs = _.uniqBy(loc.programs, 'program_id')
    }

}









