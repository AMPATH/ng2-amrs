import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HivSummaryService } from '../hiv-summary.service';
import { PatientService } from 'src/app/patient-dashboard/services/patient.service';
import { Patient } from 'src/app/models/patient.model';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-ahd-events-summary',
  templateUrl: './ahd-events-summary.component.html',
  styleUrls: ['./ahd-events-summary.component.css']
})
export class AhdEventsSummaryComponent implements OnInit, OnDestroy {
  public patientUuid: any;
  public patient: Patient;
  isHEIActive = false;
  public hasError = false;
  public dataLoaded = false;
  public tbStartdates: Array<any> = [];
  public tbEnddates: Array<any> = [];
  public cryptococallStartDates: Array<any> = [];
  public cryptococallEndDates: Array<any> = [];
  public ahdSummary: Array<any> = [];
  public ahd: any;
  public subscription: Subscription[] = [];
  public errors: any = [];
  public loadingAhdSummary = false;
  public isLoading: boolean;

  constructor(
    private patientService: PatientService,
    private hivSummaryService: HivSummaryService,
    private datePipe: DatePipe
  ) {}

  public ngOnInit() {
    this.loadPatient();
  }

  public ngOnDestroy() {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public loadPatient() {
    this.loadingAhdSummary = true;
    const patientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.patient = patient;
          this.patientUuid = this.patient.person.uuid;
          this.getPatientHivSummary(this.patientUuid);
        }
        this.loadingAhdSummary = false;
      },
      (err) => {
        this.loadingAhdSummary = true;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      }
    );
    this.subscription.push(patientSub);
  }

  public getPatientHivSummary(patientUuid) {
    const summary = this.hivSummaryService
      .getHivSummary(patientUuid, 0, 1, false, this.isHEIActive)
      .subscribe((data) => {
        if (data) {
          if (data.length > 0) {
            for (const result in data) {
              if (data.hasOwnProperty(result)) {
                const hivsum = data[result];
                const tb_start_date = hivsum.tb_tx_start_date;
                const tb_end_date = hivsum.tb_tx_end_date;

                if (!this.tbStartdates.includes(tb_start_date)) {
                  this.tbStartdates.push(tb_start_date);
                  console.log('this.tbStartdates', this.tbStartdates);
                }

                if (!this.tbEnddates.includes(tb_end_date)) {
                  this.tbEnddates.push(tb_end_date);
                }

                if (!this.cryptococallStartDates.includes(tb_start_date)) {
                  this.tbStartdates.push(tb_start_date);
                }

                if (!this.cryptococallEndDates.includes(tb_end_date)) {
                  this.tbEnddates.push(tb_end_date);
                }

                this.ahdSummary.push(hivsum);
              }
            }
          }
          this.isLoading = false;
        } else {
          this.dataLoaded = true;
        }
      });
    this.subscription.push(summary);
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }
}
