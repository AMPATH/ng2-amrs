
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AgGridNg2 } from 'ag-grid-angular';
@Component({
  selector: 'hiv-summary-tabular',
  templateUrl: 'hiv-summary-tabular.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class HivSummaryTabularComponent implements OnInit {
  public gridOptions: any = {
    columnDefs: []
  };
  @Input('rowData')
  public data: Array<any> = [];

  @ViewChild('agGrid')
  public agGrid: AgGridNg2;


  private _sectionDefs: Array<any>;
  public get sectionDefs(): Array<any> {
    return this._sectionDefs;
  }
  @Input('sectionDefs')
  public set sectionDefs(v: Array<any>) {
    this._sectionDefs = v;
    this.setColumns(v);

  }

  constructor() { }

  ngOnInit() {}
  setColumns(sectionsData: Array<any>) {
    let defs = [];
    defs.push({
      headerName: 'Location',
      field: 'location',
      pinned: 'left'
    });
    if (this.data[0]) {
      _.each(Object.keys(this.data[0]), (selected) => {
        _.each(sectionsData, (data) => {
          if ( selected === data.name) {
            defs.push({
              headerName: this.titleCase(data.label),
              field: data.name
            });
          }
        });
      });
    }
    this.gridOptions.columnDefs = defs;
    if (this.agGrid && this.agGrid.api) {
      this.agGrid.api.setColumnDefs(defs);
    }
  }
  titleCase(str) {
    return str.toLowerCase().split(' ').map((word) => {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

}
