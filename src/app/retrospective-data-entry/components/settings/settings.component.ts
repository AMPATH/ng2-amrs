import { switchMap } from 'rxjs/operators';

import { debounceTime } from 'rxjs/operators';

import { take } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCheckboxChange } from '@angular/material';

import * as _ from 'lodash';
import * as moment from 'moment';

import { UserService } from '../../../openmrs-api/user.service';
import { UserDefaultPropertiesService } from '../../../user-default-properties/user-default-properties.service';
import { User } from '../../../models/user.model';
import { ProviderResourceService } from '../../../openmrs-api/provider-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { RetrospectiveDataEntryService } from '../../services/retrospective-data-entry.service';
// import { PatientService } from '../../../patient-dashboard/services/patient.service';
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
  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onSettingsChange: EventEmitter<boolean> = new EventEmitter();
  public user: User;
  public providers: Array<any> = [];
  public currentLocation: any;
  public enableRetro = false;
  public isLoading = false;
  public providerLoading = false;
  public visitDate: string;
  public visitTime = '04:44:44';
  public visitTimeState = 0;
  public maxDate: string;
  public provider: any;
  public suggest = new Subject<any>();
  public location: any;
  public locations: Array<any> = [];
  public error: any;
  public settingMethod: string;
  public locationUuid: String;
  public group: String;

  constructor(
    private router: Router,
    private propertyLocationService: UserDefaultPropertiesService,
    private providerResourceService: ProviderResourceService,
    private localStorageService: LocalStorageService,
    private retrospectiveDataEntryService: RetrospectiveDataEntryService,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.user = this.userService.getLoggedInUser();
    this.maxDate = moment().format('YYYY-MM-DD');
    this.visitDate = moment().format('YYYY-MM-DD');
  }

  public ngOnInit() {
    this.locationUuid = this.route.snapshot.paramMap.get('location');
    this.group = this.route.snapshot.paramMap.get('group');
    this.enableRetro =
      this.localStorageService.getItem('enableRetro') === 'true';
    this.currentLocation = this.propertyLocationService.getCurrentUserDefaultLocationObject();
    this._init();
  }

  public ngOnDestroy() {
    this.cdRef.detach();
    this.suggest.unsubscribe();
  }

  public fetchLocationOptions() {
    this.propertyLocationService
      .getLocations()
      .pipe(take(1))
      .subscribe((locations: any) => {
        this.locations = locations.results.map((location: any) => {
          if (!_.isNil(location.display)) {
            return this.retrospectiveDataEntryService.mappedLocation(location);
          }
        });
      });
  }

  public fetchProviderOptions(term: string = '') {
    if (!_.isNull(term)) {
      this.providers = [];
      this.providerLoading = true;
    }

    const findProvider = this.providerResourceService.searchProvider(
      term,
      false
    );
    findProvider.pipe(take(1)).subscribe(
      (providers) => {
        this.processProviders(providers);
      },
      (error) => {
        console.error(error); // test case that returns error
      }
    );
    return findProvider;
  }

  public saveRetroState(state: MatCheckboxChange) {
    this.enableRetro = state.checked;
    this.retrospectiveDataEntryService.updateProperty(
      'enableRetro',
      state.checked
    );
    if (!this.enableRetro) {
      this.retrospectiveDataEntryService.resetRetroSettings();
    }
  }

  public onDateChanged(date) {
    this.visitDate = date;
    if (!_.isNil(date)) {
      this.updateErrorState({ visitDate: false });
      this.retrospectiveDataEntryService.updateProperty('retroVisitDate', date);
    } else {
      this.updateErrorState({ visitDate: true });
    }
  }

  public onTimeStateChanged(state) {
    this.visitTime = state === '1' ? '' : '04:44:44';
    this.retrospectiveDataEntryService.updateProperty(
      'retroVisitTimeState',
      state
    );
    this.retrospectiveDataEntryService.updateProperty(
      'retroVisitTime',
      this.visitTime
    );
  }

  public onTimeChanged(time) {
    this.retrospectiveDataEntryService.updateProperty('retroVisitTime', time);
  }

  public changeSettings(state: boolean, method: string) {
    this.settingMethod = method;
    if (this.enableRetro) {
      this.confirmRetroSettings(state);
    } else {
      this.onSettingsChange.emit(state);
      if (this.dashboardMode) {
        this.isLoading = true;
        this.navigateToPatientSearch();
      }
    }
  }

  public navigateToPatientSearch() {
    if (this.route.snapshot.paramMap.get('navigateToGroupVisit')) {
      this.router.navigate([
        `clinic-dashboard/${this.locationUuid}/hiv/group-manager/group/${this.group}`
      ]);
    } else {
      this.router.navigate(['patient-dashboard/patient-search']);
    }
  }

  public validateRetroSetting() {
    const error = {};
    if (_.isNil(this.provider)) {
      error['provider'] = true;
    }
    if (_.isNil(this.visitDate)) {
      error['visitDate'] = true;
    }
    return error;
  }

  public confirmRetroSettings(state) {
    const error = this.validateRetroSetting();
    if (!_.isEmpty(error)) {
      this.updateErrorState(error);
      if (this.settingMethod === 'update') {
        this.emitRetroState(state);
      }
    } else {
      this.onSettingsChange.emit(state);
      if (this.dashboardMode) {
        this.isLoading = true;
        this.navigateToPatientSearch();
      }
    }
  }

  public emitRetroState(state) {
    this.onSettingsChange.emit(state);
  }

  public updateErrorState(error) {
    this.retrospectiveDataEntryService.updateProperty(
      'errorState',
      error ? JSON.stringify(error) : null
    );
  }

  public saveProvider(provider) {
    this.providerLoading = false;
    this.retrospectiveDataEntryService.updateProperty(
      'retroProvider',
      JSON.stringify(provider)
    );
    this.updateErrorState({ provider: false });
  }

  public select(item) {
    this.retrospectiveDataEntryService.updateProperty(
      'retroLocation',
      JSON.stringify(item.locations)
    );
  }

  private processProviders(providers) {
    this.providerLoading = false;
    const filtered = _.filter(providers, (p: any) => {
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
    this.propertyLocationService.locationSubject
      .pipe(take(1))
      .subscribe((item: any) => {
        if (item) {
          if (this.enableRetro) {
            this.setLocation();
          }
          this.currentLocation = JSON.parse(item);
        }
      });
    this.retrospectiveDataEntryService.retroSettings.subscribe(
      (retroSettings) => {
        if (retroSettings && retroSettings.enabled) {
          this.setRetroSettings(retroSettings);
        }
        this.fetchProviderOptions();
        this.fetchLocationOptions();
        if (this.suggest) {
          this.suggest
            .pipe(
              debounceTime(500),
              switchMap((term) =>
                this.providerResourceService.searchProvider(term)
              )
            )
            .subscribe((data) => {
              this.processProviders(data);
              this.cdRef.detectChanges();
            });
        }
      }
    );
  }

  private setLocation() {
    const retroLocation = this.retrospectiveDataEntryService.mappedLocation(
      this.currentLocation
    );
    this.retrospectiveDataEntryService.updateProperty(
      'retroLocation',
      JSON.stringify(retroLocation)
    );
    this.location = retroLocation;
  }

  private setRetroSettings(retroSettings) {
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
    this.localStorageService.setItem('retroVisitDate', this.visitDate);
    let retroLocation = this.retrospectiveDataEntryService.mappedLocation(
      this.currentLocation
    );
    if (!_.isNull(this.location) && !_.isEmpty(this.location)) {
      retroLocation = this.location;
    }
    this.localStorageService.setItem(
      'retroLocation',
      JSON.stringify(retroLocation)
    );
  }
}
