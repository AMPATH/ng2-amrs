
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router , Params } from '@angular/router';
import { CdmSummaryIndicatorsResourceService }
from '../../../etl-api/cdm-summary-indicators-resource.service';
import { GridOptions } from 'ag-grid/main';
import * as _ from 'lodash';

@Component({
  selector: 'cdm-summary-indicators-patient-list',
  styleUrls: ['cdm-summary-indicators-patient-list.component.css'],
  templateUrl: 'cdm-summary-indicators-patient-list.component.html'
})

export class CdmsummaryIndicatorsPatientListComponent implements OnInit {
  public title: string = 'CDM Summary Indicators Patient List';
  public patients: any = [];
  public rowData: any = [];
  public gridOptions: GridOptions = {
    enableColResize: true,
    enableSorting : true,
    enableFilter : true,
    showToolPanel : false,
    pagination: true,
    paginationPageSize: 300,
    onGridSizeChanged : () => {
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
  public cdmSummaryColdef: any = [
    {
      headerName: '#',
      field: 'patient_no'
    },
    {
      headerName: 'Identifiers',
      field: 'identifiers',
      onCellClicked: (column) => {
        console.log('Identifiers', column);
        this.redirectTopatientInfo(column.data.patient_uuid);
      },
      cellRenderer: (column) => {
        return '<a href="javascript:void(0);" title="Identifiers">'
          + column.value + '</a>';
      }
    },
    {
      headerName: 'Person Name',
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
      headerName: 'Location Name',
      field: 'location_name'
    }
   ];
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _cdmIndicatorService: CdmSummaryIndicatorsResourceService) {

  }

  public ngOnInit() {
    this._route
      .queryParams
      .subscribe((params) => {
        if (params) {
             console.log('Params', params);
             this.getPatientList(params);
           }
       }, (error) => {
          console.error('Error', error);
       });

  }

  public getPatientList(params) {
     console.log('GetPatientList', params);
     this._cdmIndicatorService.getCdmSummaryIndicatorsPatientList(params)
     .subscribe((result: any) => {
         if (result) {
              let patients = result.results;
              this.patients = patients;
              console.log('Result', patients);
              this.processPatientList(patients);
          }
     });
  }

  public redirectTopatientInfo(patientUuid) {

    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this._router.navigate(['/patient-dashboard/patient/' + patientUuid +
      '/general/general/landing-page']);

  }

  public processPatientList(patients) {
    let patientsRow = [];
    let i = 1;

    _.each(patients, (patient: any) => {
        console.log('Patient', patient);
        let patientObj = {
          patient_no: i,
          identifiers: patient.identifiers,
          person_name: patient.person_name,
          gender: patient.gender,
          age: patient.age,
          location_name: patient.location,
          patient_uuid: patient.patient_uuid
        };

        i++;

        patientsRow.push( patientObj);
    });

    this.rowData = patientsRow;

    console.log('Docs', patientsRow );

  }

}
