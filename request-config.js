'use strict';
var rp = require('request-promise');
module.exports = function() {
 var authorizationHeader = '';
 return {
   getRequestPromise: function getRequestPromise(queryString,url) {
     var options = {
       uri: url,
        qs:queryString,
        headers: {
          'User-Agent': 'Request-Promise',
          'authorization': authorizationHeader
        },
        json: true,
        rejectUnauthorized: false,
        requestCert: true
      };
      return rp(options);
   },
   setAuthorization:function setAuthorization(authorization) {
     authorizationHeader = authorization;
   },
   getAuthorization:function getAuthorization() {
    return authorizationHeader;
  },
  postRequestPromise:function postRequestPromise(payload,uri){
    var options = {
      method: 'POST',
      uri: uri,
      headers: {
        'User-Agent': 'Request-Promise',
        'authorization': authorizationHeader,
        'content-type':'application/json'
      },
      body:payload,
      json: true
  };
  return rp(options);
  }
 };
}();
