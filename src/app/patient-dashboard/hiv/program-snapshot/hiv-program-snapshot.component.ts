import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

import { Patient } from '../../../models/patient.model';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';
import { CervicalCancerScreeningSummaResourceService } from './../../../etl-api/cervical-cancer-screening-summary-resource.service';
import { Covid19ResourceService } from './../../../etl-api/covid-19-resource-service';
import { PatientReminderService } from '../../common/patient-reminders/patient-reminders.service';
import { PredictionResourceService } from 'src/app/etl-api/prediction-resource.service';

const mdtProgramUuid = 'c4246ff0-b081-460c-bcc5-b0678012659e';
const stdProgramUuid = '781d85b0-1359-11df-a1f1-0026b9348838';

const HivNegativesProgram = [
  'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
  '96047aaf-7ab3-45e9-be6a-b61810fe617d'
];
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
interface Alert {
  label: boolean;
  'label-warning'?: boolean;
  'label-danger'?: boolean;
  'label-success'?: boolean;
  'label-not-assessed'?: boolean;
}
@Component({
  selector: 'hiv-snapshot',
  styleUrls: ['./hiv-program-snapshot.component.css'],
  templateUrl: './hiv-program-snapshot.component.html'
})
export class HivProgramSnapshotComponent implements OnInit {
  @Input() public set enrolledProgrames(enrolledProgrames) {
    this.patientPrograms = enrolledProgrames;
  }
  @Input() public set program(program) {
    this.hasMoriskyScore = program.uuid === stdProgramUuid ? true : false;
    this.curProgram = program;
    _.each(HivNegativesProgram, (p) => {
      if (p === program.uuid) {
        this.displayProgram = false;
      }
    });
  }
  @Input() public patient: Patient;
  @Output() public addBackground = new EventEmitter();

  public hasError = false;
  public hasData = false;
  public hasMoriskyScore = false;
  public clinicalEncounters: any[] = [];
  public patientData: any = {};
  public loadingData = false;
  public hasLoadedData = false;
  public prev_encounter_date: any = '';
  public isVirallyUnsuppressed = false;
  public patientCareStatus: any;
  public hasTransferEncounter = false;
  public latestEncounterLocation: any = {};
  public hasSubsequentClinicalEncounter = false;
  public resolvedCareStatus: any;
  public showCareStatus = true;
  public viralLoadCategory: any = '';
  public viralloadColor = ' ';
  public backgroundColor: any = {
    pink: '#FFC0CB',
    yellow: '#FFFF00'
  };
  public lowViremia: boolean;
  public highViremia: boolean;
  public currentPatientSub: Subscription;

  public _patient: Patient = new Patient({});
  public moriskyScore: any = '';
  public moriskyScore4: any = '';
  public moriskyScore8: any = '';
  public ismoriskyScore8 = false;
  public ismoriskyScore4 = false;
  public moriskyDenominator: any = '';
  public moriskyRating: any = '';
  public isMoriskyScorePoorOrInadequate = false;
  public showCMSummary = false;
  public hivDisclosureStatus: any;
  public cm_treatment_start_date?: Date;
  public cm_treatment_status: any = '';
  public cm_treatment_phase: any = '';
  public cm_treatment_end_date?: Date;
  public latestCervicalScreeningSummary = [];
  public cervicalScreeningSummary = [];
  public covid19VaccinationSummary: Covid19StatusSummary = {
    vaccination_status: '',
    vaccination_status_code: '',
    vaccination_status_code_message: '',
    first_dose_vaccine_administered: '',
    second_dose_vaccine_administered: '',
    covid_screening_outcome_this_visit: ''
  };
  private obs: any[] = [];
  private gbvScreeningResult: any;
  private curProgram: any;
  private patientPrograms: any;
  public displayProgram = true;
  public gbvScreeningLabel: String;
  public eligibleForCovidVaccine = false;

  // IIT Predictions
  public hasPredictedScore = false;
  public prediction: any;

  public isHEIActive = false;
  public age_of_ped_on_last_pcr: number;
  public last_pcr_status: string;
  public last_pcr_date: string;
  public infant_feeding_method: string;

