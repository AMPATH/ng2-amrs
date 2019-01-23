
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, of } from 'rxjs';
import { DataCacheService } from '../shared/services/data-cache.service';
import * as _ from 'lodash';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class OncologyReportService {
  public oncologyReports: any = [ {
    'program': 'Breast Cancer',
    'uuid': '142939b0-28a9-4649-baf9-a9d012bf3b3d',
    'reports': [
      {
        'name': 'B1. Breast screening numbers',
        'indicator': 'total_breast_screened',
        'type': 'breast-cancer-monthly-summary',
        'reportDefaults': [
          {
            'startDate': '2018-02-01',
            'endDate': '2018-12-12',
            'startAge': 0,
            'endAge': 120,
            'locationUUids': ''
          }
        ],
        'whiteListCols': []
      },
      {
        'name': 'B2. Normal breast screening findings',
        'indicator': 'normal_breast_screening_findings',
        'type': 'breast-cancer-monthly-summary',
        'reportDefaults': [
          {
            'startDate': '2018-01-01',
            'endDate': '2018-12-12',
            'startAge': 0,
            'endAge': 120,
            'locationUUids': ''
          }
        ]
      },
      {
        'name': 'B3. Abnormal breast screening findings',
        'indicator': 'abnormal_breast_screening_findings',
        'type': 'breast-cancer-monthly-summary',
        'reportDefaults': [
          {
            'startDate': '2018-01-01',
            'endDate': '2018-12-12',
            'startAge': 0,
            'endAge': 120,
            'locationUUids': ''
          }
        ]
      },
      {
        'name': 'B4. Diagnosis interval',
        'indicator': 'diagnosis_interval',
        'type': 'breast-cancer-monthly-summary',
        'reportDefaults': [
          {
            'startDate': '2018-01-01',
            'endDate': '2018-12-12',
            'startAge': 0,
            'endAge': 120,
            'locationUUids': ''
          }
        ]
      },
      {
        'name': 'B6. Number of clients referred to breast cancer clinic',
        'indicator': 'total_reffered_for_followup',
        'type': 'breast-cancer-monthly-summary',
        'reportDefaults': [
          {
            'startDate': '2018-01-01',
            'endDate': '2018-12-12',
            'startAge': 0,
            'endAge': 120,
            'locationUUids': ''
          }
        ]
      },
      {
        'name': 'B7. Number of clients getting biopsy results within 2 weeks',
        'indicator': 'biopsy_results_within_2wks',
        'type': 'breast-cancer-monthly-summary',
        'reportDefaults': [
          {
            'startDate': '2018-01-01',
            'endDate': '2018-12-12',
            'startAge': 0,
            'endAge': 120,
            'locationUUids': ''
          }
        ]
      }
    ]
},
{
  'program': 'Cervical Cancer',
  'uuid': 'cad71628-692c-4d8f-8dac-b2e20bece27f',
  'reports': [
    {
      'name': 'B1. Cervical screening numbers',
      'indicator': 'total_cervical_screened',
      'type': 'cervical-cancer-monthly-summary',
      'reportDefaults': [
        {
          'startDate': '2018-02-01',
          'endDate': '2018-12-12',
          'startAge': 0,
          'endAge': 120,
          'locationUUids': ''
        }
      ],
      'whiteListCols': []
    },
    {
      'name': 'B2. Normal cervical screening findings',
      'indicator': 'normal_cervical_screening',
      'type': 'cervical-cancer-monthly-summary',
      'reportDefaults': [
        {
          'startDate': '2018-01-01',
          'endDate': '2018-12-12',
          'startAge': 0,
          'endAge': 120,
          'locationUUids': ''
        }
      ]
    },
    {
      'name': 'B3. Abnormal breast screening findings',
      'indicator': 'abnormal_breast_screening_findings',
      'type': 'breast-cancer-monthly-summary',
      'reportDefaults': [
        {
          'startDate': '2018-01-01',
          'endDate': '2018-12-12',
          'startAge': 0,
          'endAge': 120,
          'locationUUids': ''
        }
      ]
    }
  ]
}];
  constructor(protected http: HttpClient,
              protected appSettingsService: AppSettingsService,
              private cacheService: DataCacheService) {
  }

  public getBaseUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getOncologyReports(): Observable<any> {

    const url = this.getBaseUrl() + 'oncology-reports';
    const request = this.http.get(url);

    return this.cacheService.cacheRequest(url, '' , request);

  }

  public getSpecificOncologyReport(reportUuid): Observable<any> {

    const url = this.getBaseUrl() + 'oncology-report';
    let urlParams: HttpParams = new HttpParams();

    if (reportUuid && reportUuid !== '') {
        urlParams = urlParams.set('reportUuid', reportUuid);
    } else {
       return of({
         'error': 'Null ReportUuid'
       });
    }
    const request = this.http.get(url, { params: urlParams });

    return this.cacheService.cacheRequest(url, '' , request);

  }

}
