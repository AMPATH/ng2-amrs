import { Injectable } from '@angular/core';
import { CacheService } from 'ionic-cache';

@Injectable()
export class DataCacheService {

    constructor(protected cache: CacheService) {
    }

    // set default cache time in seconds
    public setDefaulTime(time) {
        this.cache.setDefaultTTL(time);
    }

    public clearExpired() {
        return this.cache.clearExpired();
    }

    public cacheRequest(url, params, request) {
        let cacheKey = url + params.toString();
        return this.cache.loadFromObservable(cacheKey, request);
    }
    public clearAll() {
        return this.cache.clearAll();
    }

    public disableCache(value) {
        this.cache.enableCache(false);
    }
    public cacheSingleRequest(url, params, request, time) {
        let ttl = time;
        let cacheKey = url + params.toString();
        return this.cache.loadFromObservable(cacheKey, request, ttl);
    }

}
