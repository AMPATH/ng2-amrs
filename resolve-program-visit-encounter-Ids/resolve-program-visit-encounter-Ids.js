"use strict";

const _ = require('lodash');
const dao = require('../etl-dao');
const programsConfig = require('../programs/patient-program-config');
var encounterTypeService = require('../encounter-type/encounter-type-service.js');
var visitTypeService = require('../visit-type/visit-type-service');
var programTypeService = require('../programs/program-type.service');
var encounterUuidtoIdMapping;
var visitTypeUuidMapping;

var def = {
     getProgramConf:  getProgramConf,
     getProgramVisitEncounterUUidIdMap: getProgramVisitEncounterUUidIdMap,
     resolveProgramVisitTypeEncounterUuidsParamsToIds: resolveProgramVisitTypeEncounterUuidsParamsToIds,
     
};


module.exports = def;

function getProgramConf(){
    return programsConfig;
}

//Get ProgramType, Visit Type , Encounter Type uuid-id map

function getProgramVisitEncounterUUidIdMap(){

      var programTypeMap = new Map();
      var visitTypeMap = new Map();
      var encounterMap =  new Map();
      var resolveCount = 0;

       return new Promise(function (resolve, reject) {

                function checkResolveCount(){
                       // console.log('Resolve Count', resolveCount);
                      if(resolveCount == 3){

                            let resolvedIds = {
                                  'programType':programTypeMap,
                                  'visitType': visitTypeMap,
                                  'encounterMap': encounterMap

                            }
                            
                            resolve(resolvedIds);

                      }
                }
      
                 //first get the program map

                  programTypeService.loadAndMapProgramUuidToId().then((result)=>{
                        programTypeMap = result;
                        resolveCount++;
                        checkResolveCount();
                        // console.log('All Program Types', result);
                  })
                  .catch(function(e) {
                         resolveCount++;
                         checkResolveCount();
                         console.log("handled error", e);
                  });;

                  // next get the visit type map

                  visitTypeService.loadAndMapVisitTypeUuidToId().then((result)=>{
                        visitTypeMap = result;
                        resolveCount++;
                        checkResolveCount();
                        // console.log('All Visit Types', result);
                  })
                  .catch(function(e) {
                        resolveCount++;
                        checkResolveCount();
                        console.log("handled error", e);
                  });;

                  // get encounter type map

                  encounterTypeService.loadAndMapEncounterUuidToId().then((result)=>{
                        encounterMap = result;
                        resolveCount++;
                        checkResolveCount();
                        // console.log('All Encounter Types', result);
                  })
                  .catch(function(e) {
                        resolveCount++;
                        checkResolveCount();
                        console.log("handled error", e);
                  });;





   });

}

