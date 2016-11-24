import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';

import { Subscription } from 'rxjs';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../patient.service';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';


@Component({
  selector: 'patient-demographics',
  templateUrl: './patient-demographics.component.html'
})
export class PatientDemographicsComponent implements OnInit {
  patient: Patient = new Patient({});
  messageType: string;
  message: string;
  isVisible: boolean;
  busy: Subscription;
  errors: any = [];

  constructor(private patientService: PatientService,
    private appFeatureAnalytics: AppFeatureAnalytics) { }
  getPatientDemographics() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          console.log('Patient Object---->', patient);
          this.patient = patient;
        }
      }, (err) => {

        this.errors.push({
          id: 'patient-demographics',
          message: 'error fetching patient'
        });
      });
  }
  ngOnInit() {
    this.getPatientDemographics();
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Lab Orders Loaded', 'ngOnInit');
  }
}
