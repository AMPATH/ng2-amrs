import { Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';

import { HivReferralService } from './hiv-referral.service';
import { LocationResourceService } from './../../../../openmrs-api/location-resource.service';

// interfaces
import { ReferredProgram } from './../../../../interfaces/referred-program.interface';
import {
  ProgramEnrollment,
  ProgramEnrollmentPayload
} from './../../../../interfaces/program-enrollment.interface';
import { Location } from './../../../../interfaces/location.interface';
import { ReferralStatus } from './../../../../interfaces/referral-status.interface';
import { Programs } from 'src/app/constants/program.constants';
import * as moment from 'moment';

interface Provider {
  provider: string;
  encounterRole: string;
}
interface AutoEnrollmentEncounterPayload {
  location: string;
  patient: string;
  encounterProviders: Provider[];
  encounterType: string;
  encounterDatetime: string;
}

@Component({
  selector: 'app-hiv-referral',
  templateUrl: './hiv-referral.component.html',
  styleUrls: ['./hiv-referral.component.css']
})
export class HivReferralComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public referredHivProgram: ReferredProgram;
  @Input() public refer: number;
  @Input() public patient: any;
  public statusLog: ReferralStatus[] = [];
  @Output() public referralStatus = new EventEmitter<ReferralStatus>();
  public referredLocation: Location = {
    uuid: '',
    display: '',
    name: '',
    description: ''
  };
  public locationSubscription: Subscription;
  public referralEnrollmentSubscription: Subscription;
  public currentlyEnrolledSubscription: Subscription;
  public autoEnrollSubscription: Subscription;
  public completeEnrollmentSubscription: Subscription;
  public enrollToProgramSubscription: Subscription;

  public enrolledHivPrograms: ProgramEnrollment[] = [];
  public incompatiblePrograms: ProgramEnrollment[] = [];
  private UNKNOWN_ENCOUNTER_ROLE = 'a0b03050-c99b-11e0-9572-0800200c9a66';
  public sameProgramReferral = false;
  public referralInfoMessage = '';

  constructor(
    private hivReferralService: HivReferralService,
    private locationService: LocationResourceService
  ) {}

  public ngOnInit(): void {
    const status: ReferralStatus = {
      status: 'start',
      message: ``
    };
    this.setReferralStatus(status);
  }
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.referredHivProgram) {
      if (changes.referredHivProgram.currentValue !== null) {
        // only fetch if location has been selected
        if (this.referredHivProgram.locationUuid.length > 0) {
          this.locationSubscription = this.locationService
            .getLocationByUuid(this.referredHivProgram.locationUuid)
            .subscribe((location: Location) => {
              this.referredLocation = location;
              this.sameProgramReferral = this.referralInSameProgram(
                this.referredHivProgram,
                this.enrolledHivPrograms
              );
              this.getReferralInfoMessage();
              const status: ReferralStatus = {
                status: 'start',
                message: this.getReferralMessage(
                  this.referredLocation.name,
                  this.referredHivProgram.name
                )
              };
              this.setReferralStatus(status);
            });
        }
      }
    }
    if (changes.patient) {
      if (changes.patient.currentValue !== null) {
        const patientUuid = this.patient.uuid;
        this.getHivEnrolledPrograms(patientUuid);
      }
    }
    if (changes.refer) {
      if (changes.refer.currentValue !== null) {
        const status: ReferralStatus = {
          status: 'complete',
          message: 'Patient has been successfully moved.'
        };
        if (changes.refer.currentValue === 1) {
          this.completeAndEnroll()
            .then((result) => {
              this.setReferralStatus(status);
            })
            .catch((error: any) => {
              console.error('error', error);
            });
        } else if (changes.refer.currentValue === 2) {
          this.changeIncompatibleProgramLocation()
            .then((result: any) => {
              this.setReferralStatus(status);
            })
            .catch((error: any) => {
              console.error('error', error);
            });
        } else {
          this.setReferralStatus(status);
        }
      }
    }
  }
  private getHivEnrolledPrograms(patientUuid: string): void {
    this.currentlyEnrolledSubscription = this.hivReferralService
      .getPatientCurrentlyEnrolledHivPrograms(patientUuid)
      .subscribe((programs: any) => {
        if (programs.length) {
          this.enrolledHivPrograms = programs;
          this.incompatiblePrograms = this.getHivIncompatiblePrograms(programs);
        }
      });
  }
  private completeHivPrograms(hivPrograms: ProgramEnrollment[]): Promise<any> {
    return new Promise((resolve, reject) => {
      if (hivPrograms.length > 0) {
        this.completeEnrollmentSubscription = this.hivReferralService
          .completePatientEnrolledPrograms(hivPrograms)
          .subscribe((result: any) => {
            if (result) {
              resolve(result);
            }
          });
      } else {
        resolve('true');
      }
    });
  }
  private updateStatus(status: string, message: string): void {
    this.statusLog.push({ status, message });
  }
  private referToProgram(
    enrollToProgramPayload: ProgramEnrollmentPayload
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.enrollToProgramSubscription = this.hivReferralService
        .enrollToProgram(enrollToProgramPayload)
        .subscribe((result) => {
          if (result) {
            resolve(result);
          }
        });
    });
  }

  private async referToMultiplePrograms(enrollmentsPayload: any): Promise<any> {
    try {
      for (let i = 0; i < enrollmentsPayload.length; i++) {
        const enrollmentPayload: ProgramEnrollmentPayload =
          enrollmentsPayload[i];
        if (enrollmentPayload) {
          await this.referToProgram(enrollmentPayload);
        }
      }

      return Promise.resolve('enrolled');
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private completeAndEnroll(): Promise<any> {
    const hivPrograms = this.enrolledHivPrograms;
    const enrollmentPayload: ProgramEnrollmentPayload = {
      location: this.referredHivProgram.locationUuid,
      patient: this.patient.uuid,
      dateEnrolled: moment().subtract(1, 'minutes').format(),
      program: this.referredHivProgram.uuid
    };
    let referredToStandard = false;
    const enrollmentsPayload = hivPrograms.map(
      (hivProgram: ProgramEnrollment) => {
        if (
          this.referredHivProgram.uuid === Programs.STANDARD_HIV_PROGRAM.uuid
        ) {
          referredToStandard = true;
        } else if (
          this.referredHivProgram.uuid === Programs.PNC_PROGRAM.uuid ||
          this.referredHivProgram.uuid === Programs.ANC_PROGRAM.uuid ||
          this.referredHivProgram.uuid === Programs.PMTCT_PROGRAM.uuid
        ) {
        } else {
          return {
            location: this.referredHivProgram.locationUuid,
            patient: this.patient.uuid,
            dateEnrolled: moment().subtract(1, 'minutes').format(),
            program: hivProgram.program.uuid
          };
        }
      }
    );
    // Add the referred program in payload

    enrollmentsPayload.push(enrollmentPayload);
    return new Promise((resolve, reject) => {
      this.completeHivPrograms(hivPrograms)
        .then((result: any) => {
          if (
            referredToStandard &&
            this.referredHivProgram.uuid === Programs.STANDARD_HIV_PROGRAM.uuid
          ) {
            return this.referToProgram(enrollmentPayload);
          } else {
            return this.referToMultiplePrograms(enrollmentsPayload);
          }
        })
        .then((result: any) => {
          return this.createAutoEnrollmentEncounter();
        })
        .then((result: any) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private changeIncompatibleProgramLocation() {
    /* changes the patients currently enrolled program location */
    const hivPrograms = this.enrolledHivPrograms;
    const enrollmentsPayload = hivPrograms.map(
      (hivProgram: ProgramEnrollment) => {
        return {
          location: this.referredHivProgram.locationUuid,
          patient: this.patient.uuid,
          dateEnrolled: moment().subtract(1, 'minutes').format(),
          program: hivProgram.program.uuid
        };
      }
    );

    return new Promise((resolve, reject) => {
      this.completeHivPrograms(hivPrograms)
        .then((result: any) => {
          return this.referToMultiplePrograms(enrollmentsPayload);
        })
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  private setReferralStatus(status: ReferralStatus): void {
    this.referralStatus.emit(status);
  }
  private createAutoEnrollmentEncounter(): Promise<any> {
    const status: ReferralStatus = {
      status: 'auto-enrollment',
      message: 'Creating Auto Enrollment Encounters'
    };
    this.setReferralStatus(status);

    return new Promise((resolve, reject) => {
      const autoEnrollmentPayload: AutoEnrollmentEncounterPayload = {
        location: this.referredHivProgram.locationUuid,
        patient: this.patient.uuid,
        encounterProviders: [
          {
            provider: this.referredHivProgram.providerUuid,
            encounterRole: this.UNKNOWN_ENCOUNTER_ROLE
          }
        ],
        encounterType: '',
        encounterDatetime: moment().subtract(1, 'minutes').format()
      };

      const programUuid = this.referredHivProgram.uuid;

      this.autoEnrollSubscription = this.hivReferralService
        .saveAutoEnrollmentEncounter(programUuid, autoEnrollmentPayload)
        .subscribe(
          (result: any) => {
            resolve(result);
          },
          (error) => {
            reject(error);
          }
        );
    });
  }

  public ngOnDestroy() {
    if (this.locationSubscription) {
      this.locationSubscription.unsubscribe();
    }
    if (this.currentlyEnrolledSubscription) {
      this.currentlyEnrolledSubscription.unsubscribe();
    }
    if (this.autoEnrollSubscription) {
      this.autoEnrollSubscription.unsubscribe();
    }
    if (this.completeEnrollmentSubscription) {
      this.completeEnrollmentSubscription.unsubscribe();
    }
    if (this.enrollToProgramSubscription) {
      this.enrollToProgramSubscription.unsubscribe();
    }
  }

  public getReferralMessage(
    referredLocation: string,
    referredProgramName: string
  ): string {
    let referralMessage = '';
    if (this.sameProgramReferral) {
      referralMessage = `You are about to move this client to ${referredLocation} location , ${referredProgramName} program`;
    } else {
      referralMessage = `You are about to refer the patient to ${referredProgramName} program in ${referredLocation} location`;
    }
    return referralMessage;
  }

  public referralInSameProgram(
    referredProgram: ReferredProgram,
    enrolledPrograms: ProgramEnrollment[]
  ): boolean {
    const referredProgramUuid: string = referredProgram.uuid || '';
    return enrolledPrograms.some((enrollment: ProgramEnrollment) => {
      return enrollment.program.uuid === referredProgramUuid;
    });
  }

  public getReferralInfoMessage(): void {
    let infoMessage = '';
    if (this.sameProgramReferral) {
      infoMessage =
        'Moving the patient, the system will retain them  in the above program.';
    } else {
      infoMessage = 'Referring them will unenroll them from the above programs';
    }

    this.referralInfoMessage = infoMessage;
  }

  public getHivIncompatiblePrograms(
    programs: ProgramEnrollment[]
  ): ProgramEnrollment[] {
    return programs.filter((program: ProgramEnrollment) => {
      return this.hivReferralService.isIncompatibleHivProgram(
        program.program.uuid
      );
    });
  }
}