function resolveProgramVisitTypeEncounterUuidsParamsToIds(request){

      var programVisitTypeEncounterMap = {};
      var resolvedPrograms = [-1];
      var resolvedVisitTypes = [-1];
      var resolvedEncounterTypes = [-1];
      var resolveCount = 0;
      var resolvedProgramVisitEncounterTypes = {
            'programTypeIds': [],
            'visitTypesIds': [],
            'encounterTypeIds':  []
      };

      var encodedUrl = request.programVisitEncounter;
      var decodedUrl  = JSON.parse((decodeURI(encodedUrl)));
      // console.log('Decoded Url', decodedUrl);
      var programTypeUuid = [], visitTypeUuid = [] , encounterTypeUuid = [];
      var visitTypeEncounterUUid = [];

      if(typeof decodedUrl.programType !== 'undefined'){
          programTypeUuid = decodedUrl.programType;
      }
      if(typeof decodedUrl.visitType !== 'undefined'){
          visitTypeUuid = decodedUrl.visitType;
      }
      if(typeof decodedUrl.encounterType !== 'undefined'){
         encounterTypeUuid = decodedUrl.encounterType;
      }

       return new Promise(function (resolve, reject) {

       function checkResolveCount(){
             if(resolveCount > 0){
                 resolve(resolvedProgramVisitEncounterTypes);
             }else{
                  reject('Error')
             }
       }

        getProgramVisitEncounterUUidIdMap().
                  then((result)=>{
                        programVisitTypeEncounterMap = result;
                        var programMap = programVisitTypeEncounterMap.programType;
                        var visitTypeMap = programVisitTypeEncounterMap.visitType;
                        var encounterMap = programVisitTypeEncounterMap.encounterMap;
                        // console.log('All Program/VisitType/Encounter Types', result);
                        if (programTypeUuid.length > 0 && visitTypeUuid.length === 0 && encounterTypeUuid.length === 0) {
                              _.each(programsConfig, (program, index) => {
                                    if (_.includes(programTypeUuid, index) === true) {
                                          var programUUid = index;
                                          var programId = programMap.get(index);
                                          if(typeof programId !== 'undefined'){
                                               
                                                resolvedPrograms.push(programId);

                                          }else{
                                                console.error('ERROR : Undefined ProgramType uuid', programUUid);
                                          }
                                          var visitTypes = program.visitTypes;
                                          _.each(visitTypes, (visitType) => {
                                                var visitUuid = visitType.uuid;
                                                var visitId = visitTypeMap.get(visitUuid);
                                                if(typeof visitId !== 'undefined'){
                                                      
                                                      resolvedVisitTypes.push(visitId);

                                                }else{
                                                      console.error('ERROR : Undefined VisitType uuid', visitUuid);
                                                }
                                                var encounterTypes = visitType.encounterTypes;
                                                _.each(encounterTypes, (encounterType) => {
                                                      var encounterUuid = encounterType.uuid;
                                                      var encounterId = encounterMap.get(encounterUuid);
                                                      if(typeof encounterId !== 'undefined'){
                                                           
                                                            resolvedEncounterTypes.push(encounterId);

                                                      }else{

                                                            console.error('ERROR : Undefined EncounterType uuid', encounterUuid);

                                                      }

                                                });

                                          });

                                    }

                              });



                        }

                        else if (programTypeUuid.length > 0 && visitTypeUuid.length > 0 && encounterTypeUuid.length === 0) {
                              _.each(programsConfig, (program, index) => {
                                    if (_.includes(programTypeUuid, index) === true) {
                                          var programUUid = index;
                                          var programId = programMap.get(index);
                                          if(typeof programId !== 'undefined'){
                                                resolvedPrograms.push(programId);

                                          }else{

                                                console.error('ERROR : Undefined ProgramType uuid', programUUid);

                                          }
                                          var visitTypes = program.visitTypes;
                                          _.each(visitTypes, (visitType) => {
                                                var visitUuid = visitType.uuid;
                                                if (_.includes(visitTypeUuid, visitUuid) === true) {
                                                      var visitId = visitTypeMap.get(visitUuid);
                                                      if(typeof visitId !== 'undefined'){
                                                            resolvedVisitTypes.push(visitId);
      
                                                      }else{
                                                            console.error('ERROR : Undefined VisitType uuid', visitUuid);
                                                      }
                                                      var encounterTypes = visitType.encounterTypes;
                                                      _.each(encounterTypes, (encounterType) => {
                                                            var encounterUuid = encounterType.uuid;
                                                            var encounterId = encounterMap.get(encounterUuid);
                                                            if(typeof encounterId !== 'undefined'){
                                                                  resolvedEncounterTypes.push(encounterId);

                                                            }else{
                                                                  console.error('ERROR : Undefined EncounterType uuid', encounterUuid);
                                                            }
                                                            
                                                            
                                                      });
                                                }
                                          });

                                    }

                              });


                        }
                        else if (programTypeUuid.length > 0 && visitTypeUuid.length > 0 && encounterTypeUuid.length > 0) {
                              _.each(programsConfig, (program, index) => {
                                    if (_.includes(programTypeUuid, index) === true) {
                                          var programUUid = index;
                                          var programId = programMap.get(index);
                                          if(typeof programId !== 'undefined'){
                                                resolvedPrograms.push(programId);

                                          }else{

                                                console.error('ERROR : Undefined ProgramType uuid', programUUid);

                                          }
                                          var visitTypes = program.visitTypes;
                                          _.each(visitTypes, (visitType) => {
                                                var visitUuid = visitType.uuid;
                                                if (_.includes(visitTypeUuid, visitUuid) === true) {
                                                      var visitId = visitTypeMap.get(visitUuid);
                                                      if(typeof visitId !== 'undefined'){
                                                            
                                                            resolvedVisitTypes.push(visitId);
      
                                                      }else{

                                                            console.error('ERROR : Undefined VisitType uuid', visitUuid);

                                                      }
                                                      var encounterTypes = visitType.encounterTypes;
                                                      _.each(encounterTypes, (encounterType) => {
                                                            var encounterUuid = encounterType.uuid;
                                                            if (_.includes(encounterTypeUuid, encounterUuid) === true) {
                                                                  var encounterId = encounterMap.get(encounterUuid);
                                                                  if(typeof encounterId !== 'undefined'){
                                                                        
                                                                        resolvedEncounterTypes.push(encounterId);
            
                                                                  }else{

                                                                        console.error('ERROR:Undefined EncounterType uuid', encounterUuid);

                                                                  }
                                                            };
                                                      });
                                                }
                                          });

                                    }

                              });

                        }

                              resolvedProgramVisitEncounterTypes = {
                                    'programTypeIds': _.uniq(resolvedPrograms),
                                    'visitTypesIds': _.uniq(resolvedVisitTypes),
                                    'encounterTypeIds':  _.uniq(resolvedEncounterTypes)
                              }

                              resolveCount++;


                             checkResolveCount();
                  })
                  .catch(function(e) {
                         console.log("handled error", e);
                  });;

       });

}








