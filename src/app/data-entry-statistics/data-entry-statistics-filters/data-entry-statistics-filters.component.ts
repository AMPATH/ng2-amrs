import { take } from 'rxjs/operators';
import {
  Component, OnInit, OnDestroy, AfterViewInit, Output,
  EventEmitter, ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { UserService } from '../../openmrs-api/user.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { DataEntryStatisticsService } from '../../etl-api/data-entry-statistics-resource.service';
import { VisitResourceService} from '../../openmrs-api/visit-resource.service';
import { PatientProgramResourceService } from './../../etl-api/patient-program-resource.service';

@Component({
  selector: 'data-entry-statistics-filters',
  templateUrl: './data-entry-statistics-filters.component.html',
  styleUrls: ['./data-entry-statistics-filters.component.css']
})
export class DataEntryStatisticsFiltersComponent
  implements OnInit, OnDestroy, AfterViewInit {

  @Output() public filterParams: any = new EventEmitter<string>();
  @Output() public viewSelected: any = new EventEmitter<string>();
  @Output() public filterReset: any = new EventEmitter<boolean>();
  public sendRequest = true;
  public today: any = Moment().format();
  public params: any = [];
  public gridOptions: any = {
    enableColResize: true,
    enableSorting: true,
    enableFilter: true,
    showToolPanel: false,
    pagination: true,
    paginationPageSize: 300
  };
  public views: any = [];
  public view: any = [];
  public showFilters = true;
  public locations: any = [];
  public location: any = [];
  public filtersCount = 0;
  public locationMap = new Map();
  public creators: any[];
  public creator: any = [];
  public encounterType: any = [];
  public encounterTypes: any = [];
  public encounterMap = new Map();
  public visitType: any = [];
  public visitTypes: any = [];
  public visitMap = new Map();
  public visitNamesMap = new Map();
  public visitEncounterMap = new Map();
  public providers: any = [];
  public provider = '';
  public selectedStartDate: any = Moment().format();
  public selectedEndDate: any = Moment(this.selectedStartDate).add(6, 'days').format();
  public subType = '';
  public groupBy: any = ['groupByLocationId', 'groupByDate', 'groupByEncounterTypeId'];
  public selectedLocation: any = [];
  public selectedCreatorUuid: any = [];
  public selectedProviderUuid = '';
  public selectedEncounterTypes: any = [];
  public selectedVisitTypes: any = [];
  public selectedVisitUuid: any = [];
  public selectedView = {
    encounterTypePerDay: false,
    encounterTypePerMonth: false,
    encounterTypePerProvider: false,
    encounterTypePerCreator: false
  };
  public selectedViewType = '';
  public viewMap = new Map();
  public locationDropdownSettings: any = {
    'singleSelection': false,
    'text': 'Select or enter to search',
    'selectAllText': 'Select All',
    'unSelectAllText': 'UnSelect All',
    'enableSearchFilter': true,
    'enableCheckAll': false
  };
  public statsDropdownSettings: any = {
    singleSelection: true,
    text: 'Select or enter to search',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true
  };
  public singleSelectDropDownSettings: any = {
    singleSelection: true,
    text: 'Select or enter to search',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    enableCheckAll: false
  };

  public multpleSelectDropDownSettings: any = {
    singleSelection: false,
    text: 'Select or enter to search',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    enableCheckAll: false,
    badgeShowLimit: 10
  };

  public dropdownSettings: any = {
    'singleSelection': false,
    'text': 'Select or enter to search',
    'selectAllText': 'Select All',
    'unSelectAllText': 'UnSelect All',
    'enableSearchFilter': true,
    'enableCheckAll': true
  };

  public displayMsg: any = { 'show': false, 'message': '' };
  public selectedStartMonth = Moment().format('YYYY-MM');
  public dataEntryCreatorColdef: any = [];
  public creatorStats: any = [];
  public creatorRowData: any[];
  public filterCount = 0;

  constructor(
    private _cd: ChangeDetectorRef,
    private _locationResourceService: LocationResourceService,
    private _providerResourceService: ProviderResourceService,
    private _userService: UserService,
    private _encounterResourceService: EncounterResourceService,
    private route: ActivatedRoute,
    private router: Router,
    private _dataEntryStatisticsService: DataEntryStatisticsService,
    private _visitResourceService: VisitResourceService,
    private _patientProgramService: PatientProgramResourceService,
  ) { }

  public ngOnInit() {
    this.loadFilters();
    this.viewSelected.emit(this.selectedView);
    this.route
      .queryParams
      .subscribe((params) => {
        if (params) {
          this.params = params;
          setTimeout(() => {
            this.loadFilterFromUrlParams(params);
          }, 500);
        }
      }, (error) => {
        console.error('Error', error);
      });
  }

  public ngOnDestroy() { }

  public ngAfterViewInit(): void {
    this._cd.detectChanges();
  }

  public loadFilters() {
    this.getLocations();
    this.getVisits();
    this.getDataEntryEncounterTypes();

  }
  public getProgramVisitsConfig() {
    return new Promise((resolve, reject) => {

      this._patientProgramService.getAllProgramVisitConfigs().pipe(
      take(1))
      .subscribe((programVisits) => {
        if (programVisits) {
          this.processGetVisits(programVisits);
          resolve('success');
        }
      });

    });
  }

  public loadFilterFromUrlParams(params) {
    if (params.startDate && params.view) {
      const newParams: any = {
        'view': '',
        'locationUuids': [],
        'startDate': '',
        'endDate': '',
        'encounterTypeUuids': [],
        'providerUuid': [],
        'visitTypeUuids' : [],
        'groupBy': []
      };

      if (params.view) {
        this.view = [];
        const views = this.loadFilterFromMap(params.view, this.viewMap);
        this.view = views;
        newParams.view = params.view;
        this.toggleSelectedView(params.view);
      }
      if (params.locationUuids) {
        this.location = [];
        const locations = this.loadFilterFromMap(params.locationUuids, this.locationMap);
        this.location = locations;
        newParams.locationUuids = params.locationUuids;
      }
      if (params.startDate) {
        this.selectedStartDate = params.startDate;
        newParams.startDate = params.startDate;
      }
      if (params.endDate) {
        this.selectedEndDate = params.endDate;
        newParams.endDate = params.endDate;
      }
      if (params.encounterTypeUuids) {
        this.encounterType = [];
        const encounterTypes =
          this.loadFilterFromMap(params.encounterTypeUuids, this.encounterMap);
        this.encounterType = encounterTypes;
        newParams.encounterTypeUuids = params.encounterTypeUuids;
      }
      if (params.visitTypeUuids) {
        this.visitType = [];
        const visitTypes =
          this.loadFilterFromMap(params.visitTypeUuids, this.visitMap);
        this.visitType = visitTypes;
        newParams.visitTypeUuids = params.visitTypeUuids;
      }

      if (params.groupBy) {
        newParams.groupBy = params.groupBy;
      }
      if (params.subType) {
        newParams.subType = params.subType;
        this.subType = params.subType;
      }
      if (params.providerUuid) {
        this.provider = '';
        this.selectedProviderUuid = '';
        this.providers = [];
        newParams.providerUuid = params.providerUuid;
        this.loadProvider(params.providerUuid);
      }
      if (params.creatorUuid) {
        this.creator = [];
        this.selectedCreatorUuid = [];
        this.creators = [];
        newParams.creatorUuid = params.creatorUuid;
        this.loadCreator(params.creatorUuid);
      }

      this.filterParams.emit(newParams);
    }

  }

  public isString(value) {
    if (typeof value === 'string') {
      return true;
    } else {
      return false;
    }
  }

  public loadFilterFromMap(values: any, map) {
    const filterArray = [];

    if (this.isString(values)) {
      const selectedType = map.get(values);
      filterArray.push(selectedType);

    } else {
      for (const value of values) {
        const selectedType = map.get(value);
        filterArray.push(selectedType);
      }

    }

    return filterArray;

  }

  public loadProvider(providerUuid) {

    this._providerResourceService.getProviderByUuid(providerUuid).pipe(
      take(1)).subscribe((provider) => {
        this.provider = provider.display;
        this.selectedProviderUuid = provider.uuid;
      });

  }
  public loadCreator(creatorUuids) {

    const isString = this.isString(creatorUuids);
    const creatorArray = [];

    if (!isString) {

      _.each(creatorUuids, (creatorUuid) => {
        this._userService.getUserByUuid(creatorUuid).pipe(
          take(1)).subscribe((result) => {
            const specificCreator = {
              'id': result.uuid,
              'itemName': result.person.display
            };

            creatorArray.push(specificCreator);
          });
      });

    } else {

      this._userService.getUserByUuid(creatorUuids).pipe(
        take(1)).subscribe((result) => {
          const specificCreator = {
            'id': result.uuid,
            'itemName': result.person.display
          };

          creatorArray.push(specificCreator);
        });

    }

    this.creator = creatorArray;
    this.creators = creatorArray;

  }

  public getDataEntryEncounterTypes() {
    this._dataEntryStatisticsService
      .getDataEntryStatisticsTypes().pipe(
        take(1)).subscribe((result) => {
          if (result) {
            const viewTypes = result;
            this.processViewTypes(viewTypes);
          }
        });
  }

  public getLocations() {
    this._locationResourceService.getLocations().pipe(
      take(1)).subscribe((result) => {
        const locations = result;
        this.processLocations(locations);
      });

  }

  public getVisits() {
    this._visitResourceService.getVisitTypes(this.params).pipe(take(1)).subscribe((visitTypes: any) => {
        if (visitTypes) {
          this.getVisitNames(visitTypes);
        }
    });
  }

  public getVisitNames(visitTypes) {
    _.each(visitTypes, (visitType: any) => {
        this.visitNamesMap.set(visitType.uuid, visitType.display);
    });
    this.getProgramVisitsConfig();
  }

  public  processGetVisits(programVisits) {
    const visitTypesArray = [];

    _.each(programVisits, (program: any) => {
      const visitTypes = program.visitTypes;
      _.each(visitTypes, (visitType) => {
          const encounterTypes = visitType.encounterTypes;
          const visitName = this.visitNamesMap.get(visitType.uuid);
          if (visitName) {

            const specificVisitType = {
              'id': visitType.uuid,
              'itemName': this.visitNamesMap.get(visitType.uuid)
            };
            this.visitMap.set(visitType.uuid, specificVisitType);
            this.visitEncounterMap.set(visitType.uuid, encounterTypes);
            visitTypesArray.push(specificVisitType);
            this.processEncounterTypes(encounterTypes);

          }
      });
    });
    this.visitTypes = _.uniqBy(visitTypesArray, 'id');

  }
  public creatorSelect($event) {
    this.loadSelectedCreator();
  }

  public creatorDeselect($event) {
    this.loadSelectedCreator();
  }

  public loadSelectedCreator() {

    const creatorArray = [];
    this.selectedCreatorUuid = [];
    _.each(this.creator, (creator: any) => {
      creatorArray.push(creator.id);
    });

    this.selectedCreatorUuid = creatorArray;

  }

  public processViewTypes(viewTypes) {
    const viewsArray = [];

    _.each(viewTypes, (view: any) => {
      const specificView = { id: view.id, itemName: view.subType };
      this.viewMap.set(view.id, specificView);
      viewsArray.push(specificView);
    });
    this.views = viewsArray;
  }

  public processLocations(locations) {

    const locationArray = [];
    _.each(locations, (location: any) => {
      const specificLocation = { id: location.uuid, itemName: location.display };
      this.locationMap.set(location.uuid, specificLocation);
      locationArray.push(specificLocation);
    });

    this.locations = locationArray;

  }

  public selectView($event: any) {
    this.resetViews();
    const view = $event.id;
    this.toggleViewParams(view);
    this.selectedViewType = view;
    this.showFilters = true;
    this.filterReset.emit(true);
  }

  public locationSelect($event) {
    this.loadSelectedLocation();
  }
  public resetLocations() {
    this.location = [];
    this.loadSelectedLocation();
  }
  public locationDeselect($event) {
    this.loadSelectedLocation();
  }
  public loadSelectedLocation() {
    const locationsArray = this.location;
    this.selectedLocation = [];
    _.each(locationsArray, (locationItem: any) => {
      this.selectedLocation.push(locationItem.id);
    });
  }


  public processEncounterTypes(encounterArray) {
    const encounterTypesArray = [];

    _.each(encounterArray, (encounterType: any) => {
      const specificEncounterType = {
        'id': encounterType.uuid,
        'itemName': encounterType.display
      };
      this.encounterMap.set(encounterType.uuid, specificEncounterType);
      encounterTypesArray.push(specificEncounterType);
    });

    this.encounterTypes = _.uniqBy(encounterTypesArray, 'id');

  }
  public loadEncountersFromVisit() {
    const encounterTypes = [];
     _.each(this.visitType, (visitType) => {
          const visitEncounterTypes = this.visitEncounterMap.get(visitType.id);
            _.each(visitEncounterTypes, (encounterType) => {
              encounterTypes.push(encounterType);
            });
      });
     this.processEncounterTypes(encounterTypes);

  }

  public encounterTypeSelect($event) {
    this.loadSelectedEncounterType();
  }

  public visitTypeSelect($event) {
    this.encounterType = [];
    this.selectedEncounterTypes = [];
    this.loadSelectedVisitType();
    this.loadEncountersFromVisit();
  }

  public visitTypeDeselect($event) {
    this.visitType = [];
    this.selectedVisitTypes = [];
    this.resetEncounterTypes();
  }
  public removeSelectedEncounterTypeOnVisitDeselect(visitTypeDeselected) {
      const visitEncounters = this.visitEncounterMap.get(visitTypeDeselected);
  }

  public resetEncounterTypes() {
    this.encounterType = [];
    this.loadSelectedEncounterType();
  }
  public resetVisitTypes() {
    this.visitType = [];
    this.loadSelectedVisitType();
  }
  public resetCreators() {
    this.creator = [];
    this.loadSelectedCreator();
  }

  public encounterTypeDeselect($event) {
    this.loadSelectedEncounterType();
  }

  public loadSelectedEncounterType() {
    this.selectedEncounterTypes = [];
    _.each(this.encounterType, (encounter: any) => {
      this.selectedEncounterTypes.push(encounter.id);
    });
  }

  public loadSelectedVisitType() {
    this.selectedVisitTypes = [];
    const selectedVisitTypes = this.visitType;
    _.each(selectedVisitTypes, (visit: any) => {

      this.selectedVisitTypes.push(visit.id);
    });

  }
  public getSelectedStartDate($event) {
    const selectedDate = $event;
    this.selectedEndDate = Moment(selectedDate).add(6, 'days').toISOString();
    this.selectedStartDate = Moment(selectedDate).toISOString();
  }
  public getSelectedEndDate($event) {
    const selectedDate = $event;
    this.selectedEndDate = Moment(selectedDate).toISOString();
  }
  public getSelectedStartMonth($event) {

    const selectedDate = Moment($event).format('YYYY-MM-DD');
    this.selectedStartDate = Moment(selectedDate).startOf('month').toISOString();
    this.selectedEndDate = Moment(this.selectedStartDate).add(12, 'months').toISOString();
  }

  public resetViews() {
    this.selectedView = {
      encounterTypePerDay: false,
      encounterTypePerMonth: false,
      encounterTypePerProvider: false,
      encounterTypePerCreator: false
    };
  }

  public toggleViewParams(view) {
    this.resetFilter();
    this.toggleSelectedView(view);
    switch (view) {
      case 'view1':
        this.selectedStartDate = Moment().format();
        this.selectedEndDate = Moment(this.selectedStartDate).add(6, 'days').format();
        this.subType = 'by-date-by-encounter-type';
        this.groupBy = ['groupByLocationId', 'groupByDate', 'groupByEncounterTypeId'];
        break;
      case 'view2':
        this.selectedStartDate = Moment().startOf('month').toISOString();
        this.selectedEndDate = Moment(this.selectedStartDate).add(12, 'months').format();
        this.subType = 'by-month-by-encounter-type';
        this.groupBy = ['groupByLocationId', 'groupByMonth', 'groupByEncounterTypeId'];
        break;
      case 'view3':
        this.selectedStartDate = Moment().format();
        this.selectedEndDate = Moment(this.selectedStartDate).add(6, 'days').format();
        this.subType = 'by-provider-by-encounter-type';
        this.groupBy = ['groupByLocationId', 'groupByProviderId', 'groupByEncounterTypeId'];
        break;
      case 'view4':
        this.selectedStartDate = Moment().format();
        this.selectedEndDate = Moment(this.selectedStartDate).add(6, 'days').format();
        this.subType = 'by-creator-by-encounter-type';
        this.groupBy = ['groupByLocationId', 'groupByCreatorId', 'groupByEncounterTypeId'];
        break;
      default:
    }

  }

  public toggleSelectedView(view) {

    this.resetViews();
    this.selectedViewType = view;

    switch (view) {
      case 'view1':
        this.selectedView.encounterTypePerDay = true;
        break;
      case 'view2':
        this.selectedView.encounterTypePerMonth = true;
        break;
      case 'view3':
        this.selectedView.encounterTypePerProvider = true;
        break;
      case 'view4':
        this.selectedView.encounterTypePerCreator = true;
        break;
      default:
    }

    this.viewSelected.emit(this.selectedView);

  }

  public viewDeselect($event) {
  }

  public searchProvider(providerSearchTerm) {
    if (providerSearchTerm.length > 3) {
      this._providerResourceService
        .searchProvider(providerSearchTerm).pipe(
          take(1)).subscribe((results) => {
            if (results) {
              this.processProviders(results);
            }
          });

    }
    if (providerSearchTerm.length === 0) {
      this.selectedProviderUuid = '';
    }

  }

  public processProviders(providers) {

    const providersArray = [];

    _.each(providers, (provider: any) => {
      const providerPerson = provider.person;
      if (providerPerson !== null) {
        const specificProvider = {
          'name': provider.display,
          'uuid': provider.uuid
        };

        providersArray.push(specificProvider);

      }
    });

    this.providers = providersArray;

  }

  public selectProvider(provider) {
    this.provider = provider.name;
    this.selectedProviderUuid = provider.uuid;
    this.providers = [];
  }

  public resetProvider() {
    this.provider = '';
    this.selectedProviderUuid = '';
    this.providers = [];

  }

  public searchCreator(creatorSearchTerm) {
    this._userService
      .searchUsers(creatorSearchTerm).pipe(
        take(1)).subscribe((results) => {
          if (results) {
            this.processCreators(results);
          }
        });

  }

  public processCreators(creators) {

    const creatorsArray = [];

    _.each(creators, (creator: any) => {
      const providerPerson = creator.person;
      if (providerPerson !== null) {
        const specificCreator = {
          'itemName': creator.person.display,
          'id': creator.uuid
        };

        creatorsArray.push(specificCreator);

      }
    });

    this.creators = creatorsArray;

  }

  public search() {
    this.sendRequest = true;
    this.setQueryParams();
  }

  public resetDisplayMsg() {

    this.displayMsg = { 'show': false, 'message': '' };

  }

  public setQueryParams() {

    this.params = {
      'groupBy': this.groupBy,
      'locationUuids': this.selectedLocation,
      'creatorUuid': this.selectedCreatorUuid,
      'providerUuid': this.selectedProviderUuid,
      'encounterTypeUuids': this.selectedEncounterTypes,
      'startDate': Moment(this.selectedStartDate).format(),
      'endDate': Moment(this.selectedEndDate).format(),
      'subType': this.subType,
      'visitTypeUuids': this.selectedVisitTypes,
      'view': this.selectedViewType
    };


    const currentParams = this.route.snapshot.queryParams;
    const navigationData = {
      queryParams: this.params,
      replaceUrl: true
    };

    const currentUrl = this.router.url;
    const routeUrl = currentUrl.split('?')[0];
    this.router.navigate([routeUrl], navigationData);

  }

  public hideFilter() {
    this.showFilters = false;
  }

  public showFilter() {
    this.showFilters = true;
  }

  public previousWeek() {
    this.selectedStartDate = Moment(this.selectedStartDate).subtract(7, 'days').format();
    this.selectedEndDate = Moment(this.selectedStartDate).add(6, 'days').format();
    this.search();
  }

  public nextWeek() {
    this.selectedStartDate = Moment(this.selectedStartDate).add(7, 'days').format();
    this.selectedEndDate = Moment(this.selectedStartDate).add(6, 'days').format();
    this.search();
  }

  public previousYear() {
    this.selectedStartDate = Moment(this.selectedStartDate).subtract(12, 'months').format();
    this.selectedEndDate = Moment(this.selectedStartDate).add(11, 'months').format();
    this.search();
  }
  public nextYear() {
    this.selectedStartDate = Moment(this.selectedStartDate).add(12, 'months').format();
    this.selectedEndDate = Moment(this.selectedStartDate).add(11, 'months').format();
    this.search();
  }

  public resetFilter() {
    this.location = [];
    this.encounterType = [];
    this.creator = [];
    this.provider = '';
    this.selectedLocation = [];
    this.selectedCreatorUuid = [];
    this.selectedEncounterTypes = [];
    this.selectedVisitTypes = [];
    this.selectedProviderUuid = '';
    this.visitType = [];
  }

  public resetAll() {
    this.resetFilter();
    this.view = [];
    this.sendRequest = false;
    // this.setQueryParams();
    this.filterReset.emit(true);

  }

}
