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
var Moh731ResourceService = (function () {
    function Moh731ResourceService(http, appSettingsService, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
        this._url = 'MOH-731-report';
    }
    Object.defineProperty(Moh731ResourceService.prototype, "url", {
        get: function () {
            return this.appSettingsService.getEtlRestbaseurl().trim() + this._url;
        },
        enumerable: true,
        configurable: true
    });
    Moh731ResourceService.prototype.getMoh731Report = function (locationUuids, startDate, endDate, isLegacyReport, isAggregated, cacheTtl) {
        if (cacheTtl === void 0) { cacheTtl = 0; }
        var urlParams = new http_1.URLSearchParams();
        urlParams.set('locationUuids', locationUuids);
        urlParams.set('startDate', startDate);
        urlParams.set('endDate', endDate);
        if (isLegacyReport) {
            urlParams.set('reportName', 'MOH-731-report');
        }
        else {
            urlParams.set('reportName', 'MOH-731-report-2017');
        }
        urlParams.set('isAggregated', isAggregated ? 'true' : 'false');
        var request = this.http.get(this.url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json();
        });
        return cacheTtl === 0 ?
            request : this.cacheService.cacheSingleRequest(this.url, urlParams, request, cacheTtl);
    };
    Moh731ResourceService = __decorate([
        core_1.Injectable()
    ], Moh731ResourceService);
    return Moh731ResourceService;
}());
exports.Moh731ResourceService = Moh731ResourceService;
