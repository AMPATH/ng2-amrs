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
import { PatientIdentifierService } from '../patient-dashboard/common/patient-identifier/patient-identifiers.service';
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
import { ConceptResourceService } from './../openmrs-api/concept-resource.service';
import { PatientRelationshipTypeService } from '../patient-dashboard/common/patient-relationships/patient-relation-type.service';
import { PatientRelationshipTypeResourceService } from '../openmrs-api/patient-relationship-type-resource.service';

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
        DataCacheService,
        ConceptResourceService,
        PatientRelationshipTypeService,
        PatientRelationshipTypeResourceService
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
  it('form should be filled with age less than 116 years ', ( ) => {
    expect(component.birthError).toBeFalsy();
  });
  // it('should return the correct age ',()=>{
  //   const dateString = "2010-08-28T11:43:41+03:00";
  //   component.today = new Date(2019,08,28);
  //   const age = component.getAge(dateString);
  //   expect(age).toBe(9);
  // });

  it('should set the correct identifier type ', () => {
    const mockIdentifierType = {
      'label': 'MTCT Plus ID',
       'val': '58a46d20-1359-11df-a1f1-0026b9348838'
    };
    component.setIdentifierType(mockIdentifierType);
    const identifierType =  component.patientIdentifierType;
    expect(JSON.stringify(identifierType)).toBe(JSON.stringify(mockIdentifierType));
     });
     it('should set the preffered identifier ', ( ) => {
      const mockPreferedIdentifierType = {
        'identifier': '7364732',
​        'identifierType': '58a48706-1359-11df-a1f1-0026b9348838',
        'identifierTypeName': 'MTRH CARE Number'
      };
      component.setPreferred(mockPreferedIdentifierType);
      const preferedidentifierType =  component.preferredIdentifier ;
      expect(JSON.stringify(preferedidentifierType)).toBe(JSON.stringify(mockPreferedIdentifierType ));
       });
       it('should filter patients ', ( ) => {
       });

});
