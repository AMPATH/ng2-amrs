import { take } from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicationHistoryResourceService } from '../../../etl-api/medication-history-resource.service';
import { PatientService } from '../../services/patient.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'medication-change-history',
  templateUrl: './medication-history.component.html',
  styleUrls: []
})
export class MedicationHistoryComponent implements OnInit, OnDestroy {
  public encounters = [];
  public patient: any;
  public errors: any;
  public subscription: Subscription;
  public previousViralLoad: any;

  constructor(
    private medicationHistoryResourceService: MedicationHistoryResourceService,
    private patientService: PatientService
  ) {}

  public fetchMedicationHistory(report, patientUuid): void {
    this.medicationHistoryResourceService
      .getReport(report, patientUuid)
      .pipe(take(1))
      .subscribe((medication) => {
        this.encounters = this.convertPreviousVlValueTostring(
          medication.result
        );
        console.log(this.encounters);
      });
  }

  public ngOnInit() {
    this.getPatient();
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getPatient() {
    const reportName = 'medical-history-report';
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.fetchMedicationHistory(reportName, patient.person.uuid);
        }
      },
      (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching medication history'
        });
      }
    );
  }
  private convertPreviousVlValueTostring(result) {
    const previousVl = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < result.length; ++i) {
      const data = result[i];
      for (const r in data) {
        if (data.hasOwnProperty(r)) {
          let previousViralLoad = '' + data.previous_vl;
          if (previousViralLoad === 'null') {
            previousViralLoad = ' ';
          }
          data['previousViralLoad'] = previousViralLoad;
        }
      }
      previousVl.push(data);
    }
    return previousVl;
  }
}
