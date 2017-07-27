"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var ClinicalNotesResourceService = (function () {
    function ClinicalNotesResourceService(http, appSettingsService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
    }
    ClinicalNotesResourceService.prototype.getClinicalNotes = function (patientUuid, startIndex, limit) {
        var api = this.appSettingsService.getEtlServer() +
            '/patient/' + patientUuid + '/clinical-notes';
        if (!startIndex) {
            startIndex = 0;
        }
        if (!limit) {
            limit = 10;
        }
        var params = new http_1.URLSearchParams();
        params.set('startIndex', startIndex);
        params.set('limit', limit);
        return this.http.get(api, { search: params }).map(function (data) { return data.json(); });
    };
    ClinicalNotesResourceService = __decorate([
        core_1.Injectable()
    ], ClinicalNotesResourceService);
    return ClinicalNotesResourceService;
}());
exports.ClinicalNotesResourceService = ClinicalNotesResourceService;
