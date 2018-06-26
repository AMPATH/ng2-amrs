import { TestBed, inject, async } from '@angular/core/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { PatientService } from '../../services/patient.service';
import { CdmSummaryResourceService } from '../../../etl-api/cdm-summary-resource.service';
import { CdmSummaryLatestComponent } from './cdm-summary-latest.component';
import { AppSettingsService } from '../../../app-settings';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';

describe('Component: CdmSummaryLatest Unit Tests', () => {

  let component;
  let patientService: PatientService;
  let cdmSummaryResourceService: CdmSummaryResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
         AppSettingsService
      ]
    });

    component = new CdmSummaryLatestComponent(patientService, cdmSummaryResourceService);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should have all the required functions defined', (done) => {
    expect(component.getPatient).toBeDefined();
    expect(component.loadCdmSummary).toBeDefined();
    done();
  });

});
