import { Component, OnInit } from '@angular/core';
import { PrepResourceService } from 'src/app/etl-api/prep-resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as Moment from 'moment';
@Component({
  selector: 'app-prep-report-patient-list',
  templateUrl: './prep-report-patient-list.component.html',
  styleUrls: ['./prep-report-patient-list.component.css']
})
export class PrepReportPatientListComponent implements OnInit {
  public params: any;
  public patientData: any;
  public extraColumns: Array<any> = [];
  public isLoading = true;
  public overrideColumns: Array<any> = [];
  public selectedIndicator: string;
  public hasLoadedAll = false;
  public hasError = false;
  public selectedMonth: String;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    public prepResource: PrepResourceService
  ) {}

  ngOnInit() {
    this.addExtraColumns();
    this.route.queryParams.subscribe(
      (params) => {
        if (params && params.month) {
          this.params = params;
          this.selectedIndicator = params.indicatorHeader;
          this.selectedMonth = Moment(new Date(params.month)).format(
            'MMMM YYYY'
          );
          this.getPatientList(params);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  private getPatientList(params: any) {
    this.prepResource.getPrepPatientList(params).subscribe((data) => {
      this.isLoading = false;
      this.patientData = data.result;
      this.hasLoadedAll = true;
    });
  }

  public addExtraColumns() {
    const extraColumns = {
      phone_number: 'Phone',
      enrollment_date: 'Date Enrolled',
      last_appointment: 'Last Appointment',
      prev_rtc_date: 'Previous RTC Date',
      latest_rtc_date: 'RTC Date',
      days_since_rtc_date: 'Days missed since RTC',
      cur_prep_meds_names: 'Current prEp Regimen',
      hiv_rapid_test: 'HIV Rapid test result',
      rapid_test_date: 'HIV Rapid test date',
      population_type: 'Population Type',
      ovcid_id: 'OVCID',
      population_type_category: 'Population Type Category',
      nearest_center: 'Estate/Nearest Center'
    };

    for (const indicator in extraColumns) {
      if (indicator) {
        this.extraColumns.push({
          headerName: extraColumns[indicator],
          field: indicator
        });
      }
    }

    this.overrideColumns.push(
      {
        field: 'identifiers',
        cellRenderer: (column) => {
          return (
            '<a href="javascript:void(0);" title="Identifiers">' +
            column.value +
            '</a>'
          );
        }
      },
      {
        field: 'last_appointment',
        width: 200
      },
      {
        field: 'cur_prep_meds_names',
        width: 160
      }
    );
  }

  public goBack() {
    this._location.back();
  }
}
