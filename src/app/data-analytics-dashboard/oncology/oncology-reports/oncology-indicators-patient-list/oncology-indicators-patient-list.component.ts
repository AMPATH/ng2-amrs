import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { GridOptions } from 'ag-grid';

import { OncologySummaryIndicatorsResourceService } from '../../../../etl-api/oncology-summary-indicators-resource.service';

@Component({
  selector: 'oncology-indicators-patient-list',
  templateUrl: './oncology-indicators-patient-list.component.html',
  styleUrls: ['./oncology-indicators-patient-list.component.css']
})
export class OncologySummaryIndicatorsPatientListComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private oncologyIndicatorService: OncologySummaryIndicatorsResourceService
  ) {}

  public title = '';
  public patients: any = [];
  public rowData: any = [];
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

  public oncologySummaryColdef: any = [];

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
    this.busy = this.oncologyIndicatorService
      .getOncologySummaryMonthlyIndicatorsPatientList(params)
      .subscribe((result: any) => {
        if (result) {
          const patients = result.results.results;
          const patientListCols = result.patientListCols;
          this.patients = patients;
          this.generateDynamicPatientListCols(patientListCols);
          this.processPatientList(patients);
        }
      });
  }

  public generateDynamicPatientListCols(patientListCols) {
    const columns = [
      {
        headerName: '#',
        field: 'no',
        width: 50,
        pinned: true
      },
      {
        headerName: 'Patient Uuid',
        field: 'patient_uuid',
        hide: true
      }
    ];

    _.each(patientListCols, (cols: any) => {
      if (cols === 'patient_uuid') {
        return '';
      } else if (cols === 'person_name') {
        columns.push({
          headerName: 'Person Name',
          field: 'person_name',
          pinned: true,
          width: 250
        });
      } else if (cols === 'via_rtc_date') {
        columns.push({
          headerName: 'VIA RTC date',
          field: 'via_rtc_date',
          hide: false
        });
      } else if (cols === 'encounter_datetime') {
        columns.push({
          headerName: 'Encounter Date',
          field: 'encounter_datetime',
          pinned: true,
          width: 100
        });
      } else {
        columns.push({
          headerName: this.translateIndicator(cols),
          field: cols,
          hide: false
        });
      }
    });

    this.oncologySummaryColdef = columns;
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
    let i = 1;

    _.each(patients, (patient: any) => {
      const patientObj = {
        no: i
      };

      _.forIn(patient, (value, key) => {
        patientObj[key] = value;
      });

      i++;

      patientsRow.push(patientObj);
    });

    this.rowData = patientsRow;
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
