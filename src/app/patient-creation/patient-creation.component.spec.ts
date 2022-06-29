import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { click, tickAndDetectChanges } from '../test-helpers';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Storage } from '@ionic/storage';
import { CacheModule } from 'ionic-cache/dist/cache.module';
import { ModalModule } from 'ngx-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DateTimePickerModule } from '@ampath-kenya/ngx-openmrs-formentry';

import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytcis.mock';
import { LocalStorageService } from '../utils/local-storage.service';
import { PatientCreationComponent } from './patient-creation.component';
import { PatientCreationService } from './patient-creation.service';
import { PatientCreationResourceService } from '../openmrs-api/patient-creation-resource.service';
import { LocationResourceService } from '../openmrs-api/location-resource.service';
import { PatientIdentifierTypeResService } from '../openmrs-api/patient-identifierTypes-resource.service';
import { PatientIdentifierService } from '../patient-dashboard/common/patient-identifier/patient-identifiers.service';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import { UserService } from '../openmrs-api/user.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { ConceptResourceService } from './../openmrs-api/concept-resource.service';
import { PatientRelationshipTypeService } from '../patient-dashboard/common/patient-relationships/patient-relation-type.service';
import { PatientEducationService } from '../etl-api/patient-education.service';

const testLocations = [
  {
    name: 'Test A',
    stateProvince: 'Foo',
    uuid: 'uuid1'
  },
  {
    name: 'Test B',
    stateProvince: 'Bar',
    uuid: 'uuid2'
  },
  {
    name: 'Test Other',
    stateProvince: 'Other',
    uuid: 'uuid3'
  }
];

const testConcept = {
  answers: [
    { display: 'TEACHER', uuid: 'teacher-uuid' },
    { display: 'CASUAL WORKER', uuid: 'casual-worker-uuid' },
    { display: 'HEALTH WORKER', uuid: 'health-worker-uuid' }
  ],
  name: {
    display: 'OCCUPATION',
    uuid: 'test-occupation-concept-uuid'
  },
  uuid: 'test-uuid'
};

const testEducationLevels = [
  {
    uuid: 'a899e0ac-1350-11df-a1f1-0026b9348838',
    display: 'NONE'
  },
  {
    uuid: 'a8afe910-1350-11df-a1f1-0026b9348838',
    display: 'PRIMARY SCHOOL'
  },
  {
    uuid: 'a8afe9d8-1350-11df-a1f1-0026b9348838',
    display: 'SECONDARY SCHOOL'
  },
  {
    uuid: 'a89e4728-1350-11df-a1f1-0026b9348838',
    display: 'UNIVERSITY'
  }
];

const testIdentifierTypes = [
  { uuid: 'uuid1', name: 'A test ID' },
  { uuid: 'uuid2', name: 'A sophisticated test ID' },
  { uuid: 'uuid3', name: 'An everyday test ID' }
];

const testRelationshipTypes = [
  { uuid: 'uuid1', aIsToB: 'Parent', bIsToA: 'Child', display: 'Parent/Child' }
];

const conceptResourceServiceStub = {
  getConceptByUuid: (uuid) => of(testConcept)
};

const locationResourceServiceStub = {
  getLocations: () => of(testLocations),
  getAdministrativeUnits: () =>
    of([
      {
        value: '030',
        label: 'Baringo',
        children: [
          {
            value: 'koibatek',
            label: 'Koibatek',
            children: [
              {
                value: 'ravine',
                label: 'Ravine'
              }
            ]
          }
        ]
      }
    ]),
  getCountries: () =>
    of([
      {
        value: 'AF',
        label: 'Afghanistan'
      }
    ])
};

const patientEducationServiceStub = {
  getEducationLevels: () => testEducationLevels
};

const patientIdentifierTypeServiceStub = {
  getPatientIdentifierTypes: () => of(testIdentifierTypes),
  patientVerificationIdentifierTypeFormat: () => [
    {
      label: 'Kenya National ID Number',
      format: null,
      checkdigit: null,
      val: '58a47054-1359-11df-a1f1-0026b9348838'
    }
  ]
};

const patientRelationshipTypeServiceStub = {
  getRelationshipTypes: () => of(testRelationshipTypes)
};

const patientCreationServiceStub = {
  getpatientResults: () => of([]),
  generateIdentifier: (userId) => {
    return of({ identifier: '123456789-0' });
  },
  patientResults: () => of([]),
  searchPatient: (searchString) => of([])
};

const userServiceStub = {
  getLoggedInUser: () => {
    const openmrsModel = {
      systemId: 'test-12345'
    };
    return {
      display: 'Test User',
      openmrsModel: openmrsModel
    };
  }
};

