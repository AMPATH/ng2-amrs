import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AgGridNg2 } from 'ag-grid-angular';
import * as rison from 'rison-node';

@Component({
  selector: 'ipt-tabular-report',
  templateUrl: './ipt-report-tabular.component.html',
  styleUrls: ['./ipt-report-tabular.component.css'],
})
export class IptTabularReportComponent implements OnInit {
  public gridOptions: any = { columnDefs: [] };
  private _rowDefs: Array<any> = [];
  private _sectionDefs: Array<any> = [];
  private headers: Array<any> = [];
  private sectionIndicatorsValues: Array<any> = [];

  @ViewChild('agGrid')
  public agGrid: AgGridNg2;
  @Input() displayTabluarFilters: boolean;
  public get iptReportSummaryData(): Array<any> {
    return this._rowDefs;
  }
  @Input('iptReportSummaryData')
  public set iptReportSummaryData(v: Array<any>) {
    this._rowDefs = v;
  }
  @Input()
  public pinnedBottomRowData: any = [];
  @Input('sectionDefs')
  public set sectionDefs(v: Array<any>) {
    this._sectionDefs = v;
    this.setColumns(v);
  }
  public get sectionDefs(): Array<any> {
    return this._sectionDefs;
  }

  @Output()
  public indicatorSelected = new EventEmitter();

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public location: Location
  ) {}

  public ngOnInit() {
    this.setCellSelection();
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
        value: i,
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
          width: 360,
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
    this.gridOptions.onCellClicked = (e) => {
      if (e.rowPinned !== 'bottom') {
        selectedIndicator = {
          headerName: e.colDef.headerName,
          field: e.colDef.field,
          location: e.data.location_uuid,
        };
        this.indicatorSelected.emit(selectedIndicator);
      } else {
        const path = this.router.parseUrl(this.location.path());
        if (path.queryParams['state']) {
          const state = rison.decode(path.queryParams['state']);
          selectedIndicator = {
            headerName: e.colDef.headerName,
            field: e.colDef.field,
            location: state.locationUuids,
          };
          this.indicatorSelected.emit(selectedIndicator);
        } else {
          selectedIndicator = {
            headerName: e.colDef.headerName,
            field: e.colDef.field,
            location: path.queryParams.locationUuids,
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
