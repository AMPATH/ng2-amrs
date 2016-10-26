import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { LocalStorageService } from '../../utils/local-storage.service';
import { Constants } from '../../utils/constants';

@Injectable()
export class HttpClient {

  constructor(private http: Http, private localStorageService: LocalStorageService) {
  }

  createAuthorizationHeader(headers: Headers) {

    let credentials = this.localStorageService.getItem(Constants.CREDENTIALS_KEY);

    if(credentials) headers.append('Authorization', 'Basic ' + credentials);
  }
  
  get(url) {

    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }
}
