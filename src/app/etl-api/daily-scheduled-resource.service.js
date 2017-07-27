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
var DailyScheduleResourceService = (function () {
    function DailyScheduleResourceService(http, appSettingsService, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
    }
    DailyScheduleResourceService.prototype.getUrl = function (reportName, selectedDate) {
        return this.appSettingsService.getEtlRestbaseurl().trim() + (reportName + "/" + selectedDate);
    };
    DailyScheduleResourceService.prototype.getDailyVisits = function (params) {
        var urlParams = new http_1.URLSearchParams();
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        var url = this.getUrl('daily-visits', params.startDate);
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().result;
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    DailyScheduleResourceService.prototype.getDailyAppointments = function (params) {
        var urlParams = new http_1.URLSearchParams();
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        var url = this.getUrl('daily-appointments', params.startDate);
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().result;
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    DailyScheduleResourceService.prototype.getDailyHasNotReturned = function (params) {
        var urlParams = new http_1.URLSearchParams();
        if (!params.startIndex) {
            params.startIndex = '0';
        }
        if (!params.limit) {
            params.limit = '300';
        }
        urlParams.set('startIndex', params.startIndex);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        var url = this.getUrl('daily-has-not-returned', params.startDate);
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().result;
        });
        return this.cacheService.cacheRequest(url, urlParams, request);
    };
    DailyScheduleResourceService = __decorate([
        core_1.Injectable()
    ], DailyScheduleResourceService);
    return DailyScheduleResourceService;
}());
exports.DailyScheduleResourceService = DailyScheduleResourceService;
