/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { DialogModule } from 'primeng/primeng';
import { CacheService } from 'ionic-cache';
import { BusyModule } from 'angular2-busy';

import { DataCacheService } from '../../../../shared/services/data-cache.service';
import { UserDefaultPropertieservice } from
  '../../../../../user-default-properties/user-default-properties.service';
import { ProgramEnrollmentResourceService } from
  '../../../../openmrs-api/program-enrollment-resource.service';
import { PatientProgramResourceService } from
  '../../../../etl-api/patient-program-resource.service';
import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';
import { LocationResourceService } from '../../../../openmrs-api/location-resource.service';
import { UserDefaultPropertiesModule } from
  '../../../../user-default-properties/user-default-properties.module';
import { UserDefaultPropertiesService } from
  '../../../../user-default-properties/user-default-properties.service';
import { NgamrsSharedModule } from '../../../../shared/ngamrs-shared.module';
import { PatientDashboardModule } from '../../../patient-dashboard.module';
import { FakeDefaultUserPropertiesFactory } from
  '../../formentry/mock/default-user-properties-factory.service.mock';
import { TodayVisitsComponent } from './today-visits.component';
import { AppFeatureAnalytics } from
  '../../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from
  '../../../../shared/app-analytics/app-feature-analytcis.mock';
import { ProgramWorkFlowResourceService
} from '../../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../../../openmrs-api/program-workflow-state-resource.service';
import { FakeRetrospectiveDataEntryService
} from '../../../../retrospective-data-entry/services/retrospective-data-entry-mock.service';
import { RetrospectiveDataEntryService
} from '../../../../retrospective-data-entry/services/retrospective-data-entry.service';
class LocationServiceMock {
  constructor() {
  }
  public getLocations(): Observable<any> {
    return Observable.of([]);
  }
}

class RouterStub {
  public navigateByUrl(url: string) { return url; }
}
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
describe('TodayVisitsComponent', () => {
  let component: TodayVisitsComponent;
  let fixture: ComponentFixture<TodayVisitsComponent>;

  beforeEach(async(() => {
    let fakePatientProgramResourceService = {
      getPatientProgramVisitConfigs: (uuid) => {
        return Observable.of({});
      },
      getPatientProgramVisitTypes: (
        patient: string, program: string,
        enrollment: string, location: string) => {
        return Observable.of({});
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
        return Observable.of(null);
      },
      updateVisit: (uuid, payload) => {
        return Observable.of(null);
      }
    };

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [],
      providers: [
        MockBackend,
        BaseRequestOptions,
        DataCacheService,
        CacheService,
        { provide: Router, useClass: RouterStub },
        {
          provide: ActivatedRoute, useValue: {
            queryParams: Observable.of({}),
            snapshot: { params: { program: 'some-uuid' } },
            params: Observable.of({ program: 'some-uuid' }),
          }
        },
        {
          provide: UserDefaultPropertiesService, useFactory: () => {
            return new FakeDefaultUserPropertiesFactory();
          }
        },
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        {
          provide: PatientProgramResourceService, useFactory: () => {
            return fakePatientProgramResourceService;
          }
        },
        {
          provide: RetrospectiveDataEntryService, useFactory: () => {
          return new FakeRetrospectiveDataEntryService();
        }
        },
        {
          provide: VisitResourceService,
          useValue: fakeVisitResourceService
        },
        {
          provide: LocationResourceService,
          useClass: LocationServiceMock
        },
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
      ],
      imports: [
        BusyModule,
        UserDefaultPropertiesModule,
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
    fixture = TestBed.createComponent(TodayVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
