import { Component, OnInit } from '@angular/core';
/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

import { LocationResourceService } from '../openmrs-api/location-resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';
import { UserDefaultPropertiesService } from
  '../user-default-properties/user-default-properties.service';
@Component({
  selector: 'clinic-dashboard',
  templateUrl: 'clinic-dashboard.component.html'
})
export class ClinicDashboardComponent implements OnInit {

  public locationUuid: string;
  public loaderStatus: boolean;
  public locations = [];
  public selectedLocation: any = {};
  public selectingLocation: boolean = true;

  constructor(private locationResourceService: LocationResourceService,
              private route: ActivatedRoute, private router: Router,
              private clinicDashboardCacheService: ClinicDashboardCacheService,
              private userDefaultProperties: UserDefaultPropertiesService) {
    this.loaderStatus = false;
  }

  public ngOnInit() {
    this.getLocations();
  }

  public getLocations() {
    console.log('clicked');
    this.loaderStatus = true;
    this.locationResourceService.getLocations().subscribe((results: any) => {
      this.locations = results.map((location) => {
        return {
          value: location.uuid,
          label: location.display
        };
      });

      this.route.params.subscribe((params) => {
        setTimeout(() => {
          this.locationUuid = params['location_uuid'];
          if (this.locationUuid) {
            this.resolveSelectedLocationByUuid(this.locationUuid);
            if (this.selectedLocation && this.selectedLocation !== {}) {
              this.selectingLocation = false;
            }
          } else {
            console.log('Location not selected');
            const userLocation = this.userDefaultProperties.getCurrentUserDefaultLocationObject();
            this.router.navigate(['/clinic-dashboard', userLocation.uuid,
              'daily-schedule']);
          }
        });
      });
      this.loaderStatus = false;
    }, (error) => {
      this.loaderStatus = false;
      console.log(error);
    });
  }

  public locationChanged($event) {
    if ($event && $event !== this.locationUuid) {
      let splitUrl = this.router.routerState.snapshot.url.split('/');
      splitUrl[2] = $event;
      this.clinicDashboardCacheService.clear();
      this.router.navigateByUrl(splitUrl.join('/'));
    }
  }

  public resolveSelectedLocationByUuid(locationUuid: string) {
    for (let i = 0; i < this.locations.length; i++) {
      if (this.locations[i].value === locationUuid) {
        this.selectedLocation = this.locations[i];
        break;
      }
    }
  }

}
