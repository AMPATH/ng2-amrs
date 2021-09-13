import { Location } from '@angular/common';
import * as _ from 'lodash';
import * as Moment from 'moment';
import * as rison from 'rison-node';

import { Component, OnInit, Output, Input } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';
@Component({
  selector: 'surge-report-base',
  templateUrl: './surge-report-base.component.html',
  styleUrls: ['./surge-report-base.component.css']
})
export class SurgeReportBaseComponent implements OnInit {
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public surgeReportSummaryData: any = [];
  public columnDefs: any = [];
  public enabledControls = 'weekControl';
  public reportName = 'Surge Report';
  public currentView = 'weekly';
  public isReleased = false;
  public yearWeek: any;
  public currentViewBelow = 'pdf';

  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoading = false;
  public reportHead: any;
  public displayTabularFilters: Boolean = false;
  public calendarWeeks = [];
  public selectedYearWeek: any;
  public startDate: any;
  public pinnedBottomRowData: any = [];
  public isWeekDateLoaded = false;

  public _locationUuids: any = [];
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    const locationUuids = [];
    _.each(v, (location: any) => {
      if (location.value) {
        locationUuids.push(location);
      }
    });
    this._locationUuids = locationUuids;
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public surgeReport: SurgeResourceService
  ) {
    this.generateSurgeWeeks();
    this.route.queryParams.subscribe((data) => {
      this.displayTabularFilters = data.displayTabularFilters;
      data._date === undefined
        ? (this.startDate = Moment(new Date()).format('MM-DD-YYYY'))
        : (this.startDate = Moment(data._date).format('MM-DD-YYYY'));

      if (data.currentView === undefined) {
        this.currentView = 'weekly';
      } else {
        this.currentView = data.currentView;
        this.currentView === 'daily'
          ? (this.enabledControls = 'dayControl')
          : (this.enabledControls = 'weekControl');
      }
    });
  }

  ngOnInit() {}

  public getSurgeWeeklyReport(params: any) {
    this.isLoading = true;
    this.surgeReport.getSurgeWeeklyReport(params).subscribe((data) => {
      if (data.error) {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      } else {
        this.showInfoMessage = false;
        this.columnDefs = data.sectionDefinitions;
        this.surgeReportSummaryData = data.result;
        this.calculateTotalSummary();
        this.isLoading = false;
      }
    });
  }

  public getSurgeDailyReport(params: any) {
    this.isLoading = true;
    this.surgeReport.getSurgeDailyReport(params).subscribe((data) => {
      if (data.error) {
        this.showInfoMessage = true;
        this.errorMessage = `There has been an error while loading the report, please retry again`;
        this.isLoading = false;
      } else {
        this.showInfoMessage = false;
        this.columnDefs = data.sectionDefinitions;
        this.surgeReportSummaryData = data.result;
        this.calculateTotalSummary();
        this.isLoading = false;
      }
    });
  }

  public getSelectedIndicators(selectedIndicator) {
    let indicators;
    if (selectedIndicator) {
      for (let i = 0; i < selectedIndicator.length; i++) {
        if (i === 0) {
          indicators = '' + selectedIndicator[i].value;
        } else {
          indicators = indicators + ',' + selectedIndicator[i].value;
        }
      }
    }
    return (this.indicators = indicators);
  }

  public onIndicatorSelected(value) {
    switch (this.currentView) {
      case 'daily':
        this.router.navigate(['surge-report-patientlist'], {
          relativeTo: this.route,
          queryParams: {
            indicators: value.field,
            indicatorHeader: value.headerName,
            _date: Moment(this.startDate).format('YYYY-MM-DD'),
            locationUuids: value.location,
            currentView: this.currentView
          }
        });
        break;
      case 'weekly':
        this.router.navigate(['surge-report-patientlist'], {
          relativeTo: this.route,
          queryParams: {
            indicators: value.field,
            indicatorHeader: value.headerName,
            year_week: this.params.year_week,
            locationUuids: value.location,
            currentView: this.currentView
          }
        });
    }
  }

  public storeParamsInUrl(param) {
    switch (this.currentView) {
      case 'daily':
        this.params = {
          _date: Moment(this.startDate).format('YYYY-MM-DD'),
          locationUuids: param,
          displayTabularFilters: true,
          currentView: this.currentView,
          reportName: this.reportName
        };
        break;
      case 'weekly':
        this.params = {
          year_week: this.yearWeek,
          locationUuids: param,
          displayTabularFilters: true,
          currentView: this.currentView,
          reportName: this.reportName
        };
        break;
    }
    // store params in url
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public generateReport() {
    this.route.parent.parent.params.subscribe((params: any) => {
      this.storeParamsInUrl(params.location_uuid);
    });
    this.surgeReportSummaryData = [];
    if (this.currentView === 'daily') {
      this.displayTabularFilters = true;
      this.getSurgeDailyReport(this.params);
    } else {
      this.displayTabularFilters = true;
      this.getSurgeWeeklyReport(this.params);
    }
  }

  public onYearWeekChange(value) {
    this.yearWeek = value.yearWeek;
  }

  public onStartDateChange(value) {
    this.startDate = Moment(value).format('MM-DD-YYYY');
  }

  public onTabChanged(val) {
    if (val.index === 0) {
      this.currentView = 'daily';
      this.enabledControls = 'dayControl';
      this.surgeReportSummaryData = [];
      this.displayTabularFilters = false;
    } else if (val.index === 1) {
      this.currentView = 'weekly';
      this.enabledControls = 'weekControl';
      this.surgeReportSummaryData = [];
      this.displayTabularFilters = false;
    }
  }

  public calculateTotalSummary() {
    const totalsRow = [];
    if (this.surgeReportSummaryData.length > 0) {
      const totalObj = {
        location: 'Totals'
      };
      _.each(this.surgeReportSummaryData, (row) => {
        Object.keys(row).map((key, index) => {
          if (Number.isInteger(row[key]) === true) {
            if (totalObj[key]) {
              totalObj[key] = row[key] + totalObj[key];
            } else {
              totalObj[key] = row[key];
            }
          } else {
            if (Number.isNaN(totalObj[key])) {
              totalObj[key] = 0;
            }
            if (totalObj[key] === null) {
              totalObj[key] = 0;
            }
            totalObj[key] = 0 + totalObj[key];
          }
        });
      });
      totalObj.location = 'Totals';
      totalsRow.push(totalObj);
      this.pinnedBottomRowData = totalsRow;
    }
  }

  public generateSurgeWeeks() {
    this.surgeReport.getSurgeWeeks().subscribe((res) => {
      res.result.forEach((element) => {
        this.calendarWeeks.push({
          yearWeek: element.formatted_week,
          name:
            `Week ${Moment(element.start_date, 'YYYY-MM-DD').week()} ${Moment(
              element.start_date,
              'YYYY-MM-DD'
            ).year()}` +
            ' From ' +
            Moment(element.start_date).format('ddd-DD MMM-YYYY') +
            ' To ' +
            Moment(element.end_date).format('ddd-DD MMM-YYYY')
        });
        if (
          new Date().getTime() >= new Date(element.start_date).getTime() &&
          new Date().getTime() <= new Date(element.end_date).getTime()
        ) {
          this.yearWeek = element.formatted_week;
        }
      });
      this.isWeekDateLoaded = true;
    });
  }
}
