import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';
@Injectable()
export class DataEntryStatisticsService {
  constructor(protected http: Http,
              protected appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) {
  }

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public  getDataEntryStatisticsTypes() {
      let dataStatisticsTypes = [{
          id: 'view1',
          subType: 'by-date-by-encounter-type'
      }, {
          id: 'view2',
          subType: 'by-month-by-encounter-type'
      }, {
          id: 'view3',
          subType: 'by-provider-by-encounter-type'
      }, {
          id: 'view4',
          subType: 'by-creator-by-encounter-type'
      }];

      return JSON.stringify(dataStatisticsTypes);
   }

  public getDataEntryStatistics(payload): Observable<any> {

    if (payload && payload.subType && payload.startDate && payload.endDate && payload.groupBy) {

      let urlParams: URLSearchParams = new URLSearchParams();

      let baseUrl = this.getBaseUrl();
      let params: any = this.getDataEntryStatisticsQueryParam(payload);
      let dataEntryStatsUrl = 'data-entry-statistics/' + params.subType + '?' ;
      let url = baseUrl + dataEntryStatsUrl;
      urlParams.set('startDate', params.startDate);
      urlParams.set('endDate', params.endDate);
      urlParams.set('locationUuids', params.locationUuids);
      urlParams.set('formUuids', params.formUuids);
      urlParams.set('encounterTypeUuids', params.encounterTypeUuids);
      urlParams.set('providerUuid', params.providerUuid);
      urlParams.set('providerUuid', params.creatorUuid);

      let request = this.http.get(url, {search : urlParams})
        .map((response) => {
           return response.json().result;
        });

      return this.cacheService.cacheRequest(url, urlParams, request);

    } else {

      return Observable.throw({ error:
        'Request must contain subtype,startDate,endDate and groupBy' });

    }

  }

    public getDataEntryStatisticsQueryParam(payload) {

      let subType = '';
      let startDate = '';
      let endDate = '';
      let groupBy = '';
      let locationUuids = '';
      let encounterTypeUuids = '';
      let formUuids = '';
      let providerUuid = '';
      let creatorUuid = '';

      if (payload.subType) {
         subType = payload.subType;
      }
      if (payload.startDate) {
         startDate = payload.startDate;
      }
      if (payload.endDate) {
         endDate = payload.startDate;
      }
      if (payload.locationUuids) {
         locationUuids = payload.locationUuids;
      }
      if (payload.encounterTypeUuids) {
          encounterTypeUuids = payload.encounterTypeUuids;
      }
      if (payload.formUuids) {
         formUuids = payload.formUuids;
      }
      if (payload.providerUuid) {
         providerUuid = payload.providerUuid;
      }
      if (payload.creatorUuid) {
          creatorUuid = payload.providerUuid;
      }
      if (payload.groupBy) {
          groupBy = payload.groupBy;
      }


      let param: any = {
        subType: subType, // mandatory params
        startDate: startDate,
        endDate: endDate,
        groupBy: groupBy
      };

      let paramConfig: any = {};

      let getParamConfigObj = (arrayProperties) =>  {
        let obj = {};
        for (let x of arrayProperties){
           obj[x] = 'prop';
        }
        return obj;
      };

      switch (subType) {
        case 'by-date-by-encounter-type':
          paramConfig = getParamConfigObj(['locationUuids', 'encounterTypeUuids',
          'formUuids', 'providerUuid']);
          break;
        case 'by-month-by-encounter-type':
          paramConfig = getParamConfigObj(['locationUuids', 'encounterTypeUuids',
           'formUuids', 'providerUuid']);
          break;
        case 'by-provider-by-encounter-type':
          paramConfig = getParamConfigObj(['locationUuids', 'encounterTypeUuids',
           'formUuids', 'providerUuid']);
          break;
        case 'by-creator-by-encounter-type':
          paramConfig = getParamConfigObj(['locationUuids', 'encounterTypeUuids',
           'formUuids', 'creatorUuid']);
          break;
        case 'patientList':
          paramConfig = getParamConfigObj(['locationUuids', 'encounterTypeUuids',
           'formUuids', 'providerUuid', 'creatorUuid']);
          break;
      }

      // set-up the param object
      if (locationUuids !== '' && paramConfig.locationUuids) {
        param.locationUuids = locationUuids;
      }
      if (encounterTypeUuids !== '' && paramConfig.encounterTypeUuids) {
        param.encounterTypeUuids = encounterTypeUuids;
      }
      if (formUuids !== '' && paramConfig.formUuids) {
        param.formUuids = formUuids;
      }
      if (providerUuid !== '' && paramConfig.providerUuid) {
        param.providerUuid = providerUuid;
      }
      if (creatorUuid !== '' && paramConfig.creatorUuid) {
        param.creatorUuid = creatorUuid;
      }

      return param;
    }

}
