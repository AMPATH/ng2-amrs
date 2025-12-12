import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class FormsResourceService {
  private forms = new ReplaySubject(1);

  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  /**
   *
   *
   * @param {boolean} [forceRefresh]
   * @returns
   *
   * @memberOf AmrsDataService
   */
  public getForms(forceRefresh?: boolean) {
    const params = new HttpParams()
      .set(
        'v',
        'custom:(uuid,name,encounterType:(uuid,name),version,' +
          'published,retired,resources:(uuid,name,dataType,valueReference))'
      )
      .set('q', 'POC')
      .set('limit', '500');

    if (!this.forms.observers.length || forceRefresh) {
      this.http
        .get<any>(
          this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'form',
          { params: params }
        )
        .subscribe(
          (data) => {
            let allResults = data.results;
            const nextLink =
              data.links && data.links.find((link) => link.rel === 'next');

            if (nextLink) {
              const secondPageParams = params.set('startIndex', '500');
              this.http
                .get<any>(
                  this.appSettingsService.getOpenmrsRestbaseurl().trim() +
                    'form',
                  { params: secondPageParams }
                )
                .subscribe(
                  (secondPageData) => {
                    allResults = allResults.concat(secondPageData.results);
                    this.forms.next(allResults);
                  },
                  (error) => this.forms.error(error)
                );
            } else {
              this.forms.next(allResults);
            }
          },
          (error) => this.forms.error(error)
        );
    }

    return this.forms;
  }

  public getFormClobDataByUuid(
    uuid: string,
    v: string = null
  ): Observable<any> {
    let url =
      this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'clobdata';
    url += '/' + uuid;

    const params: HttpParams = new HttpParams().set(
      'v',
      v && v.length > 0 ? v : 'full'
    );

    return this.http.get(url, {
      params: params
    });
  }

  public getFormMetaDataByUuid(
    uuid: string,
    v: string = null
  ): Observable<any> {
    let url = this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'form';
    url += '/' + uuid;

    const params: HttpParams = new HttpParams().set(
      'v',
      v && v.length > 0 ? v : 'full'
    );

    return this.http.get(url, {
      params: params
    });
  }
}
