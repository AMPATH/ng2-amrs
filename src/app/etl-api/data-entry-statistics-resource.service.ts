import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable()
export class DataEntryStatisticsService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private cacheService: DataCacheService
  ) {}

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getDataEntryStatisticsTypes(): Observable<any> {
    const dataStatisticsTypes = [
      {
        id: 'view1',
        subType: 'Encounter Types Per Day'
      },
      {
        id: 'view2',
        subType: 'Encounters Types Per Month'
      },
      {
        id: 'view3',
        subType: 'Encounters Types Per Provider'
      },
      {
        id: 'view4',
        subType: 'Encounters Types Per Creator'
      }
    ];

    return of(dataStatisticsTypes);
  }

  public getDataEntryStatistics(payload): Observable<any> {
    if (
      payload &&
      payload.subType &&
      payload.startDate &&
      payload.endDate &&
      payload.groupBy
    ) {
      const baseUrl = this.getBaseUrl();
      const params: any = this.getDataEntryStatisticsQueryParam(payload);

      const dataEntryStatsUrl = 'data-entry-statistics/' + params.subType;
      const url = baseUrl + dataEntryStatsUrl;
      let urlParams: HttpParams = new HttpParams()
        .set('startDate', params.startDate)
        .set('endDate', params.endDate)
        .set('groupBy', params.groupBy);
      if (params.locationUuids) {
        urlParams = urlParams.set('locationUuids', params.locationUuids);
      }
      if (params.encounterTypeUuids) {
        urlParams = urlParams.set(
          'encounterTypeUuids',
          params.encounterTypeUuids
        );
      }
      if (params.providerUuid) {
        urlParams = urlParams.set('providerUuid', params.providerUuid);
      }
      if (params.creatorUuid) {
        urlParams = urlParams.set('creatorUuid', params.creatorUuid);
      }
      if (params.visitTypeUuids) {
        urlParams = urlParams.set('visitTypeUuids', params.visitTypeUuids);
      }

      const request = this.http.get(url, { params: urlParams }).pipe(
        map((response: any) => {
          return response.result;
        })
      );

      return this.cacheService.cacheRequest(url, urlParams, request);
    } else {
      console.log('Error getting params');

      return observableThrowError({
        error: 'Request must contain subtype,startDate,endDate and groupBy'
      });
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

    const param: any = {
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
    if (payload.visitTypeUuids && payload.visitTypeUuids.length > 0) {
      param.visitTypeUuids = payload.visitTypeUuids;
    }

    return param;
  }

  public getDataEntrySatisticsPatientList(params) {
    const baseUrl = this.getBaseUrl();
    const dataEntryStatsPatientListUrl = 'data-entry-statistics/patientList';
    const url = baseUrl + dataEntryStatsPatientListUrl;
    let urlParams: HttpParams = new HttpParams()
      .set('startDate', params.startDate)
      .set('endDate', params.endDate)
      .set('groupBy', 'groupByLocationId,groupByPatientId');

    if (params.encounterTypeUuids && params.encounterTypeUuids.length > 0) {
      urlParams = urlParams.set(
        'encounterTypeUuids',
        params.encounterTypeUuids
      );
    }
    if (params.providerUuid && params.providerUuid.length > 0) {
      urlParams = urlParams.set('providerUuid', params.providerUuid);
    }
    if (params.creatorUuid && params.creatorUuid.length > 0) {
      urlParams = urlParams.set('creatorUuid', params.creatorUuid);
    }
    if (params.locationUuids && params.locationUuids.length > 0) {
      urlParams = urlParams.set('locationUuids', params.locationUuids);
    }
    if (params.visitTypeUuids && params.visitTypeUuids.length > 0) {
      urlParams = urlParams.set('visitTypeUuids', params.visitTypeUuids);
    }

    const request = this.http.get(url, { params: urlParams }).pipe(
      map((response: any) => {
        return response.result;
      })
    );

    return this.cacheService.cacheRequest(url, urlParams, request);
  }
}
