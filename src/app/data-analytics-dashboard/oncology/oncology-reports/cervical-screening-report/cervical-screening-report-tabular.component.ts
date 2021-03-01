import { HttpClient } from '@angular/common/http';
import { Component, Input, ViewChild } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
@Component({
  selector: 'cervical-screening-report-tabular',
  templateUrl: './cervical-screening-report-tabular.component.html',
  styleUrls: ['./cervical-screening-report-tabular.component.css']
})
export class CervicalScreeningReportTabularComponent {
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  
  @Input()
  public params: any;
  @Input() public indicator: any;

  @Input('monthlySummary')
  public get monthlySummary(): Array<any> {
    return this._rowDefs;
  }
  public set monthlySummary(v: Array<any>) {
    this._rowDefs = v;
    this.setData(v);
  }

  @Input('sectionDefinitions')
  public get sectionDefinitions(): Array<any> {
    return this._sectionDefinitions;
  }
  public set sectionDefinitions(v: Array<any>) {
    this._sectionDefinitions = v;
    this.setColumns(v);
  }

  public sectionIndicatorsValues: Array<any>;
  public gridOptions: any = {};
  public headers = [];
  private gridApi;
  private gridColumnApi;
  private columnDefs;
  private defaultColDef;
  private _rowDefs: Array<any>;
  private _sectionDefinitions: Array<any>;

  constructor(private http: HttpClient) {
    // this.columnDefs = [
    // ];
    // this.defaultColDef = {
    //   sortable: true,
    //   resizable: true,
    //   filter: true
    // };
  }

  setData(sectionsData: any) {
    this.sectionIndicatorsValues = sectionsData;
    console.log('setData called: ', this.sectionIndicatorsValues);
  }

  setColumns(sectionsData: Array<any>) {
    console.log('setColumns called with: ', sectionsData);
    this.headers = [];
    const defs = [];
    for (let i = 0; i < sectionsData.length; i++) {
      const section = sectionsData[i];
      const created: any = {};
      created.headerName = section.sectionTitle;
      const header = {
        label: section.sectionTitle,
        value: i
      };
      this.headers.push(header);
      created.children = [];
      for (let j = 0; j < section.indicators.length; j++) {
        const sectionIndicatorValues = [];
        const indicatorValue = '-';
        sectionIndicatorValues.push([indicatorValue]);
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator,
          // description: section.indicators[j].description,
          location: this.sectionIndicatorsValues['location_uuid']
          // width: 360
        };
        created.children.push(child);
        console.log('children: ', created.children);
      }
      defs.push(created);
    }
    console.log('defs: ', defs);
    this.gridOptions.columnDefs = defs;
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
  }

  // onGridReady(params) {
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;

  //   this.http
  //     .get('https://www.ag-grid.com/example-assets/olympic-winners.json')
  //     .subscribe((data) => {
  //       this.rowData = data;
  //     });
  // }
}
