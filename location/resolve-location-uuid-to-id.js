"use strict";

var Promise = require("bluebird");
const _ = require('lodash');
const dao = require('../etl-dao');
var locationService = require('./location.service');
var locationMapping;

var locationDef = {
    getLocationUUidIdMap: getLocationUUidIdMap,
    resolveLocationUuidsParamsToIds: resolveLocationUuidsParamsToIds,
     
};


module.exports = locationDef;


// Get a map of locations uuids and ids

function getLocationUUidIdMap(){

      var locationMap = new Map();
      var resolveCount = 0;

       return new Promise(function (resolve, reject) {

                function checkResolveCount(){
                      if(resolveCount == 1){
                            
                            resolve(locationMapping);

                      }
                }
      
                 //first get the location map

                  locationService.loadAndMaplocationUuidToId()
                  .then((result)=>{
                        locationMapping = result;
                        resolveCount++;
                        checkResolveCount();
                        // console.log('All Locations', result);
                  })
                  .catch(function(e) {
                         resolveCount++;
                         checkResolveCount();
                         console.error('ERROR: loadAndMaplocationUuidToId', e);
                  });;


   });

}

function resolveLocationUuidsParamsToIds(request){

      var locationMap = {};
      var resolvedLocationIds = [];
      var resolvedLocation = [];
      var resolveCount = 0;
      var locationUuids = [];

      if(typeof request.locationUuids !== 'undefined'){

          var locations = request.locationUuids;

          if(locations.length > 0){
               locationUuids = locations.split(',');
          }

      }

       return new Promise(function (resolve, reject) {

       function checkResolveCount(){
             // console.log('Check Location Resolve Count');
             if(resolveCount > 0){
                 resolve(resolvedLocationIds);
             }else{
                  reject('Error')
             }
       }

       getLocationUUidIdMap().
                  then((result)=>{
                        locationMap = result;
                        if (locationUuids.length > 0) {

                              _.each(locationUuids, (specificLocation) => {

                                var locationUuid = specificLocation;
                                var locationId = locationMapping.get(locationUuid);
                                if(typeof locationId !== 'undefined'){

                                    resolvedLocation.push(locationId);

                                }else{

                                     console.error('ERROR : Undefined Location UUID', locationUuid);
                                }
                               

                              });



                        }else{

                           // console.log('locations.length === 0');

                        }
                    

                            resolvedLocationIds = _.uniq(resolvedLocation)

                              resolveCount++;


                             checkResolveCount();
                  })
                  .catch(function(e) {
                         console.log("handled error", e);
                  });;

       });

}








