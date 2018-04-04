/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';

import { TodayVisitService, VisitsEvent } from './today-visit.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { NgamrsSharedModule } from '../../../shared/ngamrs-shared.module';
import { UserDefaultPropertiesModule }
  from '../../../user-default-properties/user-default-properties.module';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';

describe('Service: TodayVisit', () => {
  let progConfig = {
    uuid: 'some-uuid',
    visitTypes: [
      {
        uuid: 'visit-one',
        encounterTypes: []
      },
      {
        uuid: 'some-visit-type-uuid',
        encounterTypes: []
      },
      {
        uuid: 'visit-two',
        encounterTypes: []
      }
    ]
  };

  let prog = {
    'some-uuid': progConfig
  };

  let visitsSample = [
    { // 0
      uuid: 'some-visit-uuid-1',
      encounters: [],
      location: { uuid: 'some-location-uuid' },
      patient: { uuid: 'some-patient -uuid' },
      startDatetime: moment().subtract(1, 'minute'),
      stopDatetime: moment().subtract(10, 'minute'),
      visitType: { uuid: 'some-visit-type-uuid' }
    },
    { // 1
      uuid: 'some-visit-uuid',
      encounters: [],
      location: { uuid: 'some-location-uuid' },
      patient: { uuid: 'some-patient -uuid' },
      startDatetime: moment(),
      stopDatetime: null,
      visitType: { uuid: 'some-visit-type-uuid' }
    },
    { // 2
      uuid: 'some-visit-uuid-1',
      encounters: [],
      location: { uuid: 'some-location-uuid' },
      patient: { uuid: 'some-patient -uuid' },
      startDatetime: moment(),
      stopDatetime: null,
      visitType: { uuid: 'some-visit-type-uuid-3' }
    },
    { // 3
      uuid: 'some-visit-uuid-1',
      encounters: [],
      location: { uuid: 'some-location-uuid' },
      patient: { uuid: 'some-patient -uuid' },
      startDatetime: moment().subtract(1, 'minute'),
      stopDatetime: moment().subtract(10, 'minute'),
      visitType: { uuid: 'some-visit-type-uuid-4' }
    },
    { // 4
      uuid: 'some-visit-uuid-2',
      encounters: [],
      location: { uuid: 'some-location-uuid' },
      patient: { uuid: 'some-patient -uuid' },
      startDatetime: '2017-08-14T11:00:00.000+0300',
      stopDatetime: null,
      visitType: { uuid: 'some-visit-type-uuid-1' }
    },
    { // 5
      uuid: 'some-visit-uuid-3',
      encounters: [],
      location: { uuid: 'some-location-uuid' },
      patient: { uuid: 'some-patient -uuid' },
      startDatetime: '2017-08-14T07:53:00.000+0300',
      stopDatetime: '2017-08-14T08:53:00.000+0300',
      visitType: { uuid: 'some-visit-type-uuid-2' }
    },
    { // 6
      uuid: 'some-visit-uuid-3',
      encounters: [],
      location: { uuid: 'some-location-uuid' },
      patient: { uuid: 'some-patient -uuid' },
      startDatetime: '2017-08-14T07:53:00.000+0300',
      stopDatetime: '2017-08-14T08:53:00.000+0300',
      visitType: { uuid: 'some-visit-type-uuid' }
    }
  ];

  let fakePatientProgramResourceService = {
    getAllProgramVisitConfigs: () => {
      return Observable.of(prog).delay(100);
    },
    getPatientProgramVisitTypes: (
      patient: string, program: string,
      enrollment: string, location: string) => {
      return Observable.of(progConfig);
    }
  };

  let fakeVisitResourceService = {
    getVisitTypes: (args) => {
      return Observable.of([{
        'uuid': '4c84516f-279e-4994-b111-84d4d35a2d97',
        'name': 'Youth HIV Return Visit '
      },
      {
        'uuid': 'a21e0f58-adb0-4a88-8877-b1a8af9c5cab',
        'name': 'Resistance Clinic Visit '
      }]);
    },
    getPatientVisits: (args): Observable<any> => {
      let obs: Observable<any> = Observable.of(visitsSample);
      console.log('fake visit resource in use');
      return obs.delay(50);
    },
    saveVisit: (payload) => {
      let response = {
        uuid: 'visituuid',
        voided: false,
        stopDatetime: null,
        visitType: {
          uuid: payload.visitType
        },
        startDatetime: new Date()
      };
      return Observable.of(response);
    },
    updateVisit: (uuid, payload) => {
      let response = {
        uuid: uuid,
        voided: false,
        stopDatetime: new Date(),
        visitType: {
          uuid: payload.visitType
        },
        startDatetime: new Date()
      };
      if (payload.voided) {
        response.voided = true;
      }

      return Observable.of(response);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodayVisitService,
        PatientService,
        PatientProgramService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ProgramService,
        {
          provide: PatientProgramResourceService,
          useValue: fakePatientProgramResourceService
        },
        {
          provide: VisitResourceService,
          useValue: fakeVisitResourceService
        }
      ],
      imports: [
        HttpModule,
        NgamrsSharedModule,
        UserDefaultPropertiesModule,
      ]
    });
  });

  it('should be injected', inject([TodayVisitService], (service: TodayVisitService) => {
    expect(service).toBeTruthy();
  }));

  it('should fetch all programs configs', (done) => {
    let progService: PatientProgramResourceService =
      TestBed.get(PatientProgramResourceService);

    let service: TodayVisitService = TestBed.get(TodayVisitService);

    let progVisitTypeSpy =
      spyOn(progService, 'getAllProgramVisitConfigs')
        .and.callThrough();
    service.fetchAllProgramVisitConfigs();

    setTimeout(() => {
      expect(progVisitTypeSpy.calls.count()).toBe(1);
      expect(service.allProgramVisitConfigs).toEqual(prog);
      done();
    }, 100);
  });

  it('should fetch all visits for a patient', () => {
    let service: TodayVisitService = TestBed.get(TodayVisitService);

    service.patient = {
      uuid: 'uuid',
      person: { uuid: 'uuid' }
    };

    let visitResService: VisitResourceService =
      TestBed.get(VisitResourceService);
    let patientVisitsSpy =
      spyOn(visitResService, 'getPatientVisits')
        .and.callFake((params) => {
          return Observable.of(visitsSample);
        });

    service.hasFetchedVisits = false;
    service.allPatientVisits = [];
    service.getPatientVisits();

    expect(patientVisitsSpy.calls.count()).toBe(1);
    expect(patientVisitsSpy.calls.mostRecent().args[0])
      .toEqual({ patientUuid: 'uuid' });
    expect(service.hasFetchedVisits).toBe(true);
    expect(service.allPatientVisits).toBe(visitsSample);
  });

  it('should filter visits by visit types', () => {
    let types = ['some-visit-type-uuid-3', 'some-visit-type-uuid-1'];
    let expected = [visitsSample[2], visitsSample[4]];

    let service: TodayVisitService = TestBed.get(TodayVisitService);

    let actual = service.filterVisitsByVisitTypes(visitsSample, types);

    expect(actual).toEqual(expected);
  });

  it('should sort visits by startDatetime', () => {
    let sample = [visitsSample[0], visitsSample[4], visitsSample[1]];
    let expected = [visitsSample[1], visitsSample[0], visitsSample[4]];
    let service: TodayVisitService = TestBed.get(TodayVisitService);

    let actual = service.sortVisitsByVisitStartDateTime(sample);
    expect(actual).toEqual(expected);
  });

  it('should subscribe to patient load events from patient service',
    (done) => {
      let patientService: PatientService =
        TestBed.get(PatientService);
      let service: TodayVisitService = TestBed.get(TodayVisitService);
      service.patient = null;
      service.needsVisitReload = false;

      let programStaleNoticeSpy = spyOn(service, 'makeVisitsStale').and.callThrough();

      let nextPatient = new Patient({ uuid: 'patient-uuid', person: {} });
      patientService.currentlyLoadedPatient.next(nextPatient);

      expect(service.patient).toBe(nextPatient);
      expect(service.needsVisitReload).toBe(true);
      expect(programStaleNoticeSpy.calls.count()).toBe(1);
      done();
    });

  it('should extract a program config from all program configs', () => {
    let service: TodayVisitService = TestBed.get(TodayVisitService);
    service.allProgramVisitConfigs = prog;
    let filteredProgConfig = service.getProgramConfigurationObject('some-uuid');
    expect(filteredProgConfig).toBe(progConfig);
  });

  it('should filter programs patient enrolled in', () => {
    let service: TodayVisitService = TestBed.get(TodayVisitService);
    let programs = [
      {
        enrolledProgram: {
          uuid: 'uuid'
        },
        uuid: 'some-uuid',
        dateEnrolled: '2017-01-01'
      },
      {
        enrolledProgram: null,
        uuid: 'some-uuid',
        dateEnrolled: null
      }
    ];

    let filtered = service.filterUnenrolledPrograms(programs);
    expect(filtered).toEqual([programs[0]]);
  });

  it('should build programs object', () => {
    let service: TodayVisitService = TestBed.get(TodayVisitService);

    let programs = [
      {
        enrolledProgram: {
          uuid: 'uuid'
        },
        program: {
          uuid: 'some-uuid'
        },
        dateEnrolled: '2017-01-01'
      },
      {
        enrolledProgram: {
          uuid: 'uuid2'
        },
        program: {
          uuid: 'some-uuid-1'
        },
        dateEnrolled: '2017-01-01'
      }
    ];

    let programConfigs = {
      'some-uuid': {
        visitTypes: []
      },
      'some-uuid-1': {
        visitTypes: []
      }
    };

    service.allProgramVisitConfigs = programConfigs;

    let expected = {
      'some-uuid': {
        enrollment: programs[0],
        visits: [],
        currentVisit: null,
        config: programConfigs['some-uuid']
      },
      'some-uuid-1': {
        enrollment: programs[1],
        visits: [],
        currentVisit: null,
        config: programConfigs['some-uuid-1']
      }
    };

    expect(service.buildProgramsObject(programs))
      .toEqual(expected);
  });

  it('should filter out a programs visits and the current program visit ' +
    'from the list of visits', () => {
      // the current visit will be the most recent visit for that program
      // that was started today
      // the visit could have been ended or it could be an active visit

      let service: TodayVisitService = TestBed.get(TodayVisitService);
      service.allProgramVisitConfigs = prog;

      // CASE 3: Visits and Program Config Loaded
      // SUB-CASE: Today's Visit Present for Current Program
      service.hasFetchedVisits = true;
      service.allPatientVisits = visitsSample;

      let programObject = service.buildProgramsObject([{
        enrolledProgram: {
          uuid: 'uuid'
        },
        program: {
          uuid: 'some-uuid'
        },
        dateEnrolled: '2017-01-01'
      }]);
      service.filterVisitsAndCurrentVisits(programObject['some-uuid'],
        service.allPatientVisits);
      expect(programObject['some-uuid'].currentVisit).toBe(visitsSample[1]);

      // SUB-CASE: Today's Visit Absent for Current Program
      service.hasFetchedVisits = true;
      service.allPatientVisits = [
        visitsSample[2],
        visitsSample[3],
        visitsSample[4],
        visitsSample[5],
        visitsSample[6]
      ];

      programObject = service.buildProgramsObject([{
        enrolledProgram: {
          uuid: 'uuid'
        },
        program: {
          uuid: 'some-uuid'
        },
        dateEnrolled: '2017-01-01'
      }]);
      service.filterVisitsAndCurrentVisits(programObject['some-uuid'],
        service.allPatientVisits);
      expect(programObject['some-uuid'].currentVisit).toBeNull();

      // SUB-CASE: No Visit Present
      service.hasFetchedVisits = true;
      service.allPatientVisits = [];
      programObject = service.buildProgramsObject([{
        enrolledProgram: {
          uuid: 'uuid'
        },
        program: {
          uuid: 'some-uuid'
        },
        dateEnrolled: '2017-01-01'
      }]);
      service.filterVisitsAndCurrentVisits(programObject['some-uuid'],
        service.allPatientVisits);
      expect(programObject['some-uuid'].currentVisit).toBeNull();

      // SUB-CASE: No Visit Types for program
      service.hasFetchedVisits = true;
      service.allPatientVisits = visitsSample;
      let currentProgramConfig = {
        uuid: 'some-uuid',
        visitTypes: []
      };

      service.allProgramVisitConfigs = {
        'some-uuid': currentProgramConfig
      };

      programObject = service.buildProgramsObject([{
        enrolledProgram: {
          uuid: 'uuid'
        },
        program: {
          uuid: 'some-uuid'
        },
        dateEnrolled: '2017-01-01'
      }]);
      service.filterVisitsAndCurrentVisits(programObject['some-uuid'],
        service.allPatientVisits);
      expect(programObject['some-uuid'].currentVisit).toBeNull();
    });

  it('should process visits for all programs', () => {
    let service: TodayVisitService = TestBed.get(TodayVisitService);

    let programs = [
      {
        enrolledProgram: {
          uuid: 'uuid'
        },
        program: {
          uuid: 'some-uuid-1'
        },
        dateEnrolled: '2017-01-01'
      },
      {
        enrolledProgram: {
          uuid: 'uuid2'
        },
        program: {
          uuid: 'some-uuid-2'
        },
        dateEnrolled: '2017-01-01'
      }
    ];

    let programConfigs = {
      'some-uuid-1': {
        visitTypes: []
      },
      'some-uuid-2': {
        visitTypes: []
      }
    };

    service.patient = {
      uuid: 'uuid',
      person: { uuid: 'uuid' }
    };

    service.allProgramVisitConfigs = programConfigs;
    service.patient.enrolledPrograms = programs;
    service.enrolledPrograms = programs;
    service.hasFetchedVisits = true;
    service.allPatientVisits = visitsSample;

    let classProcessingSpy =
      spyOn(service, 'groupProgramVisitsByClass').and.returnValue(undefined);

    service.processVisitsForPrograms();

    expect(service.programVisits).toEqual({
      'some-uuid-1': {
        enrollment: programs[0],
        visits: [],
        currentVisit: null,
        config: {
          visitTypes: []
        }
      },
      'some-uuid-2': {
        enrollment: programs[1],
        visits: [],
        currentVisit: null,
        config: {
          visitTypes: []
        }
      }
    });
    expect(classProcessingSpy.calls.count()).toBe(1);
  });

  it('should fetch all data required to process visits per programs', (done) => {
    let service: TodayVisitService = TestBed.get(TodayVisitService);

    service.allProgramVisitConfigs = null;
    service.hasFetchedVisits = false;
    service.allPatientVisits = null;
    service.patient = {
      uuid: 'uuid',
      person: { uuid: 'uuid' }
    };

    let progConfigSpy = spyOn(service, 'fetchAllProgramVisitConfigs')
      .and.callThrough();

    let visitSpy = spyOn(service, 'getPatientVisits')
      .and.callThrough();

    service.loadDataToProcessProgramVisits()
      .subscribe((data) => {
        expect(progConfigSpy.calls.count()).toBe(1);
        expect(visitSpy.calls.count()).toBe(1);
        // done();

        // CASE 2: program config already loaded
        service.loadDataToProcessProgramVisits()
          .subscribe((data2) => {
            expect(progConfigSpy.calls.count()).toBe(1);
            expect(visitSpy.calls.count()).toBe(2);
            done();
          }, (error) => {
            expect('not expecting error with given test case').toBeFalsy();
          });

      }, (error) => {
        console.error('returned', error);
        expect('not expecting error with given test case').toBeFalsy();
      });

  });

  it('should fetch and process visits for all programs', (done) => {
    // If visit is stale, i.e needsVisitReload = true, then fetch afresh.
    // Should check if all required data is fetched before trying to fetch
    // i.e visits, enrolledPrograms, programs config
    // should send 2 events, visit loading started, visit loaded
    // should always clear errors before loading begins

    let service: TodayVisitService = TestBed.get(TodayVisitService);

    // CASE 1: Visits are stale
    service.patient = {
      uuid: 'uuid',
      person: { uuid: 'uuid' }
    };
    service.needsVisitReload = true;
    service.errors.push({ id: 'error', message: 'an error' });

    let processVisitsSpy = spyOn(service, 'processVisitsForPrograms')
      .and.callThrough();
    let loadDataSpy = spyOn(service, 'loadDataToProcessProgramVisits')
      .and.callThrough();

    let visitsEventsSpy = spyOn(service.visitsEvents, 'next')
      .and.callThrough();

    service.getProgramVisits()
      .subscribe((programVisits) => {
        expect(service.errors.length).toBe(0);
        expect(processVisitsSpy.calls.count()).toBe(1);
        expect(loadDataSpy.calls.count()).toBe(1);
        expect(service.programVisits).toBe(programVisits);
        expect(service.needsVisitReload).toBe(false);
        expect(visitsEventsSpy.calls.count()).toBe(2);
        expect(visitsEventsSpy.calls.argsFor(0)).toEqual([VisitsEvent.VisitsLoadingStarted]);
        expect(visitsEventsSpy.calls.argsFor(1)).toEqual([VisitsEvent.VisitsLoaded]);
        visitsEventsSpy.calls.reset();
        // CASE 2: Visits are upto date
        service.getProgramVisits()
          .subscribe((progs) => {
            expect(processVisitsSpy.calls.count()).toBe(1);
            expect(loadDataSpy.calls.count()).toBe(1);
            expect(service.programVisits).toBe(programVisits);
            expect(visitsEventsSpy.calls.count()).toBe(2);
            expect(visitsEventsSpy.calls.argsFor(0)).toEqual([VisitsEvent.VisitsLoadingStarted]);
            expect(visitsEventsSpy.calls.argsFor(1)).toEqual([VisitsEvent.VisitsLoaded]);
            done();
          }, (error) => {
            expect('not expecting error').toBeFalsy();
          });

      }, (error) => {
        expect('not expecting error').toBeFalsy();
      });
  });

  it('should notify consumers that visits became stale', () => {
    let service: TodayVisitService = TestBed.get(TodayVisitService);

    service.needsVisitReload = false;
    let visitsEventsSpy = spyOn(service.visitsEvents, 'next')
      .and.callThrough();

    service.makeVisitsStale();

    expect(service.needsVisitReload).toBe(true);
    expect(visitsEventsSpy.calls.count()).toBe(1);
    expect(visitsEventsSpy.calls.argsFor(0)).toEqual([VisitsEvent.VisitsBecameStale]);

  });

  it('should group program visits by class of programs', () => {

    let service: TodayVisitService = TestBed.get(TodayVisitService);

    let visitProgram = {
      'prog-1': {
        enrollment: {
          baseRoute: 'hiv',
          program: { display: 'prog one' }
        },
        currentVisit: {
          uuid: 'v1'
        },
        visits: [
          {
            uuid: 'v1'
          },
          {
            uuid: 'v2'
          }
        ]

      },
      'prog-2': {
        enrollment: {
          baseRoute: 'cdm',
          program: { display: 'prog two' }
        },
        currentVisit: null,
        visits: [
          {
            uuid: 'v5'
          }
        ]
      },
      'prog-3': {
        enrollment: {
          baseRoute: 'hiv',
          program: { display: 'prog three' }
        },
        currentVisit: {
          uuid: 'v3'
        },
        visits: [
          {
            uuid: 'v3'
          },
          {
            uuid: 'v4'
          }
        ]
      },
      'prog-4': {
        enrollment: {
          baseRoute: 'oncology',
          program: { display: 'prog four' }
        },
        currentVisit: null,
        visits: [
          {
            uuid: 'v6'
          }
        ]
      },
    };

    service.programVisits = visitProgram;

    service.groupProgramVisitsByClass();

    expect(service.visitsByProgramClass).toEqual(
      [
        {
          class: 'hiv',
          display: 'HIV',
          programs: [
            {
              uuid: 'prog-1',
              display: visitProgram['prog-1'].enrollment.program.display,
              programVisits: visitProgram['prog-1']
            },
            {
              uuid: 'prog-3',
              display: visitProgram['prog-3'].enrollment.program.display,
              programVisits: visitProgram['prog-3']
            }
          ],
          allVisits: [
            {
              uuid: 'v1'
            },
            {
              uuid: 'v2'
            },
            {
              uuid: 'v3'
            },
            {
              uuid: 'v4'
            }
          ]
        },
        {
          class: 'cdm',
          display: 'CDM',
          programs: [
            {
              uuid: 'prog-2',
              display: visitProgram['prog-2'].enrollment.program.display,
              programVisits: visitProgram['prog-2']
            }
          ],
          allVisits: [
            {
              uuid: 'v5'
            }
          ]
        },
        {
          class: 'oncology',
          display: 'Hemato-Oncology',
          programs: [
            {
              uuid: 'prog-4',
              display: visitProgram['prog-4'].enrollment.program.display,
              programVisits: visitProgram['prog-4']
            }
          ],
          allVisits: [
            {
              uuid: 'v6'
            }
          ]
        }
      ]
    );

  });

});
