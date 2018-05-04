"use strict";

const _ = require('lodash');
const dao = require('../etl-dao');
const programsConfig = require('../programs/program-visits-config');
var encounterTypeService = require('../encounter-type/encounter-type-service.js');
var visitTypeService = require('../visit-type/visit-type-service');
var programTypeService = require('../programs/program-type.service');
var encounterUuidtoIdMapping;
var visitTypeUuidMapping;

var def = {
     getProgramConf:  getProgramConf,
     getProgramVisitEncounterUUidIdMap: getProgramVisitEncounterUUidIdMap,
     resolveProgramVisitTypeEncounterUuidsParamsToIds: resolveProgramVisitTypeEncounterUuidsParamsToIds   
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

      if(typeof request.programType !== 'undefined'){
          var programTypeUuid = request.programType;
      }
      if(typeof request.visitType !== 'undefined'){
          var visitTypeUuid = request.visitType;
      }
      if(typeof request.encounterType !== 'undefined'){
         var encounterTypeUuid = request.encounterType;
      }

      // console.log('Program Type', decodedUrl);

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
                        let programDefined = typeof programTypeUuid;
                        let visittypeDefined = typeof visitTypeUuid;
                        let encounterDefined = typeof encounterUuid; 
                        if (programDefined !== 'undefined'  && visittypeDefined === 'undefined' && encounterDefined === 'undefined') {
                              // console.log('programTypeUuid.length > 0 && visitTypeUuid.length === 0 && encounterTypeUuid.length === 0');
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

                        else if (programDefined !== 'undefined' && visittypeDefined !== 'undefined' && encounterDefined === 'undefined') {
                              // console.log('programTypeUuid.length > 0 && visitTypeUuid.length > 0 && encounterTypeUuid.length === 0');
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
                        else if (programDefined !== 'undefined' && visittypeDefined !== 'undefined' && encounterDefined !== 'Undefined') {
                              // console.log('programTypeUuid.length > 0 && visitTypeUuid.length > 0 && encounterTypeUuid.length > 0');
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
                        else if (programDefined === 'undefined' && visittypeDefined === 'undefined' && encounterDefined === 'undefined') {
                               // else just load everything
                               //console.log('programTypeUuid.length == 0 && visitTypeUuid.length == 0 && encounterTypeUuid.length == 0');

                              _.each(programsConfig, (program, index) => {
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
                                                      resolvedVisitTypes.push(visitId);
                                                      var encounterTypes = visitType.encounterTypes;
                                                      _.each(encounterTypes, (encounterType) => {
                                                            var encounterUuid = encounterType.uuid;
                                                            var encounterId = encounterMap.get(encounterUuid);
                                                            resolvedEncounterTypes.push(encounterId);
                                                      });
                                          });


                              });

                        }

                              resolvedProgramVisitEncounterTypes = {
                                    'programTypeIds': _.uniq(resolvedPrograms),
                                    'visitTypesIds': _.uniq(resolvedVisitTypes),
                                    'encounterTypeIds':  _.uniq(resolvedEncounterTypes)
                              }

                              resolveCount++;

                              // console.log('Resolved Ids',  resolvedProgramVisitEncounterTypes);


                             checkResolveCount();
                  })
                  .catch(function(e) {
                         console.log("handled error", e);
                  });;

       });

}








