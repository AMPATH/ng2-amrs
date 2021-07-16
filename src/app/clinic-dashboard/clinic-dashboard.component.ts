import { take } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
/**
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

import { LocationResourceService } from "../openmrs-api/location-resource.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ClinicDashboardCacheService } from "./services/clinic-dashboard-cache.service";
import { UserDefaultPropertiesService } from "../user-default-properties/user-default-properties.service";
import { LocalStorageService } from "../utils/local-storage.service";
@Component({
  selector: "clinic-dashboard",
  templateUrl: "clinic-dashboard.component.html",
})
export class ClinicDashboardComponent implements OnInit {
  public locationUuid: string;
  public loaderStatus: boolean;
  public locations = [];
  public selectedLocation: any = {};
  public selectingLocation = true;
  public selectedDepartment: any;

  constructor(
    private locationResourceService: LocationResourceService,
    private route: ActivatedRoute,
    private router: Router,
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private userDefaultProperties: UserDefaultPropertiesService,
    private localStorageService: LocalStorageService
  ) {
    this.loaderStatus = false;
  }

  public ngOnInit() {
    this.getLocations();
    this.getUserDepartment();
  }

  public getUserDepartment() {
    let department = this.localStorageService.getItem("userDefaultDepartment");
    if (department === '[""]') {
      department = undefined;
    }
    if (!department) {
      this.router.navigate(["/user-default-properties"]);
    }
    this.selectedDepartment = JSON.parse(department);
  }

  public getLocations() {
    this.loaderStatus = true;
    this.locationResourceService
      .getLocations()
      .pipe(take(1))
      .subscribe(
        (results: any) => {
          this.locations = results.map((location) => {
            return {
              value: location.uuid,
              label: location.display,
            };
          });

          this.route.params.subscribe((params) => {
            setTimeout(() => {
              this.locationUuid = params["location_uuid"];
              if (this.locationUuid) {
                this.resolveSelectedLocationByUuid(this.locationUuid);
                if (this.selectedLocation && this.selectedLocation !== {}) {
                  this.selectingLocation = false;
                }
              } else {
                const userLocation = this.userDefaultProperties.getCurrentUserDefaultLocationObject();
                const department =
                  this.selectedDepartment.length > 0
                    ? this.selectedDepartment[0].itemName.toLowerCase()
                    : "general";
                this.router.navigate([
                  "/clinic-dashboard",
                  userLocation.uuid,
                  department,
                  "daily-schedule",
                ]);
              }
            });
          });
          this.loaderStatus = false;
        },
        (error) => {
          this.loaderStatus = false;
          console.error(error);
        }
      );
  }

  public locationChanged($event) {
    if ($event && $event.value !== this.locationUuid) {
      const splitUrl = this.router.routerState.snapshot.url.split("/");
      splitUrl[2] = $event.value;
      this.clinicDashboardCacheService.clear();
      this.router.navigateByUrl(splitUrl.join("/"));
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
