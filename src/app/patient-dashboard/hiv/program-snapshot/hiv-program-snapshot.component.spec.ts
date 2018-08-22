import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from '../../../app-settings';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import { Observable } from 'rxjs';
import { HivProgramSnapshotComponent } from './hiv-program-snapshot.component';
import { Http, BaseRequestOptions, ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';

const summaryResult = {
  'encounter_datetime': '2017-04-25T07:54:20.000Z',
  'location_uuid': '123',
  'rtc_date': '2017-05-22T21:00:00.000Z',
  'arv_start_date': '2017-04-24T21:00:00.000Z',
  'cur_arv_meds': 'ZIDOVUDINE AND LAMIVUDINE, LOPINAVIR AND RITONAVIR',
  'vl_1': 927,
  'is_clinical_encounter': 1,
  'vl_1_date': '2016-12-01T21:00:00.000Z',
  'encounter_type_name': 'YOUTHRETURN',
};

class FakeHivSummaryResourceService {
  constructor() {
  }

  getHivSummary(patientUuid, startIndex, size) {
    return Observable.of([summaryResult]);
  }
}

class FakeAppSettingsService {
  constructor() {
  }

  getOpenmrsServer() {
    return 'openmrs-url';
  }
}
describe('Component: HivProgramSnapshotComponent', () => {
  let hivService: HivSummaryResourceService,
    appSettingsService: AppSettingsService, component, fixture;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        ZeroVlPipe,
        BaseRequestOptions,
        {
          provide: HivSummaryResourceService,
          useClass: FakeHivSummaryResourceService
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
      declarations: [HivProgramSnapshotComponent, ZeroVlPipe],
      imports: []
    }).compileComponents().then(() => {
      hivService = TestBed.get(HivSummaryResourceService);
      appSettingsService = TestBed.get(AppSettingsService);
      fixture = TestBed.createComponent(HivProgramSnapshotComponent);
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

  it('should set patient data and location when `getHivSummary` is called',
    inject([AppSettingsService, HivSummaryResourceService, MockBackend],
      (s: AppSettingsService, hs: HivSummaryResourceService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: {results: [{uuid: '123'}]}
              }
            )));
        });
      component.getHivSummary('uuid');
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
