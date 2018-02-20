import { OrderByEncounterTimeAscPipe } from './orderByEncounterTime.pipe';
import { VisitEncountersListComponent } from './visit-encounters-list.component';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { FakeAppSettingsService } from '../../../etl-api/moh-731-patientlist-resource.service.spec';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { PatientEncounterObservationsComponent } from
  '../patient-encounters/patient-encounter-observations.component';
import { VisitEncountersPipe } from './visit-encounters.pipe';
import { EncounterTypeFilter } from
  '../patient-encounters/encounter-list.component.filterByEncounterType.pipe';
import { Ng2PaginationModule } from 'ng2-pagination';
import { OrderByAlphabetPipe } from './visit-encounter.component.order.pipe';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';
import { PatientEncounterService } from '../patient-encounters/patient-encounters.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import { PatientService } from '../../services/patient.service';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Directive, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppSettingsService } from '../../../app-settings';

import {
  ProgramEnrollmentResourceService
}
  from '../../../openmrs-api/program-enrollment-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { ProgramService } from '../../programs/program.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { Subject } from 'rxjs/Subject';

class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  public params = Observable.of([{ 'id': 1 }]);
}

class FakePatientProgramService {
  public getCurrentlyEnrolledPatientPrograms(uuid): Observable<any> {
    return Observable.create((observer: Subject<any[]>) => {
      observer.next([{
        program: {uuid: '123'},
        enrolledProgram: {programUuid: '123', uuid: '12345'},
        programUuid: '12345',
        isFocused: false,
        dateEnrolled: null,
        dateCompleted: null,
        validationError: '',
        buttons: {
          link: {
            display: 'Go to program',
            url: '/patient-dashboard/patient/uuid/test/landing-page'
          },
          enroll: {
            display: 'Enroll patient'
          },
          edit: {
            display: 'Edit Enrollment',
          }
        },
        isEnrolled: false
      }]);
    }).first();
  }
}

let mockEncounterResponse = [{
  'uuid': 'uuid',
  'encounterDatetime': '2016-01-24T16:00:00.000+0300',
  'patient': {
    'uuid': '8ac34c4b-8c57-4c83-886d-930e0d6c2d80'
  },
  'form': {
    'uuid': '869c9f7d-1b47-4448-8f6d-3ff46458173e',
    'name': 'CDM Hypertension and Diabetes Initial Visit Form v1.1'
  },
  'visit': {
    'uuid': 'bbacffb1-e607-43bc-85ec-5dae2fea3a96',
    'display': 'RETURN HIV CLINIC VISIT @ Location-195 - 09/08/2016 11:03',
    'auditInfo': {
      'creator': {
        'uuid': 'db99b4fc-833d-4857-91d3-3f4736b46b50',
        'display': 'username-165060',
        'links': [
          {
            'rel': 'self',
            'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/user/uuid'
          }
        ]
      },
      'dateCreated': '2016-08-09T11:05:15.000+0300',
      'changedBy': 'mzito',
      'dateChanged': '2016-08-09T11:05:15.000+0300'
    },
    'startDatetime': '2016-08-09T11:03:54.000+0300',
    'stopDatetime': null,
    'location': {
      'uuid': '18c343eb-b353-462a-9139-b16606e6b6c2',
      'display': 'Location-195'
    },
    'visitType': {
      'uuid': 'd4ac2aa5-2899-42fb-b08a-d40161815b48',
      'name': 'RETURN HIV CLINIC VISIT'
    }
  },
  'location': {
    'uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
    'display': 'Location-1',
    'links': [{
      'rel': 'self',
      'uri': 'https://amrs.ampath.or.ke:8443/amrs/uuid'
    }]
  },
  'encounterType': {
    'uuid': '9af62145-1114-4711-a2b4-1c23ae69eb46',
    'display': 'HTNDMINITIAL',
    'links': [{
      'rel': 'self',
      'uri': 'https://encountertype/uuid'
    }]
  },
  'encounterProviders': [
    {
    'provider': {
    'uuid': '4d25650a-5347-4047-8efa-c7030c4f6d35',
    'display': '1234-45-Mzito Provider'
    }
  }]
}];

let encounterObj = {
  'type': 'encounter',
  'date': '16:00',
  'encounterDatetime': '2016-01-24T16:00:00.000+0300',
  'time': '',
  'form': 'CDM Hypertension and Diabetes Initial Visit Form v1.1',
  'encounterType': 'HTNDMINITIAL',
  'location': '',
  'provider': 'Mzito',
  'visit': '',
  'encounter': 'HTNDMINITIAL',
  'action': '',
  'encounterObj': mockEncounterResponse
};

