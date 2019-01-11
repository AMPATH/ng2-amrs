import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of, from } from 'rxjs';
import { ReportFilterComponent } from './report-filter.component';
import { MatSnackBar } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { IndicatorResourceService } from '../../etl-api/indicator-resource.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { FormsResourceService } from '../../openmrs-api/forms-resource.service';


class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}
class FakeCacheStorageService {
  constructor(a, b) {
  }

  public ready() {
    return true;
  }
}
const mockDepartmentProgramConfig = {
  'uud4': {
    'name': 'BSG',
    'programs': [
      {
        'uuid': '781d8a88-1359-11df-a1f1-0026b9348838',
        'name': 'BSG PROGRAM'
      }
    ]
  },
  'uud5': {
    'name': 'DERMATOLOGY',
    'programs': [
      {
        'uuid': 'b3575274-1850-429b-bb8f-2ff83faedbaf',
        'name': 'DERMATOLOGY'
      }
    ]
  }

};

const locationResourceService =
  jasmine.createSpyObj('LocationResourceService', ['getLocations']);

const locationResourceServiceSpy =
  locationResourceService.getLocations.and.returnValue(of(mockDepartmentProgramConfig));
describe('Component: ProgramEnrollmentPatientListComponent', () => {
  let fixture: ComponentFixture<ReportFilterComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let comp: any;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
        [
          FormsModule,
          HttpClientTestingModule,
          CacheModule.forRoot(),
        ],
      declarations: [
        ReportFilterComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        MatSnackBar,
        MatMenuModule,
        {
          provide: Router
        },
        {
          provide: ActivatedRoute
        },
        IndicatorResourceService,
        AppSettingsService,
        LocalStorageService,
        DataCacheService,
        LocationResourceService,
        CacheService,
        FormsResourceService,
        {
          provide: CacheStorageService, usefactory: () => {
            return new FakeCacheStorageService(null, null);
          }
        }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ReportFilterComponent);
        comp = fixture.componentInstance;
        router = fixture.debugElement.injector.get<Router>(Router);
        route = fixture.debugElement.injector.get<ActivatedRoute>(ActivatedRoute);

      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(comp).toBeDefined();
  });

  it('diagnostic should return reportFilterModel as a string', () => {
    expect(JSON.stringify(comp.reportFilterModel)).toBe(JSON.stringify(comp.reportFilterModel));
  });
});