  constructor(
    private hivSummaryResourceService: HivSummaryResourceService,
    private encounterResourceService: EncounterResourceService,
    private locationResource: LocationResourceService,
    private userDefaultPropertiesService: UserDefaultPropertiesService,
    private cervicalCancerScreeningSummaryService: CervicalCancerScreeningSummaResourceService,
    private covid19Service: Covid19ResourceService,
    private predictionResourceService: PredictionResourceService,
    private patientReminderService: PatientReminderService
  ) {}

  public ngOnInit() {
    _.delay(
      (patientUuid) => {
        if (_.isNil(this.patient)) {
          this.hasError = true;
        } else {
          this.isHEIActive = this.patient.enrolledPrograms.some((program) => {
            return (
              program.programUuid === 'a8e7c30d-6d2f-401c-bb52-d4433689a36b' &&
              program.isEnrolled === true
            );
          });
          this.hasData = false;
          this.getHivSummary(patientUuid);
          this.getPredictedScore(patientUuid);
          this.getPatientCervicalScreeningSummary(patientUuid);
          this.getPatientCovid19VaccinationStatus(patientUuid);
          this.patient.person.age > 19
            ? (this.gbvScreeningLabel = 'GBV Screening')
            : (this.gbvScreeningLabel = 'VAC Screening');
        }
      },
      0,
      this.patient.uuid
    );

    this.getMoriskyScore();
  }

  public getHivSummary(patientUuid: string) {
    this.loadingData = true;
    this.hivSummaryResourceService
      .getHivSummary(patientUuid, 0, 10, false, this.isHEIActive)
      .pipe(take(1))
      .subscribe((results) => {
        let latestVlResult: any;
        let latestVlDate = '';
        let latestVl = null;

        this.loadingData = false;
        this.hasLoadedData = true;

        if (results[0]) {
          latestVlResult = this.getlatestVlResult(results);
          latestVlDate = latestVlResult.vl_1_date;
          latestVl = latestVlResult.vl_1;

          this.patientCareStatus = results[0].patient_care_status;
          this.hivDisclosureStatus = results[0].hiv_disclosure_status_value;

          this.gbvScreeningResult = this.checkGbvScreening(
            results[0].gbv_screening_result
          );
        }

        this.clinicalEncounters = this.getClinicalEncounters(results);
        const latestClinicalEncounter = _.first(this.clinicalEncounters);

        this.hasTransferEncounter = this.checkIfHasTransferEncounter(results);
        const transferEncounterIndex = this.getIndexOfTransferEncounter(
          results
        );
        // Add cryptoccocal status
        let cm_treatment_summary: any;
        cm_treatment_summary = this.getPatientCMTreatmentStatus(results);
        if (cm_treatment_summary) {
          if (cm_treatment_summary.on_cm_treatment === 1) {
            this.showCMSummary = true;
          }
          this.cm_treatment_start_date =
            cm_treatment_summary.cm_treatment_start_date;
          this.cm_treatment_status =
            cm_treatment_summary.on_cm_treatment === 1 ? 'On Treatment' : '';
          this.cm_treatment_end_date =
            cm_treatment_summary.cm_treatment_end_date;
          this.cm_treatment_phase =
            cm_treatment_summary.cm_treatment_phase === 1
              ? 'Induction'
              : cm_treatment_summary.cm_treatment_phase === 2
              ? 'Consolidation'
              : cm_treatment_summary.cm_treatment_phase === 3
              ? 'Maintenance'
              : '';
        }

        // Did the patient have a clinical encounter following their transfer encounter i.e. did they return to care?
        this.hasSubsequentClinicalEncounter =
          results.indexOf(latestClinicalEncounter) < transferEncounterIndex
            ? true
            : false;

        this.patientData = _.first(this.clinicalEncounters);
        const patientDataCopy = this.patientData;

        if (!_.isNil(this.patientData)) {
          // assign latest vl and vl_1_date
          this.patientData = Object.assign(patientDataCopy, {
            vl_1_date: latestVlDate,
            vl_1: latestVl
          });
          // flag red if VL > 1000 && (vl_1_date > (arv_start_date + 6 months))
          if (
            (this.patientData.vl_1 > 1000 &&
              moment(this.patientData.vl_1_date) >
                moment(this.patientData.arv_start_date).add(6, 'months')) ||
            this.patientData.prev_arv_line !== this.patientData.cur_arv_line
          ) {
            this.isVirallyUnsuppressed = true;
          }
          this.hasData = true;
          this.latestEncounterLocation = null;
          if (this.patientData.location_uuid) {
            this.resolveLastEncounterLocation(this.patientData.location_uuid);
          }
        }
        if (this.isHEIActive) {
          this.last_pcr_date = this.getLastPCRDate();
          this.last_pcr_status = this.getLastPCRStatus();
          this.infant_feeding_method = this.getInfantFeedingMethod();
          this.age_of_ped_on_last_pcr = moment(this.last_pcr_date).diff(
            moment(this.patientData.birth_date),
            'months'
          );
        }
      });
  }

