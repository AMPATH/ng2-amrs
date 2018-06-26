import { TestBed, inject, async } from '@angular/core/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { PatientService } from '../../services/patient.service';
import { CdmSummaryHistoricalComponent } from './cdm-summary-historical.component';
import { Ng2PaginationModule } from 'ng2-pagination';
import { CdmSummaryResourceService,
} from '../../../etl-api/cdm-summary-resource.service';
import { AppSettingsService } from '../../../app-settings';

describe('Component: CdmSummaryHistorical Unit Tests', () => {

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
         AppSettingsService,
         PatientService,
         Ng2PaginationModule
      ]
    });

    component = new CdmSummaryHistoricalComponent(patientService, cdmSummaryResourceService);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });

  it('should have required properties', (done) => {
    expect(component.cdmSummaries.length).toBe(0);
    expect(component.patient).toBeUndefined();
    expect(component.patientUuid).toBeUndefined();
    expect(component.dataLoaded).toBe(false);
    expect(component.loadingCdmSummary).toBe(false);
    expect(component.errors.length).toBe(0);
    done();

  });

});
