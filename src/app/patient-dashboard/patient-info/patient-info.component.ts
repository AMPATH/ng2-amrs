import { Component, OnInit } from '@angular/core';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../patient.service';

import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit {

  patient: Patient;

  constructor(private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService) {
  }

  ngOnInit() {
    this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
        }
      }
    );
    this.appFeatureAnalytics
      .trackEvent('Patient Dashboard', 'Patient Info Loaded', 'ngOnInit');
  }

}
