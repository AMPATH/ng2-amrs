import { TestBed, fakeAsync, inject } from '@angular/core/testing';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import { Patient } from '../models/patient.model';
import { FakePatientResourceService } from '../openmrs-api/fake-patient-resource';
import { PatientService } from './patient.service';
import { BehaviorSubject } from 'rxjs/Rx';

describe('Service: PatientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientService,
        {
          provide: PatientResourceService, useFactory: () => {
          return new FakePatientResourceService(null, null);
        }, deps: []
        }
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
      let patientObject: Patient = new Patient({uuid: uuid});
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
      let patientObject: Patient = new Patient({uuid: uuid1});
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
        display: 'some display'
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

  it('should change currentlyLoadedPatient when setCurrentlyLoadedPatientByUuid() ' +
    'is called with a different patient uuid',
    inject([PatientService],
      fakeAsync((patientService: PatientService) => {
        let initialPatient: Patient = new Patient({
          uuid: 'uuid-init',
          display: 'uuid-display'
        });
        let newPatientUuid: string = 'new-patient-uuid';

        // setting initial patient object
        patientService.currentlyLoadedPatient.next(initialPatient);
        patientService.currentlyLoadedPatientUuid.next(initialPatient.uuid);
        // now setCurrentlyLoadedPatientByUuid with a different patient uuid
        patientService.setCurrentlyLoadedPatientByUuid(newPatientUuid);
        // check to ensure subscribers have been notified of the changes
        patientService.currentlyLoadedPatient.subscribe(
          (patient) => {
            expect(patient.uuid).toEqual(newPatientUuid);
            expect(patientService.currentlyLoadedPatient.value.uuid).toEqual(newPatientUuid);
            expect(patient.uuid).not.toEqual(initialPatient);
          }
        );

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
