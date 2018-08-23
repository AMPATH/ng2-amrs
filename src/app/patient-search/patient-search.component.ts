import { Component, OnInit, OnDestroy, DoCheck
  , Output, Input, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PatientSearchService } from './patient-search.service';
import { Patient } from '../models/patient.model';
import { Subscription } from 'rxjs';
import { AppFeatureAnalytics } from '../shared/app-analytics/app-feature-analytics.service';
import {
  UserDefaultPropertiesService
} from
  '../user-default-properties/user-default-properties.service';
import {
  PatientReferralService
} from
  '../referral-module/services/patient-referral-service';
import * as Moment from 'moment';
import { Location } from '@angular/common';
@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.css'],
})

export class PatientSearchComponent implements OnInit, OnDestroy {
  public patients: Patient[];
  public referred: any[] = [];
  public referredBack: any[] = [];
  public errors: any[] = [];
  public isResetButton: boolean = true;
  public totalPatients: number;
  public isLoading: boolean = false;
  public dataLoaded: boolean = false;
  public hasConductedSearch = false;
  public page: number = 1;
  public adjustInputMargin: string = '240px';
  public subscription: Subscription;
  public referralSubscription: Subscription;
  public title: string = 'Patient Search';
  public errorMessage: string = '';
  public noMatchingResults: boolean = false;
  public loadingReferralProviders: boolean = false;
  public lastSearchString: string = '';
  public providerUuid: string = '';

  /*
   patientSelected emits the patient object
   to other components so they can use
   the selected patient

   The hide Result property is passed down
   from parent to child to hide results of
   patient search

  */
  @Output() public patientSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() public hideResults: boolean = false;
  @Input() public hideRegistration: boolean = false;

  private _searchString: string;
  public get searchString(): string {
    return this._searchString;
  }
  public set searchString(v: string) {
    this._searchString = v;
    this.hasConductedSearch = false;
  }

  private endDate: any;
  private startDate: any;
  private locationUuids: any;
  private providerUuids: any;
  private REFER_CONCEPT_UUID = '0c5565c5-45cf-40ab-aa6d-5694aeabae18';
  private REFERBACK_CONCEPT_UUID = '15977097-13b7-4186-80a7-a78535f27866';
  constructor(private patientSearchService: PatientSearchService,
              private route: ActivatedRoute,
              private appFeatureAnalytics: AppFeatureAnalytics,
              private defaultPropertiesService: UserDefaultPropertiesService,
              private referralService: PatientReferralService,
              private location: Location,
              private router: Router) {
  }

  public ngOnInit() {
    this.getPatientReferrals(this.REFER_CONCEPT_UUID);
    this.getPatientReferrals(this.REFERBACK_CONCEPT_UUID);
    if (window.innerWidth <= 768) {
      this.adjustInputMargin = '0';
    }
    this.route.queryParams.subscribe((params) => {
      if (params['reset'] !== undefined) {
        this.resetSearchList();
      } else {
        // load cached result
        this.errorMessage = '';
        this.patientSearchService.patientsSearchResults.subscribe(
          (patients) => {
            this.onResultsFound(patients);
          },
          (error) => {
            this.onError(error);
          }
        );
      }
    });
  }

