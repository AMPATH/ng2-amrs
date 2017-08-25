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
var HivSummaryResourceService = (function () {
    function HivSummaryResourceService(http, appSettingsService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
    }
    HivSummaryResourceService.prototype.getUrl = function () {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'patient';
    };
    HivSummaryResourceService.prototype.getHivSummary = function (patientUuid, startIndex, limit, includeNonClinicalEncounter) {
        var url = this.getUrl();
        url += '/' + patientUuid + '/hiv-summary';
        var params = new http_1.URLSearchParams();
        if (includeNonClinicalEncounter !== undefined) {
            params.set('includeNonClinicalEncounter', includeNonClinicalEncounter.toString());
        }
        params.set('startIndex', startIndex.toString());
        params.set('limit', limit.toString());
        return this.http.get(url, {
            search: params
        })
            .map(function (response) {
            return response.json().result;
        });
    };
    HivSummaryResourceService = __decorate([
        core_1.Injectable()
    ], HivSummaryResourceService);
    return HivSummaryResourceService;
}());
exports.HivSummaryResourceService = HivSummaryResourceService;
