"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var SessionStorageService = (function () {
    function SessionStorageService() {
    }
    SessionStorageService.prototype.getItem = function (keyName) {
        return window.sessionStorage.getItem(keyName);
    };
    SessionStorageService.prototype.setItem = function (keyName, value) {
        window.sessionStorage.setItem(keyName, value);
    };
    SessionStorageService.prototype.getObject = function (keyName) {
        var stored = window.sessionStorage.getItem(keyName);
        try {
            var object = JSON.parse(stored);
            return object;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    };
    SessionStorageService.prototype.setObject = function (keyName, value) {
        window.sessionStorage.setItem(keyName, JSON.stringify(value));
    };
    SessionStorageService.prototype.remove = function (keyName) {
        window.sessionStorage.removeItem(keyName);
    };
    SessionStorageService.prototype.clear = function () {
        window.sessionStorage.clear();
    };
    Object.defineProperty(SessionStorageService.prototype, "storageLength", {
        get: function () {
            return window.sessionStorage.length;
        },
        enumerable: true,
        configurable: true
    });
    SessionStorageService = __decorate([
        core_1.Injectable()
    ], SessionStorageService);
    return SessionStorageService;
}());
exports.SessionStorageService = SessionStorageService;
