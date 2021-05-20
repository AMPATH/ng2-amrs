import { Component, OnInit } from '@angular/core';
import { PatientGainLoseResourceService } from 'src/app/etl-api/patient-gain-lose-resource.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GridOptions } from 'ag-grid';
@Component({
  selector: 'app-patient-gains-and-loses-patient-list',
  templateUrl: './patient-gains-and-loses-patient-list.component.html',
  styleUrls: ['./patient-gains-and-loses-patient-list.component.css']
})
export class PatientGainsAndLosesPatientListComponent implements OnInit {
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
      headerName: 'Identifiers',
      field: 'identifiers',
      width: 250,
      pinned: true,
      cellRenderer: (column: any) => {
        return (
          '<a href="javascript:void(0);" title="Identifiers">' +
          column.value +
          '</a>'
        );
      }
    },
    {
      headerName: 'Name',
      field: 'person_name',
      width: 250,
      pinned: true
    },
    { headerName: 'Gender', field: 'gender', width: 100 },
    { headerName: 'Age', field: 'age', width: 100 }
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
        // this.gridOptions.api.sizeColumnsToFit();
      }
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    public patientGainLose: PatientGainLoseResourceService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params && params.startingMonth) {
          this.params = params;
          this.selectedIndicator = params.indicator;
          this.indicatorHeader = params.indicatorHeader;
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
    this.patientGainLose
      .getPatientGainAndLosePatientList(params)
      .subscribe((data) => {
        this.isLoadingReport = false;
        this.patientData = data.results.results;
        this.patientListCols = data.results.patientListCols;
        this.generatePatientCols();
        this.hasLoadedAll = true;
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
  public redirectTopatientInfo(patientUuid) {
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
  public getRowNNumber(column): number {
    return parseInt(column.node.rowIndex, 10) + 1;
  }
}
