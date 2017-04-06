import { Component, OnInit } from '@angular/core';
import { Moh731ResourceService } from './moh-731-fake-resource';

@Component({
  selector: 'moh-731-report-base',
  template: '<h1>moh</h1>'
})
export class Moh731ReportBaseComponent implements OnInit {

  public data = [];
  public sectionsDef = [];

  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public locationUuids: Array<string>;
  public isAggregated: boolean;
  public isLegacyReport: boolean = false;

  public isLoadingReport: boolean = false;
  public encounteredError: boolean = false;
  public errorMessage: string = '';

  constructor(public moh731Resource: Moh731ResourceService) { }

  ngOnInit() {

  }

  generateReport() {
  }
}
