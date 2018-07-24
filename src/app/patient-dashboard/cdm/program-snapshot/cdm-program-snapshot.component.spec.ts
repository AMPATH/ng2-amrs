import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from '../../../app-settings';
import { CdmSummaryResourceService } from '../../../etl-api/cdm-summary-resource.service';
import { Observable } from 'rxjs';
import { CdmProgramSnapshotComponent } from './cdm-program-snapshot.component';
import { Http, BaseRequestOptions, ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';

const summaryResult = {
  'encounter_datetime': '2017-04-25T07:54:20.000Z',
  'location_uuid': '123',
  'rtc_date': '2017-05-22T21:00:00.000Z',
  'is_clinical_encounter': 1,
  'sbp': 108,
  'dbp': 69,
  'rbs': 7,
  'hb_a1c': 'value',
  'hb_a1c_date': '2017-04-25T07:54:20.000Z',
  'dm_status': 'value',
  'htn_status': 'value',
  'dm_meds': 'value',
  'htn_med': 'value',
};

class FakeCdmSummaryResourceService {
  constructor() {
  }

  public getCdmSummary(patientUuid, startIndex, size) {
    return Observable.of([summaryResult]);
  }
}

class FakeAppSettingsService {
  constructor() {
  }

  public getOpenmrsServer() {
    return 'openmrs-url';
  }
}
describe('Component: CdmProgramSnapshotComponent', () => {
  let hivService: CdmSummaryResourceService,
    appSettingsService: AppSettingsService, component, fixture;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        ZeroVlPipe,
        BaseRequestOptions,
        {
          provide: CdmSummaryResourceService,
          useClass: FakeCdmSummaryResourceService
        },
        {
          provide: AppSettingsService,
          useClass: FakeAppSettingsService
        },
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      declarations: [CdmProgramSnapshotComponent, ZeroVlPipe],
      imports: []
    }).compileComponents().then(() => {
      hivService = TestBed.get(CdmSummaryResourceService);
      appSettingsService = TestBed.get(AppSettingsService);
      fixture = TestBed.createComponent(CdmProgramSnapshotComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create an instance', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should have required properties', (done) => {
    expect(component.hasError).toEqual(false);
    expect(component.hasData).toEqual(false);
    expect(component.patientData).toEqual({});
    expect(component.location).toEqual({});
    done();

  });

  it('should set patient data and location when `getCdmSummary` is called',
    inject([AppSettingsService, CdmSummaryResourceService, MockBackend],
      (s: AppSettingsService, hs: CdmSummaryResourceService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: {results: [{uuid: '123'}]}
              }
            )));
        });
        component.getCdmSummary('uuid');
        expect(component.patientData).toEqual(summaryResult);
        expect(component.location).toEqual({uuid: '123'});
    })
  );

  it('should return a list locations',
    inject([AppSettingsService, MockBackend],
      (s: AppSettingsService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toEqual('openmrs-url/ws/rest/v1/location?v=default');
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: {results: [{uuid: '123'}]}
              }
            )));
        });
        component.getLocation().subscribe((result) => {
          expect(result).toBeDefined();
          expect(result).toEqual([{uuid: '123'}]);
        });
      })
  );
});
