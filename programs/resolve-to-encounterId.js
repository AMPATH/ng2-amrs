"use strict";

/*

This script resolves program, visitType and 
encounterTypes to their respective encountertypes ids
The ids resolved are used to filter data from
tables such as hiv_flat_summary using the encounter_type
field.
By doing this we avoid using multiple joins i.e  to programs,
visittypes and encountertype tables


*/
const _ = require('lodash');
const dao = require('../etl-dao');
const programsConfig = require('./program-visits-config');
var encounterIds = [];

var def = {
     getProgramConf:  getProgramConf,
     resolveToEncounterIds: resolveToEncounterIds,
     resolveEncounterUuidToEncounterId : resolveEncounterUuidToEncounterId
};

// var params = '%7B%22programType%22:%5B%22781d85b0-1359-11df-a1f1-0026b9348838%22%5D,%22visitType%22:%5B%2233d13ffb-5f0e-427e-ab80-637491fb6526%22%5D,%22encounterType%22:%5B%5D%7D';
/*
var request = {
    'programType': '781d85b0-1359-11df-a1f1-0026b9348838',
    'visitType': '',
    'encounterType':''
}
*/



module.exports = def;

function getProgramConf(){
    return programsConfig;
}



//test function

function resolveToEncounterIds(request){

     var encodedUrl = request.programVisitEncounter;

     console.log('Start Resolving ....');

     console.log('EncodedUrl ....', encodedUrl);

     var decodedUrl  = JSON.parse((decodeURI(encodedUrl)));

     console.log('Decoded Url ....', decodedUrl);

     var resolvedEncounterUUids = [];

    if(decodedUrl.programType){
            var programTypeUuid = decodedUrl.programType;
      } else {
           var programTypeUuid = [];
      }
       if(decodedUrl.visitType){
          var visitTypeUuid = decodedUrl.visitType;
      } else {
          var visitTypeUuid = [];
      }

      if(decodedUrl.encounterType){
            var encounterTypeUuid = decodedUrl.encounterType;

       } else {
           var encounterTypeUuid = [];
       }

       console.log('Program ....', programTypeUuid);
       console.log('visitTypeUuid ....', visitTypeUuid);
       console.log('encounterTypeUuid ....', encounterTypeUuid);

       


       var totalAsyncRequests = 0;
       var loopCount = 0;
       var resolvedCount = 0;

       var visitTypeEncounterUUid = [];

       return new Promise((resolve, reject) => {

       var checkAsyncState = function(){
            if(totalAsyncRequests === 0){
              console.log('Resolved', _.uniq(resolvedEncounterUUids));
              resolve(_.uniq(resolvedEncounterUUids).join());
            }
        }

        // if only program type is entered
if(programTypeUuid.length > 0 && visitTypeUuid.length === 0 && encounterTypeUuid.length === 0){

    console.log('programTypeUuid.length > 0 && visitTypeUuid.length === 0 && encounterTypeUuid.length === 0');

   
         _.each(programsConfig,(program,index) => {

                        if(_.includes(programTypeUuid,index) === true){


                                  var visitTypes = program.visitTypes;
                                    _.each(visitTypes,(visitType) => {
                                                          
                                                      var encounterTypes = visitType.encounterTypes;  

                                                      _.each(encounterTypes, (encounterType) => {
                                                                loopCount++;
                                                                console.log('Loop Count', loopCount);
                                                                var encounterUuid = encounterType.uuid;
                                                                visitTypeEncounterUUid.push(encounterUuid);

                                                                 totalAsyncRequests++;
                    
                                                                 resolveEncounterUuidToEncounterId(encounterUuid)
                                                                                                  .then(function (fulfilled) {                                                           
                                                                                                      let encounterId = parseInt(fulfilled);
                                                                                                      if(isNaN(encounterId) === false){
                                                                                                           resolvedEncounterUUids.push(encounterId);
                                                                                                       }

                                                                                                      totalAsyncRequests--;
                                                                                                      resolvedCount++;
                                                                                                      console.log('Resolved Count', loopCount);
                                                                                                      checkAsyncState();

                                                                                                  })
                                                                                                  .catch(function (error) {
                                                                                                      console.log('Error Message',error);
                                                                                                  });

                                                  });
                                                              
                                                          

                                    });

                         }        
 
           });



} 
else if(programTypeUuid.length > 0 && visitTypeUuid.length > 0 && encounterTypeUuid.length === 0){

     console.log('programTypeUuid.length > 0 && visitTypeUuid.length > 0 && encounterTypeUuid.length === 0');

             //loop checking the 

                _.each(programsConfig,(program,index) => {

                                  if(_.includes(programTypeUuid,index) === true){


                                            var visitTypes = program.visitTypes;
                                              _.each(visitTypes,(visitType) => {

                                                var visitUuid = visitType.uuid;
                                        
                                                     if(_.includes(visitTypeUuid,visitUuid) === true){
                                                                    
                                                                var encounterTypes = visitType.encounterTypes;  

                                                                _.each(encounterTypes, (encounterType) => {
                                                                          var encounterUuid = encounterType.uuid;
                                                                          visitTypeEncounterUUid.push(encounterUuid);

                                                                           totalAsyncRequests++;
                    
                                                                             resolveEncounterUuidToEncounterId(encounterUuid)
                                                                                                              .then(function (fulfilled) {                                                           
                                                                                                                  let encounterId = parseInt(fulfilled);
                                                                                                                  if(isNaN(encounterId) === false){
                                                                                                                       resolvedEncounterUUids.push(encounterId);
                                                                                                                   }

                                                                                                                  totalAsyncRequests--;
                                                                                                                  checkAsyncState();

                                                                                                              })
                                                                                                              .catch(function (error) {
                                                                                                                  console.log('Error Message',error);
                                                                                                              });

                                                                    });

                                                             }

                                                                });

                                                       }

                                                       // checkAsyncState();
                                                                        
                                                                    

                                              });      
           

}

else if(programTypeUuid.length > 0 && visitTypeUuid.length > 0 && encounterTypeUuid.length > 0){

     console.log('programTypeUuid.length > 0 && visitTypeUuid.length > 0 && encounterTypeUuid.length > 0');

                  _.each(programsConfig,(program,index) => {

                                  if(_.includes(programTypeUuid,index) === true){


                                            var visitTypes = program.visitTypes;
                                              _.each(visitTypes,(visitType) => {

                                                var visitUuid = visitType.uuid;
                                        
                                                     if(_.includes(visitTypeUuid,visitUuid) === true){
                                                                    
                                                                var encounterTypes = visitType.encounterTypes;  

                                                                _.each(encounterTypes, (encounterType) => {
                                                                          var encounterUuid = encounterType.uuid;
                                                                          if(_.includes(encounterTypeUuid,encounterUuid) === true){

                                                                               totalAsyncRequests++;
                                                                               visitTypeEncounterUUid.push(encounterUuid);
                                                                                resolveEncounterUuidToEncounterId(encounterUuid)
                                                                                                              .then(function (fulfilled) {                                                           
                                                                                                                  let encounterId = parseInt(fulfilled);
                                                                                                                  if(isNaN(encounterId) === false){
                                                                                                                       resolvedEncounterUUids.push(encounterId);
                                                                                                                   }

                                                                                                                  totalAsyncRequests--;
                                                                                                                  checkAsyncState();

                                                                                                              })
                                                                                                              .catch(function (error) {
                                                                                                                  console.log('Error Message',error);
                                                                                                              });


                                                                            }

                                                                });

                                                       }
                                                                        
                                                                    

                                              });

                                   } else {
                                         
                                         checkAsyncState();

                                   }

                                         
           
                     });

}
else if(programTypeUuid.length === 0 && visitTypeUuid.length === 0 && encounterTypeUuid.length > 0){

    console.log('programTypeUuid.length === 0 && visitTypeUuid.length === 0 && encounterTypeUuid.length > 0');

                  _.each(programsConfig,(program,index) => {

                                  


                                            var visitTypes = program.visitTypes;
                                              _.each(visitTypes,(visitType) => {

                                                var visitUuid = visitType.uuid;
                                                                    
                                                                var encounterTypes = visitType.encounterTypes;  

                                                                _.each(encounterTypes, (encounterType) => {
                                                                          var encounterUuid = encounterType.uuid;
                                                                          if(_.includes(encounterTypeUuid,encounterUuid) === true){
                                                                          
                                                                               visitTypeEncounterUUid.push(encounterUuid);
                                                                               totalAsyncRequests++;
                                                                                resolveEncounterUuidToEncounterId(encounterUuid)
                                                                                                              .then(function (fulfilled) {                                                           
                                                                                                                  let encounterId = parseInt(fulfilled);
                                                                                                                  if(isNaN(encounterId) === false){
                                                                                                                       resolvedEncounterUUids.push(encounterId);
                                                                                                                   }

                                                                                                                  totalAsyncRequests--;
                                                                                                                  checkAsyncState();

                                                                                                              })
                                                                                                              .catch(function (error) {
                                                                                                                  console.log('Error Message',error);
                                                                                                              });


                                                                            }

                                                                });

                                                       
                                                                        
                                                                    

                                              });


                                   checkAsyncState();       
           
                     });

}
else{

  console.log('Bad request');

   checkAsyncState();

}




       });

}





function resolveEncounterUuidToEncounterId(encounterTypeUuid){

    return new Promise((resolve, reject) => {
      

    var onResolvedPromise = function (promise) {

        if(promise){
            resolve(promise.results);
        }else{
            var reason = new Error('Error Getting UUid');
            reject(reason);
        }

        
    };


     dao.getIdsByUuidAsyc('amrs.encounter_type', 'encounter_type_id', 'uuid', encounterTypeUuid , function(results){
     }).onResolved = onResolvedPromise;

        

    });

}

/*

resolveToEncounterIds(params)
            .then(function (resolved) {
                console.log('All Resolved',resolved);
                return resolved;
            })
            .catch(function (error) {
               return error;
});

*/




// Test for Resolving Encounter IDS

/*
getProgramEncounterTypeUuids(request) 
            .then(function (resolved) {
                console.log('All Resolved',resolved);
                return resolved;
            })
            .catch(function (error) {
               return error;
});

*/





