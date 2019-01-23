'use strict';
var moment = require('moment');
var Promise = require('bluebird');
var config = require('./conf/config');
var rp = require('./request-config');
var _ = require('underscore');
module.exports = function () {
  function getRestResource(path) {
    var link = config.openmrs.host + ':' + config.openmrs.port + path;
    if (config.openmrs.https === true) {
      link = 'https://' + link;
    } else {
      link = 'http://' + link;
    }
    return link;
  }
  function removeWhiteSpace(string) {
    var whitePaceVar;
    if(string === '' || string === null){
         whitePaceVar = '';
    }else{
        whitePaceVar = string.replace(/\s+/g, '');
    }
    return whitePaceVar;

  }
  function checkStatusOfViralLoad(viralLoadPayload) {
    var status = 0;
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;
    if (_.isEmpty(viralLoadPayload)) return -1;
    var viralLoadResult = removeWhiteSpace(viralLoadPayload.FinalResult);


    if (_.isEmpty(viralLoadResult)) {
      return -1;
    }

    if (hasNumbersOnly.test(viralLoadResult)) {
      status = 1;
    }
    else if (hasLessThanSymbol.test(viralLoadResult) || viralLoadPayload.FinalResult.trim()==='Target Not Detected') {
      status = 0;
    }
    else {
      status = 2;
    }
    // console.log('ASSESSING EID RESULT ',status, viralLoadResult);
    return status;
  }
  function isViralLoadError(viralLoadPayload) {
    var isError = false;
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;
    var viralLoadResult = removeWhiteSpace(viralLoadPayload.FinalResult);
    if (!hasNumbersOnly.test(viralLoadResult) && !hasLessThanSymbol.test(viralLoadResult)) {
      isError = true;
    }
    return isError;
  }
  function cd4PanelHasErrors(cd4Payload) {
    var hasErrors = false;
    var exceptions = [];
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;
    if (_.isEmpty(cd4Payload)) return false;
    var AVGCD3percentLymphResult = removeWhiteSpace(cd4Payload.AVGCD3percentLymph);
    var AVGCD3AbsCntResult = removeWhiteSpace(cd4Payload.AVGCD3AbsCnt);
    var AVGCD3CD4percentLymphResult = removeWhiteSpace(cd4Payload.AVGCD3CD4percentLymph);
    var AVGCD3CD4AbsCntResult = removeWhiteSpace(cd4Payload.AVGCD3CD4AbsCnt);
    var CD45AbsCntResult = removeWhiteSpace(cd4Payload.CD45AbsCnt);
    if (!hasNumbersOnly.test(AVGCD3percentLymphResult)) {
      exceptions.push(AVGCD3percentLymphResult);
    }
    if (!hasNumbersOnly.test(AVGCD3AbsCntResult)) {
      exceptions.push(AVGCD3AbsCntResult);
    }
    if (!hasNumbersOnly.test(AVGCD3CD4percentLymphResult)) {
      exceptions.push(AVGCD3CD4percentLymphResult);
    }
    if (!hasNumbersOnly.test(AVGCD3CD4AbsCntResult)) {
      exceptions.push(AVGCD3CD4AbsCntResult);
    }
    if (!hasNumbersOnly.test(CD45AbsCntResult)) {
      exceptions.push(CD45AbsCntResult);
    }
    if (exceptions.length > 0) {
      hasErrors = true;
    }
    return hasErrors;
  }
  function cd4PanelHasValidData(cd4Payload) {
    var hasValidData = false;
    var validData = [];
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;
    if (_.isEmpty(cd4Payload)) return false;
    var AVGCD3percentLymphResult = removeWhiteSpace(cd4Payload.AVGCD3percentLymph);
    var AVGCD3AbsCntResult = removeWhiteSpace(cd4Payload.AVGCD3AbsCnt);
    var AVGCD3CD4percentLymphResult = removeWhiteSpace(cd4Payload.AVGCD3CD4percentLymph);
    var AVGCD3CD4AbsCntResult = removeWhiteSpace(cd4Payload.AVGCD3CD4AbsCnt);
    var CD45AbsCntResult = removeWhiteSpace(cd4Payload.CD45AbsCnt);
    if (hasNumbersOnly.test(AVGCD3percentLymphResult)) {
      validData.push(AVGCD3percentLymphResult);
    }
    if (hasNumbersOnly.test(AVGCD3AbsCntResult)) {
      validData.push(AVGCD3AbsCntResult);
    }
    if (hasNumbersOnly.test(AVGCD3CD4percentLymphResult)) {
      validData.push(AVGCD3CD4percentLymphResult);
    }
    if (hasNumbersOnly.test(AVGCD3CD4AbsCntResult)) {
      validData.push(AVGCD3CD4AbsCntResult);
    }
    if (hasNumbersOnly.test(CD45AbsCntResult)) {
      validData.push(CD45AbsCntResult);
    }
    if (validData.length > 0) {
      hasValidData = true;
    }
    return hasValidData;
  }

  function generateCd4ValidData(cd4Payload) {
    var cd4Data = {};
    cd4Data.OrderNo = cd4Payload['OrderNo'];
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;
    var AVGCD3percentLymphResult = removeWhiteSpace(cd4Payload.AVGCD3percentLymph);
    var AVGCD3AbsCntResult = removeWhiteSpace(cd4Payload.AVGCD3AbsCnt);
    var AVGCD3CD4percentLymphResult = removeWhiteSpace(cd4Payload.AVGCD3CD4percentLymph);
    var AVGCD3CD4AbsCntResult = removeWhiteSpace(cd4Payload.AVGCD3CD4AbsCnt);
    var CD45AbsCntResult = removeWhiteSpace(cd4Payload.CD45AbsCnt);
    if (hasNumbersOnly.test(AVGCD3percentLymphResult)) {
      cd4Data.AVGCD3percentLymph = cd4Payload.AVGCD3percentLymph;
    }
    if (hasNumbersOnly.test(AVGCD3AbsCntResult)) {
      cd4Data.AVGCD3AbsCnt = cd4Payload.AVGCD3AbsCnt;
    }
    if (hasNumbersOnly.test(AVGCD3CD4percentLymphResult)) {
      cd4Data.AVGCD3CD4percentLymph = cd4Payload.AVGCD3CD4percentLymph;
    }
    if (hasNumbersOnly.test(AVGCD3CD4AbsCntResult)) {
      cd4Data.AVGCD3CD4AbsCnt = cd4Payload.AVGCD3CD4AbsCnt;
    }
    if (hasNumbersOnly.test(CD45AbsCntResult)) {
      cd4Data.CD45AbsCnt = cd4Payload.CD45AbsCnt;
    }
    cd4Data.DateCollected = cd4Payload.DateCollected;
    return cd4Data;
  }

  function generateCd4Exceptions(cd4Payload) {
    var cd4Exceptions = {};
    cd4Exceptions.OrderNo = cd4Payload['OrderNo'];
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;
    var AVGCD3percentLymphResult = removeWhiteSpace(cd4Payload.AVGCD3percentLymph);
    var AVGCD3AbsCntResult = removeWhiteSpace(cd4Payload.AVGCD3AbsCnt);
    var AVGCD3CD4percentLymphResult = removeWhiteSpace(cd4Payload.AVGCD3CD4percentLymph);
    var AVGCD3CD4AbsCntResult = removeWhiteSpace(cd4Payload.AVGCD3CD4AbsCnt);
    var CD45AbsCntResult = removeWhiteSpace(cd4Payload.CD45AbsCnt);
    if (!hasNumbersOnly.test(AVGCD3percentLymphResult)) {
      cd4Exceptions.AVGCD3percentLymph = cd4Payload.AVGCD3percentLymph;
    }
    if (!hasNumbersOnly.test(AVGCD3AbsCntResult)) {
      cd4Exceptions.AVGCD3AbsCnt = cd4Payload.AVGCD3AbsCnt;
    }
    if (!hasNumbersOnly.test(AVGCD3CD4percentLymphResult)) {
      cd4Exceptions.AVGCD3CD4percentLymph = cd4Payload.AVGCD3CD4percentLymph;
    }
    if (!hasNumbersOnly.test(AVGCD3CD4AbsCntResult)) {
      cd4Exceptions.AVGCD3CD4AbsCnt = cd4Payload.AVGCD3CD4AbsCnt;
    }
    if (!hasNumbersOnly.test(CD45AbsCntResult)) {
      cd4Exceptions.CD45AbsCnt = cd4Payload.CD45AbsCnt;
    }
    cd4Exceptions.DateCollected = cd4Payload.DateCollected;
    return cd4Exceptions;
  }
  function convertViralLoadPayloadToRestConsumableObs(viralLoad, patientUuId) {
    var date = moment(viralLoad.DateCollected).format();
    var body = {
      person: patientUuId,
      obsDatetime: date,
      concept: "a8982474-1350-11df-a1f1-0026b9348838",
      value: viralLoad.FinalResult
    };

    if (viralLoad['OrderNo'] && stringNotEmpty(viralLoad['OrderNo'])) {
      return attachOrderUuid(body, viralLoad['OrderNo']);
    }

    return new Promise(function (resolve, reject) {
      resolve(body);
    });

  }
  function convertViralLoadWithLessThanToRestConsumableObs(viralLoad, patientUuId) {
    var date = moment(viralLoad.DateCollected).format();
    var body = {
      person: patientUuId,
      obsDatetime: date,
      concept: "a8982474-1350-11df-a1f1-0026b9348838",
      value: 0,
      comment: '[' + viralLoad.FinalResult + ']'
    };

    if (viralLoad['OrderNo'] && stringNotEmpty(viralLoad['OrderNo'])) {
      return attachOrderUuid(body, viralLoad['OrderNo']);
    }

    return new Promise(function (resolve, reject) {
      resolve(body);
    });

  }
  function convertViralLoadExceptionToRestConsumableObs(viralLoad, patientUuId) {
    var date = moment(viralLoad.DateCollected).format();
    var body = {
      person: patientUuId,
      obsDatetime: date,
      concept: "457c741d-8f71-4829-b59d-594e0a618892"
    };
    var labExceptions = getLabExceptions();
    if (viralLoad.FinalResult.toUpperCase() in labExceptions) {
      var labTestConcept = "a8982474-1350-11df-a1f1-0026b9348838";
      var codedConceptValue = labExceptions[viralLoad.FinalResult.toUpperCase()];
      var codedPayload = generateCodedPayload(patientUuId, labTestConcept, codedConceptValue, date);
      body.concept = codedPayload.concept;
      body.groupMembers = codedPayload.groupMembers;
    }
    else {
      var value = viralLoad.FinalResult;
      var labTestConcept = "a8982474-1350-11df-a1f1-0026b9348838";
      var nonCodedPayload = generateNonCodedPayload(patientUuId, labTestConcept, value, date);
      body.concept = nonCodedPayload.concept;
      body.groupMembers = nonCodedPayload.groupMembers
    }

    if (viralLoad['OrderNo'] && stringNotEmpty(viralLoad['OrderNo'])) {
      return attachOrderUuid(body, viralLoad['OrderNo']);
    }

    return new Promise(function (resolve, reject) {
      resolve(body);
    });

  }

  function isValueEmpty(value){

    if(value === '' || value === null || value.length === 0){

        return true;

    } else {

        return false;
    }

  }

  function convertCD4PayloadTORestConsumableObs(CD4payload, patientUuId) {
    var date = moment(CD4payload.DateCollected).format();
    var body = {
      concept: "a896cce6-1350-11df-a1f1-0026b9348838",
      person: patientUuId,
      obsDatetime: date,
      groupMembers: []
    };
    if ("AVGCD3percentLymph" in CD4payload) {
      var conceptUuId = "a89c4220-1350-11df-a1f1-0026b9348838";
      var value = CD4payload.AVGCD3percentLymph;
      let isPercentLymphEmpty = isValueEmpty(value);
      if(isPercentLymphEmpty === false){

        var AVGCD3percentLymph = generateCD4PanelSingleObject(patientUuId, conceptUuId, value, date);
        body.groupMembers.push(AVGCD3percentLymph);

       }

    }
    if ("AVGCD3AbsCnt" in CD4payload) {
      var conceptUuId = "a898fcd2-1350-11df-a1f1-0026b9348838";
      var value = CD4payload.AVGCD3AbsCnt;
      let isAVGCD3AbsCntEmpty = isValueEmpty(value);
      if(isAVGCD3AbsCntEmpty === false){
        var AVGCD3AbsCnt = generateCD4PanelSingleObject(patientUuId, conceptUuId, value, date);
        body.groupMembers.push(AVGCD3AbsCnt);

      }

    }
    if ("AVGCD3CD4percentLymph" in CD4payload) {
      var conceptUuId = "a8970a26-1350-11df-a1f1-0026b9348838";
      var value = CD4payload.AVGCD3CD4percentLymph;
      let isAVGCD3CD4percentLymphEmpty = isValueEmpty(value);
      if(isAVGCD3CD4percentLymphEmpty === false){

        var AVGCD3CD4percentLymph = generateCD4PanelSingleObject(patientUuId, conceptUuId, value, date);
        body.groupMembers.push(AVGCD3CD4percentLymph);

      }
    }
    if ("AVGCD3CD4AbsCnt" in CD4payload) {
      var conceptUuId = "a8a8bb18-1350-11df-a1f1-0026b9348838";
      var value = CD4payload.AVGCD3CD4AbsCnt;
      let isAVGCD3CD4AbsCntEmpty = isValueEmpty(value);
      if(isAVGCD3CD4AbsCntEmpty === false){

        var AVGCD3CD4AbsCnt = generateCD4PanelSingleObject(patientUuId, conceptUuId, value, date);
        body.groupMembers.push(AVGCD3CD4AbsCnt);

      }
    }
    if ("CD45AbsCnt" in CD4payload) {
      var conceptUuId = "a89c4914-1350-11df-a1f1-0026b9348838";
      var value = CD4payload.CD45AbsCnt;
      let isCD45AbsCntEmpty = isValueEmpty(value);
      if(isCD45AbsCntEmpty === false){

        var CD45AbsCnt = generateCD4PanelSingleObject(patientUuId, conceptUuId, value, date);
        body.groupMembers.push(CD45AbsCnt);

      }

    }

    if (CD4payload['OrderNo'] && stringNotEmpty(CD4payload['OrderNo'])) {
      return attachOrderUuid(body, CD4payload['OrderNo']);
    }

    return new Promise(function (resolve, reject) {
      resolve(body);
    });
  }
  function convertCD4ExceptionTORestConsumableObs(CD4payload, patientUuId) {
    var date = moment(CD4payload.DateCollected).format();
    var body = {
      concept: "457c741d-8f71-4829-b59d-594e0a618892",
      person: patientUuId,
      obsDatetime: date,
      groupMembers: []
    };
    var AVGCD3percentLymph = cd4ExceptionGroupMemberGenerator(patientUuId, CD4payload, "AVGCD3percentLymph", "a89c4220-1350-11df-a1f1-0026b9348838", date);
    if (AVGCD3percentLymph.length > 0) {
      _.each(AVGCD3percentLymph, function (groupMember) {
        body.groupMembers.push(groupMember);
      });
    }
    var AVGCD3AbsCnt = cd4ExceptionGroupMemberGenerator(patientUuId, CD4payload, "AVGCD3AbsCnt", "a898fcd2-1350-11df-a1f1-0026b9348838", date);
    if (AVGCD3AbsCnt.length > 0) {
      _.each(AVGCD3AbsCnt, function (groupMember) {
        body.groupMembers.push(groupMember);
      });
    }
    var AVGCD3CD4percentLymph = cd4ExceptionGroupMemberGenerator(patientUuId, CD4payload, "AVGCD3CD4percentLymph", "a8970a26-1350-11df-a1f1-0026b9348838", date);
    if (AVGCD3CD4percentLymph.length > 0) {
      _.each(AVGCD3CD4percentLymph, function (groupMember) {
        body.groupMembers.push(groupMember);
      });
    }
    var AVGCD3CD4AbsCnt = cd4ExceptionGroupMemberGenerator(patientUuId, CD4payload, "AVGCD3CD4AbsCnt", "a8a8bb18-1350-11df-a1f1-0026b9348838", date);
    if (AVGCD3CD4AbsCnt.length > 0) {
      _.each(AVGCD3CD4AbsCnt, function (groupMember) {
        body.groupMembers.push(groupMember);
      });
    }
    var CD45AbsCnt = cd4ExceptionGroupMemberGenerator(patientUuId, CD4payload, "CD45AbsCnt", "a89c4914-1350-11df-a1f1-0026b9348838", date);
    if (CD45AbsCnt.length > 0) {
      _.each(CD45AbsCnt, function (groupMember) {
        body.groupMembers.push(groupMember);
      });
    }

    if (CD4payload['OrderNo'] && stringNotEmpty(CD4payload['OrderNo'])) {
      return attachOrderUuid(body, CD4payload['OrderNo']);
    }

    return new Promise(function (resolve, reject) {
      resolve(body);
    });

  }

  function cd4ExceptionGroupMemberGenerator(patientUuId, CD4payload, typeOfTest, labTestConcept, date) {
    var groupMembers = [];
    var labExceptions = getLabExceptions();
    if (typeOfTest in CD4payload) {
      if (CD4payload[typeOfTest].toUpperCase() in labExceptions) {
        var codedConceptValue = labExceptions[CD4payload[typeOfTest].toUpperCase()];
        var codedPayload = generateCodedPayload(patientUuId, labTestConcept, codedConceptValue, date);
        _.each(codedPayload.groupMembers, function (groupMember) {
          groupMembers.push(groupMember);
        });
      }
      else {
        var value = CD4payload[typeOfTest];
        var nonCodedPayload = generateNonCodedPayload(patientUuId, labTestConcept, value, date);
        _.each(nonCodedPayload.groupMembers, function (groupMember) {
          groupMembers.push(groupMember);
        });
      }
    }
    return groupMembers;
  }

  function convertDNAPCRPayloadTORestConsumableObs(DNAPCRPayload, patientUuId) {
    var body = {
      concept: "a898fe80-1350-11df-a1f1-0026b9348838",
      person: patientUuId
    };
    var date = moment(DNAPCRPayload.DateCollected).format();
    body.obsDatetime = date;
    console.error('DNA PCR DNAPCRPayload.FinalResult is null');
    if (DNAPCRPayload.FinalResult !== null &&
      DNAPCRPayload.FinalResult.toUpperCase() == "NEGATIVE") {
      body.value = "a896d2cc-1350-11df-a1f1-0026b9348838";
    }
    else if (DNAPCRPayload.FinalResult !== null &&
      DNAPCRPayload.FinalResult.toUpperCase() == "POSITIVE") {
      body.value = "a896f3a6-1350-11df-a1f1-0026b9348838";
    }

    if (DNAPCRPayload['OrderNo'] && stringNotEmpty(DNAPCRPayload['OrderNo'])) {
      return attachOrderUuid(body, DNAPCRPayload['OrderNo']);
    }

    return new Promise(function (resolve, reject) {
      resolve(body);
    });

  }

  function attachOrderUuid(obsPayload, orderNo) {
    return new Promise(function (resolve, reject) {
      getOrderByOrderNumber(orderNo)
        .then(function (response) {
          obsPayload.order = response.uuid;
          resolve(obsPayload);
        })
        .catch(function (error) {
          console.error('Could not fetch order uuid for:', orderNo);
          resolve(obsPayload);
        });
    });
  }

  function stringNotEmpty(val) {
    if (val && typeof val === 'string' && val.trim() !== '') {
      return true;
    }
    return false;
  }

  function getLabExceptions() {
    return {
      "POOR SAMPLE QUALITY": "a89c3f1e-1350-11df-a1f1-0026b9348838",
      "NOT DONE": "a899ea48-1350-11df-a1f1-0026b9348838",
      "INDETERMINATE": "a89a7ae4-1350-11df-a1f1-0026b9348838",
      "BELOW DETECTABLE LIMIT": "a89c3f1e-1350-11df-a1f1-0026b9348838",
      "UNABLE TO COLLECT SAMPLE": "a8afcec6-1350-11df-a1f1-0026b9348838",
      "SPECIMEN NOT RECEIVED": "0271c15e-4f7f-4a18-9b45-2d7e5b6f7057",
      "ORDERED FOR WRONG PATIENT": "3366412a-e279-4428-a671-37221804c6e6"
    }
  }
  function generateCodedPayload(patientUuId, labTestConcept, codedConceptValue, date) {
    var payload = {
      concept: "457c741d-8f71-4829-b59d-594e0a618892",
      groupMembers: [
        {
          concept: "f67ff075-f91e-4b71-897a-9ded87b34984",
          person: patientUuId,
          value: labTestConcept,
          obsDatetime: date
        },
        {
          concept: "5026a3ee-0612-48bf-b9a3-a2944ddc3e04",
          person: patientUuId,
          value: codedConceptValue,
          obsDatetime: date
        }
      ]
    }
    return payload;
  }
  function generateNonCodedPayload(patientUuId, labTestConcept, value, date) {
    var payload = {
      concept: "457c741d-8f71-4829-b59d-594e0a618892",
      groupMembers: [
        {
          concept: "f67ff075-f91e-4b71-897a-9ded87b34984",
          person: patientUuId,
          value: labTestConcept,
          obsDatetime: date
        },
        {
          concept: "a8a06fc6-1350-11df-a1f1-0026b9348838",
          person: patientUuId,
          value: value,
          obsDatetime: date
        }

      ]
    }
    return payload;
  }
  function generateCD4PanelSingleObject(patientUuId, conceptUuId, value, date) {
    var payload = {
      concept: conceptUuId,
      person: patientUuId,
      value: value,
      obsDatetime: date
    }
    return payload;
  }
  function getOrderByOrderNumber(orderNo) {
    var uri = getRestResource('/'+ config.openmrs.applicationName + '/ws/rest/v1/order/' + orderNo);
    var queryString = {
      v: 'full'
    }
    return new Promise(function (resolve, reject) {
      rp.getRequestPromise(queryString, uri)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        })
    });
  }
  return {
    convertViralLoadPayloadToRestConsumableObs: convertViralLoadPayloadToRestConsumableObs,
    convertCD4PayloadTORestConsumableObs: convertCD4PayloadTORestConsumableObs,
    convertDNAPCRPayloadTORestConsumableObs: convertDNAPCRPayloadTORestConsumableObs,
    convertViralLoadExceptionToRestConsumableObs: convertViralLoadExceptionToRestConsumableObs,
    convertCD4ExceptionTORestConsumableObs: convertCD4ExceptionTORestConsumableObs,
    generateCD4PanelSingleObject: generateCD4PanelSingleObject,
    getLabExceptions: getLabExceptions,
    cd4ExceptionGroupMemberGenerator: cd4ExceptionGroupMemberGenerator,
    checkStatusOfViralLoad: checkStatusOfViralLoad,
    generateNonCodedPayload: generateNonCodedPayload,
    generateCodedPayload: generateCodedPayload,
    removeWhiteSpace: removeWhiteSpace,
    cd4PanelHasValidData: cd4PanelHasValidData,
    getOrderByOrderNumber: getOrderByOrderNumber,
    getRestResource: getRestResource,
    convertViralLoadWithLessThanToRestConsumableObs: convertViralLoadWithLessThanToRestConsumableObs,
    cd4PanelHasErrors: cd4PanelHasErrors,
    generateCd4Exceptions: generateCd4Exceptions,
    generateCd4ValidData: generateCd4ValidData
  }
}();
