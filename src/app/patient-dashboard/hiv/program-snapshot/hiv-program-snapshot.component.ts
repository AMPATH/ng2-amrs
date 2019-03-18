/* tslint:disable-next-line: no-shadowed-variable */
import { take } from 'rxjs/operators';

import { Observable, Subscription } from 'rxjs';

import { map } from 'rxjs/operators';
import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

import * as Moment from 'moment';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import * as _ from 'lodash';
import { Patient } from '../../../models/patient.model';
import * as moment from 'moment';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { TodaysVitalsService } from '../../common/todays-vitals/todays-vitals.service';
import { EncounterResourceService } from 'src/app/openmrs-api/encounter-resource.service';
import { PatientService } from '../../services/patient.service';
import { getRenderedText } from '@angular/core/src/render3';

const mdtProgramUuid = 'c4246ff0-b081-460c-bcc5-b0678012659e';
const stdProgramUuid = '781d85b0-1359-11df-a1f1-0026b9348838';
@Component({
  selector: 'hiv-snapshot',
  styleUrls: ['./hiv-program-snapshot.component.css'],
  templateUrl: './hiv-program-snapshot.component.html'
})
export class HivProgramSnapshotComponent implements OnInit {
  @Input() public patient: Patient;
  public hasError = false;
  public hasData = false;
  public hasMoriskyScore = false;
  public patientData: any = {};
  public loadingData = false;
  public hasLoadedData = false;
  public prev_encounter_date: any = '';
  public isVirallyUnsuppressed = false;
  public isMoriskyProgram = false;
  public patientCareStatus: any;
  @Output() public addBackground = new EventEmitter();
  public location: any = {};
  public backgroundColor: any = {
    pink: 'pink',
    yellow: 'yellow'
  };
  public viremiaAlert: string;
  public showViremiaAlert: boolean;
  lowViremia: boolean;
  highViremia: boolean;
  @Input() public set program(program) {
    program.uuid === mdtProgramUuid ? this.showViremiaAlert = true : this.showViremiaAlert = false;
    program.uuid === stdProgramUuid ? this.hasMoriskyScore = true : this.hasMoriskyScore = false;
  }
  public currentPatientSub: Subscription;

  public _patient: Patient = new Patient({});
  private obs: any[] = [];
  public moriskyScore: any = '';
  public moriskyScore4: any = '';
  public moriskyScore8: any = '';
  public ismoriskyScore8 = false;
  public ismoriskyScore4 = false;
  public MoriskyDenominator: any = '';
  public moriskyRating: any = '';
  public ismoriskyScorePoorOrInadequate = false;

