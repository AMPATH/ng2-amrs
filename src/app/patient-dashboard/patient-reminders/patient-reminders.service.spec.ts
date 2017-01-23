/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { LocalStorageService } from '../../utils/local-storage.service';

import { AppSettingsService } from '../../app-settings/app-settings.service';
import { PatientReminderService } from './patient-reminders.service';
import { PatientReminderResourceService } from '../../etl-api/patient-reminder-resource.service';

describe('Service: PatientReminderService', () => {

  let service: PatientReminderService,
    reminders: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientReminderService,
        PatientReminderResourceService,
        MockBackend,
        LocalStorageService,
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
    service = TestBed.get(PatientReminderService);
    reminders = service.getPatientReminders('79803198-2d23-49cd-a7b3-4f672bd8f659');


  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });


  it('should load Patient reminders', (done) => {
    reminders.subscribe((results) => {
      if (results) {
        expect(results).toBeTruthy();
      }
      done();
    });

  });

  it('should return an error when load patient reminders is not successful', (done) => {
    let backend: MockBackend = TestBed.get(MockBackend);

    let patientUuid = 'de662c03-b9af-4f00-b10e-2bda0440b03b';

    backend.connections.subscribe((connection: MockConnection) => {
      connection.mockError(new Error('An error occured while processing the request'));
    });
    service.getPatientReminders(patientUuid)
      .subscribe((response) => {
        },
        (error: Error) => {
          expect(error).toBeTruthy();
        });
    done();
  });
});
