var Promise = require("bluebird");
var locationDao = require('../dao/location/location-dao');
const _ = require('lodash');
var locations = [];
var locationUuidIdMap = new Map();

var def = {
    getAlllocations : getAlllocations,
    maplocationUuidToId: maplocationUuidToId,
    loadAndMaplocationUuidToId : loadAndMaplocationUuidToId,
    getlocationIdFromUuid: getlocationIdFromUuid
};

module.exports = def;


function getAlllocations(){

    /*
     returns a list of all encunter-types with their id
     and uuid

    */

  return new Promise(function (resolve, reject) {

      if(locations.length > 0){

             // console.log('location length > 0');

             resolve(locations);

      }else{

           // console.log('Locations Service : location length < 0');

           locationDao.getLocations().then(function (result) {
                     if(result){
                          // console.log('Locations from dao', result);
                          locations = result;
                          resolve(locations);
                     }else{
                         // console.log('Locations from dao error: ');
                         reject('error');
                     }              
                 })
                .catch(function (error) {
                       // console.log('Locations from dao error: ', error);
                       reject('error');
                });


      }

      

    });



}

function maplocationUuidToId(locations){

    _.each(locations,(location, index) => {
          locationUuidIdMap.set( location.uuid ,location.location_id);
    });

    return locationUuidIdMap;

}

function getlocationIdFromUuid(locationUuid){

    var locationId = locationUuidIdMap.get(locationUuid); 

    if(typeof locationId === undefined){
           return null;
    }else{
           return locationId;
    }

}

function loadAndMaplocationUuidToId(){

    return new Promise(function (resolve, reject) {

        getAlllocations()
        .then((result) => {
            if(result){
                locationUuidIdMap = maplocationUuidToId(result);
                resolve(locationUuidIdMap);
            }
        })
        .catch(((error) =>{
                reject('Error');
        }));

        });

}


