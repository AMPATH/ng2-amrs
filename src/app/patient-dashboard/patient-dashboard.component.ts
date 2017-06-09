import { Component, OnInit, OnDestroy, ElementRef, ViewChild, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { PatientService } from './patient.service';
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

  ngOnInit() {
    this.patientService.isBusy.subscribe(
      (isLoading) => {
        this.fetchingPatient = isLoading;
      }, (err) => {
        this.fetchingPatient = false;
      });
    this.getNewResults();
  }

  ngDoCheck() {
    this.adjustContainerOffsets();
  }
  adjustContainerOffsets() {
    // console.error(this.elRef);
    // console.error('body', this.bodyElement);
    this.topOffset = this.containerElement.nativeElement.offsetTop;
    this.headerHeight = this.headerElement.nativeElement.clientHeight;
    this.leftOffset = this.bodyElement.nativeElement.offsetWidth - 2;
  }

  ngOnDestroy() {
    if (this.patientSubscription) {
      this.patientSubscription.unsubscribe();
    }
    if (this.labSubscription) {
      this.labSubscription.unsubscribe();
    }

  }

  getNewResults() {
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
              let content = '';
              for (let test of result) {
                if (test.groupMembers) {
                  for (let l of test.groupMembers) {
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
              this.toastrService.info(content.toLowerCase(), 'New Data from Lab');
              // app feature analytics
              this.appFeatureAnalytics
                .trackEvent('Patient Dashboard', 'EID Lab Data Synced', 'getNewResults');
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
