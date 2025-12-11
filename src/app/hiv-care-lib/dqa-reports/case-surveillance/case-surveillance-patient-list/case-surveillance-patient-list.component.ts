import { Component, OnInit } from '@angular/core';
import { CaseSurveillanceService } from 'src/app/etl-api/case-surveillance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as Moment from 'moment';
@Component({
  selector: 'app-case-surveillance-patient-list',
  templateUrl: './case-surveillance-patient-list.component.html',
  styleUrls: ['./case-surveillance-patient-list.component.css']
})
export class CaseSurveillancePatientListComponent implements OnInit {
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
    public caseSurveillanceService: CaseSurveillanceService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params && params.startDate && params.endDate) {
          this.params = params;
          this.selectedIndicator = params.indicatorHeader;
          this.getPatientList(params);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
    this.addExtraColumns();
  }

  private getPatientList(params: any) {
    this.caseSurveillanceService
      .getCaseSurveillancePatientList(params)
      .subscribe((data) => {
        this.isLoading = false;
        this.patientData = data.results.results;
        this.hasLoadedAll = true;
      });
  }

  public addExtraColumns() {
    const extraColumns = {
      weight: 'Weight',
      phone_number: 'Phone',
      enrollment_date: 'Enrolment Date',
      last_appointment: 'Last Appointment',
      latest_rtc_date: 'Latest RTC Date',
      days_since_rtc_date: 'Days since RTC',
      arv_first_regimen: 'ARV first regimen',
      cd4_1: 'CD4',
      cd4_1_date: 'CD4 Date',
      arv_first_regimen_start_date: 'First ARV start date',
      cur_meds: 'Current Regimen',
      cur_arv_line: 'Current ARV Line',
      arv_start_date: 'ARV Start Date',
      latest_vl: 'Latest VL',
      vl_category: 'VL Category',
      latest_vl_date: 'Latest VL Date',
      previous_vl: 'Previous VL',
      previous_vl_date: 'Previous VL Date',
      ovcid_id: 'OVCID'
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
