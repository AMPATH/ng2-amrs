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
var ClinicLabOrdersResourceService = (function () {
    function ClinicLabOrdersResourceService(http, appSettingsService, dataCache) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.dataCache = dataCache;
    }
    ClinicLabOrdersResourceService.prototype.getUrl = function (reportName, selectedDate) {
        return this.appSettingsService.getEtlRestbaseurl().trim() + (reportName + "/" + selectedDate);
    };
    ClinicLabOrdersResourceService.prototype.getClinicLabOrders = function (params) {
        var url = this.getUrl('clinic-lab-orders', params.dateActivated);
        var urlParams = new http_1.URLSearchParams();
        urlParams.set('locationUuids', params.locationUuids);
        var request = this.http.get(url, {
            search: urlParams
        })
            .map(function (response) {
            return response.json().result;
        });
        return this.dataCache.cacheRequest(url, urlParams, request);
    };
    ClinicLabOrdersResourceService = __decorate([
        core_1.Injectable()
    ], ClinicLabOrdersResourceService);
    return ClinicLabOrdersResourceService;
}());
exports.ClinicLabOrdersResourceService = ClinicLabOrdersResourceService;
