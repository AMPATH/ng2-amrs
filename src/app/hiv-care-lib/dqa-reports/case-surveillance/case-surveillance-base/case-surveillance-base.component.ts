import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as Moment from 'moment';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { DataAnalyticsDashboardService } from 'src/app/data-analytics-dashboard/services/data-analytics-dashboard.services';
import { CaseSurveillanceService } from 'src/app/etl-api/case-surveillance.service';

@Component({
  selector: 'app-case-surveillance-base',
  templateUrl: './case-surveillance-base.component.html',
  styleUrls: ['./case-surveillance-base.component.css']
})
export class CaseSurveillanceBaseComponent implements OnInit {
  public enabledControls = 'locationControl,datesControl,';
  public _locationUuids: any = [];
  public params: any = [];
  public showPatientList = false;
  public showInfoMessage = false;
  public facilityName = '';
  public csSummaryData: any = [];
  private _startDate: Date = Moment().subtract(1, 'month').toDate();
  isLoading: boolean;
  columnDefs: any;
  errorMessage: string;
  pinnedBottomRowData: any[];
  private _sDate: any;
  private _eDate: any;
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
    private router: Router,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private route: ActivatedRoute,
    public caseSurveillanceService: CaseSurveillanceService
  ) {}

  ngOnInit() {}

  // ✅ Proper reusable function to build query params
  private buildQueryParams(selectedLocations: any) {
    return (this.params = {
      locationUuids: this.getSelectedLocations(selectedLocations),
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      endDate: Moment(this.endDate).format('YYYY-MM-DD')
    });
  }

  public getCaseSurveillanceReport(params: any) {
    this.isLoading = true;
    this.caseSurveillanceService
      .getCaseSurveillanceReport(params)
      .subscribe((data) => {
        try {
          if (data.error) {
            this.showInfoMessage = true;
            this.errorMessage = `There has been an error while loading the report, please retry again`;
            this.isLoading = false;
            return;
          }

          this.showInfoMessage = false;

          // Extract all results from queriesAndSchemas
          let allResults: any[] = [];
          if (Array.isArray(data.queriesAndSchemas)) {
            data.queriesAndSchemas.forEach((reportItem) => {
              if (reportItem.results && reportItem.results.results) {
                allResults = allResults.concat(reportItem.results.results);
              }
            });
          }

          this.csSummaryData = allResults;
          this.columnDefs = data.sectionDefinitions || [];

          this.calculateTotalSummary();
        } catch (err) {
          console.error('Error processing report', err);
          this.showInfoMessage = true;
          this.errorMessage = 'There was an error processing the report.';
        } finally {
          this.isLoading = false;
        }
      });
  }

  public calculateTotalSummary() {
    const totalsRow = [];
    const totalObj: any = { location: 'Totals' };

    if (this.csSummaryData && this.csSummaryData.length > 0) {
      this.csSummaryData.forEach((item) => {
        if (item.results && Array.isArray(item.results)) {
          item.results.forEach((row) => {
            Object.keys(row).forEach((key) => {
              if (typeof row[key] === 'number') {
                // Add numeric values
                if (totalObj[key]) {
                  totalObj[key] += row[key];
                } else {
                  totalObj[key] = row[key];
                }
              } else {
                // Ensure non-numeric fields exist
                if (!totalObj[key]) {
                  totalObj[key] = null;
                }
              }
            });
          });
        }
      });
      totalsRow.push(totalObj);
      this.pinnedBottomRowData = totalsRow;
    }
  }

  public calculateTotalSummary1() {
    const totalsRow = [];
    if (this.csSummaryData.length > 0) {
      const totalObj = {
        location: 'Totals'
      };
      _.each(this.csSummaryData, (row) => {
        Object.keys(row).map((key) => {
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

  public onIndicatorSelected(value) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        indicators: value.field,
        indicatorHeader: value.headerName,
        indicatorGender: value.gender,
        sDate: this._sDate,
        eDate: this._eDate,
        locationUuids: value.location
      }
    });
  }

  // ✅ Generate report and navigate
  public generateReport() {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          const queryParams = this.buildQueryParams(data.locations);

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams
          });

          this.facilityName = data.facility
            ? data.facility
            : data.locations.length > 0
            ? data.locations[0].label
            : '';

          this.getCaseSurveillanceReport(this.params);

          this.showPatientList = true;
        }
      });
  }

  // Convert location objects → CSV string
  private getSelectedLocations(locationUuids: Array<any>): string {
    return locationUuids.map((location) => location.value).join(',');
  }
}
