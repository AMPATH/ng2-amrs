import {take} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { LabsResourceService } from '../../../etl-api/labs-resource.service';
import { ZeroVlPipe } from './../../../shared/pipes/zero-vl-pipe';
import { ActivatedRoute } from '@angular/router';

import { GridOptions } from 'ag-grid/main';
import 'ag-grid-enterprise/main';
import * as Moment from 'moment';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

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
  public currentDepartment = '';
  public labResults = [];
  public subscription: Subscription;
  public gridOptions: GridOptions = {
    onGridSizeChanged: () => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
      }
    },
    onGridReady: (params) => {
      if (this.gridOptions.api) {
        this.gridOptions.api.sizeColumnsToFit();
        // this.gridOptions.groupDefaultExpanded = -1;
      }
    }
  };
  public labCols: any;

  public labRows: any;

  public labRowData: any;

  public generalRows = {

    'hiv_viral_load' : {
      'test': 'HIV VL'
    },
    'hiv_dna_pcr' : {
      'test': 'DNA PCR'
    },
    'hiv_rapid_test': {
      'test': 'HIV RAPID'
    },
    'cd4_count': {
      'test': 'CD4'
    },
    'cd4_percent' : {
      'test': 'CD4%'
    },
    'hemoglobin' : {
      'test': 'Hb'
    },
    'ast' : {
      'test': 'AST'
    },
    'creatinine' : {
      'test': 'Cr'
    },
    'chest_xray' : {
      'test': 'CXR'
    },
    'lab_errors' : {
      'test': 'Lab Errors'
    }
  };

  public oncRows = {
    'rbc': {
      'test': 'RBC',
      'toolTip': 'Red Blood Cell Count (10^6/µL)'
    },
    'hemoglobin': {
      'test': 'HGB',
      'toolTip': 'Hemoglobin (g/gl)'
    },
    'mcv': {
      'test': 'MCV',
      'toolTip': 'Mean corpuscular volume (FL)'
    },
    'mch': {
      'test': 'MCH',
      'toolTip': 'Mean cell hemoglobin (pg)'
    },
    'mchc': {
      'test': 'MCHC',
      'toolTip': 'Mean corpuscular hemoglobin concentration (g/gL)'
    },
    'rdw': {
      'test': 'RDW',
      'toolTip': 'Red cell distribution width (%)'
    },
    'plt': {
      'test': 'PLT',
      'toolTip': 'Platelets (10^3/ul)'
    },
    'wbc': {
      'test': 'SERUM WBC',
      'toolTip': 'Serum white blood cells count (10^3/µL)'
    },
    'anc': {
      'test': 'ANC',
      'toolTip': 'Absolute neutrophil count (mm3)'
    },

    'creatinine': {
      'test': 'CRETANINE',
      'toolTip': 'Creatinine (U/L)'
    },
    'na': {
      'test': 'SODIUM',
      'toolTip': 'Sodium (mmol/Lm3)'
    },
    'k': {
      'test': 'POTASSIUM',
      'toolTip': 'Potassium (mmol/L)'
    },
    'cl': {
      'test': 'CHLORIDE',
      'toolTip': 'Chloride (mmol/L)'
    },
    'uric_acid': {
      'test': 'URIC ACID',
      'toolTip': 'Uric Acid (mg/dL)'
    },
    'total_bili': {
      'test': 'Total Bili',
      'toolTip': 'Total Bilirubin (µumol/L)'
    },
    'direct_bili': {
      'test': 'Direct Bili',
      'toolTip': 'Direct Bilirubin (µumol/L)'
    },
    'ast': {
      'test': 'AST',
      'toolTip': 'Aspartate Aminotransferase (SGOT) (g/L)'
    },
    'alt': {
      'test': 'ALT',
      'toolTip': 'Alanine Aminotransferase (SGPT) (U/L)'
    },
    'ldh': {
      'test': 'LDH',
      'toolTip': 'Lactate Dehydrogenase (U/L)'
    },
    'alk_phos': {
      'test': 'ALP',
      'toolTip': 'Alkaline phosphatase (U/L)'
    },
    'ggt': {
      'test': 'GGT',
      'toolTip': 'Gamma-Glutamyl Transferase (IU/L)'
    },
    'total_protein': {
      'test': 'total_protein',
      'toolTip': 'Total Protein (g/L)'
    },
    'albumin': {
      'test': 'Albumin',
      'toolTip': 'Albumin (g/L)'
    },
    'total_psa': {
      'test': 'Total PSA',
      'toolTip': 'Total PSA (ng/mL)'
    },
    'cea': {
      'test': 'CEA',
      'toolTip': 'Carcinoembryonic antigen test (ng/mL)'
    },
    'ca_19_9': {
      'test': '(CA 19-9)',
      'toolTip': 'Carbohydrate Antigen 19-9 (U/mL)'
    },
    'hbf': {
      'test': 'HBF',
      'toolTip': 'Hemoglobin F%'
    },
    'hba': {
      'test': 'HBA',
      'toolTip': 'Hemoglobin A%'
    },
    'hbs': {
      'test': 'HbS',
      'toolTip': 'Hemoglobin S%'
    },
    'hba2': {
      'test': 'HBA2',
      'toolTip': 'Hemoglobin A2/C%'
    }
  };
  constructor(
    private labsResourceService: LabsResourceService,
    private patientService: PatientService,
    private _route: ActivatedRoute,
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
            this.getCurrentDepartment();
          }
        }
      );
    // this.gridOptions.columnDefs = this.oncologyCols;
    // this.gridOptions.rowData = this.labResults;

  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public getCurrentDepartment() {
      const path = this._route.snapshot.params['programClass'];
      this.currentDepartment = path;
      this.selectLabData(path);
  }
  public selectLabData(department) {

    switch (department) {
      case 'oncology':
         this.labRows = this.oncRows;
         break;
      case 'general':
      this.labRows = this.mergeRows();
         break;
      default:
         this.labRows = this.generalRows;

    }

  }

  public mergeRows() {

    const mergedCols = _.assign({}, this.generalRows, this.oncRows);
    return mergedCols;

  }

  public getHistoricalPatientLabResults(
    patientUuId, params: { startIndex: string, limit: string }) {
    this.patientUuId = this.patient.person.uuid;
    this.fetchingResults = true;
    this.labsResourceService.getHistoricalPatientLabResults(this.patientUuId,
      { startIndex: this.nextStartIndex.toString(), limit: '20' }).pipe(take(1)).subscribe((result) => {
        if (result) {
          this.labResults = this.formatDateField(result);
          this.createColumnDefs();
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

    const cols = [
      {
        headerName: 'Lab Test',
        width: 200,
        field: 'test',
        pinned: 'left',
        cellStyle: {
          'text-align': 'left'
        },
        tooltip: (params: any) => {
          if (!_.isEmpty(params.data.toolTip)) {
            return params.data.toolTip;
          } else {
             return '';
          }
        }
      }

    ];

    _.each(this.labResults, (result: any) => {
        const col = {
          headerName: result.testDatetime,
          width: 100,
          field: result.testDatetime,
          cellStyle: {
            'text-align': 'left'
          },
          pinned: '',
          tooltip: (params: any) => {
            return '';
          }
        };
        cols.push(col);
    });


    this.labCols = cols;
    this.createRowData(this.labResults);

  }

  public createRowData(labResults) {

    const rowData: any = this.labRows;
    _.each(labResults, (result: any) => {
      const dateTime = result.testDatetime;
      Object.keys(result).forEach((key, index) => {
        // key: the name of the object key
        // index: the ordinal position of the key within the object
        if (rowData.hasOwnProperty('' + key + '')) {
          if (key === 'hiv_viral_load') {
            rowData[key][dateTime] = this.zeroVlPipe.transform(result[key]);
          } else {
            rowData[key][dateTime] = result[key];
          }
        }
       });
     });

     this.processRowData(rowData);

  }

  public processRowData(rowData) {

    const labRows: any = [];

    Object.keys(rowData).forEach((key, index) => {
      const testResults = rowData[key];
      console.log();
      labRows.push(testResults);
    });
    this.labRowData = labRows;

  }

}
