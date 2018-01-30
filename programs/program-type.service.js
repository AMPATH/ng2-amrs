var Promise = require("bluebird");
var programTypeDao = require('../dao/program-type/program-type-dao');
const _ = require('lodash');
var programTypes = [];
var programUuidIdMap = new Map();
const programsConfig = require('./program-visits-config');

var def = {
    getAllprogramTypes: getAllprogramTypes,
    mapprogramUuidToId: mapprogramUuidToId,
    loadAndMapProgramUuidToId : loadAndMapProgramUuidToId,
    getprogramIdFromUuid: getprogramIdFromUuid
};

module.exports = def;


function getAllprogramTypes(){

    /*
     returns a list of all program-types with their id
     and uuid

    */

  return new Promise(function (resolve, reject) {

      if(programTypes.length > 0){

            // console.log('program Type length > 0');

             resolve(programTypes);

      }else{

          // console.log('program Type length < 0');

           programTypeDao.getProgramTypes().then(function (result) {
                     if(result){
                          programTypes = result;
                          resolve(programTypes);
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

function mapprogramUuidToId(programTypes){
   //  console.log('Got programTypes', programTypes);

    _.each(programTypes,(programType, index) => {
          // console.log('Specific program Type', programType)
          programUuidIdMap.set( programType.uuid ,programType.program_id);
    });

    return programUuidIdMap;

}

function getprogramIdFromUuid(programUuid){

    var programObj = programUuidIdMap.get(programUuid); 

    if(typeof programObj === 'undefined'){
           return -1;
    }else{
           return programObj;
    }

}

function loadAndMapProgramUuidToId(){

    return new Promise(function (resolve, reject) {

        getAllprogramTypes()
        .then((result) => {
            if(result){
                programUuidIdMap = mapprogramUuidToId(result);
                resolve(programUuidIdMap);
            }
        })
        .catch(((error) =>{
                reject('Error');
        }));

        });

}

//get all visit types and encounters under a certain program


