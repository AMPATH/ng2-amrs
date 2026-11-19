import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  expectedFromParams,
  linelistPageSize,
  loadAllPages
} from '../../linelist-loading/paged-linelist-loader';
import { TxCurrResourceService } from 'src/app/etl-api/tx-curr-resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as Moment from 'moment';
@Component({
  selector: 'app-tx-curr-report-patient-list',
  templateUrl: './tx-curr-report-patient-list.component.html',
  styleUrls: ['./tx-curr-report-patient-list.component.css']
})
export class TxCurrReportPatientListComponent implements OnInit, OnDestroy {
  public params: any;
  public patientData: any;
  public extraColumns: Array<any> = [];
  public isLoading = true;
  /** The figure the list was opened from, when known. */
  public expectedTotal: number = null;
  /** Identifies the current load, so a superseded one stops quietly. */
  private runId = 0;
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
    public txCurrResourceService: TxCurrResourceService
  ) {}

  /** Leaving the page stops any pages still to be fetched. */
  ngOnDestroy() {
    this.runId++;
  }

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
    const runId = ++this.runId;
    this.isLoading = true;
    this.hasLoadedAll = false;
    this.hasError = false;
    this.patientData = [];
    this.expectedTotal = expectedFromParams(params);
    loadAllPages(
      (startIndex, limit) =>
        this.txCurrResourceService
          .getTxCurrPatientList(
            Object.assign({}, params, { startIndex, limit })
          )
          .toPromise()
          .then((data: any) => {
            if (!data || data.error || !data.results) {
              throw data;
            }
            return data.results.results || [];
          }),
      {
        pageSize: linelistPageSize(this.expectedTotal),
        concurrency: 4,
        isCancelled: () => runId !== this.runId,
        onProgress: (rows) => (this.patientData = rows)
      }
    ).then(
      (rows) => {
        if (runId !== this.runId) {
          return;
        }
        this.patientData = rows;
        this.isLoading = false;
        this.hasLoadedAll = true;
      },
      (err) => {
        if (runId !== this.runId) {
          return;
        }
        console.error('Patient list failed', err);
        this.isLoading = false;
        this.hasError = true;
      }
    );
  }

  public addExtraColumns() {
    const extraColumns = {
      weight: 'Weight',
      phone_number: 'Phone',
      location: 'Location',
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
