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
  public toxoplasmosisStartDates: any = [];
  public toxoplasmosisEndDates: any = [];
  public kaposisStartDates: any = [];
  public kaposisEndDates: any = [];
  public pcpStartDates: any = [];
  public pcpEndDates: any = [];
  public tbStartdates: any = [];
  public tbEnddates: any = [];
  public cryptococallStartDates: any = [];
  public cryptococallEndDates: any = [];
  public ahdSummary: any = [];
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
        // this.tbStartdates = [];
        if (data) {
          console.log('tb-history: ', data);
          if (data.length > 0) {
            for (const result in data) {
              if (data.hasOwnProperty(result)) {
                const hivsum = data[result];
                console.log('hivsum.tb_tx_start_date: ', hivsum);
                if (
                  hivsum.tb_tx_start_date !== null &&
                  !this.tbStartdates.includes(hivsum.tb_tx_start_date)
                ) {
                  this.tbStartdates = [
                    ...this.tbStartdates,
                    hivsum.tb_tx_start_date
                  ];
                }

                if (!this.tbEnddates.includes(hivsum.tb_tx_end_date)) {
                  this.tbEnddates.push(hivsum.tb_tx_end_date);
                }

                if (
                  !this.cryptococallStartDates.includes(
                    hivsum.cm_treatment_start_date
                  )
                ) {
                  this.cryptococallStartDates.push(
                    hivsum.cm_treatment_start_date
                  );
                }

                if (
                  !this.cryptococallEndDates.includes(
                    hivsum.cm_treatment_end_date
                  )
                ) {
                  this.cryptococallEndDates.push(hivsum.cm_treatment_end_date);
                }

                if (
                  !this.pcpStartDates.includes(
                    hivsum.pcp_prophylaxis_start_date
                  )
                ) {
                  this.pcpStartDates.push(hivsum.pcp_prophylaxis_start_date);
                }

                if (
                  !this.pcpEndDates.includes(hivsum.pcp_prophylaxis_end_date)
                ) {
                  this.pcpEndDates.push(hivsum.pcp_prophylaxis_end_date);
                }

                if (
                  !this.toxoplasmosisStartDates.includes(
                    hivsum.toxoplasmosis_start_date
                  )
                ) {
                  this.toxoplasmosisStartDates.push(
                    hivsum.toxoplasmosis_start_date
                  );
                }

                if (
                  !this.toxoplasmosisEndDates.includes(
                    hivsum.toxoplasmosis_end_date
                  )
                ) {
                  this.toxoplasmosisEndDates.push(
                    hivsum.toxoplasmosis_end_date
                  );
                }

                if (
                  !this.kaposisStartDates.includes(hivsum.kaposis_start_date)
                ) {
                  this.kaposisStartDates.push(hivsum.kaposis_start_date);
                }

                if (!this.kaposisEndDates.includes(hivsum.kaposis_end_date)) {
                  this.kaposisEndDates.push(hivsum.kaposis_end_date);
                }
              }
            }
          }
          console.log('stx: ', this.tbStartdates);
          console.log('tbend: ', this.tbEnddates);
          this.isLoading = false;
        } else {
          this.dataLoaded = true;
        }
      });
    this.subscription.push(summary);
  }
}
