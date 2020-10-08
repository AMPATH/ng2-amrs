import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Patient } from '../../../models/patient.model';
import { OncologySummaryResourceService } from '../../../etl-api/oncology-summary-resource.service';
import { PatientService } from '../../services/patient.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'oncology-summary-latest',
  templateUrl: './oncology-summary-latest.component.html',
  styles: []
})
export class OncologySummaryLatestComponent implements OnInit, OnDestroy {
  public loadingSummary = false;
  public subscription: Subscription;
  public patient: Patient;
  public patientUuid: any;
  public errors: any = [];
  public summaryData: any;
  @Input() public programUuid;
  constructor(
    private patientService: PatientService,
    private oncolologySummary: OncologySummaryResourceService
  ) {}

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
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.patientUuid = this.patient.person.uuid;
          this.loadOncologyDataSummary();
        }
      },
      (err) => {
        console.log(err);
        this.loadingSummary = false;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      }
    );
  }

  public loadOncologyDataSummary() {
    this.oncolologySummary
      .getOncologySummary('summary', this.patientUuid, this.programUuid)
      .subscribe(
        (summary) => {
          this.summaryData = summary[0];
          this.loadingSummary = false;
        },
        (error) => {
          this.loadingSummary = false;
          console.log(error);
          this.errors.push({
            id: 'summary',
            message: 'error fetching summary'
          });
        }
      );
  }
}
