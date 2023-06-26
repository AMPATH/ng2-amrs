import { Component, OnInit } from '@angular/core';
import { TxMmdResourceService } from 'src/app/etl-api/tx-mmd-resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as Moment from 'moment';
@Component({
  selector: 'app-tx-mmd-report-patient-list',
  templateUrl: './tx-mmd-report-patient-list.component.html',
  styleUrls: ['./tx-mmd-report-patient-list.component.css']
})
export class TxMmdReportPatientListComponent implements OnInit {
  public params: any;
  public patientData: any;
  public extraColumns: Array<any> = [];
  public isLoading = true;
  public overrideColumns: Array<any> = [];
  public selectedIndicator: string;
  public selectedIndicatorGender: string;
  public hasLoadedAll = false;
  public hasError = false;
  public selectedMonth: String;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    public txMmdResourceService: TxMmdResourceService
  ) {}

  ngOnInit() {
    this.addExtraColumns();
    this.route.queryParams.subscribe(
      (params) => {
        if (params && params.month) {
          this.params = params;
          this.selectedIndicator = params.indicatorHeader;
          this.selectedIndicatorGender = params.indicatorGender;
          this.getPatientList(params);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  private getPatientList(params: any) {
    this.txMmdResourceService.getTxMmdPatientList(params).subscribe((data) => {
      this.isLoading = false;
      this.patientData = data.results.results;
      this.hasLoadedAll = true;
    });
  }

  public addExtraColumns() {
    const extraColumns = {
      phone_number: 'Phone',
      enrollment_date: 'Enrolment Date',
      last_appointment: 'Last Appointment',
      prev_rtc_date: 'Previous RTC Date',
      latest_rtc_date: 'Latest RTC Date',
      days_since_rtc_date: 'Days since RTC',
      cur_status: 'Current Status',
      arv_first_regimen_names: 'ARV first regimen',
      arv_first_regimen_start_date: 'First ARV start date',
      cur_meds: 'Current Regimen',
      cur_arv_line: 'Current ARV Line',
      arv_start_date: 'ARV Start Date',
      latest_vl: 'Latest VL',
      vl_category: 'VL Category',
      latest_vl_date: 'Latest VL Date',
      previous_vl: 'Previous VL',
      previous_vl_date: 'Previous VL Date',
      ovcid_id: 'OVCID',
      transfer_out_date: 'Transfer out date',
      death_date: 'Death Date',
      cause_of_death: 'Cause of Death'
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
