import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DynamicRoutesService } from '../shared/services/dynamic-routes.service';

//Patient model and service
import { Patient } from './patients';
import { PatientService } from './patient.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css'],
  providers: [PatientService]//added
})
export class PatientDashboardComponent implements OnInit {

  //Handle patients
  patients : Patient[];
  selectedPatient: Patient;

  options = [
    {
      value: 'a',
      label: 'Alpha'
    },
    {
      value: 'b',
      label: 'Beta'
    },
    {
      value: 'c',
      label: 'Gamma'
    }
  ];
  constructor(private router: Router, private route: ActivatedRoute, private dynamicRoutesService: DynamicRoutesService, private patientService: PatientService) {

    this.route.params.forEach((params: Params) => {
      let patientUuid = params['patient_uuid'];
      if (patientUuid) {
        this.setRoutes(patientUuid)
      } else {
        console.log(this.router.routerState);
        this.router.navigate(['/patient-dashboard/patient-search']);
      }
    });
  }

  //Function to fetch patients
  getPatients(): void {
    this.patientService.getPatients().then(patients => this.patients = patients);
  }

  ngOnInit() {
    this.getPatients();//added
  }

  //Assign selectedPatient to patient
  selectPatient(patient: Patient): void {
    this.selectedPatient = patient;
  }


  setRoutes(patientUuid) {
    let routes = [
      {
        url: `patient-dashboard/${patientUuid}/patient-info`,
        label: 'Patient Info',
        icon: 'fa fa-clipboard'
      },
      {
        url: `patient-dashboard/${patientUuid}/patient-encounters`,
        label: 'Patient Encounters',
        icon: 'fa fa-list-ol'
      }
    ]
    this.dynamicRoutesService.setRoutes({
      key: 'patientDashboard',
      moduleLabel: "Patient Dashboard", routes: routes
    });
  }

}
