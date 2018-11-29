import { TestBed } from '@angular/core/testing';

import { CohortResourceService } from './cohort-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service : CohortResourceService Unit Tests', () => {

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

    afterAll(() => {
        TestBed.resetTestingModule();
        httpMock.verify();
    });

    let mockAllCohortsResponse = {
        'uuid': 'uuid',
        'display': 'adult',
        'links': [
            {
                'rel': 'self',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort/uuid'
            }
        ]
    };

    let uuid = 'uuid';
    let parentUuid = 'parentUuid';

    let mockCohortResponse = {
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

    let addCohortPayload = {
        'name': 'Test Defaulter List',
        'description': 'Test Defaulter List',
        'memberIds': [1234, 1234]
    };

    let addCohortResponse = {
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



    let editCohortPayload = {
        'name': 'Test Defaulter List',
        'description': 'Test Defaulter List'
    };

    let editCohortResponse = {
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

    let retireCohortResponse = {
    };

    it('should construct Cohort Service', () => {
        expect(cohortResorceService).toBeDefined();
    });

    it('should have getOpenMrsBaseUrl() defined', () => {
        expect(cohortResorceService.getOpenMrsBaseUrl()).toBeTruthy();
    })

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
            let response = cohortResorceService.getCohort(null, null);

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

            let response = cohortResorceService.addCohort(null);

            expect(response).toBeNull();
        });

        it('should hit right endpoint for add Cohort and get right response', () => {

            cohortResorceService.addCohort(addCohortPayload).subscribe(res => {
                expect(res).toBe(addCohortResponse);
            });

            const postReq = httpMock.expectOne(cohortResorceService.baseOpenMrsUrl + 'cohort')
            expect(postReq.request.url).toContain('ws/rest/v1/cohort');
            expect(postReq.request.method).toBe('POST');
            postReq.flush(addCohortResponse);
        });

    });

    describe('Edit Cohort', () => {

        it('Should return null in edit cohort with no parameter', () => {
            httpMock.expectNone({});

            let response = cohortResorceService.addCohort(null);

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

            let response = cohortResorceService.addCohort(null);

            expect(response).toBeNull();
        });

        it('should hit right endpoint for drop Cohort and get right response', () => {

            cohortResorceService.retireCohort(uuid).subscribe(res => {
                expect(res).toBe(retireCohortResponse);
            });

            const deleteRequest = httpMock.expectOne(cohortResorceService.baseOpenMrsUrl + 'cohort/' + uuid + '?!purge');
            expect(deleteRequest.request.url).toContain('ws/rest/v1/cohort/' + uuid + '?!purge');
            expect(deleteRequest.request.method).toBe('DELETE');
            deleteRequest.flush(retireCohortResponse);
        });

    });

});
