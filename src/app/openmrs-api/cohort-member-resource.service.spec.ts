import { async, inject , TestBed } from '@angular/core/testing';
import {  BaseRequestOptions, Http, HttpModule, Response,
    ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { CohortMemberResourceService } from './cohort-member-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings';

describe('Service : CohortMemberResourceService Unit Tests', () => {

     beforeEach(() => {

        TestBed.configureTestingModule({

            providers: [
                CohortMemberResourceService,
                MockBackend,
                BaseRequestOptions,
                    {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                AppSettingsService,
                LocalStorageService
                ]

           });


      });

    let mockAllCohortsMemberResponse = {
                'uuid': 'uuid',
                'display': 'adult',
                'links': [
                    {
                        'rel': 'self',
                        'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/cohort/uuid'
                    }
                ]
            };
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
       'description' : 'Test Defaulter List'
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

  let parentUuid: string = '9fca294a-548f-4568-b4ed-80ba0bee8c9f';

  let uuid: string  = '5b811f70-1359-11df-a1f1-0026b9348838';

  let getallCohortMembersResponse = {
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

let cohortMemberResponse = {
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

let addCohortMemberPayload = {
   'patient': '5b811f70-1359-11df-a1f1-0026b9348838'
};

let addCohortMemberResponse = {
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

let editCohortMemberPayload = {
   'patient': '5b811f70-1359-11df-a1f1-0026b9348838'
};

let retireCohortMemberResponse = {

};




    it('should construct Cohort Member Service', async(inject(
                 [CohortMemberResourceService, MockBackend], (service, mockBackend) => {
                 expect(service).toBeDefined();
      })));

    it('Should return null in get cohort Member with no parameter', async(inject(
            [CohortMemberResourceService, MockBackend], (service, mockBackend) => {

                let response = service. getAllCohortMembers(null);

                expect(response).toBeNull();

    })));

describe('Get All Cohort Members', () => {

    it('should hit right endpoint for getallCohortMembers and get right response', async(inject(

           [CohortMemberResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('/ws/rest/v1/cohort/' +
                     parentUuid + '/member');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                });

                 service.getAllCohortMembers(parentUuid).subscribe(res => {
                         expect(res).toEqual(getallCohortMembersResponse);
                });

    })));

});

describe('Get Cohort Member', () => {

    it('should hit right endpoint for getCohortMember and get right response', async(inject(

           [CohortMemberResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('/ws/rest/v1/cohort/' +
                     parentUuid + '/member');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: cohortMemberResponse })
                    ));
                });


                 service.getCohortMember(parentUuid, uuid).subscribe(res => {
                         expect(res).toEqual(cohortMemberResponse);
                });

    })));

});

describe('Add Cohort Member', () => {

    it('should hit right endpoint for add Cohort and get right response', async(inject(
           [CohortMemberResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('cohort/' + parentUuid + '/member');
                    expect(conn.request.method).toBe(RequestMethod.Post);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: addCohortMemberResponse  })
                    ));
                });

                service.addCohortMember(parentUuid, addCohortMemberPayload).subscribe(res => {
                    expect(res).toBe(addCohortMemberResponse );
                });

    })));


});


describe('Retire Cohort Member', () => {

    it('should hit right endpoint for Retire Cohort Member and get right response', async(inject(
           [CohortMemberResourceService, MockBackend], (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url).toContain('cohort/' + parentUuid + '/member/' +
                     uuid + '?!purge');
                    expect(conn.request.method).toBe(RequestMethod.Delete);
                    conn.mockRespond(new Response(
                        new ResponseOptions({ body: retireCohortMemberResponse  })
                    ));
                });

                service.retireCohortMember(parentUuid , uuid).subscribe(res => {
                    expect(res).toBe(retireCohortMemberResponse );
                });

    })));


});

});
