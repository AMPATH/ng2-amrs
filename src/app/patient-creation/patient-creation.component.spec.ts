import { TestBed, inject, async } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { MatSnackBar } from '@angular/material';

import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytcis.mock';
import { LocalStorageService } from '../utils/local-storage.service';
import { PatientCreationComponent } from './patient-creation.component';
import { PatientCreationService } from './patient-creation.service';
import { Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';

import {
  PatientCreationResourceService
} from '../openmrs-api/patient-creation-resource.service';
import {
  LocationResourceService
} from '../openmrs-api/location-resource.service';
import {
  PatientIdentifierTypeResService
} from '../openmrs-api/patient-identifierTypes-resource.service';
import { PatientIdentifierService }
from '../patient-dashboard/common/patient-identifier/patient-identifiers.service';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import { UserService } from '../openmrs-api/user.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheModule } from 'ionic-cache/dist/cache.module';
import { Storage } from '@ionic/storage';
import { ModalModule } from 'ngx-bootstrap';
import { AppSettingsModule } from '../app-settings/app-settings.module';
import { ToastrModule} from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';

describe('Component: Patient Creation Unit Tests', () => {

  let fakeAppFeatureAnalytics: AppFeatureAnalytics, component;
  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        CacheModule.forRoot(),
        ToastrModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        FakeAppFeatureAnalytics,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: Router
        },
        {
          provide: ActivatedRoute
        },
        {
          provide: Storage
        },
        AppSettingsService,
        LocalStorageService,
        PatientCreationComponent,
        MatSnackBar,
        BsModalService, 
        PatientCreationService,
        PatientCreationResourceService,
        PatientIdentifierTypeResService,
        SessionStorageService,
        PatientIdentifierService,
        LocationResourceService,
        PatientResourceService,
        UserService,
        DataCacheService
      ]
    });

    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = TestBed.get(PatientCreationComponent);

  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    expect(component).toBeTruthy();
    done();
  });
  it('form should be valid', () => {
    expect(component.identifierValidity).toBeFalsy();
  });
  it('form should have an age less than 116 years ',()=>{
    expect(component.birthError).toBeFalsy();
  });
 
 
 
  
  


  

});
