import { Component, OnInit, OnDestroy, ElementRef, ViewChild, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { PatientService } from './services/patient.service';
import { Patient } from '../models/patient.model';
import { LabsResourceService } from '../etl-api/labs-resource.service';
import * as Moment from 'moment';
import { ToastrService, ToastrConfig } from 'ngx-toastr';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit, OnDestroy, DoCheck {

  public fetchingPatient: boolean = false;
  public patient: Patient;
  public topOffset = 49;
  public leftOffset = 56;
  public headerHeight = 180;
  private patientSubscription: Subscription;
  private labSubscription: Subscription;

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
              private toastrConfig: ToastrConfig, private toastrService: ToastrService) {

    toastrConfig.timeOut = 0;
    toastrConfig.closeButton = true;
    toastrConfig.positionClass = 'toast-bottom-right';
    toastrConfig.extendedTimeOut = 0;
    toastrConfig.preventDuplicates = true;
    toastrConfig.enableHtml = true;
  }

  public ngOnInit() {
    this.patientService.isBusy.subscribe(
      (isLoading) => {
        this.fetchingPatient = isLoading;
      }, (err) => {
        this.fetchingPatient = false;
      });
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
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
    if (this.labSubscription) {
      this.labSubscription.unsubscribe();
    }

  }

  public getNewResults() {
    let patientEmited: any = { uuid: '' };
    this.patientSubscription = this.patientService.
      currentlyLoadedPatient.subscribe((patient: any) => {
        let startDate = Moment('2006-01-01').startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
        let endDate = Moment().startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
        if (patient) {
          patientEmited = patient;
          this.labSubscription = this.labsResourceService.getNewPatientLabResults({
            startDate: startDate,
            endDate: endDate,
            patientUuId: patient.person.uuid
          }).subscribe((result) => {
            if (result.length > 0) {
              let content: any = {
                'cd4P': '',
                'cd4' : ''
              };
              let msg: string = '';
              for (let test of result) {
                if (test.groupMembers) {
                  for (let l of test.groupMembers) {
                    if (l.concept.uuid === 'a8970a26-1350-11df-a1f1-0026b9348838') {
                      let cd4Pcontent = `CD4%: ${l.value} `;
                      content.cd4P = cd4Pcontent;
                    }
                    if (l.concept.uuid === 'a8a8bb18-1350-11df-a1f1-0026b9348838') {
                      let cd4content = `CD4: ${l.value} `;
                      content.cd4 = cd4content;
                    }
                  }

                  msg = `(collected on ${Moment(test.obsDatetime)
                    .format('DD/MM/YYYY')})`;
                 }
              }
              let cd4Msg = content.cd4 + ' ' + content.cd4P + '<p>' + msg + '</p>';
              // only show if cd4 or cd4% message is shown
              if (content.cd4P.length > 0 || content.cd4.length > 0) {
                  this.toastrService.info(cd4Msg, 'New CD4 Results from Lab');
                  // app feature analytics
                  this.appFeatureAnalytics
                    .trackEvent('Patient Dashboard', 'EID Lab Data Synced', 'getNewResults');

              }
            }
          }, (err) => {
            console.error(err);
          });
        }
      }, (error) => {
        console.error(error);
      });

  }
}
