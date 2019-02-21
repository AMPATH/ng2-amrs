import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

import * as moment from 'moment';
import { NgBusyModule, BusyConfig } from 'ng-busy';
import { DialogModule } from 'primeng/primeng';
import { CacheService } from 'ionic-cache';
import { VisitDetailsComponent } from './visit-details.component';
import { DataCacheService } from '../../../../shared/services/data-cache.service';
import { UserDefaultPropertiesModule } from '../../../../user-default-properties/user-default-properties.module';
import { NgamrsSharedModule } from '../../../../shared/ngamrs-shared.module';
import { PatientDashboardModule } from '../../../patient-dashboard.module';
import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';
import {
  RetrospectiveDataEntryService
} from '../../../../retrospective-data-entry/services/retrospective-data-entry.service';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class RouterStub {
  public navigateByUrl(url: string) { return url; }
}
class FakeRetrospectiveDataEntryService {
  public retroSettings: Observable<any> = Observable.of({ enabled: false });
}

class FakeCacheStorageService {
  constructor(a, b) {
  }

  public ready() {
    return true;
  }
}


describe('VisitDetailsComponent: ', () => {
  let component: VisitDetailsComponent;
  let fixture: ComponentFixture<VisitDetailsComponent>;

  const exampleVisit = {
    uuid: 'visit-uuid',
    visitType: {
      uuid: 'visit-type-uuid',
      display: 'visit type'
    },
    encounters: [
      {
        uuid: 'uuid 1',
        encounterType: {
          uuid: 'encounter-type-1',
          display: 'encounter type 1'
        },
        location: {
          uuid: 'location-1',
          display: 'location 1'
        },
        form: {
          uuid: 'form-1',
          name: 'form 1'
        },
        provider: {
          uuid: '1234-1-provider 1',
          display: '1234-1-provider 1'
        },
        encounterDatetime: '2017-08-03T10:50:57.000+0300'
      }
    ],
    location: {
      uuid: 'location-1',
      display: 'location 1'
    },
    patient: {
      uuid: 'patient-1',
      display: 'patient 1'
    },
    startDatetime: '2017-08-03T10:45:52.000+0300',
    stopDatetime: null
  };

  const programConfig = {
    uuid: 'program uuid',
    visitTypes: [
      {
        uuid: 'visit-type-uuid',
        encounterTypes: [
          {
            uuid: 'encounter-type-1',
            display: 'encounter type 1'
          },
          {
            uuid: 'encounter-type-2',
            display: 'encounter type 2'
          }
        ]
      },
      {
        uuid: 'visit-type-two',
        encounterTypes: []
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      providers: [
        HttpClientTestingModule,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: {} },
        {
          provide: RetrospectiveDataEntryService, useFactory: () => {
            return new FakeRetrospectiveDataEntryService();
          }
        },
        {
          provide: CacheStorageService, useFactory: () => {
            return new FakeCacheStorageService(null, null);
          }, deps: []
        },
        DataCacheService,
        CacheService
      ],
      imports: [
        NgBusyModule,
        UserDefaultPropertiesModule,
        DialogModule,
        FormsModule,
        NgamrsSharedModule,
        PatientDashboardModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should determine which encounter types have been filled in order' +
    ' to exclude it from the list of available forms, given a visit object',
    () => {
      component.visit = exampleVisit;
      component.extractCompletedEncounterTypes();

      fixture.detectChanges();
      expect(component.completedEncounterTypesUuids.length).toBe(1);
      expect(component.completedEncounterTypesUuids[0]).toEqual('encounter-type-1');
    });

  it('should extract the allowed encounter types for a given vist given the program visit config',
    () => {
      component.visit = exampleVisit;
      component.programVisitTypesConfig = programConfig;

      component.extractAllowedEncounterTypesForVisit();
      fixture.detectChanges();

      expect(component.allowedEncounterTypesUuids).toEqual(
        [
          'encounter-type-1',
          'encounter-type-2'
        ]
      );
    });

  it('should reload the current visit when reload is called', () => {
    component.visit = exampleVisit;

    const visitClone: any = {};
    Object.assign(visitClone, exampleVisit);
    visitClone.encounters = [];

    const resService: VisitResourceService =
      TestBed.get(VisitResourceService);

    const updateVisitSpy = spyOn(resService, 'getVisitByUuid')
      .and.callFake(() => {
        return of(visitClone);
      });

    component.reloadVisit();
    fixture.detectChanges();

    expect(updateVisitSpy.calls.count() > 0).toBe(true);
    expect(updateVisitSpy.calls.first().args[0]).toEqual(exampleVisit.uuid);
    const expectedVisitVersion = 'custom:(uuid,encounters:(uuid,encounterDatetime,' +
      'form:(uuid,name),location:ref,' +
      'encounterType:ref,provider:ref),patient:(uuid,uuid),' +
      'visitType:(uuid,name),location:ref,startDatetime,' +
      'stopDatetime,attributes:(uuid,value))';
    expect(updateVisitSpy.calls.first().args[1]).toEqual({ v: expectedVisitVersion });
    expect(component.visit).toBe(visitClone);
  });

  it('should end the current visit',
    () => {
      component.visit = exampleVisit;

      const resService: VisitResourceService =
        TestBed.get(VisitResourceService);

      const updateVisitSpy = spyOn(resService, 'updateVisit')
        .and.callFake(() => {
          const visitClone: any = {};
          Object.assign(visitClone, exampleVisit);
          visitClone.stopDatetime = new Date();
          return of(visitClone);
        });

      const reloadSpy = spyOn(component, 'reloadVisit')
        .and.callFake(() => { });

      component.endCurrentVisit();
      fixture.detectChanges();

      expect(updateVisitSpy.calls.count()).toBe(1);
      expect(updateVisitSpy.calls.mostRecent().args[0]).toEqual(exampleVisit.uuid);
      expect(moment(updateVisitSpy.calls.mostRecent().args[1].stopDatetime)
        .format('YYYY-MM-DD HH:m'))
        .toEqual(moment().format('YYYY-MM-DD HH:m'));
      expect(reloadSpy.calls.count()).toBe(1);
    });

  it('should cancel the current visit',
    () => {
      component.visit = exampleVisit;

      const resService: VisitResourceService =
        TestBed.get(VisitResourceService);

      const updateVisitSpy = spyOn(resService, 'updateVisit')
        .and.callFake(() => {
          const visitClone: any = {};
          Object.assign(visitClone, exampleVisit);
          visitClone.voided = true;
          return of(visitClone);
        });

      const voidVisitEncountersSpy =
        spyOn(component, 'voidVisitEncounters').and.callFake(() => { });

      component.cancelCurrenVisit();
      fixture.detectChanges();

      expect(updateVisitSpy.calls.count()).toBe(1);
      expect(updateVisitSpy.calls.mostRecent().args[0]).toEqual(exampleVisit.uuid);
      expect(updateVisitSpy.calls.mostRecent().args[1])
        .toEqual({ voided: true });
      expect(voidVisitEncountersSpy.calls.count()).toBe(1);
    });

  it('should output the selected form', () => {
    const sampleForm = {
      uuid: 'some uuid'
    };
    component.formSelected.subscribe(
      (form) => {
        expect(form).toEqual({ form: sampleForm, visit: component.visit });
      }
    );

    component.onFormSelected(sampleForm);
    fixture.detectChanges();
  });

  it('should output the selected encouter', () => {
    const sampleEncounter = {
      uuid: 'some uuid'
    };
    component.encounterSelected.subscribe(
      (encounter) => {
        expect(encounter).toBe(sampleEncounter);
      }
    );

    component.onEncounterSelected(sampleEncounter);
    fixture.detectChanges();
  });

});
