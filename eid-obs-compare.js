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
    mergeEidResults: mergeEidResults,
    isEidViralLoadError: isEidViralLoadError,
    isEidCD4PanelError: isEidCD4PanelError,
    isObsViralLoadError: isObsViralLoadError,
    isObsCd4PanelError: isObsCd4PanelError

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
    if(_.isEmpty(arrayOfEidResults)) return results;
    _.each(arrayOfEidResults, function (result) {
        results.viralLoad = results.viralLoad.concat(result.viralLoad);
        results.pcr = results.pcr.concat(result.pcr);
        results.cd4Panel = results.cd4Panel.concat(result.cd4Panel);
    });

    return results;
}


function isViralLoadEquivalent(eidViralLoad, amrsViralLoadObs) {
    if (!isEidViralLoadError(eidViralLoad))
        return conceptDateComparer(eidViralLoad, amrsViralLoadObs,
            'a8982474-1350-11df-a1f1-0026b9348838');

    //the eid result is an error at this point
    if (!isObsViralLoadError(amrsViralLoadObs))
        return false;

    //at this point the amrs obs is a viral load error
    return _areDatesEqual(eidViralLoad.DateCollected, amrsViralLoadObs.obsDatetime);
}

function isDnaPcrEquivalent(eidDnaPcr, amrsEidPcrObs) {
    return conceptDateComparer(eidDnaPcr, amrsEidPcrObs,
        'a898fe80-1350-11df-a1f1-0026b9348838');
}


function isCd4PanelEquivalent(eidCd4Panel, amrsCd4PanelObs) {
    if (!isEidCD4PanelError(eidCd4Panel))
        return conceptDateComparer(eidCd4Panel, amrsCd4PanelObs,
            'a896cce6-1350-11df-a1f1-0026b9348838');

    //the eid result is an error at this point
    if (!isObsCd4PanelError(amrsCd4PanelObs))
        return false;

    //at this point the amrs obs is a cd4 load error
    return _areDatesEqual(eidCd4Panel.DateCollected, amrsCd4PanelObs.obsDatetime);
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

function isEidViralLoadError(eidViralLoadResult) {
    var isError = false;
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;
    if(_.isEmpty(eidViralLoadResult)) return false;
    var viralLoadResult = _removeWhiteSpace(eidViralLoadResult.FinalResult);
    if (!hasNumbersOnly.test(viralLoadResult) && !hasLessThanSymbol.test(viralLoadResult)) {
        isError = true;
    }
    return isError;
}

function isEidCD4PanelError(eidCD4Result) {
    var hasErrors = false;
    var exceptions = [];
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;
    if(_.isEmpty(eidCD4Result)) return false;
    var avgCD3percentLymphResult = _removeWhiteSpace(eidCD4Result.AVGCD3percentLymph);
    var avgCD3AbsCntResult = _removeWhiteSpace(eidCD4Result.AVGCD3AbsCnt);
    var avgCD3CD4percentLymphResult = _removeWhiteSpace(eidCD4Result.AVGCD3CD4percentLymph);
    var avgCD3CD4AbsCntResult = _removeWhiteSpace(eidCD4Result.AVGCD3CD4AbsCnt);
    var cd45AbsCntResult = _removeWhiteSpace(eidCD4Result.CD45AbsCnt);
    if (!hasNumbersOnly.test(avgCD3percentLymphResult)) {
        exceptions.push(avgCD3percentLymphResult);
    }
    if (!hasNumbersOnly.test(avgCD3AbsCntResult)) {
        exceptions.push(avgCD3AbsCntResult);
    }
    if (!hasNumbersOnly.test(avgCD3CD4percentLymphResult)) {
        exceptions.push(avgCD3CD4percentLymphResult);
    }
    if (!hasNumbersOnly.test(avgCD3CD4AbsCntResult)) {
        exceptions.push(avgCD3CD4AbsCntResult);
    }
    if (!hasNumbersOnly.test(cd45AbsCntResult)) {
        exceptions.push(cd45AbsCntResult);
    }
    if (exceptions.length > 0) {
        hasErrors = true;
    }

    return hasErrors;
}

function isObsViralLoadError(obs) {
    if (_.isEmpty(obs)) return false;

    if (obs.concept !== '457c741d-8f71-4829-b59d-594e0a618892') return false;

    if (obs.groupMembers.length <= 0) return false;

    var foundObs = _getObsObjectWithValue(obs.groupMembers, 'a8982474-1350-11df-a1f1-0026b9348838');
    if (foundObs === undefined)
        return false;

    return true;
}

function isObsCd4PanelError(obs) {
    if (_.isEmpty(obs)) return false;

    if (obs.concept !== '457c741d-8f71-4829-b59d-594e0a618892') return false;

    if (obs.groupMembers.length <= 0) return false;

    var cd4PanelTestConcepts = [
        'a89c4220-1350-11df-a1f1-0026b9348838',
        'a898fcd2-1350-11df-a1f1-0026b9348838',
        'a8970a26-1350-11df-a1f1-0026b9348838',
        'a8a8bb18-1350-11df-a1f1-0026b9348838',
        'a89c4914-1350-11df-a1f1-0026b9348838'
    ];
    var foundObs =
        _getObsObjectWithAnyOfValueArray(obs.groupMembers, cd4PanelTestConcepts);
    if (foundObs === undefined)
        return false;

    return true
}

function _getObsObjectWithValue(obsArray, value) {
    if (!Array.isArray(obsArray)) return;

    for (var i = 0; i < obsArray.length; i++) {
        if (obsArray[i].value === value) return obsArray[i];
    }
}

function _getObsObjectWithAnyOfValueArray(obsArray, valuesArray) {
    if (!Array.isArray(obsArray)) return;

    for (var i = 0; i < obsArray.length; i++) {
        if (valuesArray.indexOf(obsArray[i].value) >= 0) return obsArray[i];
    }
}

function _removeWhiteSpace(string) {
    return string.replace(/\s+/g, '');
}
