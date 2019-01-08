import {
  Component, OnInit, Output, OnDestroy, ViewChild,
  Input, SimpleChange, EventEmitter, OnChanges
} from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { BehaviorSubject } from 'rxjs';
import { AgGridNg2 } from 'ag-grid-angular';

@Component({
  selector: 'generic-list',
  templateUrl: './generic-list.component.html'
})
export class GenericListComponent implements OnInit, OnDestroy, OnChanges {
  /*  tslint:disable:no-output-on-prefix */
  public gridOptions: GridOptions;
  @Input() public columns: any;
  @Input() public data: any = [];
  @Output() public onSelectedRow = new EventEmitter();
  @Output() public onSelectedTab = new EventEmitter();
  @Input() public newList: any;
  public selected: any;
  public refresh = false;
  @ViewChild('agGrid')
  public agGrid: AgGridNg2;

  @Input()
  set options(value) {
    this._data.next(value);
  }

  get options() {
    return this._data.getValue();
  }

  @Input()
  set dataSource(value) {
    this._dataSource.next(value);
  }
  get dataSource() {
    return null;
    // return this._dataSource.getValue();
  }

  private _data = new BehaviorSubject<any>([]);
  private _dataSource = new BehaviorSubject<any>({});
  constructor() {

  }

  public ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    for (const propName in changes) {
      if (propName === 'options') {
        const changedProp = changes[propName];
        if (!changedProp.isFirstChange()) {
          // this.dataSource = changedProp.currentValue;
          this.refresh = true;
          this.generateGrid();
        }
      }

    }

  }

  public ngOnInit() {
      this.generateGrid();
  }

  public generateGrid() {
    this.gridOptions = {} as GridOptions;
    this.gridOptions.columnDefs = this.columns;
    this.gridOptions.enableColResize = true;
    this.gridOptions.enableSorting = true;
    this.gridOptions.enableFilter = true;
    this.gridOptions.showToolPanel = false;
    // ensure that even after sorting the rows maintain order
    this.gridOptions.onSortChanged = () => {
        this.gridOptions.api.forEachNode((node) => {
           node.setDataValue('#', node.rowIndex + 1);
        });

        this.gridOptions.api.refreshCells();

    };

    // this.gridOptions.suppressCellSelection = true;
    // this.gridOptions.suppressMenuColumnPanel = true; // ag-enterprise only
    // this.gridOptions.suppressMenuMainPanel = true; // ag-enterprise only
    this.gridOptions.rowSelection = 'single';
    if (this.dataSource) {
      this.gridOptions.rowModelType = 'pagination';
      this.gridOptions.paginationPageSize = this.dataSource.paginationPageSize;
    }
    this.gridOptions.onRowSelected = (event) => {
      this.rowSelectedFunc(event);
    };
    this.gridOptions.onGridReady = (event) => {
      if (window.innerWidth > 768) {
       // this.gridOptions.api.sizeColumnsToFit();
       // do not resize if columns are more than 10
       if (this.columns.length <= 10) {
         setTimeout( () => this.gridOptions.api.sizeColumnsToFit(), 300, true);
        }
      }
      // setDatasource() is a grid ready function
      if (this.dataSource) {
         this.gridOptions.api.setDatasource(this.dataSource);
      }
      this.gridOptions.getRowStyle = (params) => {
        return {
          'font-size': '14px', 'cursor': 'pointer'
        };

      };

      // this.gridOptions.getRowHeight = function (params) {
      //   let dataLength = 0;
      //   if (params.data) {
      //     if (params.data.identifiers) {
      //       dataLength = params.data.identifiers.length;
      //     }

      //     if (params.data.person_name) {
      //       if (dataLength > 0) {
      //         if (dataLength > 0 && params.data.person_name.length > dataLength) {
      //           dataLength = params.data.person_name.length;
      //         }
      //       } else {
      //         dataLength = params.data.person_name.length;
      //       }
      //     }

      //     if (params.data.rtc_date) {
      //       if (dataLength > 0) {
      //         if (dataLength > 0 && params.data.rtc_date.length > dataLength) {
      //           dataLength = params.data.rtc_date.length;
      //         }
      //       } else {
      //         dataLength = params.data.rtc_date.length;
      //       }
      //     }

      //     if (params.data.last_appointment) {
      //       if (dataLength > 0) {
      //         if (dataLength > 0 && params.data.last_appointment.length > dataLength) {
      //           dataLength = params.data.last_appointment.length;
      //         }
      //       } else {
      //         dataLength = params.data.last_appointment.length;
      //       }
      //     }

      //     if (params.data.filed_id) {
      //       if (dataLength > 0) {
      //         if (dataLength > 0 && params.data.filed_id.length > dataLength) {
      //           dataLength = params.data.filed_id.length;
      //         }
      //       } else {
      //         dataLength = params.data.filed_id.length;
      //       }

      //     }
      //   }

      //   if (dataLength > 0) {
      //     return 20 * (Math.floor(dataLength / 15) + 1);

      //   } else {
      //     return 20;
      //   }

      // };
    };
  }

public exportAllData() {
   this.gridOptions.api.exportDataAsCsv();
}

  public ngOnDestroy() {
    this.data = [];
  }

  get rowData() {
    return this.data || [];
  }

  public rowSelectedFunc(event) {
    this.onSelectedRow.emit(event);
  }

}
