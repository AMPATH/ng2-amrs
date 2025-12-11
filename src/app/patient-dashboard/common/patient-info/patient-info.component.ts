import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { PatientService } from '../../services/patient.service';

import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit, OnDestroy {
  public patient: Patient;
  public subs: Subscription[] = [];
  public display = false;

  constructor(
    private appFeatureAnalytics: AppFeatureAnalytics,
    private patientService: PatientService
  ) {}

  public ngOnInit() {
    const patientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
        }
      }
    );
    this.appFeatureAnalytics.trackEvent(
      'Patient Dashboard',
      'Patient Info Loaded',
      'ngOnInit'
    );
    this.subs.push(patientSub);
  }

  public ngOnDestroy(): void {
    if (this.subs.length) {
      this.subs.forEach((sub: Subscription) => {
        sub.unsubscribe();
      });
    }
  }
}
