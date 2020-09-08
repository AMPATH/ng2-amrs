import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { OrderResourceService } from '../../../openmrs-api/order-resource.service';
import { LabTestOrdersComponent } from './lab-test-orders.component';
import { PatientService } from '../../services/patient.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { ProgramEnrollmentResourceService } from '../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { LabelService } from './labels/label-service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';

import { ObsResourceService } from '../../../openmrs-api/obs-resource.service';
import { ClinicLabOrdersResourceService } from '../../../etl-api/clinic-lab-orders-resource.service';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Component: Lab Test Orders Unit Tests', () => {
  let orderResourceService: OrderResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics,
    component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FakeAppFeatureAnalytics,
        LabTestOrdersComponent,
        PatientService,
        PatientProgramService,
        ProgramResourceService,
        EncounterResourceService,
        RoutesProviderService,
        ProgramService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        PatientResourceService,
        ClinicLabOrdersResourceService,
        LocalStorageService,
        DataCacheService,
        CacheService,
        ObsResourceService,
        LabelService,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: OrderResourceService
        },
        AppSettingsService
      ],
      imports: [HttpClientTestingModule]
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
    spyOn(component, 'getPatientLabOrders').and.callFake((err, data) => {});
    component.getPatientLabOrders('report', 'uuid', (err, data) => {});
    expect(component.getPatientLabOrders).toHaveBeenCalled();
    spyOn(
      component,
      'getCurrentlyLoadedPatient'
    ).and.callFake((err, data) => {});
    component.getCurrentlyLoadedPatient((err, data) => {});
    expect(component.getCurrentlyLoadedPatient).toHaveBeenCalled();

    done();
  });
});
