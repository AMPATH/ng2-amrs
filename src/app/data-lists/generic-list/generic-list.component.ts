import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridOptions } from 'ag-grid/main';


@Component({
  selector: 'generic-list',
  templateUrl: './generic-list.component.html'
})
export class GenericListComponent implements OnInit {

  public gridOptions: GridOptions;
  @Input() columns: any;
  @Input() data: any = [];

  constructor() {
  }

  ngOnInit() {

    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.columns;
    this.gridOptions.enableColResize = true;
    this.gridOptions.enableFilter = true;
    this.gridOptions.suppressMenuColumnPanel = true; // ag-enterprise only
    this.gridOptions.suppressMenuMainPanel = true; // ag-enterprise only

    console.warn(this.columns);
    console.warn(this.data);
  }

  get rowData() {
    return this.data || [];
  }
}
