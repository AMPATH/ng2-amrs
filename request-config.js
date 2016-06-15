'use strict';
var rp = require('request-promise');
module.exports = function() {
 var authorizationHeader = '';
 return {
   getRequestPromise:function getRequestPromise(queryString,url) {
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
   }
 };
}();
