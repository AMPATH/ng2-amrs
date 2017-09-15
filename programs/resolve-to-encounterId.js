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

function resolveToEncounterIds(request){

      var totalAsyncRequests  = 0;

    
      if(request.programType){
           var programTypeUuid = request.programType;
      } else {
           var programTypeUuid = '';
      }
       if(request.visitType){
          var visitTypeUuid = request.visitType;
      } else {
          var visitTypeUuid = '';
      }

      if(request.encounterType){
           var encounterTypeUuid = request.encounterType;
       } else {
           var encounterTypeUuid = '';
       }


      var encounterTypesList = [];
      var resolvedEncounterUUids = [];

     
   

      return new Promise((resolve, reject) => {

          //consdition for resolving the promise

           var checkAsyncState = function(){
          if(totalAsyncRequests === 0){
              resolve(resolvedEncounterUUids);
            }
           }

         

         
        

      // get the encounter types associated with a program

      _.each(programsConfig,(program,index) => {

            var progUuid = index;
            var visitTypes = program.visitTypes;

            var programLogic = getProgramsLogic(progUuid,programTypeUuid,visitTypeUuid,encounterTypeUuid);

            if(programLogic === true){
                 _.each(visitTypes,(visitType) => {
                      var visitUuid = visitType.uuid;
                      var encounterTypes = visitType.encounterTypes;
                      var visitsLogic = getVisitsLogic(visitUuid,programTypeUuid,visitTypeUuid,encounterTypeUuid);

                      if(visitsLogic === true){
                        _.each(encounterTypes, (encounterType) => {
                            var encounterUuid = encounterType.uuid;
                            var encountersLogic = getEncountersLogic(encounterUuid,programTypeUuid,visitTypeUuid,encounterTypeUuid);

                           if(encountersLogic === true){

                                    var containsEncounterUuid = _.includes(encounterTypesList,encounterUuid);
                                    // if(containsEncounterUuid === false){

                                         encounterTypesList.push(encounterUuid);
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
                                       
                                        

                                    //}


                            } else {
                                //if encounters Logic fails
                                 totalAsyncRequests++;
                                resolveForFailedChecks()
                                                .then(function (fulfilled) {
                                                               var containsZeroid = _.includes(resolvedEncounterUUids,0);
                                                                if(containsZeroid === false){
                                                                    resolvedEncounterUUids.push(fulfilled);
                                                                }

                                                         totalAsyncRequests--;
                                                         checkAsyncState();

                                                    })
                                                    .catch(function (error) {
                                                        console.log('Error Message',error);
                                                    });
                            }
                           
                        });

                      } else {
                          // if visits logic fails
                            //if the program check fails
                                totalAsyncRequests++;
                                resolveForFailedChecks()
                                                .then(function (fulfilled) {
                                                   

                                                               var containsZeroid = _.includes(resolvedEncounterUUids,0);
                                                                if(containsZeroid === false){
                                                                    resolvedEncounterUUids.push(fulfilled);
                                                                }

                                                                 totalAsyncRequests--;
                                                                 checkAsyncState();

                                                    })
                                                    .catch(function (error) {
                                                        console.log('Error Message',error);
                                                    });
                                
                         }

               }); // end of visitType loop
                 

            } else {

                //if the program check fails
                 totalAsyncRequests++;
                   resolveForFailedChecks()
                                .then(function (fulfilled) {
                                        var containsZeroid = _.includes(resolvedEncounterUUids,0);
                                             if(containsZeroid === false){
                                                resolvedEncounterUUids.push(fulfilled);
                                             }
                                             totalAsyncRequests--;
                                             checkAsyncState();

                                    })
                                     .catch(function (error) {
                                         console.log('Error Message',error.message);
                                     });

            }
 
    
      });

        

       


      });


}

function resolveForFailedChecks(){
    return new Promise((resolve, reject) => {
      
          resolve(0);


    });
}

function getProgramsLogic(progUuid,programTypeUuid,visitTypeUuid,encounterTypeUuid){
   

     if(programTypeUuid!=''){
           if(progUuid === programTypeUuid){
                return true;
           }else{
               return false;
           }
     }else{

           if (visitTypeUuid!='' || encounterTypeUuid!=''){
                return true;
           }else{
               return false;
           }

     }
    

}

function getVisitsLogic(visitUuid,programTypeUuid,visitTypeUuid,encounterTypeUuid){

     if(visitTypeUuid !=''){
         
           if(visitTypeUuid === visitUuid){
                return true;
           } else {
               return false;
           }

     } else {

           if(programTypeUuid!='' || encounterTypeUuid!=''){
                 return true;
           }else {
                 return false;
           }
     }

}

function getEncountersLogic(encounterUuid,programTypeUuid,visitTypeUuid,encounterTypeUuid){

       if(encounterTypeUuid!=''){

            if(encounterUuid === encounterTypeUuid){
                 return true;
            }
            else{
                return false;
            }

       } else {

            if(programTypeUuid!='' || visitTypeUuid!=''){
                 return true;
             }else {
                 return false;
            }


       }

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





