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
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var HivClinicFlowResourceService = (function () {
    function HivClinicFlowResourceService(http, appSettingsService, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
        this.result = new BehaviorSubject_1.BehaviorSubject(null);
        this.requestUrl = '';
    }
    HivClinicFlowResourceService.prototype.getUrl = function (reportName) {
        return this.appSettingsService.getEtlRestbaseurl().trim() + reportName;
    };
    HivClinicFlowResourceService.prototype.getClinicFlow = function (dateStarted, locations) {
        var urlParams = new http_1.URLSearchParams();
        urlParams.set('dateStarted', dateStarted);
        urlParams.set('locationUuids', locations);
        var url = this.getUrl('patient-flow-data');
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json();
        });
        var key = url + '?' + urlParams.toString();
        /** This is a workaround to avoid multiple calls to server by the respective
         * clinic flow components
         */
        if (key !== this.requestUrl) {
            // clear cache after 1 minute
            var refreshCacheTime = 1 * 60 * 1000;
            this.requestUrl = key;
            this.cache = this.cacheService.cacheSingleRequest(url, urlParams, request, refreshCacheTime);
        }
        return this.cache;
    };
    HivClinicFlowResourceService = __decorate([
        core_1.Injectable()
    ], HivClinicFlowResourceService);
    return HivClinicFlowResourceService;
}());
exports.HivClinicFlowResourceService = HivClinicFlowResourceService;
