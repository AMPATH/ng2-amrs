import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PatientService } from './patient.service';
import { Patient } from '../../models/patient.model';
import { Observable, of } from 'rxjs';
import { PatientRoutesFactory } from '../../navigation/side-navigation/patient-side-nav/patient-side-nav-routes.factory';
import { DynamicRoutesService } from '../../shared/dynamic-route/dynamic-routes.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';

@Injectable()
export class PatientDashboardResolver implements Resolve<any> {
    constructor(private patientService: PatientService,
        private dynamicRoutesService: DynamicRoutesService,
        private router: Router, private patientRoutesFactory: PatientRoutesFactory,
        private patientResourceService: PatientResourceService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const patientUuid = route.paramMap.get('patient_uuid');
        console.log('Resolving for patient id:' + patientUuid);
        return this.patientService.fetchPatientByUuid(patientUuid);
    }
}
