
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { UserDefaultPropertiesService } from '../user-default-properties/user-default-properties.service';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class FeedBackService {

    constructor(private http: HttpClient, private appSettingsService: AppSettingsService,
        private userDefaultPropertiesService: UserDefaultPropertiesService) { }
    public postFeedback(payload) {
        const url = this.appSettingsService.getEtlServer() +
            '/user-feedback';
        return this.http.post(url, payload);
    }
}
