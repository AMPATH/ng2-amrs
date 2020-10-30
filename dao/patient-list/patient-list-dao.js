/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var Promise = require('bluebird');
var squel = require('squel');
var _ = require('underscore');
var moment = require('moment');
var connection = require('../../dao/connection/mysql-connection-service.js');
var authorizer = require('../../authorization/etl-authorizer');

var def = {
  getCohortUsersByCohortUuid: getCohortUsersByCohortUuid,
  getCohortUser: getCohortUser,
  voidCohortUser: voidCohortUser,
  updateCohortUser: updateCohortUser,
  createCohortUser: createCohortUser
};

module.exports = def;

function getCohortUsersByCohortUuid(cohortUuid) {
  return new Promise(function (resolve, reject) {
    connection
      .getServerConnection()
      .then(function (conn) {
        var query = squel
          .select()
          .field('u.user_id')
          .field('cu.cohort_user_id')
          .field('cu.voided')
          .field('cu.role')
          .field('u.username')
          .field(
            'case when cu.role is null or cu.user_id != u.user_id then "admin" else cu.role end as role'
          )
          .field(
            'case when cu.role is null or cu.user_id != u.user_id  then  "null" else cu.cohort_user_id end as cohort_user_id'
          )
          .field(
            'case when cu.role is null or cu.user_id != u.user_id  then  0 else cu.voided end as voided'
          )
          .from('amrs.cohort', 'c')
          .left_join(
            'etl.cohort_user',
            'cu',
            'c.cohort_id = cu.cohort_id and cu.voided = 0 '
          )
          .join(
            'amrs.users',
            'u',
            squel
              .expr()
              .or('cu.user_id = u.user_id')
              .or('c.creator = u.user_id')
          )
          .where('c.uuid = ?', cohortUuid)
          .where('c.voided = 0')
          .group('u.username')
          .toString();

        conn.query(query, {}, function (err, rows, fields) {
          if (err) {
            reject('Error querying server');
          } else {
            resolve(rows);
          }
          conn.release();
        });
      })
      .catch(function (err) {
        reject('Error establishing connection to MySql Server');
      });
  });
}

