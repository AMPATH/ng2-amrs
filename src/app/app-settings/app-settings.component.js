"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var app_settings_service_1 = require("./app-settings.service");
var AppSettingsComponent = (function () {
    function AppSettingsComponent(router, appSettingsService, localStorageService, authenticationService) {
        this.router = router;
        this.appSettingsService = appSettingsService;
        this.localStorageService = localStorageService;
        this.authenticationService = authenticationService;
        this.serverTemplates = this.getServerTemplates();
    }
    AppSettingsComponent.prototype.getServerTemplates = function () {
        return this.appSettingsService.getServerTemplates();
    };
    AppSettingsComponent.prototype.ngOnInit = function () {
        var templates = this.appSettingsService.getServerTemplates();
        if (!window.location.host.match(new RegExp('localhost'))) {
            this.changeServerSettings(templates[0]);
        }
    };
    Object.defineProperty(AppSettingsComponent.prototype, "openmrsServer", {
        get: function () {
            return this.appSettingsService.getOpenmrsServer();
        },
        set: function (value) {
            this.appSettingsService.setOpenmrsServer(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppSettingsComponent.prototype, "etlServer", {
        get: function () {
            return this.appSettingsService.getEtlServer();
        },
        set: function (value) {
            this.appSettingsService.setEtlServer(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppSettingsComponent.prototype, "openmrsServerUrls", {
        get: function () {
            return this.appSettingsService.openmrsServerUrls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppSettingsComponent.prototype, "etlServerUrls", {
        get: function () {
            return this.appSettingsService.etlServerUrls;
        },
        enumerable: true,
        configurable: true
    });
    AppSettingsComponent.prototype.showNewUrlForm = function (event) {
        this.newUrl = null;
        if (event && event.srcElement) {
            var srcId = event.srcElement.id;
            if (srcId === 'etlUrlBtn') {
                this.urlPlaceholder = 'http://localhost:8002/etl';
                this.urlType = 'etl';
            }
            else {
                // openmrsUrlBtn
                this.urlPlaceholder = 'http://localhost:8080/openmrs';
                this.urlType = 'openmrs';
            }
        }
        else {
            this.urlPlaceholder = '';
        }
        this.urlModal.show();
    };
    AppSettingsComponent.prototype.saveNewURL = function (url, urlType) {
        if (urlType === void 0) { urlType = 'openmrs'; }
        this.appSettingsService.addAndSetUrl(url, urlType);
        this.urlModal.hide();
    };
    AppSettingsComponent.prototype.changeServerSettings = function (row) {
        // change openmrs url
        this.openmrsServer = row.amrsUrl;
        // change etl-server url
        this.etlServer = row.etlUrl;
    };
    AppSettingsComponent.prototype.onDoneClick = function () {
        this.localStorageService.setItem('appSettingsAction', 'newSettings');
        // clear session cache
        // return back to login page
        this.authenticationService.clearSessionCache();
        this.router.navigate(['/login']);
    };
    __decorate([
        core_1.ViewChild('addUrlModal')
    ], AppSettingsComponent.prototype, "urlModal", void 0);
    AppSettingsComponent = __decorate([
        core_1.Component({
            selector: 'app-settings',
            templateUrl: './app-settings.component.html',
            styleUrls: ['./app-settings.component.css'],
            providers: [app_settings_service_1.AppSettingsService]
        })
    ], AppSettingsComponent);
    return AppSettingsComponent;
}());
exports.AppSettingsComponent = AppSettingsComponent;
