import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as moment from 'moment';
import *  as _ from 'lodash';
import { Subscription, Observable } from 'rxjs';

import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import {
  UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import { PatientService } from '../../services/patient.service';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { PatientProgramResourceService } from '../../../etl-api/patient-program-resource.service';
import { TodayVisitService, VisitsEvent } from './today-visit.service';
import { TitleCasePipe } from '../../../shared/pipes/title-case.pipe';

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

  constructor(
    private todayVisitService: TodayVisitService
  ) { }

  public ngOnInit() {
    this.subscribeToVisitsServiceEvents();
    this.checkForAlreadyLoadedVisits();
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

  public getVisitStartedMsgStatus() {
     this.showVisitStartedMsg = this.todayVisitService.getVisitStartedMsgStatus();
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
