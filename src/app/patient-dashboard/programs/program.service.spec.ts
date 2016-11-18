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

describe('Service: ProgramService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramService,
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

  it('should initialized currently loaded program observable when Program service is injected ' +
    'for the first time', () => {
    let service: ProgramService = TestBed.get(ProgramService);
    expect(service.enrolledPrograms).toBeTruthy();
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
      expect(programEnrollmentResourceService.getProgramEnrollmentByPatientUuid).toHaveBeenCalled();

    })));
});
