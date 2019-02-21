import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { PatientCareStatusResourceService } from './patient-care-status-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

class MockAppSettingsService {
    constructor() { }
    getEtlServer(): string {
        return 'https://etl.ampath.or.ke/etl';
    }

}

describe('PatientCareStatusResource', () => {
    let service, httpMock;
    const results = {
        startIndex: 0,
        size: 1,
        result: [
            {
                'month': 'date1',
                'monthly_patient_care_status': 'active'
            }]
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PatientCareStatusResourceService,
                {
                    provide: AppSettingsService,
                    useClass: MockAppSettingsService
                },
            ]
        });
        service = TestBed.get(PatientCareStatusResourceService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should enter the assertion',
        inject([PatientCareStatusResourceService], (s: PatientCareStatusResourceService) => {
            expect(s).toBeTruthy();
        })
    );

    it('should return a list with patient care status when getMonthlyPatientCareStatus is called',
        () => {
            expect(service.getMonthlyPatientCareStatus({
                patient_uuid: 'patient_uuid', startDate: 'date1',
                endDate: 'date2'
            })).toBeTruthy();
            service.getMonthlyPatientCareStatus({
                patient_uuid: 'patient_uuid', startDate: 'date1',
                endDate: 'date2'
            }).subscribe((response) => {
                expect(response.result).toBeTruthy();
                expect(response.result[0].monthly_patient_care_status).toBe('active');
            });
            const req = httpMock.expectOne('https://etl.ampath.or.ke/etl'
                + '/patient/patient_uuid/monthly-care-status?'
                + 'startDate=date1&endDate=date2');
            expect(req.request.method).toBe('GET');
            expect(req.request.urlWithParams)
                .toContain('endDate=date2');
            req.flush(results);
        });

    it('should return patient care status on a given date when getDailyPatientCareStatus is called',
        () => {
            const result = {
                'startIndex': 0,
                'size': 1,
                'result': [
                    {
                        'patient_daily_care_status': 'ltfu'
                    }]
            };
            expect(service.getDailyPatientCareStatus({
                patient_uuid: 'patient_uuid', referenceDate: 'date1'
            })).toBeTruthy();
            service.getDailyPatientCareStatus({
                patient_uuid: 'patient_uuid', referenceDate: 'date1'
            }
            ).subscribe((response) => {
                expect(response.result).toBeTruthy();
                expect(response.result[0].patient_daily_care_status).toBe('ltfu');
            });
            const req = httpMock.expectOne('https://etl.ampath.or.ke/etl'
                + '/patient/patient_uuid/daily-care-status?'
                + 'referenceDate=date1');
            expect(req.request.method).toBe('GET');
            expect(req.request.urlWithParams)
                .toContain('referenceDate=date1');
            req.flush(result);
        });
});
