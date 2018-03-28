import { Component, OnInit, ViewChild } from '@angular/core';
// import { Observable, Subject } from 'rxjs/Rx';

import * as Moment from 'moment';

import { Moh731ResourceService } from '../../etl-api/moh-731-resource.service';

@Component({
  selector: 'moh-731-report-base',
  template: 'moh-731-report-base.component.html',
  styleUrls: ['./moh-731-report-base.component.css'],
})
export class Moh731ReportBaseComponent implements OnInit {

  @ViewChild('mohPdf')
  public pdfView: any;
  public data = [];
  public sectionsDef = [];

  public showLocationsControl: boolean = false;
  public showIsAggregateControl: boolean = false;

  public showPatientList: boolean = false;
  public showTabularView: boolean = true;
  public showPatientListLoader: boolean = false;
  public isLoadingReport: boolean = false;
  public encounteredError: boolean = false;
  public errorMessage: string = '';
  public currentView: string = 'pdf'; // can be pdf or tabular or patientList
  public currentIndicator: string = '';
  private _startDate: Date = Moment().subtract(1, 'months').startOf('month').toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date = Moment().subtract(1, 'months').endOf('month').toDate();
  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(v: Date) {
    this._endDate = v;
  }

  private _locationUuids: Array<string> = [];
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    // console.log('Received locations', v);
    this._locationUuids = v;
  }

  private _patientListLocationUuids: Array<string> = [];
  public get patientListLocationUuids(): Array<string> {
    return this._patientListLocationUuids;
  }

  public set patientListLocationUuids(v: Array<string>) {
    this._patientListLocationUuids = v;
  }

  private _isLegacyReport: boolean = false;
  public get isLegacyReport(): boolean {
    return this._isLegacyReport;
  }

  public set isLegacyReport(v: boolean) {
    this._isLegacyReport = v;
  }

  private _isAggregated: boolean;
  public get isAggregated(): boolean {
    return this._isAggregated;
  }
  public set isAggregated(v: boolean) {
    this._isAggregated = v;
  }

  constructor(public moh731Resource: Moh731ResourceService) {
  }

  public ngOnInit() {
  }

  public generateReport() {
    // set busy indications variables
    // clear error
    this.encounteredError = false;
    this.errorMessage = '';
    this.isLoadingReport = true;
    this.data = [];
    this.sectionsDef = [];

    this.moh731Resource
      .getMoh731Report(this.getSelectedLocations(this.locationUuids),
        this.toDateString(this.startDate), this.toDateString(this.endDate),
        this.isLegacyReport, this.isAggregated, 1 * 60 * 1000).subscribe(
          (data) => {
            this.isLoadingReport = false;
            this.sectionsDef = data.sectionDefinitions;
            this.data = data.result;
          }, (error) => {
            this.isLoadingReport = false;
            this.errorMessage = error;
            this.encounteredError = true;
          });
  }

  public onIndicatorSelected(indicator) {
    this.currentIndicator = '';
    this.patientListLocationUuids = [];
    setTimeout(() => {
      if (this.isAggregated) {
        this.patientListLocationUuids = this._locationUuids;
      } else {
        this.patientListLocationUuids = [indicator.location];
      }
      this.currentIndicator = indicator.indicator;
      this.goToPatientList();

    }, 100);

  }

  public goToPatientList() {
    if (Array.isArray(this.patientListLocationUuids) &&
      this.patientListLocationUuids.length > 0 && this.currentIndicator) {
      this.showTabularView = false;
      this.showPatientListLoader = true;
      // console.log('loading pl for', this.patientListLocationUuids);
      // console.log('loading pl for', this.currentIndicator);
    }
  }

  public toggleMohTables() {
    this.showPatientList = false;
    this.showTabularView = true;
    this.showPatientListLoader = false;
    this.currentIndicator = '';
    this.patientListLocationUuids = [];
  }

  public onLoadCompleted(complete) {
    this.showPatientListLoader = false;
    this.showPatientList = true;
  }

  public onTabChanged(event) {
    if (event.index === 0) {
      this.currentView = 'pdf';
      if (this.pdfView && this.pdfView.generatePdf) {
        this.pdfView.generatePdf();
      }

    }

    if (event.index === 1) {
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
