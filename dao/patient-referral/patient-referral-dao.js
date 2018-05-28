/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var Promise = require('bluebird');
var squel = require('squel');
var _ = require('underscore');
var moment = require('moment');
var connection = require('../../dao/connection/mysql-connection-service.js');
var authorizer = require('../../authorization/etl-authorizer');

var def = {
    createPatientReferral: createPatientReferral,
    updatePatientReferralNotification:updatePatientReferralNotification,
    getPatientReferralByEnrollmentUuid:getPatientReferralByEnrollmentUuid
};

module.exports = def;




function createPatientReferral(newPatientReferral) {
    return new Promise(function (resolve, reject) {
        var requiredFieldsCheck = hasRequiredReferralFields(newPatientReferral)

        if (!requiredFieldsCheck.isValid) {
            return reject(requiredFieldsCheck);
        }
     
      try{ 
        resolveEnrollmentUuidsToIds(newPatientReferral).
            then(function (newPateintReferral) {
            
                validateCreateReferralPayload(newPateintReferral)
                    .then(function (validationStatus) {

                        if (validationStatus && validationStatus.isValid === false) {
                            reject(validationStatus);
                        } else {
                            connection.getServerConnection()
                                .then(function (conn) {
                                    var query = squel.insert()
                                        .into('etl.patient_referral')
                                        .set('encounter_id', newPateintReferral.encounterId)
                                        .set('patient_program_id', newPateintReferral.patientProgramId)
                                        .set('provider_id', newPateintReferral.providerId)
                                        .set('referred_from_location_id', newPateintReferral.referredFromLocationId)
                                        .set('referred_to_location_id', newPateintReferral.referredToLocationId)
                                        .set('program_workflow_state_id', newPateintReferral.programWorkflowStateId)
                                        .set('notification_status', newPateintReferral.notificationStatus)
                                        .set('referral_reason', newPateintReferral.referralReason)
                                        .set('date_created', squel.fval('NOW()'))
                                        .set('creator', getCurrentUserIdSquel())
                                        .set('voided', 0)
                                        .toString();

                                    conn.query(query, {}, function (err, rows, fields) {
                                        console.log(err)
                                        if (err) {
                                            reject('Error updating resource');
                                        }
                                        else {

                                            var resolvedFieldsCheck = checkResolvedReferralFields(newPateintReferral)
                                            if (!resolvedFieldsCheck.isValid) {
                                                return reject(resolvedFieldsCheck);
                                            } 

                                            findPatientReferral( 
                                                                newPateintReferral.encounterId,  
                                                                newPateintReferral.providerId,
                                                                newPateintReferral.referredToLocationId,
                                                                newPateintReferral.referredFromLocationId,
                                                                newPateintReferral.programWorkflowStateId, 0)
                                                .then(function (updatedCohort) {
                                                    resolve(updatedCohort);
                                                })
                                                .catch(function (error) {
                                                    reject('An unknown error occured when  trying to fetch the updated resource');
                                                });
                                        }
                                        conn.release();
                                    });
                                })
                                .catch(function (err) {
                                    console.log(err)
                                    reject('Error establishing connection to MySql Server for updated resource');
                                });
                        }

                    });
            })
            .catch(function (error) {
                reject('could not resolve all payload property uuids to their respective ids ',error);
            });

             } catch(error){
    }
    });
   
}

function updatePatientReferralNotification(patientReferralId, newPatientReferral) {
    return new Promise(function (resolve, reject) {
        validateUpdateNotificationPayload(newPatientReferral)
            .then(function (validationStatus) {
                if (validationStatus.isValid === false) {
                    reject(validationStatus);
                } else {
                    connection.getServerConnection()
                        .then(function (conn) {
                            var query = squel.update()
                                .table('etl.patient_referral')
                                .set('notification_status', newPatientReferral.notificationStatus)
                                .set('date_changed', squel.fval('NOW()'))
                                .set('changed_by', getCurrentUserIdSquel())
                                .where('patient_referral_id = ?', patientReferralId)
                                .toString();

                            conn.query(query, {}, function (err, rows, fields) {
                                if (err) {
                                    console.error(err);
                                    reject('Error updating resource');
                                }
                                else {
                                    getPatientReferral(patientReferralId)
                                        .then(function (updatedPatientReferral) {
                                            resolve(updatedPatientReferral);
                                        })
                                        .catch(function (error) {
                                            resolve('An unknown error occured when  trying to fetch the updated resource',error);
                                        })
                                }
                                conn.release();
                            });
                        })
                        .catch(function (err) {

                            reject('Error establishing connection to MySql Server to update the resource');
                        });
                }

            });
    });
}

