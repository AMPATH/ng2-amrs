"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var LabsResourceService = (function () {
    function LabsResourceService(http, appSettingsService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
    }
    LabsResourceService.prototype.getNewPatientLabResults = function (params) {
        var urlParams = new http_1.URLSearchParams();
        urlParams.set('startDate', params.startDate);
        urlParams.set('endDate', params.endDate);
        urlParams.set('patientUuId', params.patientUuId);
        return this.http.get(this.getUrl(), { search: urlParams }).map(this.parseNewLabResults)
            .catch(this.handleError);
    };
    LabsResourceService.prototype.getHistoricalPatientLabResults = function (patientUuId, params) {
        if (!patientUuId) {
            return null;
        }
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '20';
        }
        var urlParams = new http_1.URLSearchParams();
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('limit', params.limit);
        return this.http.get(this.appSettingsService.getEtlRestbaseurl().trim()
            + ("patient/" + patientUuId + "/data"), { search: urlParams }).map(this.parseHistoricalLabResults)
            .catch(this.handleError);
    };
    LabsResourceService.prototype.getUrl = function () {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient-lab-orders';
    };
    LabsResourceService.prototype.parseHistoricalLabResults = function (res) {
        var body = res.json();
        return body.result;
    };
    LabsResourceService.prototype.parseNewLabResults = function (res) {
        var body = res.json();
        if (body.errors) {
            return body;
        }
        return body.updatedObs;
    };
    LabsResourceService.prototype.handleError = function (error) {
        return Observable_1.Observable.throw(error.message
            ? error.message
            : error.status
                ? error.status + " - " + error.statusText
                : 'Server Error');
    };
    LabsResourceService = __decorate([
        core_1.Injectable()
    ], LabsResourceService);
    return LabsResourceService;
}());
exports.LabsResourceService = LabsResourceService;
