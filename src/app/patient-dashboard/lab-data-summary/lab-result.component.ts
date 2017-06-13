import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../patient.service';
import { LabsResourceService } from '../../etl-api/labs-resource.service';

import { GridOptions } from 'ag-grid/main';
import 'ag-grid-enterprise/main';
import * as Moment from 'moment';
import { Subscription } from 'rxjs';


@Component({
  selector: 'lab-result',
  templateUrl: 'lab-result.component.html',
  styleUrls: []
})
export class LabResultComponent implements OnInit, OnDestroy {
  patient: any;
  error: string;
  loadingPatient: Boolean;
  fetchingResults: Boolean;
  isLoading: boolean;
  patientUuId: any;
  nextStartIndex: number = 0;
  dataLoaded: boolean = false;
  loadingLabSummary: boolean = false;
  labResults = [];
  subscription: Subscription;
  public gridOptions: GridOptions;
  constructor(private labsResourceService: LabsResourceService,
    private patientService: PatientService) {
    this.gridOptions = <GridOptions>{};
  }

  ngOnInit() {
    this.loadingPatient = true;
    this.subscription = this.patientService.currentlyLoadedPatient.subscribe(
      (patient) => {
        this.loadingPatient = false;
        if (patient) {
          this.patient = patient;
          this.patientUuId = this.patient.person.uuid;
          this.getHistoricalPatientLabResults(this.patientUuId,
            { startIndex: this.nextStartIndex.toString(), limit: '20' });



        }
      }
    );
    this.gridOptions.columnDefs = this.createColumnDefs();
    this.gridOptions.rowData = this.labResults;

  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getHistoricalPatientLabResults(patientUuId, params: { startIndex: string, limit: string }) {
    this.patientUuId = this.patient.person.uuid;
    this.fetchingResults = true;
    this.labsResourceService.getHistoricalPatientLabResults(this.patientUuId,
      { startIndex: this.nextStartIndex.toString(), limit: '20' }).subscribe((result) => {
        if (result) {
          this.labResults = this.formatDateField(result);
          if (this.labResults.length > 0) {
            let size: number = this.labResults.length;
            this.nextStartIndex = +(params.startIndex) + size;
            this.isLoading = false;
          } else {
            this.dataLoaded = true;
          }
          this.fetchingResults = false;
        }
      }, (err) => {
        this.fetchingResults = false;
        this.error = err;
      });
    return this.labResults;

  }
  formatDateField(result) {
    let tests = [];
    for (let i = 0; i < result.length; ++i) {
      let data = result[i];
      let testDatetime;
      for (let r in data) {
        if (data.hasOwnProperty(r)) {
          let lab = Moment(data.test_datetime).format('DD-MM-YYYY');
          data['testDatetime'] = lab;
        }
      }
      tests.push(data);


    }
    return tests;

  }
  loadMoreLabResults() {
    this.isLoading = true;
    this.getHistoricalPatientLabResults(this.patientUuId,
      { startIndex: this.nextStartIndex.toString(), limit: '20' });
  }
  private createColumnDefs() {
    return [
      {
        headerName: 'Date',
        width: 100,
        field: 'testDatetime',
      },
      {
        headerName: 'Tests Ordered',
        width: 120,
        field: 'tests_ordered'
      },
      {
        headerName: 'HIV VL',
        width: 100,
        field: 'hiv_viral_load'
      },
      {
        headerName: 'DNA PCR',
        width: 190,
        field: 'hiv_dna_pcr'
      },
      {
        headerName: 'CD4',
        width: 100,
        field: 'cd4_count'
      },
      {
        headerName: 'CD4%',
        width: 70,
        field: 'cd4_percent'
      },

      {
        headerName: 'Hb',
        width: 80,
        field: 'hemoglobin'
      },
      {
        headerName: 'AST',
        field: 'ast',
        width: 80,
        editable: true
      },
      {
        headerName: 'Cr',
        width: 80,
        field: 'creatinine'
      },
      {
        headerName: 'CXR',
        width: 280,
        field: 'chest_xray'
      },
      {
        headerName: 'Lab Errors',
        width: 250,
        field: 'lab_errors'
      }
    ];
  }

}
