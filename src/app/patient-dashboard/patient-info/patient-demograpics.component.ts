import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../patient.service';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';


@Component({
  selector: 'patient-demographics',
  templateUrl: './patient-demographics.component.html',
  styleUrls : ['patient-demographics.component.css']
})
export class PatientDemographicsComponent implements OnInit, OnDestroy {
  patient: Patient = new Patient({});
  messageType: string;
  message: string;
  isVisible: boolean;
  busy: Subscription;
  errors: any = [];
  subscription: Subscription;

  constructor(private patientService: PatientService,
    private appFeatureAnalytics: AppFeatureAnalytics) { }
  getPatientDemographics() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
