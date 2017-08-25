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
var ClinicalSummaryVisualizationResourceService = (function () {
    function ClinicalSummaryVisualizationResourceService(http, appSettingsService, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
    }
    ClinicalSummaryVisualizationResourceService.prototype.getUrl = function (reportName) {
        return this.appSettingsService.getEtlRestbaseurl().trim() + ("" + reportName);
    };
    ClinicalSummaryVisualizationResourceService.prototype.getPatientListUrl = function (reportName) {
        return this.appSettingsService.getEtlRestbaseurl().trim() + (reportName + "/patient-list");
    };
    ClinicalSummaryVisualizationResourceService.prototype.getUrlRequestParams = function (params) {
        var urlParams = new http_1.URLSearchParams();
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('endDate', params.endDate);
        urlParams.set('gender', params.gender);
        urlParams.set('startDate', params.startDate);
        urlParams.set('groupBy', params.groupBy);
        urlParams.set('indicator', params.indicator || params.indicators);
        urlParams.set('order', params.order);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        return urlParams;
    };
    ClinicalSummaryVisualizationResourceService.prototype.getHivComparativeOverviewReport = function (params) {
        var urlParams = this.getUrlRequestParams(params);
        var url = this.getUrl('clinical-hiv-comparative-overview');
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json();
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    ClinicalSummaryVisualizationResourceService.prototype.getReportOverviewPatientList = function (reportName, params) {
        var urlParams = this.getUrlRequestParams(params);
        var url = this.getPatientListUrl(reportName);
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().result;
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    ClinicalSummaryVisualizationResourceService.prototype.getHivComparativeOverviewPatientList = function (params) {
        var urlParams = this.getUrlRequestParams(params);
        var url = this.getPatientListUrl('clinical-hiv-comparative-overview');
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().result;
        });
        this.cacheService.cacheRequest(url, urlParams, request);
        return request;
    };
    ClinicalSummaryVisualizationResourceService.prototype.getArtOverviewReport = function (params) {
        var urlParams = this.getUrlRequestParams(params);
        var url = this.getUrl('clinical-art-overview');
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json();
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    ClinicalSummaryVisualizationResourceService.prototype.getArtOverviewReportPatientList = function (params) {
        var urlParams = this.getUrlRequestParams(params);
        var url = this.getPatientListUrl('clinical-art-overview');
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().result;
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    ClinicalSummaryVisualizationResourceService.prototype.getPatientCareStatusReport = function (params) {
        var urlParams = this.getUrlRequestParams(params);
        var url = this.getUrl('clinical-patient-care-status-overview');
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json();
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    ClinicalSummaryVisualizationResourceService.prototype.getPatientCareStatusReportList = function (params) {
        var urlParams = this.getUrlRequestParams(params);
        var url = this.getPatientListUrl('clinical-patient-care-status-overview');
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().result;
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    ClinicalSummaryVisualizationResourceService = __decorate([
        core_1.Injectable()
    ], ClinicalSummaryVisualizationResourceService);
    return ClinicalSummaryVisualizationResourceService;
}());
exports.ClinicalSummaryVisualizationResourceService = ClinicalSummaryVisualizationResourceService;
