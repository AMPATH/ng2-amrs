"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var DataCacheService = (function () {
    function DataCacheService(cache) {
        this.cache = cache;
    }
    // set default cache time in seconds
    DataCacheService.prototype.setDefaulTime = function (time) {
        this.cache.setDefaultTTL(time);
    };
    DataCacheService.prototype.clearExpired = function () {
        return this.cache.clearExpired();
    };
    DataCacheService.prototype.cacheRequest = function (url, params, request) {
        var cacheKey = url + params.toString();
        return this.cache.loadFromObservable(cacheKey, request);
    };
    DataCacheService.prototype.clearAll = function () {
        return this.cache.clearAll();
    };
    DataCacheService.prototype.disableCache = function (value) {
        this.cache.enableCache(false);
    };
    DataCacheService.prototype.cacheSingleRequest = function (url, params, request, time) {
        var ttl = time;
        var cacheKey = url + params.toString();
        return this.cache.loadFromObservable(cacheKey, request, ttl);
    };
    DataCacheService = __decorate([
        core_1.Injectable()
    ], DataCacheService);
    return DataCacheService;
}());
exports.DataCacheService = DataCacheService;
