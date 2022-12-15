import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import * as moment from 'moment';

import { DqaChartAbstractionService } from 'src/app/etl-api/dqa-chart-abstraction.service';
@Component({
  selector: 'app-chart-abstraction-patientlist',
  templateUrl: './chart-abstraction-patientlist.component.html',
  styleUrls: ['./chart-abstraction-patientlist.component.css']
})
export class ChartAbstractionPatientlistComponent implements OnInit {
  public extraColumns: Array<any> = [];
  public params: any;
  public patientData: Array<any> = [];
  public nextStartIndex = 0;
  public overrideColumns: Array<any> = [];
  public hasLoadedAll = false;
  public allDataLoaded = false;
  public previousButton = false;
  public hasError = false;
  public isLoading = true;

  constructor(
    public dqaResource: DqaChartAbstractionService,
    private _location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let requestParams: any;

    this.route.queryParams.subscribe(
      (params) => {
        if (params) {
          this.patientData = [];
          this.isLoading = true;
          this.params = params;
          this.addExtraColumns(this.params.patientType);
          requestParams = {
            locations: this.params.locationUuids,
            startDate: this.params.startDate,
            endDate: this.params.endDate,
            patientType: this.params.patientType,
            limit: this.params.limit ? this.params.limit : 10,
            offset: 0
          };
          this.getPatientList(requestParams);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }
  private getPatientList(params: any) {
    this.dqaResource.getDqaChartAbstractionReport(params).subscribe((data) => {
      this.patientData = this.patientData.concat(data);
      this.isLoading = false;
      console.log(this.allDataLoaded);
      if (this.allDataLoaded) {
        this.hasLoadedAll = false;
      } else {
        this.hasLoadedAll = true;
      }
    });
  }
  public addExtraColumns(patientType) {
    let hide = true;
    if (patientType === 'PMTCT') {
      hide = false;
    }
    const extraColumns = {
      person_id: 'CCC Number',
      NUPI: 'NUPI',
      birthdate: 'DOB',
      sex_gender: 'Gender',
      drugs_given: 'Current Regimen',
      drugs_duration: 'Drug dosage given (duration)',
      weight: 'Weight',
      height: 'Height',
      muac: 'MUAC',
      BMI: 'BMI',
      nutrition: 'Nutrition Assessment Done',
      DSD: 'DSD Model',
      hiv_start_date: 'Date Confirmed HIV Positive',
      arv_start_date: 'Date of ART Initiation',
      cd4_1: 'Baseline CD4 Test Result',
      vl_1: 'Latest Valid VL',
      tpt_status: 'TPT Status',
      last_ipt_start_date: 'TPT initiated',
      ipt_stop_date: 'TPT Stop Date',
      ipt_completion_date: 'TPT Completion Date',
      last_clinical_encounter: 'Last Clinical Encounter',
      last_appointment_date: 'Date of Last Appointment',
      next_appointment: 'Date of Next Appointment ',
      visit_type: 'Visit Type',
      tb_screened_this_visit: 'TB screening'
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
        field: 'birthdate',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('YYYY-MM-DD');
          }
        },
        pinned: false
      },
      {
        field: 'last_appointment_date',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('DD-MM-YYYY');
          }
        }
      },
      {
        field: 'arv_start_date',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('DD-MM-YYYY');
          }
        }
      },
      {
        field: 'hiv_start_date',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('DD-MM-YYYY');
          }
        }
      },
      {
        field: 'last_clinical_encounter',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('DD-MM-YYYY');
          }
        }
      },
      {
        field: 'next_appointment',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('DD-MM-YYYY');
          }
        }
      },
      {
        field: 'tb_screened_this_visit',
        width: 150,
        cellRenderer: (column) => {
          if (column.value === 0) {
            return 'NO';
          }
          return 'YES';
        }
      },
      {
        field: 'vl_1',
        cellRenderer: (column) => {
          if (column.value === 0) {
            return 'LDL';
          }
          return column.value;
        }
      },
      {
        field: 'nutrition',
        width: 150,
        cellRenderer: (column) => {
          if (column.value === 'YES') {
            return 'YES';
          }
          return 'NO';
        }
      },
      {
        field: 'last_ipt_start_date',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('DD-MM-YYYY');
          }
        },
        hide: true
      },
      {
        field: 'ipt_completion_date',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('DD-MM-YYYY');
          }
        },
        hide: true
      },
      {
        field: 'ipt_stop_date',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('DD-MM-YYYY');
          }
        },
        hide: true
      },
      {
        field: 'arv_start_date',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('DD-MM-YYYY');
          }
        }
      },
      {
        field: 'drugs_given',
        width: 280
      },
      {
        field: 'height',
        width: 100
      },
      {
        field: 'weight',
        width: 100
      },
      {
        field: 'muac',
        width: 100
      },
      {
        field: 'visit_type',
        width: 150
      },
      {
        field: 'muac',
        width: 100
      },
      {
        field: 'person_id',
        width: 200,
        pinned: true
      },
      {
        field: 'NUPI',
        width: 150,
        pinned: true
      },
      {
        field: 'drugs_given',
        width: 280
      },
      {
        field: 'vl_1',
        width: 150
      },
      {
        field: 'drugs_duration',
        width: 150
      },
      {
        field: 'person_name',
        width: 150,
        hide: true
      },
      {
        field: 'gender',
        width: 150,
        hide: true
      },
      {
        field: 'identifiers',
        width: 150,
        hide: true
      },
      {
        field: 'age',
        width: 150
      },
      {
        field: 'sex_gender',
        width: 150
      },
      {
        field: '#',
        width: 150,
        hide: true
      },
      {
        field: 'visit_type',
        width: 150,
        hide: true
      }
    );
  }
  public loadMoreDQAList(option) {
    this.isLoading = true;
    let loadMoreParams: any;
    loadMoreParams = {
      locations: this.params.locationUuids,
      limit: 300,
      offset: 0
    };
    if (option === 'next') {
      this.nextStartIndex += this.patientData.length;
      loadMoreParams.offset = this.nextStartIndex;
      this.getPatientList(loadMoreParams);
    }
    if (option === 'all') {
      loadMoreParams.limit = 2000000000;
      this.nextStartIndex = 0;
      loadMoreParams.offset = this.nextStartIndex;
      this.patientData = [];
      this.getPatientList(loadMoreParams);
      this.allDataLoaded = true;
    }
  }
  public goBack() {
    this._location.back();
  }
}
