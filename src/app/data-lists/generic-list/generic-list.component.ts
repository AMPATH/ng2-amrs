import {
  Component, OnInit, Output, OnDestroy,
  Input, SimpleChange, EventEmitter
} from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { BehaviorSubject } from 'rxjs/Rx';

@Component({
  selector: 'generic-list',
  templateUrl: './generic-list.component.html'
})
export class GenericListComponent implements OnInit, OnDestroy {

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
    // this.gridOptions.suppressCellSelection = true;
    this.gridOptions.suppressMenuColumnPanel = true; // ag-enterprise only
    this.gridOptions.suppressMenuMainPanel = true; // ag-enterprise only
    this.gridOptions.rowSelection = 'single';
    this.gridOptions.onRowSelected = (event) => {
      this.rowSelectedFunc(event);
    };

    let tthis: any = this;
    this.gridOptions.onGridReady = (event) => {
      if (window.innerWidth > 768) {
        this.gridOptions.api.sizeColumnsToFit();

      }

      this.gridOptions.getRowStyle = function (params) {
        return {
          'font-size': '14px', 'cursor': 'pointer'
        };

      };

      this.gridOptions.getRowHeight = function (params) {
        let dataLength = 0;
        if (params.data) {
          if (params.data.identifiers) {
            dataLength = params.data.identifiers.length;
          }

          if (params.data.person_name) {
            if (dataLength > 0) {
              if (dataLength > 0 && params.data.person_name.length > dataLength) {
                dataLength = params.data.person_name.length;
              }
            } else {
              dataLength = params.data.person_name.length;
            }
          }

          if (params.data.rtc_date) {
            if (dataLength > 0) {
              if (dataLength > 0 && params.data.rtc_date.length > dataLength) {
                dataLength = params.data.rtc_date.length;
              }
            } else {
              dataLength = params.data.rtc_date.length;
            }
          }

          if (params.data.last_appointment) {
            if (dataLength > 0) {
              if (dataLength > 0 && params.data.last_appointment.length > dataLength) {
                dataLength = params.data.last_appointment.length;
              }
            } else {
              dataLength = params.data.last_appointment.length;
            }
          }

          if (params.data.filed_id) {
            if (dataLength > 0) {
              if (dataLength > 0 && params.data.filed_id.length > dataLength) {
                dataLength = params.data.filed_id.length;
              }
            } else {
              dataLength = params.data.filed_id.length;
            }

          }
        }

        if (dataLength > 0) {
          return 20 * (Math.floor(dataLength / 15) + 1);
        } else {
          return 20;
        }

      };


    };
  }

  ngOnDestroy() {
    this.data = [];
  }


  get rowData() {
    return this.data || [];
  }

  rowSelectedFunc(event) {
    this.onSelectedRow.emit(event);
  }


}
