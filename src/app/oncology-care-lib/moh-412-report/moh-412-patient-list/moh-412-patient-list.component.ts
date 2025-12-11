import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MOH412ResourceService } from './../../../etl-api/moh-412-resource.service';
import { Location } from '@angular/common';
import { GridOptions } from 'ag-grid';

@Component({
  selector: 'app-moh-412-patient-list',
  templateUrl: './moh-412-patient-list.component.html',
  styleUrls: ['./moh-412-patient-list.component.css']
})
export class MOH412PatientListComponent implements OnInit {
  public title = 'Cervical Cancer Screening Summary';
  public params: any;
  public patientData: any;
  public isLoadingReport = true;
  public overrideColumns: Array<any> = [];
  public selectedIndicator: string;
  public hasLoadedAll = false;
  public hasError = false;
  public indicatorHeader: any;
  public patientListCols = [];
  public patientListColdefs = [];
  public normalColdefs = [
    {
      headerName: 'No',
      field: 'no',
      width: 50,
      pinned: true,
      valueGetter: this.getRowNNumber
    },
    {
      headerName: 'CCC Number',
      field: 'ccc_number',
      width: 100,
      pinned: true
    },
    {
      headerName: 'Name',
      field: 'person_name',
      width: 250,
      pinned: true
    },
    {
      headerName: 'NUPI Identifier',
      field: 'upi_number',
      width: 100,
      pinned: true
    },
    { headerName: 'Gender', field: 'gender', width: 100 },
    { headerName: 'Age', field: 'age', width: 100 },
    {
      headerName: 'Identifiers',
      field: 'identifiers',
      width: 250,
      cellRenderer: (column: any) => {
        return (
          '<a href="javascript:void(0);" title="Identifiers">' +
          column.value +
          '</a>'
        );
      }
    },
    { headerName: 'HIV Status', field: 'hiv_status', width: 200 },
    { headerName: 'Screening Date', field: 'screening_date', width: 200 },
    {
      headerName: 'Location',
      field: 'location',
      width: 200
    },
    {
      headerName: 'Primary Facility',
      field: 'primary_care_facility',
      width: 200
    },
    {
      headerName: 'Screening Location',
      field: 'location',
      width: 200
    },
    { headerName: 'Screening Method', field: 'screening_method', width: 200 },
    { headerName: 'OVCID', field: 'ovcid_id', width: 100 },
    {
      headerName: 'Visit Type',
      field: 'screening_visit_type',
      width: 200
    },
    {
      headerName: 'VIA or VIA/VILI RESULT',
      field: 'via_or_via_vili_test_result',
      width: 100
    },
    {
      headerName: 'HPV Result',
      field: 'hpv_test_result',
      width: 100
    },
    {
      headerName: 'Colposcopy Result',
      field: 'colposcopy_test_result',
      width: 100
    },
    { headerName: 'Treatment Method', field: 'treatment_method', width: 200 }
  ];
  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    rowSelection: 'multiple',
    onGridSizeChanged: () => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    }
  };

  public indicatorData = {
    label: 'Patient List',
    description: '',
    indicator: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private moh412Service: MOH412ResourceService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params && params.startDate) {
          this.params = params;
          this.indicatorHeader = params.indicators;
          this.getPatientList(params);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }
  public extraColumns() {
    return this.patientListCols;
  }
  private getPatientList(params: any) {
    this.moh412Service
      .getMoh412MonthlyReportPatientList(params)
      .subscribe((data: any) => {
        if (data.result.length > 0) {
          this.patientData = data.result;
          this.generatePatientCols();
        }
        if (data.indicatorData.length > 0) {
          this.indicatorData = data.indicatorData[0];
        }
        this.hasLoadedAll = true;
        this.isLoadingReport = false;
      });
  }
  public goBack() {
    this._location.back();
  }
  public generatePatientCols() {
    const patientCols = this.normalColdefs;
    const additionalCols = this.patientListCols;
    additionalCols.forEach((col: any) => {
      patientCols.push(col);
    });

    this.patientListColdefs = patientCols;
  }
  public redirectTopatientInfo(patientUuid: string) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate([
      '/patient-dashboard/patient/' +
        patientUuid +
        '/general/general/landing-page'
    ]);
  }

  public onCellClick($event: any) {
    const patientUuid = $event.data.patient_uuid;
    this.redirectTopatientInfo(patientUuid);
  }
  public exportPatientListToCsv() {
    this.gridOptions.api.exportDataAsCsv();
  }
  public getRowNNumber(column: any): number {
    return parseInt(column.node.rowIndex, 10) + 1;
  }
}
