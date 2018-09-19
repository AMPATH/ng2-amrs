
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import {
  Http, Request, RequestOptionsArgs, Response, XHRBackend,
  RequestOptions, ConnectionBackend, Headers
} from '@angular/http';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { SessionStorageService } from '../../utils/session-storage.service';
import { Constants } from '../../utils/constants';
import { Injectable } from '@angular/core';
@Injectable()
export class HttpClient extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions,
              private _router: Router, private sessionStorageService: SessionStorageService) {
    super(backend, defaultOptions);
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.request(url, options));
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
  }

  public post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
  }

  public put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, this.getRequestOptionArgs(options)));
  }

  public getRequestOptionArgs(options: RequestOptionsArgs = null): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }
    if (options.headers == null) {
      options.headers = new Headers();
    }
    const credentials = this.sessionStorageService.getItem(Constants.CREDENTIALS_KEY);
    if (credentials) {
      options.headers.append('Authorization', 'Basic ' + credentials);
    }
    return options;
  }

  public intercept(observable: Observable<Response>): Observable<Response> {
    return observable.pipe(catchError((err, source) => {
      // if (err.status  == 401 && !_.endsWith(err.url, '/session')) {
      //   this._router.navigate(['/login']);
      //   return Observable.empty();
      // } else {
      //   return Observable.throw(err);
      // }
      return observableThrowError(err);
    }));
  }
}
