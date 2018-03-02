import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { ProgramService } from '../program.service';

import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { ProgramsTransferCareService } from './transfer-care.service';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';

describe('Service: ProgramsTransferCareService', () => {
  let service: ProgramsTransferCareService;
  let configs = {
    '781d8768-1359-11df-a1f1-0026b9348838': {
      transferCare: {
        'AMPATH': ['cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'],
        'DISCHARGE': ['cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'],
        'NON-AMPATH': [
          'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
          '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f'
        ]
      }
    },
    'f7793d42-11ac-4cfd-9b35-e0a21a7a7c31': {
      transferCare: {
        'AMPATH': [
          'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'
        ],
        'DISCHARGE': ['cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'],
        'NON-AMPATH': [
          'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
          'f091b833-9e1a-4eef-8364-fc289095a832'
        ]
      }
    },
    '781d85b0-1359-11df-a1f1-0026b9348838': {
      transferCare: {
        'AMPATH': ['cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'],
        'DISCHARGE': ['00da8227-e7da-43c2-99b2-a4f237dd3924'],
        'NON-AMPATH': ['cbe2d31d-2201-44ce-b52e-fbd5dc7cff33']
      }
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientProgramResourceService,
        ProgramsTransferCareService,
        ProgramEnrollmentResourceService,
        ProgramResourceService,
        ProgramService,
        AppSettingsService,
        MockBackend,
        BaseRequestOptions,
        LocalStorageService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        EncounterResourceService,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
    service = TestBed.get(ProgramsTransferCareService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of ProgramsTransferCareService', () => {
    expect(service).toBeDefined();
  });

  it('should save payload', inject([], fakeAsync(() => {
    service.savePayload({
      test: 'payload'
    });
    service.getPayload().subscribe((payload) => {
      expect(payload).toEqual({test: 'payload'});
    });

  })));

  it('should update transfer status', inject([], fakeAsync(() => {
    service.setTransferStatus(true);
    expect(service.transferComplete()).toBeTruthy();
  })));

  it('should return forms for a given transfer Type', inject([], fakeAsync(() => {
    let program = {
      programUuid: '781d8768-1359-11df-a1f1-0026b9348838',
      transferType: 'AMPATH'
    };
    service.attachEncounterForms(program, configs).subscribe((_programs) => {
      expect(_programs.encounterForms).toBeDefined();
      expect(_programs.encounterForms.length).toEqual(1);
      expect(_programs.encounterForms[0]).toEqual('cbe2d31d-2201-44ce-b52e-fbd5dc7cff33');
    });
  })));

  it('should return NO forms when program is not in the configs', inject([], fakeAsync(() => {
    let program = {
      programUuid: '781d8768-1359-12df-a1f1-0026b9348838',
      transferType: 'AMPATH'
    };
    service.attachEncounterForms(program, configs).subscribe((_programs) => {
      expect(_programs.encounterForms).toBeDefined();
      expect(_programs.encounterForms.length).toEqual(0);
    });
  })));
});
