var Promise          = require("bluebird");
var async            = require('async');
var scopeBuilder     = require("./scope-builder.service");
var dataResolver     = require("./patient-data-resolver.service");
var expressionRunner = require('../expression-runner/expression-runner');

var def = {
  validateEnrollmentOptions: validateEnrollmentOptions
};

module.exports = def;

function isEnrollmentAllowed (scope, enrollmentOptions) {
  if (!enrollmentOptions.enrollIf) {
    return true;
  }
  return expressionRunner.run(enrollmentOptions.enrollIf, scope);
}

function updateProgramConfig (patientUuid, program, callback) {
  if (program.enrollmentOptions) {
    dataResolver.getAllDataDependencies(program.dataDependencies || [], patientUuid, {})
      .then(function (dataObject) {
        // build scope
        var scopeObj = scopeBuilder.buildScope(dataObject);
        program.enrollmentAllowed = isEnrollmentAllowed(scopeObj, program.enrollmentOptions);
        callback();
      }).catch(function (dataErr) {
      console.error(dataErr);
      callback(dataErr);
    });
  } else {
    callback();
  }
}

function validateEnrollmentOptions (patientUuid, allProgramsConfig) {
  return new Promise(function (resolve, reject) {
    async.each(allProgramsConfig, function (program, callback) {
      updateProgramConfig(patientUuid, program, callback);
    }, function (err) {
      if (!err) {
        resolve(allProgramsConfig);
      } else {
        reject(err);
      }
    });
  });
}

