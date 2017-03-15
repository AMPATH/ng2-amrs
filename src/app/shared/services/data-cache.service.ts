import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache/ionic-cache';

@Injectable()
export class DataCacheService {

    constructor(protected cache: CacheService) {
    }

    // set default cache time in seconds
    public setDefaulTime(time) {
        this.cache.setDefaultTTL(time);
    }

    public clearExpired() {
        this.cache.clearExpired();
    }

    public cacheRequest(url, params, request) {
        let cacheKey = url + params.toString();
        return this.cache.loadFromObservable(cacheKey, request);
    }
    public clearAll() {
        this.cache.clearAll();
    }

    public disableCache(value) {
        this.cache.disableCache(true);
    }
    public cacheSingleRequest(url, params, request, time) {
        let ttl = time;
        let cacheKey = url + params.toString();
        return this.cache.loadFromObservable(cacheKey, request, ttl);
    }

}
