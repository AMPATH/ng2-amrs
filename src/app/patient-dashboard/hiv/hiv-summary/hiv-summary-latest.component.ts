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
import { CervicalCancerScreeningSummaResourceService } from './../../../etl-api/cervical-cancer-screening-summary-resource.service';
import { Covid19ResourceService } from './../../../etl-api/covid-19-resource-service';

interface Covid19StatusSummary {
  vaccination_status: string;
  vaccination_status_code: string;
  vaccination_status_code_message: string;
  date_given_first_dose?: Date;
  first_dose_vaccine_administered: string;
  date_given_second_dose?: Date;
  second_dose_vaccine_administered: string;
  covid_screening_outcome_this_visit: string;
}
@Component({
  selector: 'hiv-summary-latest',
  templateUrl: './hiv-summary-latest.component.html',
  styleUrls: ['./hiv-summary.component.css']
})
export class HivSummaryLatestComponent implements OnInit, OnDestroy {
  @Input() patientUuid: string;
  @Input() isHEIActive: boolean = false;
  public loadingHivSummary: boolean = false;
  public hivSummary: any;
  public subscription: Subscription[] = [];
  public patient: Patient;
  public errors: any = [];
  public eligiblePatient: boolean;
  public ineligibiltyReason: string;
  public contraceptionPeriod: string;
  public ovcStatus: any;
  public iptProphylaxisMedication: any;
  public colorCode: any;
  public exitedCare: any;
  public latestCervicalScreeningSummary = [];
  public cervicalScreeningSummary: any;
  public covid19VaccinationSummary: Covid19StatusSummary = {
    vaccination_status: '',
    vaccination_status_code: '',
    vaccination_status_code_message: '',
    first_dose_vaccine_administered: '',
    second_dose_vaccine_administered: '',
    covid_screening_outcome_this_visit: ''
  };
  public lastPCRDate: string;
  public lastPCRStatus: string;
  public infantFeedingMethod: string;
  public heiOutCome: string;
  public pcpProphylaxis: string;

  constructor(
    private hivSummaryService: HivSummaryService,
    private _encounterResource: EncounterResourceService,
    private patientService: PatientService,
    private patientResourceService: PatientResourceService,
    private cervicalCancerScreeningSummaryService: CervicalCancerScreeningSummaResourceService,
    private covid19VaccineService: Covid19ResourceService
  ) {}

