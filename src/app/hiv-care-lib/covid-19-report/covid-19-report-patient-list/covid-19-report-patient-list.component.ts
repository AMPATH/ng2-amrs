import { Component, OnInit } from '@angular/core';
import { Covid19ResourceService } from './../../../etl-api/covid-19-resource-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GridOptions } from 'ag-grid';

interface CovidSummaryPatientListResponse {
  schemas: any;
  sqlQuery: string;
  size: number;
  results: { results: any };
  sectionDefs: any[];
  patientListCols: { patientListCols: any[] };
}

interface GridCol {
  headerName: string;
  width: number;
  field: string;
  hide?: boolean;
  children?: GridCol[];
  pinned?: boolean;
  valueGetter?: any;
}

@Component({
  selector: 'app-covid-19-report-patient-list',
  templateUrl: './covid-19-report-patient-list.component.html',
  styleUrls: ['./covid-19-report-patient-list.component.css']
})
export class Covid19ReportPatientListComponent implements OnInit {
  public params: any;
  public patientData: any;
  public isLoadingReport = true;
  public overrideColumns: Array<any> = [];
  public selectedIndicator: string;
  public hasLoadedAll = false;
  public hasError = false;
  public indicatorHeader: any;
  public patientListCols = [];
  public patientListColdefs: any[] = [];
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
  public hideCols: string[] = [
    'person_id',
    'location_uuid',
    'location_id',
    'person_uuid'
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    private covidService: Covid19ResourceService
  ) {}

  public ngOnInit(): void {
    this.route.queryParams.subscribe(
      (params) => {
        if (params && params.endingMonth) {
          this.params = params;
          this.selectedIndicator = params.indicator;
          this.indicatorHeader = params.indicatorHeader;
          this.getPatientList(params);
        }
      },
      (error) => {
        console.error('Error', error);
        this.hasError = true;
      }
    );
  }

  private getPatientList(params: any) {
    this.hasError = false;
    this.isLoadingReport = false;
    this.covidService
      .getCovid19VaccinationMonthlyReportPatientList(params)
      .subscribe(
        (data: CovidSummaryPatientListResponse) => {
          this.isLoadingReport = false;
          this.patientData = data.results.results;
          this.generateColDefs(data.patientListCols.patientListCols);
          this.hasLoadedAll = true;
        },
        (error: any) => {
          this.hasError = true;
          this.isLoadingReport = false;
        }
      );
  }

  public getRowNNumber(column: any): number {
    return parseInt(column.node.rowIndex, 10) + 1;
  }

  public generateColDefs(coldDefs: GridCol[]): void {
    const cols: GridCol[] = [];

    cols.push({
      headerName: 'No',
      field: 'no',
      width: 50,
      pinned: true,
      valueGetter: this.getRowNNumber
    });

    coldDefs.forEach((def: GridCol) => {
      cols.push(def);
    });

    this.patientListColdefs = cols;
  }

  public translateIndicator(indicator: string): string {
    return indicator
      .toLowerCase()
      .split('_')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  public hideCol(col: string): boolean {
    return this.hideCols.some((c: string) => {
      return c === col;
    });
  }
  public goBack(): void {
    this._location.back();
  }
  public onCellClick($event: any): void {
    const patientUuid = $event.data.patient_uuid;
    this.redirectTopatientInfo(patientUuid);
  }
  public redirectTopatientInfo(patientUuid: string): void {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate([
      '/patient-dashboard/patient/' +
        patientUuid +
        '/general/general/landing-page'
    ]);
  }
  public exportPatientListToCsv(): void {
    this.gridOptions.api.exportDataAsCsv();
  }
}
