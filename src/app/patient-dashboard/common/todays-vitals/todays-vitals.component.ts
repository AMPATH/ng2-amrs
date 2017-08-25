import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';

import { Vital } from '../../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';
import { Subscription } from 'rxjs';

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

  constructor(private patientService: PatientService, private vitalService: TodaysVitalsService) { }
  public ngOnInit(): void {
    this.subscribeToPatientChangeEvent();
  }

 public ngOnDestroy(): void {
    if (this.currentPatientSub) {
      this.currentPatientSub.unsubscribe();
    }
  }

  public subscribeToPatientChangeEvent() {
    this.currentPatientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.loadTodaysVitalsForPatient(patient.person.uuid);
        }
      }
    );
  }

  public loadTodaysVitalsForPatient(patientUuid: string) {
    this.resetVariables();
    if (patientUuid) {
      let params = { patientUuid: patientUuid };
      this.loadingTodaysVitals = true;
      let request = this.vitalService.getTodaysVitals(params);
      request
        .subscribe(
        (data) => {
          this.loadingTodaysVitals = false;
          if (data.length >= 1) {
            this.todaysVitals = data;
            this.dataLoaded = true;
          } else {
            this.dataLoaded = false;
          }

        },
        (error) => {
          this.loadingTodaysVitals = false;
          this.dataLoaded = true;
          this.errors.push({
            id: 'Todays Vitals',
            message: 'error fetching todays vitals'
          });
        }
        );
    }
  }

 public resetVariables() {
    this.todaysVitals = [];
    this.dataLoaded = false;
    this.loadingTodaysVitals = false;
  }

}
