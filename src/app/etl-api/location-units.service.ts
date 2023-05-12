import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationUnitsService {
  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }

  public getAdministrativeUnits(): Observable<any> {
    const url = this.getUrl() + 'administrative-units';
    return this.http.get<any>(url, {}).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
