/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var db = require('../../etl-db');
var _ = require('underscore');
var cache = require('../../session-cache');


module.exports = function () {

    function invalidateUserSession(request, callback) {
        if(request.headers.authorization) {
            var header =request.headers.authorization;
            var authBuffer=header.replace('Basic ','');
            cache.encriptKey(authBuffer, function (hash) {
                cache.removeFromCache(hash);
                callback('user session was invalidated successfully in etl server');
            }, function (err) {
                callback(Boom.badData(err));
            });
        } else{
            callback(Boom.badData(err));
        }
    }


    return {
        invalidateUserSession: invalidateUserSession
    }
}();
