import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { DataAnalyticsDashboardService } from './../../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Component({
  selector: 'app-ncd-report-base-filters',
  templateUrl: './ncd-report-base-filters.component.html',
  styleUrls: ['./ncd-report-base-filters.component.css']
})
export class NcdReportBaseFiltersComponent implements OnInit, OnChanges {
  public title = 'PLHIV NCD Report Filters';
  public selectedIndicators = [];
  @Input() public startDate: Date = Moment()
    .subtract(2, 'months')
    .endOf('month')
    .toDate();
  @Input() public reportType = '';
  @Input() public dashboardType = '';
  @Input() public params: any;
  @Output() public filterSet = new EventEmitter();
  @Output() public filteReset = new EventEmitter();
  @Output() public locationsSet = new EventEmitter();
  public selectedGender: any = [];
  public locationUuids: Array<string>;
  public selectedlocationUuids: Array<string>;
  public isLoadingReport = false;
  public reportName = 'plhiv-ncd-monthly-report';
  public errorObj = {
    isError: false,
    message: ''
  };
  public validParams = true;
  public monthString = Moment(this.startDate).format('YYYY-MM');

  constructor(
    public dataAnalyticsDashboardService: DataAnalyticsDashboardService
  ) {}

  public ngOnInit() {
    this.initializeParams();
  }

  public ngOnChanges(change: SimpleChanges) {
    if (
      change.startDate &&
      typeof change.startDate.previousValue !== 'undefined'
    ) {
      this.monthString = Moment(change.startDate.currentValue).format(
        'YYYY-MM'
      );
    }
  }

  public initializeParams() {
    this.monthString = Moment(this.startDate).format('YYYY-MM');
  }

  public setFilter() {
    const isFilterValid = this.validateFiltersSelected();
    this.filteReset.emit(true);
    if (isFilterValid) {
      this.setParams();
      this.emitFilterParams();
    }
  }
  public setParams() {
    this.params = {
      endingMonth: Moment(this.monthString)
        .add(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD'),
      startingMonth: Moment(this.monthString)
        .endOf('month')
        .format('YYYY-MM-DD'),
      locationUuids: ''
    };
  }

  public emitFilterParams() {
    this.filterSet.emit(this.params);
  }
  public resetFilter() {
    this.monthString = Moment()
      .subtract(2, 'months')
      .endOf('month')
      .format('YYYY-MM');
    this.filteReset.emit(true);
  }

  public resetErrorObj() {
    this.errorObj = {
      isError: false,
      message: ''
    };
  }
  public validateFiltersSelected(): Boolean {
    let isValid = true;
    this.resetErrorObj();
    const currentEndMonth = Moment().endOf('month');
    const filterEndMonth = Moment(this.monthString)
      .add(1, 'months')
      .endOf('month');
    if (filterEndMonth.isAfter(currentEndMonth)) {
      isValid = false;
      this.errorObj = {
        isError: true,
        message:
          'For draft report, the end date should not be after the current month.'
      };
    }
    return isValid;
  }
  public onLocationsSelected($event: any) {
    this.selectedlocationUuids = $event.locations.map((l: any) => {
      return l.value;
    });

    this.locationsSet.emit(this.selectedlocationUuids);
  }
}
