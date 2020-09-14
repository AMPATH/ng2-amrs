/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../../../utils/local-storage.service';

import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { PatientReminderService } from './patient-reminders.service';
import { PatientReminderResourceService } from '../../../etl-api/patient-reminder-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientTestingBackend } from '@angular/common/http/testing/src/backend';
import { map } from 'rxjs/operators';

describe('Service: PatientReminderService', () => {
  let service: PatientReminderService, reminders: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientReminderService,
        PatientReminderResourceService,
        LocalStorageService,
        AppSettingsService
      ],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(PatientReminderService);
    reminders = service.getPatientReminders(
      '79803198-2d23-49cd-a7b3-4f672bd8f659'
    );
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should load Patient reminders', () => {
    reminders.subscribe((results) => {
      if (results) {
        expect(results).toBeTruthy();
      }
    });
  });

  it('should call load patient reminders', () => {
    spyOn(service, 'getPatientReminders').and.callFake((err, data) => {});
    service.getPatientReminders('uuid');
    expect(service.getPatientReminders).toHaveBeenCalled();
  });
});
