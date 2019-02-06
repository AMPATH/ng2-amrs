'use strict';
var moment = require('moment');
var _ = require('underscore');

export class EidCompareOperator {

    constructor() { }
    getAllResults(eidResults, obsResults) {
        return {
            missingResults: this.getMissingResults(eidResults, obsResults),
            conflictingResults: this.getConflictingResults(eidResults, obsResults)
        }
    }
    getMissingResults(eidResults, obsResults) {
        var missingResults = [];

        for (var i = 0; i < eidResults.length; i++) {
            var found = this.findEquivalentObject(eidResults[i], obsResults);
            if (!found) {
                missingResults.push(eidResults[i]);
            }
        }
        return missingResults;
    }

    findEquivalentObject(eidObj, obsResults) {
        var found = false;
        if (eidObj && obsResults) {
            for (var i = 0; i < obsResults.length; i++) {
                var obsObj = obsResults[i];
                var equalDate = this.areDatesEqual(eidObj.obsDatetime, obsObj.obsDatetime);
                var obsValue = '';
                if (obsObj.value && obsObj.value !== null) {
                    if (typeof (obsObj.value) === 'object') {
                        obsValue = obsObj.value.uuid.toString();
                    } else {
                        obsValue = obsObj.value.toString();
                    }
                    if (obsObj.concept === eidObj.concept &&
                        obsValue.trim() === eidObj.value.toString().trim() && equalDate) {
                        found = true;
                    }
                }

                if (eidObj.groupMembers) {
                    //Introduce check for group members
                    if (obsObj.concept === eidObj.concept && equalDate) {
                        found = true;
                    }
                }
            }


        }

        return found;
    }

    getConflictingResults(eidResults, obsResults) {
        var conflictingResults = [];

        for (var i = 0; i < eidResults.length; i++) {
            var found = this.findEquivalentObject(eidResults[i], obsResults);
            if (found) {
                conflictingResults.push(eidResults[i]);
            }
        }

        return conflictingResults;
    }

    areDatesEqual(date1, date2) {

        var d1 = null;
        var d2 = null;

        try {
            d1 = new Date(date1);
            d2 = new Date(date2);
            d1 = new moment(d1);
            d2 = new moment(d2);
        } catch (e) { }

        return d1.isSame(d2, 'day');
    }
}