  constructor(private hivSummaryResourceService: HivSummaryResourceService,
    private vitalService: TodaysVitalsService,
    private _encounterResourceService: EncounterResourceService,
    private patientService: PatientService,
    private locationResource: LocationResourceService) {

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
      this.loadingData = false;
      this.hasLoadedData = true;
      let latestVlResult: any;
      let latestVlDate = '';
      let latestVl = null;
      if (results[0]) {
        this.patientCareStatus = results[0].patient_care_status;
        latestVlResult = this.getlatestVlResult(results);
        latestVlDate = latestVlResult.vl_1_date;
        latestVl = latestVlResult.vl_1;
        latestVl = latestVlResult.vl_1;
        if (this.showViremiaAlert) {
          this.checkViremia(latestVl);
        }
      }

      this.patientData = _.first(_.filter(results, (encounter: any) => {
        return encounter.is_clinical_encounter === 1;
      }));
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
        this.location = null;
        if (this.patientData.location_uuid) {
          this.resolveLastEncounterLocation(this.patientData.location_uuid);
        }
      }
    });
  }

  public resolveLastEncounterLocation(location_uuid) {
    this.locationResource.getLocationByUuid(location_uuid, true)
      .subscribe((location) => {
        this.location = location;
      }, (error) => {
        console.error('Error resolving locations', error);
      });
  }
  public getPatientCareStatus(id: any) {
    const translateMap = {
      '159': 'DECEASED',
      '9079': 'UNTRACEABLE',
      '9080': 'PROCESS OF BEING TRACED',
      '9036': 'HIV NEGATIVE, NO LONGER AT RISK',
      '9083': 'SELF DISENGAGED FROM CARE',
      '6101': 'CONTINUE WITH CARE',
      '1286': 'TRANSFER TO AMPATH FACILITY',
      '9068': 'TRANSFER TO AMPATH FACILITY, NON-AMRS',
      '1287': 'TRANSFER TO NON-AMPATH FACILITY',
      '9504': 'TRANSFER TO MATERNAL CHILD HEALTH',
      '1594': 'PATIENT TRANSFERRED OUT',
      '1285': 'TRANSFER CARE TO OTHER CENTER',
      '9578': 'ENROLL IN AMPATH FACILITY',
      '9164': 'ENROLL CARE IN ANOTHER HEALTH FACILITY',
      '1732': 'AMPATH CLINIC TRANSFER',
      '9579': 'CONTINUE CARE IN OTHER FACILITY',
      '9580': 'FOLLOW-UP CARE PLAN, NOT SURE',
      '5622': 'OTHER'
    };
    // if it is past RTC Date by 1 week and status = continue, can you make background pink
    if (this.patientCareStatus === 6101 &&
      moment(this.patientData.rtc_date).add(1, 'week') < moment(new Date())) {
      const color = this.backgroundColor.pink;
      this.addBackground.emit(color);
    }
    if (this.patientCareStatus === 1287) {
      const color = this.backgroundColor.yellow;
      this.addBackground.emit(color);
    }
    return this._toProperCase(translateMap[id]);
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
  } private checkViremia(latestVl) {
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
          this.ismoriskyScorePoorOrInadequate = false;
        } else if (this.moriskyScore >= 0.5) {
          this.ismoriskyScorePoorOrInadequate = true;
        }
      });
  }

// Function to get All Encounters
  public getAllEncounters(encounters) {
    const allEncounters = [];
    encounters = this.patient.encounters;
    _.each(encounters, (encounter: any) => {
      allEncounters.push(encounter);
    });
    return allEncounters;
  }

// Function to get Previous Morisky Encounter Details
  public getPreviousEncounters(allEncounters) {
    const previousEncounters = [];
    _.each(allEncounters, (encounter: any) => {
      const encounterType = encounter.encounterType.uuid;
      const encounterDate = Moment(encounter.encounterDatetime).format('YYYY-MM-DD-HH');
      if (encounterType === '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f') {
        if (encounterDate === this.getLastAdultReturnEncounterDate(allEncounters)) {
          previousEncounters.push(encounter);
      }
    }
    });
    return previousEncounters;
  }

// Function to get Last Adult Return Encounter Date
  public getLastAdultReturnEncounterDate(allEncounters) {
    const max_date: any[] = [];
    _.each(allEncounters, (encounter: any) => {
      const encounterDate = Moment(encounter.encounterDatetime).format('YYYY-MM-DD-HH');
      const today = Moment().format('YYYY-MM-DD-HH');
      if (encounterDate !== today) {
        max_date.push(encounterDate);
      }
    });
    return this.getMaximumDate(max_date);
  }

// Function to get array Previous Morisky Encounter Details
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
        this._encounterResourceService.getEncounterByUuid(encounterUuid).pipe(
/* tslint:disable-next-line: no-shadowed-variable */
          take(1)).subscribe((encounterDetail) => {
            encounterWithDetails.push(encounterDetail);
            resultCount++;
            checkCount();
          });
      });
    });
  }

// Function to get Morisky 4
  public getMorisky4() {
    this.moriskyScore = this.moriskyScore4;
    this.MoriskyDenominator = '/4';
    if (this.moriskyScore === 0) {
      this.moriskyRating = 'Good';
    } else if (this.moriskyScore > 0 && this.moriskyScore < 3) {
      this.moriskyRating = 'Inadequate';
    }
  }

// Function to get Morisky 8
  public getMorisky8() {
    this.moriskyScore = this.moriskyScore8;
    this.MoriskyDenominator = '/8';
    this.moriskyRating = 'Poor';
    this.ismoriskyScorePoorOrInadequate = true;
  }

// Function to get NUll Morisky score
  public setNullMorisky() {
    this.moriskyScore = '';
    this.MoriskyDenominator = '';
    this.moriskyRating = 'No value';
  }


 // Function to get the maximum date in an array
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
