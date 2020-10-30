'use strict';

var moment = require('moment');
var _ = require('underscore');

var moduleDefinition = {
  isViralLoadEquivalent: isViralLoadEquivalent,
  isDnaPcrEquivalent: isDnaPcrEquivalent,
  isCd4PanelEquivalent: isCd4PanelEquivalent,
  findAllMissingEidResults: findAllMissingEidResults,
  findConflictingEidAmrsViralLoadResults: findConflictingEidAmrsViralLoadResults,

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
    // console.log('EID Viral load results', results.viralLoad);
    results.viralLoad = moduleDefinition.findMissingEidResults(
      filterOutResultsWithoutDateCollected(allEidResults.viralLoad),
      arrayOfObs,
      isViralLoadEquivalent
    );
  }

  if (allEidResults.pcr.length > 0) {
    results.pcr = moduleDefinition.findMissingEidResults(
      filterOutResultsWithoutDateCollected(allEidResults.pcr),
      arrayOfObs,
      isDnaPcrEquivalent
    );
  }

  if (allEidResults.cd4Panel.length > 0) {
    results.cd4Panel = moduleDefinition.findMissingEidResults(
      filterOutResultsWithoutDateCollected(allEidResults.cd4Panel),
      arrayOfObs,
      isCd4PanelEquivalent
    );
  }

  // console.log('MISSING LABS', results);
  return results;
}

function filterOutResultsWithoutDateCollected(resultsArray) {
  var results = [];
  _.each(resultsArray, function (result) {
    if (moment(result.DateCollected).isValid()) {
      results.push(result);
    }
  });
  return results;
}

function findConflictingEidAmrsViralLoadResults(arrayOfEidResult, arrayOfObs) {
  var conflicting = [];

  _.each(arrayOfEidResult, function (eid) {
    var cnflts = findConflictsForEidViralLoad(eid, arrayOfObs);
    if (cnflts.length > 0) {
      conflicting.push({
        eid: eid,
        obs: cnflts
      });
    }
  });

  return conflicting;
}

function findConflictsForEidViralLoad(eidViralload, arrayOfObs) {
  var conflicting = [];

  var eid = eidViralload;
  var filteredObs = findViralLoadObsResultsByDate(
    eidViralload.DateCollected,
    arrayOfObs
  );

  _.each(filteredObs, function (obs) {
    if (!isViralLoadEquivalent(eid, obs)) {
      conflicting.push(obs);
    }
  });
  return conflicting;
}

function findViralLoadObsResultsByDate(obsDate, arrayOfObs) {
  var results = [];
  _.each(arrayOfObs, function (obs) {
    if (
      (obs.concept.uuid === 'a8982474-1350-11df-a1f1-0026b9348838' ||
        isObsViralLoadError(obs)) &&
      _areDatesEqual(obsDate, obs.obsDatetime)
    ) {
      results.push(obs);
    }
  });
  return results;
}

