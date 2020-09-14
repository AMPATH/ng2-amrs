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

const mdtProgramUuid = 'c4246ff0-b081-460c-bcc5-b0678012659e';
const stdProgramUuid = '781d85b0-1359-11df-a1f1-0026b9348838';
@Component({
  selector: 'hiv-snapshot',
  styleUrls: ['./hiv-program-snapshot.component.css'],
  templateUrl: './hiv-program-snapshot.component.html'
})
export class HivProgramSnapshotComponent implements OnInit {
  @Input() public set program(program) {
    this.showViremiaAlert = program.uuid === mdtProgramUuid ? true : false;
    this.hasMoriskyScore = program.uuid === stdProgramUuid ? true : false;
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
  public backgroundColor: any = {
    pink: '#FFC0CB',
    yellow: '#FFFF00'
  };
  public viremiaAlert: string;
  public showViremiaAlert: boolean;
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
  public hivDisclosureStatus: any;
  private obs: any[] = [];

  constructor(
    private hivSummaryResourceService: HivSummaryResourceService,
    private encounterResourceService: EncounterResourceService,
    private locationResource: LocationResourceService,
    private userDefaultPropertiesService: UserDefaultPropertiesService) {
  }

  public ngOnInit() {
    _.delay((patientUuid) => {
      if (_.isNil(this.patient)) {
        this.hasError = true;
      } else {
        this.hasData = false;
        this.getHivSummary(patientUuid);
      }
    }, 0, this.patient.uuid);
    this.getMoriskyScore();
  }

  public getHivSummary(patientUuid) {
    this.loadingData = true;
    this.hivSummaryResourceService.getHivSummary(patientUuid, 0, 10).pipe(take(1)).subscribe((results) => {
      let latestVlResult: any;
      let latestVlDate = '';
      let latestVl = null;

      this.loadingData = false;
      this.hasLoadedData = true;

      if (results[0]) {
        latestVlResult = this.getlatestVlResult(results);
        latestVlDate = latestVlResult.vl_1_date;
        latestVl = latestVlResult.vl_1;
        latestVl = latestVlResult.vl_1;
        this.patientCareStatus = results[0].patient_care_status;
        this.hivDisclosureStatus = results[0].hiv_status_disclosed === 1 ? 'Yes' : 'No';

        if (this.showViremiaAlert) {
          this.checkViremia(latestVl);
        }
      }

      this.clinicalEncounters = this.getClinicalEncounters(results);
      const latestClinicalEncounter = _.first(this.clinicalEncounters);

      this.hasTransferEncounter = this.checkIfHasTransferEncounter(results);
      const transferEncounterIndex = this.getIndexOfTransferEncounter(results);

      // Did the patient have a clinical encounter following their transfer encounter i.e. did they return to care?
      this.hasSubsequentClinicalEncounter = (results.indexOf(latestClinicalEncounter) < transferEncounterIndex) ? true : false;

      this.patientData = _.first(this.clinicalEncounters);
      const patientDataCopy = this.patientData;

      if (!_.isNil(this.patientData)) {
        // assign latest vl and vl_1_date
        this.patientData = Object.assign(patientDataCopy,
          { vl_1_date: latestVlDate, vl_1: latestVl });
        // flag red if VL > 1000 && (vl_1_date > (arv_start_date + 6 months))
        if ((this.patientData.vl_1 > 1000 && (
          moment(this.patientData.vl_1_date) >
          moment(this.patientData.arv_start_date).add(6, 'months')
        )) || (this.patientData.prev_arv_line !== this.patientData.cur_arv_line)) {
          this.isVirallyUnsuppressed = true;
        }
        this.hasData = true;
        this.latestEncounterLocation = null;
        if (this.patientData.location_uuid) {
          this.resolveLastEncounterLocation(this.patientData.location_uuid);
        }
      }
    });
  }

  public resolveLastEncounterLocation(location_uuid) {
    this.locationResource.getLocationByUuid(location_uuid, true)
      .pipe(
        finalize(() => {
          this.resolvedCareStatus = this.getPatientCareStatus(this.patientCareStatus);
        })).subscribe((location) => {
          this.latestEncounterLocation = location;
        }, (error) => {
          console.error('Error resolving locations', error);
        });
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
      } else if (moment(this.patientData.rtc_date).add(1, 'week') < moment(new Date())) {
        this.showPinkBackground();
      }
    }

    // if patient is a Transfer Out, apply a yellow background to their snapshot summary
    if ((this.hasTransferEncounter && this.isNonAmpathTransferOut(care_status_id))
        || this.isIntraAmpathTransferFromCurrentLocation(care_status_id)) {
      this.showYellowBackground();
    }

    return this._toProperCase(translateMap[care_status_id]);
  }

  private checkIfHasTransferEncounter(summaries: any[]): boolean {
    if (summaries) {
      return _.some(summaries, (summary: any) => {
        return summary.encounter_type === 116 && summary.encounter_type_name === 'TRANSFERENCOUNTER';
      });
    }
  }

  private getIndexOfTransferEncounter(summaries: any[]): number {
    if (summaries) {
      return _.findIndex(summaries, (summary: any) => {
        return summary.encounter_type === 116 && summary.encounter_type_name === 'TRANSFERENCOUNTER';
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
    return care_status_id === 1287 || care_status_id === 5622 || care_status_id === 10502;
  }

  private isIntraAmpathTransferFromCurrentLocation(care_status_id) {
    const intraAmpathTransferOutConceptIds = [1285, 1286, 9068, 9504];
    if (intraAmpathTransferOutConceptIds.includes(care_status_id) && this.hasMatchingLocation()) {
      return true;
    }

    if (care_status_id === 9080 && this.hasTransferEncounter && this.hasMatchingLocation()) {
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
    const orderByVlDate = _.orderBy(hivSummaryData, (hivSummary) => {
      return moment(hivSummary.vl_1_date);
    }, ['desc']);
    return orderByVlDate[0];
  }

  private _toProperCase(text: string) {
    text = text || '';
    return text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() +
        txt.substr(1).toLowerCase();
    });
  }

  private checkViremia(latestVl) {
    if (latestVl >= 1 && latestVl <= 999) {
      this.lowViremia = true;
      this.viremiaAlert = 'Low';
    }
    if (latestVl >= 1000) {
      this.highViremia = true;
      this.viremiaAlert = 'High';
    }
  }

  public getMoriskyScore() {
    const previousEncounters = this.getPreviousEncounters(this.patient.encounters);
    this.getPreviousEncounterDetails(previousEncounters)
      .then((data) => {
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
      const encounterDate = moment(encounter.encounterDatetime).format('YYYY-MM-DD-HH');
      if (encounterType === '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f') { // Adult Return encounter
        if (encounterDate === this.getLastAdultReturnEncounterDate(allEncounters)) {
          previousEncounters.push(encounter);
      }
    }
    });
    return previousEncounters;
  }

  public getLastAdultReturnEncounterDate(allEncounters) {
    const max_date: any[] = [];
    _.each(allEncounters, (encounter: any) => {
      const encounterDate = moment(encounter.encounterDatetime).format('YYYY-MM-DD-HH');
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
        this.encounterResourceService.getEncounterByUuid(encounterUuid).pipe(
        /* tslint:disable-next-line: no-shadowed-variable */
          take(1)).subscribe((encounterDetail) => {
            encounterWithDetails.push(encounterDetail);
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
}
