import { HivSummaryComponent } from './../hiv-summary.component';
import { Component, OnInit, Input } from '@angular/core';
import { HivSummaryResourceService } from 'src/app/etl-api/hiv-summary-resource.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-ahd-events-summary',
  templateUrl: './ahd-events-summary.component.html',
  styleUrls: ['./ahd-events-summary.component.css'],
  providers: [HivSummaryResourceService]
})
export class AhdEventsSummaryComponent implements OnInit {
  // public tbTreatmentSummary: any = '';
  public tbTreatmentStartDate?: Date;
  public tbTreatmentEndDate?: Date;
  public showTbTreatment: boolean;

  constructor(
    private patientService: PatientService,
    private hivSummaryResourceService: HivSummaryResourceService
  ) {}

  ngOnInit() {}

  public getPatientHivSummary(patientUuid: string) {
    this.hivSummaryResourceService
      .getHivSummary(patientUuid, 0, 10)
      .subscribe((results) => {
        let tb_treatment_summary: any;
        tb_treatment_summary = this.getPatientTbTreatmentStatus(results);
        if (tb_treatment_summary) {
          if (tb_treatment_summary.on_tb_treatment === 1) {
            this.showTbTreatment = true;
          }
          this.tbTreatmentStartDate = tb_treatment_summary.tb_tx_start_date;
          this.tbTreatmentStartDate = tb_treatment_summary.tb_tx_start_date;
        }
      });
  }

  public getPatientTbTreatmentStatus(hivSummaryData: any) {
    const latestStatus = _.orderBy(
      hivSummaryData,
      (hivSummary) => {
        return moment(hivSummary.tb_treatment_start_date);
      },
      ['desc']
    );
    return latestStatus[0];
  }
}
