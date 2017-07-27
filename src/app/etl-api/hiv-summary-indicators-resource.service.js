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
var HivSummaryIndicatorsResourceService = (function () {
    function HivSummaryIndicatorsResourceService(http, appSettingsService, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
    }
    HivSummaryIndicatorsResourceService.prototype.getUrl = function () {
        return this.appSettingsService.getEtlRestbaseurl().trim() + "hiv-summary-indicators";
    };
    HivSummaryIndicatorsResourceService.prototype.getPatientListUrl = function () {
        return this.appSettingsService.getEtlRestbaseurl().trim()
            + "hiv-summary-indicators/patient-list";
    };
    HivSummaryIndicatorsResourceService.prototype.getUrlRequestParams = function (params) {
        var urlParams = new http_1.URLSearchParams();
        if (params.indicators) {
            urlParams.set('indicators', params.indicators);
        }
        if (params.indicator) {
            urlParams.set('indicator', params.indicator);
        }
        urlParams.set('endDate', params.endDate);
        urlParams.set('gender', params.gender);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('startAge', params.startAge);
        urlParams.set('endAge', params.endAge);
        return urlParams;
    };
    HivSummaryIndicatorsResourceService.prototype.getHivSummaryIndicatorsReport = function (params) {
        var urlParams = this.getUrlRequestParams(params);
        var url = this.getUrl();
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json();
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    HivSummaryIndicatorsResourceService.prototype.getHivSummaryIndicatorsPatientList = function (params) {
        var urlParams = this.getUrlRequestParams(params);
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('limit', params.limit);
        var url = this.getPatientListUrl();
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().result;
        });
        this.cacheService.cacheRequest(url, urlParams, request);
        return request;
    };
    HivSummaryIndicatorsResourceService = __decorate([
        core_1.Injectable()
    ], HivSummaryIndicatorsResourceService);
    return HivSummaryIndicatorsResourceService;
}());
exports.HivSummaryIndicatorsResourceService = HivSummaryIndicatorsResourceService;
