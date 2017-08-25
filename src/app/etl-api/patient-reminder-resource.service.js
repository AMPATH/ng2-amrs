"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var PatientReminderResourceService = (function () {
    function PatientReminderResourceService(http, appSettingsService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this._datePipe = new common_1.DatePipe('en-US');
        this.referenceDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
    }
    PatientReminderResourceService.prototype.getUrl = function (patientUuid) {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient/' + patientUuid +
            '/hiv-clinical-reminder';
    };
    PatientReminderResourceService.prototype.getPatientLevelReminders = function (patientUuid) {
        var url = this.getUrl(patientUuid) + '/' + this.referenceDate;
        return this.http.get(url).map(function (response) {
            return response.json().result;
        });
    };
    PatientReminderResourceService = __decorate([
        core_1.Injectable()
    ], PatientReminderResourceService);
    return PatientReminderResourceService;
}());
exports.PatientReminderResourceService = PatientReminderResourceService;
