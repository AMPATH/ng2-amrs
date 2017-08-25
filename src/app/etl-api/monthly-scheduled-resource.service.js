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
var MonthlyScheduleResourceService = (function () {
    function MonthlyScheduleResourceService(http, appSettingsService, dataCache, cacheService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.dataCache = dataCache;
        this.cacheService = cacheService;
    }
    MonthlyScheduleResourceService.prototype.getMonthlySchedule = function (params) {
        var url = this.getUrl();
        var urlParams = new http_1.URLSearchParams();
        urlParams.set('endDate', params.endDate);
        urlParams.set('startDate', params.startDate);
        urlParams.set('locationUuids', params.locationUuids);
        urlParams.set('limit', params.limit);
        urlParams.set('groupBy', 'groupByPerson,groupByAttendedDate,groupByRtcDate');
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().results;
        });
        return this.dataCache.cacheRequest(url, urlParams, request);
    };
    MonthlyScheduleResourceService.prototype.getUrl = function () {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'get-monthly-schedule';
    };
    MonthlyScheduleResourceService = __decorate([
        core_1.Injectable()
    ], MonthlyScheduleResourceService);
    return MonthlyScheduleResourceService;
}());
exports.MonthlyScheduleResourceService = MonthlyScheduleResourceService;
