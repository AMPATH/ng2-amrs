var Promise = require("bluebird");
var visitTypeDao = require('../dao/visit-type/visit-type-dao');
const _ = require('lodash');
var visitTypes = [];
var visitTypeUuidIdMap = new Map();

var def = {
    getAllVisitTypes: getAllVisitTypes,
    mapvisitTypeUuidToId: mapvisitTypeUuidToId,
    loadAndMapVisitTypeUuidToId : loadAndMapVisitTypeUuidToId,
    getVisitTypeIdFromUuid: getVisitTypeIdFromUuid
};

module.exports = def;


function getAllVisitTypes(){

    /*
     returns a list of all encunter-types with their id
     and uuid

    */

  return new Promise(function (resolve, reject) {

      if(visitTypes.length > 0){

             // console.log('Visit Type length > 0');

             resolve(visitTypes);

      }else{

          // console.log('Visit Type length < 0');

           visitTypeDao.getVisitTypes().then(function (result) {
                     if(result){
                          visitTypes = result;
                          // console.log('All Visit Types');
                          resolve(visitTypes);
                     }else{
                         // console.log('All Visit Error');
                         reject('error');
                     }              
                 })
                .catch(function (error) {
                       reject('error');
                });


      }

      

    });



}

function mapvisitTypeUuidToId(visitTypes){
    // console.log('Got VisitTypes', visitTypes);

    _.each(visitTypes,(visitType, index) => {
          // console.log('Specific Visit Type', visitType)
          visitTypeUuidIdMap.set( visitType.uuid , visitType.visit_type_id);
    });

    return visitTypeUuidIdMap;

}

function getVisitTypeIdFromUuid(visitTypeUuid){

    var visitObj = visitTypeUuidIdMap.get(visitTypeUuid); 

    if(typeof visitObj === 'undefined'){
           return -1;
    }else{
           return visitObj;
    }

}

function loadAndMapVisitTypeUuidToId(){

    return new Promise(function (resolve, reject) {

         getAllVisitTypes()
        .then((result) => {
            if(result){
               //  console.log('Got Visit TYpes');
                visitTypeUuidIdMap = mapvisitTypeUuidToId(result);
                resolve(visitTypeUuidIdMap);
            }else{
                // console.log('Got No Visit TYpes');
                resolve({});
            }
        })
        .catch(((error) =>{
               //  console.log('Got Visit TYpes Error', error);
                reject('Error');
        }));

        });

}


