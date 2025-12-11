import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Moment from 'moment';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { DataAnalyticsDashboardService } from 'src/app/data-analytics-dashboard/services/data-analytics-dashboard.services';
import { RegistersResourceService } from 'src/app/etl-api/registers-resource.service';

@Component({
  selector: 'app-otz-register',
  templateUrl: './otz-register.component.html',
  styleUrls: ['./otz-register.component.css']
})
export class OtzRegisterComponent implements OnInit {
  @Output()
  public params: any;
  public enabledControls = 'datesControl,locationControl';
  public _month: string;
  public reportName = 'OTZ Register';
  public jointLocationUuids: string;
  public isLoading = false;
  public hasData = false;
  public errorMessage: string;
  public showInfoMessage = false;
  public otzRegisterData: any[] = [];
  public isReleased = true;

  counterArray = Array(3)
    .fill(0)
    .map((index) => index + 1);
  counter = Array(8)
    .fill(0)
    .map((index) => index + 1);

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

  private _startDate: Date = Moment().toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date = Moment().toDate();
  public get endDate(): Date {
    return this._endDate;
  }
  public set endDate(v: Date) {
    this._endDate = v;
  }

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private otzRegisterService: RegistersResourceService,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService
  ) {
    this.route.queryParams.subscribe((data) => {
      if (data.month === undefined) {
        const currentDate = Moment().subtract(1, 'M').endOf('month');
        this._month = currentDate.format('YYYY-MM-DD');
      } else {
        this._month = data.month;
      }

      if (data.startDate && data.endDate) {
        this._startDate = new Date(data.startDate);
        this._endDate = new Date(data.endDate);
      }

      // Check if this is a draft report
      this.showDraftReportAlert(this._month);
    });
  }

  ngOnInit() {}

  public onMonthChange(value): any {
    const selectedDate = Moment(value);
    this._month = selectedDate.endOf('month').format('YYYY-MM-DD');
    this._startDate = selectedDate.startOf('month').toDate();
    this._endDate = selectedDate.endOf('month').toDate();
  }

  public storeParamsInUrl() {
    this.params = {
      locationUuids: this.jointLocationUuids,
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      endDate: Moment(this.endDate).format('YYYY-MM-DD')
    };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public generateReport(): void {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .subscribe((data) => {
        const locationValues = data.locations.map(
          (location) => `'${location.value}'`
        );
        this.jointLocationUuids = locationValues.join(', ');

        this.route.parent.parent.params.subscribe((params: any) => {
          this.storeParamsInUrl();
        });

        this.fetchOtzRegisterData();
      });
  }

  private fetchOtzRegisterData(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.showInfoMessage = false;
    this.hasData = false;
    this.otzRegisterData = [];

    if (!this.jointLocationUuids) {
      this.showInfoMessage = true;
      this.errorMessage = 'Please select at least one location';
      this.isLoading = false;
      return;
    }

    const params = {
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      endDate: Moment(this.endDate).format('YYYY-MM-DD'),
      locationUuids: this.jointLocationUuids
    };

    this.otzRegisterService.getOTZRegister(params).subscribe(
      (result) => {
        this.isLoading = false;
        if (result && result.error) {
          this.showInfoMessage = true;
          this.errorMessage =
            result.message ||
            'There has been an error while loading the report, please retry again';
        } else if (result && Array.isArray(result)) {
          this.otzRegisterData = result;
          this.setupOtzStages(this.otzRegisterData);
          this.hasData = this.otzRegisterData.length > 0;
          if (!this.hasData) {
            this.showInfoMessage = true;
            this.errorMessage = 'No data available for the selected criteria';
          }
        } else {
          this.showInfoMessage = true;
          this.errorMessage = 'Invalid response from server';
        }

        // Check if this is a draft report
        this.showDraftReportAlert(this._month);
      },
      (error) => {
        this.isLoading = false;
        this.showInfoMessage = true;
        this.errorMessage =
          'There has been an error while loading the report, please retry again';
        console.error('Error fetching OTZ register data:', error);
      }
    );
  }

  // exportTableToExcel(): void {
  //   const table = document.getElementById('otzRegister');
  //   const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'OTZ Register');

  //   // Format the current date for the filename
  //   const currentDate = Moment().format('YYYY-MM-DD');
  //   XLSX.writeFile(wb, `otz_register_${currentDate}.xlsx`);
  // }

  public showDraftReportAlert(date) {
    if (date != null && date >= Moment().endOf('month').format('YYYY-MM-DD')) {
      this.isReleased = false;
    } else {
      this.isReleased = true;
    }
  }

  isWithinLast6Months(dateStr: string): boolean {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const inputDate = new Date(dateStr);
    return inputDate >= sixMonthsAgo && inputDate <= today;
  }

  private setupOtzStages(patients: any[]): void {
    patients.forEach((patient) => {
      patient.boxes = [
        { label: 1, isChecked: !!patient.otz_orientation },
        { label: 2, isChecked: !!patient.otz_treatment_literacy },
        { label: 3, isChecked: !!patient.otz_participation },
        { label: 4, isChecked: !!patient.otz_mentorship },
        { label: 5, isChecked: !!patient.otz_leadership },
        { label: 6, isChecked: !!patient.otz_edu_prevention },
        { label: 7, isChecked: !!patient.otz_future_decision }
      ];
    });
  }
}
