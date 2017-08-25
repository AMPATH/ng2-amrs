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
var app_settings_component_1 = require("./app-settings.component");
var router_1 = require("@angular/router");
var app_settings_routes_1 = require("./app-settings.routes");
var utils_module_1 = require("../utils/utils.module");
var modal_1 = require("ngx-bootstrap/modal");
var app_settings_service_1 = require("./app-settings.service");
var AppSettingsModule = (function () {
    function AppSettingsModule() {
    }
    AppSettingsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                modal_1.ModalModule,
                utils_module_1.UtilsModule,
                router_1.RouterModule.forChild(app_settings_routes_1.APP_SETTINGS_ROUTES)
            ],
            declarations: [app_settings_component_1.AppSettingsComponent],
            providers: [
                app_settings_service_1.AppSettingsService
            ],
            exports: [
                router_1.RouterModule
            ],
            schemas: [
                core_1.CUSTOM_ELEMENTS_SCHEMA
            ]
        })
    ], AppSettingsModule);
    return AppSettingsModule;
}());
exports.AppSettingsModule = AppSettingsModule;
