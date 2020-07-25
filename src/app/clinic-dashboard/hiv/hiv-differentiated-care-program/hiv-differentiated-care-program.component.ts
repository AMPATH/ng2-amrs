import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as Moment from 'moment';
import * as _ from 'lodash';

import { HivDifferentiatedCareResourceService } from '../../../etl-api/hiv-differentiated-care-resource.service';

@Component({
  selector: 'app-hiv-differentiated-care',
  templateUrl: './hiv-differentiated-care-program.component.html',
  styleUrls: ['./hiv-differentiated-care-program.component.css']
})
export class HivDifferentiatedCareComponent implements OnInit {

  public title = 'HIV Differentiated Care Program Reports';
  public patientData: any;
  public isLoadingPatientList = false;
  public locationUuid = '';
  public indicators: string;
  public sectionTittle: string;
  public startDate: Date = Moment().subtract(1, 'months').toDate();
  public endDate: Date = new Date();
  public selectedIndicator: string;
  public indicatorName: string;
  public loadingError: any;
  public filterCollapsed = false;
  public parentIsBusy = false;
  public missingField = false;

  public get startDateString(): string {
    return this.startDate ? Moment(this.startDate).format('YYYY-MM-DD') : null;
  }

  public set startDateString(v: string) {
    this.startDate = new Date(v);
  }

  public get endDateString(): string {
    return this.endDate ? Moment(this.endDate).format('YYYY-MM-DD') : null;
  }

  public set endDateString(v: string) {
    this.endDate = new Date(v);
  }

  public dcIndicators = [
    { name: 'Total Eligible', value: 'total_eligible_for_dc' },
    { name: 'Eligible Not Enrolled', value: 'eligible_not_on_dc' },
    { name: 'Eligible And Enrolled', value: 'eligible_and_on_dc' },
    { name: 'Patients Enrolled', value: 'enrolled_in_dc' },
    { name: 'Enrolled Not Eligible', value: 'enrolled_not_elligible' },
    { name: 'Patients Active on DC Facility', value: 'enrolled_in_dc_active' },
    { name: 'Patients Active on DC Community', value: 'enrolled_in_dc_community' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private hivDifferentiatedCareResourceService: HivDifferentiatedCareResourceService
  ) {
  }

  public ngOnInit() {
    this.route.parent.parent.url.subscribe((url) => {
      this.locationUuid = url[0].path;
    });
    this.loadReportParamsFromUrl();
  }

  public extraColumns() {
    return [
      {
        headerName: 'Phone Number',
        width: 150,
        field: 'phone_number'
      },
      {
        headerName: 'Latest Appointment',
        width: 200,
        field: 'last_appointment'
      },
      {
        headerName: 'Latest RTC Date',
        width: 150,
        field: 'latest_rtc_date'
      },
      {
        headerName: 'Current Regimen',
        width: 200,
        field: 'cur_meds'
      },
      {
        headerName: 'Latest VL',
        width: 75,
        field: 'latest_vl'
      },
      {
        headerName: 'Latest VL Date',
        width: 150,
        field: 'latest_vl_date'
      },
      {
        headerName: 'Previous VL',
        width: 75,
        field: 'previous_vl'
      },
      {
        headerName: 'Previous VL Date',
        width: 150,
        field: 'previous_vl_date'
      },
      {
        headerName: 'IPT Start Date',
        width: 160,
        field: 'ipt_start_date'
      },
      {
        headerName: 'Has Completed IPT',
        field: 'completed_IPT',
        width: 100,
        cellRenderer: (column: any) => {
          if (column.value === 1) {
            return '<input type="checkbox" disabled="disabled" checked="checked">';
          } else {
            return '';
          }
        }
      },
      {
        headerName: 'Nearest Center',
        width: 150,
        field: 'nearest_center'
      },
      {
        headerName: 'Community Group',
        width: 160,
        field: 'dc_group'
      }
    ];
  }

  public generateReport() {
    this.loadingError = false;
    this.missingField = false;
    this.patientData = [];
    if (this.indicators && this.startDate && this.endDate && this.locationUuid) {
      const reportSelected = _.find(this.dcIndicators, { value: this.indicators });
      this.indicatorName = reportSelected.name;
      this.storeReportParamsInUrl();
      this.isLoadingPatientList = true;
      this.hivDifferentiatedCareResourceService.getPatientList(this.toDateString(this.startDate),
        this.toDateString(this.endDate), this.locationUuid, this.indicators).take(1).subscribe((data) => {
          this.patientData = this.sortData(data.results.results);
          this.isLoadingPatientList = false;
        }, (err) => {
          this.isLoadingPatientList = false;
          this.loadingError = true;
          console.log('DC PatientList Error', err);
        });
    } else {
      this.missingField = true;
    }
  }

  public loadReportParamsFromUrl() {
    const path = this.router.parseUrl(this.location.path());

    if (path.queryParams['startDate']) {
      this.startDate = new Date(path.queryParams['startDate']);
    }

    if (path.queryParams['endDate']) {
      this.endDate = new Date(path.queryParams['endDate']);
    }

    if (path.queryParams['indicators']) {
      this.indicators = path.queryParams['indicators'];
      this.selectedIndicator = this.indicators;
    }

    if (this.indicators) {
      this.generateReport();
    }
  }

  public storeReportParamsInUrl() {
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      'startDate': this.startDate.toUTCString(),
      'endDate': this.endDate.toUTCString(),
      'indicators': this.indicators
    };
    this.location.replaceState(path.toString());
  }

  private sortData(data) {

    const results = [];

    if (data.length > 0) {

      data.forEach((dt) => {
        if (dt[this.indicators] === 1) {
          results.push(dt);
        }
      });

    }

    return results;

  }

  public onIndicatorChange() {
    this.indicators = this.selectedIndicator;
  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }


}
