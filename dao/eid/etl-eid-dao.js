/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var
  db = require('../../etl-db')
  , _ = require('underscore')
  , Boom = require('boom') //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
  , helpers = require('../../etl-helpers')
  , http = require('http')
  , https = require('https')
  , Promise = require('bluebird')
  , rp = require('../../request-config')
  , config = require('../../conf/config')
  , eidService = require('../../service/eid/eid.service');

module.exports = function () {

    function postLabOrderToEid(request, callback) {

        var rawPayload = JSON.parse(JSON.stringify(request.payload));
        var labName = request.params.lab;
        var orderNumber = rawPayload.orderNumber;

        getEidOrder(rawPayload, labName, orderNumber)
          .then(function(orders) {

            if(orders.length == 0) {

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
                                  callback(Boom.badData(error.message));
                              })
                      });
                  },
                  function (err) {
                      callback(Boom.badData(err.message));
                  });
            } else {

              callback(Boom.badData('Forbidden: An order with the same order number exists in the eid system'));
            }

          }).catch(function(err) {
            callback(Boom.badData(err.message));
          });
    };

    function getEidOrder(rawPayload, labName, orderNumber) {

      var payload = {
        "patientID[]" : '',
        "location" : '',
        "orderno[]" : orderNumber,
        "DateDispatched" : ''
      };

      var eidServer = eidService.getEidServerUrl(labName, '', 'post');

      switch (rawPayload.type) {
          case 'VL':
            payload.test = 2;
            break;
          case 'DNAPCR':
            payload.test = 1;
            break;
          case 'CD4':

            var serverConfig = config.eidServer[labName];

            var apikey = "";
            var locations = config.eid.locations;

            for(var i = 0; i < locations.length; i++) {

              if(locations[i].name === labName) {
                apikey = locations[i].cd4ApiKey;
                break;
              }
            }
            
            eidServer = {
                url: serverConfig.host + ':' + serverConfig.port + '/cd4/orders/api.php',
                apiKey: apikey
            };
            break;
      }

      payload.apikey = eidServer.apiKey;

      return rp.getRequestPromise(payload, eidServer.url)
        .then(function(response) {

          return new Promise(function(resolve, reject) {
            if(response && response.posts)
              resolve(response.posts);
            else
              resolve([]);
          });
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
        loadOrderJustifications: loadOrderJustifications,
        getEidOrder: getEidOrder
    }
}();
