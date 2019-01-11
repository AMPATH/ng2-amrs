import { async, inject, TestBed } from '@angular/core/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { ProgramWorkFlowStateResourceService } from './program-workflow-state-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

xdescribe('Service: ProgramWorkFlowStateResourceService', () => {

  let service: ProgramWorkFlowStateResourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramWorkFlowStateResourceService,
        AppSettingsService,
        LocalStorageService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.get(ProgramWorkFlowStateResourceService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  const programWorkFlowStateResponse = {
    'results': [
      {
        'uuid': '78238ed8-1359-11df-a1f1-0026b9348838',
        'concept': {
          'uuid': 'a8b0ea90-1350-11df-a1f1-0026b9348838',
          'display': 'C1'
        }
      },
      {
        'uuid': '7823ecfc-1359-11df-a1f1-0026b9348838',
        'concept': {
          'uuid': 'a8b0eb6c-1350-11df-a1f1-0026b9348838',
          'display': 'C2'
        }
      }
    ]
  };

  it('should be defined', async(() => {
    expect(service).toBeDefined();
  }));

  it('should have getUrl defined', () => {

    expect(service.getUrl()).toBeTruthy();
  });
  it('should return null when programWorkFlowUuid not specified', async(() => {

    httpMock.expectNone({});
    const result = service.getProgramWorkFlowState(null);

    expect(result).toBeNull();
  }));

  it('should call the right endpoint when fetching workflow states', async(() => {
    const programWorkFlowUuid = 'uuid';

    service.getProgramWorkFlowState(programWorkFlowUuid).subscribe();

    const req = httpMock.expectOne(service.getUrl() + '/' + programWorkFlowUuid + '/' + 'state' +
      '?v=custom:(uuid,initial,terminal,concept:(uuid,retired,display))');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify(programWorkFlowStateResponse));
  }));


  it('should return null when params are not specified', async(() => {
    httpMock.expectNone({});
    const result = service.getProgramWorkFlowState(null);

    expect(result).toBeNull();
  }));

});





