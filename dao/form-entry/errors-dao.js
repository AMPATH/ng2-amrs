/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var _ = require('underscore');
var cache = require('../../session-cache');
var etlLogger = require('../../etl-file-logger');

module.exports = (function () {
  function logError(request, reply) {
    var data = request.payload || request.body;

    var username =
      request.auth && request.auth.credentials
        ? request.auth.credentials.username
        : '';

    var file = '/tmp/form-submit-errors_' + username + '.log';

    var logger = etlLogger.logger(file);
    logger.error(
      '-----------------------------------------------------------------------------------------------------------------------'
    );
    logger.error(data);
    logger.error(
      '-----------------------------------------------------------------------------------------------------------------------'
    );
    logger.close();
    reply({
      message: 'ok'
    });
  }

  return {
    logError: logError
  };
})();
