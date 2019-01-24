/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientService } from './services/patient.service';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import { FakeAppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytcis.mock';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { LabsResourceService } from '../etl-api/labs-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../openmrs-api/program-enrollment-resource.service';
import { ToastrService, Overlay, OverlayContainer, ToastrModule } from 'ngx-toastr';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';
import { PatientProgramService } from './programs/patient-programs.service';
import { RoutesProviderService } from '../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from './programs/program.service';
import { ProgramResourceService } from '../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../openmrs-api/program-workflow-state-resource.service';
import { PatientRoutesFactory } from '../navigation';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  public params = of([{ 'id': 1 }]);
}

class FakeCacheStorageService {
  constructor(a, b) {
  }

  public ready() {
    return true;
  }
}

describe('Component: PatientDashboard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientDashboardComponent,
        PatientService,
        ProgramService,
        ProgramResourceService,
        PatientResourceService,
        FakeAppFeatureAnalytics,
        AppSettingsService,
        LocalStorageService,
        EncounterResourceService,
        PatientProgramService,
        RoutesProviderService,
        ProgramEnrollmentResourceService,
        LabsResourceService,
        ProgramWorkFlowResourceService,
        PatientRoutesFactory,
        ProgramWorkFlowStateResourceService,
        {
          provide: CacheStorageService,
          useFactory: () => {
            return new FakeCacheStorageService(null, null);
          }
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        { provide: Router, useClass: MockRouter }, {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        }, DynamicRoutesService,
        // {
        //   provide: ToastrConfig, useFactory: () => {
        //     return new ToastrConfigMock();
        //   }, deps: []
        // },
        ToastrService,
        Overlay,
        OverlayContainer
      ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot()]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    const component = TestBed.get(PatientDashboardComponent);
    expect(component).toBeTruthy();
  });
});
class ToastrConfigMock {
  public timeOut = 5000;
  public closeButton = false;
  public positionClass = 'toast-top-right';
  public extendedTimeOut = 1000;
  constructor() {
  }

}
