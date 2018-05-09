import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings';
import { LocalStorageService } from '../../utils/local-storage.service';
import { PatientCreationComponent } from './patient-creation.component';
import { PatientCreationService } from './patient-creation.service';
import { Observable } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  MdSnackBar, OVERLAY_PROVIDERS, ScrollStrategyOptions, ScrollDispatcher, Platform, LiveAnnouncer

} from '@angular/material';
import {
  PatientCreationResourceService
} from '../../openmrs-api/patient-creation-resource.service';
import {
  LocationResourceService
} from '../../openmrs-api/location-resource.service';
import {
  PatientIdentifierTypeResService
} from '../../openmrs-api/patient-identifierTypes-resource.service';
import { PatientIdentifierService }
from '../../patient-dashboard/common/patient-identifier/patient-identifiers.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { UserService } from '../../openmrs-api/user.service';
import { SessionStorageService } from '../../utils/session-storage.service';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { Storage } from '@ionic/storage';
import { ModalModule } from 'ngx-bootstrap';

describe('Component: Patient Creation Unit Tests', () => {

  let fakeAppFeatureAnalytics: AppFeatureAnalytics, component;
  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot()
      ],
      providers: [
        MockBackend,
        BaseRequestOptions,
        FakeAppFeatureAnalytics,
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
        MdSnackBar,
        BsModalService,
        OVERLAY_PROVIDERS,
        ScrollStrategyOptions,
        ScrollDispatcher,
        Platform,
        LiveAnnouncer,
        PatientCreationService,
        PatientCreationResourceService,
        PatientIdentifierTypeResService,
        SessionStorageService,
        PatientIdentifierService,
        LocationResourceService,
        PatientResourceService,
        UserService,
        DataCacheService,
        CacheService
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

});
