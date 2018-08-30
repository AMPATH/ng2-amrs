import {
  Component, Output, Input, OnInit, EventEmitter,
  ViewEncapsulation, ChangeDetectorRef, AfterViewInit
} from '@angular/core';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';

@Component({
  selector: 'location-filter',
  templateUrl: './location-filter.component.html',
  styles: [`
    ng-select > div > div.multiple input {
      width: 100% !important;
    }
    .location-filter ng-select > div > div.multiple > div.option {
      color: #fff !important;
      border-color: #357ebd !important;
      flex-shrink: initial;
      background-color: #428bca !important;
    }
    .ng-select .ng-control {
      border-radius: 0;
    }
    .ng-select .ng-arrow-zone {
      display: none;
    }
    .location-filter ng-select>div>div.multiple {
      max-height: 100px;
      overflow: scroll;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class LocationFilterComponent implements OnInit, AfterViewInit {

  public locations: Dictionary<any> = {};
  public counties: any;
  public loading: boolean = false;
  public locationDropdownOptions: Array<any> = [];
  public countyDropdownOptions: Array<any> = [];
  public selectedLocations: any | Array<any>;
  public selectedCounty: string;
  public showReset: boolean = false;
  public allFromCounty: boolean = false;
  public allLocations: boolean = true;

  @Input('disable-county') public disableCounty: boolean;
  @Input('multiple') public multiple: boolean;
  @Input('showLabel') public showLabel: boolean = true;
  @Input() public county: string;
  @Output() public onLocationChange = new EventEmitter<any>();

  public _locationUuids: any;
  @Input()
  public get locationUuids(): any {
    return this._locationUuids;
  }

  public set locationUuids(v: any | Array<any>) {
    if (v) {
      this.selectedLocations = v;
      this._locationUuids = v;
    }

  }

  private _programLocations: Array<any> = [];
  @Input()
  public get programLocations(): any {
    return this._programLocations;
  }

  public set programLocations(v: any | Array<any>) {
    if (v) {
      this._programLocations = v;
      if ( v.length > 0) {
        this.resetLocations();
        this.locationDropdownOptions = v.map((location) => {
          return {
            value: location.uuid,
            label: location.display
          };
      });
      }
    }else {
      this.locationDropdownOptions = this.allEncounterLocations;
    }
  }
private allEncounterLocations: Array<any> = [];
  constructor(private locationResourceService: LocationResourceService,
              private cd: ChangeDetectorRef) {
  }

  public ngOnInit() {
    if (this.county) {
      this.selectedCounty = this.county;
    }
    if (this.locationUuids) {
        this.selectedLocations = this.locationUuids;
    }
    this.resolveLocationDetails();
  }

  public ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  public onLocationSelected(locations: any | Array<any>) {
    this.selectedLocations = locations;
    this.getCountyByLocations().then((county) => {
      this.selectedCounty = county ? county : 'N/A';
      if (!_.isNil(this.selectedCounty) && this.selectedCounty !== 'N/A') {
        this.getLocationsByCounty().then((countyLocations) => {
          if (locations && _.isArray(locations) && locations.length < countyLocations.length) {
            this.allFromCounty = true;
            this.showReset = false;
            this.allLocations = false;
          } else if (locations && locations.length === countyLocations.length) {
            this.allFromCounty = false;
          }
        });
      } else if (locations && _.isArray(locations) && locations.length === 0) {

        this.showReset = false;
        this.allFromCounty = false;
        this.allLocations = true;

      }
      this.onLocationChange.emit({
        locations: this.selectedLocations,
        county: this.selectedCounty
      });
    });
  }

  public onCountyChanged(county: string) {
    this.showReset = true;
    this.allLocations = false;
    this.getLocationsByCounty().then((locations) => {
      this.selectedLocations = _.map(locations, (location: any) => {
        return {
          value: location.uuid,
          label: location.display
        };
      });
      this.onLocationChange.emit({
        locations: this.selectedLocations,
        county: this.selectedCounty
      });
    });
  }

  public resolveLocationDetails(): void {
    this.loading = true;
    this.locationResourceService.getLocations().subscribe((locations: any[]) => {
      let locs = locations.map((location) => {
        return {
          value: location.uuid,
          label: location.display
        };
      });
      this.locationDropdownOptions = locs;
      this.allEncounterLocations = locs;
      this.counties = _.groupBy(locations, 'stateProvince');
      this.countyDropdownOptions = _.compact(_.keys(this.counties));
      _.each(locations, (location) => {
        let details = {
          uuid: location.uuid,
          district: location.countyDistrict ? location.countyDistrict : 'N/A',
          county: location.stateProvince ? location.stateProvince : 'N/A',
          facility: location.name,
          facilityName: location.name
        };
        this.locations[location.uuid] = details;
      });
      if (this.county) {
        this.onCountyChanged(this.selectedCounty);
      }
      if (this.locationUuids) {
        this.onLocationSelected(this.selectedLocations);
      }
      this.loading = false;
    }, (error: any) => {
      console.log(error);
      this.loading = false;
    }
    );

  }

  public getLocationsByCounty(): Promise<any> {
    return new Promise((resolve) => {
      resolve(_.get(this.counties, this.selectedCounty));
    });
  }

  public getCountyByLocations(): Promise<any> {
    return new Promise((resolve) => {
      // filter the locations
      let filteredCounties = _.filter(this.locations, (location) => {
        let mappedLocations = this.multiple ? _.map(this.selectedLocations, 'value')
          : [this.selectedLocations.value];
        return _.includes(mappedLocations, location.uuid);
      });
      // group them by county
      let groupedByCounty = _.groupBy(filteredCounties, 'county');
      // if more than one county, don't select a county
      if (_.keys(groupedByCounty).length > 1) {
        resolve(null);
      } else {
        // else resolve the county
        resolve(_.first(_.keys(groupedByCounty)));
      }
    });
  }
  public pickAllLocations() {
    this.showReset = true;
    if (this.selectedCounty) {
      this.getLocationsByCounty().then((locations) => {
        this.allFromCounty = false;
        this.selectedLocations = _.map(locations, (location: any) => {
          return {
            value: location.uuid,
            label: location.display
          };
        });
      });

    } else {
      this.allLocations = false;
      this.selectedLocations = this.locationDropdownOptions;
    }
    this.onLocationChange.emit({
      locations: this.selectedLocations,
      county: this.selectedCounty
    });
  }
  public resetLocations() {
    this.showReset = false;
    this.allLocations = true;
    this.selectedCounty = '';
    this.allFromCounty = false;
    this.selectedLocations = [];
    this.onLocationChange.emit(null);
  }
}
