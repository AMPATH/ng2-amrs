/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var _ = require('underscore');
var cache = require('../../session-cache');
var etlLogger = require('../../etl-file-logger');

module.exports = function () {

    function logError(request, reply) {

      var data = request.payload || request.body;

      var logger = etlLogger.logger('/tmp/form-submit-errors.log');
      logger.error('-----------------------------------------------------------------------------------------------------------------------')
      logger.error(data);
      logger.error('-----------------------------------------------------------------------------------------------------------------------')


      reply({
          message: 'ok'
      });
    }

    return {
        logError: logError
    }
}();
