import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of, BehaviorSubject } from 'rxjs';

import { fakeProvider, fakeUser, mockOrders, testPatient } from './patient-imaging-reports.mock';
import { PatientImagingReportsComponent } from './patient-imaging-reports.component';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { ObsResourceService } from '../../../openmrs-api/obs-resource.service';
import { OrderResourceService } from '../../../openmrs-api/order-resource.service';
import { PatientService } from '../../services/patient.service';
import { PatientProgramService } from '../../../patient-dashboard/programs/patient-programs.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { ProgramEnrollmentResourceService } from '../../../openmrs-api/program-enrollment-resource.service.ts';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';
import { ProcedureOrdersService } from './procedure-orders/procedure-orders.service';
import { ProgramService } from '../../../patient-dashboard/programs/program.service';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { SessionStorageService } from '../../../utils/session-storage.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';
import { UserService } from '../../../openmrs-api/user.service';
import { Patient } from '../../../models/patient.model';

const fakeUserLocationObject = {
  display: 'Location Test',
  uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
};

const obsResourceServiceStub = {
  getObsPatientObsByConcept: () => of([])
};

const orderResourceServiceStub = {
  getAllOrdersByPatientUuuid: (patientUuid, careSetting) => of(mockOrders)
};

const procedureOrdersServiceStub = {
  getProviderByPersonUuid: (personUuid) => of(fakeProvider)
};

const userDefaultPropertiesServiceStub = {
  getCurrentUserDefaultLocationObject: () => fakeUserLocationObject
};

const userServiceStub = {
  getLoggedInUser: () => fakeUser
};
class PatientServiceStub {
  public patient: Patient;
  public currentlyLoadedPatient: BehaviorSubject<Patient> = new BehaviorSubject(null);

  constructor(patient) {
    this.currentlyLoadedPatient.next(patient);
  }
}

describe('PatientImagingReportsComponent', () => {
  let component: PatientImagingReportsComponent;
  let fixture: ComponentFixture<PatientImagingReportsComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;
  let userDefaultPropertiesService: UserDefaultPropertiesService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        PatientImagingReportsComponent
      ],
      providers: [
        AppSettingsService,
        EncounterResourceService,
        LocalStorageService,
        ObsResourceService,
        PatientProgramService,
        PatientResourceService,
        PersonResourceService,
        ProgramResourceService,
        ProgramService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ProviderResourceService,
        RoutesProviderService,
        SessionStorageService,
        {
          provide: PatientService,
          useFactory: () => new PatientServiceStub(testPatient)
        },
        {
          provide: ObsResourceService,
          useValue: obsResourceServiceStub
        },
        {
          provide: OrderResourceService,
          useValue: orderResourceServiceStub
        },
        {
          provide: ProcedureOrdersService,
          useValue: procedureOrdersServiceStub
        },
        {
          provide: UserService,
          useValue: userServiceStub
        },
        {
          provide: UserDefaultPropertiesService,
          useValue: userDefaultPropertiesServiceStub
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientImagingReportsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    userDefaultPropertiesService = TestBed.get(UserDefaultPropertiesService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have all of its methods defined', () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.getCurrentlyLoadedPatient).toBeDefined();
    expect(component.resolveUserLocation).toBeDefined();
    expect(component.getOrders).toBeDefined();
    expect(component.getProvider).toBeDefined();
    expect(component.getPatientObs).toBeDefined();
    expect(component.onTabChanged).toBeDefined();
  });

  it('should fetch the currently loaded patient and populate shared data on init', async(() => {
    fixture.detectChanges();
    expect(component.caresetting).toBe(mockOrders.results[0].encounter.orders[0].careSetting.uuid);
    expect(component.sharedData.patient).toBe(testPatient.uuid);
    expect(component.patientObs).not.toBeDefined();
    expect(component.sharedData).toEqual(jasmine.objectContaining({
      caresetting: mockOrders.results[0].encounter.orders[0].careSetting.uuid,
      location: '',
      orders: mockOrders.results,
      patient: testPatient.uuid,
      provider: undefined
    }));
  }));

  it('should resolve the user\'s current location', () => {
    fixture.detectChanges();
    expect(component.location).not.toBeDefined();
    expect(component.selectedLocation).not.toBeDefined();
    expect(component.sharedData.location).toBe('');
    const locationSpy = spyOn(userDefaultPropertiesService, 'getCurrentUserDefaultLocationObject').and.callThrough();
    component.resolveUserLocation();
    fixture.detectChanges();
    expect(locationSpy).toHaveBeenCalledTimes(1);
    expect(component.location).toBe(fakeUserLocationObject.display);
    expect(component.selectedLocation).toBe(fakeUserLocationObject.uuid);
  });
});
