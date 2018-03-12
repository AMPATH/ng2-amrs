import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { LabsResourceService } from '../../../etl-api/labs-resource.service';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';

import { GridOptions } from 'ag-grid/main';
import 'ag-grid-enterprise/main';
import * as Moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lab-result',
  templateUrl: './lab-result.component.html',
  styleUrls: []
})
export class LabResultComponent implements OnInit, OnDestroy {
  public patient: any;
  public error: string;
  public loadingPatient: boolean;
  public fetchingResults: boolean;
  public isLoading: boolean;
  public patientUuId: any;
  public nextStartIndex: number = 0;
  public dataLoaded: boolean = false;
  public loadingLabSummary: boolean = false;
  public labResults = [];
  public subscription: Subscription;
  public gridOptions: GridOptions;
  constructor(
    private labsResourceService: LabsResourceService,
    private patientService: PatientService,
    private zeroVlPipe: ZeroVlPipe) {
    this.gridOptions = {} as GridOptions;
  }

  public ngOnInit() {
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

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getHistoricalPatientLabResults(
    patientUuId, params: { startIndex: string, limit: string }) {
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
  public formatDateField(result) {
    let tests = [];
    for (let  data of result) {
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
  public loadMoreLabResults() {
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
         cellStyle: {
          'text-align': 'center'
        }
      },
      {
        headerName: 'Tests Ordered',
        width: 120,
        field: 'tests_ordered',
        cellStyle: {
          'text-align': 'center'
        }
      },
      {
        headerName: 'HIV VL',
        width: 100,
        field: 'hiv_viral_load',
        cellRenderer: (column) => {
             let vl = this.zeroVlPipe.transform(column.value);
             return vl;
        },
        cellStyle: {
          'text-align': 'center'
        }
      },
      {
        headerName: 'DNA PCR',
        width: 190,
        field: 'hiv_dna_pcr',
        cellStyle: {
          'text-align': 'center'
        }
      },
      {
        headerName: 'HIV RAPID',
        width: 190,
        field: 'hiv_rapid_test',
        cellStyle: {
          'text-align': 'center'
        }
      },
      {
        headerName: 'CD4',
        width: 100,
        field: 'cd4_count',
         cellStyle: {
          'text-align': 'center'
        }
      },
      {
        headerName: 'CD4%',
        width: 70,
        field: 'cd4_percent',
        cellStyle: {
          'text-align': 'center'
        }
      },

      {
        headerName: 'Hb',
        width: 80,
        field: 'hemoglobin',
        cellStyle: {
          'text-align': 'center'
        }
      },
      {
        headerName: 'AST',
        field: 'ast',
        width: 80,
        editable: true,
        cellStyle: {
          'text-align': 'center'
        }
      },
      {
        headerName: 'Cr',
        width: 80,
        field: 'creatinine',
        cellStyle: {
          'text-align': 'center'
        }
      },
      {
        headerName: 'CXR',
        width: 280,
        field: 'chest_xray',
        cellStyle: {
          'text-align': 'center'
        }
      },
      {
        headerName: 'Lab Errors',
        width: 250,
        field: 'lab_errors',
        cellStyle: {
          'text-align': 'center'
        }
      }
    ];
  }

}
