import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

import { Patient } from '../../../models/patient.model';
import {
  OncologySummaryResourceService
} from '../../../etl-api/oncology-summary-resource.service';

@Component({
  selector: 'oncology-snapshot',
  styleUrls: ['./oncology-program-snapshot.component.css'],
  templateUrl: './oncology-program-snapshot.component.html'
})
export class OncologyProgramSnapshotComponent implements OnInit, OnDestroy {
  @Input() public patient: Patient;
  @Input() public programUuid;
  public loadingSummary = false;
  public hasData = false;
  public hasLoadedData = false;
  public isIntegratedProgram = false;
  public hasError = false;
  public subscription: Subscription;
  public patientUuid: any;
  public errors: any = [];
  public summaryData: any;
  public oncologyScreeningAndDiagnosisProgramUuid = '37ff4124-91fd-49e6-8261-057ccfb4fcd0';
  constructor(
    private oncologySummary: OncologySummaryResourceService,
    private integratedProgramSnapshot: OncologySummaryResourceService) {
  }

  public ngOnInit() {
    _.delay((patientUuid) => {
      if (_.isNil(this.patient)) {
        this.hasError = true;
      } else {
        this.hasData = false;
        if (this.programUuid === this.oncologyScreeningAndDiagnosisProgramUuid) {
          this.loadScreeningAndDiagnosisData(patientUuid);
        } else {
          this.loadOncologyDataSummary(patientUuid);
        }

      }
    }, 0, this.patient.uuid);
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public loadOncologyDataSummary(patientUuid) {
    if (this.programUuid && patientUuid) {
      this.loadingSummary = true;
      this.oncologySummary.getOncologySummary('summary', patientUuid, this.programUuid).pipe(take(1)).subscribe((summary) => {
        this.hasLoadedData = true;
        this.loadingSummary = false;
        if (summary.length) {
          this.summaryData = summary[0];
          this.hasData = true;
          this.hasError = false;
        }
      }, (error) => {
        this.loadingSummary = false;
        this.hasData = false;
        this.hasError = true;
        console.error('Error fetching oncology summary: ', error);
        this.errors.push({
          id: 'summary',
          message: 'Error Fetching Summary'
        });
      });
    }
  }

  private loadScreeningAndDiagnosisData(patientUuid: any) {
    this.hasData = false;
    this.hasError = false;
    this.integratedProgramSnapshot.getIntegratedProgramSnapshot(patientUuid)
      .subscribe((screeningSummary) => {
        this.loadingSummary = false;
        this.hasLoadedData = true;
        if (screeningSummary.length) {
          this.summaryData = screeningSummary;
          this.isIntegratedProgram = true;
          this.hasData = true;
          this.hasError = false;
        }
      }, (error => {
        this.loadingSummary = false;
        this.hasData = false;
        this.hasError = true;
        console.error('Error fetching integrated screening summary: ', error);
        this.errors.push({
          id: 'summary',
          message: 'Error Fetching Summary'
        });
      }));
  }
}
