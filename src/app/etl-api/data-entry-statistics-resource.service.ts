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

  public  getDataEntryStatisticsTypes(): Observable<any> {
      let dataStatisticsTypes = [{
          id: 'view1',
          subType: 'Encounter Types Per Day'
      }, {
          id: 'view2',
          subType: 'Encounters Types Per Month'
      }, {
          id: 'view3',
          subType: 'Encounters Types Per Provider'
      }, {
          id: 'view4',
          subType: 'Encounters Types Per Creator'
      }];

      return Observable.of(dataStatisticsTypes);
   }

  public getDataEntryStatistics(payload): Observable<any> {


    if (payload && payload.subType && payload.startDate && payload.endDate && payload.groupBy) {

      let urlParams: URLSearchParams = new URLSearchParams();

      let baseUrl = this.getBaseUrl();
      let params: any = this.getDataEntryStatisticsQueryParam(payload);

      let dataEntryStatsUrl = 'data-entry-statistics/' + params.subType;
      let url = baseUrl + dataEntryStatsUrl;
      urlParams.set('startDate', params.startDate);
      urlParams.set('endDate', params.endDate);
      urlParams.set('groupBy', params.groupBy);
      if (params.locationUuids) {
          urlParams.set('locationUuids', params.locationUuids);
      }
      if (params.encounterTypeUuids) {
         urlParams.set('encounterTypeUuids', params.encounterTypeUuids);
      }
      if (params.providerUuid) {
         urlParams.set('providerUuid', params.providerUuid);
      }
      if (params.creatorUuid) {
         urlParams.set('creatorUuid', params.creatorUuid);
      }

      let request = this.http.get(url, {search : urlParams})
        .map((response) => {
           return response.json().result;
        });

      return this.cacheService.cacheRequest(url, urlParams, request);

    } else {

      console.log('Error getting params');

      return Observable.throw({ error:
        'Request must contain subtype,startDate,endDate and groupBy' });

    }

  }

    public getDataEntryStatisticsQueryParam(payload) {

      let subType = '';
      let startDate = '';
      let endDate = '';
      let groupBy = '';

      if (payload.subType) {
         subType = payload.subType;
      }
      if (payload.startDate) {
         startDate = payload.startDate;
      }
      if (payload.endDate) {
         endDate = payload.endDate;
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

        // set-up the param object
      if (payload.locationUuids && payload.locationUuids.length > 0) {
          param.locationUuids = payload.locationUuids;
      }
      if (payload.encounterTypeUuids && payload.encounterTypeUuids.length > 0) {
          param.encounterTypeUuids = payload.encounterTypeUuids;
      }
      if (payload.formUuids && payload.formUuids.length > 0) {
          param.formUuids = payload.formUuids;
      }
      if (payload.providerUuid && payload.providerUuid.length > 0) {
          param.providerUuid = payload.providerUuid;
      }
      if (payload.creatorUuid && payload.creatorUuid.length > 0) {
          param.creatorUuid = payload.creatorUuid;
      }

      return param;
    }

    public getDataEntrySatisticsPatientList(params) {

      let urlParams: URLSearchParams = new URLSearchParams();

      let baseUrl = this.getBaseUrl();
      let dataEntryStatsPatientListUrl = 'data-entry-statistics/patientList' ;
      let url = baseUrl + dataEntryStatsPatientListUrl;
      urlParams.set('startDate', params.startDate);
      urlParams.set('endDate', params.endDate);
      urlParams.set('groupBy', 'groupByPatientId');

      if (params.encounterTypeUuids && params.encounterTypeUuids.length > 0) {
          urlParams.set('encounterTypeUuids', params.encounterTypeUuids);
      }
      if (params.providerUuid && params.providerUuid.length > 0) {
          urlParams.set('providerUuid', params.providerUuid);
      }
      if (params.creatorUuid && params.creatorUuid.length > 0) {
          urlParams.set('creatorUuid', params.creatorUuid);
      }
      if (params.locationUuids && params.locationUuids.length > 0) {
           urlParams.set('locationUuids', params.locationUuids);
      }

      let request = this.http.get(url, {search : urlParams})
        .map((response) => {
           return response.json().result;
        });

      return this.cacheService.cacheRequest(url, urlParams, request);

    }

}
