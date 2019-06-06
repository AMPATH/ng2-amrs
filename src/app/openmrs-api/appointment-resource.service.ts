import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { map } from 'rxjs/operators';

@Injectable({
 providedIn: 'root'
})
export class AppointmentResourceService {
 public baseOpenMrsUrl: string = this.getOpenMrsBaseUrl() + 'appointmentscheduling';
 public v = 'full';

 constructor(private http: HttpClient, private appSettingsService: AppSettingsService) { }

 public getOpenMrsBaseUrl(): string {
   return this.appSettingsService.getOpenmrsRestbaseurl().trim();
 }

 public saveAppointment(payload) {
   if (!payload) {
     return null;
   }

   const url = this.baseOpenMrsUrl + '/saveappointment';
   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post(url, payload, { headers }).pipe(
     map((response: any) => {
       console.log('appointment response', response);
       return response;
     }));
 }
}
