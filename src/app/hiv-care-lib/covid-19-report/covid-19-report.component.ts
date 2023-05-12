import { Component, OnInit, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import * as Moment from 'moment';
import { ClinicDashboardCacheService } from './../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { Covid19ResourceService } from './../../etl-api/covid-19-resource-service';

interface CovidSummaryResponse {
  schemas: any;
  sqlQuery: string;
  size: number;
  result: any[];
  sectionDefs: any[];
}

interface Covid19QueryPrams {
  endingMonth: string;
  locationUuids: string;
}

@Component({
  selector: 'app-covid-19-report',
  templateUrl: './covid-19-report.component.html',
  styleUrls: ['./covid-19-report.component.css']
})
export class Covid19ReportComponent implements OnInit {
  public title = 'Covid-19 Vaccination Report';
  @Output() public params: Covid19QueryPrams;
  @Input() public locationUuids: '';
  @Input() public dashboardType: string;
  @Input() public analyticlocations = '';

  public covid19SummaryData = [];
  public covid19SectionDefs: any[] = [];
  public encounteredError = false;
  public errorMessage = '';
  public isLoadingReport = false;

  public endMonth: Date = Moment().endOf('month').toDate();
  public startMonth: Date = Moment().endOf('month').toDate();

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private covid19Service: Covid19ResourceService
  ) {}

  public ngOnInit(): void {
    this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((currentClinic) => {
        this.locationUuids = currentClinic;
      });
    this.route.queryParams.subscribe(
      (params: Covid19QueryPrams) => {
        if (params) {
          if (params.endingMonth) {
            this.params = params;
            this.endMonth = Moment(params.endingMonth).toDate();
            this.generateReport();
          }
        }
      },
      (error: any) => {
        console.error('Error', error);
      }
    );
  }

  public generateReport() {
    this.covid19SummaryData = [];
    this.getCovid19SummaryReport(this.params);
  }

  public storeParamsInUrl(params: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params
    });
  }

  public getCovid19SummaryReport(params: Covid19QueryPrams) {
    this.setLoadingStatus(true);
    if (params.locationUuids.length > 0) {
      this.covid19Service.getCovid19VaccinationMonthlyReport(params).subscribe(
        (result: CovidSummaryResponse) => {
          if (result) {
            this.covid19SummaryData = result.result;
            this.covid19SectionDefs = result.sectionDefs;
          }
          this.setLoadingStatus(false);
        },
        (error: any) => {
          this.setLoadingStatus(false);
          this.encounteredError = true;
          this.errorMessage =
            'Encountered an error while fetching report. Try reloading';
        }
      );
    }
  }
  public onIndicatorSelect($event: any) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        indicators: $event.indicators,
        indicatorHeader: $event.header,
        endingMonth: Moment(this.params.endingMonth).format('YYYY-MM-DD'),
        locationUuids: $event.locationUuids
      }
    });
  }
  public filterSet($event: any) {
    this.endMonth = $event.endingMonth;
    this.setParams();
    this.storeParamsInUrl(this.params);
  }

  public setParams() {
    this.params = {
      locationUuids: this.locationUuids,
      endingMonth: Moment(this.endMonth).format('YYYY-MM-DD')
    };
  }
  public filteReset($event: boolean): void {
    if ($event) {
    }
  }

  public locationsSet($event: any): void {
    this.locationUuids = $event;
  }
  public resetValues(): void {
    this.encounteredError = false;
    this.errorMessage = '';
  }
  public setLoadingStatus(isLoading: boolean): void {
    this.isLoadingReport = isLoading;
  }
}
