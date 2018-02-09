import { TestBed, fakeAsync, inject } from '@angular/core/testing';
import { ProgramService } from './program.service';
import { BehaviorSubject } from 'rxjs/Rx';
import {
  ProgramEnrollmentResourceService
}
  from '../../openmrs-api/program-enrollment-resource.service';
import {
  FakeProgramEnrollmentResourceService
}
  from '../../openmrs-api/program-enrollment-resource.service.mock';
import {
  ProgramResourceService
} from
  '../../openmrs-api/program-resource.service';

import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppSettingsService } from '../../app-settings';

import { LocalStorageService } from '../../utils/local-storage.service';
describe('Service: ProgramService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramService,
        ProgramResourceService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,
        LocalStorageService,
        {provide: APP_BASE_HREF, useValue: '/'},
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: ProgramEnrollmentResourceService, useFactory: () => {
          return new FakeProgramEnrollmentResourceService(null, null);
        }, deps: []
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of ProgramService', () => {
    let service: ProgramService = TestBed.get(ProgramService);
    expect(service).toBeTruthy();
  });

  it('should hit the server when getPatientEnrolledProgramsByUuid is called' +
    ' with a patient uuid', inject([ProgramEnrollmentResourceService],
      fakeAsync((programEnrollmentResourceService: ProgramEnrollmentResourceService) => {
        let service: ProgramService = TestBed.get(ProgramService);
        let uuid: string = 'patient-uuid-1';
        spyOn(programEnrollmentResourceService, 'getProgramEnrollmentByPatientUuid')
          .and.callFake(function (params) {
            let subject = new BehaviorSubject<any>({});
            subject.next({
              uuid: 'uuid',
              display: 'display'
            });
            return subject;
          });
        // setting enrolledPrograms for the second time
        service.getPatientEnrolledProgramsByUuid(uuid);
        expect(programEnrollmentResourceService.
          getProgramEnrollmentByPatientUuid).toHaveBeenCalled();

      })));

  it('should hit the server when getAvailablePrograms is called',
    inject([ProgramResourceService],
      fakeAsync((programResourceService: ProgramResourceService) => {
        let service: ProgramService = TestBed.get(ProgramService);
        spyOn(programResourceService, 'getPrograms')
          .and.callFake(function () {
            let subject = new BehaviorSubject<any>({});
            subject.next({
              uuid: 'uuid',
              display: 'display'
            });
            return subject;
          });
        service.getAvailablePrograms();
        expect(programResourceService.
          getPrograms).toHaveBeenCalled();

      })));


  it('should get selected program  when getSelectedProgram is called', (done) => {
    let service: ProgramService = TestBed.get(ProgramService);

    let programs = [
      {
        uuid: 'uuid-1',
        display: 'STANDARD HIV TREATMENT'
      },
      {
        uuid: 'uuid-2',
        display: 'OVC PROGRAM'
      }
    ];
    let results = service.getSelectedProgram(programs, '1:uuid-2');
    if (results) {
      expect(results.display).toEqual('OVC PROGRAM');
      expect(results.uuid).toEqual('uuid-2');
      done();
    }
  });

  it('should create program payload when createEnrollmentPayload is called' +
    'enroll a patient into a new program', (done) => {
      let service: ProgramService = TestBed.get(ProgramService);
      let program = 'program-uuid', patient = { person: { uuid: 'person-uuid' } },
        dateEnrolled = new Date('Mon Feb 13 2017 11:40:31'),
        dateCompleted = undefined, locationUuid = 'location-uuid', enrollmentUuid = '';
      let payload = service.createEnrollmentPayload(program, patient,
        dateEnrolled, dateCompleted, locationUuid, enrollmentUuid);
      if (payload) {
        expect(payload.program).toEqual('program-uuid');
        expect(payload.patient).toEqual('person-uuid');
        expect(payload.dateEnrolled).toEqual(new Date('Mon Feb 13 2017 11:40:31'));
        expect(payload.dateCompleted).toEqual(undefined);
        expect(payload.uuid).toEqual('');
        done();
      }
    });

  it('should create program payload when createEnrollmentPayload is called' +
    'to edit program enrollment', (done) => {
      let service: ProgramService = TestBed.get(ProgramService);
      let program = 'program-uuid', patient = { person: { uuid: 'person-uuid' } },
        dateEnrolled = new Date('Mon Feb 12 2017 11:40:31'),
        dateCompleted = new Date('Mon Feb 13 2017 11:40:31'),
        locationUuid = 'location-uuid', enrollmentUuid = 'enrollment-uuid';
      let payload = service.createEnrollmentPayload(program, patient,
        dateEnrolled, dateCompleted, locationUuid, enrollmentUuid);
      if (payload) {
        expect(payload.program).toEqual(undefined);
        expect(payload.patient).toEqual(undefined);
        expect(payload.dateEnrolled).toEqual(new Date('Mon Feb 12 2017 11:40:31'));
        expect(payload.dateCompleted).toEqual(new Date('Mon Feb 13 2017 11:40:31'));
        expect(payload.uuid).toEqual('enrollment-uuid');
        done();
      }
    });

  it('should update program enrollment when saveUpdateProgramEnrollment is called', (done) => {
    let service: ProgramService = TestBed.get(ProgramService);
    let program = 'program-uuid', patient = { person: { uuid: 'person-uuid' } },
      dateEnrolled = new Date('Mon Feb 12 2017 11:40:31'),
      dateCompleted = new Date('Mon Feb 13 2017 11:40:31'),
      locationUuid = 'location-uuid', enrollmentUuid = 'enrollment-uuid';
    let payload = service.createEnrollmentPayload(program, patient,
      dateEnrolled, dateCompleted, locationUuid, enrollmentUuid);

    let enrollmement = service.saveUpdateProgramEnrollment(payload);
    enrollmement.subscribe((results) => {
      if (results) {
        expect(results).toBeTruthy();
      }
      done();
    });
  });


});
