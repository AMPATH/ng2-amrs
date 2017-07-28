import { Component, Output, Input, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import * as _ from 'lodash';
import { Dictionary } from 'lodash';

@Component({
  selector: 'location-filter',
  templateUrl: './location-filter.component.html',
  styles: [`
    ng-select > div > div.multiple > div.option {
      color: #fff !important;
      border-color: #357ebd !important;
      background-color: #428bca !important;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class LocationFilterComponent implements OnInit {
  locations: Dictionary<any> = {};
  counties: any;
  loading: boolean = false;
  locationDropdownOptions: Array<any> = [];
  countyDropdownOptions: Array<any> = [];
  selectedLocations: Array<any> = [];
  selectedCounty: string = '';
  @Input('disable-county') disableCounty: boolean;
  @Input('multiple') multiple: boolean;
  @Input() locationUuids: any;
  @Input() county: string;
  @Output() onLocationChange = new EventEmitter<any>();

  constructor(private locationResourceService: LocationResourceService) {
  }

  ngOnInit() {
    if (this.county) {
      this.selectedCounty = this.county;
    }
    if (this.locationUuids) {
      if (_.isArray(this.locationUuids)) {
        this.selectedLocations = this.locationUuids;
      } else {
        this.selectedLocations = this.locationUuids.split(',');
      }
    }
    this.resolveLocationDetails();
  }

  onLocationSelected(locations: Array<any>) {
    this.selectedLocations = locations;
    this.getCountyByLocations().then((county) => {
      this.selectedCounty = county ? county : '';
      this.onLocationChange.emit({
        locations: this.selectedLocations,
        county: this.selectedCounty
      });
    });
  }

  onCountyChanged(county: string) {
    this.getLocationsByCounty().then((locations) => {
      this.selectedLocations = _.map(locations, 'uuid');
      this.onLocationChange.emit({
        locations: locations,
        county: this.selectedCounty
      });
    });
  }

  resolveLocationDetails(): void {
    this.loading = true;
    this.locationResourceService.getLocations().subscribe((locations: any[]) => {
        this.locationDropdownOptions = locations.map((location) => {
          return {
            value: location.uuid,
            label: location.display
          };
        });
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

  getLocationsByCounty(): Promise<any> {
    return new Promise((resolve) => {
      resolve(_.get(this.counties, this.selectedCounty));
    });
  }

  getCountyByLocations(): Promise<any> {
    return new Promise((resolve) => {
      // filter the locations
      let filteredCounties = _.filter(this.locations, (location) => {
        return _.includes(this.selectedLocations, location.uuid);
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
}
