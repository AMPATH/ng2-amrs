import { take } from 'rxjs/operators';

import { map, first } from 'rxjs/operators';
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
import { Observable, ReplaySubject, Subject, of } from 'rxjs';
import { ConfirmationService } from 'primeng/primeng';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PatientService } from './services/patient.service';
import { DraftedFormsService } from './common/formentry/drafted-forms.service';
import { ToastrService } from 'ngx-toastr';
import { PatientRoutesFactory } from '../navigation/side-navigation/patient-side-nav/patient-side-nav-routes.factory';

@Injectable()
export class PatientDashboardGuard
  implements CanActivate, CanDeactivate<PatientDashboardComponent>
{
  constructor(
    private dynamicRoutesService: DynamicRoutesService,
    private router: Router,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private draftedFormsService: DraftedFormsService,
    private confirmationService: ConfirmationService,
    private patientRoutesFactory: PatientRoutesFactory,
    private toastrService: ToastrService
  ) {}

  public canActivate(
    routeSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return of(true).pipe(
      map(() => {
        const component: any = routeSnapshot.component;
        if (component.name === 'PatientDashboardComponent') {
          const patientUuid = routeSnapshot.params['patient_uuid'];
          if (patientUuid) {
            // set patient object
            this.patientService.currentlyLoadedPatient.subscribe(
              (patientObject) => {
                if (patientObject) {
                  const routes =
                    this.patientRoutesFactory.createPatientDashboardRoutes(
                      patientObject
                    );
                  this.dynamicRoutesService.setPatientDashBoardRoutes(routes);
                }
              },
              (error) => {
                console.error('Error fetching patient', error);
              }
            );
          } else {
            this.router.navigate(['/patient-dashboard/patient-search']);
          }
        }
        return true;
      })
    );
  }

  public canDeactivate(target: PatientDashboardComponent): Observable<boolean> {
    this.toastrService.clear();
    if (
      this.draftedFormsService.lastDraftedForm === null ||
      this.draftedFormsService.lastDraftedForm === undefined ||
      !this.draftedFormsService.lastDraftedForm.rootNode.control.dirty
    ) {
      this.dynamicRoutesService.resetRoutes();
      // console.log('Reset patient service');
      this.patientService.resetPatientService();
      return of(true);
    }

    // confirm with user
    return Observable.create((observer: Subject<boolean>) => {
      this.confirmationService.confirm({
        header: 'Form Changes Not Saved',
        message: 'Are you sure you want to proceed?',
        accept: () => {
          this.dynamicRoutesService.resetRoutes();
          this.draftedFormsService.setDraftedForm(null);
          // console.log('Reset patient service');
          this.patientService.resetPatientService();
          observer.next(true);
        },
        reject: () => {
          observer.next(false);
        }
      });
    }).pipe(first());
  }
}
