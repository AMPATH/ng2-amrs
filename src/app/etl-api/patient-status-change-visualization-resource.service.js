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
var PatientStatusVisualizationResourceService = (function () {
    function PatientStatusVisualizationResourceService(http, appSettingsService, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
    }
    PatientStatusVisualizationResourceService.prototype.getAggregates = function (options) {
        console.log('====', options);
        var api = this.appSettingsService.getEtlServer() +
            '/patient-status-change-tracking';
        var params = this.getUrlRequestParams(options);
        var request = this.http.get(api, { search: params }).map(function (data) { return data.json(); });
        return this.cacheService.cacheRequest(api, params, request);
    };
    PatientStatusVisualizationResourceService.prototype.getPatientList = function (options) {
        var api = this.appSettingsService.getEtlServer() +
            '/patient-status-change-tracking/patient-list';
        var params = this.getUrlPatientListRequestParams(options);
        var request = this.http.get(api, { search: params }).map(function (data) { return data.json(); });
        return this.cacheService.cacheRequest(api, params, request);
    };
    PatientStatusVisualizationResourceService.prototype.getUrlRequestParams = function (options) {
        var urlParams = new http_1.URLSearchParams();
        if (!options.startIndex) {
            options.startIndex = '0';
        }
        if (!options.limit) {
            options.limit = '300';
        }
        urlParams.set('startDate', options.startDate);
        urlParams.set('analysis', options.analysis);
        urlParams.set('endDate', options.endDate);
        urlParams.set('locationUuids', options.locationUuids);
        return urlParams;
    };
    PatientStatusVisualizationResourceService.prototype.getUrlPatientListRequestParams = function (options) {
        var urlParams = new http_1.URLSearchParams();
        if (!options.startIndex) {
            options.startIndex = '0';
        }
        if (!options.limit) {
            options.limit = '300';
        }
        urlParams.set('startDate', options.startDate);
        urlParams.set('endDate', options.endDate);
        urlParams.set('locationUuids', options.locationUuids);
        urlParams.set('indicator', options.indicator);
        urlParams.set('startIndex', options.startIndex);
        urlParams.set('analysis', options.analysis);
        urlParams.set('limit', options.limit);
        return urlParams;
    };
    PatientStatusVisualizationResourceService = __decorate([
        core_1.Injectable()
    ], PatientStatusVisualizationResourceService);
    return PatientStatusVisualizationResourceService;
}());
exports.PatientStatusVisualizationResourceService = PatientStatusVisualizationResourceService;
