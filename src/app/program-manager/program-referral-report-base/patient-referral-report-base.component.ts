import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import * as Moment from 'moment';
import * as _ from 'lodash';
import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import {
  PatientReferralResourceService
} from '../../etl-api/patient-referral-resource.service';
import { PatientReferralService } from '../patient-referral-service';

@Component({
  selector: 'patient-referral-report-base',
  template: './patient-referral-report-base.component.html'
})
export class PatientReferralBaseComponent implements OnInit {
  public data: any = [];
  public sectionsDef = [];
  public isAggregated: boolean;
  public programs: any;

  public enabledControls = 'datesControl' +
    'ageControl,genderControl,locationControl';
  public startAge: number;
  public endAge: number;
  public selectedGender = [];
  public isLoadingReport: boolean = false;
  public encounteredError: boolean = false;
  public errorMessage: string = '';
  public currentView: string = 'tabular'; // can be pdf or tabular or patientList
  public reportName: string = '';
  public dates: any;
  public programUuids: any;

  private _startDate: Date = Moment().subtract(1, 'months').toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date = new Date();
  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(v: Date) {

    this._endDate = v;
  }

  private _locationUuids: Array<string>;
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    this._locationUuids = v;
  }

  constructor(public patientReferralResourceService: PatientReferralResourceService,
              public dataAnalyticsDashboardService: DataAnalyticsDashboardService) {
  }

  public ngOnInit() {

  }

  public generateReport() {
    this.dates = {
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.encounteredError = false;
    this.errorMessage = '';
    this.isLoadingReport = true;
    let filterLocation = this.getSelectedLocations(this.locationUuids);
    const params = {
      endDate: this.toDateString(this.endDate),
      startDate: this.toDateString(this.startDate),
      locationUuids: filterLocation
    };

    if (!_.isUndefined(this.programs)) {
      _.extend(params, {
        programUuids: this.programs
      });
    }
    this.patientReferralResourceService
      .getPatientReferralReport(params).take(1).subscribe((data) => {
        this.isLoadingReport = false;
        this.data = this.getProgramData(data);

      }, (error) => {
        console.log('error => ', error);
        this.isLoadingReport = false;
        this.errorMessage = error;
        this.encounteredError = true;
      });
  }

  public getSelectedPrograms(programsUuids): string {
    if (!programsUuids || programsUuids.length === 0) {
      return '';
    }

    let selectedPrograms = '';

    for (let i = 0; i < programsUuids.length; i++) {
      if (i === 0) {
        selectedPrograms = selectedPrograms + programsUuids[0].value;
      } else {
        selectedPrograms = selectedPrograms + ',' + programsUuids[i].value;
      }
    }

    return this.programs = selectedPrograms;
  }

  public onTabChanged(event) {
    if (event.index === 0) {
      this.currentView = 'tabular';
    }
  }

  private getSelectedLocations(locationUuids: Array<string>): string {

    if (!locationUuids || locationUuids.length === 0) {
      return '';
    }

    let selectedLocations = '';

    for (let i = 0; i < locationUuids.length; i++) {
      if (i === 0) {
        selectedLocations = selectedLocations + (locationUuids[0] as any).value;
      } else {
        selectedLocations = selectedLocations + ',' + (locationUuids[i] as any).value;
      }
    }
    return selectedLocations;
  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

  private getProgramData(data: any) {
    let rowData = [];
    _.forEach(data.groupedResult, (row) => {
      rowData = rowData.concat(row.programs);
    });

    return rowData;
  }

}
