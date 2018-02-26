import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import * as Moment from 'moment';
import * as _ from 'lodash';
import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import {
  PatientReferralResourceService
} from '../../etl-api/patient-referral-resource.service';

@Component({
  selector: 'patient-referral-report-base',
  template: 'referral-report-base.component.html'
})
export class PatientReferralBaseComponent implements OnInit {
  public data: any = [];
  public sectionsDef = [];
  public isAggregated: boolean;
  public programs: any;
  public states: any;
  // public providers: any;

  public enabledControls = 'datesControl,programWorkFlowControl' +
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
  public age: any;
  public provider = '';
  @Input() public ageRangeStart: number;
  @Input() public ageRangeEnd: number;

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

  private _conceptUuids: Array<string>;
  public get conceptUuids(): Array<string> {
    return this._conceptUuids;
  }

  public set conceptUuids(v: Array<string>) {
    this._conceptUuids = v;
  }

  private _gender: Array<string>;
  public get gender(): Array<string> {
    return this._gender;
  }

  public set gender(v: Array<string>) {
    this._gender = v;
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
    this.age = {
      startAge: this.startAge,
      endAge: this.endAge
    };
    this.encounteredError = false;
    this.errorMessage = '';
    this.isLoadingReport = true;
    this.patientReferralResourceService
      .getPatientReferralReport({
        endDate: this.toDateString(this.endDate),
        gender: this.gender ? this.gender : 'F,M',
        startDate: this.toDateString(this.startDate),
        programUuids: this.programs,
        locationUuids: this.getSelectedLocations(this.locationUuids),
        stateUuids: this.states,
        startAge: this.startAge,
        endAge: this.endAge,
        providerUuids: this.provider
      }).subscribe(
      (data) => {
        this.isLoadingReport = false;
        this.sectionsDef = data.stateNames;
        this.data = data.groupedResult[0] ? data.groupedResult[0].programs : [];

      }, (error) => {
        this.isLoadingReport = false;
        this.errorMessage = error;
        this.encounteredError = true;
      });
  }

  public onAgeChangeFinished($event) {
    this.startAge = $event.ageFrom;
    this.endAge = $event.ageTo;
  }

  public getSelectedGender(selectedGender) {
    let gender;
    if (selectedGender) {
      for (let i = 0; i < selectedGender.length; i++) {
        if (i === 0) {
          gender = '' + selectedGender[i];
        } else {
          gender = gender + ',' + selectedGender[i];
        }
      }
    }
    return this.gender = gender;
  }

  public getSelectedPrograms(programsUuids): string {
    if (!programsUuids || programsUuids.length === 0) {
      return '';
    }

    let selectedPrograms = '';

    for (let i = 0; i < programsUuids.length; i++) {
      if (i === 0) {
        selectedPrograms = selectedPrograms + programsUuids[0];
      } else {
        selectedPrograms = selectedPrograms + ',' + programsUuids[i];
      }
    }

    return this.programs = selectedPrograms;
  }

  public getSelectedStates(stateUuids): string {
    if (!stateUuids || stateUuids.length === 0) {
      return '';
    }

    let selectedStates = '';

    for (let i = 0; i < stateUuids.length; i++) {
      if (i === 0) {
        selectedStates = selectedStates + stateUuids[0];
      } else {
        selectedStates = selectedStates + ',' + stateUuids[i];
      }
    }
    return this.states = selectedStates;
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
        selectedLocations = selectedLocations + locationUuids[0];
      } else {
        selectedLocations = selectedLocations + ',' + locationUuids[i];
      }
    }
    this.dataAnalyticsDashboardService.setSelectedLocations(selectedLocations);
    return selectedLocations;
  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

}
