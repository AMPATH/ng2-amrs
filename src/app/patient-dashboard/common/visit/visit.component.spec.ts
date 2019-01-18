/*
 * Testing a Component with async services
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#component-with-async-service
 */
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { ChangeDetectorRef } from '@angular/core';
// import { Pipe, PipeTransform } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, of } from 'rxjs';
import { NgBusyModule, BusyConfig } from 'ng-busy';
import * as moment from 'moment';
import { CacheService } from 'ionic-cache';

import { PatientDashboardModule } from '../../patient-dashboard.module';
import { NgamrsSharedModule } from '../../../shared/ngamrs-shared.module';
import { UserDefaultPropertiesModule } from '../../../user-default-properties/user-default-properties.module';

import { VisitComponent } from './visit.component';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';
import { FakeDefaultUserPropertiesFactory } from '../formentry/mock/default-user-properties-factory.service.mock';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { ProgramEnrollmentResourceService } from '../../../openmrs-api/program-enrollment-resource.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import { DialogModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { TodayVisitService, VisitsEvent } from './today-visit.service';
import { ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';
import { RetrospectiveDataEntryService
} from '../../../retrospective-data-entry/services/retrospective-data-entry.service';
import { FakeRetrospectiveDataEntryService
} from '../../../retrospective-data-entry/services/retrospective-data-entry-mock.service';
import { delay } from 'rxjs/operators';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class LocationServiceMock {
  constructor() {
  }
  public getLocations(): Observable<any> {
    return of([]);
  }
}

class RouterStub {
  public navigateByUrl(url: string) { return url; }
}
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
xdescribe('Component: Visit', () => {

  let fixture, comp: VisitComponent, nativeElement;

  beforeEach(async(() => {
    const fakePatientProgramResourceService = {
      getPatientProgramVisitConfigs: (uuid) => {
        return of({});
      },
      getPatientProgramVisitTypes: (
        patient: string, program: string,
        enrollment: string, location: string) => {
        return of({});
      }
    };

    const fakeVisitResourceService = {
      getVisitTypes: (args) => {
        return of([]);
      },
      getPatientVisits: (args) => {
        return of([]);
      },
      saveVisit: (payload) => {
        return of(null);
      },
      updateVisit: (uuid, payload) => {
        return of(null);
      }
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        // VisitComponent,
      ],
      providers: [
        DataCacheService,
        CacheService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: RetrospectiveDataEntryService, useFactory: () => {
          return new FakeRetrospectiveDataEntryService();
        }
        },
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        {
          provide: UserDefaultPropertiesService, useFactory: () => {
            return new FakeDefaultUserPropertiesFactory();
          }
        },
        {
          provide: PatientProgramResourceService, useFactory: () => {
            return fakePatientProgramResourceService;
          }
        },
        {
          provide: VisitResourceService,
          useValue: fakeVisitResourceService
        },
        {
          provide: LocationResourceService,
          useClass: LocationServiceMock
        }
      ],
      imports: [
        NgBusyModule,
        UserDefaultPropertiesModule,
        DialogModule,
        FormsModule,
        NgamrsSharedModule,
        PatientDashboardModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
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
        comp.currentEnrollment = {states: []};
        nativeElement = fixture.nativeElement;
        fixture.detectChanges();
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(comp).toBeDefined();
  });

  it('should react to visit loading started event from visit service', () => {
    const service: TodayVisitService = TestBed.get(TodayVisitService);

    comp.visit = {};
    comp.visits = [{}];
    comp.patient = {};
    comp.currentProgramConfig = {};
    comp.currentEnrollment = {states: []};
    comp.currentProgramEnrollmentUuid = 'some-text';
    comp.programVisitsObj = {};
    comp.isBusy = false;
    comp.errors = [{}];
    service.visitsEvents.next(VisitsEvent.VisitsLoadingStarted);
    fixture.detectChanges();
    expect(comp.visit).toBeUndefined();
    expect(comp.patient).toBeUndefined();
    expect(comp.currentProgramConfig).toBeUndefined();
    expect(comp.currentEnrollment).toBeUndefined();
    expect(comp.programVisitsObj).toBeUndefined();
    expect(comp.currentProgramEnrollmentUuid).toBe('');
    expect(comp.visits.length).toBe(0);
    expect(comp.isBusy).toBe(true);
    expect(comp.errors.length).toBe(0);

  });

  it('should react to error loading visits event from visit service', () => {
    const service: TodayVisitService = TestBed.get(TodayVisitService);
    const sampleError = {
      id: 'some error',
      message: 'some error'
    };

    comp.visit = null;
    comp.isBusy = true;
    comp.errors = [];
    service.errors.push(sampleError);
    service.visitsEvents.next(VisitsEvent.ErrorLoading);
    fixture.detectChanges();
    expect(comp.visit).toBeUndefined();
    expect(comp.errors).toEqual(service.errors);
    expect(comp.isBusy).toBe(false);
  });

  it('should react to visit loaded event from visit service', () => {
    const service: TodayVisitService = TestBed.get(TodayVisitService);
    comp.programVisitsObj = undefined;
    comp.isBusy = true;
    comp.patient = null;
    service.patient = { uuid: 'some-uuid', person: { uuid: 'some-uuid' } };
    service.programVisits = { 'some-uuid': {} };
    const processVisitsSpy = spyOn(comp, 'processProgramVisits').and.returnValue(undefined);
    service.visitsEvents.next(VisitsEvent.VisitsLoaded);
    fixture.detectChanges();
    expect(comp.programVisitsObj).toEqual({ 'some-uuid': {} });
    expect(comp.patient).toEqual(service.patient);
    expect(comp.errors.length).toBe(0);
    expect(comp.isBusy).toBe(false);
    expect(processVisitsSpy.calls.count()).toBe(1);
  });

  it('should react to requires visit reload event from visit service', () => {
    const service: TodayVisitService = TestBed.get(TodayVisitService);
    const visitLoadingTriggeredSpy = spyOn(comp, 'triggerVisitLoading')
      .and.returnValue(undefined);
    service.visitsEvents.next(VisitsEvent.VisitsBecameStale);
    fixture.detectChanges();
    expect(visitLoadingTriggeredSpy.calls.count()).toBe(1);
  });

  it('should extract visits, current visit and program config from programVisits object', () => {
    const sampleProgramConfig = {
      'some-uuid': {
        enrollment: {
          uuid: 'some-uuid',
          enrolledProgram: {
            uuid: 'uuid2'
          }
        },
        visits: [
          {
            uuid: 'visit-uuid',
            encounterTypes: [],
            startDatetime: '01-01-1990',
            endDatetime: null
          },
          {
            uuid: 'visit-uuid-2',
            encounterTypes: [],
            startDatetime: '01-01-1990',
            endDatetime: '01-01-1990'
          }
        ],
        currentVisit: {
          uuid: 'visit-uuid',
          encounterTypes: [],
          startDatetime: null,
          endDatetime: null
        },
        config: {
          visitTypes: []
        }
      },
      'some-uuid-1': {
        enrollment: {
          uuid: 'some-uuid-1',
          enrolledProgram: {
            uuid: 'uuid3'
          }
        },
        visits: [],
        currentVisit: null,
        config: {
          visitTypes: []
        }
      }
    };

    // initialize params
    comp.visit = null;
    comp.visits = [];
    comp.programUuid = 'some-uuid';
    comp.currentProgramConfig = undefined;
    comp.currentEnrollment = {states: []};
    comp.currentProgramEnrollmentUuid = '';
    comp.programVisitsObj = sampleProgramConfig;

    // the call
    comp.processProgramVisits();

    expect(comp.visit).toEqual(sampleProgramConfig['some-uuid'].currentVisit);
    expect(comp.visits).toEqual(sampleProgramConfig['some-uuid'].visits);
    expect(comp.currentProgramConfig).toEqual(sampleProgramConfig['some-uuid'].config);
    expect(comp.currentEnrollment)
      .toEqual(sampleProgramConfig['some-uuid'].enrollment.enrolledProgram);
    expect(comp.currentProgramEnrollmentUuid)
      .toEqual(sampleProgramConfig['some-uuid'].enrollment.enrolledProgram.uuid);

  });

  it('should trigger loading of visits on today visits service', () => {
    const service: TodayVisitService = TestBed.get(TodayVisitService);

    const loadVisitSpy = spyOn(service, 'getProgramVisits')
      .and.callFake(() => {
        return of({}).pipe(delay(50));
      });

    comp.triggerVisitLoading();
    fixture.detectChanges();

    expect(loadVisitSpy.calls.count()).toBe(1);
  });

  it('should make visits stale on visit started event', () => {
    const service: TodayVisitService = TestBed.get(TodayVisitService);

    const makeStaleSpy = spyOn(service, 'makeVisitsStale')
      .and.returnValue(undefined);

    comp.onVisitStartedOrChanged(null);
    fixture.detectChanges();

    expect(makeStaleSpy.calls.count()).toBe(1);
  });

  it('should output the selected form', (done) => {
    const sampleForm = {
      uuid: 'some uuid'
    };
    comp.formSelected.subscribe(
      (form) => {
        expect(form).toBe(sampleForm);
        done();
      }
    );

    comp.onFormSelected(sampleForm);
    fixture.detectChanges();
  });

  it('should output the selected encouter', (done) => {
    const sampleEncounter = {
      uuid: 'some uuid'
    };
    comp.encounterSelected.subscribe(
      (encounter) => {
        expect(encounter).toBe(sampleEncounter);
        done();
      }
    );

    comp.onEncounterSelected(sampleEncounter);
    fixture.detectChanges();
  });

});
