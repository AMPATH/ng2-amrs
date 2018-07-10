'use strict';

const departmentsConfig = require('./department-programs-config.json');

var serviceDefinition = {
    getAllDepartmentsConfig: getAllDepartmentsConfig
};

module.exports = serviceDefinition;

function getAllDepartmentsConfig() {
    return  JSON.parse(JSON.stringify(departmentsConfig));
}
