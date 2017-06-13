import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppSettingsService } from '../app-settings/app-settings.service';


@Injectable()
export class FileUploadResourceService {
    constructor(private http: Http) { }
    upload(formData) {
        const url = ``;
        return this.http.post(url, formData)
            .map(x => x.json()
            );
    }
}
