/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var Promise = require('bluebird');
var _ = require('underscore');
var http = require('http');
var https = require('https');
var Promise=require('bluebird');
var rp = require('../request-config');
var config = require('../conf/config');
var moment=require('moment');
var comparison=require('../eid-obs-compare');
var obsService=require('./openmrs-rest/obs.service');
var etlLogger = require('../etl-file-logger');
module.exports = function() {
  function getEIDResource(path){
    var link=config.eid.ampath[0].host+':'+config.eid.ampath[0].port+path;
    return link;
  }
  function getEIDCD4PanelResource(path){
    var link=config.eid.ampath[1].host+':'+config.eid.ampath[1].port+path;
    return link;
  }
  function getAlupeResource(path){
    var link=config.eid.alupe[0].host+':'+config.eid.alupe[0].port+path;
    return link;
  }
  function getAlupeCD4PanelResource(path){
    var link=config.eid.alupe[1].host+':'+config.eid.alupe[1].port+path;
    return link;
  }
 function getEIDTestResultsByPatientIdentifier(patientIdentifier,startDate,endDate){
  var results={
  }
  var viralLoadResults=getEIDViralLoadTestResultsByPatientIdentifier(patientIdentifier);
  var pcrResults=getEIDPCRTestResultsByPatientIdentifier(patientIdentifier);
  var cd4Panel=getEIDCD4PanelTestResultsByPatientIdentifier(patientIdentifier,startDate,endDate);
  return new Promise(function(resolve,reject){
    viralLoadResults.then(function(vlData){
      results.viralLoad=vlData;
      return pcrResults
    })
    .then(function(pcrData){
      results.pcr=pcrData;
      return cd4Panel
    })
    .then(function(cd4Data){
      results.cd4Panel=cd4Data;
      resolve(results);
    })
    .catch(function(error){
      reject(error);
     etlLogger.logRequestError('Error getting eid results by patient identifier. Details:' + error, config.logging.eidFile, config.logging.eidPath);
      //console.error("error getEIDTestResultsByPatientIdentifier +++++++++++++++++++++++++++++++++++++++",error);
    })
});
}
function getAllEIDTestResultsByPatientUuId(patientUuId,startDate,endDate){
  var allResults=[];
    var promiseArray=[];
    return new Promise(function(resolve,reject){
      obsService.getPatientIdentifiers(patientUuId)
      .then(function(response){
        var promise=getEIDTestResultsByPatientIdentifier(response.identifiers,startDate,endDate);
        return promise;
      })
      .then(function(response){
        resolve(response);
        console.log("response++++++++++++++++++++++++++++++++++++++++++++++++++++",response);
      })
      .catch(function(error){
        reject(error);
        //etlLogger.logRequestError('Error getting eid results. Details:' + error, config.logging.eidFile, config.logging.eidPath);
      })
  });
}
function getEIDViralLoadTestResultsByPatientIdentifier(patientIdentifier){
  var viralLoadArray=[];
  var uri=getEIDResource(config.eid.ampath[0].path);
  var queryString={
    apikey:config.eid.ampath[0].apikey,
    test:2,
    patientID:patientIdentifier
  }
  var alupeUri=getAlupeResource(config.eid.alupe[0].path);
  var alupeQueryString={
    apikey:config.eid.alupe[0].apikey,
    test:2,
    patientID:patientIdentifier
  }
  return new Promise(function(resolve,reject){
    var alupeVLPromise=rp.getRequestPromise(alupeQueryString,alupeUri);
    rp.getRequestPromise(queryString,uri)
    .then(function(response){
      viralLoadArray=response.posts;
      return alupeVLPromise;
    })
    .then(function(response){
      var concatenatedArray =viralLoadArray.concat(response.posts);
      resolve(concatenatedArray);
    })
    .catch(function(error){
      reject(error);
      //console.error("getEIDViralLoadTestResultsByPatientIdentifier++++++++++++++++++++++++++++++++++++++++",error);
       etlLogger.logRequestError('Viral load request error. Details:' + error, config.logging.eidFile, config.logging.eidPath);
    })
  })
}
function getEIDPCRTestResultsByPatientIdentifier(patientIdentifier){
  var pcrArray=[];
  var uri=getEIDResource(config.eid.ampath[0].path);
  var queryString={
    apikey:config.eid.ampath[0].apikey,
    test:1,
    patientID:patientIdentifier
  }
  var alupeUri=getAlupeResource(config.eid.alupe[0].path);
  var alupeQueryString={
    apikey:config.eid.alupe[0].apikey,
    test:1,
    patientID:patientIdentifier
  }
  return new Promise(function(resolve,reject){
    var alupePcrPromise=rp.getRequestPromise(alupeQueryString,alupeUri);
    rp.getRequestPromise(queryString,uri)
    .then(function(response){
      pcrArray=response.posts;
      return alupePcrPromise;
    })
    .then(function(response){
      var concatenatedArray=pcrArray.concat(response.posts);
      resolve(concatenatedArray);
    })
    .catch(function(error){
      reject(error);
      //console.error("getEIDPCRTestResultsByPatientIdentifier++++++++++++++++++++++++++++++",error);
      etlLogger.logRequestError('DNA PCR request error. Details:' + error, config.logging.eidFile, config.logging.eidPath);
    })
  })
}
function getEIDCD4PanelTestResultsByPatientIdentifier(patientIdentifier,startDate,endDate){
  var uri=module.exports.getEIDCD4PanelResource(config.eid.ampath[1].path);
  var queryString={
    apikey:config.eid.ampath[1].apikey,
    "patientID":patientIdentifier,
    startDate:startDate,
    endDate:endDate
  }
  var alupeUri=getAlupeResource(config.eid.alupe[1].path);
  var alupeQueryString={
    apikey:config.eid.alupe[1].apikey,
    patientID:patientIdentifier
  }
  return new Promise(function(resolve,reject){
    var cd4Promise=rp.getRequestPromise(queryString,uri);
    rp.getRequestPromise(queryString,uri)
    .then(function(response){
      resolve(response.posts);
    })
    .catch(function(error){
      reject(error);
      //console.error("getEIDCD4PanelTestResultsByPatientIdentifier++++++++++++++++++++++++++++++++++++",error);
      etlLogger.logRequestError('CD4 panel request error. Details:' + error, config.logging.eidFile, config.logging.eidPath);
    })
  })
}

 function getSynchronizedPatientLabResults(request,reply){
   var promise1=getAllEIDTestResultsByPatientUuId(request.query.patientUuId,request.query.startDate,request.query.endDate);
   var promise2=obsService.getPatientAllTestObsByPatientUuId(request.query.patientUuId);
   var mergedEidResults={};
 return new Promise(function(resolve,reject){
   promise1.then(function(response){
     mergedEidResults=response;
     return promise2;
   })
   .then(function(obsResponse){
     var missingResult=comparison.findAllMissingEidResults(mergedEidResults,obsResponse);
     if(!_.isEmpty(missingResult)){
       obsService.postAllObsToAMRS(missingResult,request.query.patientUuId);
     }
     return obsService.getPatientTodaysTestObsByPatientUuId(request.query.patientUuId)
     .then(function(response){
       reply({updatedObs:response});
     });
   })   
   .catch(function(error){
     reject(error);
     etlLogger.logRequestError('SynchronizedPatientLabResults request error. Details:' + error, config.logging.eidFile, config.logging.eidPath);
   })
 });
 }
 return {
   getSynchronizedPatientLabResults:getSynchronizedPatientLabResults,
   getAllEIDTestResultsByPatientUuId:getAllEIDTestResultsByPatientUuId,
   getEIDTestResultsByPatientIdentifier:getEIDTestResultsByPatientIdentifier,
   getEIDViralLoadTestResultsByPatientIdentifier:getEIDViralLoadTestResultsByPatientIdentifier,
   getEIDResource:getEIDResource,
   getEIDPCRTestResultsByPatientIdentifier:getEIDPCRTestResultsByPatientIdentifier,
   getEIDCD4PanelTestResultsByPatientIdentifier:getEIDCD4PanelTestResultsByPatientIdentifier,
   getEIDCD4PanelResource:getEIDCD4PanelResource
 }
 }();
