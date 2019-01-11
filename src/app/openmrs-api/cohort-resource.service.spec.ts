import { TestBed } from '@angular/core/testing';

import { CohortResourceService } from './cohort-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

xdescribe('Service : CohortResourceService Unit Tests', () => {

    let cohortResorceService: CohortResourceService;
    let httpMock: HttpTestingController;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CohortResourceService,
                AppSettingsService,
                LocalStorageService
            ]

        });

        cohortResorceService = TestBed.get(CohortResourceService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
        httpMock.verify();
    });

    const mockAllCohortsResponse = {
        'uuid': 'uuid',
        'display': 'adult',
        'links': [
            {
                'rel': 'self',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort/uuid'
            }
        ]
    };

    const uuid = 'uuid';
    const parentUuid = 'parentUuid';

    const mockCohortResponse = {
        'uuid': 'uuid',
        'name': 'Test Defaulter List',
        'description': 'Test Defaulter List',
        'voided': false,
        'memberids': {
            'int': [
                '123456',
                '123456'
            ]
        },
        'links': {
            'link': [
                {
                    'rel': 'self',
                    'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort/uuid'
                },
                {
                    'rel': 'full',
                    'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort/uuid'
                }
            ]
        },
        'resourceversion': '1.8'
    };

    const addCohortPayload = {
        'name': 'Test Defaulter List',
        'description': 'Test Defaulter List',
        'memberIds': [1234, 1234]
    };

    const addCohortResponse = {
        'uuid': 'cd29a1fa-896e-4ef5-b97f-e13c1490aa07',
        'display': 'Test Defaulter List',
        'name': 'Test Defaulter List',
        'description': 'Test Defaulter List',
        'voided': false,
        'memberIds': [1234],
        'links': [
            {
                'rel': 'self',
                'uri': 'https://testurl'
            },
            {
                'rel': 'full',
                'uri': 'https://test'
            }
        ],
        'resourceVersion': '1.8'
    };



    const editCohortPayload = {
        'name': 'Test Defaulter List',
        'description': 'Test Defaulter List'
    };

    const editCohortResponse = {
        'uuid': 'cd29a1fa-896e-4ef5-b97f-e13c1490aa07',
        'display': 'Test Defaulter List',
        'name': 'Test Defaulter List',
        'description': 'Test Defaulter List',
        'voided': false,
        'memberIds': [1234],
        'links': [
            {
                'rel': 'self',
                'uri': 'https://testurl'
            },
            {
                'rel': 'full',
                'uri': 'https://test'
            }
        ],
        'resourceVersion': '1.8'
    };

    const retireCohortResponse = {
    };

    it('should construct Cohort Service', () => {
        expect(cohortResorceService).toBeDefined();
    });

    it('should have getOpenMrsBaseUrl() defined', () => {
        expect(cohortResorceService.getOpenMrsBaseUrl()).toBeTruthy();
    });

    describe('Get All Cohorts', () => {

        it('should hit right endpoint for getallCohorts and get right response', () => {

            cohortResorceService.getAllCohorts().subscribe(res => {
                expect(res).toEqual(mockAllCohortsResponse);
            });

        });

    });

    describe('Get Cohort', () => {

        it('Should return null in get cohort with no parameter', () => {

            httpMock.expectNone({});
            const response = cohortResorceService.getCohort(null, null);

            expect(response).toBeNull();

        });

        it('should hit right endpoint for getCohort and get right response without v', () => {

            cohortResorceService.getCohort(uuid).subscribe(res => {
                expect(res).toBe(mockCohortResponse);
            });

            const req = httpMock.expectOne(cohortResorceService.baseOpenMrsUrl + 'cohort/' + uuid);
            expect(req.request.url).toContain('ws/rest/v1/cohort/' + uuid);
            expect(req.request.method).toBe('GET');
            req.flush(mockCohortResponse);

        });

        it('should hit right endpoint for getCohort and get right response with v', () => {

            cohortResorceService.getCohort(uuid, 'v').subscribe(res => {
                expect(res).toBe(mockCohortResponse);
            });

            const req = httpMock.expectOne(cohortResorceService.baseOpenMrsUrl + 'cohort/' + uuid + '?v=v');
            expect(req.request.url).toContain('ws/rest/v1/cohort/' + uuid);
            expect(req.request.urlWithParams).toContain('?v=v');
            expect(req.request.method).toBe('GET');
            req.flush(mockCohortResponse);

        });

    });


    describe('Add Cohort', () => {

        it('Should return null in add cohort with no parameter', () => {

            httpMock.expectNone({});

            const response = cohortResorceService.addCohort(null);

            expect(response).toBeNull();
        });

        it('should hit right endpoint for add Cohort and get right response', () => {

            cohortResorceService.addCohort(addCohortPayload).subscribe(res => {
                expect(res).toBe(addCohortResponse);
            });

            const postReq = httpMock.expectOne(cohortResorceService.baseOpenMrsUrl + 'cohort');
            expect(postReq.request.url).toContain('ws/rest/v1/cohort');
            expect(postReq.request.method).toBe('POST');
            postReq.flush(addCohortResponse);
        });

    });

    describe('Edit Cohort', () => {

        it('Should return null in edit cohort with no parameter', () => {
            httpMock.expectNone({});

            const response = cohortResorceService.addCohort(null);

            expect(response).toBeNull();
        });

        it('should hit right endpoint for edit Cohort and get right response', () => {

            cohortResorceService.editCohort(uuid, editCohortPayload).subscribe(res => {
                expect(res).toBe(editCohortResponse);
            });

            const editRequest = httpMock.expectOne(cohortResorceService.baseOpenMrsUrl + 'cohort/' + uuid);
            expect(editRequest.request.url).toContain('ws/rest/v1/cohort');
            expect(editRequest.request.method).toBe('POST');
            editRequest.flush(editCohortResponse);
        });

    });

    describe('Retire Cohort', () => {

        it('Should return null in retire cohort with no parameter', () => {
            httpMock.expectNone({});

            const response = cohortResorceService.addCohort(null);

            expect(response).toBeNull();
        });

        it('should hit right endpoint for drop Cohort and get right response', () => {

            cohortResorceService.retireCohort(uuid).subscribe(res => {
                expect(res).toBe(retireCohortResponse);
            });

            const deconsteRequest = httpMock.expectOne(cohortResorceService.baseOpenMrsUrl + 'cohort/' + uuid + '?!purge');
            expect(deconsteRequest.request.url).toContain('ws/rest/v1/cohort/' + uuid + '?!purge');
            expect(deconsteRequest.request.method).toBe('DELETE');
            deconsteRequest.flush(retireCohortResponse);
        });

    });

});
