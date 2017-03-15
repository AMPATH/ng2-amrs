import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../patient.service';

import { Patient } from '../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit, OnDestroy {

  patient: Patient;
  subscription: Subscription;
  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService) {
  }
  ngOnInit() {
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
        }
      }
    );
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Info Loaded', 'ngOnInit');
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