let visitEncounterGrouping = [{
  'type': 'parent',
  'date': '2016-01-24',
  'time': '',
  'form': '',
  'encounterType': '',
  'location': 'Location-1',
  'provider': 'username-165060',
  'visit': 'RETURN HIV CLINIC  VISIT',
  'encounter': '',
  'action': '',
  'encounterObj': '',
  'encounters': [{
    'type': 'encounter',
    'date': '16:00',
    'encounterDatetime': '2016-01-24T16:00:00.000+0300',
    'time': '',
    'form': 'CDM Hypertension and Diabetes Initial Visit Form v1.1',
    'encounterType': 'HTNDMINITIAL',
    'location': '',
    'provider': 'Mzito Provider',
    'visit': '',
    'encounter': 'HTNDMINITIAL',
    'action': '',
    'encounterObj': {
      'uuid': 'uuid',
      'encounterDatetime': '2016-01-24T16:00:00.000+0300',
      'patient': {
        'uuid': '8ac34c4b-8c57-4c83-886d-930e0d6c2d80'
      },
      'form': {
        'uuid': '869c9f7d-1b47-4448-8f6d-3ff46458173e',
        'name': 'CDM Hypertension and Diabetes Initial Visit Form v1.1'
      },
      'visit': {
        'uuid': 'bbacffb1-e607-43bc-85ec-5dae2fea3a96',
        'display': 'RETURN HIV CLINIC VISIT @ Location-195 - 09/08/2016 11:03',
        'auditInfo': {
          'creator': {
            'uuid': 'db99b4fc-833d-4857-91d3-3f4736b46b50',
            'display': 'username-165060',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/user/uuid'
              }
            ]
          },
          'dateCreated': '2016-08-09T11:05:15.000+0300',
          'changedBy': 'mzito',
          'dateChanged': '2016-08-09T11:05:15.000+0300'
        },
        'startDatetime': '2016-08-09T11:03:54.000+0300',
        'stopDatetime': null,
        'location': {
          'uuid': '18c343eb-b353-462a-9139-b16606e6b6c2',
          'display': 'Location-195'
        },
        'visitType': {
          'uuid': 'd4ac2aa5-2899-42fb-b08a-d40161815b48',
          'name': 'RETURN HIV CLINIC VISIT'
        }
      },
      'location': {
        'uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
        'display': 'Location-1',
        'links': [{
          'rel': 'self',
          'uri': 'https://amrs.ampath.or.ke:8443/amrs/uuid'
        }
        ]
      },
      'encounterType': {
        'uuid': '9af62145-1114-4711-a2b4-1c23ae69eb46',
        'display': 'HTNDMINITIAL',
        'links': [
          {
            'rel': 'self',
            'uri': 'https://encountertype/uuid'
          }
        ]
      }
      ]
  }];

describe('Component : Visit-Encounters', () => {
  let comp: VisitEncountersListComponent;
  let fixture: ComponentFixture<VisitEncountersListComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let nativeElement: any;

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        FormsModule,
        Ng2PaginationModule,
        ModalModule.forRoot()
      ],
      declarations: [VisitEncountersListComponent,
        OrderByAlphabetPipe,
        VisitEncountersPipe,
        OrderByEncounterTimeAscPipe,
        PatientEncounterObservationsComponent,
        EncounterTypeFilter,
        ModalComponent], // declare the test component
      providers: [
        PatientService,
        {
          provide: PatientProgramService, useFactory: () => {
          return new FakePatientProgramService();
        }
        },
        ProgramService,
        RoutesProviderService,
        ProgramResourceService,
        PatientEncounterService,
        EncounterResourceService,
        VisitResourceService,
        PatientResourceService,
        MockBackend,
        BaseRequestOptions,
        FakeAppSettingsService,
        LocalStorageService,
        AppSettingsService,
        ProgramEnrollmentResourceService,
        MockRouter,
        MockActivatedRoute,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {provide: Router, useClass: MockRouter}, {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
      ]
    })
      .compileComponents();  // compile template and css
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(VisitEncountersListComponent);
    comp = fixture.componentInstance;
    nativeElement = fixture.nativeElement;

    // Service from the root injector
    let patient = fixture.debugElement.injector.get(PatientService);
    let patientEncounterService = fixture.debugElement.injector.get(PatientEncounterService);
    let encounterResourceService = fixture.debugElement.injector.get(EncounterResourceService);
    let visitResourceService = fixture.debugElement.injector.get(VisitResourceService);
    let route = fixture.debugElement.injector.get(MockRouter);
    let activatedRoute = fixture.debugElement.injector.get(MockActivatedRoute);

  });

  it('Should be create an instance of the component', async(() => {
    expect(comp).toBeTruthy();
  }));

  it('Should have a title', async(() => {
    fixture.detectChanges();
    expect(comp.title).toBe('Patient Visits');
  }));
  it('should render encounter types in desc order',
    async(() => {
      comp.encounterTypesArray = ['ECSTABLE', 'ADULTRETURN', 'DEATHREPORT'];
      comp.sortPatientEncounterTypes();
      fixture.detectChanges();

      let result = ['ADULTRETURN', 'DEATHREPORT', 'ECSTABLE'];
      expect(comp.encounterTypesArray).toEqual(result);
    }));
  it('should generate a new visits array based on encounters',
    async(() => {
      let encounterObs = Observable.of(mockEncounterResponse);

      encounterObs.subscribe((res) => {
        comp.groupEncountersByVisits(res);
      });
      fixture.detectChanges();

      let mainArray = comp.mainArray;

      expect(mainArray[0].encounters.length).toBeGreaterThan(0);

    }));

  it('remove filter function should remove items from filter', async(() => {

    comp.encounterFilterTypeArray = ['ADULTRETURN', 'DEATHREPORT', 'ECSTABLE'];

    comp.removeFilterItem(0);

    fixture.detectChanges();

    let filteredArray = ['DEATHREPORT', 'ECSTABLE'];

    expect(comp.encounterFilterTypeArray).toEqual(filteredArray);
  }));

  it('Add encounters to filter array', async(() => {

    comp.encounterFilterTypeArray = ['ADULTRETURN', 'DEATHREPORT', 'ECSTABLE'];

    let selectedEncounterType = 'HIVRETURN';

    comp.onEncounterTypeChange(selectedEncounterType);

    fixture.detectChanges();

    let filteredArray = ['ADULTRETURN', 'DEATHREPORT', 'ECSTABLE', selectedEncounterType];

    expect(comp.encounterFilterTypeArray).toEqual(filteredArray);

  }));
});
