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
    this.addExtraColumns();
    this.route.queryParams.subscribe(
      (params) => {
        if (params) {
          this.params = params;
          requestParams = {
            locations: this.params.locationUuids,
            limit: 300,
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
  public addExtraColumns() {
    const extraColumns = {
      ccc_number: "CCC Number",
      NUPI: "NUPI",
      birthdate: 'DOB',
      date_confirmed_hiv_positive: "Date Confirmed HIV Positive",
      cd4_result: "Baseline CD4 Test Result",
      arv_start_date: "Date of ART Initiation",
      drugs_given: 'Current ART Regimen',
      height: 'Height',
      weight: 'Weight',
      muac: 'MUAC',
      BMI: 'BMI',
      tb_screened_this_visit: 'TB Screening At Last Visit',
      last_ipt_start_date: 'IPT Initiated',
      vl_result: "Viral Load Result",
      last_clinical_encounter: "Last Clinical Encounter Date",
      last_appointment_date: 'Date Of Last Appointment',
      next_appointment: 'Date Of Next Appointment ',
      condom_provided_this_visit: 'Condom Issued'
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
        }
      },
      {
        field: 'last_appointment_date',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('YYYY-MM-DD');
          }
        }
      },
      {
        field: 'arv_start_date',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('YYYY-MM-DD');
          }
        }
      },
      {
        field: 'date_confirmed_hiv_positive',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('YYYY-MM-DD');
          }
        }
      },
      {
        field: 'last_clinical_encounter',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('YYYY-MM-DD');
          }
        }
      },
      {
        field: 'next_appointment',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('YYYY-MM-DD');
          }
        }
      },
      {
        field: 'condom_provided_this_visit',
        width: 150,
        cellRenderer: (column) => {
          if (column.value === 0) {
            return 'NO';
          }
          return 'YES';
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
        field: 'last_ipt_start_date',
        cellRenderer: (column) => {
          if (column.value != null) {
            return moment(column.value).format('YYYY-MM-DD');
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
        field: 'BMI',
        width: 100
      },
      {
        field: 'NUPI',
        width: 150
      },
      {
        field: 'ccc_number',
        width: 150
      },
      {
        field: 'vl_result',
        width: 150
      },
      {
        field: 'cd4_result',
        width: 150
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
