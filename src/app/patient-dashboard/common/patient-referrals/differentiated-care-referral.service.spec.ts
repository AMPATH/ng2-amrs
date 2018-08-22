/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as moment from 'moment';

import { PatientReferralsModule } from './patient-referrals.module';
import { DifferentiatedCareReferralService } from './differentiated-care-referral.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { ProgramEnrollmentResourceService } from
  '../../../openmrs-api/program-enrollment-resource.service';

describe('Service: DifferentiatedCareReferral.service.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: [
        PatientReferralsModule,
        HttpModule
      ]
    });
  });

  it('should inject the differentiated care referral service', () => {
    let service = TestBed.get(DifferentiatedCareReferralService);
    expect(service).toBeTruthy();
  });

  it('should submit differentiated care encounter type with given rtc date, location and provider',
    (done) => {
      let service: DifferentiatedCareReferralService =
        TestBed.get(DifferentiatedCareReferralService);
      let encounterService = TestBed.get(EncounterResourceService);

      let rtcDate: Date = moment().toDate();
      let encounterDate: Date = moment().toDate();

      let postEncounterSpy = spyOn(encounterService, 'saveEncounter').and.callFake(
        (payload) => {
          expect(payload).toEqual(
            {
              location: 'location-uuid',
              patient: 'patient-uuid',
              encounterProviders: [
                {
                  provider: 'provider-uuid',
                  encounterRole: 'a0b03050-c99b-11e0-9572-0800200c9a66'
                }],
              encounterDatetime: service.toOpenmrsDateFormat(encounterDate),
              encounterType: 'f022c2ec-db69-4403-b515-127be11cde53',
              obs: [{
                concept: 'a8a666ba-1350-11df-a1f1-0026b9348838',
                value: service.toOpenmrsDateFormat(rtcDate)
              }]
            }
          );
          return Observable.of(payload);
        }
      );

      service.createDifferentiatedCareEncounter('patient-uuid', 'provider-uuid',
        encounterDate, rtcDate, 'location-uuid')
        .subscribe((createdEncounter) => {
          expect(postEncounterSpy.calls.count()).toBe(1);
          done();
        }, (error) => {
          console.error('did not expect error at this point', error);
        });
    });

  it('should enroll the patient to a differentiated care program', (done) => {
    let service: DifferentiatedCareReferralService =
      TestBed.get(DifferentiatedCareReferralService);
    let enrollmentService: ProgramEnrollmentResourceService =
      TestBed.get(ProgramEnrollmentResourceService);
    let encounterDate: Date = moment().toDate();

    let postEnrollmentSpy = spyOn(enrollmentService, 'saveUpdateProgramEnrollment').and.callFake(
      (payload) => {
        expect(payload).toEqual(
          {
            location: 'location-uuid',
            patient: 'patient-uuid',
            program: '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
            dateEnrolled: service.toOpenmrsDateFormat(encounterDate)
          }
        );
        return Observable.of(payload);
      }
    );

    service.enrollPatientToDifferentiatedCare('patient-uuid', encounterDate,
      'location-uuid')
      .subscribe((enrollment) => {
        expect(postEnrollmentSpy.calls.count()).toBe(1);
        done();
      }, (error) => {
        console.error('did not expect error at this point', error);
      });
  });

  it('should find the active hiv enrollments from a list of enrolllments',
    () => {
      let service: DifferentiatedCareReferralService =
        TestBed.get(DifferentiatedCareReferralService);

      let samplePrograms = [
        {
          baseRoute: 'hiv',
          dateEnrolled: '2017-04-04',
          dateCompleted: null,
          programUuid: 'prog-1'
        },
        {
          baseRoute: 'oncology',
          dateEnrolled: '2017-04-04',
          dateCompleted: null,
          programUuid: 'prog-2'
        },
        {
          baseRoute: 'hiv',
          dateEnrolled: '2017-04-04',
          dateCompleted: '2017-04-05',
          programUuid: 'prog-3'
        },
        {
          baseRoute: 'hiv',
          dateEnrolled: '2017-04-04',
          dateCompleted: null,
          programUuid: 'prog-4'
        }
      ];

      let activePrograms =
        service.filterOutHivActivePrograms(samplePrograms);

      let expectedActives = [
        samplePrograms[0],
        samplePrograms[3]
      ];

      expect(activePrograms).toEqual(expectedActives);
    });

  it('should determine if there is an active differentiated care enrollment',
    () => {
      let service: DifferentiatedCareReferralService =
        TestBed.get(DifferentiatedCareReferralService);

      let samplePrograms = [
        {
          baseRoute: 'hiv',
          dateEnrolled: '2017-04-04',
          dateCompleted: null,
          programUuid: 'prog-1'
        },
        {
          baseRoute: 'hiv',
          dateEnrolled: '2017-04-04',
          dateCompleted: null,
          programUuid: '334c9e98-173f-4454-a8ce-f80b20b7fdf0'
        },
        {
          baseRoute: 'hiv',
          dateEnrolled: '2017-04-04',
          dateCompleted: '2017-04-04',
          programUuid: '334c9e98-173f-4454-a8ce-f80b20b7fdf0'
        }
      ];

      expect(service.hasActiveDifferentiatedCareEnrollment(samplePrograms)).toBe(true);
    });

  it('should end active enrollments for a given hiv programs',
    (done) => {
      let service: DifferentiatedCareReferralService =
        TestBed.get(DifferentiatedCareReferralService);
      let enrollmentService: ProgramEnrollmentResourceService =
        TestBed.get(ProgramEnrollmentResourceService);

      let dateCompleted: Date = moment().toDate();

      let postEnrollmentSpy = spyOn(enrollmentService, 'saveUpdateProgramEnrollment').and.callFake(
        (payload) => {
          expect(payload).toEqual(
            {
              uuid: 'some-uuid',
              dateCompleted: service.toOpenmrsDateFormat(dateCompleted)
            }
          );
          return Observable.of(payload);
        }
      );

      service.endProgramEnrollment('some-uuid', dateCompleted)
        .subscribe((enrollment) => {
          expect(postEnrollmentSpy.calls.count()).toBe(1);
          done();
        }, (error) => {
          console.error('did not expect error at this point', error);
        });
    });

  it('should end all hiv program enrollments if there are more than one', (done) => {
    let service: DifferentiatedCareReferralService =
      TestBed.get(DifferentiatedCareReferralService);

    let samplePrograms = [
      {
        baseRoute: 'hiv',
        dateEnrolled: '2017-04-04',
        dateCompleted: null,
        programUuid: 'prog-1',
        enrolledProgram: {
          uuid: 'uuid-1'
        }
      },
      {
        baseRoute: 'hiv',
        dateEnrolled: '2017-04-04',
        dateCompleted: null,
        programUuid: 'prog-4',
        enrolledProgram: {
          uuid: 'uuid-2'
        }
      }
    ];
    let dateCompleted: Date = moment().toDate();

    let endProgEnrollmentSpy = spyOn(service, 'endProgramEnrollment')
      .and.callFake((uuid, date) => {
        return Observable.of({
          uuid: uuid,
          dateCompleted: date
        });
      });

    service.endProgramEnrollments(samplePrograms, dateCompleted)
      .subscribe((results) => {
        expect(endProgEnrollmentSpy.calls.count()).toBe(2);
        expect(endProgEnrollmentSpy.calls.allArgs()).toEqual([
          ['uuid-1', dateCompleted],
          ['uuid-2', dateCompleted],
        ]);
        done();
      }, (error) => {
        console.error('did not expect error at this point', error);
      });
  });

  it('should refer patient to the differentiated care program',
    (done) => {
      // 1. Create encounter for differentiated care
      // 2. End enrollment in any hiv related program
      // 3. Enroll in differentiated care program
      let service: DifferentiatedCareReferralService =
        TestBed.get(DifferentiatedCareReferralService);

      let patient = {
        uuid: 'patient-uuid',
        enrolledPrograms: [
          {
            baseRoute: 'hiv',
            dateEnrolled: '2017-04-04',
            dateCompleted: null,
            programUuid: 'prog-1',
            enrolledProgram: {
              uuid: 'uuid-1'
            }
          },
          {
            baseRoute: 'hiv',
            dateEnrolled: '2017-04-04',
            dateCompleted: null,
            programUuid: 'prog-4',
            enrolledProgram: {
              uuid: 'uuid-2'
            }
          }
        ]
      };

      let filterActive = spyOn(service, 'filterOutHivActivePrograms')
        .and.callThrough();

      let endEnrollmentsSpy = spyOn(service, 'endProgramEnrollments')
        .and.callFake((enrollments, date) => {
          let sub = new Subject();
          setTimeout(() => {
            sub.next(enrollments);
          }, 50);
          return sub;
        });

      let hasActiveSpy = spyOn(service, 'hasActiveDifferentiatedCareEnrollment')
        .and.callThrough();

      let enrollDiffSpy = spyOn(service, 'enrollPatientToDifferentiatedCare')
        .and.callFake(() => {
          let sub = new Subject();
          setTimeout(() => {
            sub.next({});
          }, 50);
          return sub;
        });

      let createDiffEncSpy = spyOn(service, 'createDifferentiatedCareEncounter')
        .and.callFake(() => {
          let sub = new Subject();
          setTimeout(() => {
            sub.next({});
          }, 50);
          return sub;
        });

      let encounterDate = moment().toDate();
      let rtcDate = moment().toDate();

      let sub = service.referToDifferentiatedCare(patient,
        'provider-uuid', encounterDate, rtcDate, 'location-uuid');
      sub.subscribe((status) => {
        // console.log('status', status);

        expect(hasActiveSpy.calls.count()).toBe(1);
        expect(filterActive.calls.count()).toBe(1);
        expect(endEnrollmentsSpy.calls.count()).toBe(1);
        expect(enrollDiffSpy.calls.count()).toBe(1);
        expect(createDiffEncSpy.calls.count()).toBe(1);

        // check status
        expect(status.successful).toEqual(true);
        expect(status.alreadyReferred).toEqual(false);

        // created encounter
        expect(status.encounterCreation.created).toBeDefined();
        expect(status.encounterCreation.error).toBeUndefined();
        expect(status.encounterCreation.done).toBe(true);

        // unerolled from other hiv progs
        expect(status.otherHivProgUnenrollment.unenrolledFrom).toBeDefined();
        expect(status.otherHivProgUnenrollment.error).toBeUndefined();
        expect(status.otherHivProgUnenrollment.done).toBe(true);

        // unerolled from other hiv progs
        expect(status.diffCareProgramEnrollment.enrolled).toBeDefined();
        expect(status.diffCareProgramEnrollment.error).toBeUndefined();
        expect(status.diffCareProgramEnrollment.done).toBe(true);

        done();
      }, (error) => {
        console.error('not expecting error with test case');
      });
    });

});
