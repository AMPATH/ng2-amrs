import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
  public ahdSummary: Array<any> = [];
  public subscription: Subscription[] = [];
  public errors: any = [];
  public loadingAhdSummary = false;
  public isLoading: boolean;
  public nextStartIndex = 0;

  constructor(
    private patientService: PatientService,
    private hivSummaryService: HivSummaryService
  ) {}

  public ngOnInit() {
    this.loadPatient();
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
                this.ahdSummary.push(hivsum);
              }
            }
            const size: number = data.length;
            this.nextStartIndex = this.nextStartIndex + size;

            this.isLoading = false;
          } else {
            this.dataLoaded = true;
          }
        }
      });
    this.subscription.push(summary);
  }

  public ngOnDestroy() {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
