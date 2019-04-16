import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OncologyReferralStatusComponent } from './oncology-referral-status.component';

import { AppSettingsService } from '../../../../app-settings/app-settings.service';
import { CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { DataCacheService } from '../../../../shared/services/data-cache.service';
import { DepartmentProgramsConfigService } from '../../../../etl-api/department-programs-config.service';
import { LocalStorageService } from '../../../../utils/local-storage.service';
import { LocationResourceService } from '../../../../openmrs-api/location-resource.service';
import { ProgramResourceService } from '../../../../openmrs-api/program-resource.service';

class FakeCacheStorageService {
  constructor(a, b) {}

  public ready() { return true; }
}

describe('OncologyReferralStatusComponent', () => {
  let component: OncologyReferralStatusComponent;
  let fixture: ComponentFixture<OncologyReferralStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ OncologyReferralStatusComponent ],
      providers: [
        AppSettingsService,
        CacheService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new FakeCacheStorageService(null, null);
          }, deps: []
        },
        DataCacheService,
        DepartmentProgramsConfigService,
        LocalStorageService,
        LocationResourceService,
        ProgramResourceService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OncologyReferralStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
