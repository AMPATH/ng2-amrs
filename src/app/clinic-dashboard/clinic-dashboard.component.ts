import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';

@Component({
  selector: 'app-clinic-dashboard',
  templateUrl: './clinic-dashboard.component.html',
  styleUrls: ['./clinic-dashboard.component.css']
})
export class ClinicDashboardComponent implements OnInit {
  locationUuid: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dynamicRoutesService: DynamicRoutesService) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let locationUuid = params['location_uuid'];
      if (locationUuid) {
        console.log('Set selected location in service updated instance variable for locationUuid')
        this.locationUuid = locationUuid;
        this.setRoutes(locationUuid);
      } else {
        console.log('Try get default location or use dropdown then redirect with the new uuid');
        this.router.navigate(['clinic-dashboard', '1115']);
      }
    });
  }

  locationSelected(uuid: string) {
    console.log('Redirect to location');
  }

  setRoutes(locationUuid) {
    let routes = [
      {
        url: `clinic-dashboard/${locationUuid}/daily-schedule`,
        label: 'Daily Schedule',
        icon: 'fa fa-calendar'
      },
      {
        url: `clinic-dashboard/${locationUuid}/monthly-schedule`,
        label: 'Monthly Schedule',
        icon: 'fa fa-list-ol'
      }
    ];
  }
}
