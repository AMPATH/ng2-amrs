/* tslint:disable:no-inferrable-types */
import { take } from 'rxjs/operators/take';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { PatientService } from '../../services/patient.service';
import { HivSummaryService } from './hiv-summary.service';
import { Patient } from '../../../models/patient.model';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
@Component({
  selector: 'hiv-summary-latest',
  templateUrl: './hiv-summary-latest.component.html',
  styleUrls: ['./hiv-summary.component.css'],
})
export class HivSummaryLatestComponent implements OnInit, OnDestroy {
  @Input() patientUuid: string;
  public loadingHivSummary: boolean = false;
  public hivSummary: any;
  public subscription: Subscription[] = [];
  public patient: Patient;
  public errors: any = [];
  public eligiblePatient: boolean;
  public ineligibiltyReason: string;
  public contraceptionPeriod: string;
  public ovcStatus: any;
  public colorCode: any;
  public exitedCare: any;

  constructor(private hivSummaryService: HivSummaryService, private _encounterResource: EncounterResourceService,
    private patientService: PatientService, private patientResourceService: PatientResourceService) { }

  public ngOnInit() {
    this.loadPatient();
    this.loadHivSummary(this.patientUuid);
    this.checkOvcStatus();
  }
  checkOvcStatus() {
    const checkOVCEnrollment = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.colorCode = 'list-group-item-default';
        this.patient = new Patient({});
        if (patient) {
          this.patient = patient;
          const enrolledPrograms = patient.enrolledPrograms;
          const birthdate = Moment(patient.person.birthdate).format('l');
          const todayMoment: any = Moment();
          const birthDateMoment: any = Moment(birthdate);
          const years = todayMoment.diff(birthDateMoment, 'year');
          if (years > 19) {
            this.ovcStatus = 'Not eligible';
          } else if (years < 19 && this.getOvcEnrollments(enrolledPrograms)) {
            this.ovcStatus = 'Enrolled active';
            this.colorCode = 'list-group-item-success';
          } else if (years < 19 && !this.getOvcEnrollments(enrolledPrograms)) {
            // Check if non-enrollment encounter was filled
            this.checkNonEnrollmentandExitEncounter(patient);
          }
        }
      }
    );
    this.subscription.push(checkOVCEnrollment);
  }
  checkNonEnrollmentandExitEncounter(patient) {
    const encounters = patient.encounters;
    const nonEnrollmentEncounter = encounters.filter(enc => {
      if (enc.encounterType.uuid === '824ca90d-c313-4d7e-bc99-119871d927cb') {
        return enc.uuid;
      }
    });
    const exitEncounter = encounters.filter(enc => {
      if (enc.encounterType.uuid === '06e5321e-fc08-4995-aaa3-19c76b48cd22') {
        this.exitedCare = true;
        return enc.uuid;
      }
    });
    if (exitEncounter.length > 0) {
      this._encounterResource.getEncounterByUuid(exitEncounter[0].uuid).subscribe(data => {
        this.colorCode = 'list-group-item-danger';
        data.obs.filter(ob => {
          if (ob.concept.uuid === 'a89e3f94-1350-11df-a1f1-0026b9348838') {
            this.ovcStatus = `Exited:  ${ob.value.display}`;
          }
        });
      });
    }
    if (nonEnrollmentEncounter.length > 0) {
      this._encounterResource.getEncounterByUuid(nonEnrollmentEncounter[0].uuid).subscribe(data => {
        this.colorCode = 'list-group-item-danger';
        data.obs.filter(ob => {
          if (ob.concept.uuid === '33d36d0a-4d1b-404c-8f09-e891af4dadbe') {
            this.ovcStatus = `Decline Reason: ${ob.value}`;
          } else if (ob.concept.uuid === '06bbb2b0-e2a8-42bc-978f-5dc1eb16ebc1') {
            this.ovcStatus = `Decline Reason: ${ob.value.display}`;
          }
        });
      });

    } else {
      this.ovcStatus = 'Not enrolled. Refer to social worker';
      this.colorCode = 'list-group-item-warning';
    }
  }

  public loadPatient() {
    this.patientResourceService.getPatientByUuid(this.patientUuid).subscribe((data: Patient) => {
      this.patient = data;
    }, (err) => {
      this.loadingHivSummary = false;
      this.errors.push({
        id: 'Hiv Summary',
        message:
          'An error occured while loading Hiv Summary. Please try again.',
      });

    });
  }

  public loadHivSummary(patientUuid) {
    const summarySub = this.hivSummaryService
      .getHivSummary(patientUuid, 0, 1, false)
      .subscribe(
        (data) => {
          if (data) {
            for (const summary of data) {
              // check if encounter is clinical
              if (summary.is_clinical_encounter === 1) {
                this.hivSummary = summary;
                const artStartDate = new Date(
                  this.hivSummary.arv_first_regimen_start_date
                ).getFullYear();
                if (
                  isNaN(artStartDate) ||
                  artStartDate === 1899 ||
                  artStartDate === 1900
                ) {
                  this.hivSummary.arv_first_regimen_start_date = null;
                }

                break;
              }
            }

            const lastVlDate: any = this.getLatestVlDate(data);
            if (
              this.endDateIsBeforeStartDate(
                this.hivSummary.vl_1_date,
                lastVlDate
              )
            ) {
              const filtered = _.find(data, (summaryObj: any) => {
                const vlDateMoment = Moment(
                  Moment(summaryObj['vl_1_date']),
                  'DD-MM-YYYY'
                );
                const lastVlDateMoment = Moment(lastVlDate, 'DD-MM-YYYY');
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
          this.getPatientEligibility(this.hivSummary);
          this.loadingHivSummary = false;
        },
        (err) => {
          this.loadingHivSummary = false;
          this.errors.push({
            id: 'Hiv Summary',
            message:
              'An error occured while loading Hiv Summary. Please try again.',
          });
        }
      );
    this.subscription.push(summarySub);
  }

  public endDateIsBeforeStartDate(startDate: any, endDate: any) {
    return Moment(endDate, 'DD-MM-YYYY').isBefore(
      Moment(startDate, 'DD-MM-YYYY')
    );
  }

  public isEmptyDate(date: any) {
    if (date) {
      return Moment(date).isValid();
    }
    return false;
  }

  public ngOnDestroy() {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private getLatestVlDate(data) {
    const latestVlDate = new Date(
      Math.max.apply(
        null,
        data.map((dataItem) => {
          return new Date(dataItem.vl_1_date);
        })
      )
    );
    return latestVlDate;
  }

  private getPatientEligibility(summary) {
    if (summary) {
      if (this.patient.person.gender === 'M') {
        this.ineligibiltyReason = 'Male Patient';
        this.eligiblePatient = false;
      } else if (
        (this.patient.person.age < 14 || this.patient.person.age > 49) &&
        this.patient.person.gender === 'F'
      ) {
        this.ineligibiltyReason = `Not in reproductive age ${this.patient.person.age}`;
        this.eligiblePatient = false;
      } else if (
        this.patient.person.age >= 14 &&
        this.patient.person.age <= 49 &&
        this.patient.person.gender === 'F' &&
        this.isPostmenopausal(summary.menstruation_status)
      ) {
        this.ineligibiltyReason = 'POSTMENOPAUSAL';
        this.eligiblePatient = false;
      } else if (
        this.patient.person.age >= 14 &&
        this.patient.person.age <= 49 &&
        this.patient.person.gender === 'F'
      ) {
        this.eligiblePatient = true;
      }
    }
  }

  public isPostmenopausal(menstruationStatus: number): boolean {
      // concept 6496  == post-menopausal
      if (menstruationStatus === null || menstruationStatus !== 6496) { return false; }
      if (menstruationStatus === 6496) { return true; }
  }
  private getOvcEnrollments(enrolledPrograms) {
    const ovc = enrolledPrograms.filter(program => program.concept.uuid === 'a89fbb12-1350-11df-a1f1-0026b9348838');
    if (ovc.length > 0 && ovc[0].isEnrolled) {
      return true;
    }
  }
}
