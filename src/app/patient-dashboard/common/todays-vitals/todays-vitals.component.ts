import { Observable } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';

import { Vital } from '../../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';
import { Subscription } from 'rxjs';
import { EncounterResourceService }
from './../../../openmrs-api/encounter-resource.service';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Component({
  selector: 'todays-vitals',
  templateUrl: './todays-vitals.component.html',
  styleUrls: [],
})
export class TodaysVitalsComponent implements OnInit, OnDestroy {
  public patients: Patient = new Patient({});
  public todaysVitals: Vital[] = [];
  public errors: any[] = [];
  public currentPatientSub: Subscription;
  public loadingTodaysVitals: boolean = false;
  public dataLoaded: boolean = false;

  constructor(
  private patientService: PatientService,
  private vitalService: TodaysVitalsService ,
  private _encounterResourceService: EncounterResourceService) { }

  public ngOnInit(): void {
    this.subscribeToPatientChangeEvent();
  }

 public ngOnDestroy(): void {
    if (this.currentPatientSub) {
      this.currentPatientSub.unsubscribe();
    }
  }

  public getTodaysVitals(patientUuid) {

    this.resetVariables();

    this._encounterResourceService.getEncountersByPatientUuid(patientUuid).
    subscribe((encounters) => {
        this.todaysVitals = [];
        let todaysEncounters = this.getTodaysEncounters(encounters);
        this.getTodaysEncounterDetails(todaysEncounters)
        .then((encounterDetails) => {
          this.vitalService.getTodaysVitals(encounterDetails)
           .then( (data: any) => {
             if (data) {
                 this.loadingTodaysVitals = false;
                 if (data.length > 0) {
                   this.todaysVitals = new Array(data[0]);
                   this.dataLoaded = true;
                 } else {
                   this.dataLoaded = false;
                   this.todaysVitals = [];
                 }
             }
          }).catch((error) => {
            this.loadingTodaysVitals = false;
            this.dataLoaded = true;
            this.errors.push({
              id: 'Todays Vitals',
              message: 'error fetching todays vitals'
            });
          });
        });
    });

  }

  public getTodaysEncounters(encounters) {
    let today = Moment().format('YYYY-MM-DD');
    let todaysEncounters = [];
    _.each(encounters, (encounter: any) => {
        let encounterDate = Moment(encounter.encounterDatetime).format('YYYY-MM-DD');
        if (encounterDate === today) {
           todaysEncounters.push(encounter);
        }
    });

    return todaysEncounters;

  }

  public getTodaysEncounterDetails(todaysEncounters) {

    return new Promise((resolve, reject) => {

      let encounterWithDetails = [];
      let encounterCount = 0;
      let resultCount = 0;

      let checkCount  = () => {

          if (resultCount === encounterCount) {

             resolve(encounterWithDetails);

          }

      };

      _.each(todaysEncounters, (todaysEncounter: any) => {

        let encounterUuid = todaysEncounter.uuid;
        encounterCount++;

        this._encounterResourceService.getEncounterByUuid(encounterUuid)
          .subscribe((encounterDetail) => {

            encounterWithDetails.push(encounterDetail);
            resultCount++;
            checkCount();

          });

      });

    });

  }

  public subscribeToPatientChangeEvent() {
    this.currentPatientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.getTodaysVitals(patient.person.uuid);
        }
      }
    );
  }

 public resetVariables() {
    this.todaysVitals = [];
    this.dataLoaded = false;
    this.loadingTodaysVitals = false;
  }

}
