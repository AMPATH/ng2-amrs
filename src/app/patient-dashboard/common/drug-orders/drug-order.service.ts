import { AppSettingsService } from './../../../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrugOrderService {
  public serverUrl = 'http://localhost:9000/api/';
  public baseOpenMrsUrl: string = this.getOpenMrsBaseUrl();

  constructor(
    private http: HttpClient,
    private _appSettingsService: AppSettingsService
  ) {}

  public getOpenMrsBaseUrl(): string {
    return this._appSettingsService.getOpenmrsRestbaseurl().trim();
  }
  public getActiveDrugs(): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const drugUrl = `${this.serverUrl}drug-list`;
    return this.http.get(drugUrl, { headers });
  }

  public getDrugFrequency(): Observable<any> {
    const url = this.baseOpenMrsUrl + 'orderfrequency';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(url, { headers });
  }

  public getDrugRoutes(): Observable<any> {
    const url =
      this.baseOpenMrsUrl +
      'concept/90083bee-9859-4364-a81f-4aad6f3634fb?v=custom:(answers)';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(url, { headers });
  }

  public getDurationUnits(): Observable<any> {
    const url =
      this.baseOpenMrsUrl +
      'concept/52e8a934-d57c-4ef0-9fb7-7c15d816b723?v=custom:(answers)';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(url, { headers });
  }

  public postPrescription(payload) {
    const url = this.serverUrl + 'prescription';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, JSON.stringify(payload), { headers });
  }
}
