import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { AppSettingsService } from '../app-settings/app-settings.service';


@Injectable()
export class FileUploadResourceService {
    constructor(private http: Http, private appSettingsService: AppSettingsService) { }
    getUrl(): string {

        return this.appSettingsService.getEtlRestbaseurl().trim() + 'fileupload';
    }
    upload(formData) {
        const url = this.getUrl();
        return this.http.post(url, formData)
            .map(x => x.json()
            );
    }
    getFile(url: string): Observable<any> {
        return new Observable((observer: Subscriber<any>) => {
            let objectUrl: string = null;
            let headers = new Headers({ 'Accept': 'image/png,image/jpeg,image/gif' });
            this.http
                .get(url, {
                    headers,
                    responseType: ResponseContentType.Blob
                })
                .subscribe(m => {
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