function getPatientReferral(patientReferralId) {
    return new Promise(function (resolve, reject) {
        connection.getServerConnection()
            .then(function (conn) {
                var query = squel.select()
                    .field('pr.patient_referral_id')
                    .field('pr.voided')
                    .field('pr.encounter_id')
                    .field('pr.provider_id')
                    .field('pr.referred_to_location_id') 
                    .field('pr.referred_from_location_id') 
                    .field('pr.patient_program_id')
                    .field('pr.notification_status') 
					.field('pr.referral_reason')  
                    .from('etl.patient_referral', 'pr')
                    // .join('amrs.encounter', 'u', 'pr.encounter_id = u.encounter_id')
                    .join('amrs.provider', 'ap', 'ap.provider_id = pr.provider_id')
                    .join('amrs.location', 'lr', 'pr.referred_to_location_id = lr.location_id')
                    .join('amrs.location', 'lt', 'pr.referred_from_location_id = lt.location_id')
                    .join('amrs.patient_program', 'p', 'pr.patient_program_id = p.patient_program_id')
                    .where('pr.patient_referral_id = ?', patientReferralId)
                    .toString();

                conn.query(query, {}, function (err, rows, fields) {
                    if (err) {
                        console.log(err)
                        reject('Error querying to get patient referral by Id server');
                    }
                    else {
                        if (rows.length > 0) {
                            resolve(rows[0]);
                        } else {
                            resolve(null);
                        }
                    }
                    conn.release();
                });
            })
            .catch(function (err) {
                reject('Error establishing connection to MySql Server');
            });
    });
}
function getPatientReferralByEnrollmentUuid(programEnrollmentUuid) {
    return new Promise(function (resolve, reject) {
        connection.getServerConnection()
            .then(function (conn) {
                var query = squel.select()
                    .field('pr.patient_referral_id')
                    .field('pr.voided')
                    .field('pr.encounter_id')
                    .field('pr.provider_id')
                    .field('pr.referred_to_location_id') 
                    .field('pr.referred_from_location_id') 
                    .field('pr.patient_program_id')
                    .field('pr.notification_status') 
					.field('pr.referral_reason')  
					.field('lr.name as referred_to_location')  
					.field('lt.name as referred_from_location')  
                    .from('etl.patient_referral', 'pr')
                    .join('amrs.provider', 'ap', 'ap.provider_id = pr.provider_id')
                    .join('amrs.location', 'lr', 'pr.referred_to_location_id = lr.location_id')
                    .join('amrs.location', 'lt', 'pr.referred_from_location_id = lt.location_id')
                    .join('amrs.patient_program', 'p', 'pr.patient_program_id = p.patient_program_id')
                    .where('p.uuid = ?', programEnrollmentUuid)
                    .toString();

                conn.query(query, {}, function (err, rows, fields) {
                    if (err) {
                        console.log(err)
                        reject('Error querying to get patient referral details by enrollment server');
                    }
                    else {
                        if (rows.length > 0) {
                            resolve(rows[0]);
                        } else {
                            resolve(null);
                        }
                    }
                    conn.release();
                });
            })
            .catch(function (err) {
                reject('Error establishing connection to MySql Server');
            });
    });
}

function validateUpdateNotificationPayload(newPatientReferralPayload) {
    return new Promise(function (resolve, reject) {
        var validationResult = {
            isValid: true,
            errors: []
        };
        if (_.isEmpty(newPatientReferralPayload.notificationStatus)) {
            validationResult.isValid = false;
            validationResult.errors.push({
                field: 'Notification status',
                message: 'Notification status is required'
            });
        }

        resolve(validationResult);
    });
}
function validateCreateReferralPayload(patientReferralPayload) {
    return new Promise(function (resolve, reject) {
        var validationErrors = {
            isValid: true,
            errors: []
        };

        var resolvedFieldsCheck = checkResolvedReferralFields(patientReferralPayload)
             if (!resolvedFieldsCheck.isValid) {
                     return reject(resolvedFieldsCheck);
            }

            findPatientReferral( 
                patientReferralPayload.encounterId,  
                patientReferralPayload.providerId,
                patientReferralPayload.referredToLocationId,
                patientReferralPayload.referredFromLocationId,
                patientReferralPayload.programWorkflowStateId, 0)
                    .then(function (results) {
                        if (results.length > 0) {
                            validationErrors.isValid = false;
                            validationErrors.errors.push({
                                field: 'Patient Referral details',
                                error: 'Duplicate record exists.'
                            });
                        }
                        resolve(validationErrors);
                    })
                    .catch(function (error) {
                        validationErrors.isValid = false;
                        resolve(validationErrors);
                        console.log('An error occured while trying to validate patient referral payload',error);
                    })
        

    }).catch(function (error) {
        console.log('An error occured while trying to validate patient referral payload',error);
    });
}



