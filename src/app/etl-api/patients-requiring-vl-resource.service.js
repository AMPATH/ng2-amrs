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
require("rxjs/add/operator/toPromise");
var PatientsRequiringVLResourceService = (function () {
    function PatientsRequiringVLResourceService(_http, appSettingsService, cacheService) {
        this._http = _http;
        this.appSettingsService = appSettingsService;
        this.cacheService = cacheService;
    }
    PatientsRequiringVLResourceService.prototype.geturl = function () {
        return this.appSettingsService.getEtlRestbaseurl().trim();
    };
    PatientsRequiringVLResourceService.prototype.getPatientList = function (startDate, endDate, locationUuids, startIndex, limit) {
        var api = this.geturl() + 'patients-requiring-viral-load-order';
        var urlParams = new http_1.URLSearchParams();
        if (!startIndex) {
            startIndex = '0';
        }
        if (!limit) {
            limit = '100000';
        }
        urlParams.set('startDate', startDate);
        urlParams.set('endDate', endDate);
        urlParams.set('locationUuids', locationUuids);
        urlParams.set('startIndex', startIndex);
        urlParams.set('limit', limit);
        var request = this._http.get(api, { search: urlParams }).map(function (data) { return data.json(); });
        return this.cacheService.cacheRequest(api, urlParams, request);
    };
    PatientsRequiringVLResourceService = __decorate([
        core_1.Injectable()
    ], PatientsRequiringVLResourceService);
    return PatientsRequiringVLResourceService;
}());
exports.PatientsRequiringVLResourceService = PatientsRequiringVLResourceService;
