import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { IptReportService } from 'src/app/etl-api/ipt-report.service';

@Component({
  selector: 'ipt-patient-list',
  templateUrl: './ipt-report-patient-list.component.html',
  styleUrls: ['./ipt-report-patient-list.component.css']
})
export class IptReportPatientListComponent implements OnInit {
  public params: IptReportParams;
  public isLoading = false;
  public selectedIndicator: string;
  public patientData: Array<any> = [];
  public overrideColumns: Array<any> = [];
  public extraColumns: Array<any> = [];
  public hasLoadedAll = false;
  public hasError = false;

  constructor(
    private route: ActivatedRoute,
    private _location: Location,
    public iptReportService: IptReportService
  ) {}

  public ngOnInit() {
    this.addExtraColumns();
    this.route.queryParams.subscribe((params: IptReportParams) => {
      if (params) {
        this.params = params;
        this.selectedIndicator = params.indicatorHeader;
        this.getPatientList(params);
      }
    });
  }

  public addExtraColumns() {
    const extraColumns = {
      weight: 'Weight',
      height: 'Height',
      stage: 'WHO Stage',
      phone_number: 'Phone Number',
      enrollment_date: 'Date Enrolled',
      last_appointment: 'Latest Appointment',
      patient_category: 'Patient Category',
      latest_rtc_date: 'Latest RTC Date',
      days_since_rtc_date: 'Days Since RTC',
      status: 'Current Status',
      ipt_start_date: 'IPT Start Date',
      ipt_completion_date: 'IPT Completion Date',
      ipt_outcome: 'IPT Outcomes',
      tb_test_modality: 'Tb test modality',
      tb_tx_start_date: 'Tb Tx Start Date',
      tb_tx_stop_reason: 'Tb Tx Stop reason',
      arv_first_regimen_start_date: 'ARV Initial Start Date',
      arv_first_regimen: 'ARV Initial Regimen',
      cur_meds: 'Current ART Regimen',
      cur_arv_line: 'Current ARV Line',
      latest_vl: 'Latest VL',
      latest_vl_date: 'Latest VL Date',
      previous_vl: 'Previous VL',
      previous_vl_date: 'Previous VL Date',
      ovcid_id: 'OVCID',
      nearest_center: 'Estate/Nearest Center'
    };

    for (const column in extraColumns) {
      if (column) {
        this.extraColumns.push({
          headerName: extraColumns[column],
          field: column
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
        field: 'cur_meds',
        width: 400
      },
      {
        field: 'arv_first_regimen',
        width: 400
      }
    );
  }

  public getPatientList(params: any) {
    this.isLoading = true;
    this.iptReportService.getIptReportPatientList(params).subscribe((data) => {
      if (data.error) {
        this.hasError = true;
        this.isLoading = false;
      } else {
        this.patientData = data.result;
        this.isLoading = false;
        this.hasLoadedAll = true;
      }
    });
  }

  public goBack() {
    this._location.back();
  }
}

interface IptReportParams {
  locationUuids: string;
  endDate: Date;
  indicators: string;
  indicatorHeader: string;
}
