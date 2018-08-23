import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { MdCheckboxChange } from '@angular/material';

import * as _ from 'lodash';
import * as moment from 'moment';

import { UserService } from '../../../openmrs-api/user.service';
import {
  UserDefaultPropertiesService
} from '../../../user-default-properties/user-default-properties.service';
import { User } from '../../../models/user.model';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { RetrospectiveDataEntryService } from '../../services/retrospective-data-entry.service';
import { PatientService } from '../../../patient-dashboard/services/patient.service';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'retrospective-data-entry-settings',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class RetrospectiveSettingsComponent implements OnInit, OnDestroy {
  @Input() public modalMode: boolean;
  @Input() public bannerMode: boolean;
  @Input() public dashboardMode: boolean;
  @Output() public onSettingsChange: EventEmitter<boolean> = new EventEmitter();
  public user: User;
  public providers: Array<any> = [];
  public currentLocation: any;
  public enableRetro: boolean = false;
  public isLoading: boolean = false;
  public providerLoading: boolean = false;
  public visitDate: string;
  public visitTime: string = '04:44:44';
  public visitTimeState: number = 0;
  public maxDate: string;
  public provider: any;
  public suggest = new Subject<any>();
  public location: any;
  public locations: Array<any> = [];
  public error: any;

  constructor(private router: Router,
              private propertyLocationService: UserDefaultPropertiesService,
              private providerResourceService: ProviderResourceService,
              private localStorageService: LocalStorageService,
              private retrospectiveDataEntryService: RetrospectiveDataEntryService,
              private patientService: PatientService,
              private cdRef: ChangeDetectorRef,
              private userService: UserService) {
    this.user = this.userService.getLoggedInUser();
    this.maxDate = moment().format('YYYY-MM-DD');
    this.visitDate = moment().format('YYYY-MM-DD');
  }

  public ngOnInit() {
    this.enableRetro = this.localStorageService.getItem('enableRetro') === 'true';
    this.currentLocation = this.propertyLocationService.getCurrentUserDefaultLocationObject();
    this._init();
  }

  public ngOnDestroy() {
    this.cdRef.detach();
    this.suggest.unsubscribe();
  }

  public fetchLocationOptions() {
    this.propertyLocationService.getLocations().map((response: Response) => {
      return response.json();
    }).subscribe((locations: any) => {
      this.locations = locations.results.map((location: any) => {
        if (!_.isNil(location.display)) {
          return this.retrospectiveDataEntryService.mappedLocation(location);
        }
      });
    });
  }

  public fetchProviderOptions(term: string = null) {
    if (!_.isNull(term)) {
      this.providers = [];
      this.providerLoading = true;
    }

    let findProvider = this.providerResourceService.searchProvider(term, false);
    findProvider.subscribe(
      (providers) => {
        this.processProviders(providers);
      },
      (error) => {
        console.error(error); // test case that returns error
      }
    );
    return findProvider;
  }

  public saveRetroState(state: MdCheckboxChange) {
    this.enableRetro = state.checked;
    this.retrospectiveDataEntryService.updateProperty('enableRetro', state.checked);
    if (!this.enableRetro) {
      this.retrospectiveDataEntryService.resetRetroSettings();
    }
  }

  public onDateChanged(date) {
    this.visitDate = date;
    if (!_.isNil(date)) {
      this.updateErrorState({visitDate : false});
      this.retrospectiveDataEntryService.updateProperty('retroVisitDate', date);
    } else {
        this.updateErrorState({visitDate : true});
    }
  }

  public onTimeStateChanged(state) {
    this.visitTime = state === '1' ? '' : '04:44:44';
    this.retrospectiveDataEntryService.updateProperty('retroVisitTimeState', state);
    this.retrospectiveDataEntryService.updateProperty('retroVisitTime', this.visitTime);
  }

  public onTimeChanged(time) {
    this.retrospectiveDataEntryService.updateProperty('retroVisitTime', time);
  }

  public changeSettings(state: boolean) {
    if (this.enableRetro) {
      this.validateSettings(state);
    } else {
      this.onSettingsChange.emit(state);
      if (this.dashboardMode) {
        this.isLoading = true;
        this.router.navigate(['patient-dashboard/patient-search']);
      }
    }

  }

  public validateSettings(state) {
    let error = {};
    if (_.isNil(this.provider)) {
      error['provider'] = true;
    }
    if (_.isNil(this.visitDate)) {
      error['visitDate'] = true;
    }

    if (!_.isEmpty(error)) {
      this.updateErrorState(error);
    } else {
      this.onSettingsChange.emit(state);
      if (this.dashboardMode) {
        this.isLoading = true;
        this.router.navigate(['patient-dashboard/patient-search']);
      }
    }
  }

  public updateErrorState(error) {
    this.retrospectiveDataEntryService.updateProperty('errorState',
      error ? JSON.stringify(error) : null);
  }

  public saveProvider(provider) {
    this.providerLoading = false;
    // this.suggest.next('');
    this.retrospectiveDataEntryService.updateProperty('retroProvider',
      JSON.stringify(provider));
    this.updateErrorState({provider : false});
  }

  public select(item) {
    this.retrospectiveDataEntryService.updateProperty('retroLocation',
      JSON.stringify(item.locations));
  }

  private processProviders(providers) {
    this.providerLoading = false;
    let filtered = _.filter(providers, (p: any) => {
      return !_.isNil(p.person);
    });
    this.providers = filtered.map((p: any) => {
      return {
        value: p.uuid,
        label: p.display,
        providerUuid: p.uuid
      };
    });
  }

  private _init() {
    this.isLoading = false;
    this.propertyLocationService.locationSubject.subscribe((item: any) => {
      if (item) {
        if (this.enableRetro) {
          let retroLocation = this.retrospectiveDataEntryService
            .mappedLocation(this.currentLocation);
          this.retrospectiveDataEntryService.updateProperty('retroLocation',
            JSON.stringify(retroLocation));
          this.location = retroLocation;
        }
        this.currentLocation = JSON.parse(item);
      }
    });
    this.retrospectiveDataEntryService.retroSettings.subscribe((retroSettings) => {
      if (retroSettings && retroSettings.enabled) {
        if (!_.isNull(retroSettings.error)) {
          this.error = JSON.parse(retroSettings.error);
        } else {
          this.error = null;
        }
        this.location = retroSettings.location;
        this.provider = retroSettings.provider;

        this.visitDate = retroSettings.visitDate;
        this.visitTime = retroSettings.visitTime;
        this.visitTimeState = retroSettings.visitTimeState;
        this.localStorageService.setItem('retroVisitDate',
          this.visitDate);
        let retroLocation = this.retrospectiveDataEntryService
          .mappedLocation(this.currentLocation);
        if (!_.isNull(this.location) && !_.isEmpty(this.location)) {
          retroLocation = this.location;
        }
        this.localStorageService.setItem('retroLocation',
          JSON.stringify(retroLocation));
      }
      this.fetchProviderOptions();
      this.fetchLocationOptions();

      this.suggest.debounceTime(500)
        .switchMap((term) => this.providerResourceService.searchProvider(term))
        .subscribe((data) => {
          this.processProviders(data);
          this.cdRef.detectChanges();
        });

      /*this.suggest.debounceTime(200).distinctUntilChanged().subscribe((term) => {
        if (!_.isNull(term)) {
            this.fetchProviderOptions(term);
        }
      }, () => {}, () => {
        console.log('============>');
        this.suggest.complete();
      });*/
    });
  }

}
