var Promise = require("bluebird");
var enrollmentDao = require('../dao/enrollment/enrollment-dao');
const _ = require('lodash');

var def = {
    getActiveProgramEnrollmentSummary: getActiveProgramEnrollmentSummary,
    getActiveProgramEnrollmentsPatientList: getActiveProgramEnrollmentsPatientList
};

module.exports = def;


function getActiveProgramEnrollmentSummary(params){

    /*
     returns a list of all program-types with their id
     and uuid

    */

  return new Promise(function (resolve, reject) {

           enrollmentDao.getActiveProgramEnrollmentSummary(params).then(function (result) {
                     if(result){
                          var enrolled = result;
                          resolve(enrolled);
                     }else{
                         console.error('ERROR: GetActiveProgramEnrollments error');
                         reject('error');
                     }              
                 })
                .catch(function (error) {
                       console.error('Error: GetActiveProgramEnrollments result Error', error);
                       reject('error');
                });


      });




}

function getActiveProgramEnrollmentsPatientList(params){

    /*
     returns a list of all patients enrolled in a program
     and uuid

    */

  return new Promise(function (resolve, reject) {

           enrollmentDao.getActiveProgramEnrollmentsPatientList(params).then(function (result) {
                     if(result){
                          var enrolled = result;
                          resolve(enrolled);
                     }else{
                         console.error('ERROR: GetActiveProgramEnrollmentsPatientList error');
                         reject('error');
                     }              
                 })
                .catch(function (error) {
                       console.error('Error: GetActiveProgramEnrollmentsPatientList result Error', error);
                       reject('error');
                });


      });




}