function hasRequiredReferralFields(newPatientReferralPayload) {
    var validationResult = {
        isValid: true,
        errors: []
    };
    if (_.isEmpty(newPatientReferralPayload.provider)) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'provider',
            message: 'Provider is required'
        });
    }
  
    if (_.isEmpty(newPatientReferralPayload.referredToLocation)) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'referredToLocation',
            message: 'Referred To Location is required'
        });
    }

    if (_.isEmpty(newPatientReferralPayload.patientProgram)) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'patientProgram',
            message: 'Patient Program is required'
        });
    }

    if (_.isEmpty(newPatientReferralPayload.referredFromLocation)) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'referredFromLocation',
            message: 'Referred From Location is required'
        });
    }

    if (_.isEmpty(newPatientReferralPayload.state)) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'state',
            message: 'Program Workflow State is required'
        });
    }
    if (_.isEmpty(newPatientReferralPayload.referralReason)) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'referral reason',
            message: 'Referral reason is required'
        });
    }

    return validationResult;
}

function resolveEnrollmentUuidsToIds(referralPayload) {
    return new Promise(function (resolve, reject) {
        getEncounterId(referralPayload.encounter)
            .then(function (encounterId) {
                referralPayload.encounterId = encounterId;
                getPatientProgramId(referralPayload.patientProgram)
                    .then(function (patientProgramId) {
                        referralPayload.patientProgramId = patientProgramId;
                             getProviderId(referralPayload.provider)
                                .then(function (providerId) {
                                    referralPayload.providerId = providerId;
                                                    getLocation(referralPayload.referredToLocation)
                                                    .then(function (referredToLocationId) {
                                                        referralPayload.referredToLocationId = referredToLocationId;
                                                            getLocation(referralPayload.referredFromLocation)
                                                                .then(function (referredFromLocationId) {
                                                                    referralPayload.referredFromLocationId = referredFromLocationId;																	
                                                                     getWorkFlowState(referralPayload.state)
                                                                        .then(function (stateId) {
                                                                            referralPayload.programWorkflowStateId = stateId;
                                                                            resolve(referralPayload);
                                                                        })
                                                                        .catch(function (err) {
                                                                            console.error(err);
                                                                            reject(err);
                                                                        })
                                                                })
                                                                .catch(function (err) {
                                                                    console.error(err);
                                                                    reject(err);
                                                                })
                                                    })
                                                    .catch(function (err) {
                                                        console.error(err);
                                                        reject(err);
                                                    })
                                })
                                .catch(function (err) {
                                    console.error(err);
                                    reject(err);
                                })
                    })
                    .catch(function (err) {
                        console.error(err);
                        reject(err);
                    })
            })
            .catch(function (error) {
                console.error(error);
                resolve(error);
            })
    });
}


