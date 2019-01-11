import { async, inject, TestBed } from '@angular/core/testing';
import * as _ from 'underscore';

import { CohortMemberResourceService } from './cohort-member-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

xdescribe('Service : CohortMemberResourceService Unit Tests', () => {
    let cohortMemberService: CohortMemberResourceService;
    let httpMock: HttpTestingController;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CohortMemberResourceService,
                AppSettingsService,
                LocalStorageService
            ]

        });

        cohortMemberService = TestBed.get(CohortMemberResourceService);
        httpMock = TestBed.get(HttpTestingController);

    });

    afterEach(() => {
        httpMock.verify();
    });

    const mockAllCohortsMemberResponse = {
        'uuid': 'uuid',
        'display': 'adult',
        'links': [
            {
                'rel': 'self',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort/uuid'
            }
        ]
    };
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

    const parentUuid = '9fca294a-548f-4568-b4ed-80ba0bee8c9f';

    const uuid = '5b811f70-1359-11df-a1f1-0026b9348838';

    const getallCohortMembersResponse = {
        'display': '',
        'patient': {
            'uuid': '5b811f70-1359-11df-a1f1-0026b9348838',
            'display': '',
            'identifiers': [],
            'person': {
                'uuid': '5b811f70-1359-11df-a1f1-0026b9348838',
                'display': 'BULIALIA BULIALIA BULIALIA',
                'gender': 'M',
                'age': 46,
                'birthdate': '1970-11-24T00:00:00.000+0300',
                'birthdateEstimated': false,
                'dead': false,
                'deathDate': null,
                'causeOfDeath': null,
                'preferredName': {
                    'uuid': '72cb0dd0-1359-11df-a1f1-0026b9348838',
                    'display': 'BULIALIA BULIALIA BULIALIA',
                    'links': [
                        {
                            'rel': 'self',
                            'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                        }
                    ]
                },
                'preferredAddress': {
                    'uuid': '5f4899ee-1359-11df-a1f1-0026b9348838',
                    'display': null,
                    'links': [
                        {
                            'rel': 'self',
                            'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                        }
                    ]
                },
                'attributes': [
                    {
                        'uuid': '657eedf4-1359-11df-a1f1-0026b9348838',
                        'display': 'Health Center = 12',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                            }
                        ]
                    },
                    {
                        'uuid': '092c366e-13aa-11df-a1f1-0026b9348838',
                        'display': 'Tribe = 99',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                            }
                        ]
                    },
                    {
                        'uuid': '14989ec4-bd56-4264-85c7-e5f0701fb591',
                        'display': 'Tribe = 99',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                            }
                        ]
                    }
                ],
                'voided': false,
                'deathdateEstimated': false,
                'birthtime': null,
                'links': [
                    {
                        'rel': 'self',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                    },
                    {
                        'rel': 'full',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                    }
                ],
                'resourceVersion': '1.11'
            },
            'voided': false,
            'links': [
                {
                    'rel': 'self',
                    'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient'
                },
                {
                    'rel': 'full',
                    'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient'
                }
            ],
            'resourceVersion': '1.8'
        },
        'links': [
            {
                'rel': 'self',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort'
            },
            {
                'rel': 'full',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort'
            }
        ],
        'resourceVersion': '1.8'
    };

    const cohortMemberResponse = {
        'display': '',
        'patient': {
            'uuid': '5b811f70-1359-11df-a1f1-0026b9348838',
            'display': '',
            'identifiers': [],
            'person': {
                'uuid': '5b811f70-1359-11df-a1f1-0026b9348838',
                'display': 'BULIALIA BULIALIA BULIALIA',
                'gender': 'M',
                'age': 46,
                'birthdate': '1970-11-24T00:00:00.000+0300',
                'birthdateEstimated': false,
                'dead': false,
                'deathDate': null,
                'causeOfDeath': null,
                'preferredName': {
                    'uuid': '72cb0dd0-1359-11df-a1f1-0026b9348838',
                    'display': 'BULIALIA BULIALIA BULIALIA',
                    'links': [
                        {
                            'rel': 'self',
                            'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                        }
                    ]
                },
                'preferredAddress': {
                    'uuid': '5f4899ee-1359-11df-a1f1-0026b9348838',
                    'display': null,
                    'links': [
                        {
                            'rel': 'self',
                            'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                        }
                    ]
                },
                'attributes': [
                    {
                        'uuid': '657eedf4-1359-11df-a1f1-0026b9348838',
                        'display': 'Health Center = 12',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                            }
                        ]
                    },
                    {
                        'uuid': '092c366e-13aa-11df-a1f1-0026b9348838',
                        'display': 'Tribe = 99',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                            }
                        ]
                    },
                    {
                        'uuid': '14989ec4-bd56-4264-85c7-e5f0701fb591',
                        'display': 'Tribe = 99',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                            }
                        ]
                    }
                ],
                'voided': false,
                'deathdateEstimated': false,
                'birthtime': null,
                'links': [
                    {
                        'rel': 'self',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                    },
                    {
                        'rel': 'full',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person/'
                    }
                ],
                'resourceVersion': '1.11'
            },
            'voided': false,
            'links': [
                {
                    'rel': 'self',
                    'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient'
                },
                {
                    'rel': 'full',
                    'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient'
                }
            ],
            'resourceVersion': '1.8'
        },
        'links': [
            {
                'rel': 'self',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort'
            },
            {
                'rel': 'full',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort'
            }
        ],
        'resourceVersion': '1.8'
    };

    const addCohortMemberPayload = {
        'patient': '5b811f70-1359-11df-a1f1-0026b9348838'
    };

    const addCohortMemberResponse = {
        'display': '',
        'patient': {
            'uuid': '5b811f70-1359-11df-a1f1-0026b9348838',
            'display': '',
            'identifiers': [],
            'person': {
                'uuid': '5b811f70-1359-11df-a1f1-0026b9348838',
                'display': 'BULIALIA BULIALIA BULIALIA',
                'gender': 'M',
                'age': 46,
                'birthdate': '1970-11-24T00:00:00.000+0300',
                'birthdateEstimated': false,
                'dead': false,
                'deathDate': null,
                'causeOfDeath': null,
                'preferredName': {
                    'uuid': '72cb0dd0-1359-11df-a1f1-0026b9348838',
                    'display': 'BULIALIA BULIALIA BULIALIA',
                    'links': [
                        {
                            'rel': 'self',
                            'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                        }
                    ]
                },
                'preferredAddress': {
                    'uuid': '5f4899ee-1359-11df-a1f1-0026b9348838',
                    'display': null,
                    'links': [
                        {
                            'rel': 'self',
                            'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                        }
                    ]
                },
                'attributes': [
                    {
                        'uuid': '657eedf4-1359-11df-a1f1-0026b9348838',
                        'display': 'Health Center = 12',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                            }
                        ]
                    },
                    {
                        'uuid': '092c366e-13aa-11df-a1f1-0026b9348838',
                        'display': 'Tribe = 99',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                            }
                        ]
                    },
                    {
                        'uuid': '14989ec4-bd56-4264-85c7-e5f0701fb591',
                        'display': 'Tribe = 99',
                        'links': [
                            {
                                'rel': 'self',
                                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                            }
                        ]
                    }
                ],
                'voided': false,
                'deathdateEstimated': false,
                'birthtime': null,
                'links': [
                    {
                        'rel': 'self',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                    },
                    {
                        'rel': 'full',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/person'
                    }
                ],
                'resourceVersion': '1.11'
            },
            'voided': false,
            'links': [
                {
                    'rel': 'self',
                    'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient'
                },
                {
                    'rel': 'full',
                    'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient'
                }
            ],
            'resourceVersion': '1.8'
        },
        'links': [
            {
                'rel': 'self',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort'
            },
            {
                'rel': 'full',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort'
            }
        ],
        'resourceVersion': '1.8'
    };

    const editCohortMemberPayload = {
        'patient': '5b811f70-1359-11df-a1f1-0026b9348838'
    };

    const retireCohortMemberResponse = {

    };

    it('should construct Cohort Member Service', () => {

        expect(cohortMemberService).toBeDefined();

    });

    describe('Get All Cohort Members', () => {

        it('Should return null in get cohort Member with no parameter', () => {

            httpMock.expectNone({});

            const response = cohortMemberService.getAllCohortMembers(null);

            expect(response).toBeNull();

        });

        it('should hit right endpoint for getallCohortMembers and get right response', async(() => {
            cohortMemberService.getAllCohortMembers(parentUuid).subscribe();

            const request = httpMock.expectOne(req => req.method === 'GET' &&
                req.url === cohortMemberService.baseOpenMrsUrl + 'cohort/' + parentUuid + '/member');
            expect(request.request.url).
            toEqual('http://example.url.com/ws/rest/v1/cohort/9fca294a-548f-4568-b4ed-80ba0bee8c9f/member');
            expect(request.request.method).toBe('GET');
            expect(request.request.url).toContain('/ws/rest/v1/cohort/' +
                parentUuid + '/member');
            request.flush(getallCohortMembersResponse);

        }));

    });

    describe('Get Cohort Member', () => {

        it('Should return null in get cohort Member with no parameter', () => {

            httpMock.expectNone({});

            const response = cohortMemberService.getCohortMember(null, null);

            expect(response).toBeNull();

        });

        it('should hit right endpoint for getCohortMember and get right response', () => {

            cohortMemberService.getCohortMember(parentUuid, uuid).subscribe(res => {
                expect(res).toEqual(cohortMemberResponse);
            });

            const request = httpMock.expectOne(req => req.method === 'GET' &&
                req.url === cohortMemberService.baseOpenMrsUrl + 'cohort/' + parentUuid + '/member/' + uuid);
            expect(request.request.method).toBe('GET');
            expect(request.request.url).toContain('/ws/rest/v1/cohort/' +
                parentUuid + '/member');
            request.flush(cohortMemberResponse);

        });

    });

    describe('Add Cohort Member', () => {

        it('Should return null in add cohort Member with no parameter', () => {

            httpMock.expectNone({});

            const response = cohortMemberService.addCohortMember(null, null);

            expect(response).toBeNull();

        });

        it('should hit right endpoint for add Cohort and get right response', () => {

            cohortMemberService.addCohortMember(parentUuid, addCohortMemberPayload).subscribe(res => {
                expect(res).toBe(addCohortMemberResponse);
            });

            const postRequest = httpMock.expectOne(cohortMemberService.baseOpenMrsUrl + 'cohort/' + parentUuid + '/member');
            expect(postRequest.request.url).toContain('cohort/' + parentUuid + '/member');
            expect(postRequest.request.method).toBe('POST');
            postRequest.flush(addCohortMemberResponse);

        });

    });


    describe('Retire Cohort Member', () => {

        it('Should return null in retire cohort Member with no parameter', () => {
            httpMock.expectNone({});

            const response = cohortMemberService.retireCohortMember(null, null);

            expect(response).toBeNull();

        });

        it('should hit right endpoint for Retire Cohort Member and get right response', () => {

            cohortMemberService.retireCohortMember(parentUuid, uuid).subscribe(res => {
                expect(res).toBe(retireCohortMemberResponse);
            });

            const request = httpMock.expectOne(cohortMemberService.baseOpenMrsUrl + 'cohort/' + parentUuid + '/member/' + uuid + '?!purge');
            expect(request.request.url).toContain('cohort/' + parentUuid + '/member/' +
                uuid + '?!purge');
            expect(request.request.method).toBe('DELETE');
            request.flush(retireCohortMemberResponse);
        });

    });

});