  public resolveLastEncounterLocation(location_uuid: string) {
    this.locationResource
      .getLocationByUuid(location_uuid, true)
      .pipe(
        finalize(() => {
          this.resolvedCareStatus = this.getPatientCareStatus(
            this.patientCareStatus
          );
        })
      )
      .subscribe(
        (location) => {
          this.latestEncounterLocation = location;
        },
        (error) => {
          console.error('Error resolving locations', error);
        }
      );
  }

  public getPredictedScore(patientUuid: string) {
    this.predictionResourceService
      .getPatientPrediction(patientUuid)
      .subscribe((result) => {
        if (
          result &&
          result.predicted_prob_disengage &&
          result.predicted_risk
        ) {
          this.hasPredictedScore = true;
          this.prediction = result;
        }
      });
  }

  public getViralLoadCategory(latestViralLoad: any) {
    const eligiblility = this.patientReminderService.vl_eligible;
    let isEligible: any;
    _.each(eligiblility, (vl_eligibiliy: any) => {
      if (vl_eligibiliy.title === 'Viral Load Reminder') {
        isEligible = 1;
      }
    });
    switch (true) {
      case isEligible === 1:
        this.viralLoadCategory = 'Missing VL';
        this.viralloadColor = 'purple';
        break;
      case latestViralLoad < 50 && latestViralLoad != null:
        this.viralLoadCategory = 'LDL';
        this.viralloadColor = 'green';
        break;
      case latestViralLoad >= 50 && latestViralLoad < 200:
        this.viralLoadCategory = 'Low Risk Low Level Viremia';
        this.viralloadColor = 'yellowgreen';
        break;
      case latestViralLoad >= 200 && latestViralLoad < 1000:
        this.viralLoadCategory = 'High Risk Low Level Viremia';
        this.viralloadColor = 'orange';
        break;
      case latestViralLoad >= 1000:
        this.viralLoadCategory = 'Suspected Treatment Failure';
        this.viralloadColor = 'red';
        break;
      default:
        this.viralLoadCategory = 'N/A';
        this.viralloadColor = 'black';
        break;
    }
  }

