import { PmtctCalhivRriReportService } from './../../etl-api/pmtct-calhiv-rri-report.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { GridOptions } from 'ag-grid';

@Component({
  selector: 'pmtct-calhiv-patient-list',
  templateUrl: './pmtct-calhiv-patient-list.component.html',
  styleUrls: []
})
export class PmtctCalhivRriPatientListComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private pmtctCalhivRriReportService: PmtctCalhivRriReportService
  ) {}

  public title = '';
  public patients: any = [];
  public rowData: any = [];
  public patientList: any = [];
  public params: any;
  public busy: Subscription;
  public locationUuids: any;
  public gridColumnApi;
  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300,
    onGridSizeChanged: () => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    onGridReady: () => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    }
  };

  public rriSummaryColdef: any = [];

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          this.getPatientList(params);
          this.title = this.translateIndicator(params.indicators);
          this.params = params;
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  public getPatientList(params) {
    this.busy = this.pmtctCalhivRriReportService
      .getRriMonthlySummaryPatientList(params)
      .subscribe((result: any) => {
        if (result) {
          const patients = result.results.results;
          this.patients = patients;
          this.generateDynamicPatientListCols();
          this.processPatientList(patients);
        }
      });
  }

  public backToSummary() {
    this.navigateBack();
  }

  public generateDynamicPatientListCols() {
    const columns = [
      {
        headerName: '#',
        field: 'no'
      },
      {
        headerName: 'Patient Uuid',
        field: 'patient_uuid',
        hide: true
      },
      {
        headerName: 'Name',
        field: 'person_name'
      },
      {
        headerName: 'Gender',
        field: 'gender'
      },
      {
        headerName: 'Age',
        field: 'age'
      },

      {
        headerName: 'Date of Birth',
        field: 'birth_date'
      },
      {
        headerName: 'Date of Enrollment',
        field: 'enrollment_date'
      },

      {
        headerName: 'Location',
        field: 'location'
      }
    ];

    this.rriSummaryColdef = columns;
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

  public translateIndicator(indicator: string) {
    const indicatorArray = indicator.toLowerCase().split('_');
    if (indicator === 'hiv_status') {
      return (
        indicatorArray[0].toUpperCase() +
        ' ' +
        indicatorArray[1].charAt(0).toUpperCase() +
        indicatorArray[1].slice(1)
      );
    } else {
      return indicatorArray
        .map((word) => {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
    }
  }

  public processPatientList(patients) {
    const patientsRow = [];

    _.each(patients, (patient: any, index) => {
      patient['no'] = index + 1;

      patientsRow.push(patient);
    });

    this.rowData = patientsRow;
  }

  public showColumn(column: string) {
    if (this.patients.length > 0) {
      const firstRow: any = this.patients[0];
      if (firstRow[column]) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public navigateBack() {
    this.location.back();
  }

  public onCellClicked($event: any) {
    const patientUuid = $event.data.patient_uuid;
    this.redirectTopatientInfo(patientUuid);
  }

  public exportPatientListToCsv() {
    this.gridOptions.api.exportDataAsCsv();
  }
}
