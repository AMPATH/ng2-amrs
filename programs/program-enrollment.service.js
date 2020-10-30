var Promise = require('bluebird');
var async = require('async');
var scopeBuilder = require('./scope-builder.service');
var dataResolver = require('./patient-data-resolver.service');
var expressionRunner = require('../expression-runner/expression-runner');
var _ = require('underscore');
_ = require('lodash');

var def = {
  validateEnrollmentOptions: validateEnrollmentOptions
};

module.exports = def;

function isEnrollmentAllowed(scope, enrollmentOptions) {
  if (!enrollmentOptions.enrollIf) {
    return true;
  }
  return expressionRunner.run(enrollmentOptions.enrollIf, scope);
}

function updateProgramConfig(patientUuid, program, callback, res) {
  if (program.enrollmentOptions) {
    var scopeObj = scopeBuilder.buildScope(res);
    program.enrollmentAllowed = isEnrollmentAllowed(
      scopeObj,
      program.enrollmentOptions
    );
    callback();
  } else {
    callback();
  }
}

function validateEnrollmentOptions(patientUuid, allProgramsConfig) {
  return new Promise(function (resolve, reject) {
    var dataObject = getDependanciesKeysAndData(allProgramsConfig, patientUuid);

    async.each(
      allProgramsConfig,
      function (program, callback) {
        dataObject.then(function (res) {
          updateProgramConfig(patientUuid, program, callback, res);
        });
      },
      function (err) {
        if (!err) {
          resolve(allProgramsConfig);
        } else {
          reject(err);
        }
      }
    );
  });
}

function getDependanciesKeysAndData(allProgramsConfig, patientUuid) {
  return new Promise(function (resolve, reject) {
    var dep = [];
    _.each(allProgramsConfig, function (prog) {
      dep.push(prog.dataDependencies);
    });
    dataResolver
      .getAllDataDependencies(dep[0] || [], patientUuid, {})
      .then(function (dataObject) {
        resolve(dataObject);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
