
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { OrderResourceService } from '../../openmrs-api/order-resource.service';
import { LabTestOrdersComponent } from './lab-test-orders.component';
import { PatientService } from '../patient.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';

describe('Component: Lab Test Orders Unit Tests', () => {

  let orderResourceService: OrderResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        FakeAppFeatureAnalytics,
        LabTestOrdersComponent,
        PatientService,
        EncounterResourceService,
        ProgramEnrollmentResourceService,
        PatientResourceService,
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
          provide: OrderResourceService,
        },
        AppSettingsService,
        LocalStorageService
      ]
    });

    orderResourceService = TestBed.get(OrderResourceService);
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = TestBed.get(LabTestOrdersComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });

  it('should have required properties', (done) => {
    expect(component.labOrders.length).toBe(0);
    done();

  });
  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'getPatientLabOrders').and.callFake((err, data) => { });
    component.getPatientLabOrders('report', 'uuid', (err, data) => { });
    expect(component.getPatientLabOrders).toHaveBeenCalled();
    spyOn(component, 'getCurrentlyLoadedPatient').and.callFake((err, data) => { });
    component.getCurrentlyLoadedPatient((err, data) => { });
    expect(component.getCurrentlyLoadedPatient).toHaveBeenCalled();


    done();

  });

});