  public getPatientCareStatus(care_status_id: any) {
    const translateMap = {
      '159': 'DECEASED',
      '9079': 'UNTRACEABLE',
      '9080': 'PROCESS OF BEING TRACED',
      '9036': 'HIV NEGATIVE, NO LONGER AT RISK',
      '9083': 'SELF DISENGAGED FROM CARE',
      '6101': 'CONTINUE WITH CARE',
      '1285': 'TRANSFER CARE TO OTHER CENTER',
      '1286': 'TRANSFER TO AMPATH FACILITY',
      '1287': 'TRANSFER TO NON-AMPATH FACILITY',
      '9068': 'TRANSFER TO AMPATH FACILITY, NON-AMRS',
      '9504': 'TRANSFER TO MATERNAL CHILD HEALTH',
      '1594': 'PATIENT TRANSFERRED OUT',
      '9578': 'ENROLL IN AMPATH FACILITY',
      '9164': 'ENROLL CARE IN ANOTHER HEALTH FACILITY',
      '1732': 'AMPATH CLINIC TRANSFER',
      '9579': 'CONTINUE CARE IN OTHER FACILITY',
      '9580': 'FOLLOW-UP CARE PLAN, NOT SURE',
      '5622': 'OTHER',
      '10502': 'NON AMPATH CLINIC TRANSFER'
    };

    /*
      if the patient transferred out and their care status is 'Continue with Care' despite them not returning to care,
      apply a yellow background on their summary snapshot to mark them out as a Transfer Out.
    */
    /*
      if the patient is active in care with a care status of 'Continue with Care' and they are past their RTC date by
      over 1 week, apply a pink background to their snapshot summary and hide their care status.
    */
    if (care_status_id === 6101) {
      if (this.hasTransferEncounter && !this.patientReturnedToCare()) {
        this.showCareStatus = false;
        this.showYellowBackground();
      } else if (
        moment(this.patientData.rtc_date).add(1, 'week') < moment(new Date())
      ) {
        this.showPinkBackground();
      }
    }

    // if patient is a Transfer Out, apply a yellow background to their snapshot summary
    if (
      (this.hasTransferEncounter &&
        this.isNonAmpathTransferOut(care_status_id)) ||
      this.isIntraAmpathTransferFromCurrentLocation(care_status_id)
    ) {
      this.showYellowBackground();
    }

    return this._toProperCase(translateMap[care_status_id]);
  }

  private checkIfHasTransferEncounter(summaries: any[]): boolean {
    if (summaries) {
      return _.some(summaries, (summary: any) => {
        return (
          summary.encounter_type === 116 &&
          summary.encounter_type_name === 'TRANSFERENCOUNTER'
        );
      });
    }
  }

  private getIndexOfTransferEncounter(summaries: any[]): number {
    if (summaries) {
      return _.findIndex(summaries, (summary: any) => {
        return (
          summary.encounter_type === 116 &&
          summary.encounter_type_name === 'TRANSFERENCOUNTER'
        );
      });
    }
  }

  private getClinicalEncounters(summaries: any[]): any[] {
    if (summaries) {
      return _.filter(summaries, (summary: any) => {
        return summary.is_clinical_encounter === 1;
      });
    }
  }

  private showPinkBackground(): void {
    const color = this.backgroundColor.pink;
    this.addBackground.emit(color);
  }

  private showYellowBackground(): void {
    const color = this.backgroundColor.yellow;
    this.addBackground.emit(color);
  }

  private patientReturnedToCare(): boolean {
    return this.hasSubsequentClinicalEncounter ? true : false;
  }

  private isNonAmpathTransferOut(care_status_id) {
    return (
      care_status_id === 1287 ||
      care_status_id === 5622 ||
      care_status_id === 10502
    );
  }

  private isIntraAmpathTransferFromCurrentLocation(care_status_id) {
    const intraAmpathTransferOutConceptIds = [1285, 1286, 9068, 9504];
    if (
      intraAmpathTransferOutConceptIds.includes(care_status_id) &&
      this.hasMatchingLocation()
    ) {
      return true;
    }

    if (
      care_status_id === 9080 &&
      this.hasTransferEncounter &&
      this.hasMatchingLocation()
    ) {
      return true;
    }

    if (care_status_id === 1594 && this.hasMatchingLocation()) {
      return true;
    }
    return false;
  }

  private hasMatchingLocation() {
    const currentlyLoggedInLocation = this.userDefaultPropertiesService.getCurrentUserDefaultLocation();
    if (this.latestEncounterLocation) {
      return this.latestEncounterLocation.display === currentlyLoggedInLocation;
    }
  }

  private getlatestVlResult(hivSummaryData) {
    const orderByVlDate = _.orderBy(
      hivSummaryData,
      (hivSummary) => {
        return moment(hivSummary.vl_1_date);
      },
      ['desc']
    );
    return orderByVlDate[0];
  }

