"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var GenericListComponent = (function () {
    function GenericListComponent() {
        this.data = [];
        this.onSelectedRow = new core_1.EventEmitter();
        this.onSelectedTab = new core_1.EventEmitter();
        this.refresh = false;
        this._data = new Rx_1.BehaviorSubject([]);
        this._dataSource = new Rx_1.BehaviorSubject({});
    }
    Object.defineProperty(GenericListComponent.prototype, "options", {
        get: function () {
            return this._data.getValue();
        },
        set: function (value) {
            this._data.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GenericListComponent.prototype, "dataSource", {
        get: function () {
            return null;
            // return this._dataSource.getValue();
        },
        set: function (value) {
            this._dataSource.next(value);
        },
        enumerable: true,
        configurable: true
    });
    GenericListComponent.prototype.ngOnChanges = function (changes) {
        for (var propName in changes) {
            if (propName === 'options') {
                var changedProp = changes[propName];
                if (!changedProp.isFirstChange()) {
                    // this.dataSource = changedProp.currentValue;
                    console.log('re-rendering the grid from generic list');
                    this.refresh = true;
                    this.generateGrid();
                }
            }
        }
    };
    GenericListComponent.prototype.ngOnInit = function () {
        this.generateGrid();
    };
    GenericListComponent.prototype.generateGrid = function () {
        var _this = this;
        this.gridOptions = {};
        this.gridOptions.columnDefs = this.columns;
        this.gridOptions.enableColResize = true;
        this.gridOptions.enableSorting = true;
        this.gridOptions.enableFilter = true;
        this.gridOptions.showToolPanel = false;
        // ensure that even after sorting the rows maintain order
        this.gridOptions.onSortChanged = function () {
            _this.gridOptions.api.forEachNode(function (node) {
                node.setDataValue('#', node.rowIndex + 1);
            });
            _this.gridOptions.api.refreshCells();
        };
        // this.gridOptions.suppressCellSelection = true;
        // this.gridOptions.suppressMenuColumnPanel = true; // ag-enterprise only
        // this.gridOptions.suppressMenuMainPanel = true; // ag-enterprise only
        this.gridOptions.rowSelection = 'single';
        if (this.dataSource) {
            this.gridOptions.rowModelType = 'pagination';
            this.gridOptions.paginationPageSize = this.dataSource.paginationPageSize;
        }
        this.gridOptions.onRowSelected = function (event) {
            _this.rowSelectedFunc(event);
        };
        var tthis = this;
        this.gridOptions.onGridReady = function (event) {
            if (window.innerWidth > 768) {
                // this.gridOptions.api.sizeColumnsToFit();
                setTimeout(function () { return _this.gridOptions.api.sizeColumnsToFit(); }, 500, true);
            }
            // setDatasource() is a grid ready function
            if (_this.dataSource) {
                _this.gridOptions.api.setDatasource(_this.dataSource);
            }
            _this.gridOptions.getRowStyle = function (params) {
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
    };
    GenericListComponent.prototype.ngOnDestroy = function () {
        this.data = [];
    };
    Object.defineProperty(GenericListComponent.prototype, "rowData", {
        get: function () {
            return this.data || [];
        },
        enumerable: true,
        configurable: true
    });
    GenericListComponent.prototype.rowSelectedFunc = function (event) {
        this.onSelectedRow.emit(event);
    };
    __decorate([
        core_1.Input()
    ], GenericListComponent.prototype, "columns", void 0);
    __decorate([
        core_1.Input()
    ], GenericListComponent.prototype, "data", void 0);
    __decorate([
        core_1.Output()
    ], GenericListComponent.prototype, "onSelectedRow", void 0);
    __decorate([
        core_1.Output()
    ], GenericListComponent.prototype, "onSelectedTab", void 0);
    __decorate([
        core_1.Input()
    ], GenericListComponent.prototype, "newList", void 0);
    __decorate([
        core_1.ViewChild('agGrid')
    ], GenericListComponent.prototype, "agGrid", void 0);
    __decorate([
        core_1.Input()
    ], GenericListComponent.prototype, "options", null);
    __decorate([
        core_1.Input()
    ], GenericListComponent.prototype, "dataSource", null);
    GenericListComponent = __decorate([
        core_1.Component({
            selector: 'generic-list',
            templateUrl: './generic-list.component.html'
        })
    ], GenericListComponent);
    return GenericListComponent;
}());
exports.GenericListComponent = GenericListComponent;
