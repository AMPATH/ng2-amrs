'use strict';

var authorizer = {};
var currentUser = null;
var currentUserPrivileges = [];
var currentUserRoles = [];

var PRIVILEGES = {
    canViewPatient: 'View Patients',
    canViewDataAnalytics: 'View Data Analytics',
    canViewDataEntryStats: 'View POC Data entry statitsisc',
    canViewClinicDashBoard: 'View Clinic Dashboard'
};

var reportPrivileges = {
    'daily-appointments': [PRIVILEGES.canViewClinicDashBoard, PRIVILEGES.canViewPatient],
    'daily-attendance': [PRIVILEGES.canViewClinicDashBoard, PRIVILEGES.canViewPatient],
    'daily-has-not-returned': [PRIVILEGES.canViewClinicDashBoard, PRIVILEGES.canViewPatient],
    'attended': [PRIVILEGES.canViewClinicDashBoard],
    'scheduled': [PRIVILEGES.canViewClinicDashBoard],
    'clinical-hiv-comparative-overview-report': [PRIVILEGES.canViewDataAnalytics],
    'clinical-art-overview-report': [PRIVILEGES.canViewDataAnalytics],
    'clinical-patient-care-status-overview-report': [PRIVILEGES.canViewDataAnalytics],
    'MOH-731-report': [PRIVILEGES.canViewDataAnalytics],
    'patient-register-report': [PRIVILEGES.canViewPatient, PRIVILEGES.canViewDataAnalytics],
    'hiv-summary-report': [PRIVILEGES.canViewDataAnalytics],
    'hiv-summary-monthly-report': [PRIVILEGES.canViewDataAnalytics],
    'clinical-reminder-report': [PRIVILEGES.canViewPatient],
    'patient-list-report-perc_virally_suppressed': [PRIVILEGES.canViewPatient, PRIVILEGES.canViewDataAnalytics],
    'patient-list-report-on_art_total': [PRIVILEGES.canViewPatient, PRIVILEGES.canViewDataAnalytics],
    'patient-list-report-currently_in_care_total': [PRIVILEGES.canViewPatient, PRIVILEGES.canViewDataAnalytics],
    'patient-list-report-perc_tested_appropriately': [PRIVILEGES.canViewPatient, PRIVILEGES.canViewDataAnalytics]
};

var SUPERUSER_ROLES = ['System Developer'];

authorizer.setUser = function (openmrsUser) {
    currentUser = openmrsUser;
    if (openmrsUser === undefined) return;

    _setCurrentUserPrivileges();
    _setCurrentUserRoles();
};

authorizer.getUser = function () {
    return currentUser;
};

authorizer.getCurrentUserPreviliges = function () {
    //console.log('All privileges', currentUserPrivileges);
    return currentUserPrivileges;
};

authorizer.getCurrentUserRoles = function () {
    return currentUserRoles;
};

authorizer.getAllPrivileges = function () {
    return PRIVILEGES;
};

authorizer.getAllPrivilegesArray = function () {
    var allPrivileges = [];

    for(var prop in PRIVILEGES){
        allPrivileges.push(PRIVILEGES[prop]);
    }
    //console.log('All privileges', allPrivileges);
    return allPrivileges;
};

authorizer.hasPrivilege = function (privilege) {
    if (authorizer.isSuperUser()) {
        return true;
    }
    //console.log('Current user privileges: ', JSON.stringify(currentUserPrivileges));
    //console.log('Looking for privilege: ', privilege);
    if (currentUserPrivileges.indexOf(privilege) > -1) {
        return true;
    }
    return false;
};

authorizer.hasPrivileges = function (arrayOfPrivileges) {
    if (authorizer.isSuperUser()) {
        return true;
    }

    var hasPrivilege = true;

    for(var i = 0; i <arrayOfPrivileges.length; i++){
        if(!authorizer.hasPrivilege(arrayOfPrivileges[i])) {
           hasPrivilege = false;
           break;
        }
    }
    return hasPrivilege;
};

authorizer.hasReportAccess = function (reportName) {
    var hasAccess = false;
    var requiredPrivileges = reportPrivileges[reportName];

    if(requiredPrivileges){
        hasAccess = authorizer.hasPrivileges(requiredPrivileges);
    }
    return hasAccess;
};

authorizer.isSuperUser = function () {
    for (var i = 0; i < SUPERUSER_ROLES.length; i++) {
        var role = SUPERUSER_ROLES[i];
        if (currentUserRoles.indexOf(role) > -1) {
            return true;
        }
    }

    return false;
};

module.exports = authorizer;

function _setCurrentUserPrivileges() {
    currentUserPrivileges = [];
    for (var i = 0; i < currentUser.privileges.length; i++) {
        //console.log('Adding privilege: ', currentUser.privileges[i].display);
        currentUserPrivileges.push(currentUser.privileges[i].display);
    }
}

function _setCurrentUserRoles() {
    currentUserRoles = [];
    for (var i = 0; i < currentUser.roles.length; i++) {
        currentUserRoles.push(currentUser.roles[i].display);
    }
}

