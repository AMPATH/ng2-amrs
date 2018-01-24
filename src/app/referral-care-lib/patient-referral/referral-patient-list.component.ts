import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Location } from '@angular/common';
import {
  PatientReferralResourceService
} from '../../etl-api/patient-referral-resource.service';

@Component({
  selector: 'referral-patient-list',
  templateUrl: 'referral-patient-list.component.html'
})
export class ReferralPatientListComponent implements OnInit {
  public stateUuids: any;
  public programUuids: any;
  public translatedIndicator: string;
  public patientData: any;
  public startDate: any;
  public endDate: any;
  public startAge: any;
  public endAge: any;
  public gender: any;
  public locationUuids: Array<string>;
  public startIndex: number = 0;
  public isLoading: boolean = false;
  public dataLoaded: boolean = false;
  public overrideColumns: Array<any> = [];
  public routeParamsSubscription: Subscription;
  constructor(public route: ActivatedRoute,
              public router: Router,
              public resourceService: PatientReferralResourceService,
              private _location: Location) {

  }

  public ngOnInit() {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {
      /*if (params) {
        let period = params['period'];
        this.getDateRange(period);
        this.locationUuids = params.locationUuids;
        let age = params['age'];
        this.getAgeRange(age);
        this.gender = params['gender'];
        this.overrideColumns.push({
          field: 'identifiers',
          onCellClicked: (column) => {
            this.redirectTopatientInfo(column.data.patient_uuid);
          },
          cellRenderer: (column) => {
            return '<a href="javascript:void(0);" title="Identifiers">'
              + column.value + '</a>';
          }
        });
      }*/
    });

    this.generatePatientListReport();
  }

  public getDateRange(period) {
    let startDate = period[0].split('/');
    let endDate = period[1].split('/');
    this.startDate = moment([startDate[2], startDate[1] - 1, startDate[0]]);
    this.endDate = moment([endDate[2], endDate[1] - 1, endDate[0]]);

  }

  public getAgeRange(age) {
    this.startAge = age[0];
    this.endAge = age[1];

  }

  public generatePatientListReport() {
    this.isLoading = true;
    this.resourceService.getPatientReferralPatientList({
      endDate: this.endDate, //.format(),
      locationUuids: this.locationUuids,
      startDate: this.startDate,//.format(),
      startAge: this.startAge,
      endAge: this.endAge,
      gender: this.gender,
      startIndex: this.startIndex
    }).subscribe((report) => {
      this.patientData = '';
        //this.patientData ? this.patientData.concat(report) : report;
      this.isLoading = false;
      this.startIndex += report.length;
      if (report.length < 300) {
        this.dataLoaded = true;
      }
    });
  }

  public loadMorePatients() {
    this.generatePatientListReport();
  }

  public redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate(['/patient-dashboard/patient/' + patientUuid + '/general/landing-page']);
  }

}
