/*
 * Testing a Component with async services
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#component-with-async-service
 */
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BusyModule, BusyConfig } from 'angular2-busy';
import * as moment from 'moment';

import { VisitComponent } from './visit.component';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import { PatientService } from '../../services/patient.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { FakeEncounterResourceService } from '../../../openmrs-api/fake-encounter-resource.service';
import { UserDefaultPropertiesService } from
  '../../../user-default-properties/user-default-properties.service';
import { FakeDefaultUserPropertiesFactory } from
  '../formentry/mock/default-user-properties-factory.service.mock';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { ProgramEnrollmentResourceService } from
  '../../../openmrs-api/program-enrollment-resource.service';
import { FakeProgramEnrollmentResourceService } from
  '../../../openmrs-api/program-enrollment-resource.service.mock';
import { UserDefaultPropertiesModule } from
  '../../../user-default-properties/user-default-properties.module';
import { Patient } from '../../../models/patient.model';
import { NgamrsSharedModule } from '../../../shared/ngamrs-shared.module';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { ProgramService } from '../../programs/program.service';

@Pipe({ name: 'translate' })
export class FakeTranslatePipe implements PipeTransform {
  public transform(value: any, decimalPlaces: number): any {
    return value;
  }
}

describe('Component: Visit', () => {
  let fakePatientService = {};

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
      return Observable.of(prog);
    },
    getPatientProgramVisitTypes: (
      patient: string, program: string,
      enrollment: string, location: string) => {
      return Observable.of(progConfig);
    }
  };
  let router = {
    navigate: jasmine.createSpy('navigate')
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
    getPatientVisits: (args) => {
      return Observable.of(null);
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

  let fakeChangeDetectorRef = {
    markForCheck: () => { }
  };

  let fixture, comp: VisitComponent, nativeElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        VisitComponent,
        FakeTranslatePipe
      ],
      providers: [
        PatientProgramService,
        ProgramService,
        { provide: ChangeDetectorRef, useValue: fakeChangeDetectorRef },
        { provide: VisitResourceService, useValue: fakeVisitResourceService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute, useValue: {
            queryParams: Observable.of({}),
            snapshot: { params: { program: 'some-uuid' } },
            params: Observable.of({ program: 'some-uuid' }),
          }
        },
        VisitComponent,
        PatientService,
        {
          provide: PatientProgramResourceService,
          useValue: fakePatientProgramResourceService
        },
        {
          provide: EncounterResourceService, useFactory: () => {
            return new FakeEncounterResourceService(null, null);
          }
        },
        {
          provide: UserDefaultPropertiesService, useFactory: () => {
            return new FakeDefaultUserPropertiesFactory();
          }
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        { provide: PatientResourceService, useValue: fakeVisitResourceService },
        {
          provide: ProgramEnrollmentResourceService,
          useValue: FakeProgramEnrollmentResourceService
        }
      ],
      imports: [
        BusyModule,
        NgamrsSharedModule,
        UserDefaultPropertiesModule,
        BrowserAnimationsModule,
        HttpModule
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(VisitComponent);
        comp = fixture.componentInstance;
        comp.patient = {
          uuid: 'uuid',
          person: { uuid: 'uuid' }
        };
        nativeElement = fixture.nativeElement;
        fixture.detectChanges();
      });
  }));

  it('should get selected program from url on load', (done) => {
    fixture.detectChanges();
    expect(comp.programUuid).toEqual('some-uuid');
    done();
  });

  it('should fetch all programs configs', (done) => {
    let progService: PatientProgramResourceService =
      TestBed.get(PatientProgramResourceService);

    let progVisitTypeSpy =
      spyOn(progService, 'getAllProgramVisitConfigs')
        .and.callThrough();
    let compFilterVisitsSpy =
      spyOn(comp, 'determineProgramConfigurationObject').and.callThrough();
    comp.fetchAllProgramVisitConfigs();
    fixture.detectChanges();

    expect(progVisitTypeSpy.calls.count()).toBe(1);
    expect(comp.allProgramVisitConfigs).toEqual(prog);
    expect(compFilterVisitsSpy.calls.count()).toBe(1);
    done();

  });

  it('should extract the current program config from all program configs', () => {
    let compFilterVisitsSpy =
      spyOn(comp, 'determineTodayVisitForProgram').and.callThrough();
    comp.allProgramVisitConfigs = prog;
    comp.determineProgramConfigurationObject();
    fixture.detectChanges();
    expect(comp.currentProgramConfig).toBe(progConfig);
    expect(compFilterVisitsSpy.calls.count()).toBe(1);
  });

  it('should subscribe to patient load events from patient service',
    (done) => {
      let patientService: PatientService =
        TestBed.get(PatientService);
      comp.ngOnInit();
      comp.patient = null;
      fixture.detectChanges();

      let nextPatient = new Patient({ uuid: 'patient-uuid', person: {} });
      patientService.currentlyLoadedPatient.next(nextPatient);

      fixture.detectChanges();
      expect(comp.patient).toBe(nextPatient);
      done();
    });

  it('should fetch all visits for a patient', () => {
    let visitResService: VisitResourceService =
      TestBed.get(VisitResourceService);
    let patientVisitsSpy =
      spyOn(visitResService, 'getPatientVisits')
        .and.callFake((params) => {
          return Observable.of(visitsSample);
        });

    let compFilterVisitsSpy =
      spyOn(comp, 'determineTodayVisitForProgram').and.callThrough();

    comp.hasFetchedVisits = false;
    comp.allPatientVisits = [];
    comp.getPatientVisits();
    fixture.detectChanges();

    expect(patientVisitsSpy.calls.count()).toBe(1);
    expect(patientVisitsSpy.calls.mostRecent().args[0])
      .toEqual({ patientUuid: 'uuid' });
    expect(comp.hasFetchedVisits).toBe(true);
    expect(comp.allPatientVisits).toBe(visitsSample);
    expect(compFilterVisitsSpy.calls.count()).toBe(1);
  });

  it('should filter visits by visit types', () => {
    let types = ['some-visit-type-uuid-3', 'some-visit-type-uuid-1'];
    let expected = [visitsSample[2], visitsSample[4]];

    let actual = comp.filterVisitsByVisitTypes(visitsSample, types);

    expect(actual).toEqual(expected);
  });

  it('should sort visits by startDatetime', () => {
    let sample = [visitsSample[0], visitsSample[4], visitsSample[1]];
    let expected = [visitsSample[1], visitsSample[0], visitsSample[4]];
    let actual = comp.sortVisitsByVisitStartDateTime(sample);
    expect(actual).toEqual(expected);
  });

  it('should filter out the current visit from the list of visits', () => {
    // the current visit will be the most recent visit for that program
    // that was started today
    // the visit could have been ended or it could be an active visit

    // CASE 1: Program Config not determined
    comp.currentProgramConfig = undefined;
    comp.allPatientVisits = visitsSample;
    comp.hasFetchedVisits = true;

    comp.determineTodayVisitForProgram();
    fixture.detectChanges();
    expect(comp.visit).toBeUndefined();

    // CASE 2: Visits not loaded
    comp.currentProgramConfig = progConfig;
    comp.allPatientVisits = [];
    comp.hasFetchedVisits = false;

    comp.determineTodayVisitForProgram();
    fixture.detectChanges();
    expect(comp.visit).toBeUndefined();

    // CASE 3: Visits and Program Config Loaded
    // SUB-CASE: Today's Visit Present for Current Program
    comp.hasFetchedVisits = true;
    comp.allPatientVisits = visitsSample;
    comp.currentProgramConfig = progConfig;
    comp.determineTodayVisitForProgram();
    fixture.detectChanges();
    expect(comp.visit).toBe(visitsSample[1]);

    // SUB-CASE: Today's Visit Absent for Current Program
    comp.hasFetchedVisits = true;
    comp.allPatientVisits = [
      visitsSample[2],
      visitsSample[3],
      visitsSample[4],
      visitsSample[5],
      visitsSample[6]
    ];
    comp.currentProgramConfig = progConfig;
    comp.determineTodayVisitForProgram();
    fixture.detectChanges();
    expect(comp.visit).toBeUndefined();

    // SUB-CASE: No Visit Present
    comp.hasFetchedVisits = true;
    comp.allPatientVisits = [];
    comp.currentProgramConfig = progConfig;
    comp.determineTodayVisitForProgram();
    fixture.detectChanges();
    expect(comp.visit).toBeUndefined();

    // SUB-CASE: No Visit Types for program
    comp.hasFetchedVisits = true;
    comp.allPatientVisits = visitsSample;
    comp.currentProgramConfig = {
      uuid: 'some-uuid',
      visitTypes: []
    };
    comp.determineTodayVisitForProgram();
    fixture.detectChanges();
    expect(comp.visit).toBeUndefined();
  });

});
