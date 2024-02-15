/* tslint:disable:no-inferrable-types */
import { take } from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Moment from 'moment';
import { PatientService } from '../../services/patient.service';
import { HivSummaryService } from './hiv-summary.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';
import { result } from 'lodash';

@Component({
  selector: 'hiv-summary-historical',
  templateUrl: './hiv-summary-historical.component.html',
  styleUrls: ['./hiv-summary.component.css']
})
export class HivSummaryHistoricalComponent implements OnInit, OnDestroy {
  public isHEIActive = false;
  public loadingHivSummary: boolean = false;
  public hivSummaries: Array<any> = [];
  public patient: Patient;
  public patientUuid: any;
  public subscription: Subscription[] = [];
  public experiencedLoadingError: boolean = false;
  public dataLoaded: boolean = false;
  public errors: any = [];
  public isLoading: boolean;
  public nextStartIndex: number = 0;
  public hasMedicationRtc = false;
  public hasMdtSessionNo = false;
  public showMissedDays: boolean;
  public patientStatus: any;
  public daysMissed = 0;

  constructor(
    private hivSummaryService: HivSummaryService,
    private patientService: PatientService
  ) {}

  public ngOnInit() {
    this.getPatient();
  }

  public ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public getPatient() {
    this.loadingHivSummary = true;
    const patientSub = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        if (patient) {
          this.isHEIActive = patient.enrolledPrograms.some((program) => {
            return (
              program.programUuid === 'a8e7c30d-6d2f-401c-bb52-d4433689a36b' &&
              program.isEnrolled === true
            );
          });
          this.patient = patient;
          this.patientUuid = this.patient.person.uuid;
          this.loadHivSummary(this.patientUuid, this.nextStartIndex);
        }
        this.loadingHivSummary = false;
      },
      (err) => {
        this.loadingHivSummary = true;
        this.errors.push({
          id: 'patient',
          message: 'error fetching patient'
        });
      }
    );
    this.subscription.push(patientSub);
  }

  public hasColumnData(data, field): boolean {
    let hasColumnData = false;

    if (data.hasOwnProperty(field)) {
      if (data[field] !== null) {
        hasColumnData = true;
      }
    }

    return hasColumnData;
  }

  public loadHivSummary(patientUuid, nextStartIndex) {
    const summarySub = this.hivSummaryService
      .getHivSummary(patientUuid, nextStartIndex, 20, false, this.isHEIActive)
      .subscribe(
        (data) => {
          if (data) {
            if (data.length > 0) {
              for (const r in data) {
                if (data.hasOwnProperty(r)) {
                  const hivsum = data[r];
                  this.hivSummaries.push(hivsum);
                  if (this.hasMedicationRtc === false) {
                    this.hasMedicationRtc = this.hasColumnData(
                      data[r],
                      'med_pickup_rtc_date'
                    );
                  }
                  const prev_rtc = new Date(hivsum.prev_rtc_date);
                  const encounter_date = new Date(hivsum.encounter_datetime);
                  const startDate = Moment(encounter_date, 'YYYY-MM-DD');
                  const endDate = Moment(prev_rtc, 'YYYY-MM-DD');
                  const specificDate = Moment('2005-01-01');

                  if (endDate < specificDate) {
                    this.showMissedDays = false;
                  } else {
                    this.showMissedDays = true;
                  }
                  const dateDiffInDays = endDate.diff(startDate, 'days');
                  if (dateDiffInDays > 0) {
                    this.daysMissed = dateDiffInDays;
                  }

                  if (this.hasMdtSessionNo === false) {
                    this.hasMdtSessionNo = this.hasColumnData(
                      data[r],
                      'mdt_session_number'
                    );
                  }
                }
              }
              const size: number = data.length;
              this.nextStartIndex = this.nextStartIndex + size;

              this.isLoading = false;
            } else {
              this.dataLoaded = true;
            }
          }
        },
        (err) => {
          this.loadingHivSummary = false;
          this.errors.push({
            id: 'Hiv Summary',
            message:
              'An error occured while loading Hiv Summary. Please try again.'
          });
        }
      );
    this.subscription.push(summarySub);
  }

  public loadMoreHivSummary() {
    this.isLoading = true;
    this.loadHivSummary(this.patientUuid, this.nextStartIndex);
  }
}
