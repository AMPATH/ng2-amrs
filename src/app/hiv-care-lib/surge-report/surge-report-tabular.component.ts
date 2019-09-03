import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { AgGridNg2 } from 'ag-grid-angular';
import * as _ from 'lodash';
import { isUndefined, isNullOrUndefined } from 'util';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import * as rison from 'rison-node';
@Component({
  selector: 'surge-report-tabular',
  templateUrl: './surge-report-tabular.component.html',
  styleUrls: ['./surge-report-tabular.component.css']
})
export class SurgeReportTabularComponent implements OnInit {
  @Input() displayTabluarFilters: Boolean;
  public headers = [];
  public selectedIndicatorsList = [];
  public gridOptions: any = {
    columnDefs: []
  };
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  public get surgeReportSummaryData(): Array<any> {
    return this._rowDefs;
  }
  @Input('surgeReportSummaryData')
  public set surgeReportSummaryData(v: Array<any>) {
    this._rowDefs = v;
    this.setData(v);
  }
  public locationNumber = 0;
  public selectedResult: string;
  public sectionIndicatorsValues: Array<any>;
  private _sectionDefs: Array<any>;
  public get sectionDefs(): Array<any> {
    return this._sectionDefs;
  }
  @Input()
  public pinnedBottomRowData: any = [];
  @Input('sectionDefs')
  public set sectionDefs(v: Array<any>) {
    this._sectionDefs = v;
    this.setColumns(v);
  }
  @Output()
  public indicatorSelected = new EventEmitter();
  private _rowDefs: Array<any>;
  ngOnInit() {
    this.setCellSelection();
  }
  public constructor(
    public router: Router,
    public route: ActivatedRoute,
    public location: Location) { }
  public setData(sectionsData: any) {
    this.sectionIndicatorsValues = sectionsData;
  }
  public setColumns(sectionsData: Array<any>) {
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
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < section.indicators.length; j++) {
        const sectionIndicatorValues = [];
        const indicatorValue = '-';
        sectionIndicatorValues.push([indicatorValue]);
        const child: any = {
          headerName: section.indicators[j].label,
          field: section.indicators[j].indicator,
          description: section.indicators[j].description,
          location: this.sectionIndicatorsValues['location_uuid'],
          width: 360
        };
        created.children.push(child);
      }
      defs.push(created);
    }
    this.gridOptions.columnDefs = defs;
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
  }
  private setCellSelection(col?) {
    this.gridOptions.rowSelection = 'single';
    let selectedIndicator: any;
    this.gridOptions.onCellClicked = e => {
      if (e.rowPinned !== 'bottom') {
        selectedIndicator = {
          headerName: e.colDef.headerName,
          field: e.colDef.field,
          location: e.data.location_uuid
        };
        this.indicatorSelected.emit(selectedIndicator);
      } else {
        const path = this.router.parseUrl(this.location.path());
        if (path.queryParams['state']) {
          const state = rison.decode(path.queryParams['state']);
          selectedIndicator = {
            headerName: e.colDef.headerName,
            field: e.colDef.field,
            location: state.locationUuids
          };
          this.indicatorSelected.emit(selectedIndicator);
        } else {
          selectedIndicator = {
            headerName: e.colDef.headerName,
            field: e.colDef.field,
            location: path.queryParams.locationUuids
          };
          this.indicatorSelected.emit(selectedIndicator);
        }
      }
    };
  }

  public exportAllData() {
    this.agGrid.api.exportDataAsCsv();
  }
}