function findPatientReferral(encounterId, providerId,referredToLocationId,referredFromLocationId,programWorkflowStateId, voided) {
   
        return new Promise(function (resolve, reject) {
            connection.getServerConnection()
                .then(function (conn) {
                    var query = squel.select()
                        .field('pr.patient_referral_id')
                        .field('pr.encounter_id')
                        .field('pr.provider_id')
                        .field('pr.referred_to_location_id') 
                        .field('pr.referred_from_location_id') 
                        .field('pr.patient_program_id') 
                        .field('pr.notification_status') 
                        .field('pr.referral_reason') 
                        .from('etl.patient_referral', 'pr')
                        .join('amrs.encounter', 'u', 'pr.encounter_id = u.encounter_id')
                        .join('amrs.provider', 'apr', 'apr.provider_id = pr.provider_id')
                        .join('amrs.location', 'lr', 'pr.referred_to_location_id = lr.location_id')
                        .join('amrs.location', 'lt', 'pr.referred_from_location_id = lt.location_id')
                        .join('amrs.patient_program', 'p', 'pr.patient_program_id = p.patient_program_id')
                        .join('amrs.program_workflow_state', 'ps', 'pr.program_workflow_state_id = ps.program_workflow_state_id')
                        .where('pr.provider_id = ?', providerId)
                        .where('pr.encounter_id = ?', encounterId)
                        .where('pr.referred_to_location_id = ?', referredToLocationId)
                        .where('pr.referred_from_location_id = ?', referredFromLocationId)
                        .where('pr.program_workflow_state_id = ?', programWorkflowStateId)
                        .where('pr.voided = ?', voided)
                        .toString();
    
                    conn.query(query, {}, function (err, rows, fields) {
                        console.log(err)
                        if (err) {
                            reject('Error querying to find if duplicate record exists server');
                        }
                        else {
                            resolve(rows);
                        }
                        conn.release();
                    });
                })
                .catch(function (err) {
                    console.log(err)
                    reject('Error establishing connection to MySql Server find duplicate');
                });
        });
    
    
}
function getPatientReferralStats(providerId,startDate,endDate) {
   
    return new Promise(function (resolve, reject) {
        connection.getServerConnection()
            .then(function (conn) {
                var query = squel.select()
                    .field('pr.patient_referral_id')
                    .field('pr.encounter_id')
                    .field('pr.provider_id')
                    .field('pr.referred_to_location_id') 
                    .field('pr.referred_from_location_id') 
                    .field('pr.patient_program_id') 
                    .field('pr.notification_status') 
                    .field('pr.referral_reason') 
                    .from('etl.patient_referral', 'pr')
                    .join('amrs.encounter', 'u', 'pr.encounter_id = u.encounter_id')
                    .join('amrs.provider', 'apr', 'apr.provider_id = pr.provider_id')
                    .join('amrs.location', 'lr', 'pr.referred_to_location_id = lr.location_id')
                    .join('amrs.location', 'lt', 'pr.referred_from_location_id = lt.location_id')
                    .join('amrs.patient_program', 'p', 'pr.patient_program_id = p.patient_program_id')
                    .join('amrs.program_workflow_state', 'ps', 'pr.program_workflow_state_id = ps.program_workflow_state_id')
                    .where('pr.provider_id = ?', providerId)
                    .where('pr.encounter_id = ?', encounterId)
                    .where('pr.referred_to_location_id = ?', referredToLocationId)
                    .where('pr.referred_from_location_id = ?', referredFromLocationId)
                    .where('pr.program_workflow_state_id = ?', programWorkflowStateId)
                    .where('pr.voided = ?', voided)
                    .toString();

                conn.query(query, {}, function (err, rows, fields) {
                    console.log(err)
                    if (err) {
                        reject('Error querying to find if duplicate record exists server');
                    }
                    else {
                        resolve(rows);
                    }
                    conn.release();
                });
            })
            .catch(function (err) {
                console.log(err)
                reject('Error establishing connection to MySql Server find duplicate');

            });
    });


}
    
    
    function  getEncounterId(encounterUuid) {
        return new Promise(function (resolve, reject) {
            connection.getServerConnection()
                .then(function (conn) {
                    var query = squel.select()
                        .field('u.encounter_id')
                        .from('amrs.encounter', 'u')
                        .where('u.uuid = ?', encounterUuid)
                        .toString();
    
                    conn.query(query, {}, function (err, rows, fields) {
                        if (err) {
                            console.log(err)
                            resolve('Error querying server Encounter');
                        }
                        else {
                            if (rows.length > 0) {
                                resolve(rows[0]['encounter_id']);
                            } else {
                                resolve(undefined);
                            }
                        }
                        conn.release();
                    });
                })
                .catch(function (err) {
                    resolve('Error establishing connection to MySql Server to resolve encounter id');
                });
        });
    }
    function getPatientProgramId(patientProgramUuid) {
        return new Promise(function (resolve, reject) {
            connection.getServerConnection()
                .then(function (conn) {
                    var query = squel.select()
                        .field('u.patient_program_id')
                        .from('amrs.patient_program', 'u')
                        .where('u.uuid = ?', patientProgramUuid)
                        .toString();
    
                    conn.query(query, {}, function (err, rows, fields) {
                        if (err) {
                            reject('Error querying patient program server');
                        }
                        else {
                            if (rows.length > 0) {
                                resolve(rows[0]['patient_program_id']);
                            } else {
                                resolve(undefined);
                            }
                        }
                        conn.release();
                    });
                })
                .catch(function (err) {
                    reject('Error establishing connection to MySql Server  to resolve patient program');
                });
        });
    } 
   



