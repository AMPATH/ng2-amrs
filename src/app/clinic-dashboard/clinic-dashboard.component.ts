import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clinic-dashboard',
  templateUrl: './clinic-dashboard.component.html',
  styleUrls: ['./clinic-dashboard.component.css']
})
export class ClinicDashboardComponent implements OnInit {
  locationUuid: string;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let locationUuid = params['location_uuid'];
      if (locationUuid) {
        console.log('Set selected location in service updated instance variable for locationUuid')
        this.locationUuid = locationUuid;
      } else {
        console.log('Try get default location or use dropdown then redirect with the new uuid');
      }
    });
  }

}
