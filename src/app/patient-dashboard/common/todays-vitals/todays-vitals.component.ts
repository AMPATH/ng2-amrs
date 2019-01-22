import { take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';

import { Vital } from '../../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';
import { EncounterResourceService }
  from './../../../openmrs-api/encounter-resource.service';
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
  public loadingTodaysVitals: boolean = false;
  public dataLoaded: boolean = false;
  public showAll: boolean = false;
  private vitalSources: any[] = [];
  private obs: any[] = [];
  public moriskyScore: any = '';
  public moriskyScore4: any = '';
  public moriskyScore8: any = '';
  public ismoriskyScore8: boolean = false;
  public MoriskyDenominator: any = '';

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
    const previousEncounters = this.getPreviousEncounters(this.patient.encounters);
    this.getPreviousEncounterDetails(previousEncounters);
    this.getTodaysEncounterDetails(todaysEncounters)
      .then((encounterDetails) => {
        this.vitalService.getTodaysVitals(patient, encounterDetails, this.vitalSources)
          .then((data: any) => {
            if (data) {
              this.loadingTodaysVitals = false;
              this.todaysVitals = data;
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
    this.getPreviousEncounterDetails(previousEncounters)
      .then((data) => {
        this.obs = data[0].obs;
        new Date(Math.max.apply(null, this.obs.map(function (e) {
          return new Date(e.obsDatetime);
        })));
        this.obs.forEach((obs) => {
          let morisky4_concept_name = 'MORISKY 4 MEDICATION ADHERENCE, TOTAL SCORE';
          let morisky8_concept_name = 'MORISKY MEDICATION ADHERENCE, TOTAL SCORE';
          if (obs.concept.name.display == morisky8_concept_name) {
            this.moriskyScore8 = obs.value;
            this.ismoriskyScore8 = true;
          }
          if (obs.concept.name.display == morisky4_concept_name) {
            this.moriskyScore4 = obs.value;
          }
        });

        if (this.ismoriskyScore8) {
          this.moriskyScore = this.moriskyScore8;
          this.MoriskyDenominator = 8;
        } else if (!this.ismoriskyScore8 && this.moriskyScore4 !== '') {
          this.moriskyScore = this.moriskyScore4;
          this.MoriskyDenominator = 4;
        } else {
          this.moriskyScore = '-';
          this.MoriskyDenominator = '-';
        }
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
      let checkCount = () => {
        if (resultCount === encounterCount) {
          resolve(encounterWithDetails);
        }
      };
      _.each(todaysEncounters, (todaysEncounter: any) => {
        let encounterUuid = todaysEncounter.uuid;
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

  public getPreviousEncounters(encounters) {
    let today = Moment().format('YYYY-MM-DD');
    let previousEncounters = [];
    _.each(encounters, (encounter: any) => {
      let encounterDate = Moment(encounter.encounterDatetime).format('YYYY-MM-DD');
      let encounterType = encounter.encounterType.display;
      if (encounterType === 'ADULTRETURN') {
        var obj = encounters;
        var result = Object.keys(obj).map(function (key) {
          return [obj[key]];
        });
        const encounters_array = Object.keys(encounters).map(i => encounters[i]);
        const max_date: any[] = [];

        encounters_array.forEach((element) => {
          if (Moment(element.encounterDatetime).format('YYYY-MM-DD') == today) {
            // nothing
          } else {
            max_date.push(Moment(element.encounterDatetime).format('YYYY-MM-DD'));
          }
        });
        if (encounterDate !== today && encounterDate === this.getMaximumDate(max_date)) {
          previousEncounters.push(encounter);
        }
      }
    });
    return previousEncounters;
  }

  public getMaximumDate(all_dates) {
    var max_dt = all_dates[0],
      max_dtObj = new Date(all_dates[0]);
    all_dates.forEach(function (dt, index) {
      if (new Date(dt) > max_dtObj) {
        max_dt = dt;
        max_dtObj = new Date(dt);
      }
    });
    return max_dt;

  }


  public getPreviousEncounterDetails(previousEncounters) {

    return new Promise((resolve, reject) => {

      let encounterWithDetails = [];
      let encounterCount = 0;
      let resultCount = 0;

      let checkCount = () => {

        if (resultCount === encounterCount) {

          resolve(encounterWithDetails);

        }

      };

      _.each(previousEncounters, (todaysEncounter: any) => {

        let encounterUuid = todaysEncounter.uuid;
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
