var Promise = require("bluebird");
var encounterTypeDao = require('../dao/encounter-type/encounter-type-dao');
const _ = require('lodash');
var encounterTypes = [];
var encounterUuidIdMap = new Map();

var def = {
    getAllEncounterTypes: getAllEncounterTypes,
    mapEncounterUuidToId: mapEncounterUuidToId,
    loadAndMapEncounterUuidToId : loadAndMapEncounterUuidToId,
    getEncounterIdFromUuid: getEncounterIdFromUuid
};

module.exports = def;


function getAllEncounterTypes(){

    /*
     returns a list of all encunter-types with their id
     and uuid

    */

  return new Promise(function (resolve, reject) {

      if(encounterTypes.length > 0){

             // console.log('Encounter Type length > 0');

             resolve(encounterTypes);

      }else{

          // console.log('Encounter Type length < 0');

           encounterTypeDao.getEncounterTypes().then(function (result) {
                     if(result){
                          encounterTypes = result;
                          resolve(encounterTypes);
                     }else{
                         reject('error');
                     }              
                 })
                .catch(function (error) {
                       reject('error');
                });


      }

      

    });



}

function mapEncounterUuidToId(encounterTypes){
   //  console.log('Got EncounterTypes', encounterTypes);

    _.each(encounterTypes,(encounterType, index) => {
          // console.log('Specific Encounter Type', encounterType)
          encounterUuidIdMap.set( encounterType.uuid ,encounterType.encounter_type_id);
    });

    return encounterUuidIdMap;

}

function getEncounterIdFromUuid(encounterUuid){

    var encounterObj = encounterUuidIdMap.get(encounterUuid); 

    if(typeof encounterObj === 'undefined'){
           return -1;
    }else{
           return encounterObj;
    }

}

function loadAndMapEncounterUuidToId(){

    return new Promise(function (resolve, reject) {

        getAllEncounterTypes()
        .then((result) => {
            if(result){
                encounterUuidIdMap = mapEncounterUuidToId(result);
                resolve(encounterUuidIdMap);
            }
        })
        .catch(((error) =>{
                reject('Error');
        }));

        });

}


