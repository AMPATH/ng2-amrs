'use strict';
var winston = require('winston');
var path = require('path');
var _ = require('underscore');

var moduleDefinition = {
  logRequestError: logRequestError,
  logger: logger
};

module.exports = moduleDefinition;

function logRequestError(message, fileName, absolutePath) {
  var logger = new winston.Logger({
    transports: [
      new winston.transports.File({
        level: 'error',
        filename: fileName || 'server-request-logs.log',
        handleExceptions: true,
        json: true,
        colorize: false
      })
    ],
    exitOnError: false
  });
  logger.add(require('winston-daily-rotate-file'), {
    filename: absolutePath + fileName || 'server-request-logs.log'
  });
  logger.error(message);
  logger.close();
}

function logger(filePath) {
  var fileName = path.basename(filePath);

  var logger = new winston.Logger({
    transports: [
      new winston.transports.File({
        level: 'error',
        filename: fileName || 'server-request-logs.log',
        handleExceptions: true,
        json: true,
        colorize: false
      })
    ],
    exitOnError: false
  });

  logger.add(require('winston-daily-rotate-file'), {
    filename: filePath || 'server-request-logs.log'
  });

  return logger;
}
