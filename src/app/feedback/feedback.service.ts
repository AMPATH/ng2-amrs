import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { UserDefaultPropertiesService }
    from '../user-default-properties/user-default-properties.service';
@Injectable()
export class FeedBackService {

    constructor(private http: Http, private appSettingsService: AppSettingsService,
                private userDefaultPropertiesService: UserDefaultPropertiesService) { }
    public postFeedback(payload) {
        let url = this.appSettingsService.getEtlServer() +
            '/user-feedback';
        return this.http.post(url, payload).map((data) => data.json());
    }
}
