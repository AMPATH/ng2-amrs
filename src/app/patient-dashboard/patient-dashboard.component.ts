
import {take} from 'rxjs/operators';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { PatientService } from './services/patient.service';
import { Patient } from '../models/patient.model';
import { LabsResourceService } from '../etl-api/labs-resource.service';
import * as Moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { PatientRoutesFactory
} from '../navigation/side-navigation/patient-side-nav/patient-side-nav-routes.factory';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit, OnDestroy, DoCheck {

  public fetchingPatient = false;
  public patient: Patient;
  public topOffset = 49;
  public leftOffset = 56;
  public headerHeight = 180;
  private subscriptions: Subscription[] = [];
  public toastrConfig = {
    timeOut: 0,
    positionClass: 'toast-bottom-right',
    closeButton: true,
    preventDuplicates: true
  };

  @ViewChild('headerElement')
  private headerElement;
  @ViewChild('bodyElement')
  private bodyElement;
  @ViewChild('containerElement')
  private containerElement;

  constructor(private router: Router, private route: ActivatedRoute,
    private patientService: PatientService,
    private labsResourceService: LabsResourceService,
    private appFeatureAnalytics: AppFeatureAnalytics,
    private patientRoutesFactory: PatientRoutesFactory,
    private dynamicRoutesService: DynamicRoutesService,
    private toastrService: ToastrService) {

  }

  public ngOnInit() {
   const sub = this.patientService.currentlyLoadedPatient.subscribe(
      (patientObject) => {
        if (patientObject) {
          const routes = this.patientRoutesFactory
          .createPatientDashboardRoutes(patientObject);
          this.dynamicRoutesService.setPatientDashBoardRoutes(routes);
        }
      });
    const sub2 = this.patientService.isBusy.subscribe(
      (isLoading) => {
        setTimeout(() => {
          this.fetchingPatient = isLoading;
        });

      }, (err) => {
        this.fetchingPatient = false;
      });

    this.subscriptions.push(sub);
    this.subscriptions.push(sub2);

    this.getNewResults();
  }

  public ngDoCheck() {
    this.adjustContainerOffsets();
  }
  public adjustContainerOffsets() {
    // console.error(this.elRef);
    // console.error('body', this.bodyElement);
    this.topOffset = this.containerElement.nativeElement.offsetTop;
    this.headerHeight = this.headerElement.nativeElement.clientHeight;
    this.leftOffset = this.bodyElement.nativeElement.offsetWidth - 2;
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  public getNewResults() {
    const sub1 = this.patientService.
      currentlyLoadedPatient.subscribe((patient: any) => {
        if (patient) {
          const sub2 = this.getCombinedResult(patient).pipe(take(1)).subscribe((results: any[]) => {
            // the intention of combining is to have both systems sync. So we take just one result
            if (results.length > 0) {
              const result = results[1][0];
              if (result.updatedObs && result.updatedObs.length > 0) {
                let content = '';
                for (const test of result) {
                  if (test.groupMembers) {
                    for (const l of test.groupMembers) {
                      if (l.uuid === '5538cd04-9852-40f8-88ba-c69da32e50eb') {
                        content = content +
                          `CD4%: ${l.value} `;
                      }
                      if (l.uuid === 'f9424af5-1fd3-4a8f-8d43-7b098eb20ac3') {
                        content = content +
                          `CD4: ${l.value} `;
                      }
                    }
                  } else {
                    content = content +
                      `${test.display} (collected on ${Moment(test.obsDatetime)
                        .format('DD/MM/YYYY')})`;
                  }
                }
                this.toastrService.info(content.toLowerCase(), 'New Data from Lab', this.toastrConfig);
              }
            }
          }, (err) => {
            console.error(err);
          });
          this.subscriptions.push(sub2);
        }
      }, (error) => {
        console.error(error);
      });

      this.subscriptions.push(sub1);
  }

  public getCombinedResult(patient: any): Observable<any[]> {
    const startDate = Moment('2006-01-01').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
    const endDate = Moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
    const batch: Observable<any>[] = [];
    batch.push(this.labsResourceService.getNewPatientLabResults({
      startDate: startDate,
      endDate: endDate,
      patientUuId: patient.person.uuid
    }));
    batch.push(this.labsResourceService.getUpgradePatientLabResults({
      patientUuid: patient.person.uuid
    }));
    return combineLatest(batch);
  }

}
