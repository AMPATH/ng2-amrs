import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as _ from 'lodash';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';

import { DepartmentProgramsConfigService } from '../../etl-api/department-programs-config.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { PatientReferralService } from '../../program-manager/patient-referral.service';
import { ProgramResourceService } from '../../openmrs-api/program-resource.service';

@Component({
  selector: 'program-referral-status',
  templateUrl: './program-referral-status.component.html',
  styleUrls: []
})
export class ProgramReferralStatusComponent implements OnInit {
  public department: string;
  public referralLocation: string;
  public selectedProgram: string;
  public isValidReferral = true;
  public isResolved = false;
  private _status: any;

  @Output() referralValidity = new EventEmitter<boolean>();
  @Input()
  public get status(): any {
    return this._status;
  }

  public set status(data: any) {
    if (data) {
      this._status = data;
    }
  }

  constructor(
    private departmentProgramService: DepartmentProgramsConfigService,
    private localStorageService: LocalStorageService,
    private locationResourceService: LocationResourceService,
    private patientReferralService: PatientReferralService,
    private programResourceService: ProgramResourceService) { }

  public ngOnInit(): void {
    if (this._status) {
      this.checkReferralValidity();
      this.saveReferralData();
    } else {
      this.removeReferralData();
    }
    this.getReferralLocation();
    this.getSelectedProgram();
  }

  private getProgramReferralsByLocation(enrolledPrograms: any[]) {
    const programBatch: Array<Observable<any>> = [];
    const location = this.status.referralLocation;
    _.each(enrolledPrograms, program => {
      programBatch.push(this.getReferralsByLocationUuid(location, program.enrolledProgram.uuid));
    });
    return forkJoin(programBatch);
  }

  private getReferralsByLocationUuid(locationUuid: string, enrollmentUuid: string): Observable<any> {
    return Observable.create((observer: BehaviorSubject<any[]>) => {
      this.patientReferralService.getReferredByLocation(locationUuid, enrollmentUuid)
        .subscribe(data => {
          if (data) {
            observer.next(data);
          }
        }, error => {
          observer.error(error);
          console.error('error from getReferralsByLocationUuid: ', error);
        });
    }).first();
  }

  private checkReferralValidity(): void {
    if (this.status.patient) {
      const programUuid = this.resolveProgramUuid();
      const enrolledPrograms = _.filter(this.status.patient.enrolledPrograms, 'isEnrolled');
      this.getProgramReferralsByLocation(enrolledPrograms).pipe(take(1))
        .subscribe(reply => {
          if (reply) {
            const replyWithoutEmpties = reply.filter(val => Object.keys(val).length > 0);
            let existingReferral;
            _.each(replyWithoutEmpties, (referral: any) => {
              existingReferral = _.find(enrolledPrograms, (program: any) => {
                // active enrollment in the referral location
                if (program.enrolledProgram.uuid === referral.patient_program_uuid) {
                  _.extend(program, referral, {
                    referral_completed: !_.isNil(referral.notification_status)
                  });
                  return program;
                }
              });
              return;
            });
            // check that we're not referring to the same program
            if (existingReferral && _.isNil(existingReferral.notification_status)
              && (existingReferral.programUuid === programUuid)) {
              // referral notification_status is null, which means referral is incomplete (pending)
              this.isValidReferral = false;
              this.isResolved = true;
              this.referralValidity.emit(false);
              return;
            } else {
              // referral notification_status is 1 which means that this is a complete referral
              this.isValidReferral = true;
              this.isResolved = true;
              this.referralValidity.emit(true);
              return;
            }
          }
        }, err => {
          console.error('Could not fetch program referral status');
        }
      );
    }
  }

  private resolveProgramUuid(): string {
    let programUuid: string;
    programUuid = _.has(this.status.selectedProgram, 'programUuid')
      ? this.status.selectedProgram.programUuid
      : this.status.selectedProgram;
    return programUuid;
  }

  private getSelectedProgram(): void {
    const programUuid = this.resolveProgramUuid();
    this.programResourceService.getProgramByUuid(programUuid).subscribe(
      (program: any) => {
        if (program.name.match(/\s*Program\s*/gi)) {
          this.localStorageService.setItem('refProgram', program.name);
          this.selectedProgram = program.name.replace(/\s*Program\s*/gi, '');
        } else {
          this.localStorageService.setItem('refProgram', program.name);
          this.selectedProgram = program.name;
        }
      }, (error) => {
        console.error('Could not get the program name: ', error);
      }
    );
  }

  private getReferralLocation(): void {
    const referralLocationUuid = this.status.referralLocation;
    if (referralLocationUuid) {
      this.locationResourceService.getLocationByUuid(referralLocationUuid).subscribe(
        (result) => {
          this.localStorageService.setItem('refLocation', result.display);
          this.referralLocation = result.display;
        },
        (error) => {
          console.error('Could not get referral location name: ', error);
        }
      );
    }
  }

  private saveReferralData(): void {
    if (this.status.selectedProgram) {
      this.departmentProgramService.getDartmentProgramsConfig()
        .subscribe(results => {
          if (results) {
            this.saveProgramAndDepartment(results);
          }
        });
    }
  }

  private removeReferralData(): void {
    this.localStorageService.remove('pm-data');
  }

  private saveProgramAndDepartment(departmentConfig): void {
    const programUuidToSave = this.resolveProgramUuid();
    _.each(departmentConfig, (config: any) => {
      const departmentProgram = _.find(config.programs, (program) => {
        return program && program.uuid === programUuidToSave;
      });
      if (departmentProgram) {
        const currentPmData = this.localStorageService.getObject('pm-data') || {};
        this.department = config.name;
        this.localStorageService.setObject('pm-data', _.merge(currentPmData, {
          department: config.name
        }, this.status));
      }
    });
  }
}
