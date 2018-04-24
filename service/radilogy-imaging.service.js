/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var
     Promise = require('bluebird')
    , config = require('../conf/config')
    , curl = require('curlrequest');
var rp = require('request-promise');
var _ = require('lodash');
var connection = require('../dao/connection/mysql-connection-service');
var authorizer = require('../authorization/etl-authorizer');
var squel = require('squel');

var definition = {

    getImagingResultsByPatientIdentifier:getImagingResultsByPatientIdentifier,
    getRequestPromise:getRequestPromise,
    getPatientImagesByPatientIdentifier:getPatientImagesByPatientIdentifier,
    constructWadoUrl:constructWadoUrl,
    postRadiologyImagingComments:postRadiologyImagingComments,
    getAllPatientImages:getAllPatientImages

};
var authorizationHeader = '';
module.exports = definition;
var wado ={};


function getImagingResultsByPatientIdentifier(queryString) {
    var resource = getRefpacsServerUrl();
    return getRequestPromise(queryString, resource);
}
function getAllPatientImages(queryString) {
    var resource = getRefpacsImagingStudyUrl();
    return getRequestPromise(queryString, resource);

}

function getRequestPromise(queryString,resource) {
console.log('resource.apiKey',resource.apiKey);
console.log('resource.url',resource.url);
    var options = {
        uri: resource.url,
        qs:queryString,
        headers: {
            'User-Agent': 'Request-Promise',
            'authorization': authorizationHeader,
            'x-api-key': resource.apiKey
        },
        json: true,
        rejectUnauthorized: false,
        requestCert: true
    };
    return rp(options);
}

function getRefpacsServerUrl() {
    var serverConfig = config.refpacs.locations[0];
        return {
            url: serverConfig.host + config.refpacs.generalPath,
            apiKey: serverConfig.apiKey
        };
}

function getRefpacsImagingStudyUrl() {
    var serverConfigs = config.refpacs.locations[0];
    return {
        url: serverConfigs.host + config.refpacs.imagesPath,
        apiKey: serverConfigs.apiKey
    };
}

function postRadiologyImagingComments(payload) {
    return new Promise(function (resolve, reject) {
        connection.getServerConnection()
            .then(function (conn) {

                var query = squel.insert()
                    .into('etl.radiology_comments')
                    .set('encounter_id', payload.encounterId)
                    .set('comments', payload.comments)
                    .set('thumbs', payload.thumbs)
                    .set('date_created', squel.fval('NOW()'))
                    .set('creator', getCurrentUserIdSquel())
                    .set('voided', 0)
                    .toString();

                conn.query(query, {}, function (err, rows, fields) {
                    console.log('rows',rows);
                    if (err) {
                        console.error(err);
                        reject('Error updating resource');
                    }
                    else {

                        resolve(rows);

                    }
                    conn.release();
                });
            })
            .catch(function (err) {
                reject('Error establishing connection to MySql Server');
    });

});
}


function getPatientImagesByPatientIdentifier(queryString) {

    var resource = getRefpacsImagingStudyUrl();

    return getRequestPromise(queryString, resource);
}

function constructWadoUrl(load) {

    return new Promise(function (resolve, reject) {
        var studyUID =  _.trimStart(load.uid, 'urn:oid:');
        var objectUID =  _.trimStart(load.series[0].instance[0].uid, 'urn:oid:');
        var seriesUID =  _.trimStart(load.series[0].uid, 'urn:oid:');
        var res = getImagesFromWado(studyUID,objectUID,seriesUID);
        resolve( res);
    })
        .catch((error) => {

            reject(error);
        })


}
function getCorrespondingImages(results) {

    console.log('results corresponding', results);
    wado =results;
    return results;


}

function getImagesFromWado(studyUID,objectUID,seriesUID) {
    var serverConfigs = config.refpacs.imageHost;
    var addr = serverConfigs + '/wado?requestType=WADO';
    var url = addr +'&studyUID=' +studyUID +'&objectUID=' +objectUID +'&seriesUID=' +seriesUID;
    console.log('url---->>>>',url);

    return  url
}


function getCurrentUserIdSquel() {
    return squel.select().field('MAX(user_id)')
        .from('amrs.users').where('uuid = ?', authorizer.getUser().uuid);
}