import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, URLSearchParams } from '@angular/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
@Injectable()
export class CommunityGroupAttributeService {
    public v = 'full';
    constructor(private http: Http,
                private _appSettingsService: AppSettingsService) {

    }

    public getOpenMrsBaseUrl(): string {
        return this._appSettingsService.getOpenmrsRestbaseurl() + 'cohortm/cohortattribute/';
    }

    public saveGroupAttribute(attributeType: string, value: string, cohort: string) {
        const url = this.getOpenMrsBaseUrl();
        const body = {attributeType, value, cohort};
        return this.http.post(url, body).pipe( map((response) => response.json()));
    }

    public updateGroupAttribute(attributeUuid, body) {
        const url = this.getOpenMrsBaseUrl() + attributeUuid;
        return this.http.post(url, body).pipe( map((response) => response.json()));
    }


    public generateAttributeUrls(attributes: any[]) {
        const urls = [];
        const baseUrl = this.getOpenMrsBaseUrl();
        _.forEach(attributes, (attr: any) => {
            const body = { value: attr.value,
                           cohortAttributeType: attr.attributeType,
                           cohort: attr.group
                         };
            if (_.isNull(attr['uuid'])) {
                urls.push({'url': baseUrl, 'body': body});
            } else {
                const url = baseUrl + attr['uuid'];
                urls.push({url: url, body: body});
            }
        });
        return urls;

    }

    public getAttributesByAttributeType(attributeTypeName: string) {
        const url = this.getOpenMrsBaseUrl();
        const params = new URLSearchParams();
        params.set('attributeType', attributeTypeName);
        return this.http.get(url, {search: params})
        .pipe(map((response) => response.json().results));
    }
}
