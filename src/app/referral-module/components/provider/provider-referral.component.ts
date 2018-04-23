import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from 'lodash';

import {
  PatientReferralBaseComponent
} from '../../patient-referral/patient-referral-report-base.component';
import {
  PatientReferralResourceService
} from '../../../etl-api/patient-referral-resource.service';
import {
  DataAnalyticsDashboardService
} from '../../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import * as Moment from 'moment';
import { UserDefaultPropertiesService } from '../../../user-default-properties';
import { PatientReferralService } from '../../services/patient-referral-service';

@Component({
  selector: 'provider-referrals',
  templateUrl: '../../patient-referral/referral-report-base.component.html'
})
export class ProviderReferralComponent extends PatientReferralBaseComponent
  implements OnInit {
  public data = [];
  public errors = [];
  public sectionsDef = [];
  public programName: any;
  public enabledControls = 'locationControl,datesControl,programWorkFlowControl';
  constructor(public patientReferralResourceService: PatientReferralResourceService,
              private route: ActivatedRoute, private location: Location,
              private router: Router,
              private defaultPropertiesService: UserDefaultPropertiesService,
              private referralService: PatientReferralService,
              public dataAnalyticsDashboardService: DataAnalyticsDashboardService
            ) {
    super(patientReferralResourceService, dataAnalyticsDashboardService);

  }

  public ngOnInit() {
    this.loadReportParamsFromUrl();
  }
  public test() {

  }

  public generateReport() {

    let user = this.defaultPropertiesService.getAuthenticatedUser()
    || {};
    this.referralService.getUserProviderDetails(user)
    .then((provider) => {
      this.provider = provider.uuid;
      this.getLocationsSelected();
      this.storeReportParamsInUrl();
      super.generateReport();
    })
    .catch((error) => {
    this.errors.push({
      id: 'Referral Providers',
      message: 'error fetching current user provider information'
    });
    });

  }

  public loadReportParamsFromUrl() {
    let path = this.router.parseUrl(this.location.path());
    let pathHasHistoricalValues = path.queryParams['startDate'] &&
      path.queryParams['endDate'];

    if (path.queryParams['startDate']) {
      this.startDate = new Date(path.queryParams['startDate']);
    }

    if (path.queryParams['endDate']) {
      this.endDate = new Date(path.queryParams['endDate']);
    }
    if (path.queryParams['gender']) {
      this.gender = (path.queryParams['gender'] as any);
      this.formatGenderToSelectArray(path.queryParams['gender']);
    }
    if (path.queryParams['startAge'] && this.startAge) {
      this.startAge = (path.queryParams['startAge'] as any);
    }
    if (path.queryParams['endAge']) {
      this.endAge = (path.queryParams['endAge'] as any);
    }
    if (path.queryParams['programUuids']) {
      this.programs = path.queryParams['programUuids'];

    }
    if (path.queryParams['stateUuids']) {
      this.states = path.queryParams['stateUuids'];
    }
    if (path.queryParams['providerUuids']) {
      this.provider = path.queryParams['providerUuids'];
    }
    if (path.queryParams['locationUuids']) {
      this.locationUuids = [path.queryParams['locationUuids']];
    }
    delete path.queryParams['gender'];
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
      'endAge': this.endAge ? (this.endAge as any) : null,
      'programUuids': (this.programs as any),
      'stateUuids': (this.states as any),
      'providerUuids': (this.provider as any),
      'locationUuids': (this.locationUuids as any)
    };

    if (!this.states) {
      delete path.queryParams['stateUuids'];
    }
    if (!this.programs) {
      delete path.queryParams['programUuids'];
    }
    if (!this.startAge) {
      delete path.queryParams['startAge'];
    }
    if (!this.endAge) {
      delete path.queryParams['endAge'];
    }
    if (!this.provider) {
      delete path.queryParams['providerUuids'];
    }
    if (!this.gender) {
      delete path.queryParams['gender'];
    }

    if (!this.locationUuids) {
      delete path.queryParams['locationUuids'];
    }
    this.location.replaceState(path.toString());
  }
  public getLocationsSelected() {
    this.dataAnalyticsDashboardService.getSelectedLocations().subscribe(
      (data)  => {
        if (data) {
          this.locationUuids = data.locations;
        }

      });
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

  public formatProgramsToSelectArray(indicatorParam: string) {
    console.log('program to this.programName', this.programName);

    let arr = indicatorParam.split(',');
    _.each(arr, (program) => {
      let text = this.translateIndicator(program);
      let id = program;

      let data = {
        id: id,
        text: 'BSG'
      };

    });
  }

  public translateIndicator(indicator: string) {
    return indicator.toLowerCase().split('_').map((word) => {
      return (word.charAt(0) + word.slice(1));
    }).join(' ');
  }

}
