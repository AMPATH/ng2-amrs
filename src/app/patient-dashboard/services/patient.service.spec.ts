import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { Patient } from '../../models/patient.model';
import { FakePatientResourceService } from '../../openmrs-api/fake-patient-resource';
import { PatientService } from './patient.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  ProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service';
import { first } from 'rxjs/operators';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { FakeEncounterResourceService } from '../../openmrs-api/fake-encounter-resource.service';
import { PatientProgramService } from '../programs/patient-programs.service';
import {
  FakeProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service.mock';
import { doesNotThrow } from 'assert';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class FakePatientProgramService {
  public getCurrentlyEnrolledPatientPrograms(uuid): Observable<any> {
    return Observable.create((observer: Subject<any[]>) => {
      observer.next([{
        program: { uuid: '123' },
        enrolledProgram: { programUuid: '123', uuid: '12345' },
        programUuid: '12345',
        isFocused: false,
        dateEnrolled: null,
        dateCompconsted: null,
        validationError: '',
        buttons: {
          link: {
            display: 'Go to program',
            url: '/patient-dashboard/patient/uuid/test/landing-page'
          },
          enroll: {
            display: 'Enroll patient'
          },
          edit: {
            display: 'Edit Enrollment',
          }
        },
        isEnrolled: false
      }]);
    }).pipe(first());
  }
}

describe('Service: PatientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientService,
        HttpClient,
        HttpClientTestingModule,
        PatientProgramService,
        {
          provide: EncounterResourceService, useFactory: () => {
            return new FakeEncounterResourceService(null, null);
          }
        },
        {
          provide: ProgramEnrollmentResourceService, useFactory: () => {
            return new FakeProgramEnrollmentResourceService(null, null);
          }
        },
        {
          provide: PatientProgramService, useFactory: () => {
            return new FakePatientProgramService();
          }, deps: []
        },
        {
          provide: PatientResourceService, useFactory: () => {
            return new FakePatientResourceService(null, null);
          }, deps: []
        },
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance of PatientService', () => {
    const service: PatientService = TestBed.get(PatientService);
    expect(service).toBeTruthy();
  });

  it('should initialized currently loaded patient observable when Patient service is injected ' +
    'for the first time', () => {
      const service: PatientService = TestBed.get(PatientService);
      expect(service.currentlyLoadedPatient).toBeTruthy();
      expect(service.currentlyLoadedPatientUuid).toBeTruthy();
    });


  it('should not hit the server when setCurrentlyLoadedPatientByUuid is called' +
    ' with a uuid of an existing loaded patient of same uuid', inject([PatientResourceService],
      fakeAsync((patientResourceService: PatientResourceService) => {
        const service: PatientService = TestBed.get(PatientService);
        const uuid = 'patient-uuid-1';
        const patientObject: Patient = new Patient({ uuid: uuid, encounters: [] });
        spyOn(patientResourceService, 'getPatientByUuid');

        // setting currentlyLoadedPatient and currentlyLoadedPatientUuid for the first time
        service.currentlyLoadedPatient.next(patientObject);
        service.currentlyLoadedPatientUuid.next(uuid);
        // setting currentlyLoadedPatient and currentlyLoadedPatientUuid for the second time
        service.setCurrentlyLoadedPatientByUuid(uuid);
        tick(50);
        expect(patientResourceService.getPatientByUuid).not.toHaveBeenCalled();

      })));

  it('should fetch patient object from server if currentlyLoadedPatient uuid is not set',
    inject([PatientResourceService],
      fakeAsync((patientResourceService: PatientResourceService) => {
        const service: PatientService = TestBed.get(PatientService);
        const uuid = 'patient-uuid-1';
        spyOn(patientResourceService, 'getPatientByUuid').and.callFake((params) => {
          const subject = new BehaviorSubject<any>({});
          subject.next({
            uuid: 'uuid',
            display: 'display'
          });
          return subject;
        });
        service.setCurrentlyLoadedPatientByUuid(uuid);
        tick(50);
        // check to ensure patientResourceService.getPatientByUuid was hit
        expect(patientResourceService.getPatientByUuid).toHaveBeenCalled();

      })));

  it('should fetch patient object afresh from server if currentlyLoadedPatient uuid is not  ' +
    'the same as uuid supplied to setCurrentlyLoadedPatientByUuid', inject([PatientResourceService],
      fakeAsync((patientResourceService: PatientResourceService) => {
        const service: PatientService = TestBed.get(PatientService);
        const uuid1 = 'patient-uuid-1';
        const uuid2 = 'patient-uuid-2';
        const patientObject: Patient = new Patient({ uuid: uuid1, encounters: [] });
        spyOn(patientResourceService, 'getPatientByUuid').and.callFake((params) => {
          const subject = new BehaviorSubject<any>({});
          subject.next({
            uuid: 'uuid',
            display: 'display'
          });
          return subject;
        });
        // setting currentlyLoadedPatient and currentlyLoadedPatientUuid for the first time
        service.currentlyLoadedPatient.next(patientObject);
        service.currentlyLoadedPatientUuid.next(patientObject.uuid);
        // now try to set with a different uuid i.e @{uuid2}
        service.setCurrentlyLoadedPatientByUuid(uuid2);
        tick(50);
        // check to ensure patientResourceService.getPatientByUuid was hit
        expect(patientResourceService.getPatientByUuid).toHaveBeenCalled();

      })));

  it('should notify all subscribers when patient object changes', (done) => {
    const patientService = TestBed.get(PatientService);
    expect(patientService).toBeDefined();
    patientService.currentlyLoadedPatient.next(new Patient({
      uuid: 'init uuid',
      display: 'some display'
    }));
    patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient.uuid === 'init uuid') {
          console.log('got notification for the uuid: init uuid');
        }

        if (patient.uuid === 'next uuid') {
          console.log('got notification for the uuid: next uuid');
          done();
        }
      });

    patientService.currentlyLoadedPatient.next(new Patient({
      uuid: 'next uuid',
      display: 'some display',
      encounters: []
    })
    );

  });

  it('should notify all subscribers when current patient uuid changes', (done) => {
    const patientService = TestBed.get(PatientService);
    expect(patientService).toBeDefined();
    patientService.currentlyLoadedPatientUuid.next('init uuid');
    patientService.currentlyLoadedPatientUuid.subscribe(
      (uuid) => {
        if (uuid === 'init uuid') {
          console.log('got notification for the uuid: init uuid');
        }

        if (uuid === 'next uuid') {
          console.log('got notification for the uuid: next uuid');
          done();
        }
      });

    patientService.currentlyLoadedPatientUuid.next('next uuid');

  });

  it('should fetch patient program enrollment information when setCurrentlyLoadedPatientByUuid' +
    ' is called', inject([PatientResourceService,
      PatientProgramService,
      EncounterResourceService],
      fakeAsync((patientResourceService: PatientResourceService,
        patientProgramService: PatientProgramService,
        encounterResourceService: EncounterResourceService) => {
        const service: PatientService = TestBed.get(PatientService);
        const uuid1 = 'patient-uuid-1';
        const uuid2 = 'patient-uuid-2';
        const patientObject: Patient = new Patient({ uuid: uuid1, encounters: [] });
        spyOn(patientProgramService, 'getCurrentlyEnrolledPatientPrograms')
          .and.callFake((params) => {
            const subject = new BehaviorSubject<any>({});
            subject.next([{
              uuid: 'uuid',
              display: 'display'
            }]);
            return subject;
          });

        // setting currentlyLoadedPatient and currentlyLoadedPatientUuid for the first time
        service.currentlyLoadedPatient.next(patientObject);
        service.currentlyLoadedPatientUuid.next(patientObject.uuid);
        // now try to set with a different uuid i.e @{uuid2}
        service.setCurrentlyLoadedPatientByUuid(uuid2);
        // check to ensure programEnrollmentResourceService.getProgramEnrollmentByPatientUuid was hit
        tick(1000);
        expect(patientProgramService.getCurrentlyEnrolledPatientPrograms).toHaveBeenCalled();

      })));

  it('should fetch patient object when fetchPatientByPatientUuid is called with a' +
    ' valid patient uuid', inject([PatientResourceService, PatientService],
      fakeAsync((patientResourceService: PatientResourceService,
        patientService: PatientService) => {
        const uuid = 'patient-uuid-1';
        spyOn(patientResourceService, 'getPatientByUuid').and.callFake((params) => {
          const subject = new BehaviorSubject<any>({});
          subject.next({
            uuid: 'uuid',
            display: 'display'
          });
          return subject;
        });
        patientService.fetchPatientByUuid(uuid);
        tick(50);
        expect(patientResourceService.getPatientByUuid).toHaveBeenCalled();

      })));
});
