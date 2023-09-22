import { HivSummaryComponent } from './../hiv-summary.component';
import { Component, OnInit } from '@angular/core';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { PatientService } from '../../services/patient.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-ahd-events-summary',
  templateUrl: './ahd-events-summary.component.html',
  styleUrls: ['./ahd-events-summary.component.css']
})
export class AhdEventsSummaryComponent implements OnInit {
  public encounters = [];
  public patient: any;
  public errors: any;
  public subscription: Subscription;

  constructor(
    private patientService: PatientService,
    private hivSummaryResourceService: HivSummaryResourceService,
    private encounterResourceService: EncounterResourceService
  ) {}

  ngOnInit() {}

  public getPatientTbStatus(hivSummaryData: any) {
    const latestStatus = _.orderBy(
      hivSummaryData,
      (hivSummary) => {
        return moment(hivSummary.tb_treatment_start_date);
      },
      ['desc']
    );
  }

  public getPatient() {
    const reportName = 'ahd-events-summary';
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
        }
      },
      (err) => {
        this.errors.push({
          id: 'patient',
          message: 'error fetching ahd events'
        });
      }
    );
  }
}
