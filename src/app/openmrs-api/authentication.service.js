"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var constants_1 = require("../utils/constants");
var AuthenticationService = (function () {
    function AuthenticationService(appSettingsService, localStorageService, sessionStorageService, sessionService, _cookieService) {
        this.appSettingsService = appSettingsService;
        this.localStorageService = localStorageService;
        this.sessionStorageService = sessionStorageService;
        this.sessionService = sessionService;
        this._cookieService = _cookieService;
    }
    AuthenticationService.prototype.authenticate = function (username, password) {
        var _this = this;
        var credentials = {
            username: username,
            password: password
        };
        var request = this.sessionService.getSession(credentials);
        request
            .subscribe(function (response) {
            var data = response.json();
            if (data.authenticated) {
                _this.setCredentials(username, password);
                // store logged in user details in session storage
                var user = data.user;
                _this.storeUser(user);
            }
        });
        return request;
    };
    AuthenticationService.prototype.logOut = function () {
        var _this = this;
        var response = this.sessionService.deleteSession();
        response
            .subscribe(function (res) {
            _this.clearSessionCache();
        }, function (error) {
            _this.clearSessionCache();
        });
        return response;
    };
    AuthenticationService.prototype.clearSessionCache = function () {
        this.clearLoginAlertCookies();
        this.clearCredentials();
        this.clearUserDetails();
    };
    // This will clear motd alert cookies set  at every log in
    AuthenticationService.prototype.clearLoginAlertCookies = function () {
        var cookieKey = 'motdLoginCookie';
        this._cookieService.remove(cookieKey);
    };
    AuthenticationService.prototype.setCredentials = function (username, password) {
        var base64 = btoa(username + ':' + password);
        this.sessionStorageService.setItem(constants_1.Constants.CREDENTIALS_KEY, base64);
    };
    AuthenticationService.prototype.clearCredentials = function () {
        this.sessionStorageService.remove(constants_1.Constants.CREDENTIALS_KEY);
    };
    AuthenticationService.prototype.storeUser = function (user) {
        this.sessionStorageService.setObject(constants_1.Constants.USER_KEY, user);
    };
    AuthenticationService.prototype.clearUserDetails = function () {
        this.sessionStorageService.remove(constants_1.Constants.USER_KEY);
    };
    AuthenticationService = __decorate([
        core_1.Injectable()
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
