import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DynamicRoutesService } from '../shared/services/dynamic-routes.service';


@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {

  constructor(private router: Router, private dynamicRoutesService: DynamicRoutesService) {
    let routes = [
      {
        url: 'patient-dashboard/patient-search',
        label: 'Patient Search',
        icon: 'fa fa-search'
      },
      {
        url: 'patient-dashboard//patient-info',
        label: 'Patient Info',
        icon: 'fa fa-user'
      },
      {
        url: 'patient-dashboard/patient-encounters',
        label: 'Patient Encounters',
        icon: 'fa fa-users'
      }
    ]
    dynamicRoutesService.setRoutes({ key: 'patientDashboard', moduleLabel: "Patient Dashboard", routes: routes });
  }

  ngOnInit() {

  }

}
