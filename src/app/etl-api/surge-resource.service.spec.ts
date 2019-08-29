import { TestBed, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SurgeResourceService } from './surge-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
describe('SurgeResourceService()', () => {
    let service: SurgeResourceService;
    let http: HttpTestingController;

    const mockWeekParams = {
        year_week: '2019-W05',
        locationUuids: '08feae7c-1352-11df-a1f1-0026b9348838'
    };
    const mockDayParams = {
        _date: '2019-01-02',
        locationUuids: '08feae7c-1352-11df-a1f1-0026b9348838'
    };

    const mockReply: any = {
        results: []
    };

    const mockUrl = 'https://ngx.ampath.or.ke/etl-latest/etl/';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AppSettingsService,
                LocalStorageService,
                SurgeResourceService
            ],
            imports: [
                HttpClientTestingModule
            ]
        });
        service = TestBed.get(SurgeResourceService);
        http = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        http.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should retrieve surge weekly report data when given correct parameters', () => {

        service.getSurgeWeeklyReport(mockWeekParams).subscribe(response => {
            expect(response).toBeTruthy();
        });

        const req = http.expectOne(mockUrl + 'surge-report?year_week=201905&locationUuids=08feae7c-1352-11df-a1f1-0026b9348838');

       req.flush(mockReply);
    });

    it('should retrieve surge weekly patient list when given correct param', () => {
        const mockWeeklyPatientList: any = {
            result: []
        };
        const mockWeeklyParams = {
            indicators: 'visits_today',
            year_week: '2019-W05',
            locationUuids: '08feae7c-1352-11df-a1f1-0026b9348838'
        };
        service.getSurgeWeeklyPatientList(mockWeeklyParams).subscribe(
            (response: Response) => {
                expect(response).toBeDefined();
                expect(response).toEqual(mockWeeklyPatientList.result);
            }
        );

        const req = http.expectOne(mockUrl +
            'surge-report-patient-list?indicators=visits_today&year_week=201905&locationUuids=08feae7c-1352-11df-a1f1-0026b9348838');

        expect(req.request.method).toBe('GET');
        req.flush(mockWeeklyPatientList.result);
    });

    it('should retrieve daily surge report data when given correct paramters', () => {
        service.getSurgeDailyReport(mockDayParams).subscribe(
            (response: Response) => {
                expect(response).toBeDefined();
            }
         );

         const req = http.expectOne(mockUrl + 'surge-daily-report?_date=2019-01-02&locationUuids=08feae7c-1352-11df-a1f1-0026b9348838');
         expect(req.request.method).toBe('GET');
         req.flush(mockReply.results);
    });

    it('should retrive surge daily report patient list', () => {
        const mockDailyPatientListParams = {
            indicators: 'visit_type',
            _date: '2019-01-02',
            locationUuids: '08feae7c-1352-11df-a1f1-0026b9348838'
        };

        service.getSurgeDailyReportPatientList(mockDailyPatientListParams).
            subscribe(
                (response: Response) => {
                    expect(response).toBeDefined();
                    expect(response).toEqual(mockReply.results);
                }
            );
        const req = http.expectOne(mockUrl + 'surge-daily-report-patient-list?indicators=visit_type' +
        '&_date=2019-01-02&locationUuids=08feae7c-1352-11df-a1f1-0026b9348838');

        expect(req.request.method).toBe('GET');

        req.flush(mockReply.results);
    });
});
