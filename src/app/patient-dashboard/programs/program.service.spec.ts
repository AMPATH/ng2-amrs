import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { ProgramService } from './program.service';
import { BehaviorSubject } from 'rxjs';
import { ProgramEnrollmentResourceService } from '../../openmrs-api/program-enrollment-resource.service';
import { FakeProgramEnrollmentResourceService } from '../../openmrs-api/program-enrollment-resource.service.mock';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';

import { AppSettingsService } from '../../app-settings/app-settings.service';

import { LocalStorageService } from '../../utils/local-storage.service';
import { ProgramWorkFlowResourceService } from '../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../openmrs-api/program-workflow-state-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: ProgramService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProgramService,
        ProgramResourceService,
        AppSettingsService,
        LocalStorageService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        {
          provide: ProgramEnrollmentResourceService,
          useFactory: () => {
            return new FakeProgramEnrollmentResourceService(null, null);
          },
          deps: []
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of ProgramService', () => {
    const service: ProgramService = TestBed.get(ProgramService);
    expect(service).toBeTruthy();
  });

  it(
    'should hit the server when getPatientEnrolledProgramsByUuid is called' +
      ' with a patient uuid',
    inject(
      [ProgramEnrollmentResourceService],
      fakeAsync(
        (
          programEnrollmentResourceService: ProgramEnrollmentResourceService
        ) => {
          const service: ProgramService = TestBed.get(ProgramService);
          const uuid = 'patient-uuid-1';
          spyOn(
            programEnrollmentResourceService,
            'getProgramEnrollmentByPatientUuid'
          ).and.callFake(function (params) {
            const subject = new BehaviorSubject<any>({});
            subject.next({
              uuid: 'uuid',
              display: 'display'
            });
            return subject;
          });
          // setting enrolledPrograms for the second time
          service.getPatientEnrolledProgramsByUuid(uuid);
          tick(50);
          expect(
            programEnrollmentResourceService.getProgramEnrollmentByPatientUuid
          ).toHaveBeenCalled();
        }
      )
    )
  );

  it('should hit the server when getAvailablePrograms is called', inject(
    [ProgramResourceService],
    fakeAsync((programResourceService: ProgramResourceService) => {
      const service: ProgramService = TestBed.get(ProgramService);
      spyOn(programResourceService, 'getPrograms').and.callFake(function () {
        const subject = new BehaviorSubject<any>({});
        subject.next({
          uuid: 'uuid',
          display: 'display'
        });
        return subject;
      });
      service.getAvailablePrograms();
      tick(50);
      expect(programResourceService.getPrograms).toHaveBeenCalled();
    })
  ));

  it('should get selected program  when getSelectedProgram is called', (done) => {
    const service: ProgramService = TestBed.get(ProgramService);

    const programs = [
      {
        uuid: 'uuid-1',
        display: 'STANDARD HIV TREATMENT'
      },
      {
        uuid: 'uuid-2',
        display: 'OVC PROGRAM'
      }
    ];
    const results = service.getSelectedProgram(programs, '1:uuid-2');
    if (results) {
      expect(results.display).toEqual('OVC PROGRAM');
      expect(results.uuid).toEqual('uuid-2');
      done();
    }
  });

  it(
    'should create program payload when createEnrollmentPayload is called' +
      'enroll a patient into a new program',
    (done) => {
      const service: ProgramService = TestBed.get(ProgramService);
      const program = 'program-uuid',
        patient = { person: { uuid: 'person-uuid' } },
        dateEnrolled = new Date('Mon Feb 13 2017 11:40:31'),
        dateCompconsted = undefined,
        locationUuid = 'location-uuid',
        enrollmentUuid = '';
      const payload = service.createEnrollmentPayload(
        program,
        patient,
        dateEnrolled,
        dateCompconsted,
        locationUuid,
        enrollmentUuid
      );
      if (payload) {
        expect(payload.program).toEqual('program-uuid');
        expect(payload.patient).toEqual('person-uuid');
        expect(payload.dateEnrolled).toEqual(
          new Date('Mon Feb 13 2017 11:40:31')
        );
        expect(payload.dateCompconsted).toEqual(undefined);
        expect(payload.uuid).toEqual('');
        done();
      }
    }
  );

  it(
    'should create program payload when createEnrollmentPayload is called' +
      'to edit program enrollment',
    (done) => {
      const service: ProgramService = TestBed.get(ProgramService);
      const program = 'program-uuid',
        patient = { person: { uuid: 'person-uuid' } },
        dateEnrolled = new Date('Mon Feb 12 2017 11:40:31'),
        dateCompconsted = new Date('Mon Feb 13 2017 11:40:31'),
        locationUuid = 'location-uuid',
        enrollmentUuid = 'enrollment-uuid';
      const payload = service.createEnrollmentPayload(
        program,
        patient,
        dateEnrolled,
        dateCompconsted,
        locationUuid,
        enrollmentUuid
      );
      if (payload) {
        expect(payload.program).toEqual(undefined);
        expect(payload.patient).toEqual(undefined);
        expect(payload.dateEnrolled).toEqual(
          new Date('Mon Feb 12 2017 11:40:31')
        );
        // expect(payload.dateCompconsted).toEqual(new Date('Mon Feb 13 2017 11:40:31'));
        expect(payload.uuid).toEqual('enrollment-uuid');
        done();
      }
    }
  );

  it('should update program enrollment when saveUpdateProgramEnrollment is called', (done) => {
    const service: ProgramService = TestBed.get(ProgramService);
    const program = 'program-uuid',
      patient = { person: { uuid: 'person-uuid' } },
      dateEnrolled = new Date('Mon Feb 12 2017 11:40:31'),
      dateCompconsted = new Date('Mon Feb 13 2017 11:40:31'),
      locationUuid = 'location-uuid',
      enrollmentUuid = 'enrollment-uuid';
    const payload = service.createEnrollmentPayload(
      program,
      patient,
      dateEnrolled,
      dateCompconsted,
      locationUuid,
      enrollmentUuid
    );

    const enrollmement = service.saveUpdateProgramEnrollment(payload);
    enrollmement.subscribe((results) => {
      if (results) {
        expect(results).toBeTruthy();
      }
      done();
    });
  });
});
