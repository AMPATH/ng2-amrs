import { TestBed, inject } from '@angular/core/testing';
import { ClinicFlowCacheService } from './clinic-flow-cache.service';

describe('ClinicFlowCacheService Unit Tests', () => {
    let service: ClinicFlowCacheService;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                ClinicFlowCacheService
            ]
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defined',
        inject([ClinicFlowCacheService], (s: ClinicFlowCacheService) => {
            expect(s).toBeTruthy();
        })
    );


    it('should set selected location when setSelectedLocation is invoked with location uuid ',
        (done) => {
            service = TestBed.get(ClinicFlowCacheService);
            service.setSelectedLocation('location-uuid');

            service.getSelectedLocation().subscribe(location => {
                expect(location).toEqual(['location-uuid']);
                done();
            },
                err => console.log(err),
                () => console.log('Completed'));

        });

    it('should set selected date when setSelectedDate is invoked with date ',
        (done) => {
            service = TestBed.get(ClinicFlowCacheService);
            service.setSelectedDate('2017-01-12');

            service.getSelectedDate().subscribe(date => {
                expect(date).toEqual('2017-01-12');
                done();
            },
                err => console.log(err),
                () => console.log('Completed'));

        });

    it('should set ClinicFlowData when setClinicFlowData is invoked with data ',
        (done) => {
            service = TestBed.get(ClinicFlowCacheService);
            service.setClinicFlowData({});

            service.getClinicFlowData().subscribe(data => {
                expect(data).toEqual({});
                done();
            },
                err => console.log(err),
                () => console.log('Completed'));

        });

    it('should format data when formatData is invoked with data ',
        (done) => {
            service = TestBed.get(ClinicFlowCacheService);
            let formattedData = service.formatData([{ names: 'test name 1' },
            { names: 'test name 1' }]);
            expect(formattedData[0].names).toEqual('test name 1');
            expect(formattedData[0].person_name).toEqual('test name 1');
            expect(JSON.stringify(formattedData)).toContain(',"#":1,');
            expect(JSON.stringify(formattedData)).toContain(',"#":2,');

            formattedData = service.formatData([]);
            expect(formattedData).toEqual([]);
            done();
        });

    it('should return columns when getClinicFlowColumns is invoked ',
        (done) => {
            service = TestBed.get(ClinicFlowCacheService);
            const columns = service.getClinicFlowColumns();
            expect(columns.length).toEqual(9);
            done();
        });
    it('should cache Last Clinic Flow Selected Date ',
        (done) => {
            service = TestBed.get(ClinicFlowCacheService);
            const lastDate = service.lastClinicFlowSelectedDate = '2017-09-08';
            expect(lastDate).toEqual('2017-09-08');
            done();
        });

});
