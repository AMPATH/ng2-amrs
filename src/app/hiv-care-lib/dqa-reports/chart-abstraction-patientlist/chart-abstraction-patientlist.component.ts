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
      height: 'Height',
      weight: 'Weight',
      birthdate: 'Date of Birth (DD/MM/YYYY)',
      hiv_start_date: 'Date Confirmed HIV Positive (DD/MM/YYYY)',
      arv_first_regimen_start_date: 'Date of ART Initiation (DD/MM/YYYY)',
      cd4_1: 'Baseline CD4',
      vl_1: 'Viral Load Results',
      arv_start_date: 'Date of Current ART Initiation (DD/MM/YYYY)',
      drugs_given: 'Current Regimen',
      cur_arv_med_basis: 'Current ART Regimen Basis',
      drugs_duration: 'Drug dosage given (duration)',
      BMI: 'BMI  at Last visit',
      muac: 'MUAC  at Last visit',
      tb_screened_this_visit: 'Was TB Screening done at last visit',
      pcp_prophylaxis: 'PCP Prophylaxis',
      ctx_dispensed: 'CTX Dispensed',
      tb_screening_result: 'TB Screening outcomes',
      last_ipt_start_date: 'IPT start date (DD/MM/YYYY)',
      tpt_status: 'IPT status',
      ipt_completion_date: 'IPT outcome date (DD/MM/YYYY)',
      viral_load_validity: 'Does the client have a Valid Viral load result',
      vl_suppression: 'Is the client virally suppressed',
      has_cd4_1: 'Does this client have Baseline screening for CD4',
      is_crag_screened: 'Does this client have Baseline screening for CrAG',
      last_clinical_encounter: 'Last clinical encounter date (DD/MM/YYYY)',
      sysBP: 'Systolic BP',
      dysBP: 'Diastolic BP',
      nutrition: 'Nutrition Assessment Done',
      DSD: 'DSD Model',
      ovcid_id: 'OVCID',
      ipt_stop_date: 'IPT Stop Date (DD/MM/YYYY)',
      next_appointment: 'Next appointment date (DD/MM/YYYY)',
      visit_type: 'Visit Type',
      status: 'Status',
      cur_who_stage: 'Current Who Stage',
      category: 'Category',
      delivery_method: 'Delivery Method',
      pregnancy_outcome: 'Pregnancy Outcome',
      svd_and_live_birth: 'SVD Livebirth'
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
      { field: 'ccc_number', hide: false, pinned: true },
      {
        field: 'birthdate',
        hide: true,
        pinned: false
      },
      {
        field: 'last_appointment_date',
        hide: true
      },
      {
        field: 'arv_first_regimen_start_date',
        hide: false
      },
      {
        field: 'arv_start_date',
        hide: true
      },
      {
        field: 'hiv_start_date',
        hide: true
      },
      {
        field: 'last_clinical_encounter',
        hide: true
      },
      {
        field: 'next_appointment',
        hide: true
      },
      {
        field: 'tb_screened_this_visit',
        hide: true
      },
      {
        field: 'vl_1',
        cellRenderer: (column) => {
          if (column.value === 0) {
            return 'LDL';
          }
          return column.value;
        },
        hide: false
      },
      {
        field: 'nutrition',
        width: 150,
        cellRenderer: (column) => {
          if (column.value === 'YES') {
            return 'YES';
          }
          return 'NO';
        },
        hide: true
      },
      {
        field: 'last_ipt_start_date',
        hide: false
      },
      {
        field: 'ipt_completion_date',
        hide: false
      },
      {
        field: 'ipt_stop_date',
        hide: true,
        suppressToolPanel: true
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
        width: 100,
        hide: true
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
        width: 150,
        hide: true,
        pinned: true
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
        hide: false
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
        hide: false
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
        hide: true
      },
      {
        field: 'nutrition',
        width: 150,
        hide: true
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
        hide: true
      },
      {
        field: 'vl_suppression',
        width: 150,
        hide: true
      },
      {
        field: 'is_crag_screened',
        width: 150,
        hide: true
      },
      {
        field: 'status',
        width: 150,
        hide: true
      },
      {
        field: 'cd4_1',
        width: 150,
        hide: false
      },
      {
        field: 'category',
        width: 150,
        hide: true
      },
      {
        field: 'has_cd4_1',
        width: 150,
        hide: true
      },
      {
        field: 'BMI',
        width: 150,
        hide: true
      },
      {
        field: 'tpt_status',
        width: 150,
        hide: true
      },
      {
        field: 'ipt_start_date',
        width: 150,
        hide: true
      },
      {
        field: 'last_ipt_start_date',
        hide: true
      },
      {
        field: 'ipt_completion_date',
        hide: true
      },
      {
        field: 'cur_arv_med_basis',
        hide: true
      },
      {
        field: 'vl_suppression',
        hide: true
      },
      {
        field: 'viral_load_validity',
        hide: true
      },
      {
        field: 'pcp_prophylaxis',
        hide: true
      },
      {
        field: 'delivery_method',
        hide: true
      },
      {
        field: 'pregnancy_outcome',
        hide: true
      },
      {
        field: 'svd_and_live_birth',
        hide: false
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
