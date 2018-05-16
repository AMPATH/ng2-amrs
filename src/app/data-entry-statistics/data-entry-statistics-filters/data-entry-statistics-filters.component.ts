import { Component, OnInit , OnDestroy , AfterViewInit, OnChanges , Output ,
  EventEmitter, Input , ChangeDetectorRef, ViewChild , SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { LocationResourceService } from
'../../openmrs-api/location-resource.service';
import { ProviderResourceService } from '../../openmrs-api/provider-resource.service';
import { UserService } from '../../openmrs-api/user.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { DataEntryStatisticsService } from
'../../etl-api/data-entry-statistics-resource.service';

@Component({
  selector: 'data-entry-statistics-filters',
  templateUrl: './data-entry-statistics-filters.component.html',
  styleUrls: ['./data-entry-statistics-filters.component.css']
})
export class DataEntryStatisticsFiltersComponent
  implements OnInit , OnDestroy , AfterViewInit {

  @Output() public filterParams: any = new EventEmitter<string>();
  @Output() public viewSelected: any = new EventEmitter<string>();
  @Output() public filterReset: any = new EventEmitter<boolean>();
  public sendRequest: boolean = true;
  public params: any  = [];
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
  public showFilters: boolean = true;
  public locations: any  = [];
  public location: any = [];
  public filtersCount: number = 0;
  public locationMap = new Map();
  public creators: any [];
  public creator: any = [];
  public encounterType: any = [];
  public encounterTypes: any = [];
  public encounterMap = new Map();
  public providers: any  = [];
  public provider: string = '';
  public selectedStartDate: any = Moment().format();
  public selectedEndDate: any =  Moment(this.selectedStartDate).add(6, 'days' ).format();
  public subType: string = '';
  public groupBy: any = ['groupByDate', 'groupByEncounterTypeId'];
  public selectedLocation: any = [];
  public selectedCreatorUuid: any = [];
  public selectedProviderUuid: string = '';
  public selectedEncounterTypes: any = [];
  public selectedView = {
    encounterTypePerDay: false,
    encounterTypePerMonth: false,
    encounterTypePerProvider: false,
    encounterTypePerCreator: false
  };
  public selectedViewType: string = '';
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
    enableCheckAll : false
  };

  public multpleSelectDropDownSettings: any = {
    singleSelection: false,
    text: 'Select or enter to search',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    enableCheckAll : false,
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
  public filterCount: number  = 0;

  constructor(
    private _cd: ChangeDetectorRef,
    private _locationResourceService: LocationResourceService,
    private _providerResourceService: ProviderResourceService,
    private _userService: UserService,
    private _encounterResourceService: EncounterResourceService,
    private route: ActivatedRoute,
    private router: Router,
    private _dataEntryStatisticsService: DataEntryStatisticsService,
  ) {}

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

  public ngOnDestroy() {}

  public ngAfterViewInit(): void {
    this._cd.detectChanges();
  }

  public loadFilters() {
    this.getLocations();
    this.getDataEntryEncounterTypes();
    this.getEncounterTypes();

  }

  public loadFilterFromUrlParams(params) {

    if (params.startDate && params.view) {

              let newParams: any = {
                'view': '',
                'locationUuids': [],
                'startDate': '',
                'endDate': '',
                'encounterTypeUuids': [],
                'providerUuid': [],
                'groupBy': []
              };

              if (params.view) {
                    this.view = [];
                    let views = this.loadFilterFromMap(params.view, this.viewMap);
                    this.view = views;
                    newParams.view = params.view;
                    this.toggleSelectedView(params.view);
              }
              if (params.locationUuids) {
                  this.location = [];
                  let locations = this.loadFilterFromMap(params.locationUuids, this.locationMap);
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
                  let encounterTypes =
                  this.loadFilterFromMap(params.encounterTypeUuids, this.encounterMap);
                  this.encounterType = encounterTypes;
                  newParams.encounterTypeUuids = params.encounterTypeUuids;
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

  public loadFilterFromMap(values: any , map) {
    let filterArray = [];

    if (this.isString(values)) {
      let selectedType = map.get(values);
      filterArray.push(selectedType);

      }else {
        for (let value of values){
          let selectedType = map.get(value);
          filterArray.push(selectedType);
        }

      }

    return filterArray;

  }

  public loadProvider(providerUuid) {

    this._providerResourceService.getProviderByUuid(providerUuid)
    .subscribe((provider) => {
         this.provider = provider.display;
         this.selectedProviderUuid = provider.uuid;
    });

  }

  public loadCreator(creatorUuids) {

    let isString = this.isString(creatorUuids);
    let creatorArray = [];

    if (!isString) {

      _.each(creatorUuids, (creatorUuid) => {
         this._userService.getUserByUuid(creatorUuid)
         .subscribe((result) => {
            let specificCreator = {
               'id': result.uuid,
               'itemName': result.person.display
            };

            creatorArray.push(specificCreator );
         });
    });

    } else {

      this._userService.getUserByUuid(creatorUuids)
         .subscribe((result) => {
            let specificCreator = {
               'id': result.uuid,
               'itemName': result.person.display
            };

            creatorArray.push(specificCreator );
         });

    }

    this.creator = creatorArray;
    this.creators = creatorArray;

  }

  public getDataEntryEncounterTypes() {
    this._dataEntryStatisticsService
      .getDataEntryStatisticsTypes()
      .subscribe((result) => {
        if (result) {
          let viewTypes = result;
          this.processViewTypes(viewTypes);
        }
      });
  }

  public getLocations() {
    this._locationResourceService.getLocations()
    .subscribe((result) => {
         let locations = result;
         this.processLocations(locations);
    });

  }

  public creatorSelect($event) {
    this.loadSelectedCreator();
  }

  public creatorDeselect($event) {
    this.loadSelectedCreator();
  }

  public loadSelectedCreator() {

    let creatorArray = [];
    this.selectedCreatorUuid = [];
    _.each(this.creator, (creator: any) => {
          creatorArray.push(creator.id);
    });

    this.selectedCreatorUuid = creatorArray;

  }

  public processViewTypes(viewTypes) {
    let viewsArray = [];

    _.each(viewTypes, (view: any) => {
      let specificView = { id: view.id, itemName: view.subType };
      this.viewMap.set(view.id, specificView);
      viewsArray.push(specificView);
    });
    this.views = viewsArray;
  }

  public processLocations(locations) {

    let locationArray = [];
    _.each(locations, (location: any) => {
      let specificLocation = { id: location.uuid, itemName: location.display };
      this.locationMap.set(location.uuid, specificLocation);
      locationArray.push(specificLocation);
    });

    this.locations = locationArray;

  }

  public selectView($event: any) {
    this.resetViews();
    let view = $event.id;
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
       let locationsArray = this.location;
       this.selectedLocation = [];
       _.each(locationsArray, (locationItem: any) => {
           this.selectedLocation.push(locationItem.id);
       });
  }

  public getEncounterTypes() {
    let encounters = this._encounterResourceService.getEncounterTypes('all')
    .subscribe((results) => {
      if (results) {
            this.processEncounterTypes(results);
      }
    });
  }

  public processEncounterTypes(encounterTypes) {

    let encounterTypesArray = [];

    _.each(encounterTypes, (encounterType: any) => {
         let specificEncounterType = {
             'id': encounterType.uuid,
             'itemName': encounterType.display
         };
         this.encounterMap.set(encounterType.uuid, specificEncounterType);
         encounterTypesArray.push(specificEncounterType);
    });

    this.encounterTypes = encounterTypesArray;

  }

  public encounterTypeSelect($event) {
     this.loadSelectedEncounterType();
  }
  public resetEncounterTypes() {
    this.encounterType = [];
    this.loadSelectedEncounterType();
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

  public getSelectedStartDate($event) {
      let selectedDate = $event;
      this.selectedEndDate = Moment(selectedDate).add(6, 'days' ).toISOString();
      this.selectedStartDate = Moment(selectedDate).toISOString();
  }
  public getSelectedEndDate($event) {
      let selectedDate = $event;
      this.selectedEndDate = Moment(selectedDate).toISOString();
  }
  public getSelectedStartMonth($event) {

    let selectedDate = Moment($event).format('YYYY-MM-DD');
    this.selectedStartDate = Moment(selectedDate).startOf('month').toISOString();
    this.selectedEndDate = Moment(this.selectedStartDate).add(12, 'months' ).toISOString();
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
        this.selectedEndDate = Moment(this.selectedStartDate).add(6, 'days' ).format();
        this.subType = 'by-date-by-encounter-type';
        this.groupBy = ['groupByDate', 'groupByEncounterTypeId'];
        break;
      case 'view2':
        this.selectedStartDate = Moment().startOf('month').toISOString();
        this.selectedEndDate = Moment(this.selectedStartDate).add(12, 'months' ).format();
        this.subType = 'by-month-by-encounter-type';
        this.groupBy = ['groupByMonth', 'groupByEncounterTypeId'];
        break;
      case 'view3':
        this.selectedStartDate = Moment().format();
        this.selectedEndDate = Moment(this.selectedStartDate).add(6, 'days' ).format();
        this.subType = 'by-provider-by-encounter-type';
        this.groupBy = ['groupByProviderId', 'groupByEncounterTypeId'];
        break;
      case 'view4':
        this.selectedStartDate = Moment().format();
        this.selectedEndDate = Moment(this.selectedStartDate).add(6, 'days' ).format();
        this.subType = 'by-creator-by-encounter-type';
        this.groupBy = ['groupByCreatorId', 'groupByEncounterTypeId'];
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
       .searchProvider(providerSearchTerm)
       .subscribe((results) => {
         if (results) {
            this.processProviders(results);
         }
       });

      }
     if (providerSearchTerm.length === 0 ) {
          this.selectedProviderUuid = '';
      }

  }

  public processProviders(providers) {

      let providersArray = [];

      _.each(providers, (provider: any) => {
         let providerPerson = provider.person;
         if (providerPerson !== null) {
           let specificProvider = {
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
      .searchUsers(creatorSearchTerm)
      .subscribe((results) => {
        if (results) {
           this.processCreators(results);
        }
      });

  }

  public processCreators(creators) {

    let creatorsArray = [];

    _.each(creators, (creator: any) => {
       let providerPerson = creator.person;
       if (providerPerson !== null) {
         let specificCreator = {
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

  this.displayMsg = { 'show': false , 'message': ''};

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
      'view': this.selectedViewType
    };

    const currentParams = this.route.snapshot.queryParams;
    let navigationData = {
        queryParams: this.params,
        replaceUrl: true
    };

    let currentUrl = this.router.url;
    let routeUrl = currentUrl.split('?')[0];
    this.router.navigate([routeUrl], navigationData);

}

public hideFilter() {
  this.showFilters = false;
}

public showFilter() {
  this.showFilters = true;
}

public previousWeek() {
  this.selectedStartDate = Moment(this.selectedStartDate).subtract(7, 'days' ).format();
  this.selectedEndDate = Moment(this.selectedStartDate).add(6, 'days' ).format();
  this.search();
}

public nextWeek() {
  this.selectedStartDate = Moment(this.selectedStartDate).add(7, 'days' ).format();
  this.selectedEndDate = Moment(this.selectedStartDate).add(6, 'days' ).format();
  this.search();
}

public previousYear() {
   this.selectedStartDate = Moment(this.selectedStartDate).subtract(12, 'months' ).format();
   this.selectedEndDate = Moment(this.selectedStartDate).add(11, 'months' ).format();
   this.search();
}
public nextYear() {
  this.selectedStartDate = Moment(this.selectedStartDate).add(12, 'months' ).format();
  this.selectedEndDate = Moment(this.selectedStartDate).add(11, 'months' ).format();
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
  this.selectedProviderUuid = '';
}

public resetAll() {
 this.resetFilter();
 this.view = [];
 this.sendRequest = false;
 // this.setQueryParams();
 this.filterReset.emit(true);

}

}
