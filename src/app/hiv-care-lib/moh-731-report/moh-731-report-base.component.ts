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

  public isAggregated: boolean;
  public showPatientList: boolean = false;
  public showTabularView: boolean = true;
  public showPatientListLoader: boolean = false;
  public isLoadingReport: boolean = false;
  public encounteredError: boolean = false;
  public errorMessage: string = '';
  public currentView: string = 'pdf'; // can be pdf or tabular or patientList
  public currentIndicator: string = '';
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

  private _isLegacyReport: boolean = false;
  public get isLegacyReport(): boolean {
    return this._isLegacyReport;
  }

  public set isLegacyReport(v: boolean) {
    this._isLegacyReport = v;
  }

  constructor(public moh731Resource: Moh731ResourceService) {
  }

  ngOnInit() {
  }

  generateReport() {
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

  public onColumnClicked(column) {
    this.showTabularView = false;
    this.showPatientListLoader = true;
    this.currentIndicator = column.column.colId;
  }

  toggleMohTables() {
    this.showPatientList = false;
    this.showTabularView = true;
    this.showPatientListLoader = false;
  }

  onLoadCompleted(complete) {
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
