import { Component, OnInit } from '@angular/core';

import * as Moment from 'moment';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';

import { DataAnalyticsDashboardService } from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import { PatientReferralResourceService } from '../../etl-api/patient-referral-resource.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { SelectDepartmentService } from '../../shared/services/select-department.service';

@Component({
  selector: 'patient-referral-report-base',
  templateUrl: './patient-referral-report-base.component.html'
})
export class StrengthsPatientReferralBaseComponent implements OnInit {
  public data: any = [];
  public sectionsDef = [];
  public isAggregated: boolean;
  public programs: any;
  public enabledControls =
    'datesControl' + 'ageControl,genderControl,locationControl';
  public startAge: number;
  public endAge: number;
  public selectedGender = [];
  public isLoadingReport = false;
  public encounteredError = false;
  public errorMessage = '';
  public currentView = 'tabular'; // can be pdf or tabular or patientList
  public reportName = '';
  public dates: any;
  public programUuids: any;
  public showEmptyResultsDialog = false;
  public msgObj: any = {
    message: '',
    show: false
  };

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

  constructor(
    public patientReferralResourceService: PatientReferralResourceService,
    public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    public localStorageService: LocalStorageService,
    public selectDepartmentService: SelectDepartmentService
  ) {}

  public ngOnInit() {}

  public resetErrorMessage() {
    this.msgObj = {
      message: '',
      show: false
    };
  }

  public toggleEmptyResultsDialog() {
    this.showEmptyResultsDialog = false;
  }

  public generateReport() {
    this.data = [];
    this.resetErrorMessage();
    this.toggleEmptyResultsDialog();
    if (!this.programs || this.programs.length === 0) {
      this.msgObj = {
        message: 'Kindly select at least one program',
        show: true
      };
    } else {
      this.dates = {
        startDate: this.startDate,
        endDate: this.endDate
      };

      const department = this.selectDepartmentService.getUserSetDepartment();

      this.encounteredError = false;
      this.errorMessage = '';
      this.isLoadingReport = true;
      const filterLocation = this.getSelectedLocations(this.locationUuids);
      const params = {
        endDate: this.toDateString(this.endDate),
        startDate: this.toDateString(this.startDate),
        locationUuids: filterLocation,
        department: department
      };

      if (!_.isUndefined(this.programs)) {
        _.extend(params, {
          programUuids: this.programs
        });
      }
      this.patientReferralResourceService
        .getPatientReferralReport(params)
        .pipe(take(1))
        .subscribe(
          (data) => {
            this.isLoadingReport = false;
            const groupedProgramData = this.getProgramData(data);
            if (groupedProgramData.length === 0) {
              this.showEmptyResultsDialog = true;
            } else {
              this.data = groupedProgramData;
            }
          },
          (error) => {
            console.log('error => ', error);
            this.isLoadingReport = false;
            this.errorMessage = error;
            this.encounteredError = true;
          }
        );
    }
  }

  public getSelectedPrograms(programsUuids): string {
    if (!programsUuids || programsUuids.length === 0) {
      this.programs = '';
      return this.programs;
    }

    let selectedPrograms = '';

    for (let i = 0; i < programsUuids.length; i++) {
      if (i === 0) {
        selectedPrograms = selectedPrograms + programsUuids[0].value;
      } else {
        selectedPrograms = selectedPrograms + ',' + programsUuids[i].value;
      }
    }

    this.programs = selectedPrograms.length > 0 ? selectedPrograms : undefined;
    return this.programs;
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
        selectedLocations =
          selectedLocations + ',' + (locationUuids[i] as any).value;
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
