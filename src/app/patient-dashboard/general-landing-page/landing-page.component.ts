
import {map,  first } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subscription , Observable , Subject } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { ProgramService } from '../programs/program.service';
import { PatientService } from '../services/patient.service';
import { Patient } from '../../models/patient.model';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { DepartmentProgramsConfigService
} from '../../etl-api/department-programs-config.service';
import { PatientReferralService } from '../../program-manager/patient-referral-service';
import { UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { PatientReferralResourceService } from '../../etl-api/patient-referral-resource.service';
import { Encounter } from '../../models/encounter.model';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralLandingPageComponent implements OnInit, OnDestroy {
  @Input()
  public hideList: boolean = false;
  @ViewChild('staticModal')
  public staticModal: ModalDirective;
  @ViewChild('modal')
  public modal: ModalComponent;
  public patient: Patient = new Patient({});
  public hasError: boolean = false;
  public programsBusy: boolean = false;
  public errors: any[] = [];
  public addBackground: any;
  public enrolledProgrames: any = [];
  public allProgramVisitConfigs: any = {};
  public selectedEncounter: Encounter;
  public selectedVisitEncounter: Encounter;
  public showReferralEncounterDetail: boolean = false;
  public showVisitEncounterDetail: boolean = false;
  public loadingEncounter: boolean = false;
  public encounterViewed: boolean = false;
  private _datePipe: DatePipe;
  private subscriptions: Subscription[] = [];
  constructor(private patientService: PatientService,
              private patientReferralService: PatientReferralService,
              private userDefaultPropertiesService: UserDefaultPropertiesService,
              private patientProgramResourceService: PatientProgramResourceService) {
    this._datePipe = new DatePipe('en-US');
  }

  public ngOnInit() {
    this.loadProgramBatch();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  public showReferralEncounter(row: any) {
    const visitEncounter = _.find(this.patient.encounters, (encounter) => {
      return encounter.location.uuid === row.referred_from_location_uuid
        && encounter.uuid === row.encounter_uuid;
    });

    const enrollmentForms = this.filterRequiredEnrollmentForms(row);
    let referralEncounter = _.find(this.patient.encounters, (encounter) => {
      return encounter.location.uuid === row.referred_from_location_uuid
        && _.includes(enrollmentForms, encounter.encounterType.uuid);
    });

    if (visitEncounter) {
      this.selectedVisitEncounter = new Encounter(visitEncounter);
      // hide by default
      this.showVisitEncounterDetail = false;
    }

    if (referralEncounter) {
      this.selectedEncounter = new Encounter(referralEncounter);
      // show by default
      this.showReferralEncounterDetail = true;
    }

    this.staticModal.show();
  }

  public patientHasBeenSeenInProgram(program) {
    if (!_.isUndefined(program.referred_from_location)) {
      const patientEncounters = this.patient.encounters;
      const enrollmentForms = this.filterRequiredEnrollmentForms(program);
      let referralEncounter = _.find(patientEncounters, (encounter) => {
        // patient was referred to this location
        if (encounter.location.uuid === program.referred_from_location_uuid
          && _.includes(enrollmentForms, encounter.encounterType.uuid)) {

          const localEncounter = _.find(patientEncounters, (_encounter) => {
            return moment(_encounter.encounterDatetime)
              .isAfter(moment(encounter.encounterDatetime));
          });
          return !_.isNil(localEncounter);
        }

        return false;
      });
      return !_.isNil(referralEncounter)
    }

    return false;
  }

  public hideEncounterModal() {
    this.showReferralEncounterDetail = false;
    this.staticModal.hide();
    this.encounterViewed = true;
    this.selectedEncounter = null;
  }

  public toggleDetailEncounter() {
    this.showVisitEncounterDetail = this.showReferralEncounterDetail;
    this.showReferralEncounterDetail = !this.showVisitEncounterDetail;
  }

  public onAddBackground(color) {
    this.addBackground = color;
  }

  public getReferralLocation(enrolledPrograms: any[]) {
    let programBatch: Array<Observable<any>> = [];
    let location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    _.each(enrolledPrograms, (program) => {
      programBatch.push(this.getReferralByLocation(location.uuid, program.enrolledProgram.uuid));
    });

    return Observable.forkJoin(programBatch);
  }

  public getReferralByLocation(locationUuid: string, enrollmentUuid: string): Observable<any> {
    return Observable.create((observer: BehaviorSubject<any[]>) => {
      this.patientReferralService.getReferredByLocation(locationUuid, enrollmentUuid)
        .subscribe((data) => {
          if (data) {
            observer.next(data);
          }
        }, (error) => {
          observer.error(error);
        });
    }).first();
  }

  public fetchPatientProgramVisitConfigs() {
    this.allProgramVisitConfigs = {};
    this.patientProgramResourceService.
    getPatientProgramVisitConfigs(this.patient.uuid).take(1).subscribe(
      (programConfigs) => {
        this.allProgramVisitConfigs = programConfigs;
      },
      (error) => {
        this.errors.push({
          id: 'program configs',
          message: 'There was an error fetching all the program configs'
        });
        console.error('Error fetching program configs', error);
      });
  }

  public filterRequiredEnrollmentForms(program): string[] {
    let _program: any = this.allProgramVisitConfigs[program.programUuid];
    if (_program && !_.isUndefined(_program.enrollmentOptions)
      && !_.isUndefined(_program.enrollmentOptions.stateChangeEncounterTypes)) {
      const encounterTypes = _program.enrollmentOptions.stateChangeEncounterTypes.referral;
      return _.map(_.filter(encounterTypes, 'required'), 'uuid');
    }
    return [];
  }

  private loadProgramBatch(): void {
    this._resetVariables();
    this.programsBusy = true;
    const sub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.programsBusy = false;
          this.patient = patient;
          this.enrolledProgrames = _.filter(patient.enrolledPrograms, 'isEnrolled');
          this.getReferralLocation(this.enrolledProgrames).take(1).subscribe( (reply: any) => {
            if (reply) {
              _.each(this.enrolledProgrames, (program, index) => {
                let referral = reply[index];
                if (referral) {
                  _.extend(program , referral, {
                    referral_completed : !_.isNil(referral.notification_status)
                  });
                  if (this.patientHasBeenSeenInProgram(program)) {
                    program.referral_completed = true;
                    this.updateReferalNotificationStatus(program).take(1).subscribe(() => {});
                  }
                }
              });
            }
          }, (err)=> {
            console.log(err);
            this.errors.push({
              id: 'Patient Care Programs',
              message: 'error checking referral state of programs',
              error: err
            });
            this.programsBusy = false;
          });
          this.fetchPatientProgramVisitConfigs();
        }
      }, (err) => {
        this.hasError = true;
        this.errors.push({
          id: 'Patient Care Programs',
          message: 'error fetching available programs',
          error: err
        });
        this.programsBusy = false;
      });

      this.subscriptions.push(sub);
  }

  private updateReferalNotificationStatus(program) {
    return this.patientReferralService.updateReferalNotificationStatus({
      patient_referral_id: program.patient_referral_id,
      notificationStatus: 1
    });
  }

  private _resetVariables() {
    this.programsBusy = false;
    this.hasError = false;
    this.errors = [];
  }
}
