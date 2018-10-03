import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import { OncologySummaryResourceService
} from '../../../etl-api/oncology-summary-resource.service';

@Component({
  selector: 'oncology-diagnosis-history',
  templateUrl: './oncology-diagnosis-history.component.html',
  styles: []
})
export class OncologyDiagnosisHistoryComponent implements OnInit, OnDestroy {

  public loadingSummary = false;
  public subscription: Subscription;
  public patient: Patient;
  public patientUuid: any;
  public errors: any = [];
  public patientData: any;

  constructor(
    private patientService: PatientService,
    private oncolologySummary: OncologySummaryResourceService) {
  }

  public ngOnInit() {
    this.getPatient();
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
    this.loadingSummary = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe((patient) => {
        if (patient) {
          this.patient = patient;
          this.patientUuid = this.patient.person.uuid;
          this.loadOncologyDiagnosisHistory();
        }
      }, (err) => {
        this.loadingSummary = false;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  public loadOncologyDiagnosisHistory() {
    this.oncolologySummary.getOncologySummary('diagnosis-history', this.patientUuid, 0 , 1).subscribe((summary) => {
      console.log('Diagnosis ', summary);
      this.loadingSummary = false;
    }, (error) => {
      this.loadingSummary = false;
      console.log(error);
      this.errors.push({
        id: 'summary',
        message: 'error fetching medication history'
      });
    });
  }

}
