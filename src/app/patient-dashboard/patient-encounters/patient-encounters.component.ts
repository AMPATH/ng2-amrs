import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PatientEncounterService } from './patient-encounters.service';
import { Encounter } from '../../models/encounter.model';
import { PatientService } from '../patient.service';
import { Subscription } from 'rxjs';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';



@Component({
  selector: 'app-patient-encounters',
  templateUrl: './patient-encounters.component.html',
  styleUrls: ['./patient-encounters.component.css']

})
export class PatientEncountersComponent implements OnInit, OnDestroy {
  encounters: Encounter[];
  selectedEncounter: Encounter;
  onEncounterDetail: boolean = false;
  messageType: string;
  message: string;
  isVisible: boolean;
  dataLoading: boolean = false;
  patient: any;
  errors: any = [];
  subscription: Subscription;
  public busyIndicator: any = {
    busy: false,
    message: 'Fetching encounters hang on...' // default message
  };
  constructor(private patientEncounterService: PatientEncounterService,
    private patientService: PatientService,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private router: Router, private route: ActivatedRoute) { }
  ngOnInit() {
    this.getPatient();
    // load cached result
    // app feature analytics
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Encounter List Loaded', 'ngOnInit');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadPatientEncounters(patientUuid) {
    this.encounters = [];
    this.isBusyIndicator(true);
    let request = this.patientEncounterService
      .getEncountersByPatientUuid(patientUuid)
      .subscribe(
      (data) => {
        this.isBusyIndicator(false);
        this.encounters = data;
        this.isVisible = false;
        this.dataLoading = false;
      },

      (err) => {
        this.dataLoading = false;
        this.isBusyIndicator(false);
        this.errors.push({
          id: 'visit',
          message: 'error fetching visit'
        });
      });
  }
  getPatient() {
    this.dataLoading = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient !== null) {
          this.patient = patient;
          this.loadPatientEncounters(patient.person.uuid);
        }
      }
      , (err) => {

        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  editEncounter(encounter) {
    if (encounter) {
      this.router.navigate(['../formentry', encounter.form.uuid], {
        relativeTo: this.route,
        queryParams: { encounter: encounter.uuid }
      });
    }
  }

  loadingIndicator(isBusy) {
    this.isBusyIndicator(isBusy, 'Loading encounter obs...');
  }

  showEncounterObservations(encounter) {
    if (encounter) {
      this.selectedEncounter = encounter;
      this.onEncounterDetail = true;
    }

  }

  private isBusyIndicator(isBusy: boolean, message: string = 'Please wait...'): void {
    if (isBusy === true) {
      this.busyIndicator = {
        busy: true,
        message: message
      };
    } else {
      this.busyIndicator = {
        busy: false,
        message: message
      };
    }

  }
}
