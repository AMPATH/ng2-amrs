import { TestBed, inject } from '@angular/core/testing';
import { ClinicDashboardCacheService } from './clinic-dashboard-cache.service';

describe('ClinicDashboardCacheService', () => {
    let service;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                ClinicDashboardCacheService
            ]
        });
    });

    it('should be defined',
        inject([ClinicDashboardCacheService], (s: ClinicDashboardCacheService) => {
            expect(s).toBeTruthy();
        })
    );

    it('should add an item to the cache when add() is called with key and value',
        inject([ClinicDashboardCacheService], (s: ClinicDashboardCacheService) => {
            s.add('test', ['hello']);
            s.add('test2', 'hello');
            s.add('test3', { hello: 'hello' });
            let cached = s.getCached();
            expect(cached['test2']).toEqual('hello');
            expect(cached['test3']).toEqual({ hello: 'hello' });
        })
    );

    it('should get and item when getByKey() is called with a key',
        inject([ClinicDashboardCacheService], (s: ClinicDashboardCacheService) => {
            s.add('test', ['hello']);
            s.add('test2', 'hello');
            s.add('test3', { hello: 'hello' });
            let cached = s.getByKey('test');
            expect(cached).toEqual(['hello']);
        })
    );

    it('should remove an item when remove() is called with a key',
        inject([ClinicDashboardCacheService], (s: ClinicDashboardCacheService) => {
            s.add('test', ['hello']);
            s.add('test2', 'hello');
            s.add('test3', { hello: 'hello' });
            s.remove('test');
            let cached = s.getByKey('test');
            expect(cached).toBeUndefined();
        })
    );

    it('should reset the cache when clear() is called',
        inject([ClinicDashboardCacheService], (s: ClinicDashboardCacheService) => {
            s.add('test', ['hello']);
            s.add('test2', 'hello');
            s.add('test3', { hello: 'hello' });
            s.clear();
            let cached = s.getCached();
            expect(cached).toEqual({});
        })
    );

});