  private _toProperCase(text: string) {
    text = text || '';
    return text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  private checkGbvScreening(screeningResult) {
    if (
      screeningResult === 1 &&
      this.curProgram.uuid === this.patientPrograms[0].programUuid
        ? true
        : false
    ) {
      return 'POSITIVE';
    }
    return false;
  }

  public getMoriskyScore() {
    const previousEncounters = this.getPreviousEncounters(
      this.patient.encounters
    );
    this.getPreviousEncounterDetails(previousEncounters).then((data) => {
      this.obs = data[0].obs;
      this.obs.forEach((obs) => {
        const morisky4_concept_uuid = '315472dc-2b5e-4add-b3b7-bbcf21a8959b';
        const morisky8_concept_uuid = '857caa4e-b566-4a43-ab78-f911c1a8a727';
        if (obs.concept.uuid === morisky4_concept_uuid) {
          this.moriskyScore4 = obs.value;
          this.ismoriskyScore4 = true;
        } else if (obs.concept.uuid === morisky8_concept_uuid) {
          this.ismoriskyScore8 = true;
          this.moriskyScore8 = obs.value;
        }
      });
      if (this.ismoriskyScore8) {
        this.getMorisky8();
      } else if (!this.ismoriskyScore8 && this.ismoriskyScore4) {
        this.getMorisky4();
      } else if (!this.ismoriskyScore8 && !this.ismoriskyScore4) {
        this.setNullMorisky();
      }
      if (this.moriskyScore >= 0 && this.moriskyScore <= 0.25) {
        this.isMoriskyScorePoorOrInadequate = false;
      } else if (this.moriskyScore >= 0.5) {
        this.isMoriskyScorePoorOrInadequate = true;
      }
    });
  }

  public getAllEncounters(encounters) {
    const allEncounters = [];
    encounters = this.patient.encounters;
    _.each(encounters, (encounter: any) => {
      allEncounters.push(encounter);
    });
    return allEncounters;
  }

  public getPreviousEncounters(allEncounters) {
    const previousEncounters = [];
    _.each(allEncounters, (encounter: any) => {
      const encounterType = encounter.encounterType.uuid;
      const encounterDate = moment(encounter.encounterDatetime).format(
        'YYYY-MM-DD-HH'
      );
      if (encounterType === '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f') {
        // Adult Return encounter
        if (
          encounterDate === this.getLastAdultReturnEncounterDate(allEncounters)
        ) {
          previousEncounters.push(encounter);
        }
      }
    });
    return previousEncounters;
  }

  public getLastAdultReturnEncounterDate(allEncounters) {
    const max_date: any[] = [];
    _.each(allEncounters, (encounter: any) => {
      const encounterDate = moment(encounter.encounterDatetime).format(
        'YYYY-MM-DD-HH'
      );
      const today = moment().format('YYYY-MM-DD-HH');
      if (encounterDate !== today) {
        max_date.push(encounterDate);
      }
    });
    return this.getMaximumDate(max_date);
  }

  public getPreviousEncounterDetails(previousEncounters) {
    return new Promise((resolve, reject) => {
      const encounterWithDetails = [];
      let encounterCount = 0;
      let resultCount = 0;
      const checkCount = () => {
        if (resultCount === encounterCount) {
          resolve(encounterWithDetails);
        }
      };
      _.each(previousEncounters, (encounterDetail: any) => {
        const encounterUuid = encounterDetail.uuid;
        encounterCount++;
        this.encounterResourceService
          .getEncounterByUuid(encounterUuid)
          .pipe(
            /* tslint:disable-next-line: no-shadowed-variable */
            take(1)
          )
          .subscribe((encDetail) => {
            encounterWithDetails.push(encDetail);
            resultCount++;
            checkCount();
          });
      });
    });
  }

  public getMorisky4() {
    this.moriskyScore = this.moriskyScore4;
    this.moriskyDenominator = '/4';
    if (this.moriskyScore === 0) {
      this.moriskyRating = 'Good';
    } else if (this.moriskyScore > 0 && this.moriskyScore < 3) {
      this.moriskyRating = 'Inadequate';
    }
  }

  public getMorisky8() {
    this.moriskyScore = this.moriskyScore8;
    this.moriskyDenominator = '/8';
    this.moriskyRating = 'Poor';
    this.isMoriskyScorePoorOrInadequate = true;
  }

  public setNullMorisky() {
    this.moriskyScore = '';
    this.moriskyDenominator = '';
    this.moriskyRating = 'No value';
  }

  public getMaximumDate(all_dates) {
    let max_dt = all_dates[0],
      max_dtObj = new Date(all_dates[0]);
    all_dates.forEach(function (dt, index) {
      if (new Date(dt) > max_dtObj) {
        max_dt = dt;
        max_dtObj = new Date(dt);
      }
    });
    return max_dt;
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

  public getPatientCovid19VaccinationStatus(patientUuid: string): void {
    this.covid19Service
      .getCovid19VaccinationStatus(patientUuid)
      .subscribe((result: Covid19StatusSummary) => {
        if (result) {
          this.covid19VaccinationSummary = result;
        }
      });
  }

  public getPredictionAlertColorCoded(prediction: string): Alert {
    const predictionAlert: Alert = {
      label: false,
      'label-warning': false,
      'label-danger': false,
      'label-success': false,
      'label-not-assessed': false
    };
    switch (prediction) {
      case 'High Risk':
        predictionAlert.label = true;
        predictionAlert['label-danger'] = true;
        break;
      case 'Medium Risk':
        predictionAlert.label = true;
        predictionAlert['label-warning'] = true;
        break;
      default:
        predictionAlert.label = false;
        predictionAlert['label-info'] = true;
        break;
    }

    return predictionAlert;
  }

  public getCovidVaccinationAlert(vaccinationStatusCode: string): Alert {
    const alert: Alert = {
      label: false,
      'label-warning': false,
      'label-danger': false,
      'label-success': false,
      'label-not-assessed': false
    };
    switch (vaccinationStatusCode) {
      case '2':
        alert.label = true;
        alert['label-success'] = true;
        break;
      case '1':
        alert.label = true;
        alert['label-warning'] = true;
        break;
      case '0':
        alert.label = true;
        alert['label-danger'] = true;
        break;
      case 'NA':
        alert.label = true;
        alert['label-not-assessed'] = true;
        break;
      default:
        alert.label = false;
        break;
    }

    return alert;
  }
  public getPatientCMTreatmentStatus(hivSummaryData: any) {
    const latestStatus = _.orderBy(
      hivSummaryData,
      (hivSummary) => {
        return moment(hivSummary.cm_treatment_start_date);
      },
      ['desc']
    );

    return latestStatus[0];
  }

  public getLastPCRDate(): string {
    let last_pcr_date = '';

    if (this.patientData.hiv_dna_pcr_4_date !== null) {
      last_pcr_date = this.patientData.hiv_dna_pcr_4_date;
    } else if (this.patientData.hiv_dna_pcr_3_date !== null) {
      last_pcr_date = this.patientData.hiv_dna_pcr_3_date;
    } else if (this.patientData.hiv_dna_pcr_2_date !== null) {
      last_pcr_date = this.patientData.hiv_dna_pcr_2_date;
    } else if (this.patientData.hiv_dna_pcr_1_date !== null) {
      last_pcr_date = this.patientData.hiv_dna_pcr_1_date;
    } else {
      return '';
    }

    return last_pcr_date;
  }

  public getLastPCRStatus(): string {
    let last_pcr_status: number;

    if (this.patientData.hiv_dna_pcr_resulted !== null) {
      last_pcr_status = this.patientData.hiv_dna_pcr_resulted;
    } else if (this.patientData.hiv_dna_pcr_4 !== null) {
      last_pcr_status = this.patientData.hiv_dna_pcr_4;
    } else if (this.patientData.hiv_dna_pcr_3 !== null) {
      last_pcr_status = this.patientData.hiv_dna_pcr_3;
    } else if (this.patientData.hiv_dna_pcr_2 !== null) {
      last_pcr_status = this.patientData.hiv_dna_pcr_2;
    } else if (this.patientData.hiv_dna_pcr_1 !== null) {
      last_pcr_status = this.patientData.hiv_dna_pcr_1;
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

    return INFANT_FEEDING_METHODS[this.patientData.infant_feeding_method];
  }
}
