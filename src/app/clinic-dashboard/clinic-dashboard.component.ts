import { Component, OnInit } from '@angular/core';

import { LocationResourceService } from '../openmrs-api/location-resource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';

@Component({
  selector: 'app-clinic-dashboard',
  templateUrl: './clinic-dashboard.component.html',
  styleUrls: ['./clinic-dashboard.component.css'],

})
export class ClinicDashboardComponent implements OnInit {
  locationUuid: string;
  loaderStatus: boolean;
  locations = [];

  constructor(private locationResourceService: LocationResourceService,
    private route: ActivatedRoute, private router: Router,
    private clinicDashboardCacheService: ClinicDashboardCacheService) {
    this.loaderStatus = false;

  }

  ngOnInit() {
    this.getLocations();
  }

  public getLocations() {
    this.loaderStatus = true;
    this.locationResourceService.getLocations().subscribe((results: any) => {
      this.locations = results.map((location) => {
        return {
          value: location.uuid,
          label: location.display
        };
      });

      this.route.params.subscribe(params => {
        setTimeout(() => {
          this.locationUuid = params['location_uuid'];
          this.clinicDashboardCacheService.setCurrentClinic(params['location_uuid']);
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


}




