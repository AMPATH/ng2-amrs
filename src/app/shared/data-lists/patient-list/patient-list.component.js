"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var patient_list_columns_data_1 = require("./patient-list-columns.data");
var Rx_1 = require("rxjs/Rx");
var _ = require('lodash');
var PatientListComponent = (function () {
    function PatientListComponent(router) {
        this.router = router;
        this.data = [];
        this._data = new Rx_1.BehaviorSubject([]);
        this._dataSource = new Rx_1.BehaviorSubject({});
    }
    Object.defineProperty(PatientListComponent.prototype, "options", {
        get: function () {
            return this._data.getValue();
        },
        set: function (value) {
            this._data.next(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PatientListComponent.prototype, "dataSource", {
        get: function () {
            return this._dataSource.getValue();
        },
        set: function (value) {
            this._dataSource.next(value);
        },
        enumerable: true,
        configurable: true
    });
    PatientListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._data
            .subscribe(function (x) {
            _this.loadedTab = x;
        });
    };
    Object.defineProperty(PatientListComponent.prototype, "columns", {
        get: function () {
            var columns = patient_list_columns_data_1.PatientListColumns.columns();
            if (this.extraColumns && typeof Array.isArray(this.extraColumns)) {
                columns = _.concat(columns, this.extraColumns);
            }
            if (this.overrideColumns && _.isArray(this.overrideColumns)) {
                _.each(this.overrideColumns, function (col) {
                    _.each(columns, function (_col) {
                        if (col['field'] === _col['field']) {
                            _.extend(_col, col);
                        }
                    });
                });
            }
            return columns;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PatientListComponent.prototype, "rowData", {
        get: function () {
            var d = this.data || [];
            var count = 1;
            // console.log('Data', this.data);
            _.forEach(d, function (row) {
                if (!row['person_name']) {
                    row['person_name'] = row['given_name'] + ' ' + row['family_name']
                        + ' ' + row['middle_name'];
                }
                count++;
            });
            // console.log('Filtered Data', this.data);
            return this.data || [];
        },
        enumerable: true,
        configurable: true
    });
    PatientListComponent.prototype.loadSelectedPatient = function (event) {
        var patientUuid = '';
        if (event) {
            patientUuid = event.node.data.uuid;
        }
        if (patientUuid === undefined || patientUuid === null) {
            return;
        }
        this.router.navigate(['/patient-dashboard/patient/' + patientUuid + '/general/landing-page']);
    };
    __decorate([
        core_1.Input()
    ], PatientListComponent.prototype, "extraColumns", void 0);
    __decorate([
        core_1.Input()
    ], PatientListComponent.prototype, "overrideColumns", void 0);
    __decorate([
        core_1.Input()
    ], PatientListComponent.prototype, "data", void 0);
    __decorate([
        core_1.Input()
    ], PatientListComponent.prototype, "newList", void 0);
    __decorate([
        core_1.Input()
    ], PatientListComponent.prototype, "options", null);
    __decorate([
        core_1.Input()
    ], PatientListComponent.prototype, "dataSource", null);
    PatientListComponent = __decorate([
        core_1.Component({
            selector: 'patient-list',
            templateUrl: './patient-list.component.html'
        })
    ], PatientListComponent);
    return PatientListComponent;
}());
exports.PatientListComponent = PatientListComponent;
