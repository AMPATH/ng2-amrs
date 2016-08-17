/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var db = require('../../etl-db');
var _ = require('underscore');
var Boom = require('boom'); //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
var helpers = require('../../etl-helpers');
var http = require('http');
var https = require('https');
var Promise = require('bluebird');
var rp = require('../../request-config');
var eidService = require('../../service/eid/eid.service');


module.exports = function () {

    function postLabOrderToEid(request, callback) {

        var rawPayload = JSON.parse(JSON.stringify(request.payload));
        var labName = request.params.lab;

        eidService.generatePayload(rawPayload,
            function (payload) {
                var eidServer = eidService.getEidServerUrl(labName, rawPayload.type,'post');
                return new Promise(function (resolve, reject) {
                    rp.postRequestPromise(payload, eidServer.url)
                        .then(function (response) {
                            resolve(response);
                            callback(payload);
                        })
                        .catch(function (error) {
                            reject(error);
                            callback(Boom.badData(error));
                        })
                });
            },
            function (err) {
                callback(Boom.badData(err));
            });
    };

    function loadOrderJustifications(request, reply) {

      var uuid = request.query.uuid;
      var eidOrderMap = require('../../service/eid/eid-order-mappings');

      var testOrderJustification = eidOrderMap.testOrderJustification;

      if(uuid && testOrderJustification[uuid]) {

        var row = testOrderJustification[uuid];
        row.uuid = uuid;
        var data = [row];

        reply({
          "statusCode": 0,
          "data": data
        });

      } else if(uuid) {

        reply(Boom.notFound('justification not found'));

      } else {

        var data = [];

        for(var key in testOrderJustification) {
          var obj = testOrderJustification[key];
          obj.uuid = key;
          data.push(obj);
        }

        reply({
          "statusCode": 0,
          "data": data
        })

        //load everything
      }
    };

    return {
        postLabOrderToEid: postLabOrderToEid,
        loadOrderJustifications: loadOrderJustifications
    }
}();