const mockActivatedRoute = {
  queryParams: of({
    abc: 'testABC',
    patientUuid: 'uuid',
    editMode: 'true',
    identifierType: 'xxx',
    identifier: 'xxx',
    label: 'xxx'
  }),
  snapshot: {
    paramMap: convertToParamMap({
      abc: 'testABC',
      patientUuid: 'uuid',
      editMode: 'true',
      identifierType: 'xxx',
      identifier: 'xxx',
      label: 'xxx'
    })
  }
};

describe('Component: Patient Creation Unit Tests', () => {
  let component: PatientCreationComponent;
  let fixture: ComponentFixture<PatientCreationComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;
  let patientCreationResourceService: PatientCreationResourceService;
  let savePatientSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ModalModule.forRoot(),
        CacheModule.forRoot(),
        ToastrModule.forRoot(),
        FormsModule,
        DateTimePickerModule,
        HttpClientTestingModule,
        NgxPaginationModule,
        NgSelectModule
      ],
      declarations: [PatientCreationComponent],
      providers: [
        MatSnackBar,
        AppSettingsService,
        BsModalService,
        DataCacheService,
        FakeAppFeatureAnalytics,
        LocalStorageService,
        PatientCreationService,
        PatientCreationResourceService,
        PatientIdentifierTypeResService,
        PatientIdentifierService,
        PatientResourceService,
        SessionStorageService,
        { provide: AppFeatureAnalytics, useClass: FakeAppFeatureAnalytics },
        {
          provide: Router
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        {
          provide: Storage
        },
        {
          provide: ConceptResourceService,
          useValue: conceptResourceServiceStub
        },
        {
          provide: LocationResourceService,
          useValue: locationResourceServiceStub
        },
        {
          provide: PatientCreationService,
          useValue: patientCreationServiceStub
        },
        {
          provide: PatientEducationService,
          useValue: patientEducationServiceStub
        },
        {
          provide: PatientIdentifierTypeResService,
          useValue: patientIdentifierTypeServiceStub
        },
        {
          provide: PatientRelationshipTypeService,
          useValue: patientRelationshipTypeServiceStub
        },
        {
          provide: UserService,
          useValue: userServiceStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCreationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    patientCreationResourceService = TestBed.get(
      PatientCreationResourceService
    );
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('Init', () => {
    it('should instantiate the component', () => {
      TestBed.get(ActivatedRoute);
      fixture.detectChanges();
      expect(component).toBeDefined();
      expect(
        nativeElement.querySelector('.component-wrapper h2').textContent
      ).toMatch('Patient Verification');
      const formFields = nativeElement.querySelectorAll(
        '.col-md-4 .form-group'
      );
      expect(formFields.length).toEqual(7, '7 initial form fields');
      expect(formFields[0].textContent).toMatch(/First Name/);
      expect(formFields[1].textContent).toMatch(/Middle Name \(Optional\)/);
      expect(formFields[2].textContent).toMatch(/Family Name/);
      expect(formFields[3].textContent).toMatch(/Gender/);
      expect(formFields[4].textContent).toMatch(/Occupation/);
      expect(formFields[5].textContent).toMatch(/Highest Education Level/);
      expect(formFields[6].textContent).toMatch(/Age/);
    });
  });

  describe('Form actions ', () => {
    let firstNameInput: HTMLInputElement;
    let middleNameInput: HTMLInputElement;
    let familyNameInput: HTMLInputElement;
    let genderSelect: HTMLSelectElement;
    let occupationSelect: HTMLSelectElement;
    let educationLevelSelect: HTMLSelectElement;

    beforeEach(async(() => {
      fixture.detectChanges();
      firstNameInput = fixture.nativeElement.querySelector('input#givenName');
      middleNameInput = fixture.nativeElement.querySelector('input#middleName');
      familyNameInput = fixture.nativeElement.querySelector('input#familyName');
      genderSelect = fixture.nativeElement.querySelector('select#gender');
      occupationSelect = fixture.nativeElement.querySelector(
        'select#occupation'
      );
      educationLevelSelect = fixture.nativeElement.querySelector(
        'select#educationLevel'
      );

      firstNameInput.value = 'Test';
      middleNameInput.value = 'Patient';
      familyNameInput.value = 'Name';
      genderSelect.value = genderSelect.options[1].value;
      occupationSelect.value = occupationSelect.options[1].value;
      educationLevelSelect.value = educationLevelSelect.options[1].value;

      firstNameInput.dispatchEvent(new Event('input'));
      middleNameInput.dispatchEvent(new Event('input'));
      familyNameInput.dispatchEvent(new Event('input'));
      genderSelect.dispatchEvent(new Event('change'));
      occupationSelect.dispatchEvent(new Event('change'));
      educationLevelSelect.dispatchEvent(new Event('change'));
    }));

    it('should reset the demographics form fields when reset button is clicked', fakeAsync(() => {
      TestBed.get(ActivatedRoute);
      expect(component.givenName).toEqual('Test');
      expect(component.middleName).toEqual('Patient');
      expect(component.familyName).toEqual('Name');
      expect(component.gender).toEqual('M');
      expect(component.errors).toEqual(false);

      tickAndDetectChanges(fixture);

      const resetBtn: HTMLButtonElement = nativeElement.querySelector(
        'button#resetBtn'
      );
      click(resetBtn);

      expect(component.givenName).toEqual('');
      expect(component.familyName).toEqual('');
      expect(component.middleName).toEqual('');
      expect(component.gender).toEqual('');
      expect(component.birthDate).toEqual('');
      expect(component.ageEstimate).toEqual(null);
      expect(component.errors).toEqual(false);
    }));

    describe('Form actions: ', () => {
      let nextBtn: HTMLButtonElement;
      let universalIdLabel: HTMLElement;
      let identifierTypeSelect: HTMLSelectElement;
      let cancelBtn: HTMLButtonElement;
      let saveBtn: HTMLButtonElement;
      let generateUniversalIdEl: HTMLSpanElement;
      let addUniversalIdBtn: HTMLButtonElement;
      let countySelect: HTMLSelectElement;
      let subcountyInput: HTMLInputElement;

      beforeEach(() => {
        component.updateBirthDate(new Date('01-01-1991'));
        nextBtn = nativeElement.querySelector('button#nextBtn');
        click(nextBtn);
        fixture.detectChanges();

        universalIdLabel = nativeElement.querySelector('#universalId');
        identifierTypeSelect = nativeElement.querySelector(
          'select#identifierType'
        );
        cancelBtn = nativeElement.querySelector('button#cancelBtn');
        saveBtn = nativeElement.querySelector('button#saveBtn');
        generateUniversalIdEl = nativeElement.querySelector(
          'span#generateUniversalId'
        );
        addUniversalIdBtn = nativeElement.querySelector(
          'button#addUniversalId'
        );
        countySelect = nativeElement.querySelector('select#address1');
        subcountyInput = nativeElement.querySelector('input#address2');
      });

      xit('should submit the form when the save button is clicked after filling the form', fakeAsync(() => {
        savePatientSpy = spyOn(
          patientCreationResourceService,
          'savePatient'
        ).and.callFake(() => {
          return of({
            person: {
              display: '123456789-0 - Yet Another Test Patient'
            }
          });
        });

        /*
         * With demographics filled in, assert that fields from the Identifiers
         * section and the form action buttons are rendered.
         */

        expect(universalIdLabel).toBeDefined();
        expect(identifierTypeSelect).toBeDefined();
        expect(cancelBtn).toBeDefined();
        expect(saveBtn).toBeDefined();

        click(generateUniversalIdEl);
        click(addUniversalIdBtn);

        identifierTypeSelect.value = identifierTypeSelect.options[2].value;
        identifierTypeSelect.dispatchEvent(new Event('change'));

        const identifierLocationSelect: HTMLSelectElement = nativeElement.querySelector(
          'ng-select'
        );
        identifierLocationSelect.value = 'Test';
        identifierLocationSelect.dispatchEvent(new Event('input'));

        component.selectedLocation = testLocations[0].name;
        component.identifierLocation = 'uuid2';

        countySelect.value = countySelect.options[0].value;
        countySelect.dispatchEvent(new Event('change'));

        subcountyInput.value = 'Quux';
        subcountyInput.dispatchEvent(new Event('input'));

        click(saveBtn);
        tick(500);

        expect(component.errors).toBeFalsy('no errors');
        expect(component.errorAlerts.length).toEqual(0);
        expect(savePatientSpy).toHaveBeenCalledTimes(1);
        expect(savePatientSpy).toHaveBeenCalledWith(
          jasmine.objectContaining({
            person: jasmine.objectContaining({
              names: jasmine.arrayContaining([
                jasmine.objectContaining({
                  givenName: 'Test',
                  middleName: 'Patient',
                  familyName: 'Name'
                })
              ]),
              gender: 'M',
              attributes: jasmine.arrayContaining([
                {
                  value: 'casual-worker-uuid',
                  attributeType: '9e86409f-9c20-42d0-aeb3-f29a4ca0a7a0'
                }
              ]),
              addresses: jasmine.arrayContaining([
                jasmine.objectContaining({
                  address1: 'Foo', // county
                  address2: 'Quux' // subcounty
                })
              ])
            })
          })
        );
      }));
    });
  });
});
