import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CaseManagementResourceService } from './../../etl-api/case-management-resource.service';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Component({
  selector: 'case-management-filters',
  templateUrl: './case-management-filters.component.html',
  styleUrls: ['./case-management-filters.component.css']
})
export class CaseManagementFiltersComponent implements OnInit, OnChanges {
  public title = 'Case Management Report Filters';
  public params = {
    caseManagerUserId: [],
    hasCaseManager: '',
    hasPhoneRTC: '',
    dueForVl: '',
    elevatedVL: '',
    isNewlyEnrolled: '',
    minDefaultPeriod: '',
    maxDefaultPeriod: '',
    minFollowupPeriod: '',
    maxFollowupPeriod: '',
    rtcStartDate: '',
    rtcEndDate: '',
    phoneFollowUpStartDate: '',
    filterSet: false,
    locationUuid: ''
  };

  public showFilters = true;

  public locationParams = {};

  @Input() public clinicDashboardLocation: any;
  @Output() public filterReset = new EventEmitter();

  public caseManagers = [];
  public selectedCaseManager: any;
  public selectedCaseManagerIds = [];

  public dueForVl = '';
  public elevatedVL = '';
  public hasCaseManager: any;
  public hasPhoneRTC = '';
  public isNewlyEnrolled = '';
  public minFollowupPeriod = '';
  public maxFollowupPeriod = '';
  public minDefaultPeriod = '';
  public maxDefaultPeriod = '';
  public hideCaseManagerControl = false;
  public filterSet = false;
  public selecOptions = [
    {
      label: '',
      value: ''
    },
    {
      label: 'Yes',
      value: 'true'
    },
    {
      label: 'No',
      value: 'false'
    }
  ];

