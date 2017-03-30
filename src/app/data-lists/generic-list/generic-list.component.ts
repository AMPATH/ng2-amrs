import {
  Component, OnInit, Output,
  Input, SimpleChange, EventEmitter
} from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { BehaviorSubject } from 'rxjs/Rx';

@Component({
  selector: 'generic-list',
  templateUrl: './generic-list.component.html'
})
export class GenericListComponent implements OnInit {

  public gridOptions: GridOptions;
  @Input() columns: any;
  @Input() data: any = [];
  @Output() onSelectedRow = new EventEmitter();
  @Output() onSelectedTab = new EventEmitter();
  @Input() newList: any;
  selected: any;
  @Input()
  set options(value) {
    this._data.next(value);
  }
  get options() {
    return this._data.getValue();
  }
  private _data = new BehaviorSubject<any>([]);
  constructor(
  ) {

  }

  ngOnInit() {

    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = this.columns;
    this.gridOptions.enableColResize = true;
    this.gridOptions.enableFilter = true;
    this.gridOptions.suppressMenuColumnPanel = true; // ag-enterprise only
    this.gridOptions.suppressMenuMainPanel = true; // ag-enterprise only

    // Adding row selection
    this.gridOptions.rowSelection = 'single';
    this.gridOptions.onRowSelected = (event) => {
      this.rowSelectedFunc(event);
    };

    let tthis: any = this;
    this.gridOptions.onGridReady = (event) => {
      this.gridOptions.api.sizeColumnsToFit();
      this.gridOptions.getRowStyle = function (params) {
        return {
          'font-size': '14px', 'cursor': 'pointer'
        };

      };

      this.gridOptions.getRowHeight = function (params) {
        return 20 * (Math.floor(params.data.person_name.length / 15) + 1);
      };

    };

    console.warn(this.columns);
    console.warn(this.data);

  }

  get rowData() {
    return this.data || [];
  }

  rowSelectedFunc(event) {
    this.onSelectedRow.emit(event);
  }


}
