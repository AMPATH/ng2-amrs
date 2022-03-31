import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';
import { Column, GridOptions } from 'ag-grid';

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
  public extraColumnsLoaded: Array<any> = [];
  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    rowSelection: 'multiple'
  };
  public baseColumns = [
    {
      headerName: 'Identifiers',
      field: 'identifiers',
      width: 200,
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
      width: 200,
      pinned: true
    },
    { headerName: 'Gender', field: 'gender', width: 70 },
    { headerName: 'Age', field: 'age', width: 70 }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    public surgeResource: SurgeResourceService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params) {
          this.params = params;
          this.selectedIndicator = params.indicatorHeader;
          this.getPatientList(params);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  private getPatientList(params: any) {
    switch (params.currentView) {
      case 'daily':
        this.surgeResource
          .getSurgeDailyReportPatientList(params)
          .subscribe((data) => {
            this.isLoading = false;
            this.patientData = data.results.results.results;
            this.extraColumnsLoaded = data.results.patientListCols;
            this.hasLoadedAll = true;
            this.generatePatientCols(this.extraColumnsLoaded);
          });
        break;
      case 'weekly':
        this.surgeResource
          .getSurgeWeeklyPatientList(params)
          .subscribe((data) => {
            this.isLoading = false;
            this.patientData = data.results.results.results;
            this.extraColumnsLoaded = data.results.patientListCols;
            this.hasLoadedAll = true;
            this.generatePatientCols(this.extraColumnsLoaded);
          });
        break;
    }
  }

  public generatePatientCols(extraCols) {
    const patientCols = this.baseColumns;
    extraCols.forEach((col: any) => {
      patientCols.push(col);
    });

    this.extraColumns = patientCols;
  }

  public goBack() {
    this._location.back();
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
}
