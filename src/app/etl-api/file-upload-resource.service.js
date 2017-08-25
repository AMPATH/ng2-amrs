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
var Observable_1 = require("rxjs/Observable");
var FileUploadResourceService = (function () {
    function FileUploadResourceService(http, appSettingsService) {
        this.http = http;
        this.appSettingsService = appSettingsService;
    }
    FileUploadResourceService.prototype.getUrl = function () {
        return this.appSettingsService.getEtlRestbaseurl().trim() + 'fileupload';
    };
    FileUploadResourceService.prototype.upload = function (formData) {
        var url = this.getUrl();
        return this.http.post(url, formData)
            .map(function (x) { return x.json(); });
    };
    FileUploadResourceService.prototype.getFile = function (url) {
        var _this = this;
        var fullUrl = this.appSettingsService.getEtlRestbaseurl().trim() + 'files/' + url;
        return new Observable_1.Observable(function (observer) {
            var objectUrl = null;
            var headers = new http_1.Headers({ 'Accept': 'image/png,image/jpeg,image/gif' });
            _this.http
                .get(fullUrl, {
                headers: headers,
                responseType: http_1.ResponseContentType.Blob
            })
                .subscribe(function (m) {
                objectUrl = URL.createObjectURL(m.blob());
                observer.next(objectUrl);
            });
            return function () {
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                    objectUrl = null;
                }
            };
        });
    };
    FileUploadResourceService = __decorate([
        core_1.Injectable()
    ], FileUploadResourceService);
    return FileUploadResourceService;
}());
exports.FileUploadResourceService = FileUploadResourceService;
