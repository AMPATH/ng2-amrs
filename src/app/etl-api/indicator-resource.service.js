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
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/toPromise");
var IndicatorResourceService = (function () {
    function IndicatorResourceService(http, appSettingsService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
        this.reportIndicators = new Rx_1.ReplaySubject(1);
    }
    /**
     * @param {*} param
     * @param {boolean} [forceRefresh]
     * @returns
     *
     * @memberOf IndicatorResourceService
     */
    IndicatorResourceService.prototype.getReportIndicators = function (param, forceRefresh) {
        // If the Subject was NOT subscribed before OR if forceRefresh is requested
        var _this = this;
        var params = new http_1.URLSearchParams();
        params.set('report', param.report);
        if (!this.reportIndicators.observers.length || forceRefresh) {
            this.http.get(this.appSettingsService.getEtlRestbaseurl().trim() + 'indicators-schema', {
                search: params
            })
                .map(function (res) { return res.json(); })
                .subscribe(function (data) { return _this.reportIndicators.next(data.result); }, function (error) { return _this.reportIndicators.error(error); });
        }
        return this.reportIndicators;
    };
    IndicatorResourceService = __decorate([
        core_1.Injectable()
    ], IndicatorResourceService);
    return IndicatorResourceService;
}());
exports.IndicatorResourceService = IndicatorResourceService;
