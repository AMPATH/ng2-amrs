"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var material_1 = require("@angular/material");
var cdm_program_routes_1 = require("./cdm-program.routes");
var date_time_picker_1 = require("ng2-openmrs-formentry/dist/components/date-time-picker");
var etl_api_module_1 = require("../../etl-api/etl-api.module");
var data_lists_module_1 = require("../../shared/data-lists/data-lists.module");
var CdmProgramModule = (function () {
    function CdmProgramModule() {
    }
    CdmProgramModule = __decorate([
        core_1.NgModule({
            imports: [
                cdm_program_routes_1.cdmProgramRouting,
                date_time_picker_1.DateTimePickerModule,
                etl_api_module_1.EtlApi,
                data_lists_module_1.DataListsModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                material_1.MdTabsModule,
                material_1.MdProgressSpinnerModule,
                material_1.MdProgressBarModule,
                material_1.MaterialModule
            ],
            exports: [],
            declarations: [],
            providers: [],
        })
    ], CdmProgramModule);
    return CdmProgramModule;
}());
exports.CdmProgramModule = CdmProgramModule;
