"use strict";

const _ = require('lodash');
const dao = require('../etl-dao');
const programsConfig = require('../programs/program-visits-config');
var encounterTypeService = require('../encounter-type/encounter-type-service.js');
var encounterUuidtoIdMapping;

var def = {
     getProgramConf:  getProgramConf,
     resolveToEncounterIds: resolveToEncounterIds,
     getEncounterIdsFromRequestUuids: getEncounterIdsFromRequestUuids
};


module.exports = def;

function getProgramConf(){
    return programsConfig;
}


function resolveToEncounterIds(request){

     var encodedUrl = request.programVisitEncounter;
     var decodedUrl  = JSON.parse((decodeURI(encodedUrl)));
     var resolvedEncounterUUids = [0];
     var programTypeUuid = [], visitTypeUuid = [] , encounterTypeUuid = [];
     var visitTypeEncounterUUid = [];

      if(decodedUrl.programType){
            var programTypeUuid = decodedUrl.programType;
      } 
     if(decodedUrl.visitType){
          var visitTypeUuid = decodedUrl.visitType;
      }

      if(decodedUrl.encounterType){
            var encounterTypeUuid = decodedUrl.encounterType;
       }

       console.log('Decoded Url', decodedUrl);


if(programTypeUuid.length > 0 && visitTypeUuid.length === 0 && encounterTypeUuid.length === 0){  
         _.each(programsConfig,(program,index) => {
                        if(_.includes(programTypeUuid,index) === true){
                                  var visitTypes = program.visitTypes;
                                    _.each(visitTypes,(visitType) => {                                                          
                                                    var encounterTypes = visitType.encounterTypes;  
                                                      _.each(encounterTypes, (encounterType) => {
                                                            var encounterUuid = encounterType.uuid;
                                                            if(_.includes(visitTypeEncounterUUid,encounterUuid) === false){
                                                                var encounterId = encounterTypeService.getEncounterIdFromUuid(encounterUuid);
                                                                 resolvedEncounterUUids.push(encounterId);
                                                                 visitTypeEncounterUUid.push(encounterUuid);

                                                            }
                                                               
                                                  });
                                                              
                                    });

                         }        
 
           });



} 
else if(programTypeUuid.length > 0 && visitTypeUuid.length > 0 && encounterTypeUuid.length === 0){

                _.each(programsConfig,(program,index) => {

                                  if(_.includes(programTypeUuid,index) === true){
                                            var visitTypes = program.visitTypes;
                                              _.each(visitTypes,(visitType) => {

                                                var visitUuid = visitType.uuid;
                                        
                                                     if(_.includes(visitTypeUuid,visitUuid) === true){
                                                                    
                                                                var encounterTypes = visitType.encounterTypes;  

                                                                _.each(encounterTypes, (encounterType) => {
                                                                         var encounterUuid = encounterType.uuid;
                                                                          if(_.includes(visitTypeEncounterUUid,encounterUuid) === false){
                                                                                var encounterId = encounterTypeService.getEncounterIdFromUuid(encounterUuid);
                                                                                resolvedEncounterUUids.push(encounterId);
                                                                                visitTypeEncounterUUid.push(encounterUuid);
                                                                          }

                                                                    });

                                                             }

                                                                });

                                                       }

                                                                        
                                                                    

                                              });      
           

}

else if(programTypeUuid.length > 0 && visitTypeUuid.length > 0 && encounterTypeUuid.length > 0){
                  _.each(programsConfig,(program,index) => {
                                  if(_.includes(programTypeUuid,index) === true){
                                            var visitTypes = program.visitTypes;
                                              _.each(visitTypes,(visitType) => {
                                                var visitUuid = visitType.uuid;                                       
                                                     if(_.includes(visitTypeUuid,visitUuid) === true){                                                                  
                                                          var encounterTypes = visitType.encounterTypes;  
                                                                _.each(encounterTypes, (encounterType) => {
                                                                        var encounterUuid = encounterType.uuid;
                                                                            if(_.includes(visitTypeEncounterUUid,encounterUuid) === false){
                                                                                    if(_.includes(encounterTypeUuid,encounterUuid) === true){
                                                                                        var encounterId = encounterTypeService.getEncounterIdFromUuid(encounterUuid);
                                                                                        resolvedEncounterUUids.push(encounterId);
                                                                                        visitTypeEncounterUUid.push(encounterUuid);
                                                                                        }
                                                                            }

                                                                });

                                                       }
                                                                        
                                                                    

                                              });

                                   } else {
                                         

                                   }

                                         
           
                     });

}
else if(programTypeUuid.length === 0 && visitTypeUuid.length === 0 && encounterTypeUuid.length > 0){

                  _.each(programsConfig,(program,index) => {
                                            var visitTypes = program.visitTypes;
                                              _.each(visitTypes,(visitType) => {
                                                   var visitUuid = visitType.uuid;                                                                  
                                                   var encounterTypes = visitType.encounterTypes;  
                                                            _.each(encounterTypes, (encounterType) => {
                                                                    var encounterUuid = encounterType.uuid;
                                                                        if(_.includes(visitTypeEncounterUUid,encounterUuid) === false){
                                                                            if(_.includes(encounterTypeUuid,encounterUuid) === true){                                                                       
                                                                                var encounterId = encounterTypeService.getEncounterIdFromUuid(encounterUuid);
                                                                                resolvedEncounterUUids.push(encounterId);
                                                                                visitTypeEncounterUUid.push(encounterUuid);
                                                                                }
                                                                        }

                                                                });

                                                       
                                                                        
                                                                    

                                              });   
           
                     });

}


return resolvedEncounterUUids;

}
// get the request and resolve filter params to encounter ids

function getEncounterIdsFromRequestUuids(request){

     return new Promise(function (resolve, reject) {

    var encounterTypes = encounterTypeService.loadAndMapEncounterUuidToId()
                    .then((result) => {
                          var resolvedEncounterUuid = resolveToEncounterIds(request);
                          resolve(resolvedEncounterUuid);

                    })
                    .catch((error)=> {
                            console.log('Error');
                            reject(error);
                    });

     });

}










