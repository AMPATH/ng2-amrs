import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../../models/patient.model';

import { Subscription } from 'rxjs';
import { PatientReferralService } from '../services/patient-referral-service';
import {
  UserDefaultPropertiesService
} from
  '../../user-default-properties/user-default-properties.service';
@Component({
  selector: 'referral-provider',
  templateUrl: './referral-provider.component.html',
  styleUrls: ['referral-provider.component.css']
})
export class ReferralProviderComponent implements OnInit, OnDestroy {
  public errors: any[] = [];
  public referrals: any[] = [];
  public providerReferralSub: Subscription;
  public loadingReferralProviders: boolean = false;
  public dataLoaded: boolean = false;
  public providerUuid: string = '';
  public closeNotificationDetails: boolean = false;
  public showReferredList: boolean = false;
  private _startDate;
  private _endDate;
  private _selectedLocations;
  private _selectedPrograms;
  private _selectedWorkFlowStates;
  private _startIndex = 0;
  private _limit = 300;
  constructor(
    private referralService: PatientReferralService,
    private defaultPropertiesService: UserDefaultPropertiesService) { }
    public ngOnInit(): void {
    let location = this.defaultPropertiesService.getCurrentUserDefaultLocationObject()
      || {};
    let selectedLocationUuid = location.uuid || 'Default location not set';
    let startIndex = 0;
    let limit = 300;
    let referredBackStateUuid = 'cfdf6957-6e40-4f54-b179-2d6d6f84bb42';
    let stateUuids = referredBackStateUuid;
  }

  public ngOnDestroy(): void {
    if (this.providerReferralSub) {
      this.providerReferralSub.unsubscribe();
    }
  }

  public loadReferralProviders(startDate, endDate, locations, programs, workFlowStates, provider,
                               startIndex, limit) {
    this.resetVariables();
    if (provider) {
      this.loadingReferralProviders = true;
      this.providerReferralSub = this.referralService.getReferalProviders(startDate,
         endDate, locations, programs, workFlowStates, provider,
        startIndex, limit)
        .subscribe(
        (referralData) => {
          this.loadingReferralProviders = false;

          if (referralData) {
            this.referrals = referralData;
            this.dataLoaded = true;
          } else {
            this.dataLoaded = false;
          }

        },
        (error) => {
          this.loadingReferralProviders = false;
          this.dataLoaded = true;
          this.errors.push({
            id: 'Referral Providers',
            message: 'error fetching referral providers'
          });
        }
        );
    }
  }

  public resetVariables() {
    this.referrals = [];
    this.dataLoaded = false;
    this.loadingReferralProviders = false;
  }

  public dissmissNotification(status) {
    this.closeNotificationDetails = status;
  }
  public viewReferredList() {
    if (this.showReferredList) {
      this.showReferredList = false;
    } else {
      this.showReferredList = true;
    }
  }

  public selectedStartDate(event) {
    this._startDate = event;
  }
  public selectedEndDate(event) {
    this._endDate = event;
  }
  public selectedPrograms(programs: any ) {
    if (!programs || programs.length === 0) {
      return '';
    }
    let selectedPrograms = '';
    for (let i = 0; i < programs.length; i++) {
      if (i === 0) {
        selectedPrograms = selectedPrograms + programs[0].id;
      } else {
        selectedPrograms = selectedPrograms + ',' + programs[i].id;
      }
    }
    this._selectedPrograms = selectedPrograms;
  }
  public selectedWorkFlowStates(workflows: any) {
    if (!workflows || workflows.length === 0) {
      return '';
    }
    let selectedWorkFlows = '';
    for (let i = 0; i < workflows.length; i++) {
      if (i === 0) {
        selectedWorkFlows = selectedWorkFlows + workflows[0].id;
      } else {
        selectedWorkFlows = selectedWorkFlows + ',' + workflows[i].id;
      }
    }
    this._selectedWorkFlowStates = selectedWorkFlows;
  }
  public selectedLocations(event) {
      if (!event || event.locations.length === 0) {
        return '';
      }
      let selectedLocations = '';
      for (let i = 0; i < event.locations.length; i++) {
        if (i === 0) {
          selectedLocations = selectedLocations + event.locations[0];
        } else {
          selectedLocations = selectedLocations + ',' + event.locations[i];
        }
      }
      this._selectedLocations = selectedLocations;

  }
  public displayProviderReferrals(event) {
    console.log('clicked Me to display report ', this._startDate);
    let user = this.defaultPropertiesService.getAuthenticatedUser()
    || {};

    this.referralService.getUserProviderDetails(user)
      .then((provider) => {
        this.providerUuid = provider.uuid;
        this.loadReferralProviders(
          this._startDate,
          this._endDate,
          this._selectedLocations,
          this._selectedPrograms,
          this._selectedWorkFlowStates,
          this.providerUuid, this._startIndex, this._limit);
      })
      .catch((error) => {
        this.errors.push({
          id: 'Referral Providers',
          message: 'error fetching current user provider information'
        });
      });
  }

  public extraColumns() {
    return [
      {
        headerName: 'Program',
        field: 'program_name',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Location',
        field: 'location_name',
        width: 160,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'State',
        field: 'state_name',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      }
    ];
  }
  private getCurrentProvider(user: any) {
    if (user) {
      this.referralService.getUserProviderDetails(user)
        .then((provider) => {
          this.providerUuid = provider.uuid;
        })
        .catch((error) => {
          this.errors.push({
            id: 'Referral Providers',
            message: 'error fetching current user provider information'
          });
        });
    }
  }
}
