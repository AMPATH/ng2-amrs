import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { AppSettingsService } from '../app-settings';

@Injectable()
export class FileUploadResourceService {
    constructor(private http: Http, private appSettingsService: AppSettingsService) { }
    public getUrl(): string {

        return this.appSettingsService.getEtlRestbaseurl().trim() + 'fileupload';
    }
    public upload(formData) {
        const url = this.getUrl();
        return this.http.post(url, formData)
            .map((x) => x.json()
            );
    }
    public getFile(url: string): Observable<any> {
        let fullUrl = this.appSettingsService.getEtlRestbaseurl().trim() + 'files/' + url;
        return new Observable((observer: Subscriber<any>) => {
            let objectUrl: string = null;
            let headers = new Headers({ 'Accept': 'image/png,image/jpeg,image/gif' });
            this.http
                .get(fullUrl, {
                    headers,
                    responseType: ResponseContentType.Blob
                })
                .subscribe((m) => {
                    objectUrl = URL.createObjectURL(m.blob());
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