function getProviderId(providerUuid) {
    return new Promise(function (resolve, reject) {
        connection.getServerConnection()
            .then(function (conn) {
                var query = squel.select()
                    .field('u.provider_id')
                    .from('amrs.provider', 'u')
                    .where('u.uuid = ?', providerUuid)
                    .toString();

                conn.query(query, {}, function (err, rows, fields) {
                    if (err) {
                        reject('Error querying for provider server');
                    }
                    else {
                        if (rows.length > 0) {
                            resolve(rows[0]['provider_id']);
                        } else {
                            resolve(undefined);
                        }
                    }
                    conn.release();
                });
            })
            .catch(function (err) {
                reject('Error establishing connection to MySql Server to get provider');
            });
    });
}

function getWorkFlowState(workFlowStateUuid) {
    return new Promise(function (resolve, reject) {
        connection.getServerConnection()
            .then(function (conn) {
                var query = squel.select()
                    .field('u.program_workflow_state_id')
                    .from('amrs.program_workflow_state', 'u')
                    .where('u.uuid = ?', workFlowStateUuid)
                    .toString();

                conn.query(query, {}, function (err, rows, fields) {
                    if (err) {
                        reject('Error querying for workflow state server');
                    }
                    else {
                        if (rows.length > 0) {
                            resolve(rows[0]['program_workflow_state_id']);
                        } else {
                            resolve(undefined);
                        }
                    }
                    conn.release();
                });
            })
            .catch(function (err) {
                reject('Error establishing connection to MySql Server to get workflow state');
            });
    });
}

function getLocation(locationUuid) {
    return new Promise(function (resolve, reject) {
        connection.getServerConnection()
            .then(function (conn) {
                var query = squel.select()
                    .field('u.location_id')
                    .from('amrs.location', 'u')
                    .where('u.uuid = ?', locationUuid)
                    .toString();

                conn.query(query, {}, function (err, rows, fields) {
                    if (err) {
                        reject('Error querying location server');
                    }
                    else {
                        if (rows.length > 0) {
                            resolve(rows[0]['location_id']);
                        } else {
                            resolve(undefined);
                        }
                    }
                    conn.release();
                });
            })
            .catch(function (err) {
                reject('Error establishing connection to MySql Server for location');
            });
    });
}

function getCurrentUserIdSquel() {
    return squel.select().field('MAX(user_id)')
        .from('amrs.users').where('uuid = ?', authorizer.getUser().uuid);
}

function checkResolvedReferralFields(newPatientReferralPayload) {
    var validationResult = {
        isValid: true,
        errors: []
    };
    if (_.isEmpty(newPatientReferralPayload.providerId) && newPatientReferralPayload.providerId===undefined) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'provider',
            message: 'Provider is Not Found'
        });
    }

    if (_.isEmpty(newPatientReferralPayload.encounterId) && newPatientReferralPayload.encounterId===undefined) {
        validationResult.isValid = true;
    }

    if (_.isEmpty(newPatientReferralPayload.referredToLocationId) && newPatientReferralPayload.referredToLocationId===undefined) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'referredToLocation',
            message: 'Referred To Location is Not Found'
        });
    }

    if (_.isEmpty(newPatientReferralPayload.patientProgramId) && newPatientReferralPayload.patientProgramId===undefined) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'patientProgram',
            message: 'Patient Program is Not Found'
        });
    }

    if (_.isEmpty(newPatientReferralPayload.referredFromLocationId) && newPatientReferralPayload.referredFromLocationId===undefined) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'referredFromLocation',
            message: 'Referred From Location is Not Found'
        });
    }

    if (_.isEmpty(newPatientReferralPayload.programWorkflowStateId) && newPatientReferralPayload.programWorkflowStateId===undefined) {
        validationResult.isValid = false;
        validationResult.errors.push({
            field: 'state',
            message: 'Program Workflow State is Not Found'
        });
    }
    
    return validationResult;
}