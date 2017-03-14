import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  Params,
  CanLoad,
  RouterStateSnapshot
} from '@angular/router';

import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientService } from './patient.service';
import { DraftedFormsService } from './formentry/drafted-forms.service';
import { ToastrService } from 'ngx-toastr';
import { PatientRoutesFactory } from './patient-side-nav/patient-side-nav-routes.factory';


@Injectable()
export class PatientDashboardGuard implements CanActivate,
  CanDeactivate<PatientDashboardComponent> {

  constructor(private dynamicRoutesService: DynamicRoutesService, private router: Router,
    private route: ActivatedRoute, private patientService: PatientService,
    private draftedFormsService: DraftedFormsService,
    private confirmationService: ConfirmationService,
    private patientRoutesFactory: PatientRoutesFactory,
    private toastrService: ToastrService) {
  }

  canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let component: any = routeSnapshot.component;
    if (component.name === 'PatientDashboardComponent') {
      let patientUuid = routeSnapshot.params['patient_uuid'];
      if (patientUuid) {
        // set patient object
        this.patientService.setCurrentlyLoadedPatientByUuid(patientUuid).subscribe(
          (patientObject) => {
            if (patientObject) {
              let routes = this.patientRoutesFactory.createPatientDashboardRoutes(patientObject);
              this.dynamicRoutesService.setPatientDashBoardRoutes(routes);
            }
          });

      } else {
        this.router.navigate(['/patient-dashboard/patient-search']);
      }
    }
    return true;
  }

  canDeactivate(target: PatientDashboardComponent): Observable<boolean> {
    this.toastrService.clear();
    if (this.draftedFormsService.lastDraftedForm === null ||
      this.draftedFormsService.lastDraftedForm === undefined ||
      !this.draftedFormsService.lastDraftedForm.rootNode.control.dirty) {
      this.dynamicRoutesService.resetRoutes();
      return Observable.of(true);
    }

    // confirm with user
    return Observable.create((observer: Subject<boolean>) => {
      this.confirmationService.confirm({
        header: 'Form Changes Not Saved',
        message: 'Are you sure you want to proceed?',
        accept: () => {
          this.dynamicRoutesService.resetRoutes();
          this.draftedFormsService.setDraftedForm(null);
          observer.next(true);
        },
        reject: () => {
          observer.next(false);
        }
      });
    }).first();
  }
}
