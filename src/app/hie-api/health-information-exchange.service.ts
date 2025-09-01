import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HieClient, HieClientSearchDto } from '../models/hie-registry.model';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class HealthInformationExchangeService {
  private baseUrl = 'http://localhost:9000/hie/client';

  constructor(protected http: HttpClient) {}

  fetchClient(hieClientSearchDto: HieClientSearchDto): Observable<HieClient[]> {
    const fetchUrL = `${this.baseUrl}/search`;
    return this.http.post<HieClient[]>(fetchUrL, hieClientSearchDto);
  }
}
