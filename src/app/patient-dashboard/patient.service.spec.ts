import { TestBed, fakeAsync, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import { Patient } from '../models/patient.model';
import { FakePatientResourceService } from '../openmrs-api/fake-patient-resource';
import { PatientService } from './patient.service';
import { BehaviorSubject } from 'rxjs/Rx';
import {
  ProgramEnrollmentResourceService
}
  from '../openmrs-api/program-enrollment-resource.service';
import {
  FakeProgramEnrollmentResourceService
}
  from '../openmrs-api/program-enrollment-resource.service.mock';
import { EncounterResourceService } from '../openmrs-api/encounter-resource.service';
import { FakeEncounterResourceService } from '../openmrs-api/fake-encounter-resource.service';

describe('Service: PatientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: EncounterResourceService, useFactory: () => {
            return new FakeEncounterResourceService(null, null);
          }
        },
        {
          provide: ProgramEnrollmentResourceService, useFactory: () => {
          return new FakeProgramEnrollmentResourceService(null, null);
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
    let service: PatientService = TestBed.get(PatientService);
    expect(service).toBeTruthy();
  });

  it('should initialized currently loaded patient observable when Patient service is injected ' +
    'for the first time', () => {
    let service: PatientService = TestBed.get(PatientService);
    expect(service.currentlyLoadedPatient).toBeTruthy();
    expect(service.currentlyLoadedPatientUuid).toBeTruthy();
  });


  it('should not hit the server when setCurrentlyLoadedPatientByUuid is called' +
    ' with a uuid of an existing loaded patient of same uuid', inject([PatientResourceService],
    fakeAsync((patientResourceService: PatientResourceService) => {
      let service: PatientService = TestBed.get(PatientService);
      let uuid: string = 'patient-uuid-1';
      let patientObject: Patient = new Patient({uuid: uuid, encounters: []});
      spyOn(patientResourceService, 'getPatientByUuid');

      // setting currentlyLoadedPatient and currentlyLoadedPatientUuid for the first time
      service.currentlyLoadedPatient.next(patientObject);
      service.currentlyLoadedPatientUuid.next(uuid);
      // setting currentlyLoadedPatient and currentlyLoadedPatientUuid for the second time
      service.setCurrentlyLoadedPatientByUuid(uuid);
      expect(patientResourceService.getPatientByUuid).not.toHaveBeenCalled();

    })));

  it('should fetch patient object from server if currentlyLoadedPatient uuid is not set',
    inject([PatientResourceService],
      fakeAsync((patientResourceService: PatientResourceService) => {
        let service: PatientService = TestBed.get(PatientService);
        let uuid: string = 'patient-uuid-1';
        spyOn(patientResourceService, 'getPatientByUuid').and.callFake(function (params) {
          let subject = new BehaviorSubject<any>({});
          subject.next({
            uuid: 'uuid',
            display: 'display'
          });
          return subject;
        });
        service.setCurrentlyLoadedPatientByUuid(uuid);
        // check to ensure patientResourceService.getPatientByUuid was hit
        expect(patientResourceService.getPatientByUuid).toHaveBeenCalled();

      })));

  it('should fetch patient object afresh from server if currentlyLoadedPatient uuid is not  ' +
    'the same as uuid supplied to setCurrentlyLoadedPatientByUuid', inject([PatientResourceService],
    fakeAsync((patientResourceService: PatientResourceService) => {
      let service: PatientService = TestBed.get(PatientService);
      let uuid1: string = 'patient-uuid-1';
      let uuid2: string = 'patient-uuid-2';
      let patientObject: Patient = new Patient({uuid: uuid1, encounters: []});
      spyOn(patientResourceService, 'getPatientByUuid').and.callFake(function (params) {
        let subject = new BehaviorSubject<any>({});
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
      // check to ensure patientResourceService.getPatientByUuid was hit
      expect(patientResourceService.getPatientByUuid).toHaveBeenCalled();

    })));

  it('should notify all subscribers when patient object changes', (done) => {
    let patientService = TestBed.get(PatientService);
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
    let patientService = TestBed.get(PatientService);
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
    'is called', inject([PatientResourceService,
      ProgramEnrollmentResourceService,
      EncounterResourceService],
    fakeAsync((patientResourceService: PatientResourceService,
               programEnrollmentResourceService: ProgramEnrollmentResourceService,
               encounterResourceService: EncounterResourceService) => {
      let service: PatientService = TestBed.get(PatientService);
      let uuid1: string = 'patient-uuid-1';
      let uuid2: string = 'patient-uuid-2';
      let patientObject: Patient = new Patient({uuid: uuid1, encounters: []});
      spyOn(programEnrollmentResourceService, 'getProgramEnrollmentByPatientUuid')
        .and.callFake(function (params) {
        let subject = new BehaviorSubject<any>({});
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
      expect(programEnrollmentResourceService.getProgramEnrollmentByPatientUuid).toHaveBeenCalled();

    })));

  it('should fetch patient object when fetchPatientByPatientUuid is called with a' +
    ' valid patient uuid', inject([PatientResourceService, PatientService],
    fakeAsync((patientResourceService: PatientResourceService,
               patientService: PatientService) => {
      let uuid: string = 'patient-uuid-1';
      spyOn(patientResourceService, 'getPatientByUuid').and.callFake(function (params) {
        let subject = new BehaviorSubject<any>({});
        subject.next({
          uuid: 'uuid',
          display: 'display'
        });
        return subject;
      });
      patientService.fetchPatientByUuid(uuid);
      expect(patientResourceService.getPatientByUuid).toHaveBeenCalled();

    })));
});
