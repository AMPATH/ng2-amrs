'use strict';

const departmentsConfig = require('./department-programs-config.json');
const _ = require('lodash');

var serviceDefinition = {
    getAllDepartmentsConfig: getAllDepartmentsConfig,
    getDepartmentPrograms: getDepartmentPrograms,
    getDepartmentProgramUuids: getDepartmentProgramUuids
};

module.exports = serviceDefinition;

function getAllDepartmentsConfig() {
    return  JSON.parse(JSON.stringify(departmentsConfig));
}
function getDepartmentPrograms(department){
    return new Promise(function (resolve, reject) {
     let departmentProgramConfig = departmentsConfig;
     let departmentPrograms = [];
     _.each(departmentProgramConfig, (departmentConf) => {
           let departmentName = departmentConf.name;
           let programs = departmentConf.programs;
           if(departmentName === department || department === ''){
              _.each(programs,(program) => {
                departmentPrograms.push(program);
              });
           }
     });

     resolve(JSON.stringify(departmentPrograms));

    });
}
function getDepartmentProgramUuids(department){
  let departmentProgramConfig = departmentsConfig;
  let departmentPrograms = [];
  _.each(departmentProgramConfig, (departmentConf) => {
        let departmentName = departmentConf.name;
        let programs = departmentConf.programs;
        if(departmentName === department || department === ''){
           _.each(programs,(program) => {
             departmentPrograms.push(program.uuid);
           });
        }
  });

  return departmentPrograms;

}
