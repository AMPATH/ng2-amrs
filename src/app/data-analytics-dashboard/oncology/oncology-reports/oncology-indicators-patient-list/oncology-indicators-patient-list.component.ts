import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { GridOptions } from 'ag-grid';
import { OncolgyMonthlySummaryIndicatorsResourceService
} from '../../../../etl-api/oncology-summary-indicators-resource.service';
import * as _ from 'lodash';

@Component({
  selector: 'oncology-indicators-patient-list',
  styleUrls: ['oncology-indicators-patient-list.component.css'],
  templateUrl: 'oncology-indicators-patient-list.component.html'
})

export class OncologysummaryIndicatorsPatientListComponent implements OnInit {
  public title = '';
  public patients: any = [];
  public rowData: any = [];
  public params: any;
  public busy: Subscription;
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

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _location: Location,
    private _oncologyIndicatorService: OncolgyMonthlySummaryIndicatorsResourceService) {

  }

  public ngOnInit() {
    this._route
      .queryParams
      .subscribe((params: any) => {
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
    this.busy = this._oncologyIndicatorService.getOncologySummaryMonthlyIndicatorsPatientList(params)
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
        field: 'no'
      },
      {
        headerName: 'Patient Uuid',
        field: 'patient_uuid',
        hide: true
      }];
    _.each(patientListCols, (cols: any) => {
      if (cols === 'patient_uuid') {

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
    this._router.navigate(['/patient-dashboard/patient/' + patientUuid +
    '/general/general/landing-page']);

  }

  public generateColumns(firstRow) {
    const cols = [
      {
        headerName: 'Encounter Date',
        field: 'encounter_datetime',
      },
      {
        headerName: 'Patient Uuid',
        field: 'patient_uuid',
        hide: true
      }
    ];
    _.each(firstRow, (data, index) => {
      // console.log('Index', index);

      if (index === 'encounter_datetime' || index === 'person_id'
        || index === 'location_uuid' || index === 'location_id' || index === 'patient_uuid') {

      } else {

        cols.push(
          {
            headerName: this.translateIndicator(index),
            field: index
          }
        );

      }
    });

    this.oncologySummaryColdef = cols;

  }

  public translateIndicator(indicator: string) {
    return indicator.toLowerCase().split('_').map((word) => {
      return (word.charAt(0) + word.slice(1));
    }).join(' ');
  }

  public processPatientList(patients) {
    const patientsRow = [];
    let i = 1;
    _.each(patients, (patient: any) => {
      const patientObj = {
        'no': i
      };

      _.forIn(patient, (value, key) => {
        patientObj[key] = value;
        // console.log(key);
      });

      i++;

      patientsRow.push(patientObj);
    });

    this.rowData = patientsRow;

  }

  public navigateBack() {
    this._location.back();
  }

  public onCellClicked($event: any) {
    const patientUuid = $event.data.patient_uuid;
    this.redirectTopatientInfo(patientUuid);
  }

  public exportPatientListToCsv() {
    this.gridOptions.api.exportDataAsCsv();
  }

}
