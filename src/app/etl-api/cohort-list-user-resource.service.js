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
var CohortUserResourceService = (function () {
    function CohortUserResourceService(http, appSettingsService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
    }
    CohortUserResourceService.prototype.getUrl = function () {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort';
    };
    CohortUserResourceService.prototype.getCohortUser = function (cohortUuid) {
        if (!cohortUuid) {
            return null;
        }
        var url = this.getUrl();
        url += '/' + cohortUuid + '/cohort-users';
        var params = new http_1.URLSearchParams();
        return this.http.get(url, {
            search: params
        }).map(function (response) {
            return response.json();
        });
    };
    CohortUserResourceService.prototype.voidCohortUser = function (cohortUserId) {
        var url = this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-user';
        url += '/' + cohortUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.delete(url, options)
            .map(function (response) {
            return response;
        });
    };
    CohortUserResourceService.prototype.createCohortUser = function (payload) {
        var url = this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-user';
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(url, JSON.stringify(payload), options)
            .map(function (response) {
            return response.json();
        });
    };
    CohortUserResourceService.prototype.updateCohortUser = function (cohortUserId, payload) {
        var url = this.appSettingsService.getEtlRestbaseurl().trim() + 'cohort-user';
        url += '/' + cohortUserId;
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(url, JSON.stringify(payload), options)
            .map(function (response) {
            return response.json();
        });
    };
    CohortUserResourceService = __decorate([
        core_1.Injectable()
    ], CohortUserResourceService);
    return CohortUserResourceService;
}());
exports.CohortUserResourceService = CohortUserResourceService;
