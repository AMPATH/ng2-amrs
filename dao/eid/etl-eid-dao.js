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
      payload.apikey = eidServer.apiKey;

      switch (rawPayload.type) {
          case 'VL':
            payload.test = 2;
            break;
          case 'DNAPCR':
            payload.test = 1;
            break;
          case 'CD4':
            //TODO - we need to handle cd4 url
            return new Promise(function(resolve, reject) {
              resolve([]);
            });
            break;
      }

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
