import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PatientEncounterService } from './patient-encounters.service';
import { Encounter } from '../../../models/encounter.model';
import { PatientService } from '../../services/patient.service';
import { Subscription } from 'rxjs';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { EncounterTypeFilter } from './encounter-list.component.filterByEncounterType.pipe';

import * as _ from 'lodash';

@Component({
  selector: 'app-patient-encounters',
  templateUrl: './patient-encounters.component.html',
  styleUrls: ['./patient-encounters.component.css']

})
export class PatientEncountersComponent implements OnInit, OnDestroy {
  public encounters: Encounter[];
  public selectedEncounter: Encounter;
  public onEncounterDetail: number;
  public pretty: boolean = false;
  public messageType: string;
  public message: string;
  public isVisible: boolean;
  public dataLoading: boolean = false;
  public patient: any;
  public errors: any = [];
  public encounterTypes: any = [];
  public busyIndicator: any = {
    busy: false,
    message: 'Fetching encounters hang on...' // default message
  };
  private subscription: Subscription;
  constructor(private patientEncounterService: PatientEncounterService,
              private patientService: PatientService,
              private appFeatureAnalytics: AppFeatureAnalytics,
              private router: Router, private route: ActivatedRoute) { }
  public ngOnInit() {
    this.getPatient();
    // load cached result
    // app feature analytics
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Encounter List Loaded', 'ngOnInit');
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public loadPatientEncounters(patientUuid) {
    this.isBusyIndicator(true);
    this.encounters = [];
    let request = this.patientEncounterService
      .getEncountersByPatientUuid(patientUuid)
      .subscribe(
        (data) => {
          this.encounters = data;
          this.isVisible = false;
          this.loadEncounterTypes(data);
          // a trick to wait for the encounter list to render
          setTimeout(() => {
            this.dataLoading = false;
          }, 2000);
        },
        (err) => {
          this.dataLoading = false;
          // this.isBusyIndicator(false);
          this.errors.push({
            id: 'visit',
            message: 'error fetching visit'
          });
        });
  }
  public loadEncounterTypes(encounters) {
      if (encounters.length > 0) {
            encounters.forEach((encounter) => {
               this.encounterTypes.push(encounter.encounterType.display);
            });

            this.sortEncounterTpes();
      }

  }
  public sortEncounterTpes() {

       let newUniqueEncounterTypes = _.uniq(this.encounterTypes);

       let sortByAlphOrder = _.sortBy(newUniqueEncounterTypes);

       this.encounterTypes = sortByAlphOrder;

  }
  public getPatient() {
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

  public editEncounter(encounter) {
    if (encounter) {
      this.router.navigate(['../formentry', encounter.form.uuid], {
        relativeTo: this.route,
        queryParams: { encounter: encounter.uuid }
      });
    }
  }

  public loadingIndicator(isBusy) {
    this.isBusyIndicator(isBusy, 'Loading encounter obs...');
  }

  public showEncounterObservations(encounter) {
    if (encounter) {
      this.selectedEncounter = encounter;
      this.onEncounterDetail = Math.random();
      this.pretty = false;
    }

  }

  public showPrettyEncounterViewer(encounter) {
    if (encounter) {
      this.selectedEncounter = encounter;
      this.onEncounterDetail = Math.random();
      this.pretty = true;
    }
  }

  public isBusyIndicator(isBusy: boolean, message: string = 'Please wait...'): void {
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
