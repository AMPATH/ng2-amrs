var Promise = require("bluebird");
var scopeBuilder = require("./scope-builder.service");
var dataResolver = require("./patient-data-resolver.service");
var expressionRunner = require('../expression-runner/expression-runner');

var def = {
    isVisitTypeAllowed: isVisitTypeAllowed,
    separateAllowedDisallowedVisitTypes: separateAllowedDisallowedVisitTypes,
    getPatientVisitTypes: getPatientVisitTypes
};

module.exports = def;

function isVisitTypeAllowed(scope, visitType) {
    if (!visitType.allowedIf) {
        return true;
    }
    return expressionRunner.run(visitType.allowedIf, scope);
}

function separateAllowedDisallowedVisitTypes(scope, visitTypes) {
    var separated = {
        allowed: [],
        disallowed: []
    };

    if (Array.isArray(visitTypes)) {
        visitTypes.forEach(function (item) {
            if (isVisitTypeAllowed(scope, item)) {
                separated.allowed.push(item);
            } else {
                separated.disallowed.push(item);
            }
        });
    }
    return separated;
}

function getPatientVisitTypes(patientUuid, programUuid, programEnrollmentUuid,
    intendedVisitLocationUuid, allProgramsConfig) {
    return new Promise(function (success, error) {
        var program = allProgramsConfig[programUuid];
        if (!program) {
            error({ message: 'Program not found!' });
            return;
        }

        // resolve data dependencies
        dataResolver.getAllDataDependencies(program.dataDependencies || [],
            patientUuid, {
                programUuid: programUuid,
                programEnrollmentUuid: programEnrollmentUuid,
                intendedVisitLocationUuid: intendedVisitLocationUuid
            })
            .then(function (dataObject) {
                // add missing properties 
                dataObject.programUuid = programUuid;
                dataObject.intendedVisitLocationUuid = intendedVisitLocationUuid;

                // build scope
                var scopeObj = scopeBuilder.buildScope(dataObject);
                var visits = program.visitTypes;

                // console.log('dataObject', dataObject);
                // console.log('scope', scopeObj);
                // console.log('visits', program.visitTypes);
                program.visitTypes =
                    separateAllowedDisallowedVisitTypes(scopeObj, visits);

                success(program);
            })
            .catch(function (dataErr) {
                console.error(dataErr);
                error({
                    message: 'Error resolving data dependencies'
                });
            })
    });
}