  public rtcStartDate = '';
  public rtcEndDate = '';
  public phoneFollowUpStartDate = '';
  public selectedRtcStartDate = '';
  public selectedRtcEndDate = '';
  public selectedPhoneFollowUpDate = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private caseManagementResourceService: CaseManagementResourceService
  ) {}

  public ngOnInit() {
    this.getCaseManagers().then((result) => {
      this.getParamsFromUrl();
    });
  }

  public ngOnChanges(change: SimpleChanges) {
    if (
      change.clinicDashboardLocation &&
      typeof change.clinicDashboardLocation.previousValue !== 'undefined'
    ) {
      this.getCaseManagers().then((result) => {
        this.selectedCaseManager = '';
        this.setParams();
      });
    }
  }

  public getCaseManagers(): Promise<any> {
    return new Promise((resolve, reject) => {
      const locationParams = this.getLocationParams();
      this.caseManagementResourceService
        .getCaseManagers(locationParams)
        .subscribe(
          (result: any) => {
            this.processCaseManagers(result.result);
            resolve('success');
          },
          (error) => {
            resolve(error);
          }
        );
    });
  }

  public getLocationParams() {
    return {
      locationUuid: this.clinicDashboardLocation
    };
  }

  public processCaseManagers(caseManagers) {
    const managers = [];
    _.each(caseManagers, (manager: any) => {
      managers.push({
        label: manager.person_name,
        value: manager.user_id
      });
    });

    this.caseManagers = managers;
  }

  public setFilters() {
    this.filterSet = true;
    this.setParams();
  }
  public setParams() {
    this.params = {
      caseManagerUserId: this.getCaseManagersIds(this.selectedCaseManager),
      dueForVl: this.dueForVl,
      elevatedVL: this.elevatedVL,
      hasCaseManager: this.hasCaseManager,
      hasPhoneRTC: this.hasPhoneRTC,
      isNewlyEnrolled: this.isNewlyEnrolled,
      minDefaultPeriod: this.minDefaultPeriod,
      maxDefaultPeriod: this.maxDefaultPeriod,
      maxFollowupPeriod: this.maxFollowupPeriod,
      minFollowupPeriod: this.minFollowupPeriod,
      rtcStartDate: this.selectedRtcStartDate,
      rtcEndDate: this.selectedRtcEndDate,
      phoneFollowUpStartDate: this.selectedPhoneFollowUpDate,
      filterSet: this.filterSet,
      locationUuid: this.clinicDashboardLocation
    };

    this.storeReportParamsInUrl(this.params);
  }

  public getCaseManagersIds(caseManagers: any) {
    const caseManagerIds = [];
    _.each(caseManagers, (caseManager: any) => {
      console.log();
      caseManagerIds.push(caseManager.value);
    });

    return caseManagerIds;
  }

  public getCaseManagersFromId(caseManagerIds: any) {
    const caseManagers: any = this.caseManagers;
    const caseManagerOptions = [];

    for (const caseManager of caseManagers) {
      for (let i = 0; i < caseManagerIds.length; i++) {
        if (caseManager.value === parseInt(caseManagerIds[i], 10)) {
          const managerOption = {
            label: caseManager.label,
            value: caseManager.value
          };
          caseManagerOptions.push(managerOption);
          break;
        }
      }
    }
    return caseManagerOptions;
  }

  public storeReportParamsInUrl(params) {
    this.router.navigate(['./'], {
      queryParams: params,
      relativeTo: this.route
    });
  }

  public getParamsFromUrl() {
    const urlParams: any = this.route.snapshot.queryParams;
    // only use filter data if filter had been set else use defaults
    if (urlParams.filterSet) {
      this.dueForVl = urlParams.dueForVl;
      this.hasCaseManager = urlParams.hasCaseManager;
      this.toggleCaseManagerControl(urlParams.hasCaseManager);
      this.hasPhoneRTC = urlParams.hasPhoneRTC;
      this.elevatedVL = urlParams.elevatedVL;
      this.isNewlyEnrolled = urlParams.isNewlyEnrolled;
      this.minFollowupPeriod = urlParams.minFollowupPeriod
        ? urlParams.minFollowupPeriod
        : '';
      this.maxFollowupPeriod = urlParams.maxFollowupPeriod
        ? urlParams.maxFollowupPeriod
        : '';
      this.minDefaultPeriod = urlParams.minDefaultPeriod
        ? urlParams.minDefaultPeriod
        : '';
      this.maxDefaultPeriod = urlParams.maxDefaultPeriod
        ? urlParams.maxDefaultPeriod
        : '';
      this.selectedCaseManager = urlParams.caseManagerUserId
        ? this.getCaseManagersFromId(urlParams.caseManagerUserId)
        : [];
      this.rtcStartDate = urlParams.rtcStartDate ? urlParams.rtcStartDate : '';
      this.selectedRtcStartDate = this.rtcStartDate;
      this.rtcEndDate = urlParams.rtcEndDate ? urlParams.rtcEndDate : '';
      this.selectedRtcEndDate = this.rtcEndDate;
      this.phoneFollowUpStartDate = urlParams.phoneFollowUpStartDate
        ? urlParams.phoneFollowUpStartDate
        : '';
      this.selectedPhoneFollowUpDate = this.phoneFollowUpStartDate;
    }
  }

  public onDueForVlChange($event) {
    this.dueForVl = $event;
  }
  public onElevatedVLChange($event) {
    this.elevatedVL = $event;
  }
  public onHasCaseManagerChange($event) {
    this.hasCaseManager = $event;
    this.toggleCaseManagerControl($event);
  }
  public onCaseManagerSelected($event) {
    this.selectedCaseManager = $event;
  }
  public toggleCaseManagerControl(hasCaseManager) {
    switch (hasCaseManager) {
      case 'true':
        this.hideCaseManagerControl = false;
        break;
      case 'false':
        this.hideCaseManagerControl = true;
        this.selectedCaseManager = '';
        break;
      default:
        this.hideCaseManagerControl = false;
        this.selectedCaseManager = '';
    }
  }
  public onHasPhoneRTCChange($event) {
    this.hasPhoneRTC = $event;
  }
  public onIsNewlyEnrolledChange($event) {
    this.isNewlyEnrolled = $event;
  }
  public toggleFiltersVisibility() {
    this.showFilters = !this.showFilters;
  }
  public getSelectedRtcStartDate($event) {
    this.rtcStartDate = $event;
    this.selectedRtcStartDate = Moment($event).format('YYYY-MM-DD');
  }

  public getSelectedRtcEndDate($event) {
    this.rtcEndDate = $event;
    this.selectedRtcEndDate = Moment($event).format('YYYY-MM-DD');
  }
  public getSelectedPhoneFollowUpStartDate($event) {
    this.phoneFollowUpStartDate = $event;
    this.selectedPhoneFollowUpDate = Moment($event).format('YYYY-MM-DD');
  }
  public resetFilters() {
    this.dueForVl = '';
    this.hasCaseManager = '';
    this.hasPhoneRTC = '';
    this.isNewlyEnrolled = '';
    this.elevatedVL = '';
    this.minFollowupPeriod = '';
    this.maxFollowupPeriod = '';
    this.minDefaultPeriod = '';
    this.maxDefaultPeriod = '';
    this.selectedCaseManager = '';
    this.rtcStartDate = '';
    this.selectedRtcStartDate = '';
    this.rtcEndDate = '';
    this.selectedRtcEndDate = '';
    this.phoneFollowUpStartDate = '';
    this.selectedPhoneFollowUpDate = '';
    this.filterSet = false;
    this.hideCaseManagerControl = false;
    this.filterReset.emit(true);
    this.setParams();
  }
}
