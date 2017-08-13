
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { AppSettingsService } from '../app-settings/app-settings.service';

@Injectable()
export class IndicatorResourceService {

  private reportIndicators = new ReplaySubject(1);
  private indicatorsFilters = new ReplaySubject(1);
  constructor(private http: Http, private appSettingsService: AppSettingsService) {
  }
  /**
   * @param {*} param
   * @param {boolean} [forceRefresh]
   * @returns
   *
   * @memberOf IndicatorResourceService
   */
  public getReportIndicators(param: any, forceRefresh?: boolean) {
    // If the Subject was NOT subscribed before OR if forceRefresh is requested

    let params = new URLSearchParams();
    params.set('report', param.report);

    if (!this.reportIndicators.observers.length || forceRefresh) {
      this.http.get(
        this.appSettingsService.getEtlRestbaseurl().trim() + 'indicators-schema',
        {
          search: params
        }
      )
        .map((res: Response) => res.json())
        .subscribe(
        data => this.reportIndicators.next(data.result),
        error => this.reportIndicators.error(error)
        );
    }

    return this.reportIndicators;
  }

  public getIndicatorDisaggregationFilters(param: any, forceRefresh?: boolean) {
    // If the Subject was NOT subscribed before OR if forceRefresh is requested

    let params = new URLSearchParams();

    if (!this.indicatorsFilters.observers.length || forceRefresh) {
      this.http.get(
        this.appSettingsService.getEtlRestbaseurl().trim()
        + 'indicator-disaggregation-filter-options',
        {
          search: params
        }
      )
        .map((res: Response) => res.json())
        .subscribe(
          data => this.indicatorsFilters.next(data),
          error => this.indicatorsFilters.error(error)
        );
    }

    return this.indicatorsFilters;
  }
}
