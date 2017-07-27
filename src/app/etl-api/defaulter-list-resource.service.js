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
var DefaulterListResourceService = (function () {
    function DefaulterListResourceService(http, appSettingsService, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
    }
    DefaulterListResourceService.prototype.getUrl = function (reportName) {
        return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
    };
    DefaulterListResourceService.prototype.getDefaulterList = function (params) {
        var urlParams = new http_1.URLSearchParams();
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('defaulterPeriod', params.defaulterPeriod);
        urlParams.set('maxDefaultPeriod', params.maxDefaultPeriod);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        var url = this.getUrl('defaulter-list');
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().result;
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    DefaulterListResourceService = __decorate([
        core_1.Injectable()
    ], DefaulterListResourceService);
    return DefaulterListResourceService;
}());
exports.DefaulterListResourceService = DefaulterListResourceService;
