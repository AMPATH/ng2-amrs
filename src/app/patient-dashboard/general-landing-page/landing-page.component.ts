import { forkJoin as observableForkJoin, Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';

import { take, map, first } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { ProgramService } from '../programs/program.service';
import { PatientService } from '../services/patient.service';
import { Patient } from '../../models/patient.model';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import {
  DepartmentProgramsConfigService
} from '../../etl-api/department-programs-config.service';
import { PatientReferralService } from '../../program-manager/patient-referral.service';
import {
  UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { PatientReferralResourceService } from '../../etl-api/patient-referral-resource.service';
import { Encounter } from '../../models/encounter.model';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralLandingPageComponent implements OnInit, OnDestroy {
  @Input()
  public hideList = false;
  @ViewChild('staticModal')
  public staticModal: ModalDirective;
  @ViewChild('modal')
  public modal: ModalComponent;
  public patient: Patient = new Patient({});
  public hasError = false;
  public programsBusy = false;
  public errors: any[] = [];
  public addBackground: any = 'white';
  public enrolledProgrames: any = [];
  public allProgramVisitConfigs: any = {};
  public selectedEncounter: Encounter;
  public selectedVisitEncounter: Encounter;
  public showReferralEncounterDetail = false;
  public showVisitEncounterDetail = false;
  public loadingEncounter = false;
  public encounterViewed = false;
  public lastEnrolledPrograms: any = [];
  private _datePipe: DatePipe;
  private subscriptions: Subscription[] = [];

  constructor(private patientService: PatientService,
              private patientReferralService: PatientReferralService,
              private userDefaultPropertiesService: UserDefaultPropertiesService,
              private patientProgramResourceService: PatientProgramResourceService,
              private router: Router) {
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
    const referralEncounter = _.find(this.patient.encounters, (encounter) => {
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
    if (!_.isUndefined(program.referred_to_location_uuid)) {
      const patientEncounters = this.patient.encounters;
      const location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
      // patient was referred to this location
      if (location.uuid === program.referred_to_location_uuid) {
        const referralEncounter = _.find(patientEncounters, (encounter) => {
          return encounter.location.uuid === program.referred_from_location_uuid
            && program.encounter_uuid === encounter.uuid;
        });
        if (!_.isNil(referralEncounter)) {
          return this.hasValidVisitInReferredLocation(referralEncounter, patientEncounters,
            location.uuid);
        }
        return false;
      }
      return false;
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
    setTimeout(() => {
      this.addBackground = color;
    });

  }

  public getReferralLocation(enrolledPrograms: any[]) {
    const programBatch: Array<Observable<any>> = [];
    const location = this.userDefaultPropertiesService.getCurrentUserDefaultLocationObject();
    _.each(enrolledPrograms, (program) => {
      programBatch.push(this.getReferralByLocation(location.uuid, program.enrolledProgram.uuid));
    });

    return observableForkJoin(programBatch);
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
    const observer: BehaviorSubject<any[]> = new BehaviorSubject(null);
    this.patientProgramResourceService.getPatientProgramVisitConfigs(this.patient.uuid).pipe(take(1)).subscribe(
      (programConfigs) => {
        observer.next(programConfigs);
      },
      (error) => {
        observer.next(error);
      });
    return observer;
  }

  public filterRequiredEnrollmentForms(program): string[] {
    const _program: any = this.allProgramVisitConfigs[program.programUuid];
    if (_program && !_.isUndefined(_program.enrollmentOptions)
      && !_.isUndefined(_program.enrollmentOptions.stateChangeEncounterTypes)) {
      const encounterTypes = _program.enrollmentOptions.stateChangeEncounterTypes.referral;
      return _.map(_.filter(encounterTypes, 'required'), 'uuid');
    }
    return [];
  }

  public loadProgramManager() {
    this.router.navigate(['/patient-dashboard/patient/' + this.patient.uuid +
    '/general/general/program-manager/new-program']);
  }

  public viewSummary(program) {
    const url = program.buttons.landing.url;
    this.router.navigate([url], {});
  }

  private hasValidVisitInReferredLocation(referralEncounter: any, encounters: any[],
                                          locationUuid: string) {
    // search for visit encounters who's location is the referred to location
    const encounterWithVisit = _.find(encounters, (encounter) => {
      return !_.isNull(encounter.visit) && encounter.visit.location.uuid === locationUuid;
    });
    if (!_.isNil(encounterWithVisit)) {
      // visit date must be after the referral encounter date
      return moment(encounterWithVisit.visit.startDatetime)
        .isAfter(moment(referralEncounter.encounterDatetime));
    }
    return false;
  }

  private loadProgramBatch(): void {
    this._resetVariables();
    this.programsBusy = true;
    const sub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.programsBusy = false;
          this.patient = patient;
          this.setLastEnrolledPrograms();
          this.enrolledProgrames = _.filter(patient.enrolledPrograms, 'isEnrolled');
          this.checkPatientReferrals();
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

  private setLastEnrolledPrograms() {
    const completedPrograms = _.filter(this.patient.enrolledPrograms, 'dateCompleted');
    const programGroup: any = _.groupBy(completedPrograms, 'baseRoute');
    const newArr = [];
    if (programGroup.hiv) {
      newArr.push(_.max(programGroup.hiv));
    }
    if (programGroup.oncology) {
      newArr.push(_.max(programGroup.oncology));
    }
    if (programGroup.cdm) {
      newArr.push(_.max(programGroup.cdm));
    }
    this.lastEnrolledPrograms = newArr;
  }

  private checkPatientReferrals() {
    this.getReferralLocation(this.enrolledProgrames).pipe(take(1)).subscribe((reply: any[]) => {
      if (_.filter(reply, v => !_.isEmpty(v)).length > 0) {
        this.fetchPatientProgramVisitConfigs().subscribe((configs) => {
          if (configs) {
            this.allProgramVisitConfigs = configs;
            _.each(this.enrolledProgrames, (program, index) => {
              const referral = reply[index];
              if (referral) {
                _.extend(program, referral, {
                  referral_completed: !_.isNil(referral.notification_status)
                });
                if (this.patientHasBeenSeenInProgram(program)) {
                  program.referral_completed = true;
                  this.updateReferalNotificationStatus(program).pipe(take(1)).subscribe(() => {});
                }
              }
            });
          }
        }, (error) => {
          this.programsBusy = false;
          // little importance in communicating this error to the user
          console.error('Error fetching program configs', error);
        });
      } else {
        this._resetVariables();
      }
    }, (err) => {
      console.log(err);
      // little importance in communicating this error to the user
      this.programsBusy = false;
    });
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
