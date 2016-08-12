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
var db=require('../etl-db');
var eidResultsSchema=require('../eid-lab-results');
module.exports = function() {
  function getResource(host,apiKey){
    var link=host+':'+config.eid.port+config.eid.generalPath;
    var queryString={
      apikey:apiKey
    }
    var resource={
      uri:link,
      query:queryString
    }
    return resource;
  }
  function getCd4Resource(host,apiKey){
    var link=host+':'+config.eid.port+config.eid.cd4PanelPath;
    var queryString={
      apikey:apiKey
    }
    var resource={
      uri:link,
      query:queryString
    }
    return resource;
  }
  function getEIDTestResultsByPatientIdentifier(patientIdentifier){
   var results={
     viralLoad:[],
     pcr:[],
     cd4Panel:[],
     serverStatus:[
     {name:"ampath viral load",isUp:false},
     {name:"ampath PCR",isUp:false},
     {name:"ampath Cd4",isUp:false},
     {name:"alupe viral load",isUp:false},
     {name:"alupe PCR",isUp:false}
   ]
   }
   return new Promise(function(resolve,reject){
   getViralLoadTestResultsByPatientIdentifier(patientIdentifier,config.eid.host.ampath,config.eid.ampath.generalApiKey)
   .then(function(response){
     if(response.posts instanceof Array){
      results.viralLoad=response.posts;
      results.serverStatus[0].isUp=true;
     }
     else{
       results.ampathViralLoadErrorMsg=response;
     }
     return getPcrTestResultsByPatientIdentifier(patientIdentifier,config.eid.host.ampath,config.eid.ampath.generalApiKey);
   })
   .then(function(response){
     if(response.posts instanceof Array){
       results.pcr=response.posts;
       results.serverStatus[1].isUp=true;
     }
     else{
       results.ampathPcrErrorMsg=response;
     }
     return getCd4TestResultsByPatientIdentifier(patientIdentifier,config.eid.host.ampath,
     config.eid.ampath.cd4ApiKey);
   })
   .then(function(response){
     if(response.posts instanceof Array){
      results.cd4Panel=response.posts;
      results.serverStatus[2].isUp=true;
     }
     else{
       results.ampathCd4ErrorMsg=response;
     }
     return getViralLoadTestResultsByPatientIdentifier(patientIdentifier,config.eid.host.alupe,
       config.eid.alupe.generalApiKey);
   })
   .then(function(response){
     if(response.posts instanceof Array){
       results.serverStatus[3].isUp=true;
     _.each(response.posts,function(viralLoad){
       results.viralLoad.push(viralLoad);
     })
   }
   else{
     results.AlupeViralLoadErrorMsg=response;
   }
     return getPcrTestResultsByPatientIdentifier(patientIdentifier,config.eid.host.alupe,
       config.eid.alupe.generalApiKey);
   })
   .then(function(response){
     if(response.posts instanceof Array){
       results.serverStatus[4].isUp=true;
     _.each(response.posts,function(pcr){
       results.pcr.push(pcr);
     })
   }
   else{
     results.AlupePcrErrorMsg=response;
   }
     setTimeout(resolve(results),60000);
   })
 });
 }
function getAllEIDTestResultsByPatientUuId(patientUuId){
    return new Promise(function(resolve,reject){
      obsService.getPatientIdentifiers(patientUuId)
      .then(function(response){
        return getEIDTestResultsByPatientIdentifier(response.identifiers)
      })
      .then(function(eidResponse){
        resolve(eidResponse);
      })
      .catch(function(error){
        reject(error);
        //etlLogger.logRequestError('Error getting eid results. Details:' + error, config.logging.eidFile, config.logging.eidPath);
      })
  });
}
function getViralLoadTestResultsByPatientIdentifier(patientIdentifier,host,key){
  var resource=getResource(host,key);
  var queryString=resource.query;
  queryString.patientID=patientIdentifier;
  queryString.test=2;
  var promise=rp.getRequestPromise(queryString,resource.uri);
  return new Promise(function(resolve,reject){
    setTimeout(resolve(promise),30000);
  });
}
function getPcrTestResultsByPatientIdentifier(patientIdentifier,host,key){
  var resource=getResource(host,key);
  var queryString=resource.query;
  queryString.patientID=patientIdentifier;
  queryString.test=1;
  var ampathPcrPromise=rp.getRequestPromise(queryString,resource.uri);
  return new Promise(function(resolve,reject){
    setTimeout(resolve(ampathPcrPromise),30000);
    //getResultsFromSingleServer(ampathPcrPromise,resolve,reject);
  });
}
function getCd4TestResultsByPatientIdentifier(patientIdentifier,host,key){
  var startDate=moment(new Date('2004-01-01')).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
  var endDate=moment(new Date()).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
  var resource=getCd4Resource(host,key);
  var queryString=resource.query;
  queryString.patientID=patientIdentifier;
  queryString.startDate=startDate;
  queryString.endDate=endDate;
  var ampathCd4Promise=rp.getRequestPromise(queryString,resource.uri);
  return new Promise(function(resolve,reject){
    setTimeout(resolve(ampathCd4Promise),30000);
    //getResultsFromSingleServer(ampathCd4Promise,resolve,reject);
  });
}
 function getSynchronizedPatientLabResults(patientUuId,reply){
   var queryParts = {
     columns:[eidResultsSchema.patientLabResultsSchema.parameters[1].name,
   eidResultsSchema.patientLabResultsSchema.parameters[2].name,
   eidResultsSchema.patientLabResultsSchema.parameters[3].name],
     table: eidResultsSchema.patientLabResultsSchema.table.schema+'.'
     +eidResultsSchema.patientLabResultsSchema.table.tableName +' ',
     values:[patientUuId]
   };
   var promise1=getAllEIDTestResultsByPatientUuId(patientUuId);
   var promise2=obsService.getPatientAllTestObsByPatientUuId(patientUuId);
   var mergedEidResults={};
 return new Promise(function(resolve,reject){
   promise1.then(function(response){
     mergedEidResults=response;
     return promise2;
   })
   .then(function(obsResponse){
     var missingResult=comparison.findAllMissingEidResults(mergedEidResults,obsResponse);
    return obsService.postAllObsToAMRS(missingResult,patientUuId);
  })
   .then(function(postResponse){
     var serversWithDownTime=[];
     _.each(mergedEidResults.serverStatus,function(server){
       if(server.isUp==false){
         serversWithDownTime.push(server.name);
       }
     });
     postResponse.push({serverStatus:serversWithDownTime});
     resolve({updatedObs:postResponse});
     reply({updatedObs:postResponse});
     saveEidSyncLog(queryParts,function(response){});
   })
   .catch(function(error){
     reject(error);
     etlLogger.logRequestError('SynchronizedPatientLabResults request error. Details:' + error, config.logging.eidFile, config.logging.eidPath);
   })
 });
 }
 function saveEidSyncLog(queryParts,callback){
   db.insertQueryServer(queryParts,function(result){
     callback(result);
   });
 }
 function updateEidSyncLog(queryParts,callback){
   db.updateQueryServer(queryParts,function(result){
     callback(result);
   });
 }
 return {
   getSynchronizedPatientLabResults:getSynchronizedPatientLabResults,
   getAllEIDTestResultsByPatientUuId:getAllEIDTestResultsByPatientUuId,
   getEIDTestResultsByPatientIdentifier:getEIDTestResultsByPatientIdentifier,
   saveEidSyncLog:saveEidSyncLog,
   updateEidSyncLog:updateEidSyncLog,
   getViralLoadTestResultsByPatientIdentifier:getViralLoadTestResultsByPatientIdentifier,
   getCd4TestResultsByPatientIdentifier:getCd4TestResultsByPatientIdentifier,
   getPcrTestResultsByPatientIdentifier:getPcrTestResultsByPatientIdentifier,
   getResource:getResource,
   getCd4Resource:getCd4Resource
 }
 }();