  public ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.referralSubscription) {
      this.referralSubscription.unsubscribe();
    }
  }

  public onResultsFound(results) {
    if (results.length > 0) {
      this.patients = results;
      this.totalPatients = this.patients.length;
      this.hideResults = false;
    } else {
      this.patients = [];
      this.totalPatients = 0;
      this.hideResults = true;
    }
    // clear the search text
    this.searchString = '';
    this.hasConductedSearch = true;
  }

  public onError(error) {
    this.isLoading = false;
    this.resetInputMargin();
    console.error('error', error);
    this.errorMessage = error;
    this.hasConductedSearch = false;
  }

  public loadPatient(): void {
    this.totalPatients = 0;
    if (this.subscription) {
       this.subscription.unsubscribe();
    }
    if (this.searchString && this.searchString.length > 2) {
      if (window.innerWidth > 768) {
        this.adjustInputMargin = '267px';
      }
      this.isLoading = true;
      this.patients = [];
      this.errorMessage = '';
      this.subscription = this.patientSearchService.searchPatient(this.searchString, false)
        .subscribe(
        (data) => {
          this.isLoading = false;
          const searchTerm = this.searchString;
          this.onResultsFound(data);
          if (data.length === 0) {
            this.noMatchingResults = true;
            this.lastSearchString = searchTerm;
          }
          this.resetInputMargin();
          // app feature analytics
          this.appFeatureAnalytics
            .trackEvent('Patient Search', 'Patients Searched', 'loadPatient');

        },
        (error) => {
          this.onError(error);
        }
        );

      this.isResetButton = true;
    }
  }

  public updatePatientCount(search) {
    if (this.totalPatients > 0 && search.length > 0) {
        this.totalPatients = 0;

    }
    this.noMatchingResults = false;
  }

  public selectPatient(patient) {
      this.patientSelected.emit(patient);
      this.hideResults = true;
  }

  public resetSearchList() {
    this.hideResults = true;
    this.patientSearchService.resetPatients();
    this.searchString = '';
    this.totalPatients = 0;
    this.isResetButton = false;
    this.isLoading = false;
    this.hasConductedSearch = false;
    this.resetInputMargin();
    this.noMatchingResults = false;
  }

  public tooltipStateChanged(state: boolean): void {
    // console.log(`Tooltip is open: ${state}`);
  }

  public resetInputMargin() {
    if (window.innerWidth > 768) {
      this.adjustInputMargin = '240px';
    }
  }

  public loadReferredData() {
    this.router.navigate(['/provider-dashboard'],
    {queryParams: {
      'endDate': this.endDate,
      'startDate': this.startDate,
      'locationUuids': (this.locationUuids as any),
      'stateUuids': this.REFER_CONCEPT_UUID,
      'urlSource': 'REFER'
    }});
    // this.referralService.setUrlSource('REFER');
  }
  public loadReferredBackData() {
    this.router.navigate(['/provider-dashboard'],
    {queryParams: {
      'endDate': this.endDate,
      'startDate': this.startDate,
      'providerUuids': (this.providerUuids as any),
      'stateUuids': this.REFERBACK_CONCEPT_UUID,
      'urlSource': 'REFERBACK'
    }});
  }

  private getPatientReferrals( referalType: any) {
    let location = this.defaultPropertiesService.getCurrentUserDefaultLocationObject()
            || {};
    let selectedLocationUuid = location.uuid || 'Default location not set';
    let user = this.defaultPropertiesService.getAuthenticatedUser()
            || {};

    this.referralService.getUserProviderDetails(user)
      .then((provider) => {
        this.providerUuid = provider.uuid;
        let currentDateMoment = Moment(new Date());
        let endDate =  currentDateMoment.format('YYYY-MM-DD');
        let startDate = currentDateMoment.add(-1, 'M').format('YYYY-MM-DD');

        let params = this.getRequestParams(referalType, this.providerUuid,
           selectedLocationUuid, startDate, endDate);
        this.referralSubscription = this.referralService.getProviderReferralPatientList(params)
          .subscribe(
            (referralData) => {
              this.loadingReferralProviders = false;
              if (referralData.length >= 1) {
                 if (referalType === this.REFERBACK_CONCEPT_UUID) {
                  this.referredBack = referralData;
                 }

                 if (referalType === this.REFER_CONCEPT_UUID) {
                  this.referred = referralData;
                 }
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
      })
      .catch((error) => {
        this.errors.push({
          id: 'Referral Providers',
          message: 'error fetching current user provider information'
        });
      });

  }

  private getRequestParams(referalType, provider, location, startDate, endDate) {
    let params = {
      endDate: endDate,
      locationUuids: location,
      startDate: startDate,
      providerUuids: provider,
      stateUuids: referalType
    };

    if (referalType === this.REFER_CONCEPT_UUID) {
      // do not filter by provider when getting referred patients
      delete params['providerUuids'];
      this.locationUuids = location;
    }

    if (referalType === this.REFERBACK_CONCEPT_UUID) {
      // do not filter by location when getting referred back patients
      delete params['locationUuids'];
      this.providerUuids = provider;
    }
    this.startDate = startDate;
    this.endDate = endDate;
    return params;
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
