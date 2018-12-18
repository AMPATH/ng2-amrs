import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import *  as _ from 'lodash';
import { Subscription, Observable } from 'rxjs';

import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { TodayVisitService, VisitsEvent } from './today-visit.service';
import { TitleCasePipe } from '../../../shared/pipes/title-case.pipe';
import {
  UserDefaultPropertiesService
} from '../../../user-default-properties/user-default-properties.service';
import { CommunityGroupMemberService } from '../../../openmrs-api/community-group-member-resource.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'visit',
  templateUrl: 'visit.component.html',
  styleUrls: ['visit.component.css']
})
export class VisitComponent implements OnInit, OnDestroy {

  public currentProgramConfig: any;
  public showVisitStartedMsg: boolean = false;

  @Input()
  public programUuid: string = '';

  @Output()
  public formSelected = new EventEmitter<any>();

  @Output()
  public encounterSelected = new EventEmitter<any>();

  public enrolledPrograms: Array<any> = [];
  public currentProgramEnrollmentUuid: string = '';
  public currentEnrollment: any = undefined;
  public visit: any;
  public visits: Array<any> = [];
  public programVisitsObj: any = undefined;

  public patient: any;
  public errors: Array<any> = [];
  public isBusy: boolean = false;
  private todayVisitsEventSub: Subscription;

  @ViewChild('enrollModal') public enrollModal;
  public modalRef: BsModalRef;
  public currentCommunityGroups: any[] = [];
  public modalState: { action: string; currentGroups: any; currentEnrolledPrograms: any[]; patient: any; };
  public patientEnrolledInGroup = false;
  public communityEnrollmentSuccessMessage;

  constructor(
    private todayVisitService: TodayVisitService,
    private communityGroupMemberService: CommunityGroupMemberService,
    private bsModalService: BsModalService
  ) { }

  public ngOnInit() {
    this.subscribeToVisitsServiceEvents();
    this.checkForAlreadyLoadedVisits();
    this.checkIfPatientEnrolledInGroup();
    // this.isBusy = true;
    // app feature analytics
    // this.appFeatureAnalytics
    //   .trackEvent('Patient Dashboard', 'Patient Visits Loaded', 'ngOnInit');
  }

  public ngOnDestroy(): void {
    if (this.todayVisitsEventSub) {
      this.todayVisitsEventSub.unsubscribe();
    }
  }

  public checkIfPatientEnrolledInGroup() {
    this.isBusy = true;
    this.communityGroupMemberService.getMemberCohortsByPatientUuid(this.todayVisitService.patient.uuid)
    .subscribe((groups) => {
      this.isBusy = false;
      if (!_.isEmpty(groups)) {
          _.forEach(groups, (group) => {
            if (!group.voided) {
            this.currentCommunityGroups.push(group);
            const program = _.filter(group.cohort.attributes, (attribute) => attribute.cohortAttributeType.name === 'programUuid')[0];
            if (program) {
              if (program['value'] === this.programUuid && this.programUuid === '334c9e98-173f-4454-a8ce-f80b20b7fdf0') {
                this.patientEnrolledInGroup = true;
                return false;
              }
            }
          }
          });
      }
    });
  }

  public enrollInGroup() {
    this.modalState = {
      action: 'Enroll',
      currentGroups: this.currentCommunityGroups,
      currentEnrolledPrograms: [{programUuid: this.programUuid}],
      patient: this.todayVisitService.patient
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
    setTimeout(() => this.communityEnrollmentSuccessMessage = null, 5000);
  }

  public getVisitStartedMsgStatus() {
    this.showVisitStartedMsg = this.todayVisitService.getVisitStartedMsgStatus();
  }

  public removeVisitStartedMsg() {
    this.todayVisitService.hideVisitStartedMessage();
  }

  public toTitleCase(text: string): string {
    return (new TitleCasePipe()).transform(text);
  }

  public checkForAlreadyLoadedVisits() {
    if (_.isEmpty(this.todayVisitService.programVisits) ||
      this.todayVisitService.needsVisitReload) {
      this.triggerVisitLoading();
    } else {
      this.onVisitLoadedEvent();
    }

  }

  public subscribeToVisitsServiceEvents() {
    this.todayVisitService.visitsEvents
      .subscribe((event: VisitsEvent) => {
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

      });

    this.getVisitStartedMsgStatus();

  }

  public onProgramVisitsLoadingStarted() {
    this.isBusy = true;
    this.errors = [];
    this.visit = undefined;
    this.visits = [];
    this.patient = undefined;
    this.currentProgramConfig = undefined;
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
    this.programVisitsObj = this.todayVisitService.programVisits;
    this.isBusy = false;
    this.patient = this.todayVisitService.patient === null ?
      undefined : this.todayVisitService.patient;
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
      let config = [];
      let currentEnrollment = {
        'uuid': ''
      };
      if (typeof this.programVisitsObj[this.programUuid] === 'undefined') {
        returnedVisit = null;
      } else {
        returnedVisit = this.programVisitsObj[this.programUuid].currentVisit;
        visits = this.programVisitsObj[this.programUuid].visits;
        config = this.programVisitsObj[this.programUuid].config;
        currentEnrollment = this.programVisitsObj[this.programUuid].enrollment.enrolledProgram;
      }

      this.visit = returnedVisit;
      this.visits = visits;
      this.currentProgramConfig = config;
      this.currentEnrollment = currentEnrollment;
      this.currentProgramEnrollmentUuid = this.currentEnrollment.uuid;
    }
  }

  public triggerVisitLoading() {
    this.onProgramVisitsLoadingStarted();
    this.todayVisitService.getProgramVisits()
      .subscribe(() => { }, (error) => { });
  }
}
