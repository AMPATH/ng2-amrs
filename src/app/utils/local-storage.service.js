"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var LocalStorageService = (function () {
    function LocalStorageService() {
    }
    LocalStorageService.prototype.getItem = function (keyName) {
        return window.localStorage.getItem(keyName);
    };
    LocalStorageService.prototype.setItem = function (keyName, value) {
        window.localStorage.setItem(keyName, value);
    };
    LocalStorageService.prototype.getObject = function (keyName) {
        var stored = window.localStorage.getItem(keyName);
        try {
            var object = JSON.parse(stored);
            return object;
        }
        catch (error) {
            console.error(error);
            return null;
        }
    };
    LocalStorageService.prototype.setObject = function (keyName, value) {
        window.localStorage.setItem(keyName, JSON.stringify(value));
    };
    LocalStorageService.prototype.remove = function (keyName) {
        window.localStorage.removeItem(keyName);
    };
    LocalStorageService.prototype.clear = function () {
        window.localStorage.clear();
    };
    Object.defineProperty(LocalStorageService.prototype, "storageLength", {
        get: function () {
            return window.localStorage.length;
        },
        enumerable: true,
        configurable: true
    });
    LocalStorageService = __decorate([
        core_1.Injectable()
    ], LocalStorageService);
    return LocalStorageService;
}());
exports.LocalStorageService = LocalStorageService;
