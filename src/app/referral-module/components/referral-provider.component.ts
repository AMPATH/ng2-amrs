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

  constructor(
  private referralService: PatientReferralService,
  private defaultPropertiesService: UserDefaultPropertiesService) { }
  public ngOnInit(): void {
     let location = this.defaultPropertiesService.getCurrentUserDefaultLocationObject()
            || {};
     let user = this.defaultPropertiesService.getAuthenticatedUser()
            || {};
     let selectedLocationUuid = location.uuid || 'Default location not set';
     let startIndex = 0;
     let limit = 300;
     let referredBackStateUuid = 'cfdf6957-6e40-4f54-b179-2d6d6f84bb42';
     let stateUuids = referredBackStateUuid;
     // providerUuids = 'dced5363-4539-4692-88b8-018ea453a235',

    this.referralService.getUserProviderDetails(user)
      .then((provider) => {
        this.providerUuid = provider.uuid;
        this.loadReferralProviders(selectedLocationUuid, this.providerUuid,
          stateUuids, startIndex, limit);
      })
      .catch((error) => {
        this.errors.push({
          id: 'Referral Providers',
          message: 'error fetching current user provider information'
        });
      });
  }

 public ngOnDestroy(): void {
    if (this.providerReferralSub) {
      this.providerReferralSub.unsubscribe();
    }
  }




  public loadReferralProviders(locationUuid: string, providerUuids, stateUuids,
                               startIndex: number, limit: number) {

    this.resetVariables();
    if (locationUuid) {
      let params = { patientUuid: locationUuid };
      this.loadingReferralProviders = true;
      this.providerReferralSub = this.referralService.getReferalProviders(locationUuid,
      providerUuids, stateUuids, startIndex, limit)
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
  if ( this.showReferredList ) {
    this.showReferredList = false;
  } else {
    this.showReferredList = true;
  }
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
