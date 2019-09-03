import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';
import * as moment from 'moment';
import { Column } from 'ag-grid';

@Component({
  selector: 'surge-report-patientlist',
  templateUrl: './surge-report-patient-list.component.html',
  styleUrls: ['./surge-report-patient-list.component.css']
})
export class SurgeReportPatientListComponent implements OnInit {

  public params: any;
  public patientData: any;
  public extraColumns: Array<any> = [];
  public isLoading = true;
  public overrideColumns: Array<any> = [];
  public selectedIndicator: string;
  public hasLoadedAll = false;
  public hasError = false;

  constructor(private router: Router, private route: ActivatedRoute,
     private _location: Location, public surgeResource: SurgeResourceService) { }

  ngOnInit() {
    this.addExtraColumns();
    this.route
      .queryParams
      .subscribe((params) => {
        if (params) {
          this.params = params;
          this.selectedIndicator = params.indicatorHeader;
          this.getPatientList(params);
        }
      }, (error) => {
        console.error('Error', error);
      });
  }

  private getPatientList(params: any) {
    switch (params.currentView) {
      case 'daily':
        this.surgeResource.getSurgeDailyReportPatientList(params)
          .subscribe(
            (data) => {
              this.isLoading = false;
              this.patientData = data.results.results;
              this.hasLoadedAll = true;
            }
          );
        break;
      case 'weekly':
        this.surgeResource.getSurgeWeeklyPatientList(params)
          .subscribe(
            (data) => {
              this.isLoading = false;
              this.patientData = data.results.results;
              this.hasLoadedAll = true;
            }
          );
        break;
    }
  }

  public addExtraColumns() {
    const extraColumns = {
      phone_number: 'Phone',
      enrollment_date: 'Date Enrolled',
      clinical_visit_num: 'Encounter Number since enrollment',
      last_appointment: 'Encounter Type',
      prev_rtc_date: 'Previous RTC Date',
      encounter_date: 'Encounter Date',
      rtc_date: 'RTC Date',
      days_since_rtc_date: 'Days missed since RTC',
      cur_status: 'Current Status',
      death_date: 'Death Date',
      arv_first_regimen_start_date: 'First ARV regimen start date',
      arv_first_regimen: 'AVR first regimen',
      cur_meds: 'Current Regimen',
      cur_arv_line: 'Current ARV Line',
      latest_vl: 'Latest VL',
      latest_vl_date: 'Latest VL Date',
      previous_vl: 'Previous VL',
      previous_vl_date: 'Prevoius VL Date',
      active_to_ltfu_count: 'Active to LTFU Count',
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
          return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
        }
      },
      {
        field: 'encounter_date',
        cellRenderer: (column) => {
          return moment(column.value).format('YYYY-MM-DD');
        }
      },
      {
        field: 'enrollment_date',
        cellRenderer: (column) => {
          return moment(column.value).format('YYYY-MM-DD');
        }
      },
      {
        field: 'prev_rtc_date',
        cellRenderer: (column) => {
          return column.value !== null ? moment(column.value).format('YYYY-MM-DD') : column.value;
        }
      },
      {
        field: 'rtc_date',
        cellRenderer: (column) => {
          return column.value !== null ? moment(column.value).format('YYYY-MM-DD') : column.value;
        }
      },
      {
        field: 'arv_first_regimen_start_date',
        cellRenderer: (column) => {
          return moment(column.value).format('YYYY-MM-DD');
        }
      },
      {
        field: 'death_date',
        cellRenderer: (column) => {
          return column.value ? moment(column.value).format('YYYY-MM-DD') : column.value;
        }
      },
      {
        field : 'clinical_visit_number',
        width: 250
      },
      {
        field : 'baseline',
        width : 250
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
  public goBack() {
    this._location.back();
  }
}
