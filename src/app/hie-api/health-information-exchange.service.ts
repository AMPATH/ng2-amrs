import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HieClient, HieClientSearchDto } from '../models/hie-registry.model';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import {
  Practitioner,
  PractitionerSearchParams
} from '../models/practitioner.model';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HealthInformationExchangeService {
  private baseUrl = 'http://localhost:9000/hie';

  constructor(protected http: HttpClient) {}

  fetchClient(hieClientSearchDto: HieClientSearchDto): Observable<HieClient[]> {
    const fetchUrL = `${this.baseUrl}/client/search`;
    return this.http.post<HieClient[]>(fetchUrL, hieClientSearchDto);
  }

  searchPractitioners(
    params: PractitionerSearchParams
  ): Observable<Practitioner[]> {
    let httpParams = new HttpParams();

    if (params.nationalId) {
      httpParams = httpParams
        .set('identifierType', 'National ID')
        .set('identifierValue', params.nationalId);
    }

    if (params.licenseNumber) {
      httpParams = httpParams
        .set('identifierType', 'License Number')
        .set('identifierValue', params.licenseNumber);
    }

    if (params.name) {
      httpParams = httpParams
        .set('identifierType', 'Name')
        .set('identifierValue', params.name);
    }

    return this.http
      .get<{ message: Practitioner }>(`${this.baseUrl}/practitioner/search`, {
        params: httpParams
      })
      .pipe(
        map((response) => {
          if (!response || !response.message) {
            return [];
          }
          return [response.message];
        })
      );
  }

  // getAllPractitioners(): Observable<Practitioner[]> {
  //   return of(this.mockPractitioners).pipe(delay(300));
  // }
}
