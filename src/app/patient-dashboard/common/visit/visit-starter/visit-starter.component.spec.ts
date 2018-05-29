/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import * as moment from 'moment';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { DialogModule } from 'primeng/primeng';
import { CacheService } from 'ionic-cache';

import { VisitStarterComponent } from './visit-starter.component';
import { ProgramEnrollmentResourceService } from
  '../../../../openmrs-api/program-enrollment-resource.service';
import { UserDefaultPropertiesService } from '../../../../user-default-properties/index';
import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';
import { DataCacheService } from '../../../../shared/services/data-cache.service';
import { UserDefaultPropertiesModule } from
  '../../../../user-default-properties/user-default-properties.module';
import { NgamrsSharedModule } from '../../../../shared/ngamrs-shared.module';
import { PatientDashboardModule } from '../../../patient-dashboard.module';
import { PatientProgramResourceService } from
  '../../../../etl-api/patient-program-resource.service';
import { TodayVisitService } from '../today-visit.service';
import { RetrospectiveDataEntryModule
} from '../../../../retrospective-data-entry/retrospective-data-entry.module';
import { FakeRetrospectiveDataEntryService
} from '../../../../retrospective-data-entry/services/retrospective-data-entry-mock.service';
import { FakeDefaultUserPropertiesFactory
} from '../../formentry/mock/default-user-properties-factory.service.mock';
import { RetrospectiveDataEntryService
} from '../../../../retrospective-data-entry/services/retrospective-data-entry.service';

class RouterStub {
  public navigateByUrl(url: string) { return url; }
}

describe('VisitStarterComponent', () => {
  let component: VisitStarterComponent;
  let fixture: ComponentFixture<VisitStarterComponent>;

  let progConfig = {
    uuid: 'some-uuid',
    visitTypes: {
      allowed: [
        {
          uuid: 'visit-one',
          name: 'Visit One',
          encounterTypes: []
        },
        {
          uuid: 'visit-three',
          name: 'Visit Three',
          encounterTypes: []
        }
      ],
      disallowed: [
        {
          uuid: 'visit-two',
          name: 'Visit Two',
          encounterTypes: []
        }
      ]
    }
  };

  let allProgConfigs = { 'some-uuid': progConfig };

  let fakePatientProgramResourceService = {
    getPatientProgramVisitConfigs: (uuid) => {
      return Observable.of(allProgConfigs);
    },
    getPatientProgramVisitTypes: (
      patient: string, program: string,
      enrollment: string, location: string) => {
      return Observable.of(progConfig);
    }
  };

  let fakeVisitResourceService = {
    getVisitTypes: (args) => {
      return Observable.of([]);
    },
    getPatientVisits: (args) => {
      return Observable.of([]);
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      providers: [
        ProgramEnrollmentResourceService,
        {
          provide: UserDefaultPropertiesService, useFactory: () => {
            return new FakeDefaultUserPropertiesFactory();
          }
        },
      {
        provide: RetrospectiveDataEntryService, useFactory: () => {
        return new FakeRetrospectiveDataEntryService();
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
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: {} },
        DataCacheService,
        TodayVisitService,
        CacheService
      ],
      imports: [
        BusyModule,
        UserDefaultPropertiesModule,
        RetrospectiveDataEntryModule,
        DialogModule,
        FormsModule,
        NgamrsSharedModule,
        PatientDashboardModule,
        HttpModule,
        BrowserAnimationsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user default location as the default location of visit on load', (done) => {
    let defaultUserService: FakeDefaultUserPropertiesFactory =
      TestBed.get(UserDefaultPropertiesService);
    expect(defaultUserService).toBeDefined();
    fixture.detectChanges();

    expect(defaultUserService.getCurrentUserDefaultLocationObject().uuid)
      .toEqual(component.selectedLocation.value);
    done();
  });

  it('should fetch program config for current patient, enrollment, and location',
    (done) => {
      let progService =
        TestBed.get(PatientProgramResourceService);
      component.patientUuid = 'uuid';
      component.programUuid = 'some-program';
      component.programEnrollmentUuid = 'some-enrollment';
      component.programVisitsConfig = {};
      let progVisitTypeSpy =
        spyOn(progService, 'getPatientProgramVisitTypes')
          .and.callThrough();

      component.getCurrentProgramEnrollmentConfig();

      fixture.detectChanges();

      expect(progVisitTypeSpy.calls.count()).toBe(1);
      expect(progVisitTypeSpy.calls.mostRecent().args[0]).toEqual('uuid');
      expect(progVisitTypeSpy.calls.mostRecent().args[1]).toEqual('some-program');
      expect(progVisitTypeSpy.calls.mostRecent().args[2]).toEqual('some-enrollment');
      expect(progVisitTypeSpy.calls.mostRecent().args[3]).toEqual(component.selectedLocation.value);
      expect(component.programVisitsConfig).toEqual(progConfig);
      done();
    });

  it('should refetch program visit types config when location changes',
    (done) => {
      component.patientUuid = 'uuid';
      component.programUuid = 'some-program';
      component.programEnrollmentUuid = 'some-enrollment';

      let compGetProgConfigSpy =
        spyOn(component, 'getCurrentProgramEnrollmentConfig')
          .and.callThrough();

      component.selectedLocation.value = 'new-location-uuid';
      fixture.detectChanges();
      expect(compGetProgConfigSpy.calls.count()).toBe(0);
      done();
    });

  it('should populate the UI with visit types for the current program config',
    () => {
      component.patientUuid = 'uuid';
      component.programUuid = 'some-program';
      component.programEnrollmentUuid = 'some-enrollment';
      component.selectedLocation.value = 'new-location-uuid';
      fixture.detectChanges();
      let de = fixture.debugElement.queryAll(By.css('#allowedVisitList'));
      expect(de.length).toBe(2);
      expect(de[0].nativeElement.innerHTML).toContain('Visit One');
    });

  it('should start a visit for given visit type',
    (done) => {
      let visitService =
        TestBed.get(VisitResourceService);

      let todayService =
        TestBed.get(TodayVisitService);

      let visitSpy =
        spyOn(visitService, 'saveVisit')
          .and.callThrough();

      let outputSpy = spyOn(component.visitStarted, 'emit')
        .and.callThrough();

      component.patientUuid = 'uuid';
      component.programUuid = 'some-program';
      component.programEnrollmentUuid = 'some-enrollment';
      component.selectedLocation = {value: 'new-location-uuid'};

      component.startVisit('visit-one');
      fixture.detectChanges();

      expect(visitSpy.calls.count()).toBe(1);
      expect(visitSpy.calls.mostRecent().args[0].patient).toEqual('uuid');
      expect(visitSpy.calls.mostRecent().args[0].location).toEqual('new-location-uuid');
      expect(visitSpy.calls.mostRecent().args[0].visitType).toEqual('visit-one');
      expect(moment(visitSpy.calls.mostRecent().args[0].startDatetime).format('YYYY-MM-DD HH:m:s'))
        .toEqual(moment().format('YYYY-MM-DD HH:m:s'));

      // should output the returned visit
      expect(outputSpy.calls.count()).toBe(1);
      expect(outputSpy.calls.mostRecent().args[0].uuid)
        .toEqual('visituuid');
      done();
    });

});
