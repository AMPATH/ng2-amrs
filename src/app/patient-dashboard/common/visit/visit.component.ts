import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import * as _ from 'lodash';
import { Subscription, Observable } from 'rxjs';

import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { TodayVisitService, VisitsEvent } from './today-visit.service';
import { TitleCasePipe } from '../../../shared/pipes/title-case.pipe';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';
import { CommunityGroupMemberService } from '../../../openmrs-api/community-group-member-resource.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { PatientProgramResourceService } from 'src/app/etl-api/patient-program-resource.service';
import { ObsResourceService } from 'src/app/openmrs-api/obs-resource.service';
import * as moment from 'moment';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'visit',
  templateUrl: 'visit.component.html',
  styleUrls: ['visit.component.css']
})
export class VisitComponent implements OnInit, OnDestroy {
  public currentProgramConfig = {};
  public showVisitStartedMsg = false;
  public modelEnrolled: any = 'STANDARD CARE MODEL';
  public patients: any;
  private subs: Subscription[] = [];
  public isRetrospectiveVisit = false;
  public retrospectiveAttributeTypeUuid =
    '3bb41949-6596-4ff9-a54f-d3d7883a69ed';

  @Input()
  public programUuid = '';

  @Output()
  public formSelected = new EventEmitter<any>();

  @Output()
  public encounterSelected = new EventEmitter<any>();

  public enrolledPrograms: Array<any> = [];
  public currentProgramEnrollmentUuid = '';
  public currentEnrollment: any = undefined;
  public patientAssignedModel: any = 'Anon';
  public visit: any;
  public visits: Array<any> = [];
  public programVisitsObj: any = undefined;

  public patient: any;
  public errors: Array<any> = [];
  public isBusy = false;
  private todayVisitsEventSub: Subscription;

  @ViewChild('enrollModal') public enrollModal;
  public modalRef: BsModalRef;
  public currentCommunityGroups: any[] = [];
  public modalState: {
    action: string;
    currentGroups: any;
    currentEnrolledPrograms: any[];
    patient: any;
  };
  public patientEnrolledInGroup = false;
  public communityEnrollmentSuccessMessage;

  constructor(
    private todayVisitService: TodayVisitService,
    private communityGroupMemberService: CommunityGroupMemberService,
    private bsModalService: BsModalService,
    private patientService: PatientService,
    private patientProgramResourceService: PatientProgramResourceService,
    private obsResourceService: ObsResourceService
  ) {}

  public ngOnInit() {
    this.getPatientUuid();
    this.getPatientModel();
    // this.isBusy = true;
    // app feature analytics
    // this.appFeatureAnalytics
    //   .trackEvent('Patient Dashboard', 'Patient Visits Loaded', 'ngOnInit');
  }

  public ngOnDestroy(): void {
    if (this.todayVisitsEventSub) {
      this.todayVisitsEventSub.unsubscribe();
    }
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
    this.subs = [];
  }

