"use strict";
var _ = require('underscore');
module.exports = function() {
  return {
    convertConceptIdToName: convertConceptIdToName,
  };
  //str : code1 ## code2 ##
  function getARVNames(str) {
    if (str === null || str === undefined) return "";
    var arvs = {
      814: "ABACAVIR",
      817: "ABACAVIR LAMIVUDINE AND ZIDOVUDINE",
      6159: "ATAZANAVIR",
      6160: "ATAZANAVIR AND RITONAVIR",
      796: "DIDANOSINE",
      633: "EFAVIRENZ",
      791: "EMTRICITABINE",
      6679: "EPZICOM",
      6158: "ETRAVIRINE",
      749: "INDINAVIR",
      6156: "ISENTRESS",
      6965: "LAMIVIR S30",
      628: "LAMIVUDINE",
      1400: "LAMIVUDINE AND TENOFOVIR",
      794: "LOPINAVIR AND RITONAVIR",
      635: "NELFINAVIR",
      631: "NEVIRAPINE",
      6467: "NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE",
      1107: "NONE",
      5424: "OTHER ANTIRETROVIRAL DRUG",
      6157: "PREZISTA",
      795: "RITONAVIR",
      625: "STAVUDINE",
      792: "STAVUDINE LAMIVUDINE AND NEVIRAPINE",
      6964: "TDF AND 3TC AND EFV",
      802: "TENOFOVIR",
      6180: "TRUVADA",
      5811: "UNKNOWN ANTIRETROVIRAL DRUG",
      797: "ZIDOVUDINE",
      630: "ZIDOVUDINE AND LAMIVUDINE"
    };
    var arvCodes = str.split(" ## ");
    var arvNames = [];
    _.each(arvCodes, function(code) {
      arvNames.push(arvs[code]);
    });
    return arvNames.join(', ');
  }

  function convertConceptIdToName(indicators, queryResults) {
    _.each(indicators, function(indicator) {
      _.each(queryResults.result, function(row) {
        row[indicator] = getARVNames(row[indicator]);
      });
    });
    return queryResults;
  }
}();