function getCohortUser(cohortUserId) {
  return new Promise(function (resolve, reject) {
    connection
      .getServerConnection()
      .then(function (conn) {
        var query = squel
          .select()
          .field('cu.cohort_user_id')
          .field('cu.role')
          .field('u.username')
          .field('cu.voided')
          .from('etl.cohort_user', 'cu')
          .join('amrs.users', 'u', 'cu.user_id = u.user_id')
          .join('amrs.cohort', 'c', 'c.cohort_id = cu.cohort_id')
          .where('cu.cohort_user_id = ?', cohortUserId)
          .toString();

        conn.query(query, {}, function (err, rows, fields) {
          if (err) {
            reject('Error querying server');
          } else {
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

function voidCohortUser(cohortUserId) {
  return new Promise(function (resolve, reject) {
    connection
      .getServerConnection()
      .then(function (conn) {
        var query = squel
          .update()
          .table('etl.cohort_user')
          .set('voided', 1)
          .set('date_voided', squel.fval('NOW()'))
          .set('voided_by', getCurrentUserIdSquel())
          .where('cohort_user_id = ?', cohortUserId)
          .toString();

        conn.query(query, {}, function (err, rows, fields) {
          if (err) {
            console.error(err);
            reject('Error deleting resource');
          } else {
            resolve('Resource deleted');
          }
          conn.release();
        });
      })
      .catch(function (err) {
        reject('Error establishing connection to MySql Server');
      });
  });
}

function updateCohortUser(cohortUserId, newCohortUser) {
  return new Promise(function (resolve, reject) {
    validateUpdatePayload(newCohortUser).then(function (validationStatus) {
      if (validationStatus.isValid === false) {
        reject(validationStatus);
      } else {
        connection
          .getServerConnection()
          .then(function (conn) {
            var query = squel
              .update()
              .table('etl.cohort_user')
              .set('role', newCohortUser.role)
              .set('date_changed', squel.fval('NOW()'))
              .set('changed_by', getCurrentUserIdSquel())
              .where('cohort_user_id = ?', cohortUserId)
              .toString();

            conn.query(query, {}, function (err, rows, fields) {
              if (err) {
                console.error(err);
                reject('Error updating resource');
              } else {
                getCohortUser(cohortUserId)
                  .then(function (updatedCohort) {
                    resolve(updatedCohort);
                  })
                  .catch(function (error) {
                    resolve(
                      'An unknown error occured when  trying to fetch the updated resource'
                    );
                  });
              }
              conn.release();
            });
          })
          .catch(function (err) {
            reject('Error establishing connection to MySql Server');
          });
      }
    });
  });
}

function createCohortUser(newCohortUser) {
  return new Promise(function (resolve, reject) {
    var requiredFieldsCheck = hasRequireFields(newCohortUser);

    if (!requiredFieldsCheck.isValid) {
      return reject(requiredFieldsCheck);
    }

    resolveUuidsToIds(newCohortUser)
      .then(function (newCohortUser) {
        validateCreatePayload(newCohortUser).then(function (validationStatus) {
          if (validationStatus.isValid === false) {
            reject(validationStatus);
          } else {
            connection
              .getServerConnection()
              .then(function (conn) {
                var query = squel
                  .insert()
                  .into('etl.cohort_user')
                  .set('role', newCohortUser.role)
                  .set('cohort_id', newCohortUser.cohortId)
                  .set('user_id', newCohortUser.userId)
                  .set('date_created', squel.fval('NOW()'))
                  .set('creator', getCurrentUserIdSquel())
                  .set('voided', 0)
                  .toString();

                conn.query(query, {}, function (err, rows, fields) {
                  if (err) {
                    console.error(err);
                    reject('Error updating resource');
                  } else {
                    findCohortUser(
                      newCohortUser.userId,
                      newCohortUser.cohortId,
                      0
                    )
                      .then(function (updatedCohort) {
                        resolve(updatedCohort[0]);
                      })
                      .catch(function (error) {
                        resolve(
                          'An unknown error occured when  trying to fetch the updated resource'
                        );
                      });
                  }
                  conn.release();
                });
              })
              .catch(function (err) {
                reject('Error establishing connection to MySql Server');
              });
          }
        });
      })
      .catch(function (error) {
        reject('could not resolve user or cohort uuid to id');
      });
  });
}

function findCohortUser(userId, cohortId, voided) {
  return new Promise(function (resolve, reject) {
    connection
      .getServerConnection()
      .then(function (conn) {
        var query = squel
          .select()
          .field('cu.cohort_user_id')
          .field('cu.role')
          .field('u.username')
          .field('cu.voided')
          .from('etl.cohort_user', 'cu')
          .join('amrs.users', 'u', 'cu.user_id = u.user_id')
          .join('amrs.cohort', 'c', 'c.cohort_id = cu.cohort_id')
          .where('cu.cohort_id = ?', cohortId)
          .where('cu.user_id = ?', userId)
          .where('cu.voided = ?', voided)
          .toString();

        conn.query(query, {}, function (err, rows, fields) {
          if (err) {
            reject('Error querying server');
          } else {
            resolve(rows);
          }
          conn.release();
        });
      })
      .catch(function (err) {
        reject('Error establishing connection to MySql Server');
      });
  });
}

function resolveUuidsToIds(cohortUserPayload) {
  return new Promise(function (resolve, reject) {
    getCohortId(cohortUserPayload.cohort)
      .then(function (cohortId) {
        cohortUserPayload.cohortId = cohortId;
        getUserId(cohortUserPayload.user)
          .then(function (userId) {
            cohortUserPayload.userId = userId;
            resolve(cohortUserPayload);
          })
          .catch(function (err) {
            console.error(err);
            reject(err);
          });
      })
      .catch(function (error) {
        console.error(err);
        reject(error);
      });
  });
}

function getUserId(userUuid) {
  return new Promise(function (resolve, reject) {
    connection
      .getServerConnection()
      .then(function (conn) {
        var query = squel
          .select()
          .field('u.user_id')
          .from('amrs.users', 'u')
          .where('u.uuid = ?', userUuid)
          .toString();

        conn.query(query, {}, function (err, rows, fields) {
          if (err) {
            reject('Error querying server');
          } else {
            if (rows.length > 0) {
              resolve(rows[0]['user_id']);
            } else {
              resolve(undefined);
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

function getCohortId(cohortUuid) {
  return new Promise(function (resolve, reject) {
    connection
      .getServerConnection()
      .then(function (conn) {
        var query = squel
          .select()
          .field('u.cohort_id')
          .from('amrs.cohort', 'u')
          .where('u.uuid = ?', cohortUuid)
          .toString();

        conn.query(query, {}, function (err, rows, fields) {
          if (err) {
            reject('Error querying server');
          } else {
            if (rows.length > 0) {
              resolve(rows[0]['cohort_id']);
            } else {
              resolve(undefined);
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

function validateUpdatePayload(cohortUserPayload) {
  return new Promise(function (resolve, reject) {
    var validationErrors = {
      isValid: true,
      errors: []
    };

    if (!hasValidRole(cohortUserPayload)) {
      validationErrors.isValid = false;
      validationErrors.errors.push({
        field: 'role',
        error: 'Invalid value for role.'
      });
    }

    resolve(validationErrors);
  });
}

function validateCreatePayload(cohortUserPayload) {
  return new Promise(function (resolve, reject) {
    var validationErrors = {
      isValid: true,
      errors: []
    };

    if (!hasValidRole(cohortUserPayload)) {
      validationErrors.isValid = false;
      validationErrors.errors.push({
        field: 'role',
        error: 'Invalid value for role.'
      });
    }

    if (!cohortUserPayload.cohortId) {
      validationErrors.isValid = false;
      validationErrors.errors.push({
        field: 'cohort',
        error: 'cohort does not exist.'
      });
    }

    if (!cohortUserPayload.userId) {
      validationErrors.isValid = false;
      validationErrors.errors.push({
        field: 'user',
        error: 'user does not exist.'
      });
    }

    if (validationErrors.errors.length > 1) {
      return resolve(validationErrors);
    }

    findCohortUser(cohortUserPayload.userId, cohortUserPayload.cohortId, 0)
      .then(function (results) {
        if (results.length > 0) {
          validationErrors.isValid = false;
          validationErrors.errors.push({
            field: 'cohort and user combination',
            error: 'Duplicate record exists.'
          });
        }
        resolve(validationErrors);
      })
      .catch(function (error) {
        reject('An error occured while trying to validate cohort payload');
      });
  });
}

function hasValidRole(cohortUserPayload) {
  if (cohortUserPayload.role) {
    if (
      cohortUserPayload.role !== 'view' &&
      cohortUserPayload.role !== 'edit'
    ) {
      return false;
    }
  }
  return true;
}

function hasRequireFields(newCohortUserPayload) {
  var validationResult = {
    isValid: true,
    errors: []
  };
  if (_.isEmpty(newCohortUserPayload.user)) {
    validationResult.isValid = false;
    validationResult.errors.push({
      field: 'user',
      message: 'user is required'
    });
  }

  if (_.isEmpty(newCohortUserPayload.cohort)) {
    validationResult.isValid = false;
    validationResult.errors.push({
      field: 'cohort',
      message: 'cohort is required'
    });
  }

  if (_.isEmpty(newCohortUserPayload.role)) {
    validationResult.isValid = false;
    validationResult.errors.push({
      field: 'role',
      message: 'role is required'
    });
  }

  return validationResult;
}

function getCurrentUserIdSquel() {
  return squel
    .select()
    .field('MAX(user_id)')
    .from('amrs.users')
    .where('uuid = ?', authorizer.getUser().uuid);
}
