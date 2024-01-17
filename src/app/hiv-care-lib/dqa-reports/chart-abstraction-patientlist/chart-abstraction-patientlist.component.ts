import { Component, OnInit } from '@angular/core';
import { DqaChartAbstractionService } from 'src/app/etl-api/dqa-chart-abstraction.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

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
            limit: this.params.limit ? this.params.limit : 'all',
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
      NUPI: 'NUPI',
      sex_gender: 'Sex',
      birthdate: 'Date of Birth (DD/MM/YYYY)',
      age: 'Age',
      hiv_start_date: 'Date Confirmed HIV Positive (DD/MM/YYYY)',
      arv_first_regimen_start_date: 'Date of ART Initiation (DD/MM/YYYY)',
      arv_start_date: 'Date of Current ART Initiation (DD/MM/YYYY)',
      drugs_given: 'Current ART Regimen',
      cur_arv_med_basis: 'Current ART Regimen',
      drugs_duration: 'Drug dosage given (duration)',
      height: 'Height at Last visit',
      weight: 'Weight  at Last visit',
      BMI: 'BMI  at Last visit',
      muac: 'MUAC  at Last visit',
      tb_screened_this_visit: 'Was TB Screening done at last visit',
      tb_screening_result: 'TB Screening outcomes',
      last_ipt_start_date: 'IPT start date',
      tpt_status: 'IPT status',
      ipt_completion_date: 'IPT outcome date',
      viral_load_validity: 'Does the client have a Valid Viral load result',
      vl_suppression: 'Is the client virally suppressed',
      cd4_1: 'Baseline screening for CD4',
      has_cd4_1: 'Does this client have Baseline screening for CD4',
      is_crag_screened: 'Does this client have Baseline screening for CrAG',
      last_clinical_encounter: 'Last clinical encounter date (DD/MM/YYYY)',
      sysBP: 'Systolic BP',
      dysBP: 'Diastolic BP',
      nutrition: 'Nutrition Assessment Done',
      DSD: 'DSD Model',
      // cd4_1: 'Baseline CD4 Test Result',
      // vl_1: 'Latest Valid VL',
      vl_1: 'Does the client have a Valid viral load result',
      ovcid_id: 'OVCID',
      ipt_stop_date: 'IPT Stop Date (DD/MM/YYYY)',
      // last_clinical_encounter: 'Last Clinical Encounter',
      // last_appointment_date: 'Date of Last Appointment',
      next_appointment: 'Next appointment date (DD/MM/YYYY)',
      // next_appointment: 'Date of Next Appointment ',
      visit_type: 'Visit Type',
      status: 'Status',
      // is_crag_screened: 'Baseline CrAG Screened',
      cur_who_stage: 'Current Who Stage',
      category: 'Category'
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
      { field: 'ccc_number', hide: true, pinned: true },
      { field: 'ccc_number', hide: true, pinned: true },
      {
        field: 'birthdate'
        // cellRenderer: (column) => {
        //   if (column.value != null && column.value !== '') {
        //     // return moment(column.value).format('YYYY-MM-DD');
        //     return moment(column.value).format('DD/MM/YYYY');
        //   }
        // },
        // pinned: false
      },
      {
        field: 'last_appointment_date'
        // cellRenderer: (column) => {
        //   if (column.value != null && column.value !== '') {
        //     return moment(column.value).format('DD/MM/YYYY');
        //   }
        // }
      },
      {
        field: 'arv_first_regimen_start_date'
        // cellRenderer: (column) => {
        //   if (column.value != null && column.value !== '') {
        //     return moment(column.value).format('DD/MM/YYYY');
        //   }
        // }
      },
      {
        field: 'arv_start_date',
        cellRenderer: (column) => {
          if (column.value != null && column.value !== '') {
            return moment(column.value).format('DD/MM/YYYY');
          }
        },
        hide: true
      },
      {
        field: 'hiv_start_date'
        // cellRenderer: (column) => {
        //   if (column.value != null && column.value !== '') {
        //     return moment(column.value)..format('DD/MM/YYYY');;
        //   }
        // }
      },
      {
        field: 'last_clinical_encounter'
        // cellRenderer: (column) => {
        //   if (column.value != null && column.value !== '') {
        //     return moment(column.value)..format('DD/MM/YYYY');;
        //   }
        // }
      },
      {
        field: 'next_appointment'
        // cellRenderer: (column) => {
        //   if (column.value != null && column.value !== '') {
        //     return moment(column.value)..format('DD/MM/YYYY');;
        //   }
        // }
      },
      {
        field: 'tb_screened_this_visit'
        // width: 150,
        // cellRenderer: (column) => {
        //   if (column.value === 1) {
        //     return 'Yes';
        //   } else if (column.value === 0) {
        //     return 'No';
        //   }
        //   return 'Not Documented';
        // }
      },
      {
        field: 'vl_1',
        cellRenderer: (column) => {
          if (column.value === 0) {
            return 'LDL';
          }
          return column.value;
        },
        hide: true
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
        field: 'last_ipt_start_date'
        // cellRenderer: (column) => {
        //   if (column.value != null && column.value !== '') {
        //     return moment(column.value)..format('DD/MM/YYYY');;
        //   }
        // },
        // hide: false
      },
      {
        field: 'ipt_completion_date'
        // cellRenderer: (column) => {
        //   if (column.value != null && column.value !== '') {
        //     return moment(column.value)..format('DD/MM/YYYY');;
        //   }
        // },
        // hide: false
      },
      {
        field: 'ipt_stop_date',
        cellRenderer: (column) => {
          if (column.value != null && column.value !== '') {
            return moment(column.value).format('DD/MM/YYYY');
          }
        },
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'drugs_given',
        width: 280,
        hide: true
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
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'muac',
        width: 100
      },
      {
        field: 'person_id',
        width: 200,
        pinned: true,
        suppressToolPanel: true
      },
      {
        field: 'NUPI',
        width: 150
        // pinned: true
      },
      {
        field: 'upi_number',
        width: 150
        // pinned: true
      },
      {
        field: 'upi_number',
        width: 150,
        hide: true,
        pinned: true,
        suppressToolPanel: true
      },
      {
        field: 'drugs_given',
        width: 280,
        hide: true
      },
      {
        field: 'cur_arv_med_basis',
        width: 280,
        hide: true
      },
      {
        field: 'cur_arv_med_basis',
        width: 280
      },
      {
        field: 'vl_1',
        width: 150
      },
      {
        field: 'drugs_duration',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'person_name',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'gender',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'identifiers',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'age',
        width: 150,
        hide: true
      },
      {
        field: 'sex_gender',
        width: 150
      },
      {
        field: '#',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'visit_type',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'sysBP',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'dysBP',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'nutrition',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'DSD',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'ovcid_id',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'cur_who_stage',
        width: 150,
        hide: true,
        suppressToolPanel: true
      },
      {
        field: 'vl_suppression',
        width: 150,
        hide: false
      },
      {
        field: 'is_crag_screened',
        width: 150,
        hide: false
      },
      {
        field: 'status',
        width: 150,
        hide: true
      },
      {
        field: 'cd4_1',
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
