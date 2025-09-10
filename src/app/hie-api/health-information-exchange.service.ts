import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HieClient, HieClientSearchDto } from '../models/hie-registry.model';
import { Observable, of } from 'rxjs';
import {
  Practitioner,
  PractitionerResponse,
  PractitionerSearchParams,
  Providers
} from '../models/practitioner.model';
import { catchError, map } from 'rxjs/operators';

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
    if (params.refresh) {
      httpParams = httpParams.set('refresh', String(params.refresh));
    }

    return this.http
      .get<PractitionerResponse>(`${this.baseUrl}/practitioner/search`, {
        params: httpParams
      })
      .pipe(
        map((response) => {
          if ('error' in response.message) {
            throw new Error(response.message.error);
          }
          return [response.message];
        })
      );
  }

  getAllProviders(locationUuid: string): Observable<Providers[]> {
    const params = new HttpParams().set('locationUuid', locationUuid);
    return this.http.get<Providers[]>(`${this.baseUrl}/amrs/providers/active`, {
      params
    });
  }

  getProviderByNationalId(nationalId: string): Observable<Providers[]> {
    const params = new HttpParams().set('nationalId', nationalId);
    return this.http
      .get<Providers[]>(`${this.baseUrl}/amrs/provider/national-id`, { params })
      .pipe(
        map((response) => {
          return response || [];
        }),
        catchError((error) => {
          console.error('Error fetching provider by National ID:', error);
          return of([]);
        })
      );
  }
}
