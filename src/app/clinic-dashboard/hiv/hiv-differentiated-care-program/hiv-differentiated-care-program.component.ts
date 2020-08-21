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
  public reportName = 'HIV Differentiated Care Program Reports';
  public patientData: Array<any> = [];
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
  public hasLoadedAll = false;
  public limit = 300;
  public startIndex = 0;
  public enabledControls = 'monthControl';
  public month = Moment().format('YYYY-MM');

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
        width: 100,
        field: 'latest_vl'
      },
      {
        headerName: 'Latest VL Date',
        width: 150,
        field: 'latest_vl_date'
      },
      {
        headerName: 'Previous VL',
        width: 100,
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
        width: 160,
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
    const currentPatients = this.patientData;
    this.patientData = [];
    if (this.indicators && this.startDate && this.endDate && this.locationUuid) {
      const reportSelected = _.find(this.dcIndicators, { value: this.indicators });
      this.indicatorName = reportSelected.name;
      this.storeReportParamsInUrl();
      this.isLoadingPatientList = true;
      this.hivDifferentiatedCareResourceService.getPatientList(this.startDateString,
        this.endDateString, this.locationUuid, this.indicators, this.startIndex, this.limit).take(1).subscribe((data) => {
          this.patientData = this.appendData(currentPatients, data.results.results);
          this.isLoadingPatientList = false;
          this.checkOrderLimit(data.results.results.length);
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
      this.month = Moment(path.queryParams['startDate']).format('YYYY-MM');
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
      'startDate': this.startDateString,
      'endDate': this.endDateString,
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

  private appendData(patientArray, data) {
    if (data.length > 0) {
      const patients = this.sortData(data);
      patients.forEach(patient => {
        patientArray.push(patient);
      });
    }
    return patientArray;
  }

  public onIndicatorChange() {
    this.resetStartIndex();
    this.indicators = this.selectedIndicator;
  }

  public onEndDateChange(event) {
    this.resetStartIndex();
  }

  public onStartDateChange(event) {
    this.resetStartIndex();
  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

  public checkOrderLimit(resultCount: number): void {
    this.hasLoadedAll = false;
    if (resultCount < this.limit) {
      this.hasLoadedAll = true;
    }
  }

  public loadMorePatients() {
    this.startIndex += 300;
    this.generateReport();
  }

  private resetStartIndex() {
    this.startIndex = 0;
    this.patientData  = [];
  }

  public onMonthChange(): any {
    const formattedMonth = Moment(this.month).format('YYYY-MM-DD');
    this.startDateString = Moment(formattedMonth).startOf('month').format('YYYY-MM-DD');
    this.endDateString = Moment(formattedMonth).endOf('month').format('YYYY-MM-DD');
    this.patientData  = [];
  }

}
