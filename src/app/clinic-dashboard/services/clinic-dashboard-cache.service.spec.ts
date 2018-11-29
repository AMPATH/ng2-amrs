import { TestBed, inject } from '@angular/core/testing';
import { ClinicDashboardCacheService } from './clinic-dashboard-cache.service';

describe('ClinicDashboardCacheService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                ClinicDashboardCacheService
            ]
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
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
            const cached = s.getCached();
            expect(cached['test2']).toEqual('hello');
            expect(cached['test3']).toEqual({ hello: 'hello' });
        })
    );

    it('should get and item when getByKey() is called with a key',
        inject([ClinicDashboardCacheService], (s: ClinicDashboardCacheService) => {
            s.add('test', ['hello']);
            s.add('test2', 'hello');
            s.add('test3', { hello: 'hello' });
            const cached = s.getByKey('test');
            expect(cached).toEqual(['hello']);
        })
    );

    it('should remove an item when remove() is called with a key',
        inject([ClinicDashboardCacheService], (s: ClinicDashboardCacheService) => {
            s.add('test', ['hello']);
            s.add('test2', 'hello');
            s.add('test3', { hello: 'hello' });
            s.remove('test');
            const cached = s.getByKey('test');
            expect(cached).toBeUndefined();
        })
    );

    it('should reset the cache when clear() is called',
        inject([ClinicDashboardCacheService], (s: ClinicDashboardCacheService) => {
            s.add('test', ['hello']);
            s.add('test2', 'hello');
            s.add('test3', { hello: 'hello' });
            s.clear();
            const cached = s.getCached();
            expect(cached).toEqual({});
        })
    );

    it('should have all the required functions defined and callable',
        inject([ClinicDashboardCacheService], (s: ClinicDashboardCacheService) => {
            spyOn(s, 'setCurrentClinic').and.callFake((err, data) => { });
            s.setCurrentClinic('');
            expect(s.setCurrentClinic).toHaveBeenCalled();

            spyOn(s, 'setCurrentTab').and.callFake((err, data) => { });
            s.setCurrentTab('');
            expect(s.setCurrentTab).toHaveBeenCalled();

            spyOn(s, 'getCurrentClinic').and.callFake((err, data) => { });
            s.getCurrentClinic();
            expect(s.getCurrentClinic).toHaveBeenCalled();

            spyOn(s, 'getCurrentTab').and.callFake((err, data) => { });
            s.getCurrentTab();
            expect(s.getCurrentTab).toHaveBeenCalled();

            spyOn(s, 'setDailyTabCurrentDate').and.callFake((err, data) => { });
            s.setDailyTabCurrentDate('');
            expect(s.setDailyTabCurrentDate).toHaveBeenCalled();

            spyOn(s, 'getDailyTabCurrentDate').and.callFake((err, data) => { });
            s.getDailyTabCurrentDate();
            expect(s.getDailyTabCurrentDate).toHaveBeenCalled();

            spyOn(s, 'setIsLoading').and.callFake((err, data) => { });
            s.setIsLoading(true);
            expect(s.setIsLoading).toHaveBeenCalled();

            spyOn(s, 'getIsLoading').and.callFake((err, data) => { });
            s.getIsLoading();
            expect(s.getIsLoading).toHaveBeenCalled();
        }));

});
