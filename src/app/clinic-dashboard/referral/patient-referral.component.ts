

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';

import {
  PatientReferralBaseComponent
} from '../../referral-care-lib/patient-referral/patient-referral-report-base.component';
import {
  PatientReferralResourceService
} from '../../etl-api/patient-referral-resource.service';
import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';

@Component({
  selector: 'patient-referral-report',
  templateUrl: '../../referral-care-lib/patient-referral/patient-referral-report-base.component.html'
})
export class PatientReferralComponent extends PatientReferralBaseComponent
  implements OnInit {
  public data = [];
  public sectionsDef = [];
  public enabledControls = 'datesControl,programWorkFlowControl' +
    'ageControl,genderControl';

  constructor(public patientReferralResourceService: PatientReferralResourceService,
              private route: ActivatedRoute, private location: Location,
              private router: Router,
              public dataAnalyticsDashboardService: DataAnalyticsDashboardService) {
    super(patientReferralResourceService, dataAnalyticsDashboardService);

  }

  public ngOnInit() {
    this.route.parent.parent.parent.params.subscribe((params: any) => {
      this.locationUuids = [];
      if (params.location_uuid) {
        this.locationUuids.push(params.location_uuid);
      }
    });
    this.loadReportParamsFromUrl();
  }

  public generateReport() {
    this.storeReportParamsInUrl();
    super.generateReport();
  }

  public loadReportParamsFromUrl() {
    let path = this.router.parseUrl(this.location.path());
    let pathHasHistoricalValues = path.queryParams['startDate'] &&
      path.queryParams['endDate'];

    if (path.queryParams['startDate']) {
      this.startDate = new Date(path.queryParams['startDate']);
      console.log(' this.startDate--------->>>>>',  this.startDate);
    }

    if (path.queryParams['endDate']) {
      this.endDate = new Date(path.queryParams['endDate']);
    }
    if (path.queryParams['gender']) {
      this.gender = (path.queryParams['gender'] as any);
      this.formatGenderToSelectArray(path.queryParams['gender']);
    }
    if (path.queryParams['startAge']) {
      this.startAge = (path.queryParams['startAge'] as any);
    }
    if (path.queryParams['endAge']) {
      this.endAge = (path.queryParams['endAge'] as any);
    }
    if (path.queryParams['view']) {
      this.currentView = path.queryParams['view'];
    }
    if (pathHasHistoricalValues) {
      this.generateReport();
    }
  }

  public storeReportParamsInUrl() {
    let path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      'endDate': this.endDate.toUTCString(),
      'startDate': this.startDate.toUTCString(),
      'gender': (this.gender ? this.gender : 'F,M' as any),
      'startAge': (this.startAge as any),
      'endAge': (this.endAge as any),
      'programUuids': this.programs as any,
      'view': this.currentView
    };

    this.location.replaceState(path.toString());
  }

  public formatGenderToSelectArray(genderParam: string) {
    if (genderParam.length > 1) {
      let arr = genderParam.split(',');
      _.each(arr, (gender) => {
        let id = gender;
        let text = gender === 'M' ? 'Male' : 'Female';
        let data = {
          id: id,
          text: text
        };
        this.selectedGender.push(data);
      });
    } else {
      let data = {
        id: genderParam,
        text: genderParam === 'M' ? 'Male' : 'Female'
      };
      this.selectedGender.push(data);
    }
  }

}