  public getPatientUuid() {
    const sub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          this.subscribeToVisitsServiceEvents();
          this.checkForAlreadyLoadedVisits();
          this.checkIfPatientEnrolledInGroup();
        }
      }
    );
    console.log('Sub:', sub);

    this.subs.push(sub);
  }

  public getPatientModel() {
    console.log('PatientEnrolled', this.patient.uuid);
    const patientUuid = this.patient.uuid;
    const patientModelConceptUuid = ['af0c1b76-991c-4a8e-a197-7157d9498a33'];
    // '2f0a08cc-af60-443e-9536-65fca9494970',
    let patientModel;
    this.obsResourceService
      .getObsPatientObsByConcept(patientUuid, patientModelConceptUuid)
      .subscribe((data) => {
        console.log('Model', data);
        const results = data['results'];
        if (results.length > 0) {
          this.modelEnrolled = results[0].value.display;
          patientModel = this.modelEnrolled;
          console.log('patientModel', patientModel);
          return patientModel;
        }
      });
    return patientModel;
  }

  public checkIfPatientEnrolledInGroup() {
    this.isBusy = true;
    const DIFFERENTIATED_CARE = '334c9e98-173f-4454-a8ce-f80b20b7fdf0';
    if (this.programUuid === DIFFERENTIATED_CARE) {
      this.communityGroupMemberService
        .getMemberCohortsByPatientUuid(this.patient.uuid)
        .subscribe((groups) => {
          this.isBusy = false;
          if (!_.isEmpty(groups)) {
            _.forEach(groups, (group) => {
              if (!group.voided) {
                this.currentCommunityGroups.push(group);
                const groupProgram = _.filter(
                  group.cohort.attributes,
                  (attribute) =>
                    attribute.cohortAttributeType.name === 'programUuid'
                )[0];
                if (groupProgram) {
                  const groupProgramUuid = groupProgram['value'];
                  if (groupProgramUuid === this.programUuid) {
                    this.patientEnrolledInGroup = true;
                    return false;
                  }
                }
              }
            });
          }
        });
    }
  }

  public enrollInGroup() {
    this.modalState = {
      action: 'Enroll',
      currentGroups: this.currentCommunityGroups,
      currentEnrolledPrograms: [{ programUuid: this.programUuid }],
      patient: this.patient
    };
    this.modalRef = this.bsModalService.show(this.enrollModal, {
      backdrop: 'static',
      class: 'modal-lg'
    });
  }

  public onEnrollToGroup(group) {
    this.modalRef.hide();
    this.patientEnrolledInGroup = true;
    this.communityEnrollmentSuccessMessage = `Successfully enrolled to ${group.name}`;
    setTimeout(() => (this.communityEnrollmentSuccessMessage = null), 5000);
  }

  public getVisitStartedMsgStatus() {
    this.showVisitStartedMsg = this.todayVisitService.getVisitStartedMsgStatus();
  }

  public removeVisitStartedMsg() {
    this.todayVisitService.hideVisitStartedMessage();
  }

  public toTitleCase(text: string): string {
    return new TitleCasePipe().transform(text);
  }

  public checkForAlreadyLoadedVisits() {
    if (
      _.isEmpty(this.todayVisitService.programVisits) ||
      this.todayVisitService.needsVisitReload
    ) {
      this.triggerVisitLoading();
    } else {
      this.onVisitLoadedEvent();
    }
  }

  public subscribeToVisitsServiceEvents() {
    const sub = this.todayVisitService.visitsEvents.subscribe(
      (event: VisitsEvent) => {
        switch (event) {
          case VisitsEvent.VisitsLoadingStarted:
            this.onProgramVisitsLoadingStarted();
            break;
          case VisitsEvent.ErrorLoading:
            this.onProgramVisitsLoadingError();
            break;
          case VisitsEvent.VisitsLoaded:
            this.onVisitLoadedEvent();
            break;
          case VisitsEvent.VisitsBecameStale:
            this.triggerVisitLoading();
            break;
          default:
            break;
        }
      }
    );
    this.subs.push(sub);

    this.getVisitStartedMsgStatus();
  }

  public onProgramVisitsLoadingStarted() {
    this.isBusy = true;
    this.errors = [];
    this.visit = undefined;
    this.visits = [];
    // this.patient = undefined;
    this.currentEnrollment = undefined;
    this.currentProgramEnrollmentUuid = '';
    this.programVisitsObj = undefined;
  }

  public onProgramVisitsLoadingError() {
    this.isBusy = false;
    this.errors = this.todayVisitService.errors;
    this.visit = undefined;
  }

  public onVisitLoadedEvent() {
    this.todayVisitService.processVisitsForPrograms();
    this.programVisitsObj = null;
    this.programVisitsObj = this.todayVisitService.programVisits;
    this.isBusy = false;
    this.patient = this.patient === null ? undefined : this.patient;
    this.processProgramVisits();
  }

  public onFormSelected(form) {
    if (form) {
      this.formSelected.next(form);
    }
  }

  public onEncounterSelected(encounter) {
    if (encounter) {
      this.encounterSelected.next(encounter);
    }
  }

  public onVisitStartedOrChanged(visit) {
    this.todayVisitService.makeVisitsStale();
  }

  public processProgramVisits() {
    if (!_.isEmpty(this.programVisitsObj)) {
      let returnedVisit = null;
      let visits = [];
      let currentEnrollment = {
        uuid: ''
      };
      if (typeof this.programVisitsObj[this.programUuid] === 'undefined') {
        returnedVisit = null;
      } else {
        returnedVisit = this.programVisitsObj[this.programUuid].currentVisit;
        visits = this.programVisitsObj[this.programUuid].visits;
        currentEnrollment = this.programVisitsObj[this.programUuid].enrollment
          .enrolledProgram;
      }

      this.visit = returnedVisit;
      this.visits = visits;
      this.currentEnrollment = currentEnrollment;
      this.currentProgramEnrollmentUuid = this.currentEnrollment.uuid;
      if (this.visit) {
        const visitDate = moment(this.visit.startDatetime).format('YYYY-MM-DD');
        this.checkForRetrospectiveVisit(this.visit);
        this.getCurrentProgramEnrollmentConfig(
          this.visit.patient.uuid,
          this.programUuid,
          this.currentProgramEnrollmentUuid,
          this.visit.location.uuid,
          this.isRetrospectiveVisit,
          visitDate
        );
      }
    }
  }

  public triggerVisitLoading() {
    this.onProgramVisitsLoadingStarted();
    this.todayVisitService.patient = this.patient;
    const sub = this.todayVisitService.getProgramVisits().subscribe(
      () => {},
      (error) => {}
    );
    this.subs.push(sub);
  }

  public getCurrentProgramEnrollmentConfig(
    patientUuid,
    programUuid,
    programEnrollmentUuid,
    locationUuid,
    checkForRetrospectiveVisit,
    visitDate
  ) {
    this.patientProgramResourceService
      .getPatientProgramVisitTypes(
        patientUuid,
        programUuid,
        programEnrollmentUuid,
        locationUuid,
        checkForRetrospectiveVisit.toString(),
        visitDate
      )
      .take(1)
      .subscribe(
        (progConfig) => {
          this.currentProgramConfig = progConfig;
        },
        (error) => {
          console.error('Error loading the program visit configs', error);
        }
      );
  }

  public checkForRetrospectiveVisit(visit: any): void {
    let isRetrospective = false;
    if (visit.hasOwnProperty('attributes')) {
      isRetrospective = visit.attributes.some((a: any) => {
        return a.attributeType.uuid === this.retrospectiveAttributeTypeUuid;
      });
    }
    this.isRetrospectiveVisit = isRetrospective;
  }
}
