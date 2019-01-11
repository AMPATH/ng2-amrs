import { async, TestBed } from '@angular/core/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { ProgramWorkFlowResourceService } from './program-workflow-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

xdescribe('Service: ProgramWorkFlowResourceService', () => {
  let service: ProgramWorkFlowResourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramWorkFlowResourceService,
        AppSettingsService,
        LocalStorageService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.get(ProgramWorkFlowResourceService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  const programWorkFlowResponse = {
    results: [
      {
        'uuid': 'fc15ac01-5381-4854-bf5e-917c907aa77f',
        'display': 'CDM',
        'allWorkflows': [
          {
            'uuid': '2f37c1c4-4461-41fa-b737-1768e668164c',
            'concept': {
              'uuid': 'a893436e-1350-11df-a1f1-0026b9348838',
              'display': 'DIABETES MELLITUS'
            }
          },
          {
            'uuid': '9ed17a8d-d26b-426a-8ff8-1cf39d2d2b76',
            'concept': {
              'uuid': 'a8986880-1350-11df-a1f1-0026b9348838',
              'display': 'HYPERTENSION'
            }
          }
        ],
      }]
  };

  it('should be defined', async(() => {
    expect(service).toBeDefined();
  }));

  it('should haave getUrl defined', () => {
    expect(service.getUrl()).toBeTruthy();
  });

  it('should return null when programUuid not specified', async(() => {

    httpMock.expectNone({});

    const result = service.getProgramWorkFlows(null);

    expect(result).toBeNull();
  }));

  it('should call the right endpoint', async(() => {
    const programUuid = 'uuid';

    service.getProgramWorkFlows(programUuid).subscribe();

    const req = httpMock.expectOne(service.getUrl() + '/' + programUuid +
      '?v=custom:(uuid,display,allWorkflows:(uuid,retired,concept:(uuid,display)' +
      ',states:(uuid,initial,terminal,concept:(uuid,display))))');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams)
      .toBe('https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/program/uuid?v=' +
        'custom:(uuid,display,allWorkflows:(uuid,retired,concept:(uuid,display),' +
        'states:(uuid,initial,terminal,concept:(uuid,display))))');
    req.flush(JSON.stringify(programWorkFlowResponse));
  }));


  it('should return null when params are not specified', async(() => {

    httpMock.expectNone({});
    const result = service.getProgramWorkFlows(null);

    expect(result).toBeNull();
  }));
});





