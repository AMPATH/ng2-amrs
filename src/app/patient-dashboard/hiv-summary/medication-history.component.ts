
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicationHistoryResourceService } from
  '../../etl-api/medication-history-resource.service';
import { PatientService } from '../patient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'medication-change-history',
  templateUrl: 'medication-history.component.html',
  styleUrls: []
})
export class MedicationHistoryComponent implements OnInit, OnDestroy {
  encounters = [];
  patient: any;
  errors: any;
  subscription: Subscription;

  constructor(private medicationHistoryResourceService: MedicationHistoryResourceService,
    private patientService: PatientService) {
  }

  fetchMedicationHistory(report, patientUuid): void {
    this.medicationHistoryResourceService.getReport(report, patientUuid)
      .subscribe(
      (medication) => {
        this.encounters = medication.result;
      }
      );
  }

  ngOnInit() {
    this.getPatient();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getPatient() {
    let reportName = 'medical-history-report';
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.fetchMedicationHistory(reportName, patient.person.uuid);
        }
      }
      , (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching medication history'
        });
      });
  }

}
