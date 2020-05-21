'use strict';
var rp = require('request-promise');
var cache = require('./session-cache');
module.exports = function() {
 var sessionCookie = '';
 return {
   getRequestPromise: function getRequestPromise(queryString,url) {
     var options = {
       uri: url,
        qs:queryString,
        headers: {
          'User-Agent': 'Request-Promise',
          'Cookie': sessionCookie
        },
        json: true,
        rejectUnauthorized: false,
        requestCert: true
      };
      return rp(options);
   },
   setAuthorization:function (authorization) {
     sessionCookie = authorization;
   },
   getAuthorization:function () {
    return sessionCookie;
  },
  postRequestPromise:function postRequestPromise(payload,uri){
    var options = {
      method: 'POST',
      uri: uri,
      headers: {
        'User-Agent': 'Request-Promise',
        'Cookie': sessionCookie,
        'content-type':'application/json'
      },
      body:payload,
      json: true
  };
  return rp(options);
  },
  deleteRequestPromise:function deleteRequestPromise(uri){
    var options = {
      method: 'DELETE',
      headers: {
        'User-Agent': 'Request-Promise',
        'Cookie': sessionCookie
      },
      uri: uri,
      resolveWithFullResponse: true
  };
  return rp(options);
  }
 };
}();
