import { take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';

import { Vital } from '../../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';
import { EncounterResourceService } from './../../../openmrs-api/encounter-resource.service';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { CommonVitalsSource } from './sources/common-vitals.source';
import { HivTriageSource } from './sources/hiv-triage.source';
import { OncologyTriageSource } from './sources/oncology-triage.source';
import { ZScoreSource } from './sources/z-score.source';

@Component({
  selector: 'todays-vitals',
  templateUrl: './todays-vitals.component.html',
  styles: [
    `
      .list-group-item.show-more {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .list-group-item.row {
        margin-left: 0;
        margin-right: 0;
      }

      .list-group-item.row span.value {
        padding-left: 10px;
      }

      .list-group-item i {
        line-height: 25px;
        font-size: 32px;
        position: absolute;
        right: 15px;
        top: 12px;
        background-color: #fff;
        padding-left: 15px;
      }`,
    `@media screen and (min-width: 768px) {
      .list-group-item i {
        display: none;
      }
    }`
  ],
})
export class TodaysVitalsComponent implements OnInit, OnDestroy {
  public patient: Patient = new Patient({});
  public todaysVitals: Array<Vital | any> = [];
  public errors: any[] = [];
  public currentPatientSub: Subscription;
  public loadingTodaysVitals = false;
  public dataLoaded = false;
  public showAll = false;
  private vitalSources: any[] = [];
  private obs: any[] = [];

  constructor(
    private patientService: PatientService,
    private vitalService: TodaysVitalsService,
    private _encounterResourceService: EncounterResourceService) {
  }

  public ngOnInit(): void {
    this.vitalSources = [
      CommonVitalsSource,
      HivTriageSource,
      OncologyTriageSource,
      ZScoreSource
    ];
    this.subscribeToPatientChangeEvent();
  }

  public ngOnDestroy(): void {
    if (this.currentPatientSub) {
      this.currentPatientSub.unsubscribe();
    }
  }

  public toggleMore() {
    this.showAll = !this.showAll;
  }

  public getTodaysVitals(patient: Patient) {
    this.resetVariables();
    const todaysEncounters = this.getTodaysEncounters(this.patient.encounters);
    this.getTodaysEncounterDetails(todaysEncounters)
      .then((encounterDetails) => {
        this.vitalService.getTodaysVitals(patient, encounterDetails, this.vitalSources)
          .then((data: any) => {
            if (data) {
              this.loadingTodaysVitals = false;
              this.todaysVitals = _.filter(data, 'show');
              this.dataLoaded = true;
            }
          }).catch((error) => {
            this.loadingTodaysVitals = false;
            this.dataLoaded = true;
            console.log(error);
            this.errors.push({
              id: 'Todays Vitals',
              message: 'error fetching todays vitals'
            });
          });
      }).catch((err) => {
        console.log('we are in here', err);
      });
  }


  public getTodaysEncounters(encounters) {
    const today = Moment().format('YYYY-MM-DD');
    const todaysEncounters = [];
    _.each(encounters, (encounter: any) => {
      const encounterDate = Moment(encounter.encounterDatetime).format('YYYY-MM-DD');
      if (encounterDate === today) {
        todaysEncounters.push(encounter);
      }
    });

    return todaysEncounters;

  }

  public getTodaysEncounterDetails(todaysEncounters) {
    return new Promise((resolve, reject) => {
      const encounterWithDetails = [];
      let encounterCount = 0;
      let resultCount = 0;
      const checkCount = () => {
        if (resultCount === encounterCount) {
          resolve(encounterWithDetails);
        }
      };
      _.each(todaysEncounters, (todaysEncounter: any) => {
        const encounterUuid = todaysEncounter.uuid;
        encounterCount++;
        this._encounterResourceService.getEncounterByUuid(encounterUuid).pipe(
          take(1)).subscribe((encounterDetail) => {
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
          this.patient = patient;
          this.getTodaysVitals(patient);
        }
      }
    );
  }

  public resetVariables() {
    this.todaysVitals = undefined;
    this.dataLoaded = false;
    this.loadingTodaysVitals = false;
  }

}
