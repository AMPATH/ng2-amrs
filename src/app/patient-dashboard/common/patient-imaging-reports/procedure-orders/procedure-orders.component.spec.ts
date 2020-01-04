import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { By } from '@angular/platform-browser';

import { ModalModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';

import { of, BehaviorSubject } from 'rxjs';

import { Patient } from '../../../../models/patient.model';
import { mockConcept, mockOrders, mockOrderResourceServiceResponse, testPatient } from './procedure-orders.mock';
import { ProceduresFilterPipe } from './procedures-filter.pipe';
import { SecurePipe } from '../../../../patient-dashboard/common/locator-map/secure.pipe';
import { ProcedureOrdersComponent } from './procedure-orders.component';
import { ProcedureOrdersService } from './procedure-orders.service';
import { AppSettingsService } from '../../../../app-settings/app-settings.service';
import { FileUploadResourceService } from '../../../../etl-api/file-upload-resource.service';
import { LocalStorageService } from '../../../../utils/local-storage.service';
import { PatientService } from '../../../../patient-dashboard/services/patient.service';
import { PatientResourceService } from '../../../../openmrs-api/patient-resource.service';
import { PatientProgramService } from 'src/app/patient-dashboard/programs/patient-programs.service';
import { RoutesProviderService } from 'src/app/shared/dynamic-route/route-config-provider.service';
import { ProgramService } from 'src/app/patient-dashboard/programs/program.service';
import { ProgramEnrollmentResourceService } from 'src/app/openmrs-api/program-enrollment-resource.service';
import { ProgramWorkFlowResourceService } from 'src/app/openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from 'src/app/openmrs-api/program-workflow-state-resource.service';
import { ProgramResourceService } from 'src/app/openmrs-api/program-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { UserService } from 'src/app/openmrs-api/user.service';
import { SessionStorageService } from 'src/app/utils/session-storage.service';
import { FeedBackService } from 'src/app/feedback/feedback.service';
import { UserDefaultPropertiesService } from 'src/app/user-default-properties';
import { OrderResourceService } from 'src/app/openmrs-api/order-resource.service';
import { ProviderResourceService } from 'src/app/openmrs-api/provider-resource.service';
import { PersonResourceService } from 'src/app/openmrs-api/person-resource.service';
import { ConceptResourceService } from 'src/app/openmrs-api/concept-resource.service';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';

const locale = 'en-US';

const fakeUser = {
  display: 'Test User',
  personUuid: '57b90158-4b97-4893-8cd0-d6c38f94e241'
};

const fakeLocation = {
  display: 'Location Test',
  uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
};

const fakeEncounter = {
  display: 'LABORDERENCOUNTER 14/11/2019',
  encounterDatetime: '2019-11-14T11:31:28.000+0300',
  encounterProviders: [
    {
      encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66',
      provider: '91ccd8f1674c-55c8-0e04-4b2d-87ff04e1'
    }
  ],
  encounterType: {
    uuid: '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
    display: 'LABORDERENCOUNTER'
  },
  form: null,
  location: {
    uuid: '18c343eb-b353-462a-9139-b16606e6b6c2',
    display: 'Location Test'
  },
  obs: [],
  orders: [],
  patient: {
    uuid: '767ba950-4822-4883-8f96-7be6c14ebbe0',
    display: '749138740-8 - Test Male Enrollment'
  },
  resourceVersion: '1.9',
  uuid: '901bdf62-34bd-43fe-aae8-6a51845e740d',
  visit: null,
  voided: false
};

const fakeEncounterPayload = {
  encounterType: '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
  location: '18c343eb-b353-462a-9139-b16606e6b6c2',
  patient: '767ba950-4822-4883-8f96-7be6c14ebbe0',
  encounterProviders: [
    {
      encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66',
      provider: '91ccd8f1674c-55c8-0e04-4b2d-87ff04e1'
    }
  ]
};

const fakeProcedureOrderPayload = {
  careSetting: '6f0c9a92-6f24-11e3-af88-005056821db0',
  concept: 'a899e7b4-1350-11df-a1f1-0026b9348838',
  encounter: '901bdf62-34bd-43fe-aae8-6a51845e740d',
  orderer: '91ccd8f1674c-55c8-0e04-4b2d-87ff04e1',
  patient: '767ba950-4822-4883-8f96-7be6c14ebbe0',
  type: 'testorder'
};

const fileUploadResourceServiceStub = {
  getUrl: () => 'url',
  upload: (formData) => of([]),
  getFile: (url: string, fileType?: string) => of([])
};

const conceptResourceServiceStub = {
  getConceptByUuid: () => of(mockConcept)
};

const obsResourceServiceStub = {
  getObsPatientObsByConcept: (patientUuid, conceptUuid) => of({ results: [] })
};

const userDefaultPropertiesServiceStub = {
  getCurrentUserDefaultLocationObject: () => fakeLocation
};

const userServiceStub = {
  getLoggedInUser: () => fakeUser
};

const encounterResourceServiceStub = {
  saveEncounter: (encounterPayload) => of(fakeEncounter)
};

const orderResourceServiceStub = {
  saveProcedureOrder: (procedureOrderPayload) => of(mockOrderResourceServiceResponse)
};

class PatientServiceStub {
  public patient: Patient;
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(null);

  constructor(patient) {
    this.currentlyLoadedPatient.next(patient);
  }
}

class ProcedureOrdersServiceStub {
  public fakeMappedProvider = {
    label: '123456-7 - Test User',
    value: '142e49f83c6d-0dc8-3984-79b4-85109b75',
    providerUuid: '91ccd8f1674c-55c8-0e04-4b2d-87ff04e1'
  };

  public getUrl() { return 'url'; }

  public getProviderByPersonUuid(uuid) {
    return of(this.fakeMappedProvider);
  }

  public getAllConcepts(cached: boolean = false, v: string = null) {
    return of([]);
  }

  public determineIfUserHasVoidingPrivileges() {
    return false;
  }
}

describe('ProcedureOrdersComponent ', () => {
  let component: ProcedureOrdersComponent;
  let fixture: ComponentFixture<ProcedureOrdersComponent>;
  let procedureOrdersService: ProcedureOrdersService;
  let encounterResourceService: EncounterResourceService;
  let orderResourceService: OrderResourceService;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        HttpClientTestingModule,
        NgxPaginationModule
      ],
      declarations: [
        ProceduresFilterPipe,
        ProcedureOrdersComponent,
        SecurePipe
      ],
      providers: [
        AppSettingsService,
        FeedBackService,
        LocalStorageService,
        PatientProgramService,
        PatientResourceService,
        PersonResourceService,
        ProgramEnrollmentResourceService,
        ProgramService,
        ProgramResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ProviderResourceService,
        RoutesProviderService,
        SessionStorageService,
        UserService,
        {
          provide: ConceptResourceService,
          useValue: conceptResourceServiceStub
        },
        {
          provide: EncounterResourceService,
          useValue: encounterResourceServiceStub
        },
        {
          provide: FileUploadResourceService,
          useValue: fileUploadResourceServiceStub
        },
        {
          provide: ObsResourceService,
          useValue: obsResourceServiceStub,
        },
        {
          provide: OrderResourceService,
          useValue: orderResourceServiceStub
        },
        {
          provide: PatientService,
          useFactory: () => new PatientServiceStub(testPatient)
        },
        {
          provide: ProcedureOrdersService,
          useClass: ProcedureOrdersServiceStub
        },
        {
          provide: UserDefaultPropertiesService,
          useValue: userDefaultPropertiesServiceStub
        },
        {
          provide: UserService,
          useValue: userServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedureOrdersComponent);
    component = fixture.componentInstance;
    procedureOrdersService = TestBed.get(ProcedureOrdersService);
    encounterResourceService = TestBed.get(EncounterResourceService);
    orderResourceService = TestBed.get(OrderResourceService);
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;

    component.sentData = {
      orders: mockOrders
    };

    component.procedures = mockConcept.setMembers;

    component.orderResultsConcept = {
      results: 'c0f0477f-0552-42e2-862f-cf924d4e21e7',
      name: 'radiology',
      icon: 'icon-i-cath-lab',
      imageConcept: 'bce26e1c-c65e-443a-b65f-118f699e1bd0',
      report: 'Radiology Reports',
      list: '759a4bd6-79ab-40a9-9836-1e30783f7ae5'
    };

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should have all of its methods defined', () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.ngOnDestroy).toBeDefined();
    expect(component.setProcedures).toBeDefined();
    expect(component.getCurrentlyLoadedPatient).toBeDefined();
    expect(component.setUserLocation).toBeDefined();
    expect(component.setProvider).toBeDefined();
    expect(component._ngDoCheck).toBeDefined();
    expect(component.getProcedureOrders).toBeDefined();
    expect(component.assignOrdersResultsObs).toBeDefined();
    expect(component.getPatientObs).toBeDefined();
    expect(component.onOrderStatusChange).toBeDefined();
    expect(component.getConcept).toBeDefined();
    expect(component.sort).toBeDefined();
    expect(component.addProcedure).toBeDefined();
    expect(component.dismissDialog).toBeDefined();
    expect(component.saveOrder).toBeDefined();
    expect(component.createPayload).toBeDefined();
    expect(component.checkResults).toBeDefined();
    expect(component.searchObs).toBeDefined();
    expect(component.checkValue).toBeDefined();
    expect(component.assignValue).toBeDefined();
    expect(component.showResults).toBeDefined();
    expect(component.saveProcedureOrder).toBeDefined();
    expect(component.uploadFile).toBeDefined();
    expect(component.changeResults).toBeDefined();
    expect(component.approveEdit).toBeDefined();
    expect(component.onFileChangeResults).toBeDefined();
    expect(component.showOrder).toBeDefined();
    expect(component.defaultView).toBeDefined();
    expect(component.discard).toBeDefined();
    expect(component.deleteResult).toBeDefined();
    expect(component.discardOrder).toBeDefined();
    expect(component.sendFeedBack).toBeDefined();
    expect(component.enterResults).toBeDefined();
    expect(component.onFileChange).toBeDefined();
    expect(component.determineObsPayload).toBeDefined();
    expect(component.saveObs).toBeDefined();
  });

  it('should fetch procedures on init', async(() => {
    fixture.detectChanges();
    expect(component.procedures).toBeDefined();
    expect(component.procedures).toEqual(mockConcept.setMembers);
    expect(component.procedureOrders).toBeDefined();
    expect(component.procedureOrders).toEqual([mockOrders[0]]);
    expect(
      document.querySelector('[data-testid="report title"]').textContent
    ).toContain(component.orderResultsConcept.report);
    expect(
      document.querySelector('[data-testid="report table header"]').textContent
    ).toContain(titleCase(component.orderResultsConcept.name) + ' report');
    expect(
      document.querySelector('[data-testid="activation date"]').textContent
    ).toContain(formatDate(mockOrders[0].dateActivated, 'dd/MM/yyyy', locale));
    expect(
      document.querySelector('[data-testid="order info"]').textContent
    ).toContain(mockOrders[0].concept.display);
    expect(
      document.querySelector('[data-testid="order info"]').textContent
    ).toContain('Order Number: ' + mockOrders[0].orderNumber);
    expect(
      document.querySelector('[data-testid="order info"]').textContent
    ).toContain('Ordered By: ' + mockOrders[0].orderer.display);
    expect(
      document.querySelector('[data-testid="date received"]').textContent
    ).toContain('No results');
    expect(
      document.querySelector('[data-testid="enter results"]').textContent
    ).toContain('Enter Results');
    expect(
      document.querySelector('[data-testid="show orders"]').textContent
    ).toContain('View');
    expect(
      document.querySelector('[data-testid="order procedure"]').textContent
    ).toContain('Order new radiology report');
  }));

  it('should open a detail view when the view button on a report is clicked', async(() => {
    fixture.detectChanges();
    expect(component.showDetails).toBeFalsy();
    // navigate to detail view by clicking View button
    const showOrdersBtn = debugElement.query(By.css('#show-orders'));
    click(showOrdersBtn);
    fixture.detectChanges();
    expect(component.showDetails).toBe(true);
    expect(component.resultView).toBe(true);
    expect(component.voidOrderButton).toBe(true);
    expect(component.viewResults).toBe(titleCase(component.orderResultsConcept.name) + ' order: ' + mockOrders[0].orderNumber);
    expect(component.selectedProc).toBe(mockOrders[0]);
    expect(
      document.querySelector('[data-testid="report header"]').textContent
    ).toBe(titleCase(component.orderResultsConcept.name) + ' order: ' + mockOrders[0].orderNumber);
    expect(
      document.querySelector('[data-testid="procedure type"]').textContent
    ).toBe(mockOrders[0].display);
    expect(
      document.querySelector('[data-testid="orderer"]').textContent
    ).toContain(mockOrders[0].orderer.display);
    expect(
      document.querySelector('[data-testid="date of activation"]').textContent
    ).toContain(formatDate(mockOrders[0].dateActivated, 'dd/MM/yyyy', locale));
    expect(
      document.querySelector('[data-testid="results available"]').textContent
    ).toBe('NO');
    expect(
      document.querySelector('[data-testid="void order"]').textContent
    ).toBe('Void Order');
    expect(
      document.querySelector('[data-testid="back button"]').textContent
    ).toContain('Back');
    // click void order button
    const voidOrderBtn = debugElement.query(By.css('#void-order'));
    click(voidOrderBtn);
    fixture.detectChanges();
    expect(
      document.querySelector('[data-testid="requires privileges"]').textContent
    ).toBe('Your Account lacks the required privileges. Do you wish to report this to the Administrator?');
    // navigate back to the detail view by clicking back button
    const backBtn = debugElement.query(By.css('.back-btn'));
    click(backBtn);
    fixture.detectChanges();
    // navigate back to the master view by clicking back button
    click(backBtn);
    fixture.detectChanges();
    expect(component.resultsDisplay).toBe(false);
    expect(component.proceduresOrdered).toBe(true);
    expect(component.addOrders).toBe(false);
    expect(component.imageReportFindings).toBe('');
    expect(component.enterReportResults).toBe(false);
    expect(component.displayResultsChange).toBe(false);
  }));

  it('should allow you to order a new procedure', () => {
    fixture.detectChanges();
    const newOrderBtn = debugElement.query(By.css('#order-procedure'));
    click(newOrderBtn);
    fixture.detectChanges();
    expect(
      document.querySelector('[data-testid="report type"]').textContent
    ).toBe('Radiology report type');

    const selectProcedureTypes = debugElement.query(By.css('#select-report-type'));
    click(selectProcedureTypes);
    fixture.detectChanges();
    expect(
      document.querySelector('#select-report-type').textContent
    ).toContain(mockConcept.setMembers[0].display);

    const submitOrderBtn = debugElement.query(By.css('#submit-order'));
    const createPayloadSpy = spyOn(component, 'createPayload').and.callThrough();
    const saveEncounterSpy = spyOn(encounterResourceService, 'saveEncounter').and.callThrough();
    const saveProcedureOrderSpy = spyOn(orderResourceService, 'saveProcedureOrder').and.callThrough();

    click(submitOrderBtn);
    fixture.detectChanges();
    expect(createPayloadSpy).toHaveBeenCalledTimes(1);
    expect(saveEncounterSpy).toHaveBeenCalledTimes(1);
    expect(saveEncounterSpy).toHaveBeenCalledWith(fakeEncounterPayload);
    expect(saveProcedureOrderSpy).toHaveBeenCalledTimes(1);
    expect(saveProcedureOrderSpy).toHaveBeenCalledWith(fakeProcedureOrderPayload);

    expect(component.submittedProcedureOrder).toBe(mockOrderResourceServiceResponse);
    expect(component.message).toBe('Order successfully created');
    expect(component.display).toBe(false);
    expect(component.newProcedure).toBe(false);

    expect(
      document.querySelector('[data-testid="message"]').textContent
    ).toContain('Order successfully created');
  });
});

// Helpers
function newEvent(eventName: string, bubbles = false, cancelable = false) {
  const evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
  evt.initCustomEvent(eventName, bubbles, cancelable, null);
  return evt;
}

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

function titleCase(word: string) {
  const result = word.replace(/\w\S*/g, (str) => {
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  });
  return result;
}
