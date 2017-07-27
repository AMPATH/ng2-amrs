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
var LabOrderResourceService = (function () {
    function LabOrderResourceService(http, appSettingsService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
    }
    LabOrderResourceService.prototype.postOrderToEid = function (location, payload) {
        var url = this.appSettingsService.getEtlRestbaseurl().trim() + 'eid/order/';
        url = url + location;
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(url, JSON.stringify(payload), options)
            .map(function (response) {
            return response.json();
        });
    };
    LabOrderResourceService = __decorate([
        core_1.Injectable()
    ], LabOrderResourceService);
    return LabOrderResourceService;
}());
exports.LabOrderResourceService = LabOrderResourceService;
