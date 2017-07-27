import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';

import { HivSummaryResourceService } from '../../../etl-api/hiv-summary-resource.service';
import * as _ from 'lodash';
import { Patient } from '../../../models/patient.model';
import { AppSettingsService } from '../../../app-settings';
import { Observable } from 'rxjs';
import * as moment from 'moment';

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
  @Output() public addPinkBackground = new EventEmitter();
  public location: any = {};
  constructor(private hivSummaryResourceService: HivSummaryResourceService
    ,         private http: Http
    ,         private appSettingsService: AppSettingsService) {

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
    this.hivSummaryResourceService.getHivSummary(patientUuid, 0, 10).subscribe((results) => {
      this.getLocation().subscribe((locations) => {
        this.loadingData = false;
        this.hasLoadedData = true;
        this.patientData = _.first(_.filter(results, (encounter: any) => {
          return encounter.is_clinical_encounter === 1;
        }));
        if (!_.isNil(this.patientData)) {
          // flag red if VL > 1000 && (vl_1_date > (arv_start_date + 6 months))
          if ((this.patientData.vl_1 > 1000 && (
              moment(this.patientData.vl_1_date) >
              moment(this.patientData.arv_start_date).add(6, 'months')
            )) || (this.patientData.prev_arv_line !== this.patientData.cur_arv_line)) {
            this.isVirallyUnsuppressed = true;
          }
          this.hasData = true;
          let encounterLocations = _.filter(locations, (location, key) => {
            return location['uuid'] === this.patientData.location_uuid;
          });
          this.location = _.first(encounterLocations);
        }
      });
    });
  }

  public getLocation(): Observable<any> {
    let api = this.appSettingsService.getOpenmrsServer() + '/ws/rest/v1/location?v=default';
    return this.http.get(api).map((response: Response) => {
      return response.json().results;
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
    if (id === 6101 && moment(this.patientData.rtc_date).add(1, 'week') < moment(new Date())) {
      this.addPinkBackground.emit(true);
    }

    return this._toProperCase(translateMap[id]);
  }

  private _toProperCase(text: string) {
    text = text || '';
    return text.replace(/\w\S*/g, (txt) => {return txt.charAt(0).toUpperCase() +
      txt.substr(1).toLowerCase(); });
  }
}
