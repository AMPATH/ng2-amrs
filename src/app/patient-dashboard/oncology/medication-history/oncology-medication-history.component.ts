import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import { PatientService } from '../../services/patient.service';
import {
  OncologySummaryResourceService
} from '../../../etl-api/oncology-summary-resource.service';

@Component({
  selector: 'oncology-medication-history',
  templateUrl: './oncology-medication-history.component.html',
  styles: []
})
export class OncologyMedicationHistoryComponent implements OnInit, OnDestroy {
  public summaryLoaded = false;
  public hasData = false;
  public loadingSummary = false;
  public subscription: Subscription;
  public patient: Patient;
  public patientUuid: any;
  public errors: any = [];
  public patientData: any;
  public medicalChanges: any;
  @Input() public programUuid;

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
        this.loadOncologyMedicationHistory();
      }
    }, (err) => {
      this.loadingSummary = false;
      this.errors.push({
        id: 'patient',
        message: 'error fetching patient'
      });
    });
  }

  public loadOncologyMedicationHistory() {
    this.oncolologySummary.getOncologySummary('medication-history', this.patientUuid, this.programUuid)
      .subscribe((summary) => {
        this.loadingSummary = false;
        this.summaryLoaded = true;
        if (summary.length) {
          this.medicalChanges = summary;
          this.hasData = true;
        }
      }, (error) => {
        this.loadingSummary = false;
        this.errors.push({
          id: 'summary',
          message: 'Error fetching medication history'
        });
      });
  }

}

