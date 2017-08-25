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
// TODO inject service
var SessionService = (function () {
    function SessionService(http, appSettingsService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
    }
    SessionService.prototype.getUrl = function () {
        return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'session';
    };
    SessionService.prototype.getSession = function (credentials) {
        if (credentials === void 0) { credentials = null; }
        var headers = new http_1.Headers();
        if (credentials && credentials.username) {
            var base64 = btoa(credentials.username + ':' + credentials.password);
            headers.append('Authorization', 'Basic ' + base64);
        }
        var url = this.getUrl();
        return this.http.get(url, {
            headers: headers
        });
    };
    SessionService.prototype.deleteSession = function () {
        var url = this.getUrl();
        return this.http.delete(url, {});
    };
    SessionService = __decorate([
        core_1.Injectable()
    ], SessionService);
    return SessionService;
}());
exports.SessionService = SessionService;
