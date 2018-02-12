import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import * as Moment from 'moment';
import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import {
  PatientReferralResourceService
} from '../../etl-api/patient-referral-resource.service';

@Component({
  selector: 'patient-referral-report-base',
  template: 'patient-referral-report-base.component.html'
})
export class PatientReferralBaseComponent implements OnInit {
  public data = [];
  public sectionsDef = [];
  public isAggregated: boolean;
  public programs: any;
  public states: any;

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
  private _stateUuids: Array<string>;
  public get stateUuids(): Array<string> {
    return this._stateUuids;
  }
  public set stateUuids(v: Array<string>) {
    this._stateUuids = v;
  }
  private _programsUuids: Array<string>;
  public get selectedPrograms(): Array<string> {
    return this._programsUuids;
  }
  public set selectedPrograms(v: Array<string>) {
    this._programsUuids = v;
  }
  private _gender: Array<string>;
  public get gender(): Array<string> {
    return this._gender;
  }
  public set gender(v: Array<string>) {
    this._gender = v;
  }

  constructor(public patientReferralResourceService: PatientReferralResourceService,
              public dataAnalyticsDashboardService: DataAnalyticsDashboardService) { }

  public ngOnInit() {
   // this.generateReport();

  }
  public generateReport() {
    console.log('this.programs', this.programs);

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
          endDate:this.toDateString(this.endDate),
          gender: this.gender ? this.gender : 'F,M',
          startDate: this.toDateString(this.startDate),
          programUuids: this.programs,
          locationUuids: this.getSelectedLocations(this.locationUuids),//this.locationUuids
          stateUuids: '78238ed8-1359-11df-a1f1-0026b9348838,7823ecfc-1359-11df-a1f1-0026b9348838',//this.states, //this.stateUuids
          startAge: this.startAge,
          endAge: this.endAge
       }).subscribe(
      (data) => {
        this.isLoadingReport = false;
        this.sectionsDef =   data.stateNames;
        this.data = data.result;
        console.log('data=====>>>', this.programs);

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
          gender = '' + selectedGender[i].id;
        } else {
          gender = gender + ',' + selectedGender[i].id;
        }
      }
    }
    return this.gender = gender;
  }

  public getSelectedPrograms(programsUuids): string {
    console.log('selectedPrograms11111111================>>>>>>>>', programsUuids);
    if (!programsUuids || programsUuids.length === 0) {
      return '';
    }

    let selectedPrograms = '';

    for (let i = 0; i < programsUuids.length; i++) {
      if (i === 0) {
        selectedPrograms = selectedPrograms + programsUuids[0].id;
      } else {
        selectedPrograms = selectedPrograms + ',' + programsUuids[i].id;
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
        selectedStates = selectedStates + stateUuids[0].id;
      } else {
        selectedStates = selectedStates + ',' + stateUuids[i].id;
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
    return selectedLocations;
  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }



}

