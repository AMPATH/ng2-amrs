import { Component, OnInit } from '@angular/core';

import { PatientService } from '../../services/patient.service';
import { HivSummaryService } from './hiv-summary.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'hiv-summary-latest',
  templateUrl: './hiv-summary-latest.component.html',
  styleUrls: ['./hiv-summary.component.css']
})
export class HivSummaryLatestComponent implements OnInit {
  public loadingHivSummary: boolean = false;
  public hivSummary: any;
  public subscription: Subscription;
  public patient: Patient;
  public patientUuid: any;
  public errors: any = [];

  constructor(private hivSummaryService: HivSummaryService,
              private patientService: PatientService) {}

  public ngOnInit() {
    this.getPatient();
  }

  public getPatient() {
    this.loadingHivSummary = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.patientUuid = this.patient.person.uuid;
          this.loadHivSummary(this.patientUuid);
        }
      }, (err) => {
        this.loadingHivSummary = false;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      });
  }

  public loadHivSummary(patientUuid) {
    this.hivSummaryService.getHivSummary(
      patientUuid, 0, 1, false)
      .subscribe((data) => {
        if (data) {

          for (let summary of data){

            // check if encounter is clinical
            if ( summary.is_clinical_encounter === 1) {

              this.hivSummary = summary;
              let artStartDate =
              new Date(this.hivSummary.arv_first_regimen_start_date).getFullYear();
              if (isNaN(artStartDate) || artStartDate === 1899 || artStartDate === 1900) {
                this.hivSummary.arv_first_regimen_start_date = null;
              }

              break;

          }

         }

          let lastVlDate: any = this.getLatestVlDate(data);
          if (this.endDateIsBeforeStartDate(this.hivSummary.vl_1_date, lastVlDate)) {
            let filtered = _.find(data, (summaryObj: any) => {
              let vlDateMoment = Moment(Moment(summaryObj['vl_1_date']), 'DD-MM-YYYY');
              let lastVlDateMoment = Moment(lastVlDate, 'DD-MM-YYYY');
              if (summaryObj['vl_1_date']) {
                if (vlDateMoment.isSame(lastVlDateMoment)) {
                  return true;
                } else {
                  return false;
                }
              }
            });
       //   Replace the lab data with latest lab results that may not be clinical
            this.hivSummary.vl_1_date = filtered.vl_1_date;
            this.hivSummary.vl_1 = filtered.vl_1;
          }

        }
        this.loadingHivSummary = false;
      }, (err) => {
        this.loadingHivSummary = false;
        this.errors.push({
          id: 'Hiv Summary',
          message: 'An error occured while loading Hiv Summary. Please try again.'
        });
      });
  }

  public endDateIsBeforeStartDate(startDate: any, endDate: any) {
     return Moment(endDate, 'DD-MM-YYYY')
    .isBefore(Moment(startDate, 'DD-MM-YYYY'));
  }

  public isEmptyDate(date: any) {
    if (date) {
      return Moment(date).isValid();
    }
    return false;
  }

  private getLatestVlDate(data) {
  let latestVlDate = new Date(Math.max.apply(null, data.map((dataItem) => {
    return new Date(dataItem.vl_1_date);
  })));
  return latestVlDate;
 }
}
