import { Component, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'visit',
  templateUrl: 'visit.component.html',
  styleUrls: ['visit.component.css']
})
export class VisitComponent implements OnInit, OnDestroy {
  public allProgramVisitConfigs: any = {};
  public currentProgramConfig: any;

  public hasFetchedVisits = false;
  public allPatientVisits = [];

  public programUuid: string = '';
  public enrolledPrograms: Array<any> = [];
  public currentProgramEnrollmentUuid: string = '';
  public currentEnrollment: any = undefined;
  public visit: any;

  public patient: any;
  public errors: Array<any> = [];
  public isBusy: boolean = false;

  public get programVisitTypesUuid(): Array<string> {
    if (this.currentProgramConfig &&
      Array.isArray(this.currentProgramConfig.visitTypes)) {
      return _.map(this.currentProgramConfig.visitTypes, (item) => {
        return (item as any).uuid;
      });
    }
    return [];
  }

  public get hasDetermineVisitStatus(): boolean {
    return this.hasFetchedVisits &&
      this.currentProgramConfig;
  }

  private patientChangeSub: Subscription;

  constructor(
    private visitResourceService: VisitResourceService,
    private patientService: PatientService,
    private router: Router,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private route: ActivatedRoute,
    private patientProgramResourceService: PatientProgramResourceService) { }

  public ngOnInit() {
    this.isBusy = true;
    this.subscribeToPatientChanges();
    this.extractSelectedProgramFromUrl();
    // app feature analytics
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Visits Loaded', 'ngOnInit');
  }

  public ngOnDestroy(): void {
    if (this.patientChangeSub) {
      this.patientChangeSub.unsubscribe();
    }
  }

  public fetchAllProgramVisitConfigs() {
    this.allProgramVisitConfigs = {};
    let sub = this.patientProgramResourceService.
      getAllProgramVisitConfigs().subscribe(
      (programConfigs) => {
        this.allProgramVisitConfigs = programConfigs;
        this.determineProgramConfigurationObject();
      },
      (error) => {
        this.errors.push({
          id: 'program configs',
          message: 'There was an error fetching all the program configs'
        });
        console.error('Error fetching program configs', error);
      });
  }

  public getPatientVisits() {
    this.allPatientVisits = [];
    this.hasFetchedVisits = false;

    if (!(this.patient && this.patient.uuid)) {
      return;
    }

    this.visitResourceService
      .getPatientVisits({ patientUuid: this.patient.uuid })
      .subscribe((visits) => {
        this.allPatientVisits = visits;
        this.hasFetchedVisits = true;
        this.determineTodayVisitForProgram();
      }, (error) => {
        this.errors.push({
          id: 'patient visits',
          message: 'There was an error fetching all the patient visits'
        });
        console.error('An error occured while fetching visits', error);
      });
  }

  public subscribeToPatientChanges() {
    this.patientChangeSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          // console.log('this.patient', this.patient);
          if (Array.isArray(patient.enrolledPrograms)) {
            this.enrolledPrograms = patient.enrolledPrograms;
            this.setEnrollmentUuid();
          }
          this.getPatientVisits();
        }
      }
      , (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
        console.error('Error on published patient', err);
      });
  }

  public setEnrollmentUuid() {
    let enrolledPrograms: Array<any> = this.enrolledPrograms;
    enrolledPrograms.forEach((program) => {
      if (program.programUuid === this.programUuid) {
        this.currentProgramEnrollmentUuid = program.enrolledProgram.uuid;
        this.currentEnrollment = program.enrolledProgram;
        console.log('program', program);
      }
    });
  }

  public determineTodayVisitForProgram() {
    if (!(this.currentProgramConfig && this.hasFetchedVisits)) {
      this.visit = undefined;
      return;
    }

    // Filter out visits not in the program
    let programVisits = this.filterOutNonProgramVisits();
    let orderedVisits = this.sortVisitsByVisitStartDateTime(programVisits);

    if (orderedVisits.length > 0 &&
      moment(orderedVisits[0].startDatetime).isSame(moment(), 'days')) {
      this.visit = orderedVisits[0];
    } else {
      this.visit = undefined;
    }

    this.isBusy = false;
  }

  public filterOutNonProgramVisits(): Array<any> {
    return this.filterVisitsByVisitTypes(this.allPatientVisits, this.programVisitTypesUuid);
  }

  public filterVisitsByVisitTypes(visits: Array<any>, visitTypes: Array<string>): Array<any> {
    let returnVal = [];
    returnVal = _.filter(visits, (visit) => {
      let inType = _.find(visitTypes, (type) => {
        return type === visit.visitType.uuid;
      });
      if (inType) {
        return true;
      }
      return false;
    });
    return returnVal;
  }

  public sortVisitsByVisitStartDateTime(visits: Array<any>) {
    // sorts this in descending order
    return visits.sort((a, b) => {
      return moment(b.startDatetime).diff(moment(a.startDatetime), 'seconds');
    });
  }

  public determineProgramConfigurationObject() {
    this.currentProgramConfig = this.allProgramVisitConfigs[this.programUuid];
    this.determineTodayVisitForProgram();
  }

  public extractSelectedProgramFromUrl() {
    this.route.params.subscribe((params) => {
      if (params) {
        this.programUuid = params['program'];
        if (this.programUuid) {
          this.fetchAllProgramVisitConfigs();
          this.setEnrollmentUuid();
        }
      }
    });
  }

  public onFormSelected(form) {
    if (form) {
      this.router.navigate(['../formentry', form.uuid],
        {
          relativeTo: this.route,
          queryParams: { visitUuid: this.visit.uuid }
        });
    }
  }

  public onEncounterSelected(encounter) {
    if (encounter) {
      this.router.navigate(['../formentry', encounter.form.uuid], {
        relativeTo: this.route,
        queryParams: { encounter: encounter.uuid }
      });
    }
  }

  public onVisitStartedOrChanged(visit) {
    this.isBusy = true;
    this.getPatientVisits();
  }

}
