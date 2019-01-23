
import {take} from 'rxjs/operators';
import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import * as _ from 'lodash';
import { Patient } from '../../../models/patient.model';
import * as moment from 'moment';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';

const mdtProgramUuid = 'c4246ff0-b081-460c-bcc5-b0678012659e';

@Component({
  selector: 'hiv-snapshot',
  styleUrls: ['./hiv-program-snapshot.component.css'],
  templateUrl: './hiv-program-snapshot.component.html'
})
export class HivProgramSnapshotComponent implements OnInit {
  @Input() public patient: Patient;
  public hasError: boolean = false;
  public hasData: boolean = false;
  public patientData: any = {};
  public loadingData: boolean = false;
  public hasLoadedData: boolean = false;
  public isVirallyUnsuppressed: boolean = false;
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
  }
  constructor(private hivSummaryResourceService: HivSummaryResourceService,
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
           latestVl =  latestVlResult.vl_1;
           if (this.showViremiaAlert) {
             this.checkViremia(latestVl);
           }
         }

        this.patientData = _.first(_.filter(results, (encounter: any) => {
          return encounter.is_clinical_encounter === 1;
        }));
        let patientDataCopy = this.patientData;
        if (!_.isNil(this.patientData)) {
          // assign latest vl and vl_1_date
          this.patientData = Object.assign(patientDataCopy,
            {vl_1_date: latestVlDate , vl_1 : latestVl });
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
    let translateMap = {
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
    };
    // if it is past RTC Date by 1 week and status = continue, can you make background pink
    if (this.patientCareStatus === 6101 &&
      moment(this.patientData.rtc_date).add(1, 'week') < moment(new Date())) {
      let color = this.backgroundColor.pink;
      this.addBackground.emit(color);
    }
    if (this.patientCareStatus  === 1287 ) {
      let color = this.backgroundColor.yellow;
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
    return text.replace(/\w\S*/g, (txt) => {return txt.charAt(0).toUpperCase() +
      txt.substr(1).toLowerCase(); });
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
}
