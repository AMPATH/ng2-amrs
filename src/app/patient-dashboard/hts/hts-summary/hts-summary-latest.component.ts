import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HTSModuleResourceService } from 'src/app/etl-api/hts-module-resource.service';
import * as _ from 'lodash';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'hts-summary-latest',
  templateUrl: './hts-summary-latest.component.html',
  styleUrls: ['./hts-summary-latest.component.css']
})
export class HtsSummaryLatestComponent implements OnInit, OnDestroy {
  public loadingSummary = false;
  public subscription: Subscription;
  public patient: Patient;
  public patientUuid: string;
  public errors: any = [];
  public summaryData: any;
  public programUuid: string;

  constructor(
    private htsModuleService: HTSModuleResourceService,
    private patientService: PatientService // Inject PatientService
  ) {}

  public ngOnInit(): void {
    this.loadPatientData();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private loadPatientData(): void {
    this.loadingSummary = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.patientUuid = patient.uuid;
          this.loadHTSSummary();
        } else {
          this.loadingSummary = false;
        }
      },
      (err) => {
        this.errors.push({
          id: 'Patient',
          message: 'Error fetching patient data',
          error: err
        });
        this.loadingSummary = false;
      }
    );
  }

  public loadHTSSummary(): void {
    if (!this.patientUuid) {
      this.errors.push({
        id: 'summary',
        message: 'Patient UUID not available'
      });
      this.loadingSummary = false;
      return;
    }

    this.loadingSummary = true;
    this.htsModuleService.getHTSSummary(this.patientUuid).subscribe(
      (summary) => {
        this.loadingSummary = false;

        if (summary.result) {
          this.summaryData = summary.result[1][0];
        }
        if (!this.summaryData) {
          this.errors.push({
            id: 'summary',
            message: 'No HTS summary data available'
          });
        }
      },
      (error) => {
        this.loadingSummary = false;
        this.errors.push({
          id: 'summary',
          message: 'Error fetching HTS summary data'
        });
        console.error('Error fetching HTS summary:', error);
      }
    );
  }
}
