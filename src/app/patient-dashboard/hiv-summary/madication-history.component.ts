
import { Component, OnInit } from '@angular/core';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { MedicationHistoryResourceService } from
  '../../etl-api/medication-history-resource.service';
import { PatientService } from '../patient.service';

@Component({
  selector: 'medication-change-history',
  templateUrl: 'medication-history.component.html',
  styleUrls: []
})
export class MedicationHistoryComponent implements OnInit {
  encounters = [];
  patient: any;
  errors: any;

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
  getPatient() {
    let reportName = 'medical-history-report';
    this.patientService.currentlyLoadedPatient.subscribe(
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
