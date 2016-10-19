import { Injectable } from '@angular/core';
import { PatientEncounters } from './patient-encounters';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
//import { ENCOUNTERS } from './mock-encounters';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PatientEncounterService {
  // Resolve HTTP using the constructor
  constructor(private http: Http) { }
  // private instance variable to hold base url
  private contactsUrl = './app/patient-dashboard/patient-encounters/patient-encounters.json';

  // URL to web API
  getEncounters(): Observable<PatientEncounters[]> {
    return this
      .http
      .get(this.contactsUrl)
      .map(this.extractData)
      .delay(5000)
      .catch(this.handleError);
  }
  private extractData(res: Response) {
    let body = res.json();
    console.log(body.data);
    return body.data || {};
  }
  private handleError(error: any) {
    let errMsg = (error.message)
      ? error.message
      : error.status
        ? `${error.status} - ${error.statusText}`
        : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
  // getEncounters(): Promise<encounters[]> {
  //   return Promise.resolve(ENCOUNTERS);
}

