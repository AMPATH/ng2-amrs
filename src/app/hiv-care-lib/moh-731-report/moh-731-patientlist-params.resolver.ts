import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Moh731PatientListResourceService } from './moh-731-fake-patientlist-resource';
import { Injectable } from '@angular/core';

@Injectable()
export class Moh731ParamsResolver implements Resolve<Promise<any>> {

  constructor(public moh731PatientListResourceService?: Moh731PatientListResourceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | any {
    let params: any = {
      indicator: 'currently_in_care_total'
    };

    return this.moh731PatientListResourceService.getMoh731PatientList(params);
  }
}
