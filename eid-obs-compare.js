'use strict'

var moment = require('moment');
var _ = require('underscore');

var moduleDefinition = {
    isViralLoadEquivalent: isViralLoadEquivalent,
    isDnaPcrEquivalent: isDnaPcrEquivalent,
    isCd4PanelEquivalent: isCd4PanelEquivalent,
    findAllMissingEidResults: findAllMissingEidResults,

    //helpers
    findEquivalentObject: findEquivalentObject,
    conceptDateComparer: conceptDateComparer,
    findMissingEidResults: findMissingEidResults,
    mergeEidResults: mergeEidResults
};

module.exports = moduleDefinition;

function findAllMissingEidResults(allEidResults, arrayOfObs) {
    var results = {
        viralLoad: [],
        pcr: [],
        cd4Panel: []
    };

    if (allEidResults.viralLoad.length > 0) {
        results.viralLoad =
            moduleDefinition.findMissingEidResults(allEidResults.viralLoad, arrayOfObs, isViralLoadEquivalent);
    }

    if (allEidResults.pcr.length > 0) {
        results.pcr =
            moduleDefinition.findMissingEidResults(allEidResults.pcr, arrayOfObs, isDnaPcrEquivalent);
    }

    if (allEidResults.cd4Panel.length > 0) {
        results.cd4Panel =
            moduleDefinition.findMissingEidResults(allEidResults.cd4Panel, arrayOfObs, isCd4PanelEquivalent);
    }

    return results;
}

function findMissingEidResults(arrayOfEidResult, arrayOfObs, comparisonFunction) {
    var missingEid = [];

    for (var i = 0; i < arrayOfEidResult.length; i++) {
        if (findEquivalentObject(arrayOfEidResult[i], arrayOfObs, comparisonFunction) === null) {
            missingEid.push(arrayOfEidResult[i]);
        }
    }
    return missingEid;
}

function findEquivalentObject(obj, searchSpaceArray, comparisonFunction) {
    for (var i = 0; i < searchSpaceArray.length; i++) {
        if (comparisonFunction(obj, searchSpaceArray[i])) {
            return searchSpaceArray[i];
        }
    }
    return null;
}

function mergeEidResults(arrayOfEidResults) {
    var results = {
        viralLoad: [],
        pcr: [],
        cd4Panel: []
    };

    _.each(arrayOfEidResults, function (result) {
        results.viralLoad = results.viralLoad.concat(result.viralLoad);
        results.pcr = results.pcr.concat(result.pcr);
        results.cd4Panel = results.cd4Panel.concat(result.cd4Panel);
    });

    return results;
}


function isViralLoadEquivalent(eidViralLoad, amrsViralLoadObs) {
    return conceptDateComparer(eidViralLoad, amrsViralLoadObs,
        'a8982474-1350-11df-a1f1-0026b9348838');
}

function isDnaPcrEquivalent(eidDnaPcr, amrsEidPcrObs) {
    return conceptDateComparer(eidDnaPcr, amrsEidPcrObs,
        'a898fe80-1350-11df-a1f1-0026b9348838');
}


function isCd4PanelEquivalent(eidCd4Panel, amrsCd4PanelObs) {
    return conceptDateComparer(eidCd4Panel, amrsCd4PanelObs,
        'a896cce6-1350-11df-a1f1-0026b9348838');
}

function conceptDateComparer(eidResult, amrsObs, conceptUuid) {
    if (!(eidResult && amrsObs)) {
        return false;
    }

    //check Obs for result concept
    if (!(amrsObs.concept &&
        amrsObs.concept.uuid === conceptUuid)) {
        return false;
    }

    //check for dates equality
    if (!_areDatesEqual(eidResult.DateCollected, amrsObs.obsDatetime)) {
        return false;
    }

    return true;
}

function _areDatesEqual(date1, date2) {
    var d1 = new moment(date1);

    var d2 = new moment(date2);

    return d1.isSame(d2, 'day');
}
