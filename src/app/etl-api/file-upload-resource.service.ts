
import {take} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable ,  Subscriber } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class FileUploadResourceService {
    constructor(private http: HttpClient, private appSettingsService: AppSettingsService) { }
    public getUrl(): string {

        return this.appSettingsService.getEtlRestbaseurl().trim() + 'fileupload';
    }
    public upload(formData) {
        const url = this.getUrl();
        return this.http.post(url, formData);
    }
    public getFile(url: string): Observable<any> {
        let fullUrl = this.appSettingsService.getEtlRestbaseurl().trim() + 'files/' + url;
        return new Observable((observer: Subscriber<any>) => {
            let objectUrl: string = null;
            let headers = new HttpHeaders({ 'Accept': 'image/png,image/jpeg,image/gif' });
            this.http
                .get(fullUrl, {
                    headers,
                    responseType: 'blob'
                }).pipe(
                take(1)).subscribe((m) => {
                    objectUrl = URL.createObjectURL(m);
                    observer.next(objectUrl);
                });

            return () => {
                if (objectUrl) {
                    URL.revokeObjectURL(objectUrl);
                    objectUrl = null;
                }
            };
        });
    }

}
