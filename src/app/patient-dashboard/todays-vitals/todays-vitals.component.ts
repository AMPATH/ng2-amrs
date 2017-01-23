import { Component, OnInit } from '@angular/core';
import { PatientService } from '../patient.service';
import { Patient } from '../../models/patient.model';

import { Vital } from '../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';


@Component({
  selector: 'todays-vitals',
  templateUrl: 'todays-vitals.component.html',
  styleUrls: [],
})
export class TodaysVitalsComponent implements OnInit {
  patients: Patient = new Patient({});
  todaysVitals: Vital[] = [];
  errors: any[] = [];
  loadingTodaysVitals: boolean = false;
  dataLoaded: boolean = false;

  constructor(private patientService: PatientService, private vitalService: TodaysVitalsService) { }
  ngOnInit(): void {
    this.loadTodaysVitals();


  }
  loadTodaysVitals() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patients = patient;
          let params = { patientUuid: patient.person.uuid };
          this.loadingTodaysVitals = true;
          let request = this.vitalService.getTodaysVitals(params);
          request
            .subscribe(
            (data) => {
              if (data.length > 0) {
                this.todaysVitals = data;
              }
              this.loadingTodaysVitals = false;
              this.dataLoaded = true;
            },
            (error) => {
              this.loadingTodaysVitals = false;
              this.errors.push({
                id: 'Todays Vitals',
                message: 'error fetching todays vitals'
              });
            }
            );
        }
      }
    );
  }


}


