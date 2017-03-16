import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
@Injectable()
export class FeedBackService {

    constructor(private http: Http, private appSettingsService: AppSettingsService) { }
    public postFeedback(payload) {
        let url = this.appSettingsService.getEtlServer() +
            '/user-feedback';
        return this.http.post(url, payload).map((data) => data.json());
    }
}