  public ngOnInit() {
    this.loadPatient();
    this.loadHivSummary(this.patientUuid);
    this.getPatientCervicalScreeningSummary(this.patientUuid);
    this.getPatientCovid19VaccineStatus(this.patientUuid);
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
    const nonEnrollmentEncounter = encounters.filter((enc) => {
      if (enc.encounterType.uuid === '824ca90d-c313-4d7e-bc99-119871d927cb') {
        return enc.uuid;
      }
    });
    const exitEncounter = encounters.filter((enc) => {
      if (enc.encounterType.uuid === '06e5321e-fc08-4995-aaa3-19c76b48cd22') {
        this.exitedCare = true;
        return enc.uuid;
      }
    });
    if (exitEncounter.length > 0) {
      this._encounterResource
        .getEncounterByUuid(exitEncounter[0].uuid)
        .subscribe((data) => {
          this.colorCode = 'list-group-item-danger';
          data.obs.filter((ob) => {
            if (ob.concept.uuid === 'a89e3f94-1350-11df-a1f1-0026b9348838') {
              this.ovcStatus = `Exited:  ${ob.value.display}`;
            }
          });
        });
    }
    if (nonEnrollmentEncounter.length > 0) {
      this._encounterResource
        .getEncounterByUuid(nonEnrollmentEncounter[0].uuid)
        .subscribe((data) => {
          this.colorCode = 'list-group-item-danger';
          data.obs.filter((ob) => {
            if (ob.concept.uuid === '33d36d0a-4d1b-404c-8f09-e891af4dadbe') {
              this.ovcStatus = `Decline Reason: ${ob.value}`;
            } else if (
              ob.concept.uuid === '06bbb2b0-e2a8-42bc-978f-5dc1eb16ebc1'
            ) {
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
    this.patientResourceService.getPatientByUuid(this.patientUuid).subscribe(
      (data: Patient) => {
        this.patient = data;
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
  }

  public loadHivSummary(patientUuid) {
    const summarySub = this.hivSummaryService
      .getHivSummary(patientUuid, 0, 1, false, this.isHEIActive)
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

                if (summary.ipt_start_date != null) {
                  switch (summary.tb_prophylaxis_medication) {
                    case '607':
                      this.iptProphylaxisMedication =
                        'Isoniazid 300mg and Rifapentine 300mg (3HP)';
                      break;
                    case '608':
                      this.iptProphylaxisMedication =
                        'Rifampicin 70mg and Isonaizid 50mg (3RH)';
                      break;
                    case '282':
                      this.iptProphylaxisMedication =
                        'Rifampicin 150mg and Isonaizid 75mg (3RH)';
                      break;
                    case '59':
                      this.iptProphylaxisMedication = 'Isoniazid 100mg (6H)';
                      break;
                    case '60':
                      this.iptProphylaxisMedication = 'Isoniazid 300mg (6H)';
                      break;
                    default:
                      this.iptProphylaxisMedication = '';
                  }
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
            if (this.isHEIActive) {
              this.lastPCRDate = this.getLastPCRDate();
              this.lastPCRStatus = this.getLastPCRStatus();
              this.infantFeedingMethod = this.getInfantFeedingMethod();
              this.heiOutCome = this.getHEIOutcome();
              this.pcpProphylaxis = this.getPCPprophylaxis();
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
              'An error occured while loading Hiv Summary. Please try again.'
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
      if (this.isHEIActive) {
        this.ineligibiltyReason = 'An Infant';
        this.eligiblePatient = false;
      } else if (this.patient.person.gender === 'M') {
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
    if (menstruationStatus === null || menstruationStatus !== 6496) {
      return false;
    }
    if (menstruationStatus === 6496) {
      return true;
    }
  }
  private getOvcEnrollments(enrolledPrograms) {
    const ovc = enrolledPrograms.filter(
      (program) =>
        program.concept.uuid === 'a89fbb12-1350-11df-a1f1-0026b9348838'
    );
    if (ovc.length > 0 && ovc[0].isEnrolled) {
      return true;
    }
  }
  public getPatientCervicalScreeningSummary(patientUuid: string): void {
    this.cervicalCancerScreeningSummaryService
      .getCervicalCancerScreeningSummary(patientUuid)
      .subscribe(
        (result) => {
          if (result) {
            this.cervicalScreeningSummary = result;
            if (result.length > 0) {
              this.latestCervicalScreeningSummary = result[0];
            }
          }
        },
        (error) => {
          console.log('Error', error);
        }
      );
  }
  public getPatientCovid19VaccineStatus(patientUuid: string): void {
    this.covid19VaccineService
      .getCovid19VaccinationStatus(patientUuid)
      .subscribe((result: Covid19StatusSummary) => {
        if (result) {
          this.covid19VaccinationSummary = result;
        }
      });
  }

  public getLastPCRDate(): string {
    const last_pcr_date = this.hivSummary.hiv_dna_pcr_date;
    return last_pcr_date.slice(0, 10);
  }

  public getLastPCRStatus(): string {
    let last_pcr_status: number;

    if (this.hivSummary.hiv_dna_pcr_resulted !== null) {
      last_pcr_status = this.hivSummary.hiv_dna_pcr_resulted;
    } else if (this.hivSummary.hiv_dna_pcr_4 !== null) {
      last_pcr_status = this.hivSummary.hiv_dna_pcr_4;
    } else if (this.hivSummary.hiv_dna_pcr_3 !== null) {
      last_pcr_status = this.hivSummary.hiv_dna_pcr_3;
    } else if (this.hivSummary.hiv_dna_pcr_2 !== null) {
      last_pcr_status = this.hivSummary.hiv_dna_pcr_2;
    } else if (this.hivSummary.hiv_dna_pcr_1 !== null) {
      last_pcr_status = this.hivSummary.hiv_dna_pcr_1;
    } else {
      last_pcr_status = null;
    }
    if (last_pcr_status === 664) {
      return 'NEGATIVE';
    } else if (last_pcr_status === 703) {
      return 'POSITIVE';
    } else if (last_pcr_status === 1118) {
      return 'NOT DONE';
    } else if (last_pcr_status === 1138) {
      return 'INDETERMINATE';
    } else if (last_pcr_status === 1304) {
      return 'POOR SAMPLE QUALITY';
    } else {
      return 'NONE';
    }
  }

  public getInfantFeedingMethod(): string {
    const INFANT_FEEDING_METHODS = [
      'NONE',
      'EXPRESSED BREASTMILK',
      'WEANED',
      'INFANT FORMULA',
      'BREASTFEEDING PREDOMINATELY',
      'MIXED FEEDING',
      'BREASTFEEDING EXCLUSIVELY',
      'COW MILK',
      'REGULAR FOOD',
      'BREASTFEEDING',
      'LIQUID FOODS OTHER THAN BREAST MILK',
      'WATER',
      'SOLID FOOD',
      'UJI',
      'OTHER NON-CODED',
      'COMPLEMENTARY FEEDING',
      'PLUMPY NUT',
      'NEVER BREASTFED',
      'CHILD ON REPLACEMENT FEEDING'
    ];

    return INFANT_FEEDING_METHODS[this.hivSummary.infant_feeding_method];
  }

  public getHEIOutcome(): string {
    const HEI_OUT_COME = [
      '',
      'PATIENT TRANSFERRED OUT',
      'LOST TO FOLLOWUP',
      'PATIENT DIED',
      'OTHER NON-CODED',
      'DISCHARGED AT 18 MONTHS',
      'HIV COMPREHENSIVE CARE UNIT'
    ];

    const index =
      this.hivSummary.hei_outcome !== null ? this.hivSummary.hei_outcome : 0;

    return HEI_OUT_COME[index];
  }
  public getPCPprophylaxis(): string {
    const pcp = this.hivSummary.pcp_prophylaxis;
    if (pcp === 92) {
      return 'ACZONE';
    }
    if (pcp === 916) {
      return 'SEPTRIN';
    }
    return 'NONE';
  }
}
