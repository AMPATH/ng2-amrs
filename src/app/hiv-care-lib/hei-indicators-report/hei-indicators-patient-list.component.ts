import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { GridOptions } from 'ag-grid';

import { HeiReportService } from './../../etl-api/hei-report.service';

@Component({
  selector: 'hei-indicators-patient-list',
  templateUrl: './hei-indicators-patient-list.component.html',
  styleUrls: ['./hei-indicators-patient-list.component.css']
})

export class HeiIndicatorsPatientListComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private heiReportService: HeiReportService) { }

  public title = '';
  public patients: any = [];
  public rowData: any = [];
  public patientList: any  = [];
  public params: any;
  public busy: Subscription;
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

  public heiSummaryColdef: any = [];

  public ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
        if (params) {
          this.getPatientList(params);
          this.title = this.translateIndicator(params.indicators);
          this.params = params;
        }
      }, (error) => {
        console.error('Error', error);
      });
  }

  public getPatientList(params) {
    this.busy = this.heiReportService.getHeiMonthlySummaryPatientList(params)
      .subscribe((result: any) => {
        if (result) {
          const patients = result.result;
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
        field: 'gender',
      },
      {
        headerName: 'Age',
        field: 'age',
      },
      {
        headerName: 'Identifiers',
        field: 'identifiers',
        cellRenderer: (column) => {
          return '<a href="javascript:void(0);" title="Identifiers">' + column.value + '</a>';
        },
        onCellClicked: (column) => {
            this.redirectTopatientInfo(column.data.patient_uuid);
        }
      },
      {
        headerName: 'Date of Birth',
        field: 'birth_date',
      },
      {
        headerName: 'Date of Enrollment',
        field: 'enrollment_date',
      },
      {
        headerName: 'Status',
        field: 'status',
        hide: !this.showColumn('has_status')
      },
      {
        headerName: 'Date of Status',
        field: 'status_date',
        hide: !this.showColumn('has_status')
      },
      {
        headerName: 'Location',
        field: 'location'
      },
      {
        headerName: 'Nearest Center',
        field: 'nearest_center'
      }
    ];


    this.heiSummaryColdef = columns;
  }

  public redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid +
    '/general/general/landing-page']);

  }

  public translateIndicator(indicator: string) {
    const indicatorArray = indicator.toLowerCase().split('_');
    if (indicator === 'hiv_status') {
        return indicatorArray[0].toUpperCase() + ' '
        + indicatorArray[1].charAt(0).toUpperCase() + indicatorArray[1].slice(1);
    } else {

      return indicatorArray.map((word) => {
            return ((word.charAt(0).toUpperCase()) + word.slice(1));
      }).join(' ');
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
      const firstRow: any  = this.patients[0];
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