function findMissingEidResults(
  arrayOfEidResult,
  arrayOfObs,
  comparisonFunction
) {
  var missingEid = [];

  for (var i = 0; i < arrayOfEidResult.length; i++) {
    if (
      findEquivalentObject(
        arrayOfEidResult[i],
        arrayOfObs,
        comparisonFunction
      ) === null
    ) {
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
  if (_.isEmpty(arrayOfEidResults)) return results;
  _.each(arrayOfEidResults, function (result) {
    results.viralLoad = results.viralLoad.concat(result.viralLoad);
    results.pcr = results.pcr.concat(result.pcr);
    results.cd4Panel = results.cd4Panel.concat(result.cd4Panel);
  });

  return results;
}

function isViralLoadEquivalent(eidViralLoad, amrsViralLoadObs) {
  if (!isEidViralLoadError(eidViralLoad)) {
    if (
      conceptDateComparer(
        eidViralLoad,
        amrsViralLoadObs,
        'a8982474-1350-11df-a1f1-0026b9348838'
      )
    ) {
      return areViralLoadValuesEquivalent(eidViralLoad, amrsViralLoadObs);
    } else {
      return false;
    }
  }

  //the eid result is an error at this point
  if (!isObsViralLoadError(amrsViralLoadObs)) return false;

  //at this point the amrs obs is a viral load error
  return _areDatesEqual(
    eidViralLoad.DateCollected,
    amrsViralLoadObs.obsDatetime
  );
}

function areViralLoadValuesEquivalent(eidViralLoad, amrsViralLoadObs) {
  if (
    _hasNumbersOnly(eidViralLoad.FinalResult) &&
    _hasNumbersOnly(amrsViralLoadObs.value + '')
  ) {
    return parseInt(eidViralLoad.FinalResult) === amrsViralLoadObs.value;
  }

  if (
    (_hasLessThanSymbol(eidViralLoad.FinalResult) ||
      eidViralLoad.FinalResult === 'Target Not Detected') &&
    _hasNumbersOnly(amrsViralLoadObs.value + '')
  ) {
    return amrsViralLoadObs.value === 0;
  }

  return false;
}

function isDnaPcrEquivalent(eidDnaPcr, amrsEidPcrObs) {
  return conceptDateComparer(
    eidDnaPcr,
    amrsEidPcrObs,
    'a898fe80-1350-11df-a1f1-0026b9348838'
  );
}

function isCd4PanelEquivalent(eidCd4Panel, amrsCd4PanelObs) {
  if (!isEidCD4PanelError(eidCd4Panel))
    return conceptDateComparer(
      eidCd4Panel,
      amrsCd4PanelObs,
      'a896cce6-1350-11df-a1f1-0026b9348838'
    );

  //the eid result is an error at this point
  if (!isObsCd4PanelError(amrsCd4PanelObs)) return false;

  //at this point the amrs obs is a cd4 load error
  return _areDatesEqual(eidCd4Panel.DateCollected, amrsCd4PanelObs.obsDatetime);
}

function conceptDateComparer(eidResult, amrsObs, conceptUuid) {
  if (!(eidResult && amrsObs)) {
    return false;
  }

  //check Obs for result concept
  if (!(amrsObs.concept && amrsObs.concept.uuid === conceptUuid)) {
    return false;
  }

  //check for dates equality
  if (!_areDatesEqual(eidResult.DateCollected, amrsObs.obsDatetime)) {
    return false;
  }

  return true;
}

function _areDatesEqual(date1, date2) {
  var d1 = null;
  var d2 = null;

  try {
    d1 = new Date(date1);
    d2 = new Date(date2);
    d1 = new moment(d1);
    d2 = new moment(d2);
  } catch (e) {}

  return d1.isSame(d2, 'day');
}

function isEidViralLoadError(eidViralLoadResult) {
  var isError = false;
  if (_.isEmpty(eidViralLoadResult)) return false;
  var viralLoadResult = eidViralLoadResult.FinalResult;
  if (
    !_hasNumbersOnly(viralLoadResult) &&
    !_hasLessThanSymbol(viralLoadResult) &&
    (viralLoadResult.trim() === 'Target Not Detected') === false
  ) {
    isError = true;
  }
  // console.log('Checking Values:::::::', eidViralLoadResult.FinalResult, isError);
  return isError;
}

function _hasNumbersOnly(stringValue) {
  var trimmedValue = _removeWhiteSpace(stringValue);
  var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
  return hasNumbersOnly.test(trimmedValue);
}

function _hasLessThanSymbol(stringValue) {
  var trimmedValue = _removeWhiteSpace(stringValue);
  var hasLessThanSymbol = /</g;
  return hasLessThanSymbol.test(trimmedValue);
}

function isEidCD4PanelError(eidCD4Result) {
  var hasErrors = false;
  var exceptions = [];
  var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
  var hasLessThanSymbol = /</g;
  if (_.isEmpty(eidCD4Result)) return false;
  var avgCD3percentLymphResult = _removeWhiteSpace(
    eidCD4Result.AVGCD3percentLymph
  );
  var avgCD3AbsCntResult = _removeWhiteSpace(eidCD4Result.AVGCD3AbsCnt);
  var avgCD3CD4percentLymphResult = _removeWhiteSpace(
    eidCD4Result.AVGCD3CD4percentLymph
  );
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
  if (_.isEmpty(obs) || _.isEmpty(obs.concept)) return false;

  if (obs.concept.uuid !== '457c741d-8f71-4829-b59d-594e0a618892') return false;

  if (obs.groupMembers.length <= 0) return false;

  var foundObs = _getObsObjectWithValue(
    obs.groupMembers,
    'a8982474-1350-11df-a1f1-0026b9348838'
  );
  if (foundObs === undefined) return false;

  return true;
}

function isObsCd4PanelError(obs) {
  if (_.isEmpty(obs) || _.isEmpty(obs.concept)) return false;

  if (obs.concept.uuid !== '457c741d-8f71-4829-b59d-594e0a618892') return false;

  if (obs.groupMembers.length <= 0) return false;

  var cd4PanelTestConcepts = [
    'a89c4220-1350-11df-a1f1-0026b9348838',
    'a898fcd2-1350-11df-a1f1-0026b9348838',
    'a8970a26-1350-11df-a1f1-0026b9348838',
    'a8a8bb18-1350-11df-a1f1-0026b9348838',
    'a89c4914-1350-11df-a1f1-0026b9348838'
  ];
  var foundObs = _getObsObjectWithAnyOfValueArray(
    obs.groupMembers,
    cd4PanelTestConcepts
  );
  if (foundObs === undefined) return false;

  return true;
}

function _getObsObjectWithValue(obsArray, value) {
  if (!Array.isArray(obsArray)) return;

  for (var i = 0; i < obsArray.length; i++) {
    if (
      obsArray[i].value &&
      obsArray[i].value.uuid &&
      obsArray[i].value.uuid === value
    )
      return obsArray[i];
  }
}

function _getObsObjectWithAnyOfValueArray(obsArray, valuesArray) {
  if (!Array.isArray(obsArray)) return;

  for (var i = 0; i < obsArray.length; i++) {
    if (
      obsArray[i].value &&
      obsArray[i].value.uuid &&
      valuesArray.indexOf(obsArray[i].value.uuid) >= 0
    )
      return obsArray[i];

    if (valuesArray.indexOf(obsArray[i].value) >= 0) return obsArray[i];
  }
}

function _removeWhiteSpace(string) {
  return string === null || string === undefined || typeof string !== 'string'
    ? ''
    : string.replace(/\s+/g, '');
}
