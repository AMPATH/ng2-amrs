import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';

import { ConfirmationService } from 'primeng/primeng';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { ProgramEnrollment } from '../../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ProgramsTransferCareService } from './transfer-care.service';
import { ProgramsTransferCareFormWizardComponent } from './transfer-care-form-wizard.component';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { FormListService } from '../../common/forms/form-list.service';
import { NgamrsSharedModule } from '../../../shared/ngamrs-shared.module';
import { FormListComponent } from '../../common/forms/form-list.component';
import { ProgramService } from '../program.service';
import { PatientProgramService } from '../patient-programs.service';
import { FormsResourceService } from '../../../openmrs-api/forms-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { FormOrderMetaDataService } from '../../common/forms/form-order-metadata.service';
import { PatientProgramResourceService
} from '../../../etl-api/patient-program-resource.service';
import { ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';

class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
  public params = Observable.of([{ 'id': 1 }]);
  public queryParams = Observable.of([{ 'processId': 1 }]);
}

describe('Component: ProgramsTransferCareFormWizardComponent', () => {
  let fixture, component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramsTransferCareService,
        PatientProgramResourceService,
        PatientProgramService,
        FormsResourceService,
        LocalStorageService,
        FormOrderMetaDataService,
        ProgramService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        { provide: Router,
          useClass: MockRouter
        },
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        Location,
        EncounterResourceService,
        ConfirmationService,
        PatientService,
        FormListService,
        MockBackend,
        BaseRequestOptions,
      ],
      declarations: [ProgramsTransferCareFormWizardComponent],
      imports: [FormsModule, RouterTestingModule, NgamrsSharedModule]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ProgramsTransferCareFormWizardComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(component).toBeDefined();
  });

  it('should fetch patient encounters',
    inject([ProgramsTransferCareService, PatientService, MockBackend],
      fakeAsync((transferCareService, patientService, mockBackend) => {
        let configs = {
          '781d8768-1359-11df-a1f1-0026b9348838': {
            transferCare: {
              'AMPATH': ['cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'],
              'DISCHARGE': ['cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'],
              'NON-AMPATH': [
                'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
                '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f'
              ]
            }
          },
          'f7793d42-11ac-4cfd-9b35-e0a21a7a7c31': {
            transferCare: {
              'AMPATH': [
                'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'
              ],
              'DISCHARGE': ['cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'],
              'NON-AMPATH': [
                'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
                'f091b833-9e1a-4eef-8364-fc289095a832'
              ]
            }
          },
          '781d85b0-1359-11df-a1f1-0026b9348838': {
            transferCare: {
              'AMPATH': ['cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'],
              'DISCHARGE': ['00da8227-e7da-43c2-99b2-a4f237dd3924'],
              'NON-AMPATH': ['cbe2d31d-2201-44ce-b52e-fbd5dc7cff33']
            }
          }
        };
        spyOn(component, 'ngOnInit').and.callThrough();
        transferCareService.savePayload({transferType: 'AMPATH'});
        let uuid: string = 'uuid';
        let patientObject: Patient = new Patient({uuid: uuid, encounters: []});

        // setting currentlyLoadedPatient and currentlyLoadedPatientUuid for the first time
        patientService.currentlyLoadedPatient.next(patientObject);
        patientService.currentlyLoadedPatientUuid.next(uuid);
        let encountersResponse = {
          results: [
            {
              'uuid': '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
              'encounterDatetime': '2017-11-03T00:00:00.000+0300',
              'location': {
                'uuid': '08feb5b6-1352-11df-a1f1-0026b9348838',
                'display': 'Amukura'
              }
            }]
        };
        mockBackend.connections.subscribe((conn) => {
          if (_.includes(conn.request.url, '/etl/program-visit-configs')) {
            conn.mockRespond(new Response(new ResponseOptions({body: JSON.stringify(configs)})));
          } else {
            expect(conn.request.url)
              .toBe('https://amrsreporting.ampath.or.ke:8002/etl/patient-program-config' +
                '?patientUuid=uuid');
          }
        });
        component.ngOnInit();
      })));
});
